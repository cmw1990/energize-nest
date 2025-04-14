
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Star, Filter, ShoppingBag, Search, Package, AlertCircle, Cigarette, Candy, Circle, Pill, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NicotineProduct {
  id: string;
  name: string;
  brand: string;
  type: string;
  strength_mg: number;
  flavor: string;
  rating: number;
  price_range: string;
  image_url?: string;
  description?: string;
  chemical_concerns?: string[];
  gum_health_rating?: number;
  availability: string[];
}

const NicotineProducts = () => {
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [strengthRange, setStrengthRange] = useState<[number, number]>([0, 50]);
  const [sortBy, setSortBy] = useState<string>("rating");

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['nicotine-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nicotine_products')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const productTypes = ["all", "pouch", "gum", "patch", "lozenge", "inhaler", "spray", "toothpick"];
  
  const filterProducts = (products: NicotineProduct[] = []) => {
    return products.filter(product => {
      // Filter by search term
      const matchesSearch = 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.flavor.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by product type
      const matchesType = selectedType === "all" || product.type === selectedType;
      
      // Filter by strength range
      const matchesStrength = 
        product.strength_mg >= strengthRange[0] && 
        product.strength_mg <= strengthRange[1];
      
      return matchesSearch && matchesType && matchesStrength;
    }).sort((a, b) => {
      switch(sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "strength_asc":
          return a.strength_mg - b.strength_mg;
        case "strength_desc":
          return b.strength_mg - a.strength_mg;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const filteredProducts = products ? filterProducts(products) : [];

  // Function to render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };

  // Function to render product type icon
  const getProductIcon = (type: string) => {
    switch(type) {
      case "pouch":
        return <Circle className="h-5 w-5" />;
      case "gum":
        return <Candy className="h-5 w-5" />;
      case "patch":
        return <Package className="h-5 w-5" />;
      case "lozenge":
        return <Pill className="h-5 w-5" />;
      case "inhaler":
      case "spray":
        return <Zap className="h-5 w-5" />;
      default:
        return <Cigarette className="h-5 w-5" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">NRT Products Directory</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Find Your Perfect Nicotine Replacement</CardTitle>
          <CardDescription>
            Browse our comprehensive directory of nicotine replacement therapy products to support your journey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name, brand, or flavor..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Product Type</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger id="sort">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="strength_asc">Strength (Low to High)</SelectItem>
                  <SelectItem value="strength_desc">Strength (High to Low)</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Nicotine Strength (mg)</Label>
              <span className="text-sm text-muted-foreground">
                {strengthRange[0]} mg - {strengthRange[1]} mg
              </span>
            </div>
            <Slider
              value={strengthRange}
              min={0}
              max={50}
              step={1}
              onValueChange={setStrengthRange}
              className="py-4"
            />
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="flex w-full max-w-md mx-auto overflow-x-auto">
          {productTypes.slice(0, 6).map(type => (
            <TabsTrigger key={type} value={type} onClick={() => setSelectedType(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {productTypes.map(type => (
          <TabsContent key={type} value={type} className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-full flex justify-center py-10">
                  <div className="space-y-2 text-center">
                    <div className="animate-spin mx-auto h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                    <p className="text-muted-foreground">Loading products...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="col-span-full text-center py-10">
                  <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
                  <p className="text-muted-foreground">Failed to load products</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="col-span-full text-center py-10">
                  <Package className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground">No products match your search criteria</p>
                </div>
              ) : (
                filteredProducts.map(product => (
                  <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-32 bg-muted flex items-center justify-center p-4">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="h-full object-contain" 
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                          {getProductIcon(product.type)}
                          <span className="text-xs mt-1 capitalize">{product.type}</span>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="capitalize">
                          {product.type}
                        </Badge>
                        <Badge 
                          variant={product.strength_mg < 10 ? "outline" : (product.strength_mg < 25 ? "secondary" : "destructive")}
                        >
                          {product.strength_mg}mg
                        </Badge>
                      </div>
                      <h3 className="font-semibold truncate">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                      <div className="flex justify-between items-center">
                        {renderStars(product.rating)}
                        <span className="text-sm font-medium">{product.price_range}</span>
                      </div>
                      {product.flavor && (
                        <p className="text-xs text-muted-foreground mt-2">Flavor: {product.flavor}</p>
                      )}
                      {product.chemical_concerns && product.chemical_concerns.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                          {product.chemical_concerns.map(concern => (
                            <Badge key={concern} variant="destructive" className="text-[10px] py-0">
                              {concern}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default NicotineProducts;
