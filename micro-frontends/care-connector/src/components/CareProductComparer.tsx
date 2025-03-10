import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Search, Filter, Check, Star, ShoppingCart, DollarSign, Tag, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { careProductsApi } from '@/api/care8ConnectorApi';

interface CareProductComparerProps {
  session: Session | null;
}

const CareProductComparer: React.FC<CareProductComparerProps> = ({ session }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [productType, setProductType] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [sortBy, setSortBy] = useState('popular');
  const [compareList, setCompareList] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const filters: Record<string, any> = {};
        
        if (productType !== 'all') {
          filters.type = productType;
        }
        
        if (priceRange[0] > 0) {
          filters.priceMin = priceRange[0];
        }
        
        if (priceRange[1] < 500) {
          filters.priceMax = priceRange[1];
        }
        
        const { data, error } = await careProductsApi.getProducts(filters);
        
        if (error) {
          throw new Error(error.message || 'Failed to fetch products');
        }
        
        if (data) {
          // Sort products based on sortBy value
          let sortedProducts = [...data];
          
          switch (sortBy) {
            case 'popular':
              sortedProducts = sortedProducts.filter(p => p.popular).concat(sortedProducts.filter(p => !p.popular));
              break;
            case 'rating':
              sortedProducts.sort((a, b) => b.rating - a.rating);
              break;
            case 'price-low':
              sortedProducts.sort((a, b) => a.price - b.price);
              break;
            case 'price-high':
              sortedProducts.sort((a, b) => b.price - a.price);
              break;
            case 'newest':
              sortedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              break;
          }
          
          setProducts(sortedProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again later.');
        
        // Fallback to mock data in case of error
        setProducts([
          {
            id: 1,
            name: 'Mobility Pro Walker',
            type: 'Mobility',
            category: 'Walkers',
            image: '/images/walker.jpg',
            rating: 4.8,
            reviewCount: 125,
            price: 89.99,
            features: [
              'Adjustable height',
              'Foldable design',
              'Built-in seat',
              'Storage basket',
              '300lb weight capacity'
            ],
            description: 'Premium walker with seat for seniors and those with limited mobility. Features an easy-fold design for transport and storage.',
            inStock: true,
            freeShipping: true,
            popular: true
          },
          {
            id: 2,
            name: 'Automatic Pill Dispenser',
            type: 'Medication',
            category: 'Dispensers',
            image: '/images/pill-dispenser.jpg',
            rating: 4.6,
            reviewCount: 89,
            price: 129.99,
            features: [
              'Programmable alarms',
              '14-day capacity',
              'Lockable design',
              'Battery backup',
              'Medication alerts'
            ],
            description: 'Automatic pill dispenser with alarms and 14 daily compartments to ensure medication is taken on schedule.',
            inStock: true,
            freeShipping: true,
            popular: false
          },
          {
            id: 3,
            name: 'Digital Blood Pressure Monitor',
            type: 'Health Monitoring',
            category: 'Vitals',
            image: '/images/bp-monitor.jpg',
            rating: 4.7,
            reviewCount: 213,
            price: 59.99,
            features: [
              'Large display',
              'Memory for 60 readings',
              'Irregular heartbeat detection',
              'Cuff fits arms 8.7" to 16.5"',
              'Portable design'
            ],
            description: 'Easy-to-use digital blood pressure monitor with large display and memory function for tracking readings over time.',
            inStock: true,
            freeShipping: false,
            popular: true
          },
          {
            id: 4,
            name: 'Premium Bed Rail',
            type: 'Bedroom',
            category: 'Safety',
            image: '/images/bed-rail.jpg',
            rating: 4.5,
            reviewCount: 78,
            price: 79.99,
            features: [
              'Tool-free assembly',
              'Adjustable length',
              'Padded handle',
              'Fits most beds',
              'Folds down when not in use'
            ],
            description: 'Adjustable bed rail that provides support when getting in and out of bed. Features a padded handle for comfort.',
            inStock: false,
            freeShipping: true,
            popular: false
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [productType, priceRange, sortBy]);

  // Handle search button click
  const handleSearch = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filters: Record<string, any> = {};
      
      if (productType !== 'all') {
        filters.type = productType;
      }
      
      if (priceRange[0] > 0) {
        filters.priceMin = priceRange[0];
      }
      
      if (priceRange[1] < 500) {
        filters.priceMax = priceRange[1];
      }
      
      const { data, error } = await careProductsApi.getProducts(filters);
      
      if (error) {
        throw new Error(error.message || 'Failed to fetch products');
      }
      
      if (data) {
        // Filter by search term if provided
        let filteredProducts = data;
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase().trim();
          filteredProducts = data.filter(product => 
            product.name.toLowerCase().includes(term) || 
            product.description.toLowerCase().includes(term) ||
            product.type.toLowerCase().includes(term) ||
            product.category.toLowerCase().includes(term)
          );
        }
        
        // Sort products based on sortBy value
        let sortedProducts = [...filteredProducts];
        
        switch (sortBy) {
          case 'popular':
            sortedProducts = sortedProducts.filter(p => p.popular).concat(sortedProducts.filter(p => !p.popular));
            break;
          case 'rating':
            sortedProducts.sort((a, b) => b.rating - a.rating);
            break;
          case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            sortedProducts.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
        }
        
        setProducts(sortedProducts);
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Failed to search products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompareToggle = (id: number) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(productId => productId !== id));
    } else {
      if (compareList.length < 4) {
        setCompareList([...compareList, id]);
      }
    }
  };

  const productsToCompare = products.filter(product => compareList.includes(product.id));

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Care Product Comparer</h1>
        <p className="text-gray-600 dark:text-gray-400">Find, compare and discover the best care products for your needs</p>
      </div>
      
      <Tabs defaultValue="search" className="mb-8">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Browse Products</TabsTrigger>
          <TabsTrigger value="compare" disabled={compareList.length === 0}>
            Compare Products ({compareList.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="mt-6">
          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search for care products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="md:w-auto w-full"
              >
                <Filter className="mr-2" size={16} />
                Filters
              </Button>
              <Button className="md:w-auto w-full" onClick={handleSearch}>
                <Search className="mr-2" size={16} />
                Search
              </Button>
            </div>
            
            {/* Filter Options */}
            {showFilters && (
              <Card className="mb-4">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Type</label>
                      <Select value={productType} onValueChange={setProductType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Product Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Product Types</SelectItem>
                          <SelectItem value="mobility">Mobility Aids</SelectItem>
                          <SelectItem value="bedroom">Bedroom & Safety</SelectItem>
                          <SelectItem value="bathroom">Bathroom Aids</SelectItem>
                          <SelectItem value="medication">Medication Management</SelectItem>
                          <SelectItem value="monitoring">Health Monitoring</SelectItem>
                          <SelectItem value="daily-living">Daily Living Aids</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Price Range (${priceRange[0]} - ${priceRange[1]})</label>
                      <Slider
                        defaultValue={[0, 500]}
                        max={500}
                        step={10}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        className="mt-4"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Sort by</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="popular">Most Popular</SelectItem>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="newest">Newest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      In Stock Only
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      Free Shipping
                    </Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                      On Sale
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {isLoading ? 'Loading products...' : `${products.length} Products`}
            </h2>
            <div className="flex space-x-2">
              <Button 
                variant={viewMode === 'grid' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('grid')}
                className="px-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
              </Button>
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setViewMode('list')}
                className="px-3"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* No Results State */}
          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <Package className="h-16 w-16 text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {/* Product Cards */}
          {!isLoading && !error && products.length > 0 && (
            <>
              {viewMode === 'grid' ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <div className="h-48 bg-gray-100 relative">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full h-full object-contain p-4"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <Package className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        {product.popular && (
                          <Badge className="absolute top-3 left-3 bg-blue-600">Popular</Badge>
                        )}
                        {!product.inStock && (
                          <Badge variant="destructive" className="absolute top-3 right-3">Out of Stock</Badge>
                        )}
                      </div>
                      
                      <CardContent className="p-6">
                        <div className="mb-2">
                          <Badge variant="secondary" className="mb-2">{product.type}</Badge>
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold">{product.name}</h3>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="font-medium">{product.rating}</span>
                              <span className="text-sm text-gray-500 ml-1">({product.reviewCount})</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center mb-3 text-lg font-bold text-blue-700">
                          <DollarSign className="h-4 w-4" />
                          {product.price.toFixed(2)}
                          {product.freeShipping && (
                            <Badge variant="outline" className="ml-2 text-xs">Free Shipping</Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                        
                        <div className="flex flex-wrap gap-1 mb-4">
                          {product.features.slice(0, 3).map((feature, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Check className="h-3 w-3 mr-1" /> {feature}
                            </Badge>
                          ))}
                          {product.features.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{product.features.length - 3} more
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            className="flex-1"
                            disabled={!product.inStock}
                          >
                            <ShoppingCart className="mr-1 h-4 w-4" /> 
                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                          </Button>
                          <Button 
                            variant={compareList.includes(product.id) ? "destructive" : "outline"} 
                            onClick={() => handleCompareToggle(product.id)}
                            disabled={compareList.length >= 4 && !compareList.includes(product.id)}
                            className="flex-grow-0"
                          >
                            {compareList.includes(product.id) ? 'Remove' : 'Compare'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map(product => (
                    <Card key={product.id} className="overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="w-full md:w-1/4 bg-gray-100 h-40 relative">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-contain p-4"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <Package className="h-12 w-12 text-gray-400" />
                              </div>
                            )}
                            {product.popular && (
                              <Badge className="absolute top-3 left-3 bg-blue-600">Popular</Badge>
                            )}
                            {!product.inStock && (
                              <Badge variant="destructive" className="absolute top-3 right-3">Out of Stock</Badge>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <Badge variant="secondary">{product.type}</Badge>
                              <Badge variant="outline">{product.category}</Badge>
                              {product.freeShipping && <Badge variant="outline">Free Shipping</Badge>}
                            </div>
                            
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-bold">{product.name}</h3>
                              <div className="text-lg font-bold text-blue-700">${product.price.toFixed(2)}</div>
                            </div>
                            
                            <div className="flex items-center mb-3">
                              <Star className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="font-medium">{product.rating}</span>
                              <span className="text-sm text-gray-500 ml-1">({product.reviewCount} reviews)</span>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                            
                            <div className="flex flex-wrap gap-1 mb-4">
                              {product.features.map((feature, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Check className="h-3 w-3 mr-1" /> {feature}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                className="w-40"
                                disabled={!product.inStock}
                              >
                                <ShoppingCart className="mr-1 h-4 w-4" /> 
                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                              </Button>
                              <Button 
                                variant={compareList.includes(product.id) ? "destructive" : "outline"} 
                                onClick={() => handleCompareToggle(product.id)}
                                disabled={compareList.length >= 4 && !compareList.includes(product.id)}
                                className="w-40"
                              >
                                {compareList.includes(product.id) ? 'Remove from Compare' : 'Add to Compare'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </TabsContent>
        
        <TabsContent value="compare" className="mt-6">
          {productsToCompare.length > 0 ? (
            <div>
              <div className="mb-4 flex justify-between items-center">
                <h2 className="text-xl font-semibold">Comparing {productsToCompare.length} Products</h2>
                <Button variant="outline" size="sm" onClick={() => setCompareList([])}>
                  Clear All
                </Button>
              </div>
              
              <div className="overflow-x-auto pb-4">
                <table className="min-w-full bg-white rounded-lg overflow-hidden border">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/5">
                        Feature
                      </th>
                      {productsToCompare.map(product => (
                        <th key={product.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {product.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                        Image
                      </td>
                      {productsToCompare.map(product => (
                        <td key={product.id} className="px-6 py-4 text-sm text-gray-600">
                          <div className="h-24 w-24 bg-gray-100 flex items-center justify-center">
                            {product.image ? (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="max-h-full max-w-full object-contain p-2"
                              />
                            ) : (
                              <Package className="h-8 w-8 text-gray-400" />
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                        Type
                      </td>
                      {productsToCompare.map(product => (
                        <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {product.type} ({product.category})
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                        Price
                      </td>
                      {productsToCompare.map(product => (
                        <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-700">
                          ${product.price.toFixed(2)}
                          {product.freeShipping && (
                            <Badge variant="outline" className="ml-2 text-xs">Free Shipping</Badge>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                        Rating
                      </td>
                      {productsToCompare.map(product => (
                        <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{product.rating} ({product.reviewCount} reviews)</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                        Features
                      </td>
                      {productsToCompare.map(product => (
                        <td key={product.id} className="px-6 py-4 text-sm text-gray-600">
                          <ul className="list-disc pl-5 space-y-1">
                            {product.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                        Availability
                      </td>
                      {productsToCompare.map(product => (
                        <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {product.inStock ? (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">In Stock</Badge>
                          ) : (
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Out of Stock</Badge>
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50">
                        Actions
                      </td>
                      {productsToCompare.map(product => (
                        <td key={product.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex flex-col gap-2">
                            <Button size="sm" disabled={!product.inStock}>
                              <ShoppingCart className="mr-2 h-3 w-3" />
                              Add to Cart
                            </Button>
                            <Button size="sm" variant="outline">View Details</Button>
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">No Products to Compare</h3>
              <p className="text-gray-500 mb-4">Select up to 4 products to compare their features side by side.</p>
              <Button onClick={() => {
                const element = document.querySelector('[data-value="search"]');
                if (element instanceof HTMLElement) {
                  element.click();
                }
              }}>
                Browse Products
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareProductComparer; 