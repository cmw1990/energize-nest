import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle,
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Button,
  Input,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Badge
} from './ui';
import { 
  Search, 
  Star, 
  Filter, 
  ArrowUpDown, 
  Leaf, 
  ThumbsUp, 
  Droplets, 
  Heart, 
  ShoppingBag 
} from 'lucide-react';
import { ProductDetail } from './ProductDetail';

interface NRTDirectoryProps {
  session: Session | null;
}

// Interface for NRT product
interface NRTProduct {
  id: number;
  name: string;
  type: 'patch' | 'gum' | 'lozenge' | 'inhaler' | 'spray';
  strengthOptions: string[];
  brand: string;
  rating: number;
  reviews: number;
  price: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  image: string;
  available: boolean;
}

export const NRTDirectory: React.FC<NRTDirectoryProps> = ({ session }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('rating');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Sample NRT products data
  const nrtProducts: NRTProduct[] = [
    {
      id: 1,
      name: 'NicoDerm CQ Patch',
      type: 'patch',
      strengthOptions: ['21mg', '14mg', '7mg'],
      brand: 'NicoDerm',
      rating: 4.5,
      reviews: 1253,
      price: '$42.99',
      description: 'Clear patches that deliver a steady flow of nicotine throughout the day to help reduce cravings and withdrawal symptoms.',
      pros: ['24-hour relief', 'Once-a-day application', 'Nearly invisible under clothing'],
      cons: ['Skin irritation for some users', 'Cannot adjust dosage during the day'],
      bestFor: ['Heavy smokers starting to quit', 'People who want all-day coverage'],
      image: 'https://via.placeholder.com/150',
      available: true
    },
    {
      id: 2,
      name: 'Nicorette Gum',
      type: 'gum',
      strengthOptions: ['4mg', '2mg'],
      brand: 'Nicorette',
      rating: 4.3,
      reviews: 982,
      price: '$38.99',
      description: 'Chewing gum that releases nicotine to help reduce cravings and withdrawal symptoms when you feel the urge to smoke.',
      pros: ['Rapid relief of cravings', 'Can control when to use it', 'Various flavors available'],
      cons: ['Proper chewing technique required', 'May cause jaw soreness', 'Short duration of effect'],
      bestFor: ['Situational smokers', 'People who need quick relief'],
      image: 'https://via.placeholder.com/150',
      available: true
    },
    {
      id: 3,
      name: 'Nicorette Lozenge',
      type: 'lozenge',
      strengthOptions: ['4mg', '2mg', '1mg'],
      brand: 'Nicorette',
      rating: 4.4,
      reviews: 765,
      price: '$39.99',
      description: 'Nicotine lozenges dissolve in your mouth and release nicotine to reduce cravings and withdrawal symptoms.',
      pros: ['Discreet to use', 'No chewing required', 'Long-lasting relief'],
      cons: ['May cause hiccups or heartburn', 'Cannot eat or drink 15 minutes before use'],
      bestFor: ['Office workers', 'People who dislike gum'],
      image: 'https://via.placeholder.com/150',
      available: true
    },
    {
      id: 4,
      name: 'Nicotrol Inhaler',
      type: 'inhaler',
      strengthOptions: ['10mg cartridge'],
      brand: 'Nicotrol',
      rating: 4.0,
      reviews: 432,
      price: '$55.99',
      description: 'Plastic mouthpiece with nicotine cartridges that mimic the hand-to-mouth action of smoking.',
      pros: ['Mimics hand-to-mouth smoking ritual', 'Adjustable usage frequency', 'Can be used with patches'],
      cons: ['Requires prescription', 'More expensive than other options', 'Visible when using'],
      bestFor: ['People who miss the physical habit of smoking', 'Those who need the oral fixation'],
      image: 'https://via.placeholder.com/150',
      available: true
    },
    {
      id: 5,
      name: 'Nicotrol NS Nasal Spray',
      type: 'spray',
      strengthOptions: ['0.5mg/spray'],
      brand: 'Nicotrol',
      rating: 3.8,
      reviews: 321,
      price: '$67.99',
      description: 'Nasal spray that delivers nicotine quickly through the nasal lining for fast relief from cravings.',
      pros: ['Fastest acting NRT option', 'Highly effective for intense cravings', 'Easily adjusted dosage'],
      cons: ['Nasal irritation common', 'Requires prescription', 'Most expensive option'],
      bestFor: ['Heavy smokers with intense cravings', 'People who need immediate relief'],
      image: 'https://via.placeholder.com/150',
      available: true
    }
  ];

  // Filter products based on selected type and search query
  const filteredProducts = nrtProducts.filter(product => {
    // Filter by type
    if (filterType !== 'all' && product.type !== filterType) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !product.brand.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => {
    // Sort products
    if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'reviews') {
      return b.reviews - a.reviews;
    } else {
      // Sort by name
      return a.name.localeCompare(b.name);
    }
  });

  // View selected product details
  const handleViewProduct = (productId: number) => {
    setSelectedProduct(productId.toString());
  };

  const handleBackToDirectory = () => {
    setSelectedProduct(null);
  };

  // If a product is selected, show the product detail page
  if (selectedProduct) {
    return (
      <ProductDetail 
        session={session}
        productId={selectedProduct}
        onBack={handleBackToDirectory}
      />
    );
  }

  // Render star rating
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-4 w-4 ${
              i < Math.floor(rating) 
                ? 'text-yellow-500 fill-yellow-500' 
                : i < rating 
                  ? 'text-yellow-500 fill-yellow-500 opacity-50' 
                  : 'text-gray-300'
            }`} 
          />
        ))}
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{rating.toFixed(1)}</span>
      </div>
    );
  };

  // Render product type icon
  const renderTypeIcon = (type: string) => {
    switch(type) {
      case 'patch':
        return <Droplets className="h-5 w-5 text-blue-500" />;
      case 'gum':
        return <Leaf className="h-5 w-5 text-green-500" />;
      case 'lozenge':
        return <ThumbsUp className="h-5 w-5 text-purple-500" />;
      case 'inhaler':
        return <Leaf className="h-5 w-5 text-indigo-500" />;
      case 'spray':
        return <Droplets className="h-5 w-5 text-cyan-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-3">NRT Directory</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
          Explore nicotine replacement therapy products to help you stay fresh during your quit journey.
          Find the right product to support your transition to a smoke-free life.
        </p>
        
        {/* Search and Filter Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 dark:bg-green-900/30 p-4 rounded-lg mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search products..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-green-200 dark:border-green-700 focus:border-green-500 focus:ring-green-500"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="border-green-200 dark:border-green-700">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="patch">Patches</SelectItem>
                <SelectItem value="gum">Gum</SelectItem>
                <SelectItem value="lozenge">Lozenges</SelectItem>
                <SelectItem value="inhaler">Inhalers</SelectItem>
                <SelectItem value="spray">Sprays</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="border-green-200 dark:border-green-700">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviewed</SelectItem>
                <SelectItem value="name">Alphabetical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="border-green-200 dark:border-green-800 hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {renderTypeIcon(product.type)}
                    <Badge variant="outline" className="text-xs capitalize bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-700">
                      {product.type}
                    </Badge>
                  </div>
                  <div className="text-lg font-semibold text-green-600 dark:text-green-500">
                    {product.price}
                  </div>
                </div>
                <CardTitle className="text-xl mt-2">{product.name}</CardTitle>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-sm text-gray-500">{product.brand}</div>
                  {renderStars(product.rating)}
                </div>
                <div className="text-xs text-gray-500">{product.reviews} reviews</div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{product.description}</p>
                
                <div className="mb-3">
                  <div className="text-sm font-medium mb-1">Available Strengths:</div>
                  <div className="flex flex-wrap gap-1">
                    {product.strengthOptions.map((strength, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 border-none">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Tabs defaultValue="pros" className="mt-4">
                  <TabsList className="w-full bg-green-100 dark:bg-green-900/30">
                    <TabsTrigger value="pros" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Pros</TabsTrigger>
                    <TabsTrigger value="cons" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Cons</TabsTrigger>
                    <TabsTrigger value="bestFor" className="flex-1 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">Best For</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pros" className="border-none p-2">
                    <ul className="text-sm list-disc pl-5 text-gray-600 dark:text-gray-400">
                      {product.pros.map((pro, idx) => (
                        <li key={idx}>{pro}</li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="cons" className="border-none p-2">
                    <ul className="text-sm list-disc pl-5 text-gray-600 dark:text-gray-400">
                      {product.cons.map((con, idx) => (
                        <li key={idx}>{con}</li>
                      ))}
                    </ul>
                  </TabsContent>
                  <TabsContent value="bestFor" className="border-none p-2">
                    <ul className="text-sm list-disc pl-5 text-gray-600 dark:text-gray-400">
                      {product.bestFor.map((best, idx) => (
                        <li key={idx}>{best}</li>
                      ))}
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter className="flex justify-between border-t border-green-100 dark:border-green-900/50 pt-4">
                <Badge variant={product.available ? "default" : "secondary"} className={product.available ? "bg-green-600" : "bg-gray-400"}>
                  {product.available ? "In Stock" : "Out of Stock"}
                </Badge>
                <Button 
                  variant="outline" 
                  className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"
                  onClick={() => handleViewProduct(product.id)}
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-10 border rounded-lg mt-4 border-gray-200 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">No products found matching your criteria.</p>
            <Button 
              variant="link" 
              onClick={() => {setFilterType('all'); setSearchQuery('');}}
              className="mt-2 text-green-600 dark:text-green-500"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>

      {/* Help section */}
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mt-12 border border-green-100 dark:border-green-800">
        <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-4">
          Choosing the Right NRT Product for You
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          Nicotine Replacement Therapy (NRT) can help you stay fresh on your quit journey by reducing withdrawal symptoms and cravings.
          The right product depends on your smoking habits and personal preferences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-700 dark:text-green-400">For Heavy Smokers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Consider starting with patches combined with a faster-acting NRT like gum or lozenges for breakthrough cravings.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Leaf className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-700 dark:text-green-400">For Light Smokers</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Lower dose NRT products may be sufficient. Gum or lozenges alone might work well for you.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <ThumbsUp className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-700 dark:text-green-400">For Oral Fixation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                If you miss the hand-to-mouth action, inhalers or lozenges may help satisfy that aspect of the habit.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Droplets className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-green-700 dark:text-green-400">For Unpredictable Cravings</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Fast-acting options like sprays and gums can help when cravings hit unexpectedly.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Button className="bg-green-600 hover:bg-green-700">
            Consult a Healthcare Professional
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Always talk to your doctor before starting any NRT product, especially if you have health conditions or are taking medications.
          </p>
        </div>
      </div>
    </div>
  );
}; 