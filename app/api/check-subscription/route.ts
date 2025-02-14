import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'

export async function GET(request:NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const userId = searchParams.get('userId')

        if (!userId) return NextResponse.json({error: 'Missing user ID'}, {status: 400});

        const account = await prisma.account.findUnique({
            where: {userId},
            select: {subscriptionActive: true}
        })

        return NextResponse.json({
            subscriptionActive: account?.subscriptionActive
        })
    } catch {
       return NextResponse.json({error: 'Internal server error.'}, {status: 500})
    }
}