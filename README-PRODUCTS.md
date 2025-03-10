# Products Data Management

This document provides instructions on how to manage the products data for the NRT Directory and Alternative Products pages.

## Database Tables

The application uses two main tables for product data:

1. `nrt_products` - Stores Nicotine Replacement Therapy products
2. `alternative_products` - Stores smokeless alternatives to traditional cigarettes

## Seeding the Database

To populate the database with initial product data, we've created a seeding script. This script will:

1. Create the necessary tables if they don't exist
2. Insert sample product data into both tables

### Prerequisites

- Node.js installed
- Supabase project set up with proper credentials
- Environment variables configured (`.env` file with Supabase credentials)

### Running the Seed Script

To run the seeding script:

```bash
npm run seed-products
```

This will populate both the `nrt_products` and `alternative_products` tables with sample data.

## Adding New Products

### Via Database

You can add new products directly to the database using the Supabase dashboard:

1. Log in to your Supabase dashboard
2. Navigate to the Table Editor
3. Select either `nrt_products` or `alternative_products`
4. Click "Insert row" and fill in the product details

### Via API

You can also add products programmatically using the Supabase client:

```javascript
const newProduct = {
  name: "Product Name",
  type: "product-type", // for NRT products
  category: "product-category", // for alternative products
  description: "Product description",
  image_url: "https://example.com/image.jpg",
  pros: ["Pro 1", "Pro 2"],
  cons: ["Con 1", "Con 2"],
  avg_rating: 4.5,
  reviews_count: 100,
  price_range: "$20-30",
  nicotine_content: "5mg" // for alternative products only
};

// For NRT products
const { data, error } = await supabase
  .from('nrt_products')
  .insert([newProduct]);

// For alternative products
const { data, error } = await supabase
  .from('alternative_products')
  .insert([newProduct]);
```

## Schema Details

### NRT Products Schema

| Field         | Type           | Description                                   |
|---------------|----------------|-----------------------------------------------|
| id            | uuid           | Primary key, auto-generated                   |
| name          | text           | Product name                                  |
| type          | text           | Product type (patch, gum, lozenge, etc.)      |
| description   | text           | Product description                           |
| image_url     | text           | URL to product image                          |
| pros          | text[]         | Array of product advantages                   |
| cons          | text[]         | Array of product disadvantages                |
| avg_rating    | numeric        | Average user rating (0-5)                     |
| reviews_count | integer        | Number of user reviews                        |
| price_range   | text           | Price range in text format                    |
| created_at    | timestamp      | Creation timestamp                            |

### Alternative Products Schema

| Field           | Type           | Description                                   |
|-----------------|----------------|-----------------------------------------------|
| id              | uuid           | Primary key, auto-generated                   |
| name            | text           | Product name                                  |
| category        | text           | Product category (vape, snus, herbal, etc.)   |
| description     | text           | Product description                           |
| image_url       | text           | URL to product image                          |
| pros            | text[]         | Array of product advantages                   |
| cons            | text[]         | Array of product disadvantages                |
| avg_rating      | numeric        | Average user rating (0-5)                     |
| reviews_count   | integer        | Number of user reviews                        |
| price_range     | text           | Price range in text format                    |
| nicotine_content| text           | Nicotine content information                  |
| created_at      | timestamp      | Creation timestamp                            |

## Best Practices

1. Always use real data from the database instead of frontend mockups
2. Ensure image URLs are valid and images are appropriately sized
3. Keep product descriptions concise but informative
4. Maintain consistent formatting for price ranges and nicotine content
5. Regularly update product information to ensure accuracy 