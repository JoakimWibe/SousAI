"use client"

import MealGeneratorForm from '@/components/meal-generator-form';
import { DailyMealPlan, MealPlanInput, MealPlanResponse, SaveMealPlanRequest, SaveMealPlanResponse } from '@/types/mealPlans.td';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

async function generateMealPlan(payload: MealPlanInput) {
    const response = await fetch('/api/generate-meal-plan', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })

    return response.json();
}

async function saveMealPlan(payload: SaveMealPlanRequest): Promise<SaveMealPlanResponse> {
        const response = await fetch('/api/meal-plans', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        return response.json();
}

export default function MealPlannerPage() {
    const [preferences, setPreferences] = useState<MealPlanInput | null>(null);
    const [planTitle, setPlanTitle] = useState(`Meal Plan - ${new Date().toLocaleDateString()}`);
    
    const { mutate, isPending, data, isSuccess } = useMutation<MealPlanResponse, Error, MealPlanInput>({
        mutationFn: generateMealPlan,
        onSuccess: (_, variables) => {
            setPreferences(variables);
        }
    })

    const { mutate: saveMutate, isPending: isSavePending } = useMutation<SaveMealPlanResponse, Error, SaveMealPlanRequest>({
        mutationFn: saveMealPlan,
        onSuccess: () => {
            toast.success('Plan saved successfully!');
            setPreferences(null);
        },
        onError: () => {
            toast.error('Error saving plan. Try again or contact support if error persists.')
        }
    })

    const handleSavePlan = () => {
        if (!data?.mealPlan || !preferences || !planTitle.trim()) return;
        
        const payload: SaveMealPlanRequest = {
            title: planTitle,
            mealPlanData: data.mealPlan,
            preferences: preferences
        }
        
        saveMutate(payload);
    }

    const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const getMealPlanForDay = (day: string): DailyMealPlan | undefined => {
        if (!data?.mealPlan) return undefined
        return data?.mealPlan[day]
    }

    return (
        <main className='min-h-screen w-full pt-20'>
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className='font-bold text-3xl md:text-4xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent'>
                                AI Meal Plan Generator
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                Get personalized meal plans based on your preferences
                            </p>
                        </div>
                        <Button onClick={() => window.location.href = '/meal-planner/saved'}>
                            View Saved Plans
                        </Button>
                    </div>

                    <div className="p-4 border rounded-lg bg-card shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="min-w-2 h-full py-1">
                                <div className="w-1 h-full bg-primary/50 rounded-full" />
                            </div>
                            <p className="text-sm text-card-foreground leading-relaxed">
                                <span className="font-semibold text-primary">Disclaimer:</span> The meal plans generated are suggestions based on the information provided. Always consult with a healthcare professional or registered dietitian before starting any new diet plan, especially if you have specific health conditions, allergies, or dietary restrictions. Calorie and nutritional calculations are approximate.
                            </p>
                        </div>
                    </div>

                    <div className="grid lg:grid-cols-[400px,1fr] gap-8">
                        <aside className="space-y-6">
                            <Card>
                                <CardContent className="pt-6">
                                    <MealGeneratorForm mutate={mutate} isPending={isPending} />
                                </CardContent>
                            </Card>
                        </aside>

                        <div className="space-y-6">
                            {isSuccess && (
                                <div className="flex justify-between items-center gap-2">
                                    <h2 className="text-lg font-semibold">Your Meal Plan</h2>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button disabled={isSavePending}>
                                                {isSavePending ? 'Saving...' : 'Save Plan'}
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Save Meal Plan</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    Enter a title for your meal plan.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <div className="py-4">
                                                <Input
                                                    value={planTitle}
                                                    onChange={(e) => setPlanTitle(e.target.value)}
                                                    placeholder="Enter a title for your meal plan"
                                                />
                                            </div>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel className="w-full border-primary/20 text-primary hover:bg-background hover:text-primary/70">
                                                Cancel
                                                </AlertDialogCancel>
                                                <AlertDialogAction 
                                                    onClick={handleSavePlan}
                                                    disabled={!planTitle.trim() || isSavePending}
                                                >
                                                    {isSavePending ? 'Saving...' : 'Save Plan'}
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            )}
                            {data?.mealPlan && isSuccess ? (
                                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {daysOfTheWeek.map((day, key) => {
                                        const mealplan = getMealPlanForDay(day);
                                        return (
                                            <Card key={key} className="h-full relative overflow-hidden">
                                                <div className="absolute top-0 left-0 w-2 h-full bg-primary/20" />
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="text-lg flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                                        {day}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    {mealplan ? (
                                                        <div className="space-y-4">
                                                            {mealplan.Breakfast && (
                                                                <div className="p-3 rounded-lg">
                                                                    <h3 className="font-medium text-sm text-primary mb-1.5">Breakfast</h3>
                                                                    <p className="text-sm text-muted-foreground leading-relaxed">{mealplan.Breakfast}</p>
                                                                </div>
                                                            )}
                                                            
                                                            {mealplan.Lunch && (
                                                                <div className="p-3 rounded-lg">
                                                                    <h3 className="font-medium text-sm text-primary mb-1.5">Lunch</h3>
                                                                    <p className="text-sm text-muted-foreground leading-relaxed">{mealplan.Lunch}</p>
                                                                </div>
                                                            )}
                                                            
                                                            {mealplan.Dinner && (
                                                                <div className="p-3 rounded-lg">
                                                                    <h3 className="font-medium text-sm text-primary mb-1.5">Dinner</h3>
                                                                    <p className="text-sm text-muted-foreground leading-relaxed">{mealplan.Dinner}</p>
                                                                </div>
                                                            )}

                                                            {mealplan.ShoppingList && mealplan.ShoppingList.length > 0 && (
                                                                <div className="pt-3 mt-4 border-t">
                                                                    <h3 className="font-medium text-sm text-primary mb-2">Shopping List</h3>
                                                                    <ul className="text-sm text-muted-foreground grid grid-cols-1 gap-y-1">
                                                                        {mealplan.ShoppingList.map((item, index) => (
                                                                            <li key={index} className="flex items-center gap-2">
                                                                                <span className="w-1 h-1 rounded-full bg-primary/50" />
                                                                                {item}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <p className="text-sm text-muted-foreground">No meal plan for this day</p>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        )
                                    })}
                                </div>
                            ) : isPending ? (
                                <Card>
                                    <CardContent className="py-12 text-center">
                                        <div className="h-8 w-8 border-4 border-primary border-r-transparent rounded-full animate-spin mx-auto mb-4" />
                                        <p className="text-muted-foreground">Generating your personalized meal plan...</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <Card>
                                    <CardContent className="py-8 text-center">
                                        <p className="text-muted-foreground">Fill out the form to generate your personalized meal plan</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}