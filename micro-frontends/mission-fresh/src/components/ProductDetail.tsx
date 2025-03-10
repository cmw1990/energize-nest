import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../api/supabase-client';
import { useToast } from '../hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter,
  Button,
  Badge,
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger,
  Textarea,
  Avatar, 
  AvatarFallback, 
  AvatarImage,
  Separator
} from './ui';
import { 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Heart,
  Link as LinkIcon,
  ShoppingBag,
  ChevronLeft,
  Cigarette,
  ArrowLeft
} from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface ProductDetailProps {
  session: Session | null;
  productId: string;
  onBack: () => void;
}

interface NRTProduct {
  id: string;
  name: string;
  type: string;
  brand: string;
  rating: number;
  reviews: number;
  price_range: string;
  description: string;
  pros: string[];
  cons: string[];
  best_for: string[];
  image_url: string;
  strength_options: string[];
  available: boolean;
  avg_rating: number;
  review_count: number;
}

interface ProductVendor {
  id: string;
  product_id: string;
  vendor_id: string;
  vendor_name: string;
  vendor_logo_url: string;
  website_url: string;
  product_url: string;
  price: number;
  in_stock: boolean;
}

interface ProductReview {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  review_text: string;
  pros: string[];
  cons: string[];
  created_at: string;
  user_name: string;
  user_avatar: string;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ session, productId, onBack }) => {
  const { toast } = useToast();
  const [product, setProduct] = useState<NRTProduct | null>(null);
  const [vendors, setVendors] = useState<ProductVendor[]>([]);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [userReview, setUserReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [userPros, setUserPros] = useState('');
  const [userCons, setUserCons] = useState('');
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);
  
  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      // Fetch product details
      const { data: productData, error: productError } = await supabase
        .from('nrt_products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (productError) throw productError;
      
      // Fetch vendors
      const { data: vendorData, error: vendorError } = await supabase
        .from('product_vendors')
        .select(`
          id,
          product_id,
          vendor_id,
          product_url,
          price,
          in_stock,
          vendors(name, logo_url, website_url)
        `)
        .eq('product_id', productId);
        
      if (vendorError) throw vendorError;
      
      // Fetch reviews
      const { data: reviewData, error: reviewError } = await supabase
        .from('product_reviews')
        .select(`
          id,
          user_id,
          product_id,
          rating,
          review_text,
          pros,
          cons,
          created_at,
          profiles:user_id(full_name, avatar_url)
        `)
        .eq('product_id', productId)
        .order('created_at', { ascending: false });
        
      if (reviewError) throw reviewError;
      
      // Check if user has already reviewed
      if (session?.user?.id) {
        const { data: userReviewData, error: userReviewError } = await supabase
          .from('product_reviews')
          .select('id')
          .eq('product_id', productId)
          .eq('user_id', session.user.id)
          .maybeSingle();
          
        if (!userReviewError && userReviewData) {
          setUserHasReviewed(true);
        }
      }
      
      // Transform vendor data
      const transformedVendors = vendorData.map(v => ({
        id: v.id,
        product_id: v.product_id,
        vendor_id: v.vendor_id,
        vendor_name: v.vendors?.name || 'Unknown Vendor',
        vendor_logo_url: v.vendors?.logo_url || '',
        website_url: v.vendors?.website_url || '',
        product_url: v.product_url,
        price: v.price,
        in_stock: v.in_stock
      }));
      
      // Transform review data
      const transformedReviews = reviewData.map(r => ({
        id: r.id,
        user_id: r.user_id,
        product_id: r.product_id,
        rating: r.rating,
        review_text: r.review_text || '',
        pros: r.pros || [],
        cons: r.cons || [],
        created_at: r.created_at,
        user_name: r.profiles?.full_name || 'Anonymous User',
        user_avatar: r.profiles?.avatar_url || ''
      }));
      
      setProduct(productData);
      setVendors(transformedVendors);
      setReviews(transformedReviews);
    } catch (error) {
      console.error('Error fetching product details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load product details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSubmitReview = async () => {
    if (!session?.user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to submit a review',
        variant: 'destructive',
      });
      return;
    }
    
    if (userRating === 0) {
      toast({
        title: 'Rating Required',
        description: 'Please provide a rating before submitting',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      const prosArray = userPros.split('\n').filter(p => p.trim() !== '');
      const consArray = userCons.split('\n').filter(c => c.trim() !== '');
      
      const { data, error } = await supabase
        .from('product_reviews')
        .insert({
          user_id: session.user.id,
          product_id: productId,
          rating: userRating,
          review_text: userReview,
          pros: prosArray,
          cons: consArray
        });
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: 'Your review has been submitted',
      });
      
      // Refresh product details to update reviews
      fetchProductDetails();
      
      // Reset form
      setUserReview('');
      setUserRating(0);
      setUserPros('');
      setUserCons('');
      setUserHasReviewed(true);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    }
  };
  
  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((value) => (
          <Star
            key={value}
            className={`h-4 w-4 ${
              value <= Math.round(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };
  
  const renderRatingStars = () => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setUserRating(value)}
            className="focus:outline-none"
          >
            <Star
              className={`h-6 w-6 ${
                value <= userRating
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };
  
  const getAvatarFallback = (name: string) => {
    if (!name) return '?';
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-t-2 border-green-500 border-solid rounded-full animate-spin"></div>
          <p className="text-green-600">Loading product details...</p>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="text-center py-12 px-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">Product Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Button onClick={onBack} className="bg-green-600 hover:bg-green-700">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Directory
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Button 
        variant="ghost" 
        onClick={onBack} 
        className="flex items-center text-green-600 hover:bg-green-50 hover:text-green-700 mb-4"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Directory
      </Button>
      
      <div className="grid md:grid-cols-3 gap-6">
        {/* Product image and basic info */}
        <div className="md:col-span-1">
          <Card className="overflow-hidden border-green-100 dark:border-green-800">
            <CardContent className="p-0">
              <div className="aspect-square bg-white flex items-center justify-center p-4">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/300?text=No+Image'} 
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20">
                <div className="flex justify-between items-center mb-2">
                  <Badge className="bg-green-600">{product.type}</Badge>
                  <div className="flex items-center">
                    {renderStars(product.avg_rating || product.rating)}
                    <span className="text-sm ml-2 text-gray-600 dark:text-gray-400">
                      ({product.review_count || product.reviews})
                    </span>
                  </div>
                </div>
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">By {product.brand}</p>
                <p className="text-lg font-bold mt-2 text-green-700 dark:text-green-500">{product.price_range}</p>
                
                <div className="mt-4 pt-4 border-t border-green-100 dark:border-green-800">
                  <h3 className="text-sm font-medium mb-2">Strength Options:</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.strength_options.map((strength, idx) => (
                      <Badge key={idx} variant="outline" className="bg-white dark:bg-gray-800">
                        {strength}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4">
                  <Badge variant={product.available ? "default" : "secondary"} className={`w-full justify-center py-1 ${product.available ? "bg-green-600" : "bg-gray-400"}`}>
                    {product.available ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Vendors section */}
          {vendors.length > 0 && (
            <Card className="mt-4 border-green-100 dark:border-green-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Where to Buy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="flex items-start p-2 border rounded-md border-green-100 dark:border-green-800">
                      <div className="w-10 h-10 flex-shrink-0 bg-white rounded-md overflow-hidden">
                        {vendor.vendor_logo_url ? (
                          <img 
                            src={vendor.vendor_logo_url} 
                            alt={vendor.vendor_name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600">
                            <ShoppingBag className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-3 flex-1">
                        <h4 className="font-medium">{vendor.vendor_name}</h4>
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                          <span className="font-medium text-green-600 dark:text-green-500">
                            ${vendor.price ? vendor.price.toFixed(2) : 'Varies'}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{vendor.in_stock ? 'In stock' : 'Check availability'}</span>
                        </div>
                        
                        <div className="mt-2">
                          <a 
                            href={vendor.product_url || vendor.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-800"
                          >
                            <LinkIcon className="h-3 w-3 mr-1" />
                            View Offer
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Product details tabs */}
        <div className="md:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4 bg-green-100 dark:bg-green-900/30">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Overview
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Reviews ({reviews.length})
              </TabsTrigger>
              <TabsTrigger value="compare" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800">
                Suitability
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Product Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300">{product.description}</p>
                  
                  <div className="mt-6 grid md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium mb-2 text-green-700 dark:text-green-500 flex items-center">
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Pros
                      </h3>
                      <ul className="text-sm space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        {product.pros.map((pro, idx) => (
                          <li key={idx}>{pro}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2 text-red-600 dark:text-red-500 flex items-center">
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Cons
                      </h3>
                      <ul className="text-sm space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        {product.cons.map((con, idx) => (
                          <li key={idx}>{con}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-2 text-blue-600 dark:text-blue-500 flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        Best For
                      </h3>
                      <ul className="text-sm space-y-1 list-disc list-inside text-gray-600 dark:text-gray-400">
                        {product.best_for.map((best, idx) => (
                          <li key={idx}>{best}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>How to Use</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h3 className="font-medium">Follow the product instructions</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Each product has specific instructions for optimal use. Always read the product leaflet before first use.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h3 className="font-medium">Use consistently</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        For best results, use regularly as directed rather than only when experiencing cravings.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h3 className="font-medium">Complete the treatment course</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Follow the recommended treatment duration, usually 8-12 weeks, gradually reducing usage as directed.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-green-600 flex-shrink-0">
                      4
                    </div>
                    <div>
                      <h3 className="font-medium">Monitor and adjust</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Track your usage in the Mission Fresh app and adjust based on your progress and cravings.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>User Reviews</CardTitle>
                  <CardDescription>See what others are saying about this product</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {!userHasReviewed && session?.user && (
                    <div className="border rounded-lg p-4 mb-6 border-green-100 dark:border-green-800">
                      <h3 className="font-medium mb-2">Write a Review</h3>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Rating</label>
                        {renderRatingStars()}
                      </div>
                      <div className="mb-4">
                        <label className="block text-sm font-medium mb-1">Your Review</label>
                        <Textarea 
                          placeholder="Share your experience with this product..." 
                          value={userReview}
                          onChange={(e) => setUserReview(e.target.value)}
                          className="w-full"
                          rows={3}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Pros (one per line)</label>
                          <Textarea 
                            placeholder="What did you like?"
                            value={userPros}
                            onChange={(e) => setUserPros(e.target.value)}
                            className="w-full"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Cons (one per line)</label>
                          <Textarea 
                            placeholder="What could be improved?"
                            value={userCons}
                            onChange={(e) => setUserCons(e.target.value)}
                            className="w-full"
                            rows={3}
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSubmitReview} className="bg-green-600 hover:bg-green-700">
                          Submit Review
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {reviews.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No reviews yet. Be the first to review this product!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="space-y-3">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={review.user_avatar} alt={review.user_name} />
                              <AvatarFallback>{getAvatarFallback(review.user_name)}</AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                              <div className="font-medium">{review.user_name}</div>
                              <div className="flex items-center">
                                {renderStars(review.rating)}
                                <span className="text-xs text-gray-500 ml-2">
                                  {format(new Date(review.created_at), 'MMM d, yyyy')}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          {review.review_text && (
                            <p className="text-gray-700 dark:text-gray-300 text-sm">{review.review_text}</p>
                          )}
                          
                          {(review.pros.length > 0 || review.cons.length > 0) && (
                            <div className="grid grid-cols-2 gap-4 pt-2">
                              {review.pros.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-medium text-green-600 flex items-center">
                                    <ThumbsUp className="h-3 w-3 mr-1" />
                                    Pros
                                  </h4>
                                  <ul className="text-xs list-disc list-inside text-gray-600 dark:text-gray-400 mt-1">
                                    {review.pros.map((pro, idx) => (
                                      <li key={idx}>{pro}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {review.cons.length > 0 && (
                                <div>
                                  <h4 className="text-xs font-medium text-red-600 flex items-center">
                                    <ThumbsDown className="h-3 w-3 mr-1" />
                                    Cons
                                  </h4>
                                  <ul className="text-xs list-disc list-inside text-gray-600 dark:text-gray-400 mt-1">
                                    {review.cons.map((con, idx) => (
                                      <li key={idx}>{con}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <Separator className="my-4" />
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="compare" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Is This Right For You?</CardTitle>
                  <CardDescription>Find out if this product matches your needs</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900">
                      <h3 className="font-medium text-lg mb-2 text-green-700 dark:text-green-500">Ideal User Profile</h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Cigarette className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Smoking Habits</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {product.type === 'patch' && 'Best for regular, consistent smokers who need all-day relief.'}
                              {product.type === 'gum' && 'Great for situational smokers who need on-demand relief.'}
                              {product.type === 'lozenge' && 'Ideal for those who prefer discrete options throughout the day.'}
                              {product.type === 'inhaler' && 'Perfect for those who miss the hand-to-mouth action of smoking.'}
                              {product.type === 'spray' && 'Best for those who need rapid craving relief.'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <ThumbsUp className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Lifestyle Fit</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {product.type === 'patch' && 'Apply once daily – ideal for busy people who prefer simplicity.'}
                              {product.type === 'gum' && 'Requires active chewing – good for those who want control over timing and dosage.'}
                              {product.type === 'lozenge' && 'Takes 20-30 minutes to dissolve – good for those who can commit to this time.'}
                              {product.type === 'inhaler' && 'Requires frequent use – best for those who can incorporate it into their routine.'}
                              {product.type === 'spray' && 'Quick to use – perfect for busy lifestyles and discreet usage.'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Heart className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                          <div>
                            <h4 className="font-medium">Dependency Level</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {product.strength_options.some(s => s.includes('21mg') || s.includes('high')) && 'Higher strengths available for those with strong nicotine dependence.'}
                              {product.strength_options.some(s => s.includes('14mg') || s.includes('medium')) && 'Medium strengths for moderate smokers.'}
                              {product.strength_options.some(s => s.includes('7mg') || s.includes('low')) && 'Lower strengths for light smokers or when tapering down.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-green-100 dark:border-green-900">
                        <h3 className="font-medium mb-3 text-green-700 dark:text-green-500">Advantages for Quitters</h3>
                        <ul className="space-y-2">
                          {product.pros.map((pro, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <ThumbsUp className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="p-4 rounded-lg bg-white dark:bg-gray-800 border border-red-100 dark:border-red-900/50">
                        <h3 className="font-medium mb-3 text-red-600 dark:text-red-500">Considerations</h3>
                        <ul className="space-y-2">
                          {product.cons.map((con, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <ThumbsDown className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                              <span className="text-sm text-gray-700 dark:text-gray-300">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/50">
                      <h3 className="font-medium text-blue-700 dark:text-blue-500 mb-2">Healthcare Professional Advice</h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        Always consult with a healthcare provider before starting NRT, especially if you have any health conditions 
                        or are taking medications. They can help you determine the right product and dosage for your specific needs.
                      </p>
                      <Button className="mt-4 bg-blue-600 hover:bg-blue-700">
                        Find Healthcare Resources
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 