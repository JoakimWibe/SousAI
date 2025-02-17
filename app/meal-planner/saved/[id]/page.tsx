"use client"

import Link from "next/link";
import { ChevronLeft, Users, Utensils, AlertCircle, Calendar, ShoppingCart } from "lucide-react";
import { SaveMealPlanResponse } from "@/types/mealPlans.td";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";


interface PageProps {
    params: Promise<{ id: string }>
}

const weekdayOrder = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
];

async function getSavedMealPlan(id: string): Promise<SaveMealPlanResponse> {
    const response = await fetch(`/api/meal-plans/${id}`)
    const data = await response.json();
    return data;
}

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-8 w-64" />
            <div className="space-y-4">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-20" />
                </div>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
                {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-48" />
                ))}
            </div>
        </div>
    )
}

function MealCard({ title, meal }: { title: string; meal: { name: string; calories: number; protein: number } }) {
    return (
        <div className="p-4 rounded-lg bg-card/50 hover:bg-card/80 transition-colors">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-foreground font-medium">{meal.name}</p>
            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                <span>{meal.calories} cal</span>
                <span className="w-1 h-1 rounded-full bg-muted-foreground"></span>
                <span>{meal.protein}g protein</span>
            </div>
        </div>
    )
}

export default function SavedMealPlanPage({ params }: PageProps) {
    const { id } = React.use<{ id: string }>(params);
    
    const { data: mealPlan, isLoading, isError } = useQuery<SaveMealPlanResponse>({
        queryKey: ['savedMealPlan', id],
        queryFn: () => getSavedMealPlan(id),
    })

    if (isLoading) {
        return (
            <main className='min-h-screen w-full pt-20'>
                <div className="container mx-auto px-4 py-8">
                    <LoadingSkeleton />
                </div>
            </main>
        )
    }

    if (isError) {
        return (
            <main className='min-h-screen w-full pt-20'>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <h2 className="text-2xl font-semibold">An error occurred</h2>
                        <p className="text-muted-foreground">Please try again later.</p>
                        <Link href="/meal-planner/saved" className="text-primary hover:underline">
                            Return to saved plans
                        </Link>
                    </div>
                </div>
            </main>
        )
    }
    
    if (!mealPlan || !mealPlan.days) {
        return (
            <main className='min-h-screen w-full pt-20'>
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center justify-center gap-4 text-center">
                        <AlertCircle className="h-12 w-12 text-destructive" />
                        <h2 className="text-2xl font-semibold">Meal Plan Not Found</h2>
                        <p className="text-muted-foreground">The meal plan you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
                        <Link href="/meal-planner/saved" className="text-primary hover:underline">
                            Return to saved plans
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    const allergiesArray = Array.isArray(mealPlan.allergies) 
        ? mealPlan.allergies 
        : (mealPlan.allergies ? mealPlan.allergies.split(',').map(s => s.trim()).filter(Boolean) : []);

    const cuisinesArray = Array.isArray(mealPlan.cuisines)
        ? mealPlan.cuisines
        : (mealPlan.cuisines ? mealPlan.cuisines.split(',').map(s => s.trim()).filter(Boolean) : []);

    const sortedDays = [...mealPlan.days].sort((a, b) => 
        weekdayOrder.indexOf(a.dayOfWeek) - weekdayOrder.indexOf(b.dayOfWeek)
    );

    return (
        <main className='min-h-screen w-full pt-20'>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
                    <div className="space-y-6">
                        <Link href="/meal-planner/saved" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back to Saved Plans
                        </Link>
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <h1 className='font-bold text-3xl md:text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                                    {mealPlan.title}
                                </h1>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                                <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg">
                                    <Users className="w-4 h-4" />
                                    <span>{mealPlan.persons} {mealPlan.persons === 1 ? 'person' : 'people'}</span>
                                </div>
                                {mealPlan.dietType && (
                                    <div className="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg">
                                        <Utensils className="w-4 h-4" />
                                        <span>{mealPlan.dietType}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {allergiesArray.map((allergy) => (
                                    <Badge key={allergy} variant="destructive">{allergy}</Badge>
                                ))}
                                {cuisinesArray.map((cuisine) => (
                                    <Badge key={cuisine} variant="secondary">{cuisine}</Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {sortedDays.map((day) => (
                            <Card key={day.id} className="overflow-hidden hover:shadow-lg transition-shadow border-border/50">
                                <CardHeader className="border-b border-border/50 bg-card">
                                    <CardTitle className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-primary" />
                                        {day.dayOfWeek}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    <MealCard title="Breakfast" meal={day.breakfast} />
                                    <MealCard title="Lunch" meal={day.lunch} />
                                    <MealCard title="Dinner" meal={day.dinner} />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="overflow-hidden border-border/50">
                        <CardHeader className="border-b border-border/50 bg-card">
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-primary" />
                                Shopping List
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {sortedDays.map((day) => (
                                    <div key={day.id} className="space-y-2">
                                        <h3 className="font-medium text-primary flex items-center gap-2">
                                            <Calendar className="w-4 h-4" />
                                            {day.dayOfWeek}
                                        </h3>
                                        <ul className="space-y-1.5">
                                            {day.shoppingList.map((item) => (
                                                <li key={item.id} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                                                    {item.item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}