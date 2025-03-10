import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Search, Filter, MapPin, Star, Phone, Mail, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface MarketplaceProps {
  session: Session | null;
}

interface Provider {
  id: string;
  name: string;
  description: string;
  provider_type: string;
  services: string[];
  location: string;
  contact_email: string;
  contact_phone: string;
  website: string | null;
  verified: boolean;
  image_url: string | null;
  created_at: string;
  avg_rating?: number;
  review_count?: number;
}

export const Marketplace: React.FC<MarketplaceProps> = ({ session }) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [providerType, setProviderType] = useState('all');
  const [sortBy, setSortBy] = useState('rating');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        setIsLoading(true);
        
        // Query providers with reviews
        const { data, error } = await supabase
          .from('care8_providers')
          .select(`
            *,
            reviews:care8_provider_reviews(rating)
          `)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        // Process data and calculate average ratings
        const processedData = data.map(provider => {
          const reviews = provider.reviews || [];
          const avg_rating = reviews.length > 0 
            ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length 
            : 0;
            
          return {
            ...provider,
            avg_rating: parseFloat(avg_rating.toFixed(1)),
            review_count: reviews.length,
            services: provider.services || []
          };
        });
        
        setProviders(processedData);
      } catch (err: any) {
        console.error('Error fetching providers:', err);
        setError(err.message);
        toast({
          title: 'Error fetching providers',
          description: err.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProviders();
  }, [toast]);
  
  // Filter and sort providers
  const filteredProviders = providers.filter(provider => {
    // Text search
    const matchesSearch = searchTerm === '' || 
      provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provider.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Type filter
    const matchesType = providerType === 'all' || provider.provider_type === providerType;
    
    return matchesSearch && matchesType;
  }).sort((a, b) => {
    // Sort by selected criterion
    if (sortBy === 'rating') {
      return (b.avg_rating || 0) - (a.avg_rating || 0);
    } else if (sortBy === 'reviews') {
      return (b.review_count || 0) - (a.review_count || 0);
    } else {
      // Default to newest
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });
  
  // Generate provider types from data
  const providerTypes = ['all', ...new Set(providers.map(p => p.provider_type))];
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Care Provider Marketplace</h1>
      
      {/* Search and filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search providers, services..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Select value={providerType} onValueChange={setProviderType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Provider type" />
          </SelectTrigger>
          <SelectContent>
            {providerTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="reviews">Most Reviewed</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Results */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-600">{error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : filteredProviders.length === 0 ? (
        <div className="text-center p-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-2">No providers match your search criteria</p>
          <Button 
            variant="outline" 
            onClick={() => {
              setSearchTerm('');
              setProviderType('all');
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map(provider => (
            <Card key={provider.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={provider.image_url || ''} alt={provider.name} />
                      <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg font-bold">
                        {provider.name}
                        {provider.verified && (
                          <Badge className="ml-2" variant="outline">Verified</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{provider.provider_type}</CardDescription>
                    </div>
                  </div>
                  {provider.avg_rating > 0 && (
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{provider.avg_rating}</span>
                      <span className="text-xs text-gray-500 ml-1">({provider.review_count})</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">{provider.description}</p>
                
                <div className="flex flex-wrap gap-1 mb-3">
                  {provider.services.slice(0, 3).map((service, i) => (
                    <Badge key={i} variant="secondary">{service}</Badge>
                  ))}
                  {provider.services.length > 3 && (
                    <Badge variant="outline">+{provider.services.length - 3} more</Badge>
                  )}
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{provider.location}</span>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Phone className="h-4 w-4 mr-1" />
                  Contact
                </Button>
                
                <Button size="sm" className="flex items-center">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add mock data if none exists */}
      {providers.length === 0 && !isLoading && !error && (
        <div className="mt-8 p-4 border border-dashed rounded-lg">
          <Button 
            onClick={async () => {
              try {
                // Insert sample providers
                const providerData = [
                  {
                    name: "CareMasters Home Health",
                    description: "Professional home care services for seniors and individuals with disabilities. We offer personal care, medication management, and companionship.",
                    provider_type: "homecare",
                    services: ["Personal Care", "Medication Management", "Companionship", "Meal Preparation"],
                    location: "Boston, MA",
                    contact_email: "info@caremasters.example",
                    contact_phone: "(555) 123-4567",
                    website: "https://caremasters.example",
                    verified: true,
                    image_url: "https://randomuser.me/api/portraits/men/42.jpg"
                  },
                  {
                    name: "Sunrise Senior Living",
                    description: "Assisted living facility providing 24/7 care, meal services, and social activities for seniors in a comfortable and supportive environment.",
                    provider_type: "facility",
                    services: ["Assisted Living", "Memory Care", "Rehabilitation", "Social Activities"],
                    location: "Cambridge, MA",
                    contact_email: "contact@sunrisesenior.example",
                    contact_phone: "(555) 987-6543",
                    website: "https://sunrisesenior.example",
                    verified: true,
                    image_url: "https://randomuser.me/api/portraits/women/68.jpg"
                  },
                  {
                    name: "Dr. Sarah Johnson",
                    description: "Board-certified geriatric physician with over 15 years of experience specializing in elder care and chronic disease management.",
                    provider_type: "physician",
                    services: ["Geriatric Medicine", "Chronic Disease Management", "Telehealth", "Home Visits"],
                    location: "Newton, MA",
                    contact_email: "dr.johnson@medical.example",
                    contact_phone: "(555) 321-7890",
                    website: null,
                    verified: true,
                    image_url: "https://randomuser.me/api/portraits/women/33.jpg"
                  },
                  {
                    name: "Helping Hands Therapy",
                    description: "Physical, occupational, and speech therapy services available in-home or at our clinic. Specialized in stroke recovery and mobility improvement.",
                    provider_type: "therapy",
                    services: ["Physical Therapy", "Occupational Therapy", "Speech Therapy", "Rehabilitation"],
                    location: "Brookline, MA",
                    contact_email: "schedule@helpinghands.example",
                    contact_phone: "(555) 456-7890",
                    website: "https://helpinghands.example",
                    verified: false,
                    image_url: "https://randomuser.me/api/portraits/men/76.jpg"
                  },
                  {
                    name: "MindfulCare Mental Health",
                    description: "Mental health services for seniors dealing with depression, anxiety, grief, and adjustment issues. Both in-person and telehealth options available.",
                    provider_type: "mentalhealth",
                    services: ["Therapy", "Counseling", "Depression Treatment", "Anxiety Management"],
                    location: "Somerville, MA",
                    contact_email: "care@mindfulcare.example",
                    contact_phone: "(555) 234-5678",
                    website: "https://mindfulcare.example",
                    verified: true,
                    image_url: "https://randomuser.me/api/portraits/women/45.jpg"
                  },
                  {
                    name: "ElderLaw Partners",
                    description: "Legal services specializing in elder law, estate planning, wills, trusts, and power of attorney arrangements for seniors and their families.",
                    provider_type: "legal",
                    services: ["Estate Planning", "Elder Law", "Wills & Trusts", "Power of Attorney"],
                    location: "Boston, MA",
                    contact_email: "legal@elderlawpartners.example",
                    contact_phone: "(555) 876-5432",
                    website: "https://elderlawpartners.example",
                    verified: false,
                    image_url: "https://randomuser.me/api/portraits/men/29.jpg"
                  }
                ];
                
                // Add providers to database
                for (const provider of providerData) {
                  const { error: providerError } = await supabase
                    .from('care8_providers')
                    .insert({
                      ...provider,
                      created_by: session?.user?.id
                    });
                    
                  if (providerError) throw providerError;
                }
                
                // Add some reviews
                const reviews = [
                  { provider_name: "CareMasters Home Health", ratings: [5, 4, 5, 4] },
                  { provider_name: "Sunrise Senior Living", ratings: [4, 5, 3, 4, 5] },
                  { provider_name: "Dr. Sarah Johnson", ratings: [5, 5, 4, 5] },
                  { provider_name: "Helping Hands Therapy", ratings: [3, 4, 3] },
                  { provider_name: "MindfulCare Mental Health", ratings: [4, 5, 4] },
                  { provider_name: "ElderLaw Partners", ratings: [4, 3, 4] }
                ];
                
                // Get the inserted providers
                const { data: insertedProviders } = await supabase
                  .from('care8_providers')
                  .select('id, name');
                
                if (insertedProviders) {
                  for (const provider of insertedProviders) {
                    const review = reviews.find(r => r.provider_name === provider.name);
                    if (review) {
                      for (const rating of review.ratings) {
                        await supabase
                          .from('care8_provider_reviews')
                          .insert({
                            provider_id: provider.id,
                            user_id: session?.user?.id,
                            rating,
                            comment: `Sample review with rating ${rating}`,
                            created_at: new Date().toISOString()
                          });
                      }
                    }
                  }
                }
                
                toast({
                  title: 'Sample data created',
                  description: 'Demo providers and reviews have been added to the marketplace',
                  variant: 'default'
                });
                
                // Reload providers
                window.location.reload();
                
              } catch (err: any) {
                console.error('Error creating sample data:', err);
                toast({
                  title: 'Error creating sample data',
                  description: err.message,
                  variant: 'destructive'
                });
              }
            }}
          >
            Create Sample Provider Data
          </Button>
        </div>
      )}
    </div>
  );
}; 