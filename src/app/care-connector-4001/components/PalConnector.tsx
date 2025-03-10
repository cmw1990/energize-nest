import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Search, Filter, MapPin, Clock, Star, UserCheck, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { palConnectorApi } from '@/api/care8ConnectorApi';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PalConnectorProps {
  session: Session | null;
}

const PalConnector: React.FC<PalConnectorProps> = ({ session }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('highest-rated');
  const [companionType, setCompanionType] = useState('all');
  const [radius, setRadius] = useState('25');
  
  // Add state for API data
  const [companions, setCompanions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch companions on component mount
  useEffect(() => {
    fetchCompanions();
  }, []);
  
  // Function to fetch companions from API
  const fetchCompanions = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await palConnectorApi.getCompanions();
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch companions');
      }
      
      // Sort the companions based on sortBy value
      let sortedCompanions = [...response.data];
      
      if (sortBy === 'highest-rated') {
        sortedCompanions.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'price-low') {
        sortedCompanions.sort((a, b) => {
          const aPrice = parseFloat(a.hourly_rate.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.hourly_rate.replace(/[^0-9.]/g, ''));
          return aPrice - bPrice;
        });
      } else if (sortBy === 'price-high') {
        sortedCompanions.sort((a, b) => {
          const aPrice = parseFloat(a.hourly_rate.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.hourly_rate.replace(/[^0-9.]/g, ''));
          return bPrice - aPrice;
        });
      } else if (sortBy === 'distance') {
        sortedCompanions.sort((a, b) => {
          const aDistance = parseFloat(a.distance.replace(/[^0-9.]/g, ''));
          const bDistance = parseFloat(b.distance.replace(/[^0-9.]/g, ''));
          return aDistance - bDistance;
        });
      }
      
      setCompanions(sortedCompanions);
    } catch (err: any) {
      console.error('Error fetching companions:', err);
      setError(err.message || 'Failed to fetch companions');
      
      // Fallback to empty array if API fails
      setCompanions([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search button click
  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Create filters object based on selected options
      const filters: Record<string, any> = {};
      
      if (companionType !== 'all') {
        filters.interests = companionType;
      }
      
      if (location) {
        filters.location = location;
      }
      
      // Fetch companions with filters
      const response = await palConnectorApi.getCompanions(filters);
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch companions');
      }
      
      // Filter by search term if provided
      let filteredCompanions = response.data;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredCompanions = filteredCompanions.filter((companion: any) => 
          companion.name.toLowerCase().includes(searchLower) ||
          companion.bio.toLowerCase().includes(searchLower) ||
          companion.interests.some((interest: string) => 
            interest.toLowerCase().includes(searchLower)
          )
        );
      }
      
      // Sort the companions based on sortBy value
      let sortedCompanions = [...filteredCompanions];
      
      if (sortBy === 'highest-rated') {
        sortedCompanions.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'price-low') {
        sortedCompanions.sort((a, b) => {
          const aPrice = parseFloat(a.hourly_rate.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.hourly_rate.replace(/[^0-9.]/g, ''));
          return aPrice - bPrice;
        });
      } else if (sortBy === 'price-high') {
        sortedCompanions.sort((a, b) => {
          const aPrice = parseFloat(a.hourly_rate.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.hourly_rate.replace(/[^0-9.]/g, ''));
          return bPrice - aPrice;
        });
      } else if (sortBy === 'distance') {
        sortedCompanions.sort((a, b) => {
          const aDistance = parseFloat(a.distance.replace(/[^0-9.]/g, ''));
          const bDistance = parseFloat(b.distance.replace(/[^0-9.]/g, ''));
          return aDistance - bDistance;
        });
      }
      
      setCompanions(sortedCompanions);
    } catch (err: any) {
      console.error('Error searching companions:', err);
      setError(err.message || 'Failed to search companions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pal-Connector</h1>
        <p className="text-gray-600 dark:text-gray-400">Connect with friendly companions who share your interests</p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by interests, activities, or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="relative flex-grow">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Enter your location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
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
          <Button 
            className="md:w-auto w-full"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Search className="mr-2" size={16} />
            )}
            Search
          </Button>
        </div>
        
        {/* Advanced Filters */}
        {showFilters && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Interest Type</label>
                  <Select value={companionType} onValueChange={setCompanionType}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Interests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Interests</SelectItem>
                      <SelectItem value="Reading">Reading</SelectItem>
                      <SelectItem value="Board Games">Board Games</SelectItem>
                      <SelectItem value="Cooking">Cooking</SelectItem>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Art">Art</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Distance</label>
                  <Select value={radius} onValueChange={setRadius}>
                    <SelectTrigger>
                      <SelectValue placeholder="Within 25 miles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">Within 5 miles</SelectItem>
                      <SelectItem value="10">Within 10 miles</SelectItem>
                      <SelectItem value="25">Within 25 miles</SelectItem>
                      <SelectItem value="50">Within 50 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sort by</label>
                  <Select value={sortBy} onValueChange={(value) => {
                    setSortBy(value);
                    // Re-sort companions when sort option changes
                    if (companions.length > 0) {
                      let sortedCompanions = [...companions];
                      
                      if (value === 'highest-rated') {
                        sortedCompanions.sort((a, b) => b.rating - a.rating);
                      } else if (value === 'price-low') {
                        sortedCompanions.sort((a, b) => {
                          const aPrice = parseFloat(a.hourly_rate.replace(/[^0-9.]/g, ''));
                          const bPrice = parseFloat(b.hourly_rate.replace(/[^0-9.]/g, ''));
                          return aPrice - bPrice;
                        });
                      } else if (value === 'price-high') {
                        sortedCompanions.sort((a, b) => {
                          const aPrice = parseFloat(a.hourly_rate.replace(/[^0-9.]/g, ''));
                          const bPrice = parseFloat(b.hourly_rate.replace(/[^0-9.]/g, ''));
                          return bPrice - aPrice;
                        });
                      } else if (value === 'distance') {
                        sortedCompanions.sort((a, b) => {
                          const aDistance = parseFloat(a.distance.replace(/[^0-9.]/g, ''));
                          const bDistance = parseFloat(b.distance.replace(/[^0-9.]/g, ''));
                          return aDistance - bDistance;
                        });
                      }
                      
                      setCompanions(sortedCompanions);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Highest Rated" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highest-rated">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="distance">Closest to me</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Loading companions...
            </span>
          ) : (
            `${companions.length} Companions Available`
          )}
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

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      )}
      
      {/* No Results State */}
      {!loading && companions.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No companions found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your search filters or location to find more results.
          </p>
          <Button onClick={fetchCompanions}>
            Reset Filters
          </Button>
        </div>
      )}
      
      {/* Companions Grid/List View */}
      {!loading && companions.length > 0 && (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companions.map(companion => (
              <Card key={companion.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={companion.avatar} alt={companion.name} />
                        <AvatarFallback>{companion.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">{companion.name}</h3>
                          {companion.verified && (
                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                              <UserCheck size={12} className="mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{companion.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({companion.review_count} reviews)</span>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          {companion.location} • {companion.distance}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {companion.interests && companion.interests.map((interest: string) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{companion.bio}</p>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{companion.hourly_rate}/hr</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {companion.availability}
                        </div>
                      </div>
                      <Button>View Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {companions.map(companion => (
              <Card key={companion.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex items-start mb-4 md:mb-0 md:mr-6">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={companion.avatar} alt={companion.name} />
                        <AvatarFallback>{companion.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">{companion.name}</h3>
                          {companion.verified && (
                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                              <UserCheck size={12} className="mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{companion.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({companion.review_count} reviews)</span>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          {companion.location} • {companion.distance}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {companion.interests && companion.interests.map((interest: string) => (
                          <Badge key={interest} variant="secondary" className="text-xs">
                            {interest}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{companion.bio}</p>
                      
                      <div className="mt-4 flex flex-wrap items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{companion.hourly_rate}/hr</p>
                          <div className="flex items-center text-xs text-gray-500">
                            <Calendar className="h-3 w-3 mr-1" />
                            {companion.availability}
                          </div>
                        </div>
                        <Button className="mt-2 md:mt-0">View Profile</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default PalConnector; 