import OpenAI from 'openai';

export const openAI = new OpenAI({
    apiKey: process.env.OPEN_ROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
})

export const getPrompt = (dietType: string, calories: number, proteins: number, allergies: string, cuisines: string) => {
    const dietPart = dietType ? ` following a ${dietType} diet` : '';
    
    return `You are a professional nutritionist. Create a 7-day meal plan for an individual${dietPart} aiming for ${calories} calories per day${proteins > 0 ? ` and ${proteins}g of protein per day` : ''}.
      
      Allergies or restrictions: ${allergies || "none"}
      ${cuisines ? `Preferred cuisines: ${cuisines}` : 'Preferred cuisines: any'}
      ${proteins === 0 ? "Note: Protein amount is not a requirement for this plan." : ""}
      
      For each day, provide:
        - Breakfast
        - Lunch
        - Dinner
      
      Use simple ingredients and provide brief instructions. Include approximate calorie counts for each meal.
      Add all needed ingredients and amount as strings in the ShoppingList.
      
      Structure the response as a JSON object where each day is a key, and each meal (breakfast, lunch, dinner) is a sub-key. Example:
      
      {
        "Monday": {
          "Breakfast": "Oatmeal with fruits - 350 calories",
          "Lunch": "Grilled chicken salad - 500 calories",
          "Dinner": "Steamed vegetables with quinoa - 600 calories",
          "ShoppingList": ["360g oatmeal", "1 large chicken breast", "300g quinoa", "4 ripe tomatoes"]
        },
        "Tuesday": {
          "Breakfast": "Smoothie bowl - 300 calories",
          "Lunch": "Turkey sandwich - 450 calories",
          "Dinner": "Baked salmon with asparagus - 700 calories",
          "ShoppingList": ["360g berries", "1 large turkey filet", "2 salmon filets", "300g asparagus"]
        }
        // ...and so on for each day
      }

      Return just the json with no extra commentaries and no backticks.`
}