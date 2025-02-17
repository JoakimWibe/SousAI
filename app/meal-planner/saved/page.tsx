"use client"

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { DatabaseMealPlan, MealPlan } from "@/types/mealPlans.td"
import { Skeleton } from "@/components/ui/skeleton"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

async function getSavedMealPlans(): Promise<MealPlan[]> {
    const response = await fetch('/api/meal-plans')
    const data: DatabaseMealPlan[] = await response.json()
    return data.map((plan) => ({
        ...plan,
        allergies: plan.allergies ? plan.allergies.split(',').map(s => s.trim()) : [],
        cuisines: plan.cuisines ? plan.cuisines.split(',').map(s => s.trim()) : []
    }))
}

async function deleteMealPlan(id: string): Promise<{ error?: string }> {
    const response = await fetch(`/api/meal-plans/${id}`, {
        method: 'DELETE'
    })
    return response.json()
}

function LoadingSkeleton() {
    return (
        <div className="space-y-8">
            <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-4 w-96" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="border-2 border-border">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <Skeleton className="h-8 w-8 rounded-full" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                                <div className="space-y-2">
                                    <Skeleton className="h-3 w-12" />
                                    <Skeleton className="h-4 w-16" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16" />
                                <Skeleton className="h-6 w-16" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default function SavedMealPlansPage() {
    const queryClient = useQueryClient()
    const { data: savedMealPlans, isLoading } = useQuery<MealPlan[]>({
        queryKey: ['savedMealPlans'],
        queryFn: getSavedMealPlans
    })

    const { mutate: handleDeleteMealPlan, isPending: isDeleting } = useMutation({
        mutationFn: deleteMealPlan,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['savedMealPlans'] })
            toast.success('Meal plan deleted successfully')
        },
        onError: () => {
            toast.error('Failed to delete meal plan')
        }
    })

    return (
        <main className='min-h-screen w-full pt-20'>
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-8">
                    {isLoading ? (
                        <LoadingSkeleton />
                    ) : (
                        <>
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div>
                                    <Link href="/meal-planner" className="inline-flex items-center text-muted-foreground hover:text-primary mb-4">
                                        <ChevronLeft className="w-4 h-4 mr-1" />
                                        Back to Generator
                                    </Link>
                                    <h1 className='font-bold text-3xl md:text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                                        Saved Meal Plans
                                    </h1>
                                    <p className="text-muted-foreground mt-2">
                                        View and manage your saved meal plans
                                    </p>
                                </div>
                            </div>

                            {savedMealPlans && savedMealPlans.length > 0 ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {savedMealPlans.map((plan) => (
                                        <Card 
                                            key={plan.id} 
                                            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 border-border hover:border-primary/20 overflow-hidden flex flex-col"
                                        >
                                            <CardHeader className="pb-3 relative">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="bg-primary/10 p-2 rounded-full">
                                                            <CalendarDays className="w-4 h-4 text-primary" />
                                                        </div>
                                                        <span className="text-sm text-muted-foreground">
                                                            {new Date(plan.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button 
                                                                variant="ghost" 
                                                                size="icon"
                                                                className="text-muted-foreground"
                                                                disabled={isDeleting}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Delete Meal Plan</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Are you sure you want to delete this meal plan? This action cannot be undone.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel className="w-full border-primary/20 text-primary hover:bg-background hover:text-primary/70">Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    className="bg-destructive hover:bg-destructive/90"
                                                                    onClick={(e) => {
                                                                        e.preventDefault()
                                                                        handleDeleteMealPlan(plan.id)
                                                                    }}
                                                                    disabled={isDeleting}
                                                                >
                                                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                                <CardTitle>
                                                    <span className="text-lg font-semibold text-foreground">
                                                        {plan.title}
                                                    </span>
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="flex flex-col flex-1">
                                                <div className="flex-1">
                                                    <div className="grid grid-cols-3 gap-4 mb-4">
                                                        <div className="bg-secondary/50 rounded-lg p-3">
                                                            <dt className="text-xs text-muted-foreground mb-1">Calories</dt>
                                                            <dd className="font-semibold text-foreground">{plan.calories} kcal</dd>
                                                        </div>
                                                        <div className="bg-secondary/50 rounded-lg p-3">
                                                            <dt className="text-xs text-muted-foreground mb-1">Proteins</dt>
                                                            <dd className="font-semibold text-foreground">{plan.proteins}g</dd>
                                                        </div>
                                                        <div className="bg-secondary/50 rounded-lg p-3">
                                                            <dt className="text-xs text-muted-foreground mb-1">Persons</dt>
                                                            <dd className="font-semibold text-foreground">{plan.persons}</dd>
                                                        </div>
                                                    </div>
                                                    <div className="mb-3">
                                                        <dt className="text-xs text-muted-foreground mb-2">Diet Type</dt>
                                                        <dd className="flex flex-wrap gap-1">
                                                            <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                                                {plan.dietType || "No preference"}
                                                            </span>
                                                        </dd>
                                                    </div>
                                                    <div className="mb-3">
                                                        <dt className="text-xs text-muted-foreground mb-2">Allergies</dt>
                                                        <dd className="flex flex-wrap gap-1">
                                                            {plan.allergies.length > 0 ? (
                                                                plan.allergies.map((allergy, index) => (
                                                                    <span key={index} className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                                                        {allergy}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                                                    No allergies
                                                                </span>
                                                            )}
                                                        </dd>
                                                    </div>
                                                    <div className="mb-4">
                                                        <dt className="text-xs text-muted-foreground mb-2">Cuisines</dt>
                                                        <dd className="flex flex-wrap gap-1">
                                                            {plan.cuisines.length > 0 ? (
                                                                plan.cuisines.map((cuisine, index) => (
                                                                    <span key={index} className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                                                        {cuisine}
                                                                    </span>
                                                                ))
                                                            ) : (
                                                                <span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                                                                    No preference
                                                                </span>
                                                            )}
                                                        </dd>
                                                    </div>
                                                </div>
                                                <Link href={`/meal-planner/saved/${plan.id}`}>
                                                    <Button className="w-full">View Plan</Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <h2 className="text-lg font-semibold mb-2">No saved meal plans</h2>
                                    <p className="text-muted-foreground mb-4">Generate a meal plan to get started</p>
                                    <Link href="/meal-planner">
                                        <Button>Generate Meal Plan</Button>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </main>
    )
}