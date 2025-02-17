import { getPrompt, openAI } from '@/lib/openAi';
import { NextRequest, NextResponse } from 'next/server';

interface DailyMealPlan {
    Breakfast?: string;
    Lunch?: string;
    Dinner?: string;
    ShoppingList?: string[];
}

export async function POST(request:NextRequest) {
    try {
        const {dietType, calories, persons, proteins, allergies, cuisines} = await request.json();

        const prompt = getPrompt(dietType, calories, persons, proteins, allergies, cuisines);

        console.log(prompt)

        const response = await openAI.chat.completions.create({
            model: 'meta-llama/llama-3.3-70b-instruct:free',
            messages: [
                {
                    role: 'user',
                    content: prompt,
                }
            ],
            temperature: 0.7,
            max_tokens: 1500
        });

        const aiContent = response.choices[0].message.content!.trim();

        let parsedMealPlan: {[day: string]: DailyMealPlan}

        try {
            parsedMealPlan = JSON.parse(aiContent)
        } catch (parseError) {
            console.error('Error parsing AI response.', parseError);
            return NextResponse.json({error: 'Failed to parse meal plan. Please try again.'}, {status: 500});
        }

        if (typeof parsedMealPlan !== 'object' || parsedMealPlan === null) return NextResponse.json({error: 'Failed to parse meal plan. Please try again.'}, {status: 500});

        return NextResponse.json({mealPlan: parsedMealPlan});
    } catch {
        return NextResponse.json({error: 'Internal error.'}, {status: 500})
    }
}