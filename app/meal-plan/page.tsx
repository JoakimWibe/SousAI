"use client"

import MealGeneratorForm from '@/components/meal-generator-form';

export default function MealPlanPage() {
    
    

    return (
        <main className='min-h-screen flex flex-col items-center pt-32 w-full gap-10'>
            <section className="space-y-2">
                <h1 className='font-bold text-2xl md:text-3xl'>AI Meal Plan Generator</h1>
                <MealGeneratorForm />
            </section>

            <section>
                
            </section>
        </main>
    )
}