"use client"

import MealGeneratorForm from '@/components/meal-generator-form';
import { DailyMealPlan, MealPlanInput, MealPlanResponse } from '@/types/mealPlans.td';
import { useMutation } from '@tanstack/react-query';

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

export default function MealPlanPage() {
    const { mutate, isPending, data, isSuccess } = useMutation<MealPlanResponse, Error, MealPlanInput>({
        mutationFn: generateMealPlan
    })

    const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const getMealPlanForDay = (day: string): DailyMealPlan | undefined => {
        if (!data?.mealPlan) return undefined
        return data?.mealPlan[day]
    }

    return (
        <main className='min-h-screen flex flex-col items-center pt-32 w-full gap-10'>
            <section>
                <h1 className='font-bold text-2xl md:text-3xl'>AI Meal Plan Generator</h1>
                <MealGeneratorForm mutate={mutate} isPending={isPending} />
            </section>
            
            <section>
                <h2 className='font-bold text-xl md:text-2xl'>Weekly Meal Plan</h2>

                {data?.mealPlan && isSuccess ? (
                    <div>
                        {daysOfTheWeek.map((day, key) => {
                            const mealplan = getMealPlanForDay(day);
                            return (
                                <div key={key}>
                                    <h3>{day}</h3>
                                    {mealplan ? (<div>{mealplan.Dinner}</div>) : <div>No Meal Plan</div>}
                                </div>
                            )
                        })}
                    </div>
                ) : isPending ? <div>Loading...</div> : <p>Please generate a meal plan to see it here.</p>}
            </section>
        </main>
    )
}