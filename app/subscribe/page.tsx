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
        <main className='min-h-screen flex flex-col items-center pt-32 w-full gap-10 px-4'>
            <section className="text-center space-y-4 max-w-2xl">
                <h1 className='font-bold text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                    Choose Your Perfect Plan
                </h1>
                <p className='text-lg text-muted-foreground'>
                    Get personalized meal plans tailored to your preferences and goals
                </p>
            </section>

            <section className='w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {availablePlans.map((plan, key) => (
                    <Card 
                        key={key} 
                        className={`relative h-[450px] transition-all duration-200 hover:border-primary/50 ${plan.isPopular ? 'border-primary shadow-lg' : ''}`}
                    >
                        {plan.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary px-3 py-1 rounded-full text-primary-foreground text-sm font-medium flex items-center gap-1.5">
                                Most Popular <Flame className="h-4 w-4" />
                            </div>
                        )}
                        <CardHeader className="text-center pb-2">
                            <CardTitle className="text-xl mb-4">{plan.name}</CardTitle>
                            <div className="flex items-end justify-center gap-1">
                                <span className="text-4xl font-bold">{plan.currency}{plan.amount}</span>
                                <span className="text-muted-foreground mb-1">/{plan.interval}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className='text-muted-foreground text-center'>{plan.description}</p>
                            <ul className="space-y-3">
                                {plan.features.map((feature, key) => (
                                    <li key={key} className="flex items-start gap-2">
                                        <span className="bg-primary/10 text-primary rounded-full p-0.5 mt-0.5">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        </span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter className="absolute bottom-6 left-6 right-6">
                            <Button 
                                onClick={() => handleSubscribe(plan.interval)} 
                                disabled={isPending} 
                                className={`w-full ${plan.isPopular ? 'bg-primary hover:bg-primary/90' : ''}`}
                            >
                                {isPending ? 'Please wait...' : `Get ${plan.name}`}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </section>
        </main>
    )
}