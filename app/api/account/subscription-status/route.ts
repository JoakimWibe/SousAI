import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser?.id) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

        const account = await prisma.account.findUnique({
            where: { userId: clerkUser.id },
            select: { subscriptionTier: true }
        });

        if (!account) return NextResponse.json({error: 'No account found.'}, {status: 404});

        return NextResponse.json({subscription: account}, {status: 200});
    } catch {
        return NextResponse.json({error: 'Internal error.'}, {status: 500});
    }
}