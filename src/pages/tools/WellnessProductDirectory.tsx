import React, { useState, useMemo } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { Package, Search, Filter, SortAsc, ExternalLink, Info, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Define placeholder structure for product data
// Adjust based on actual Supabase table schema when created
interface WellnessProduct {
    id: string;
    name: string;
    description?: string;
    category: 'supplement' | 'nootropic' | 'gear' | 'energy_drink' | 'other';
    brand?: string;
    image_url?: string;
    rating?: number;
    reviews_count?: number;
    price?: number;
    currency?: string;
    vendor_name?: string;
    vendor_url?: string; // Affiliate link or direct link
    tags?: string[];
}

// Placeholder fetch function - replace with actual Supabase query
const fetchWellnessProducts = async (): Promise<WellnessProduct[]> => {
    console.warn("Placeholder: Fetching wellness products. Replace with actual Supabase query.");
    // Example: const { data, error } = await supabase.from('wellness_products').select('*');
    // Return mock data for now
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
    return [
        { id: '1', name: 'Super Vitamin D3', category: 'supplement', description: 'High potency Vitamin D3 for immune support.', brand: 'Wellness Co', price: 15.99, currency: 'USD', rating: 4.5, reviews_count: 120, vendor_url: '#', tags: ['immune', 'vitamin'] },
        { id: '2', name: 'FocusFlow Nootropic Blend', category: 'nootropic', description: 'Enhance cognitive function and focus.', brand: 'MindBoost', price: 39.99, currency: 'USD', rating: 4.8, reviews_count: 85, vendor_url: '#', tags: ['focus', 'cognitive'] },
        { id: '3', name: 'Pro Yoga Mat', category: 'gear', description: 'Eco-friendly, non-slip yoga mat.', brand: 'ZenFit', price: 49.99, currency: 'USD', rating: 4.7, reviews_count: 210, vendor_url: '#', tags: ['yoga', 'fitness'] },
        { id: '4', name: 'ChargeUp Energy Drink', category: 'energy_drink', description: 'Natural energy boost without the crash.', brand: 'ChargeUp', price: 2.99, currency: 'USD', rating: 4.2, reviews_count: 300, vendor_url: '#', tags: ['energy', 'beverage'] },
        { id: '5', name: 'Omega-3 Fish Oil', category: 'supplement', description: 'Supports heart and brain health.', brand: 'Wellness Co', price: 22.50, currency: 'USD', rating: 4.6, reviews_count: 150, vendor_url: '#', tags: ['heart', 'brain', 'omega3'] },
        { id: '6', name: 'Smart Resistance Bands', category: 'gear', description: 'Set of 5 resistance bands for home workouts.', brand: 'ZenFit', price: 25.00, currency: 'USD', rating: 4.4, reviews_count: 95, vendor_url: '#', tags: ['fitness', 'workout'] },
    ];
};

export default function WellnessProductDirectory() {
  const [category, setCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("rating"); // Default sort

  // Replace with actual useQuery when data source is ready
  const { data: products = [], isLoading } = useQuery<WellnessProduct[]>({
    queryKey: ['wellness-products'], // Add filters/sort to key later
    queryFn: fetchWellnessProducts,
    // staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // Filter by category
    if (category) {
      result = result.filter(p => p.category === category);
    }

    // Filter by search query (name, description, brand, tags)
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.description?.toLowerCase().includes(lowerSearch) ||
        p.brand?.toLowerCase().includes(lowerSearch) ||
        p.tags?.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "price_asc":
          return (a.price ?? Infinity) - (b.price ?? Infinity);
        case "price_desc":
          return (b.price ?? 0) - (a.price ?? 0);
        case "reviews":
            return (b.reviews_count ?? 0) - (a.reviews_count ?? 0);
        default:
          return 0;
      }
    });

    return result;
  }, [products, category, searchQuery, sortBy]);

  const categories = [
    { value: "supplement", label: "Supplements" },
    { value: "nootropic", label: "Nootropics" },
    { value: "gear", label: "Fitness Gear" },
    { value: "energy_drink", label: "Energy Drinks" },
    { value: "other", label: "Other" },
  ];

  return (
    <ToolAnalyticsWrapper toolName="wellness-product-directory" toolType="directory">
      <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed from TopNav */}
        <div className="container mx-auto p-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-primary" />
                <CardTitle>Wellness Product Directory</CardTitle>
              </div>
              <CardDescription>
                Explore supplements, nootropics, fitness gear, and more.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-4 md:w-auto">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="flex-1 md:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="flex-1 md:w-48">
                      <SortAsc className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="price_asc">Price: Low to High</SelectItem>
                      <SelectItem value="price_desc">Price: High to Low</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {isLoading ? (
                  [...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="h-40 bg-muted rounded-t-lg"></div>
                      <CardHeader><div className="h-5 bg-muted rounded w-3/4"></div></CardHeader>
                      <CardContent className="space-y-2">
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-4 bg-muted rounded w-5/6"></div>
                      </CardContent>
                      <CardFooter><div className="h-8 bg-muted rounded w-full"></div></CardFooter>
                    </Card>
                  ))
                ) : filteredAndSortedProducts.length > 0 ? (
                  filteredAndSortedProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow flex flex-col">
                      <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-muted">
                         <img
                            src={product.image_url || '/placeholder.svg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                         />
                      </div>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                        {product.brand && <CardDescription>{product.brand}</CardDescription>}
                      </CardHeader>
                      <CardContent className="space-y-2 flex-grow">
                        {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}
                        <div className="flex justify-between items-center text-sm">
                            {product.rating !== undefined && product.reviews_count !== undefined && (
                                <span className="text-muted-foreground">⭐ {product.rating.toFixed(1)} ({product.reviews_count})</span>
                            )}
                            {product.price !== undefined && (
                                <span className="font-semibold">{product.currency || '$'}{product.price.toFixed(2)}</span>
                            )}
                        </div>
                         <div className="flex flex-wrap gap-1 pt-1">
                            {product.tags?.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" variant="outline" asChild>
                          <a href={product.vendor_url || '#'} target="_blank" rel="noopener noreferrer">
                            View Product <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-10">
                    No products found matching your criteria.
                  </p>
                )}
              </div>
               <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 space-y-2">
                  <h3 className="font-medium flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Info className="h-5 w-5" />
                    Disclaimer
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Product information, pricing, and availability are subject to change. This directory may contain affiliate links. Always do your own research before purchasing any wellness products.
                  </p>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
}