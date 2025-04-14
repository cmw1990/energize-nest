import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts"

const OPEN_FOOD_FACTS_API = "https://world.openfoodfacts.org/api/v2"

// Use the same interfaces as food-database-search for consistency
interface EdamamMeasure { // Renaming to GenericMeasure as source is different
  uri: string; // Use barcode + label as a pseudo-URI
  label: string;
  weight: number; // Weight in grams
}

interface Food {
  name: string;
  foodId: string; // Use barcode as foodId
  calories: number; // Per 100g
  protein: number; // Per 100g
  carbs: number; // Per 100g
  fat: number; // Per 100g
  fiber?: number; // Per 100g
  // Add other base nutrients if needed
  brand?: string;
  category?: string; // Not typically available from OFF barcode scan
  categoryLabel?: string; // Not typically available
  image?: string; // Use product image if available
  measures: EdamamMeasure[]; // List of measures (serving size, 100g)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { barcode } = await req.json()

    if (!barcode) {
      return new Response(
        JSON.stringify({ error: 'Barcode is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const response = await fetch(`${OPEN_FOOD_FACTS_API}/product/${barcode}.json`)
    const data = await response.json()

    if (!data.product) {
      return new Response(
        JSON.stringify({ food: null }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      )
    }

    const product = data.product;
    const nutriments = product.nutriments || {};

    // Extract nutrients per 100g (default unit for OFF)
    const calories_100g = parseFloat(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0);
    const protein_100g = parseFloat(nutriments.proteins_100g || nutriments.proteins || 0);
    const carbs_100g = parseFloat(nutriments.carbohydrates_100g || nutriments.carbohydrates || 0);
    const fat_100g = parseFloat(nutriments.fat_100g || nutriments.fat || 0);
    const fiber_100g = parseFloat(nutriments.fiber_100g || nutriments.fiber || 0);
    // Add others as needed

    const measures: EdamamMeasure[] = [];

    // Add the 100g measure
    if (calories_100g > 0) { // Only add if we have base calorie data
        measures.push({
            uri: `${barcode}-100g`,
            label: '100g',
            weight: 100,
        });
    }

    // Attempt to parse serving size
    const servingSizeString = product.serving_size || '';
    const servingQuantity = parseFloat(product.serving_quantity || '0'); // Sometimes quantity is separate
    let servingWeight = 0;
    let servingLabel = 'Serving';

    if (servingSizeString) {
        const match = servingSizeString.match(/([\d.]+)\s*([a-zA-Z]+)/);
        if (match) {
            const value = parseFloat(match[1]);
            const unit = match[2].toLowerCase();
            // Basic unit conversion (needs improvement for oz, cup etc.)
            if (unit === 'g' || unit === 'ml') {
                servingWeight = value;
                servingLabel = `${value}${unit}`;
            } else if (servingQuantity > 0 && (unit === 'g' || unit === 'ml')) {
                 // Use serving_quantity if serving_size only contains unit
                 servingWeight = servingQuantity;
                 servingLabel = `${servingQuantity}${unit}`;
            } else {
                 // Cannot determine weight, use label only
                 servingLabel = servingSizeString;
                 // Attempt to estimate weight if possible (e.g. if nutrients per serving are available)
                 const calories_serving = parseFloat(nutriments['energy-kcal_serving'] || 0);
                 if (calories_serving > 0 && calories_100g > 0) {
                     servingWeight = parseFloat(((calories_serving / calories_100g) * 100).toFixed(1));
                 }
            }
        } else {
             servingLabel = servingSizeString; // Use the string as label if parsing fails
        }
    } else if (servingQuantity > 0) {
        // If only quantity is given, assume it's a piece/unit without specific weight
        servingLabel = `${servingQuantity} unit(s)`;
        // Estimate weight if possible
        const calories_serving = parseFloat(nutriments['energy-kcal_serving'] || 0);
        if (calories_serving > 0 && calories_100g > 0) {
            servingWeight = parseFloat(((calories_serving / calories_100g) * 100).toFixed(1));
        }
    }

    // Add serving size measure if weight could be determined/estimated
    if (servingWeight > 0) {
        measures.push({
            uri: `${barcode}-serving`,
            label: servingLabel,
            weight: servingWeight,
        });
    } else if (servingLabel !== 'Serving' && !measures.some(m => m.label === servingLabel)) {
         // Add serving as a label-only measure if weight is unknown but label exists
         measures.push({
            uri: `${barcode}-serving-unknown`,
            label: servingLabel,
            weight: 0, // Indicate unknown weight
        });
    }


    const food: Food = {
      name: product.product_name || product.generic_name || 'Unknown Product',
      foodId: barcode, // Use barcode as ID
      calories: Math.round(calories_100g),
      protein: parseFloat(protein_100g.toFixed(1)),
      carbs: parseFloat(carbs_100g.toFixed(1)),
      fat: parseFloat(fat_100g.toFixed(1)),
      fiber: parseFloat(fiber_100g.toFixed(1)),
      // Add other nutrients per 100g here
      brand: product.brands || product.brand_owner,
      image: product.image_url,
      measures: measures,
    };

    return new Response(
      JSON.stringify({ food }),
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