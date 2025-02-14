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

const formSchema = z.object({
    diet: z.string().optional(),
    calories: z.coerce.number({message: 'Please provide a number.'}).min(500, {message: 'Please provide a number above 500.'}).max(15000, {message: 'Please provide a realistic goal.'}),
    allergies: z.string().optional(),
    cuisines:  z.string().optional(),
    days: z.coerce.number({message: 'Please provide a number.'}).min(1, {message: 'Minimum days is 1 day.'}).max(31, {message: 'Maximum days is 31 days.'})
  })  

export default function MealGeneratorForm() {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            diet: '',
            calories: 2000,
            allergies: '',
            cuisines: '',
            days: 1
        }
      });

    function onSubmit(formData: z.infer<typeof formSchema>) {
        console.log(formData)

        
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

                    <FormField
                        control={form.control}
                        name="days"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Days (required)</FormLabel>
                            <FormControl>
                                <Input placeholder='e.g. 1, 7, 30' {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />   

                <Button className='w-full' type="submit">Generate Meal Plan</Button>
            </form>
        </Form>
    )
}