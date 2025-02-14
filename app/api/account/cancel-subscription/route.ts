import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export async function POST() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser?.id) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

        const account = await prisma.account.findUnique({
            where: { userId: clerkUser.id }
        });

        if (!account) return NextResponse.json({error: 'No account found.'}, {status: 404});

        if (!account.stripeSubscriptionId) return NextResponse.json({error: 'No active subscription found.'}, {status: 404});

        const subscriptionId = account.stripeSubscriptionId;

        const canceledSubscription = await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true
        });

        await prisma.account.update({
            where: {userId: clerkUser.id},
            data: {
                subscriptionTier: null,
                stripeSubscriptionId: null,
                subscriptionActive: false
            }
        })

        return NextResponse.json({subscription: canceledSubscription}, {status: 200});
    } catch {
        return NextResponse.json({error: 'Internal error.'}, {status: 500});
    }
}