// This script seeds the database with real NRT products and alternative products data
// Run with: npm run seed-products

const fetch = require('node-fetch');

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
// Use service role key for admin access
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_SERVICE_ROLE_KEY are set.');
  process.exit(1);
}

console.log(`Using Supabase URL: ${supabaseUrl}`);
console.log(`Using key type: ${process.env.VITE_SUPABASE_SERVICE_ROLE_KEY ? 'SERVICE_ROLE_KEY' : 'ANON_KEY'}`);

// Function to make a Supabase REST API call
async function supabaseRestCall(endpoint, options = {}) {
  const response = await fetch(`${supabaseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || response.statusText);
  }

  return await response.json();
}

// NRT Products data
const nrtProducts = [
  {
    name: "NicoDerm CQ Patch",
    type: "patch",
    description: "Clear nicotine patches that deliver a steady flow of nicotine through the skin and into the body. Available in different strengths for a step-down approach.",
    image_url: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["Easy to use", "Discreet", "Steady nicotine delivery", "Once-daily application"],
    cons: ["Skin irritation for some users", "Can't adjust timing of dose", "May not address hand-to-mouth habit"],
    avg_rating: 4.2,
    reviews_count: 127,
    price_range: "$30-45"
  },
  {
    name: "Nicorette Gum",
    type: "gum",
    description: "Chewing gum that releases nicotine into the bloodstream through the lining of the mouth. Available in different flavors and strengths.",
    image_url: "https://images.unsplash.com/photo-1577076626969-e4a91b8aec68?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["Addresses oral fixation", "Control when you use it", "Various flavors available", "Quick craving relief"],
    cons: ["Proper chewing technique required", "May cause jaw soreness", "Can't eat or drink 15 minutes before/during use"],
    avg_rating: 4.0,
    reviews_count: 215,
    price_range: "$40-50"
  },
  {
    name: "Nicorette Lozenge",
    type: "lozenge",
    description: "Candy-like tablets that dissolve in the mouth, releasing nicotine that is absorbed through the lining of the mouth.",
    image_url: "https://images.unsplash.com/photo-1563241806-025d9b725b88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["Discreet to use", "No chewing required", "Various flavors available", "Convenient for sudden cravings"],
    cons: ["Can cause hiccups or heartburn", "Can't eat or drink while using", "May take practice to use correctly"],
    avg_rating: 4.3,
    reviews_count: 178,
    price_range: "$35-45"
  },
  {
    name: "Nicotrol Inhaler",
    type: "inhaler",
    description: "Plastic mouthpiece and cartridge that delivers nicotine vapor when inhaled. Mimics the hand-to-mouth motion of smoking.",
    image_url: "https://images.unsplash.com/photo-1561197522-b1a50333c03a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["Mimics hand-to-mouth action", "Control when you use it", "Can stop and resume using same cartridge", "Addresses behavioral aspect"],
    cons: ["More visible to use", "Can cause mouth/throat irritation", "Frequent use required (6-16 cartridges daily)"],
    avg_rating: 3.8,
    reviews_count: 92,
    price_range: "$50-60"
  },
  {
    name: "Nicotrol NS Nasal Spray",
    type: "spray",
    description: "Pump bottle containing nicotine solution that is sprayed directly into the nostril. Provides the fastest delivery of nicotine among NRT products.",
    image_url: "https://images.unsplash.com/photo-1585149193051-7201f34b7abe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["Fastest acting NRT", "Control when you use it", "Good for intense cravings", "Mimics quick nicotine spike from smoking"],
    cons: ["Can cause nasal and eye irritation", "More visible to use", "More side effects than other NRTs"],
    avg_rating: 3.7,
    reviews_count: 64,
    price_range: "$60-70"
  }
];

// Alternative Products data
const alternativeProducts = [
  {
    name: "JUUL E-cigarette",
    category: "vape",
    description: "Sleek, USB-shaped e-cigarette that uses pre-filled pods with nicotine salts. Popular for its simplicity and cigarette-like nicotine delivery.",
    image_url: "https://images.unsplash.com/photo-1560373545-e0293a5f9c57?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["Easy to use", "Discreet", "Satisfying nicotine hit", "No buttons or settings"],
    cons: ["Limited flavor options", "Expensive pods", "Battery life concerns", "Environmental impact of disposable pods"],
    avg_rating: 3.9,
    reviews_count: 245,
    price_range: "$20-35 (device), $15-20 (pods)",
    nicotine_content: "3-5% (30-50mg/ml)"
  },
  {
    name: "Vuse Alto",
    category: "vape",
    description: "Pen-style e-cigarette with pre-filled pods. Features a longer battery life than many competitors and a simple draw-activated mechanism.",
    image_url: "https://images.unsplash.com/photo-1560373546-090a23976ce2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["Long battery life", "Consistent vapor production", "Widely available", "Draw-activated (no button)"],
    cons: ["Limited flavor selection", "Some users report leaking", "Higher nicotine levels only"],
    avg_rating: 3.8,
    reviews_count: 187,
    price_range: "$15-25 (device), $10-15 (pods)",
    nicotine_content: "1.8-5% (18-50mg/ml)"
  },
  {
    name: "Zyn Nicotine Pouches",
    category: "snus",
    description: "Tobacco-free nicotine pouches that are placed between the gum and lip. Available in various flavors and strengths.",
    image_url: "https://images.unsplash.com/photo-1567607673554-2048def2c6b1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["Tobacco-free", "Discreet (no spitting)", "Various flavors", "Different strength options"],
    cons: ["Mouth irritation for some users", "May cause hiccups", "Can be addictive"],
    avg_rating: 4.2,
    reviews_count: 312,
    price_range: "$4-7 per can",
    nicotine_content: "3-6mg per pouch"
  },
  {
    name: "On! Nicotine Pouches",
    category: "snus",
    description: "Small, discreet tobacco-free nicotine pouches with a variety of flavors and strengths. Known for their small size and quick nicotine release.",
    image_url: "https://images.unsplash.com/photo-1567607673559-2048def2c6b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["Very discreet (smaller than most pouches)", "Quick nicotine release", "No tobacco", "Multiple flavor options"],
    cons: ["Short-lasting compared to some alternatives", "Can cause gum irritation", "Small size may be difficult to handle"],
    avg_rating: 4.0,
    reviews_count: 178,
    price_range: "$3-6 per can",
    nicotine_content: "2-8mg per pouch"
  },
  {
    name: "Honeyrose Herbal Cigarettes",
    category: "herbal",
    description: "Tobacco-free and nicotine-free herbal cigarettes made from a blend of herbs and flowers. Provides the ritual of smoking without nicotine.",
    image_url: "https://images.unsplash.com/photo-1567607673564-2048def2c6b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["No nicotine or tobacco", "Helps with hand-to-mouth habit", "Various flavors available", "Legal in most smoke-free areas"],
    cons: ["Still produces harmful smoke", "May trigger smoking urges", "Not a health product"],
    avg_rating: 3.5,
    reviews_count: 92,
    price_range: "$5-10 per pack",
    nicotine_content: "0mg (nicotine-free)"
  },
  {
    name: "Cyclones Pre-Rolled Hemp Cones",
    category: "herbal",
    description: "Pre-rolled hemp wraps with wooden tips. Can be filled with herbal smoking blends for a tobacco-free smoking experience.",
    image_url: "https://images.unsplash.com/photo-1567607673569-2048def2c6b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["Tobacco-free", "Flavored options available", "Wooden tip prevents soggy ends", "Customizable filling"],
    cons: ["Still involves combustion", "May not satisfy nicotine cravings", "Requires filling"],
    avg_rating: 3.7,
    reviews_count: 64,
    price_range: "$2-4 per cone",
    nicotine_content: "0mg (nicotine-free)"
  },
  {
    name: "Harmless Cigarette",
    category: "zero",
    description: "A non-electronic quit smoking device that looks like a cigarette and provides sensory cues without nicotine, tobacco, or vapor.",
    image_url: "https://images.unsplash.com/photo-1567607673574-2048def2c6b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["Addresses hand-to-mouth habit", "No harmful substances", "Reusable", "Helps with psychological addiction"],
    cons: ["No nicotine (may not satisfy cravings)", "Limited sensory experience", "May not work for heavy smokers"],
    avg_rating: 3.3,
    reviews_count: 128,
    price_range: "$15-25",
    nicotine_content: "0mg (nicotine-free)"
  },
  {
    name: "Ripple+ Diffuser",
    category: "other",
    description: "Personal aromatherapy device that looks like a vape pen but delivers plant-based essential oils. Provides calming effects without nicotine.",
    image_url: "https://images.unsplash.com/photo-1567607673579-2048def2c6b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    pros: ["No nicotine or tobacco", "Aromatherapy benefits", "Satisfies hand-to-mouth habit", "Various blends for different effects"],
    cons: ["Doesn't address nicotine addiction", "More expensive than some alternatives", "Effects are subtle"],
    avg_rating: 3.9,
    reviews_count: 87,
    price_range: "$20-30 (device), $8-12 (refills)",
    nicotine_content: "0mg (nicotine-free)"
  }
];

// Function to check if tables exist
async function checkTablesExist() {
  console.log('Checking if tables exist...');
  
  try {
    // Check nrt_products table
    try {
      await supabaseRestCall('/rest/v1/nrt_products?select=id&limit=1');
      console.log('NRT Products table exists');
    } catch (error) {
      if (!error.message.includes('does not exist')) {
        console.error('Error checking nrt_products table:', error.message);
        return false;
      }
      console.log('NRT Products table does not exist');
    }

    // Check alternative_products table
    try {
      await supabaseRestCall('/rest/v1/alternative_products?select=id&limit=1');
      console.log('Alternative Products table exists');
    } catch (error) {
      if (!error.message.includes('does not exist')) {
        console.error('Error checking alternative_products table:', error.message);
        return false;
      }
      console.log('Alternative Products table does not exist');
    }

    console.log('Table check completed.');
    return true;
  } catch (error) {
    console.error('Error checking tables:', error);
    return false;
  }
}

// Function to insert NRT products
async function insertNRTProducts() {
  console.log('Inserting NRT products...');
  let successCount = 0;
  
  // First try to create the table using the REST API
  try {
    await supabaseRestCall('/rest/v1/rpc/create_nrt_products_table', {
      method: 'POST'
    });
    console.log('NRT products table created successfully via RPC');
  } catch (error) {
    console.log('Table creation RPC failed (this is expected if table already exists):', error.message);
  }
  
  // Now insert the products
  for (const product of nrtProducts) {
    try {
      await supabaseRestCall('/rest/v1/nrt_products', {
        method: 'POST',
        headers: {
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(product)
      });
      
      console.log(`Inserted NRT product: ${product.name}`);
      successCount++;
    } catch (error) {
      console.error(`Error inserting NRT product ${product.name}:`, error.message);
    }
  }
  
  console.log(`Completed NRT products insertion. ${successCount} of ${nrtProducts.length} products inserted.`);
}

// Function to insert alternative products
async function insertAlternativeProducts() {
  console.log('Inserting alternative products...');
  let successCount = 0;
  
  // First try to create the table using the REST API
  try {
    await supabaseRestCall('/rest/v1/rpc/create_alternative_products_table', {
      method: 'POST'
    });
    console.log('Alternative products table created successfully via RPC');
  } catch (error) {
    console.log('Table creation RPC failed (this is expected if table already exists):', error.message);
  }
  
  // Now insert the products
  for (const product of alternativeProducts) {
    try {
      await supabaseRestCall('/rest/v1/alternative_products', {
        method: 'POST',
        headers: {
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify(product)
      });
      
      console.log(`Inserted alternative product: ${product.name}`);
      successCount++;
    } catch (error) {
      console.error(`Error inserting alternative product ${product.name}:`, error.message);
    }
  }
  
  console.log(`Completed alternative products insertion. ${successCount} of ${alternativeProducts.length} products inserted.`);
}

// Main function to seed the database
async function seedDatabase() {
  console.log('Starting database seeding...');
  
  // Check if tables exist
  if (!await checkTablesExist()) {
    console.error('Table check failed. Exiting...');
    process.exit(1);
  }
  
  // Insert products
  await insertNRTProducts();
  await insertAlternativeProducts();
  
  console.log('Database seeding completed.');
}

// Run the seeding process
seedDatabase()
  .catch(error => {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }); 