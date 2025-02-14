"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { availablePlans } from '@/lib/plans';
import { useUser } from '@clerk/nextjs';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

async function fetchSubscriptionStatus() {
    const response = await fetch('/api/account/subscription-status');
    return response.json();
}

async function updatePlan(newPlan: string) {
    const response = await fetch('/api/account/update-plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({newPlan})
    })
    return response.json();
}

async function cancelPlan() {
    const response = await fetch('/api/account/cancel-subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    return response.json();
}

export default function AccountPage() {
    const [selectedPlan, setSelectedPlan] = useState<string>('');
    const {isLoaded, isSignedIn, user} = useUser();
    const queryClient = useQueryClient();
    const router = useRouter();
    const {data: subscription, isLoading, isError, error, refetch } = useQuery({
        queryKey: ['subscription'], 
        queryFn: fetchSubscriptionStatus,
        enabled: isLoaded && isSignedIn,
        staleTime: 5 * 60 * 1000,

    });

    const { mutate:updatePlanMutation, isPending:isUpdatePlanPending } = useMutation({
        mutationFn: updatePlan,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['subscription']});
            toast.success ('Subscription plan updated successfully!');
            refetch();
        },
        onError: () => {
            toast.error ('Error updating subscription plan. Try again or contact support if error persists.')
        }
    }) 

    const { mutate:cancelPlanMutation, isPending:isCancelingPlanPending } = useMutation({
        mutationFn: cancelPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['subscription']})
            router.push('/subscribe');
        },
        onError: () => {
            toast.error ('Error canceling subscription plan. Try again or contact support if error persists.')
        }
    })

    const currentPlan = availablePlans.find((plan) => plan.interval === subscription?.subscription.subscriptionTier);

    function handleUpdatePlan() {
        if (selectedPlan) {
            updatePlanMutation(selectedPlan)
        }

        setSelectedPlan('');
    }

    function handleCancelPlan() {
        if (confirm('Are you sure you want to cancel your subscription? You will lose access to premium features.')) {
            cancelPlanMutation();
        }
    }

    if (!isLoaded) {
        return <div>Loading...</div>
    }

    if (!isSignedIn) {
        return <div>Please sign in to view your profile.</div>
    }

    return (
        <main className='min-h-screen flex flex-col items-center pt-32 w-full gap-10'>
            <section>
                <Avatar>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>JMW</AvatarFallback>
                </Avatar>

                <h1>{user?.fullName}</h1>
                <p>{user?.emailAddresses[0].emailAddress}</p>
            </section>
        
            <section>
                <h2>Subcription details</h2>
                {isLoading ? (
                    <div>Loading subscription details...</div>
                ): isError ? (
                    <div>{error?.message}</div>
                ): subscription ? (
                    <div>
                        <h3>Current plan</h3>
                        {currentPlan ? (
                            <div>
                                <p>Plan: {currentPlan.name}</p>
                                <p>Amount:{currentPlan.currency} {currentPlan.amount}</p>
                                <p>Status: Active</p>
                            </div>
                        ): (
                            <p>Current plan not found.</p>
                        )}
                    </div>
                ): (
                    <p>You are not subscribed to any plan.</p>
                )}
            </section>
            
            <section>
                <h3>Change subscription plan</h3>
                {currentPlan && (
                    <>
                        <Select onValueChange={(value: string) => setSelectedPlan(value)} defaultValue={currentPlan?.interval} disabled={isUpdatePlanPending}>
                            <SelectTrigger className="w-fit">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {availablePlans.map((plan, key) => (
                                    <SelectItem key={key} value={plan.interval}>{plan.name} - NOK{plan.amount} / {plan.interval}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Button onClick={handleUpdatePlan}>Save Change</Button>
                        {isUpdatePlanPending && (
                            <div>Updating plan...</div>
                        )}
                    </>
                )}
            </section>

            <section>
                <h3>Cancel subscription</h3>
                <Button onClick={handleCancelPlan} disabled={isCancelingPlanPending}>{isCancelingPlanPending ? 'Canceling subscription...' : 'Cancel Subscription'}</Button>
            </section>
        </main>
    )
}