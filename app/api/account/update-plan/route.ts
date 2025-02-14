import { currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';
import { getPriceIdFromType } from '@/lib/plans';

export async function POST(request: NextRequest) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser?.id) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

        const { newPlan } = await request.json();

        if (!newPlan) return NextResponse.json({error: 'New plan is required.'}, {status: 400});

        const account = await prisma.account.findUnique({
            where: { userId: clerkUser.id }
        });

        if (!account) return NextResponse.json({error: 'No account found.'}, {status: 404});

        if (!account.stripeSubscriptionId) return NextResponse.json({error: 'No active subscription found.'}, {status: 404});

        const subscriptionId = account.stripeSubscriptionId;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const subscriptionItemId = subscription.items.data[0]?.id;

        if (!subscriptionItemId) return NextResponse.json({error: 'No active subscription found.'}, {status: 404});

        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: false,
            items: [
                {
                    id: subscriptionItemId,
                    price: getPriceIdFromType(newPlan)
                }
            ],
            proration_behavior: 'create_prorations'
        });

        await prisma.account.update({
            where: {userId: clerkUser.id},
            data: {
                subscriptionTier: newPlan,
                stripeSubscriptionId: updatedSubscription.id,
                subscriptionActive: true
            }
        })

        return NextResponse.json({subscription: updatedSubscription}, {status: 200});
    } catch {
        return NextResponse.json({error: 'Internal error.'}, {status: 500});
    }
}