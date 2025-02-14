"use client"

import { availablePlans } from '@/lib/plans';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Flame } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from "sonner"

type SubscribeResponse = {
    url: string
};

type SubscribeError = {
    error: string
};

async function subscribeToPlan(planType: string, userId: string, email: string): Promise<SubscribeResponse> {
    const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            planType,
            userId,
            email
        }) 
    })

    if (!response.ok) {
        const errorData: SubscribeError = await response.json()
        throw new Error(errorData.error || 'Something went wrong')
    }

    const data: SubscribeResponse = await response.json();

    return data;
}

export default function SubscribePage() {
    const { user } = useUser();
    const router = useRouter();
    const userId = user?.id;
    const email = user?.emailAddresses[0].emailAddress || '';
    const { mutate, isPending } = useMutation<SubscribeResponse, Error, {planType: string}> ({
        mutationFn: async ({planType} ) => {
            if (!userId) {
                throw new Error('User not signed in.')
            }

            return subscribeToPlan(planType, userId, email)
        },
        onMutate: () => {
            toast.loading('Processing your subscription...')
        },
        onSuccess: (data) => {
            window.location.href = data.url
        },
        onError: () => {
            toast.error('Something went wrong.')
        }
    });

    function handleSubscribe(planType: string) {
        if (!userId) {
            router.push('/sign-up')
            return
        }

        mutate({planType})
    }

    return (
        <main className='min-h-screen flex flex-col items-center pt-32 w-full gap-10'>
            <section className="text-center space-y-2">
                <h1 className='font-bold text-2xl md:text-3xl'>Our Pricing Plans</h1>
                <p>
                    Select the best plan that fits your needs.
                </p>
            </section>

            <section className='mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 m-4'>
                {availablePlans.map((plan, key) => (
                    <Card className='h-[400px]' key={key}>
                        <CardHeader>
                            <div className={`flex items-center gap-2 mb-4 ${!plan.isPopular ? 'invisible' : ''}`}>Popular <Flame /></div>
                            <CardTitle>{plan.name}</CardTitle>
                            <h2 className="text-2xl font-bold">{plan.currency}{plan.amount}/{plan.interval}</h2>
                        </CardHeader>
                        <CardContent>
                            <p className='mb-4 min-h-12'>{plan.description}</p>
                            <ul className="list-disc list-inside space-y-2">
                                {plan.features.map((feature, key) => (
                                    <li key={key}>{feature}</li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button onClick={() => handleSubscribe(plan.interval)} disabled={isPending} className='w-full'>{isPending ? 'Please wait...' : `Subscribe ${plan.name}`}</Button>
                        </CardFooter>
                    </Card>
                ))}
            </section>
        </main>
    )
}