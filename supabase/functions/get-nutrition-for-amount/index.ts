/// <reference types="https://deno.land/x/deno/cli/types/deno.d.ts" />

// @deno-types="https://deno.land/std@0.211.0/http/server.ts" 
// Using a more recent std version, adjust if needed based on Supabase compatibility
import { serve } from "https://deno.land/std@0.211.0/http/server.ts"; 
import { corsHeaders } from "../_shared/cors.ts";

console.log("get-nutrition-for-amount function booting up");

// Interface for the expected request body
interface RequestBody {
  foodId: string;
  quantity: number;
  measureUri: string;
}

// Interface for the Edamam API request payload
interface EdamamNutrientsPayload {
  ingredients: {
    quantity: number;
    measureURI: string;
    foodId: string;
  }[];
}

// Interface for the relevant parts of the Edamam API response
interface EdamamNutrientsResponse {
  uri: string;
  yield: number;
  calories: number;
  totalNutrients: {
    [key: string]: { // Nutrient codes like "ENERC_KCAL", "PROCNT", "FAT", "CHOCDF", "FIBTG", "SUGAR", "NA", etc.
      label: string;
      quantity: number;
      unit: string;
    };
  };
  totalDaily: {
    [key: string]: {
      label: string;
      quantity: number;
      unit: string;
    };
  };
  // Add other fields if needed
}

// Interface for the function's response
interface FunctionResponse {
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
  // Add more nutrients as needed
}


serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body: RequestBody = await req.json();
    console.log("Received request body:", body);

    if (!body.foodId || !body.quantity || !body.measureUri) {
      return new Response(JSON.stringify({ error: "Missing required fields: foodId, quantity, measureUri" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Retrieve secrets using Deno global
    const appId = Deno.env.get("EDAMAM_NUTRITION_APP_ID");
    const appKey = Deno.env.get("EDAMAM_NUTRITION_APP_KEY");

    if (!appId || !appKey) {
      console.error("Edamam API credentials are not set in environment variables.");
      return new Response(JSON.stringify({ error: "API credentials configuration error" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }

    const apiUrl = `https://api.edamam.com/api/nutrition-details?app_id=${appId}&app_key=${appKey}`;

    const payload: EdamamNutrientsPayload = {
      ingredients: [
        {
          quantity: body.quantity,
          measureURI: body.measureUri,
          foodId: body.foodId,
        },
      ],
    };

    console.log("Sending payload to Edamam:", JSON.stringify(payload));

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("Edamam API response status:", response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Edamam API error:", errorBody);
      // Try to parse error for more specific feedback
      let detail = errorBody;
      try {
         const parsedError = JSON.parse(errorBody);
         detail = parsedError.message || parsedError.error || errorBody;
      } catch(_) { /* Ignore parsing error */ }
      
      throw new Error(`Edamam API request failed (${response.status}): ${detail}`);
    }

    const data: EdamamNutrientsResponse = await response.json();
    console.log("Edamam API response data:", data);

    // Extract relevant nutrients
    const nutrients = data.totalNutrients;
    const result: FunctionResponse = {
      calories: nutrients.ENERC_KCAL?.quantity ?? null,
      protein: nutrients.PROCNT?.quantity ?? null,
      fat: nutrients.FAT?.quantity ?? null,
      carbs: nutrients.CHOCDF?.quantity ?? null, // Total carbs
      fiber: nutrients.FIBTG?.quantity ?? null,
      sugar: nutrients.SUGAR?.quantity ?? null,
      sodium: nutrients.NA?.quantity ?? null,
    };

    // Round values appropriately
    for (const key in result) {
        if (result[key as keyof FunctionResponse] !== null) {
            // Use Math.round for calories, 1 decimal place for others
            const decimalPlaces = key === 'calories' ? 0 : 1;
            result[key as keyof FunctionResponse] = parseFloat(result[key as keyof FunctionResponse]!.toFixed(decimalPlaces));
        }
    }


    console.log("Returning calculated nutrition:", result);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in get-nutrition-for-amount function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});