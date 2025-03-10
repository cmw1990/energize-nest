import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  Search,
  Filter,
  Star,
  ShoppingCart,
  Heart,
  ChevronDown,
  Check,
  Tag,
  Truck,
  Info,
  ArrowRight,
  Plus,
  Minus
} from 'lucide-react';

interface MarketplaceProps {
  session: Session | null;
  supabaseClient?: SupabaseClient;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviewCount: number;
  imageUrl: string | null;
  category: 'nrt' | 'medication' | 'alternative' | 'education';
  tags: string[];
  inStock: boolean;
  discountPercent?: number;
  freeShipping?: boolean;
}

const Marketplace: React.FC<MarketplaceProps> = ({ session, supabaseClient }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<{ productId: string; quantity: number }[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  // Load mock data
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      
      try {
        // Mock data for development
        const mockProducts: Product[] = [
          {
            id: '1',
            name: 'Nicotine Replacement Patches',
            description: 'Step 1 (21mg) patches for the first phase of quitting. Each box contains 14 patches, a 2-week supply.',
            price: 29.99,
            rating: 4.8,
            reviewCount: 124,
            imageUrl: null,
            category: 'nrt',
            tags: ['nicotine replacement', 'patches', 'step 1'],
            inStock: true,
            freeShipping: true
          },
          {
            id: '2',
            name: 'Nicotine Gum (2mg)',
            description: 'Mint flavored nicotine gum for managing cravings. Box of 100 pieces.',
            price: 24.95,
            rating: 4.6,
            reviewCount: 98,
            imageUrl: null,
            category: 'nrt',
            tags: ['nicotine replacement', 'gum', 'mint'],
            inStock: true,
            discountPercent: 10
          },
          {
            id: '3',
            name: 'Quit Smoking Guide Book',
            description: 'Comprehensive guidebook with strategies and tips to help you quit smoking for good.',
            price: 14.99,
            rating: 4.5,
            reviewCount: 72,
            imageUrl: null,
            category: 'education',
            tags: ['book', 'guide', 'strategies'],
            inStock: true
          },
          {
            id: '4',
            name: 'Herbal Stress Relief Tea',
            description: 'Natural herbal tea blend designed to reduce stress and help manage cravings.',
            price: 12.95,
            rating: 4.2,
            reviewCount: 45,
            imageUrl: null,
            category: 'alternative',
            tags: ['herbal', 'tea', 'stress relief'],
            inStock: true,
            freeShipping: true
          },
          {
            id: '5',
            name: 'Prescription Medication (Generic)',
            description: 'Prescription-only medication that helps reduce nicotine cravings and withdrawal symptoms.',
            price: 75.00,
            rating: 4.7,
            reviewCount: 112,
            imageUrl: null,
            category: 'medication',
            tags: ['prescription', 'medication'],
            inStock: false
          },
          {
            id: '6',
            name: 'Nicotine Lozenges (4mg)',
            description: 'Strong mint lozenges for managing intense cravings. Box of 72 lozenges.',
            price: 32.99,
            rating: 4.5,
            reviewCount: 87,
            imageUrl: null,
            category: 'nrt',
            tags: ['nicotine replacement', 'lozenges', 'mint'],
            inStock: true,
            discountPercent: 15
          },
          {
            id: '7',
            name: 'Craving Tracker Journal',
            description: 'Daily journal designed to track and analyze your cravings, triggers, and progress.',
            price: 9.95,
            rating: 4.3,
            reviewCount: 53,
            imageUrl: null,
            category: 'education',
            tags: ['journal', 'tracker', 'progress'],
            inStock: true
          },
          {
            id: '8',
            name: 'Oral Fixation Replacement Tool',
            description: 'Helps manage the hand-to-mouth habit and oral fixation aspects of smoking.',
            price: 19.99,
            rating: 3.9,
            reviewCount: 38,
            imageUrl: null,
            category: 'alternative',
            tags: ['oral fixation', 'habit replacement'],
            inStock: true
          }
        ];
        
        setProducts(mockProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, [session, supabaseClient]);

  // Filter products based on search query and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort products based on sort option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low-high':
        return a.price - b.price;
      case 'price-high-low':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        // This would normally use creation date, using id for mock
        return parseInt(b.id) - parseInt(a.id);
      default: // recommended
        // For recommended, prioritize rating and discount
        const aScore = a.rating * 10 + (a.discountPercent || 0);
        const bScore = b.rating * 10 + (b.discountPercent || 0);
        return bScore - aScore;
    }
  });

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'nrt':
        return 'Nicotine Replacement Therapy';
      case 'medication':
        return 'Prescription Medication';
      case 'alternative':
        return 'Alternative Therapies';
      case 'education':
        return 'Educational Materials';
      default:
        return 'All Products';
    }
  };

  // Calculate cart total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return total;
      
      const price = product.discountPercent 
        ? product.price * (1 - product.discountPercent / 100) 
        : product.price;
      
      return total + (price * item.quantity);
    }, 0);
  };

  // Add to cart
  const addToCart = (productId: string) => {
    setCartItems(current => {
      const existing = current.find(item => item.productId === productId);
      
      if (existing) {
        return current.map(item => 
          item.productId === productId 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        return [...current, { productId, quantity: 1 }];
      }
    });
  };

  // Update cart quantity
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCartItems(current => current.filter(item => item.productId !== productId));
      return;
    }
    
    setCartItems(current => 
      current.map(item => 
        item.productId === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Get cart item count
  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quit Smoking Marketplace</h1>
        <button
          className="relative p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
          onClick={() => setShowCart(!showCart)}
        >
          <ShoppingCart className="h-5 w-5" />
          {getCartItemCount() > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {getCartItemCount()}
            </span>
          )}
        </button>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for products, brands, keywords..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center">
            <Filter className="text-gray-400 mr-2" size={18} />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="nrt">Nicotine Replacement</option>
              <option value="medication">Medications</option>
              <option value="alternative">Alternative Therapies</option>
              <option value="education">Educational Materials</option>
            </select>
          </div>
          <div className="flex items-center">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recommended">Recommended</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Products */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          {filterCategory !== 'all' 
            ? getCategoryLabel(filterCategory) 
            : 'All Products'}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({sortedProducts.length} products)
          </span>
        </h2>
        
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProducts.map(product => (
              <div key={product.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 bg-gray-100 flex items-center justify-center">
                  {/* This would be an actual image in production */}
                  <div className="text-center">
                    <div className="text-4xl mb-2">📦</div>
                    <p className="text-sm text-gray-500">Product Image</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg">{product.name}</h3>
                    <Heart className="h-5 w-5 text-gray-400 cursor-pointer hover:text-red-500" />
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600">
                      ({product.reviewCount})
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.tags.map((tag, index) => (
                      <span key={index} className="inline-block px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      {product.discountPercent ? (
                        <div>
                          <span className="text-gray-500 text-sm line-through">${product.price.toFixed(2)}</span>
                          <span className="text-xl font-bold text-gray-900 ml-2">
                            ${(product.price * (1 - product.discountPercent / 100)).toFixed(2)}
                          </span>
                          <span className="ml-2 inline-block px-2 py-0.5 rounded-md text-xs bg-red-100 text-red-800">
                            Save {product.discountPercent}%
                          </span>
                        </div>
                      ) : (
                        <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                      )}
                    </div>
                    
                    {product.freeShipping && (
                      <span className="inline-flex items-center text-xs text-green-700">
                        <Truck className="h-3 w-3 mr-1" />
                        Free Shipping
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => addToCart(product.id)}
                    className={`w-full py-2 px-4 rounded-md font-medium ${
                      product.inStock 
                        ? 'bg-green-600 text-white hover:bg-green-700' 
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    }`}
                    disabled={!product.inStock}
                  >
                    {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Search className="h-12 w-12 mx-auto text-gray-400 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900">No Products Found</h3>
            <p className="text-gray-500 mt-1">
              We couldn't find any products matching your search criteria.
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>
      
      {/* Shopping Cart */}
      {showCart && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setShowCart(false)}>
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Your Cart</h3>
                    
                    {cartItems.length === 0 ? (
                      <div className="text-center py-6">
                        <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-gray-500">Your cart is empty</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {cartItems.map(item => {
                          const product = products.find(p => p.id === item.productId);
                          if (!product) return null;
                          
                          const price = product.discountPercent 
                            ? product.price * (1 - product.discountPercent / 100) 
                            : product.price;
                          
                          return (
                            <div key={item.productId} className="flex justify-between border-b pb-3">
                              <div className="flex-1">
                                <h4 className="font-medium">{product.name}</h4>
                                <div className="flex items-center mt-1">
                                  <span className="font-medium">${price.toFixed(2)}</span>
                                  {product.discountPercent && (
                                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-1 py-0.5 rounded">
                                      -{product.discountPercent}%
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center ml-4">
                                <button 
                                  className="p-1 rounded-full hover:bg-gray-200"
                                  onClick={() => updateCartQuantity(item.productId, item.quantity - 1)}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="mx-2 min-w-[30px] text-center">{item.quantity}</span>
                                <button 
                                  className="p-1 rounded-full hover:bg-gray-200"
                                  onClick={() => updateCartQuantity(item.productId, item.quantity + 1)}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        
                        <div className="pt-2 border-t">
                          <div className="flex justify-between items-center font-medium">
                            <span>Total:</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => setShowCart(false)}
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketplace; 
