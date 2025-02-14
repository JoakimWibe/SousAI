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
import { Loader } from '@/components/ui/loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
        cancelPlanMutation();
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" className="border-4 text-primary" />
            </div>
        )
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-[90%] max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
                        <CardDescription>Please sign in to view your profile.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    return (
        <main className='min-h-screen flex flex-col items-center pt-32 pb-16 w-full gap-10 px-4'>
            <section className="text-center space-y-4 max-w-2xl">
                <h1 className='font-bold text-3xl md:text-4xl lg:text-5xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                    Your Account
                </h1>
                <div className="flex flex-col items-center gap-3">
                    <Avatar className="h-24 w-24">
                        <AvatarImage src={user?.imageUrl} />
                        <AvatarFallback className="text-xl bg-primary/10 text-primary">
                            {user?.fullName?.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h2 className="text-xl font-semibold">{user?.fullName}</h2>
                        <p className="text-muted-foreground">{user?.emailAddresses[0].emailAddress}</p>
                    </div>
                </div>
            </section>

            <section className="w-full max-w-2xl space-y-6">
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-xl">Subscription Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Loader size="md" className="text-primary" />
                            </div>
                        ) : isError ? (
                            <div className="text-primary text-center py-4">{error?.message}</div>
                        ) : subscription ? (
                            <div className="space-y-6">
                                {currentPlan ? (
                                    <div className="space-y-4">
                                        <div className="flex flex-col gap-4">
                                            <div className="bg-primary/10 text-primary rounded-lg px-4 py-3 flex items-center justify-between">
                                                <div>
                                                    <h3 className="font-medium">{currentPlan.name}</h3>
                                                    <p className="text-sm text-primary/80">Active Plan</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-semibold">{currentPlan.currency} {currentPlan.amount}</p>
                                                    <p className="text-sm text-primary/80">per {currentPlan.interval}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="text-xl">No Active Subscription</CardTitle>
                                            <CardDescription>
                                                Subscribe to get access to all premium features
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button 
                                                className="w-full bg-primary hover:bg-primary/90"
                                                onClick={() => router.push('/subscribe')}
                                            >
                                                Get Started
                                            </Button>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-xl">No Active Subscription</CardTitle>
                                    <CardDescription>
                                        Subscribe to get access to all premium features
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Button 
                                        className="w-full bg-primary hover:bg-primary/90"
                                        onClick={() => router.push('/subscribe')}
                                    >
                                        Get Started
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>

                {currentPlan && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Change Plan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Select 
                                onValueChange={(value: string) => setSelectedPlan(value)} 
                                defaultValue={currentPlan?.interval} 
                                disabled={isUpdatePlanPending}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {availablePlans.map((plan, key) => (
                                        <SelectItem key={key} value={plan.interval}>
                                            {plan.name} - {plan.currency}{plan.amount} / {plan.interval}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        className="w-full bg-primary hover:bg-primary/90"
                                        disabled={!selectedPlan || isUpdatePlanPending}
                                    >
                                        {isUpdatePlanPending ? (
                                            <>
                                                <Loader size="sm" className="mr-2" />
                                                Updating Plan...
                                            </>
                                        ) : (
                                            'Save Changes'
                                        )}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to change your plan?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will update your subscription and billing will be adjusted accordingly.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleUpdatePlan}>
                                            Confirm Change
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                )}

                {currentPlan && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl">Cancel Subscription</CardTitle>
                            <CardDescription>
                                Cancel your subscription and lose access to premium features
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button 
                                        variant="outline"
                                        className="w-full border-primary/20 text-primary hover:bg-background hover:text-primary/70"
                                        disabled={isCancelingPlanPending}
                                    >
                                        {isCancelingPlanPending ? (
                                            <>
                                                <Loader size="sm" className="mr-2" />
                                                Canceling Subscription...
                                            </>
                                        ) : (
                                            'Cancel Subscription'
                                        )}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to cancel your subscription?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will immediately end your subscription and you will lose access to all premium features. This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
                                        <AlertDialogAction 
                                            onClick={handleCancelPlan}
                                            className="bg-primary hover:bg-primary/90"
                                        >
                                            Yes, Cancel Subscription
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </CardContent>
                    </Card>
                )}
            </section>
        </main>
    )
}