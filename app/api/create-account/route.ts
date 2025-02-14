import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'

export async function POST() {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser) return NextResponse.json({error: 'User not found in Clerk.'}, {status: 404});

        const email = clerkUser.emailAddresses[0].emailAddress;

        if (!email) return NextResponse.json({error: 'User does not have an email address.'}, {status: 400});

        const existingProfile = await prisma.account.findUnique({
            where: { userId: clerkUser.id },
        });

        if (existingProfile) return NextResponse.json({message: 'Account already exists.'});

        await prisma.account.create({
            data: {
                userId: clerkUser.id,
                email,
                subscriptionTier: null,
                stripeSubscriptionId: null,
                subscriptionActive: false,
            }
        });

        return NextResponse.json({message: 'Account created successfully!'}, {status: 201})
    } catch {
        return NextResponse.json({error: 'Internal server error.'}, {status: 500})
    };
} 