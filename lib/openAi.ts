import OpenAI from 'openai';

export const openAI = new OpenAI({
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
})

export const getPrompt = (dietType: string, calories: number, persons: number, proteins: number, allergies: string, cuisines: string) => {
    const dietPart = dietType ? ` following a ${dietType} diet` : '';
    
    return `You are a professional nutritionist. Create a 7-day meal plan for ${persons} person${persons > 1 ? 's' : ''} ${dietPart} aiming for ${calories} calories per day${proteins > 0 ? ` and ${proteins}g of protein per day` : ''}.
      
      Allergies or restrictions: ${allergies || "none"}
      ${cuisines ? `Preferred cuisines: ${cuisines}` : 'Preferred cuisines: any'}
      ${proteins === 0 ? "Note: Protein amount is not a requirement for this plan." : ""}
      The amount of persons should be reflected in the ShoppingList.
      
      For each day, provide:
        - Breakfast
        - Lunch
        - Dinner
      
      Use simple ingredients and provide brief instructions. Include approximate calorie and protein counts for each meal.
      Add all needed ingredients and amount as strings in the ShoppingList.
      Do not add recipes or instructions.
      
      Structure the response as a JSON object where each day is a key, and each meal (breakfast, lunch, dinner) is a sub-key. Example:
      
      {
        "Monday": {
          "Breakfast": "Oatmeal with fruits - 350 calories, 30g protein",
          "Lunch": "Grilled chicken salad - 500 calories, 30g protein",
          "Dinner": "Steamed vegetables with quinoa - 600 calories, 30g protein",
          "ShoppingList": ["360g oatmeal", "1 large chicken breast", "300g quinoa", "4 ripe tomatoes"]
        },
        "Tuesday": {
          "Breakfast": "Smoothie bowl - 300 calories, 20g protein",
          "Lunch": "Turkey sandwich - 450 calories, 30g protein",
          "Dinner": "Baked salmon with asparagus - 700 calories, 30g protein",
          "ShoppingList": ["360g berries", "1 large turkey filet", "2 salmon filets", "300g asparagus"]
        }
        // ...and so on for each day
      }

      Return just the json with no extra commentaries and no backticks.`
}