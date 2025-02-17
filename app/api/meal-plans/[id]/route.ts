import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser?.id) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

        const account = await prisma.account.findUnique({
            where: { userId: clerkUser.id },
            select: { id: true }
        });

        if (!account) return NextResponse.json({error: 'No account found.'}, {status: 404});

        const mealPlan = await prisma.mealPlan.findUnique({
            where: { id: params.id },
            select: {
                id: true,
                userId: true,
                title: true,
                calories: true,
                proteins: true,
                persons: true,
                dietType: true,
                allergies: true,
                cuisines: true,
                createdAt: true,
                updatedAt: true,
                days: {
                    select: {
                        id: true,
                        dayOfWeek: true,
                        mealPlanId: true,
                        breakfast: {
                            select: {
                                id: true,
                                name: true,
                                calories: true,
                                protein: true,
                                createdAt: true,
                                updatedAt: true
                            }
                        },
                        lunch: {
                            select: {
                                id: true,
                                name: true,
                                calories: true,
                                protein: true,
                                createdAt: true,
                                updatedAt: true
                            }
                        },
                        dinner: {
                            select: {
                                id: true,
                                name: true,
                                calories: true,
                                protein: true,
                                createdAt: true,
                                updatedAt: true
                            }
                        },
                        shoppingList: {
                            select: {
                                id: true,
                                item: true,
                                dayId: true,
                                createdAt: true,
                                updatedAt: true
                            }
                        }
                    },
                    orderBy: {
                        dayOfWeek: 'asc'
                    }
                }
            }
        });

        if (!mealPlan) return NextResponse.json({error: 'No meal plan found.'}, {status: 404});

        const parsedMealPlan = {
            ...mealPlan,
            allergies: mealPlan.allergies ? mealPlan.allergies.split(',').map(s => s.trim()) : [],
            cuisines: mealPlan.cuisines ? mealPlan.cuisines.split(',').map(s => s.trim()) : []
        };

        return NextResponse.json(parsedMealPlan);
    } catch (error) {
        console.error("[MEAL_PLAN_GET]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser?.id) return NextResponse.json({error: 'Unauthorized'}, {status: 401});

        const existingMealPlan = await prisma.mealPlan.findUnique({
            where: { id: params.id },
            select: {
                userId: true,
                days: {
                    select: {
                        breakfastId: true,
                        lunchId: true,
                        dinnerId: true
                    }
                }
            }
        });

        if (!existingMealPlan) {
            return NextResponse.json({error: 'No meal plan found.'}, {status: 404});
        }

        if (existingMealPlan.userId !== clerkUser.id) {
            return NextResponse.json({error: 'Unauthorized'}, {status: 403});
        }

        const mealIds = new Set<string>();
        existingMealPlan.days.forEach(day => {
            if (day.breakfastId) mealIds.add(day.breakfastId);
            if (day.lunchId) mealIds.add(day.lunchId);
            if (day.dinnerId) mealIds.add(day.dinnerId);
        });

        await prisma.$transaction([
            prisma.day.deleteMany({
                where: {
                    mealPlanId: params.id
                }
            }),
            prisma.meal.deleteMany({
                where: {
                    id: {
                        in: Array.from(mealIds)
                    }
                }
            }),
            prisma.mealPlan.delete({
                where: { id: params.id }
            })
        ]);

        return NextResponse.json({message: 'Meal plan deleted successfully.'}, {status: 200});
    } catch (error) {
        console.error("[MEAL_PLAN_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}