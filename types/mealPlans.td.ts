export interface MealPlanInput {
    dietType: string;
    calories: number;
    persons: number;
    proteins: number;
    allergies: string;
    cuisines: string;
}

export interface DailyMealPlan {
    Breakfast?: string;
    Lunch?: string;
    Dinner?: string;
    ShoppingList?: string[];
}

export interface WeeklyMealPlan {
    [day: string]: DailyMealPlan;
}

export interface MealPlanResponse {
    mealPlan?: WeeklyMealPlan;
    error?: string;
}