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

export interface SaveMealPlanRequest {
    title: string;
    mealPlanData: WeeklyMealPlan;
    preferences: MealPlanInput;
}

export interface SaveMealPlanResponse {
    id: string;
    userId: string;
    title: string;
    calories: number;
    proteins: number;
    persons: number;
    dietType: string | null;
    allergies: string | null;
    cuisines: string | null;
    days: Array<{
        id: string;
        dayOfWeek: string;
        breakfast: {
            id: string;
            name: string;
            calories: number;
            protein: number;
        };
        lunch: {
            id: string;
            name: string;
            calories: number;
            protein: number;
        };
        dinner: {
            id: string;
            name: string;
            calories: number;
            protein: number;
        };
        shoppingList: Array<{
            id: string;
            item: string;
        }>;
    }>;
    createdAt: string;
    updatedAt: string;
}

export interface DatabaseMealPlan {
    id: string;
    userId: string;
    title: string;
    calories: number;
    proteins: number;
    persons: number;
    dietType: string | null;
    allergies: string | null;
    cuisines: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface MealPlan {
    id: string;
    userId: string;
    title: string;
    calories: number;
    proteins: number;
    persons: number;
    dietType: string | null;
    allergies: string[];
    cuisines: string[];
    createdAt: Date;
    updatedAt: Date;
}