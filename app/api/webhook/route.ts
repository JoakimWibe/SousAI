import { stripe } from '@/lib/stripe';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request:NextRequest) {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature || '', webhookSecret);
    } catch (err) {
        if (err instanceof Error) {
            return NextResponse.json({error: err.message}, {status:400});
        }
        return NextResponse.json({error: 'Unknown error'}, {status:400});
    }

    let session: Stripe.Checkout.Session | Stripe.Invoice | Stripe.Subscription;

    try {
        switch (event.type) {
            case 'checkout.session.completed': 
                session = event.data.object as Stripe.Checkout.Session;
                await handleCheckoutSessionCompleted(session)
                break
            case 'invoice.payment_failed': 
                session = event.data.object as Stripe.Invoice;
                await handleInvoicePaymentFailed(session)
                break
            case 'customer.subscription.deleted': 
                session = event.data.object as Stripe.Subscription;
                await handleCustomerSubscriptionDeleted(session)
                break
            default:
                console.log('Unhandled event type' + event.type)
        }
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({error: error.message}, {status: 400});
        } else {
            return NextResponse.json({error: 'Unknown error'}, {status: 400});
        }
    }

    return NextResponse.json({});
}

async function handleCheckoutSessionCompleted(session:Stripe.Checkout.Session) {
    const userId = session.metadata?.clerkUserId;

    if (!userId) {
        console.log('No user id.')
        return
    };

    const subscriptionId = session.subscription as string

    if (!subscriptionId) {
        console.log('No subscription id.')
        return
    };

    try {
        await prisma?.account.update({
            where: {userId},
            data: {
                stripeSubscriptionId: subscriptionId,
                subscriptionActive: true,
                subscriptionTier: session.metadata?.planType || null
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('Unknown error', error);
        }
    }
}

async function handleInvoicePaymentFailed(invoice:Stripe.Invoice) {
    const subId = invoice.subscription as string;

    if (!subId) return

    let userId: string | undefined;
    try {
        const account = await prisma.account.findUnique({
            where: {stripeSubscriptionId: subId},
            select: {
                userId: true
            }
        })
        
        if (!account?.userId) {
            console.log('No account found.')
            return
        }

        userId = account.userId;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('Unknown error', error);
        }
        return
    }

    try {
        await prisma.account.update({
            where: {userId: userId},
            data: {
                subscriptionActive: false
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('Unknown error', error);
        }
    }
}

async function handleCustomerSubscriptionDeleted(subscription:Stripe.Subscription) {
    const subId = subscription.id;

    let userId: string | undefined;
    try {
        const account = await prisma.account.findUnique({
            where: {stripeSubscriptionId: subId},
            select: {
                userId: true
            }
        })
        
        if (!account?.userId) {
            console.log('No account found.')
            return
        }

        userId = account.userId;
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('Unknown error', error);
        }
        return
    }

    try {
        await prisma.account.update({
            where: {userId: userId},
            data: {
                subscriptionActive: false,
                stripeSubscriptionId: null,
                subscriptionTier: null
            }
        })
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message);
        } else {
            console.log('Unknown error', error);
        }
    }
}