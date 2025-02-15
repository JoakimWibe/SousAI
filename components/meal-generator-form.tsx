"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MealPlanInput } from '@/types/mealPlans.td';

const formSchema = z.object({
    diet: z.string().optional(),
    calories: z.coerce.number({message: 'Please provide a number.'}).min(500, {message: 'Please provide a number above 500.'}).max(15000, {message: 'Please provide a realistic goal.'}),
    persons: z.coerce.number({message: 'Please provide a number.'}).min(1, {message: 'There must be at least 1 person.'}).max(1000, {message: 'Please provide a realistic number of persons.'}),
    proteins: z.coerce.number({message: 'Please provide a number.'}).optional(),
    allergies: z.string().optional(),
    cuisines:  z.string().optional(),
  })  

interface MealGeneratorFormProps {
    mutate: (data: MealPlanInput) => void;
    isPending: boolean;
}

export default function MealGeneratorForm({ mutate, isPending }: MealGeneratorFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            diet: '',
            calories: 2000,
            persons: 1,
            proteins: 50,
            allergies: '',
            cuisines: '',
        }
      });

    function onSubmit(formData: z.infer<typeof formSchema>) {
        const payload: MealPlanInput = {
            dietType: formData.diet || '',
            calories: formData.calories || 2000,
            persons: formData.persons || 1,
            proteins: formData.proteins || 50,
            allergies: formData.allergies || '',
            cuisines: formData.cuisines || '',
        }

        mutate(payload)
    }  

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="diet"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Diet Type (optional)</FormLabel>
                            <FormControl>
                                <Input placeholder='e.g. vegetarian, vegan, keto' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="calories"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Daily Calorie Goal (required)</FormLabel>
                            <FormControl>
                                <Input placeholder='e.g. 2000' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="persons"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Number of People (required)</FormLabel>
                            <FormControl>
                                <Input placeholder='e.g. 2' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="proteins"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Daily Protein Goal (optional)</FormLabel>
                            <FormControl>
                                <Input placeholder='e.g. 40' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="allergies"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Allergies (optional)</FormLabel>
                            <FormControl>
                                <Input placeholder='e.g. gluten, dairy' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="cuisines"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Preffered cuisines (optional)</FormLabel>
                            <FormControl>
                                <Input placeholder='e.g. French, Mexican, Italian' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />

                <Button disabled={isPending} className='w-full' type="submit">{isPending ? 'Generating...' : 'Generate Meal Plan'}</Button>
            </form>
        </Form>
    )
}