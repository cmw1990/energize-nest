
import React, { useState, useEffect } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LandingHeader } from "@/components/layout/LandingHeader";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { 
  Cigarette, Search, Filter, Star, Package, 
  Info, AlertTriangle, ChevronRight, ExternalLink,
  ThumbsUp, ThumbsDown, Leaf, BarChart2, CircleDollarSign
} from "lucide-react";

interface NicotineProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  strength: number;
  flavor: string;
  ingredients?: string[];
  concerns?: string[];
  rating?: number;
  reviews_count?: number;
  price?: number;
  currency?: string;
  image_url?: string;
  description?: string;
  benefits?: string[];
  usage_instructions?: string;
  is_prescription?: boolean;
  tags?: string[];
}

const ProductFeatureCard = ({ title, description, icon }: { title: string; description: string; icon: React.ReactNode }) => (
  <Card className="bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 border-blue-100 dark:border-blue-800/30">
    <CardContent className="p-6 flex flex-col items-center text-center">
      <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-800/30 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function SmokelessNicotineDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStrength, setSelectedStrength] = useState<string>("");
  const [selectedFlavor, setSelectedFlavor] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popularity");
  const [activeTab, setActiveTab] = useState("products");

  // Fetch products from Supabase
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['smokeless-nicotine-products'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('smokeless_products')
          .select('*');
        
        if (error) throw error;
        return data || [];
      } catch (error) {
        console.error("Error fetching products:", error);
        // Return mock data for development/testing
        return getMockProducts();
      }
    }
  });

  // Filter products based on user selections
  const filteredProducts = React.useMemo(() => {
    let filtered = [...products] as NicotineProduct[];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p => p.name.toLowerCase().includes(query) || 
             p.brand.toLowerCase().includes(query) || 
             p.description?.toLowerCase().includes(query) ||
             p.flavor?.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    // Filter by strength
    if (selectedStrength) {
      const [min, max] = selectedStrength.split('-').map(Number);
      filtered = filtered.filter(p => {
        const strength = p.strength;
        return strength >= min && (max ? strength <= max : true);
      });
    }
    
    // Filter by flavor
    if (selectedFlavor) {
      filtered = filtered.filter(p => p.flavor?.toLowerCase() === selectedFlavor.toLowerCase());
    }
    
    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_low':
          return (a.price || 0) - (b.price || 0);
        case 'price_high':
          return (b.price || 0) - (a.price || 0);
        case 'strength_low':
          return a.strength - b.strength;
        case 'strength_high':
          return b.strength - a.strength;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'popularity':
        default:
          return (b.reviews_count || 0) - (a.reviews_count || 0);
      }
    });
    
    return filtered;
  }, [products, searchQuery, selectedCategory, selectedStrength, selectedFlavor, sortBy]);

  // Extract unique values for filters
  const categories = [...new Set(products.map(p => p.category))];
  const flavors = [...new Set(products.map(p => p.flavor).filter(Boolean))];
  
  // Strength ranges for filter
  const strengthRanges = [
    { label: "Low (1-10mg)", value: "1-10" },
    { label: "Medium (11-20mg)", value: "11-20" },
    { label: "High (21-50mg)", value: "21-50" },
    { label: "Extra High (50+mg)", value: "50-999" }
  ];

  return (
    <ToolAnalyticsWrapper toolName="smokeless-nicotine-directory" toolType="directory">
      <div className="min-h-screen bg-background">
        <LandingHeader />
        <div className="container mx-auto p-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Cigarette className="h-6 w-6 text-primary" />
                <CardTitle>Smokeless Nicotine Directory</CardTitle>
              </div>
              <CardDescription>
                Explore alternatives to smoking with our comprehensive guide to smokeless nicotine products.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs 
                defaultValue={activeTab} 
                onValueChange={setActiveTab}
                className="space-y-6"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="vendors">Vendors</TabsTrigger>
                </TabsList>
                
                <TabsContent value="products" className="space-y-6">
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
                    
                    <div className="flex flex-wrap gap-3 md:gap-4">
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[180px]">
                          <Filter className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Categories</SelectItem>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedStrength} onValueChange={setSelectedStrength}>
                        <SelectTrigger className="w-[180px]">
                          <BarChart2 className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Strength" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Strengths</SelectItem>
                          {strengthRanges.map(range => (
                            <SelectItem key={range.value} value={range.value}>
                              {range.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={selectedFlavor} onValueChange={setSelectedFlavor}>
                        <SelectTrigger className="w-[180px]">
                          <Leaf className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Flavor" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Flavors</SelectItem>
                          {flavors.map(flavor => (
                            <SelectItem key={flavor} value={flavor}>
                              {flavor}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popularity">Most Popular</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="price_low">Price: Low to High</SelectItem>
                          <SelectItem value="price_high">Price: High to Low</SelectItem>
                          <SelectItem value="strength_low">Strength: Low to High</SelectItem>
                          <SelectItem value="strength_high">Strength: High to Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {isLoading ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {[...Array(8)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                          <div className="h-48 bg-muted rounded-t-lg"></div>
                          <CardHeader>
                            <div className="h-5 bg-muted rounded w-3/4"></div>
                            <div className="h-4 bg-muted rounded w-1/2"></div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="h-4 bg-muted rounded w-full"></div>
                            <div className="h-4 bg-muted rounded w-5/6"></div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : filteredProducts.length > 0 ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {filteredProducts.map((product) => (
                        <Card key={product.id} className="flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                          <div className="h-48 bg-muted relative overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted">
                                <Package className="h-12 w-12 text-muted-foreground/50" />
                              </div>
                            )}
                            {product.category && (
                              <Badge className="absolute top-2 right-2">{product.category}</Badge>
                            )}
                          </div>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{product.name}</CardTitle>
                                <CardDescription>{product.brand}</CardDescription>
                              </div>
                              {product.strength && (
                                <Badge variant={product.strength > 20 ? "destructive" : "secondary"} className="ml-2">
                                  {product.strength}mg
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent className="pb-2 flex-grow">
                            {product.description && (
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {product.description}
                              </p>
                            )}
                            <div className="flex justify-between text-sm">
                              {product.flavor && <span>Flavor: {product.flavor}</span>}
                              {product.rating && (
                                <span className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-500 mr-1 inline" />
                                  {product.rating.toFixed(1)}
                                  {product.reviews_count && <span className="text-muted-foreground ml-1">({product.reviews_count})</span>}
                                </span>
                              )}
                            </div>
                            {product.concerns && product.concerns.length > 0 && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50 dark:text-yellow-400 dark:border-yellow-900/30 dark:bg-yellow-900/10">
                                  <AlertTriangle className="h-3 w-3 mr-1" />
                                  Health concerns
                                </Badge>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="pt-0">
                            <div className="w-full flex items-center justify-between">
                              {product.price ? (
                                <span className="font-medium">{product.currency || '$'}{product.price.toFixed(2)}</span>
                              ) : (
                                <span className="text-muted-foreground">Price varies</span>
                              )}
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium">No products match your criteria</h3>
                      <p className="text-muted-foreground mt-2">Try adjusting your filters or search terms.</p>
                      <Button variant="outline" className="mt-4" onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("");
                        setSelectedStrength("");
                        setSelectedFlavor("");
                      }}>
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="education" className="space-y-8">
                  <div className="grid gap-6 md:grid-cols-3">
                    <ProductFeatureCard
                      title="How Smokeless Products Work"
                      description="Learn about the different delivery mechanisms and how they affect nicotine absorption."
                      icon={<Info className="h-5 w-5 text-blue-500" />}
                    />
                    <ProductFeatureCard
                      title="Health Considerations"
                      description="Understand potential health impacts and how they compare to traditional smoking."
                      icon={<AlertTriangle className="h-5 w-5 text-yellow-500" />}
                    />
                    <ProductFeatureCard
                      title="Harm Reduction"
                      description="Discover how smokeless products can be part of a harm reduction strategy."
                      icon={<ThumbsUp className="h-5 w-5 text-green-500" />}
                    />
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Types of Smokeless Nicotine Products</CardTitle>
                      <CardDescription>
                        Compare the different options to find what might work best for you
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {[
                          {
                            title: "Nicotine Pouches",
                            desc: "Tobacco-free pouches containing nicotine, flavorings, and plant-based fibers.",
                            pros: ["Tobacco-free", "Discrete with no spitting", "Various flavors and strengths"],
                            cons: ["Can irritate gums", "May cause hiccups or nausea", "Limited long-term studies"]
                          },
                          {
                            title: "Nicotine Lozenges",
                            desc: "Hard candy-like products that dissolve in the mouth, releasing nicotine.",
                            pros: ["Easy to use", "Precise dosing", "FDA-approved for quitting"],
                            cons: ["Can cause throat irritation", "May lead to hiccups", "Slow onset of action"]
                          },
                          {
                            title: "Nicotine Gum",
                            desc: "Chewing gum that releases nicotine when chewed and then 'parked' between cheek and gum.",
                            pros: ["Widely available", "User-controlled dosing", "FDA-approved for quitting"],
                            cons: ["Specific chewing technique required", "Can cause jaw soreness", "May stick to dental work"]
                          },
                        ].map((item, i) => (
                          <div key={i} className="p-4 rounded-lg border">
                            <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                            <p className="text-muted-foreground mb-4">{item.desc}</p>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium flex items-center mb-2 text-green-600 dark:text-green-400">
                                  <ThumbsUp className="h-4 w-4 mr-2" />
                                  Pros
                                </h4>
                                <ul className="space-y-1">
                                  {item.pros.map((pro, j) => (
                                    <li key={j} className="text-sm flex items-start">
                                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                                      <span>{pro}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium flex items-center mb-2 text-red-600 dark:text-red-400">
                                  <ThumbsDown className="h-4 w-4 mr-2" />
                                  Cons
                                </h4>
                                <ul className="space-y-1">
                                  {item.cons.map((con, j) => (
                                    <li key={j} className="text-sm flex items-start">
                                      <ChevronRight className="h-4 w-4 mr-1 flex-shrink-0" />
                                      <span>{con}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30 rounded-lg p-6 space-y-4">
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <Info className="h-5 w-5 text-blue-500" />
                      Disclaimer
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This directory is for informational purposes only. None of these products are completely risk-free, and all contain nicotine, which is addictive. The best option for your health is to not use nicotine or tobacco products at all. Consult with a healthcare professional before using nicotine products.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="vendors" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Featured Vendors</CardTitle>
                      <CardDescription>
                        Reliable sources for purchasing smokeless nicotine products
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[
                          {
                            name: "PouchPro",
                            desc: "Specializing in nicotine pouches with worldwide shipping",
                            shipping: ["US", "Canada", "EU", "UK", "Australia"],
                            specialty: "Nicotine Pouches",
                            rating: 4.8
                          },
                          {
                            name: "NRT Direct",
                            desc: "Official retailer for FDA-approved nicotine replacement therapy",
                            shipping: ["US", "Canada"],
                            specialty: "Pharmaceutical NRT",
                            rating: 4.9
                          },
                          {
                            name: "VaporFi",
                            desc: "Wide selection of vaping and smokeless alternatives",
                            shipping: ["US", "UK", "Germany", "France"],
                            specialty: "Multiple Products",
                            rating: 4.5
                          },
                        ].map((vendor, i) => (
                          <Card key={i} className="border-muted/80">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{vendor.name}</CardTitle>
                              <Badge variant="outline">{vendor.specialty}</Badge>
                            </CardHeader>
                            <CardContent className="pb-2">
                              <p className="text-sm text-muted-foreground mb-2">{vendor.desc}</p>
                              <div className="text-sm">
                                <div className="font-medium mb-1">Ships to:</div>
                                <div className="flex flex-wrap gap-1">
                                  {vendor.shipping.map((country, j) => (
                                    <Badge variant="secondary" key={j} className="text-xs">{country}</Badge>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                            <CardFooter className="flex justify-between pt-0">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-medium">{vendor.rating.toFixed(1)}</span>
                              </div>
                              <Button size="sm" variant="outline" className="text-xs" asChild>
                                <a href="#" target="_blank" rel="noopener noreferrer">
                                  Visit Store
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </a>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CircleDollarSign className="h-5 w-5 text-green-500" />
                        Best Deals & Discounts
                      </CardTitle>
                      <CardDescription>
                        Current promotions from trusted vendors
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {[
                          {
                            vendor: "PouchPro",
                            deal: "25% OFF first order with code WELCOME25",
                            expires: "No expiration"
                          },
                          {
                            vendor: "NRT Direct",
                            deal: "Buy 2 Get 1 Free on all lozenges",
                            expires: "October 31, 2023"
                          },
                          {
                            vendor: "VaporFi",
                            deal: "Free shipping on orders over $50",
                            expires: "Ongoing"
                          },
                        ].map((deal, i) => (
                          <div key={i} className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <h4 className="font-medium">{deal.vendor}</h4>
                              <p className="text-sm text-muted-foreground">Expires: {deal.expires}</p>
                            </div>
                            <div className="text-green-600 dark:text-green-400 font-medium">{deal.deal}</div>
                            <Button size="sm" variant="outline">
                              Get Deal
                              <ExternalLink className="h-3 w-3 ml-2" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-lg p-6 space-y-4">
                    <h3 className="font-medium text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      Vendor Notice
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      We may earn a commission from purchases made through links on this page. Vendors are listed for informational purposes; inclusion does not constitute endorsement. Always verify age restrictions and legality in your region before purchasing nicotine products.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
}

// Mock data function for development/demonstration
function getMockProducts(): NicotineProduct[] {
  return [
    {
      id: "1",
      name: "ZYN Cool Mint",
      brand: "ZYN",
      category: "Nicotine Pouches",
      strength: 6,
      flavor: "Mint",
      ingredients: ["Nicotine", "Salt", "Plant Fibers", "Flavoring"],
      rating: 4.7,
      reviews_count: 342,
      price: 4.99,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=ZYN+Cool+Mint",
      description: "Tobacco-free nicotine pouches with a refreshing mint flavor."
    },
    {
      id: "2",
      name: "VELO Citrus",
      brand: "VELO",
      category: "Nicotine Pouches",
      strength: 4,
      flavor: "Citrus",
      rating: 4.5,
      reviews_count: 213,
      price: 4.79,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=VELO+Citrus",
      description: "Refreshing citrus-flavored nicotine pouches with a mild strength."
    },
    {
      id: "3",
      name: "Nicorette Original",
      brand: "Nicorette",
      category: "Nicotine Gum",
      strength: 2,
      flavor: "Original",
      rating: 4.3,
      reviews_count: 567,
      price: 12.99,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=Nicorette+Gum",
      description: "Classic nicotine gum for smoking cessation. FDA-approved."
    },
    {
      id: "4",
      name: "ON! Mint",
      brand: "ON!",
      category: "Nicotine Pouches",
      strength: 8,
      flavor: "Mint",
      rating: 4.6,
      reviews_count: 189,
      price: 4.89,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=ON!+Mint",
      description: "Strong mint-flavored nicotine pouches for experienced users."
    },
    {
      id: "5",
      name: "LUCY Wintergreen",
      brand: "LUCY",
      category: "Nicotine Gum",
      strength: 4,
      flavor: "Wintergreen",
      rating: 4.4,
      reviews_count: 156,
      price: 7.99,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=LUCY+Wintergreen",
      description: "Modern nicotine gum with a refreshing wintergreen flavor."
    },
    {
      id: "6",
      name: "Zyn Coffee",
      brand: "ZYN",
      category: "Nicotine Pouches",
      strength: 6,
      flavor: "Coffee",
      rating: 4.5,
      reviews_count: 178,
      price: 4.99,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=ZYN+Coffee",
      description: "Coffee-flavored nicotine pouches for a different experience."
    },
    {
      id: "7",
      name: "Nicorette Fruit Chill",
      brand: "Nicorette",
      category: "Nicotine Lozenge",
      strength: 4,
      flavor: "Fruit",
      rating: 4.2,
      reviews_count: 302,
      price: 13.99,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=Nicorette+Fruit",
      description: "Fruit-flavored lozenges that slowly release nicotine as they dissolve."
    },
    {
      id: "8",
      name: "Rogue Mango",
      brand: "Rogue",
      category: "Nicotine Pouches",
      strength: 6,
      flavor: "Mango",
      rating: 4.8,
      reviews_count: 145,
      price: 4.59,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=Rogue+Mango",
      description: "Tropical mango-flavored nicotine pouches for a fruity experience."
    },
    {
      id: "9",
      name: "Habitrol Original",
      brand: "Habitrol",
      category: "Nicotine Patch",
      strength: 21,
      flavor: "Unflavored",
      rating: 4.4,
      reviews_count: 423,
      price: 29.99,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=Habitrol+Patch",
      description: "Step 1 nicotine patches that deliver a steady dose over 24 hours."
    },
    {
      id: "10",
      name: "Nicotrol Inhaler",
      brand: "Nicotrol",
      category: "Nicotine Inhaler",
      strength: 10,
      flavor: "Unflavored",
      rating: 3.9,
      reviews_count: 132,
      price: 45.99,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=Nicotrol+Inhaler",
      description: "Nicotine inhaler that mimics the hand-to-mouth action of smoking."
    },
    {
      id: "11",
      name: "Lyft Berry Frost",
      brand: "Lyft",
      category: "Nicotine Pouches",
      strength: 4,
      flavor: "Berry",
      rating: 4.6,
      reviews_count: 210,
      price: 5.49,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=Lyft+Berry",
      description: "Berry-flavored nicotine pouches with a refreshing frost sensation."
    },
    {
      id: "12",
      name: "Nordic Spirit Bergamot Wildberry",
      brand: "Nordic Spirit",
      category: "Nicotine Pouches",
      strength: 9,
      flavor: "Wildberry",
      rating: 4.7,
      reviews_count: 167,
      price: 6.29,
      currency: "$",
      image_url: "https://placehold.co/400x400/e2e8f0/1e293b?text=Nordic+Spirit",
      description: "Unique bergamot wildberry flavor in a medium-strength nicotine pouch."
    }
  ];
}
