import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { MealPlanInput, WeeklyMealPlan } from "@/types/mealPlans.td";

export async function POST(req: Request) {
    try {
        const clerkUser = await currentUser();

        if (!clerkUser?.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { title, mealPlanData, preferences } = body as {
            title: string;
            mealPlanData: WeeklyMealPlan;
            preferences: MealPlanInput;
        };

        const mealPlan = await prisma.mealPlan.create({
            data: {
                userId: clerkUser.id,
                title,
                calories: preferences.calories,
                proteins: preferences.proteins,
                persons: preferences.persons,
                dietType: preferences.dietType,
                allergies: preferences.allergies,
                cuisines: preferences.cuisines,
                days: {
                    create: Object.entries(mealPlanData).map(([dayOfWeek, dayData]) => ({
                        dayOfWeek,
                        breakfast: {
                            create: {
                                name: dayData.Breakfast || "",
                                calories: Math.round(preferences.calories / 3),
                                protein: Math.round(preferences.proteins / 3),
                            }
                        },
                        lunch: {
                            create: {
                                name: dayData.Lunch || "",
                                calories: Math.round(preferences.calories / 3),
                                protein: Math.round(preferences.proteins / 3),
                            }
                        },
                        dinner: {
                            create: {
                                name: dayData.Dinner || "",
                                calories: Math.round(preferences.calories / 3),
                                protein: Math.round(preferences.proteins / 3),
                            }
                        },
                        shoppingList: {
                            create: (dayData.ShoppingList || []).map((item) => ({
                                item
                            }))
                        }
                    }))
                }
            },
            include: {
                days: {
                    include: {
                        breakfast: true,
                        lunch: true,
                        dinner: true,
                        shoppingList: true,
                    }
                }
            }
        });

        return NextResponse.json(mealPlan);
    } catch (error) {
        console.error("[MEAL_PLANS_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function GET() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser?.id) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

        const account = await prisma.account.findUnique({
            where: { userId: clerkUser.id },
            select: { id: true }
        });

        if (!account) return NextResponse.json({error: 'No account found.'}, {status: 404});

        const mealPlans = await prisma.mealPlan.findMany({
            where: { userId: clerkUser.id },
        })
        
        return NextResponse.json(mealPlans);
    } catch (error) {
        console.error("[MEAL_PLANS_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
