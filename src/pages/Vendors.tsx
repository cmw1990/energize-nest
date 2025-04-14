
import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, MapPin, Globe, Truck, Search, Shield, ShoppingBag, AlertCircle, ThumbsUp, ExternalLink, Star } from "lucide-react";

interface Vendor {
  id: string;
  name: string;
  website: string;
  countries_served: string[];
  product_types: string[];
  shipping_time: string;
  rating: number;
  reviews_count: number;
  has_verified_reviews: boolean;
  price_range: string;
  special_offers?: string[];
  description?: string;
}

const Vendors = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedProductType, setSelectedProductType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("rating");

  const { data: vendors, isLoading, error } = useQuery({
    queryKey: ['vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) throw error;
      return data || [];
    }
  });

  const countries = ["all", "usa", "uk", "eu", "canada", "australia", "global"];
  const productTypes = ["all", "pouch", "gum", "patch", "lozenge", "inhaler", "spray", "vape", "synthetic"];
  
  const filterVendors = (vendors: Vendor[] = []) => {
    return vendors.filter(vendor => {
      // Filter by search term
      const matchesSearch = 
        vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        vendor.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by country
      const matchesCountry = selectedCountry === "all" || 
        vendor.countries_served.includes(selectedCountry) ||
        (selectedCountry === "global" && vendor.countries_served.includes("global"));
      
      // Filter by product type
      const matchesType = selectedProductType === "all" || 
        vendor.product_types.includes(selectedProductType);
      
      return matchesSearch && matchesCountry && matchesType;
    }).sort((a, b) => {
      switch(sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews_count - a.reviews_count;
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  const filteredVendors = vendors ? filterVendors(vendors) : [];

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

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Store className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Vendor Directory</h1>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Find Reliable Vendors</CardTitle>
          <CardDescription>
            Browse trusted vendors for nicotine replacement products and smoking cessation aids
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search Vendors</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or description..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="country">Region/Country</Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select region" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map(country => (
                    <SelectItem key={country} value={country}>
                      {country === "all" ? "All Regions" : 
                       country === "usa" ? "United States" :
                       country === "uk" ? "United Kingdom" :
                       country === "eu" ? "European Union" :
                       country.charAt(0).toUpperCase() + country.slice(1)}
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
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Product Types</Label>
            <div className="flex flex-wrap gap-2">
              {productTypes.map(type => (
                <Button
                  key={type}
                  variant={selectedProductType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedProductType(type)}
                  className="capitalize"
                >
                  {type === "all" ? "All Types" : type}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center py-10">
            <div className="space-y-2 text-center">
              <div className="animate-spin mx-auto h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              <p className="text-muted-foreground">Loading vendors...</p>
            </div>
          </div>
        ) : error ? (
          <div className="col-span-full text-center py-10">
            <AlertCircle className="mx-auto h-8 w-8 text-destructive mb-2" />
            <p className="text-muted-foreground">Failed to load vendors</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <Store className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No vendors match your search criteria</p>
          </div>
        ) : (
          filteredVendors.map(vendor => (
            <Card key={vendor.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{vendor.name}</CardTitle>
                  {vendor.has_verified_reviews && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <CardDescription>
                  <div className="flex items-center gap-1 mt-1">
                    {renderStars(vendor.rating)}
                    <span className="text-sm ml-1">
                      ({vendor.reviews_count} reviews)
                    </span>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {vendor.countries_served.includes("global") ? 
                        "Global Shipping" : 
                        vendor.countries_served.map(c => 
                          c === "usa" ? "USA" : 
                          c === "uk" ? "UK" : 
                          c === "eu" ? "EU" : 
                          c.charAt(0).toUpperCase() + c.slice(1)
                        ).join(", ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.shipping_time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span>{vendor.price_range}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {vendor.product_types.slice(0, 2).map(t => 
                        t.charAt(0).toUpperCase() + t.slice(1)
                      ).join(", ")}
                      {vendor.product_types.length > 2 && " & more"}
                    </span>
                  </div>
                </div>
                
                {vendor.description && (
                  <p className="text-sm text-muted-foreground">{vendor.description}</p>
                )}
                
                {vendor.special_offers && vendor.special_offers.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {vendor.special_offers.map(offer => (
                      <Badge key={offer} variant="secondary" className="text-xs">
                        {offer}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center justify-center"
                  onClick={() => window.open(vendor.website, '_blank')}
                >
                  <Globe className="h-4 w-4 mr-2" />
                  Visit Website
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Vendors;
