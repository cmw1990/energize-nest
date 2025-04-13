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
import { LandingHeader } from "@/components/layout/LandingHeader";
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { Leaf, Search, Filter, SortAsc, ExternalLink, Info, Star, MessageSquare, MapPin, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SmokelessProduct {
    id: string;
    name: string;
    brand: string;
    product_type: 'pouch' | 'gum' | 'lozenge' | 'other';
    flavor?: string;
    nicotine_strength_mg?: number;
    pouch_format?: 'slim' | 'mini' | 'large';
    description?: string;
    image_url?: string;
    rating?: number;
    reviews_count?: number;
    gum_health_rating?: number;
    chemicals_of_concern?: string[];
    vendor_name?: string;
    vendor_url?: string;
    availability_regions?: string[];
    tags?: string[];
}

const fetchSmokelessProducts = async (): Promise<SmokelessProduct[]> => {
    try {
        const { data, error } = await supabase
            .from('smokeless_products')
            .select('*')
            .order('name');
            
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching smokeless products:', error);
        return [];
    }
};

const searchProducts = async (query, filters) => {
  try {
    const { data, error } = await supabase
      .from('smokeless_nicotine_products')
      .select('*')
      .ilike('name', `%${query}%`);
    
    if (error) throw error;
    
    // Apply filters to the data
    let filtered = data || [];
    if (filters && Object.keys(filters).length > 0) {
      filtered = filtered.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.brand.toLowerCase().includes(query.toLowerCase());
        const matchesType = filters.productType === 'all' || product.product_type === filters.productType;
        const matchesStrength = filters.strengthFilter === 'all' ||
            (filters.strengthFilter === 'low' && product.nicotine_strength_mg <= 4) ||
            (filters.strengthFilter === 'medium' && product.nicotine_strength_mg > 4 && product.nicotine_strength_mg <= 8) ||
            (filters.strengthFilter === 'high' && product.nicotine_strength_mg > 8);
        return matchesSearch && matchesType && matchesStrength;
      });
    }
    
    return filtered;
  } catch (error) {
    console.error('Error searching products:', error);
    return [];
  }
};

export default function SmokelessNicotineDirectory() {
    const [searchQuery, setSearchQuery] = useState('');
    const [productType, setProductType] = useState<string>('all');
    const [sortBy, setSortBy] = useState<string>('name');
    const [strengthFilter, setStrengthFilter] = useState<string>('all');

    const { data: products = [], isLoading } = useQuery(
        ['smokeless-products'],
        fetchSmokelessProducts,
        {
            staleTime: 5 * 60 * 1000, // 5 minutes
            cacheTime: 30 * 60 * 1000, // 30 minutes
        }
    );

    const filteredAndSortedProducts = useMemo(() => {
        return products
            .filter(product => {
                const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.brand.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesType = productType === 'all' || product.product_type === productType;
                const matchesStrength = strengthFilter === 'all' ||
                    (strengthFilter === 'low' && product.nicotine_strength_mg <= 4) ||
                    (strengthFilter === 'medium' && product.nicotine_strength_mg > 4 && product.nicotine_strength_mg <= 8) ||
                    (strengthFilter === 'high' && product.nicotine_strength_mg > 8);
                return matchesSearch && matchesType && matchesStrength;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'name':
                        return a.name.localeCompare(b.name);
                    case 'rating':
                        return (b.rating || 0) - (a.rating || 0);
                    case 'strength':
                        return (b.nicotine_strength_mg || 0) - (a.nicotine_strength_mg || 0);
                    case 'reviews':
                        return (b.reviews_count || 0) - (a.reviews_count || 0);
                    default:
                        return 0;
                }
            });
    }, [products, searchQuery, productType, sortBy, strengthFilter]);

    const content = (
        <div className="min-h-screen bg-background">
            <LandingHeader 
                title="Smokeless Nicotine Directory" 
                description="Browse and compare smokeless nicotine alternatives"
                icon={<Leaf className="h-6 w-6" />}
            />
            <div className="container mx-auto px-4 py-8">
                <Card>
                    <CardHeader>
                        <Alert>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Important Health Information</AlertTitle>
                            <AlertDescription>
                                While smokeless alternatives may be less harmful than smoking, they still contain nicotine and are not risk-free. Consult healthcare professionals before use.
                            </AlertDescription>
                        </Alert>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1">
                                <SearchInput
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full"
                                    icon={<Search className="h-4 w-4" />}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={productType} onValueChange={setProductType}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Product Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="pouch">Pouches</SelectItem>
                                        <SelectItem value="gum">Gum</SelectItem>
                                        <SelectItem value="lozenge">Lozenges</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={strengthFilter} onValueChange={setStrengthFilter}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Strength" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Strengths</SelectItem>
                                        <SelectItem value="low">Low (≤4mg)</SelectItem>
                                        <SelectItem value="medium">Medium (4-8mg)</SelectItem>
                                        <SelectItem value="high">High (&gt;8mg)</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Sort By" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="name">Name</SelectItem>
                                        <SelectItem value="rating">Rating</SelectItem>
                                        <SelectItem value="strength">Strength</SelectItem>
                                        <SelectItem value="reviews">Most Reviews</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Product Grid */}
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
                                            <CardDescription>{product.brand} - {product.flavor}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-2 flex-grow text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Strength:</span>
                                                <span className="font-medium">{product.nicotine_strength_mg}mg</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Format:</span>
                                                <span className="font-medium capitalize">{product.pouch_format}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Rating:</span>
                                                <span className="font-medium">
                                                    {product.rating ? `⭐ ${product.rating.toFixed(1)} (${product.reviews_count})` : 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Gum Health:</span>
                                                <span className="font-medium">
                                                    {product.gum_health_rating ? `${product.gum_health_rating}/5` : 'N/A'}
                                                </span>
                                            </div>
                                            {product.description && (
                                                <p className="text-xs text-muted-foreground pt-2 line-clamp-2">
                                                    {product.description}
                                                </p>
                                            )}
                                        </CardContent>
                                        <CardFooter className="flex-col items-stretch gap-2">
                                            <Button className="w-full" variant="outline" size="sm" asChild>
                                                <a href={product.vendor_url || '#'} target="_blank" rel="noopener noreferrer">
                                                    View at {product.vendor_name || 'Vendor'} <ExternalLink className="ml-2 h-3 w-3" />
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
                    </CardContent>
                </Card>
            </div>
        </div>
    );

    return (
        <ToolAnalyticsWrapper 
            toolName="smokeless-nicotine-directory" 
            toolType="directory"
        >
            {content}
        </ToolAnalyticsWrapper>
    );
}

const SearchInput = ({ 
  placeholder, 
  value, 
  onChange, 
  className, 
  icon 
}: {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className: string;
  icon: React.ReactNode;
}) => (
  <div className="relative">
    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
      {icon}
    </div>
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`pl-10 pr-4 py-2 border rounded-md w-full ${className}`}
    />
  </div>
);

const InfoCard = ({ 
  title, 
  description, 
  icon 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
}) => (
  <div className="bg-card p-4 rounded-lg border shadow-sm">
    <div className="flex items-start gap-3">
      <div className="rounded-full bg-primary/10 p-2">
        {icon}
      </div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  </div>
);
