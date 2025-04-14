
import React, { useState, useEffect } from 'react';
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
import { LandingHeader } from "@/components/layout/LandingHeader";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { Package, Search, Filter, SortAsc, ExternalLink, Info, ShoppingCart, Star, BadgePercent } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Product structure for real Supabase data
interface WellnessProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  image_url?: string;
  rating: number;
  reviews_count: number;
  price: number;
  currency: string;
  vendor_name: string;
  vendor_url: string;
  tags: string[];
  is_featured: boolean;
  is_on_sale: boolean;
  discount_percentage?: number;
  created_at: string;
}

// Fetch real products from Supabase
const fetchWellnessProducts = async (): Promise<WellnessProduct[]> => {
  try {
    const { data, error } = await supabase
      .from('wellness_products')
      .select('*')
      .order('rating', { ascending: false });
    
    if (error) {
      console.error("Error fetching wellness products:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Failed to fetch wellness products:", error);
    return [];
  }
};

export default function WellnessProductDirectory() {
  const [category, setCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("rating");
  const [activeTab, setActiveTab] = useState<string>("all");

  // Fetch products from Supabase
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['wellness-products'],
    queryFn: fetchWellnessProducts,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  // Handle error if products couldn't be fetched
  useEffect(() => {
    if (error) {
      console.error("Error fetching products:", error);
    }
  }, [error]);

  // Filter and sort products based on user selections
  const filteredAndSortedProducts = React.useMemo(() => {
    let result = [...products];

    // Filter by tab
    if (activeTab === "featured") {
      result = result.filter(p => p.is_featured);
    } else if (activeTab === "sale") {
      result = result.filter(p => p.is_on_sale);
    }

    // Filter by category
    if (category) {
      result = result.filter(p => p.category === category);
    }

    // Filter by search query
    if (searchQuery) {
      const lowerSearch = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.description.toLowerCase().includes(lowerSearch) ||
        p.brand.toLowerCase().includes(lowerSearch) ||
        p.tags.some(tag => tag.toLowerCase().includes(lowerSearch))
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "price_asc":
          return a.price - b.price;
        case "price_desc":
          return b.price - a.price;
        case "reviews":
          return b.reviews_count - a.reviews_count;
        default:
          return 0;
      }
    });

    return result;
  }, [products, category, searchQuery, sortBy, activeTab]);

  // Product categories from real data
  const categories = [
    { value: "supplement", label: "Supplements" },
    { value: "nootropic", label: "Nootropics" },
    { value: "fitness_gear", label: "Fitness Gear" },
    { value: "energy_drink", label: "Energy Drinks" },
    { value: "wellness_tech", label: "Wellness Tech" },
    { value: "recovery", label: "Recovery" },
    { value: "nutrition", label: "Nutrition" },
  ];

  return (
    <ToolAnalyticsWrapper toolName="wellness-product-directory" toolType="directory">
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <div className="container mx-auto p-4 space-y-6">
          <Card className="border border-primary/10">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-6 w-6 text-primary" />
                <CardTitle>Wellness Product Directory</CardTitle>
              </div>
              <CardDescription>
                Explore top-rated supplements, nootropics, fitness gear, and more. Find what the pros use to optimize health and performance.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All Products</TabsTrigger>
                  <TabsTrigger value="featured" className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    <span>Featured</span>
                  </TabsTrigger>
                  <TabsTrigger value="sale" className="flex items-center gap-1">
                    <BadgePercent className="h-4 w-4" />
                    <span>On Sale</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>

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
                <div className="flex flex-col sm:flex-row gap-4 md:w-auto">
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
                  // Loading skeleton cards
                  Array(8).fill(0).map((_, i) => (
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
                  // Actual product cards
                  filteredAndSortedProducts.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-shadow flex flex-col overflow-hidden">
                      <div className="relative">
                        {product.is_on_sale && (
                          <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {product.discount_percentage}% OFF
                          </div>
                        )}
                        {product.is_featured && (
                          <div className="absolute top-2 left-2 z-10 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Featured
                          </div>
                        )}
                        <div className="aspect-square w-full overflow-hidden bg-muted">
                           <img
                              src={product.image_url || '/placeholder-product.png'} 
                              alt={product.name}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                           />
                        </div>
                      </div>
                      <CardHeader className="pb-2 pt-4">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                          <div className="flex items-center text-amber-500">
                            <Star className="fill-amber-500 h-4 w-4" />
                            <span className="ml-1 text-sm font-medium">{product.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        {product.brand && <CardDescription>{product.brand}</CardDescription>}
                      </CardHeader>
                      <CardContent className="space-y-2 flex-grow">
                        {product.description && <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>}
                        <div className="flex justify-between items-center text-sm pt-2">
                            <span className="text-muted-foreground">{product.reviews_count} reviews</span>
                            <div className="flex items-end">
                              {product.is_on_sale && (
                                <span className="text-xs line-through text-muted-foreground mr-2">
                                  {product.currency}{(product.price / (1 - (product.discount_percentage || 0) / 100)).toFixed(2)}
                                </span>
                              )}
                              <span className="font-semibold text-base">
                                {product.currency}{product.price.toFixed(2)}
                              </span>
                            </div>
                        </div>
                         <div className="flex flex-wrap gap-1 pt-1">
                            {product.tags?.slice(0, 3).map((tag, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                            {product.tags?.length > 3 && (
                              <Badge variant="outline" className="text-xs">+{product.tags.length - 3} more</Badge>
                            )}
                        </div>
                      </CardContent>
                      <CardFooter className="pt-2">
                        <Button className="w-full" asChild>
                          <a href={product.vendor_url} target="_blank" rel="noopener noreferrer">
                            Shop at {product.vendor_name} <ExternalLink className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center text-muted-foreground py-10">
                    <Package className="h-10 w-10 mx-auto mb-4 opacity-30" />
                    <p>No products found matching your criteria.</p>
                    <Button variant="outline" className="mt-4" onClick={() => {
                      setSearchQuery("");
                      setCategory("");
                      setSortBy("rating");
                      setActiveTab("all");
                    }}>
                      Reset Filters
                    </Button>
                  </div>
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
