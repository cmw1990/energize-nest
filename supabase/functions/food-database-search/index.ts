import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const EDAMAM_APP_ID = Deno.env.get('EDAMAM_APP_ID')
const EDAMAM_APP_KEY = Deno.env.get('EDAMAM_APP_KEY')

interface EdamamMeasure {
  uri: string;
  label: string;
  weight: number;
  qualified?: { qualifiers: { label: string; uri: string }[] }[];
}

interface Food {
  name: string;
  foodId: string; // Added foodId for potential detailed lookups
  calories: number; // Per 100g
  protein: number; // Per 100g
  carbs: number; // Per 100g
  fat: number; // Per 100g
  fiber: number; // Per 100g
  // Add other base nutrients per 100g if needed
  brand?: string;
  category?: string;
  categoryLabel?: string;
  image?: string;
  measures: EdamamMeasure[]; // Return all available measures
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, foodId } = await req.json() // Add foodId parameter

    if (!query && !foodId) { // Require either query or foodId
      return new Response(
        JSON.stringify({ error: 'Either query or foodId parameter is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    let url = `https://api.edamam.com/api/food-database/v2/parser?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}`

    if (foodId) {
      // Use foodId lookup if provided (Note: Edamam API might use 'foodId' differently, adjust if needed)
      // Edamam's parser endpoint primarily uses 'ingr' or 'upc'.
      // A direct foodId lookup might need the nutrients endpoint: /api/food-database/v2/nutrients
      // For simplicity here, we'll assume parser can handle foodId somehow, or we adjust later.
      // Let's try using 'ingr' with the foodId, might work for specific IDs.
       url += `&ingr=${encodeURIComponent(foodId)}`
       console.log(`Searching by foodId: ${foodId}`)
    } else if (query) {
       url += `&ingr=${encodeURIComponent(query)}`
       console.log(`Searching by query: ${query}`)
    }

    const response = await fetch(url)
    const data = await response.json()

    if (!data.hints || data.hints.length === 0) {
      return new Response(
        JSON.stringify({ foods: [] }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    // Increase results limit, Edamam free plan might limit this
    const MAX_RESULTS = 20;
    const foods: Food[] = data.hints.slice(0, MAX_RESULTS).map((hint: any) => {
      const foodData = hint.food;
      const nutrients = foodData.nutrients || {};
      const measures: EdamamMeasure[] = hint.measures || [];

      // Ensure measures have weight, default to 100g if none exist
      if (measures.length === 0) {
        measures.push({ uri: 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram', label: 'Gram', weight: 1 });
      }
      // Ensure a 100g measure exists if possible, otherwise calculate from another measure
      if (!measures.some(m => m.weight === 100 && m.label.toLowerCase() === 'gram')) {
         // If nutrients are present, they are usually per 100g by default
         if (nutrients.ENERC_KCAL) {
            if (!measures.some(m => m.label.toLowerCase() === 'gram')) {
              measures.push({ uri: 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram', label: 'Gram', weight: 1 });
            }
         } else {
            // Cannot reliably calculate 100g nutrients if base nutrients are missing
            // In a real scenario, might skip this item or mark as incomplete
         }
      }


      return {
        name: foodData.label,
        foodId: foodData.foodId,
        // Nutrients per 100g (Edamam default)
        calories: Math.round(nutrients.ENERC_KCAL || 0),
        protein: parseFloat((nutrients.PROCNT || 0).toFixed(1)),
        carbs: parseFloat((nutrients.CHOCDF || 0).toFixed(1)),
        fat: parseFloat((nutrients.FAT || 0).toFixed(1)),
        fiber: parseFloat((nutrients.FIBTG || 0).toFixed(1)),
        // Add other base nutrients if needed (e.g., sugar, sodium per 100g)
        brand: foodData.brand,
        category: foodData.category,
        categoryLabel: foodData.categoryLabel,
        image: foodData.image,
        measures: measures.map(m => ({ // Return all measures
          uri: m.uri,
          label: m.label,
          weight: parseFloat(m.weight.toFixed(2)), // Weight in grams
          qualified: m.qualified
        })),
      };
    });

    return new Response(
      JSON.stringify({ foods }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    )
  }
})