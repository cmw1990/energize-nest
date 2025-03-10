import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Search, Filter, MapPin, Star, UserCheck, BriefcaseBusiness, Scale, CalendarClock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { justiceConnectorApi } from '@/api/care8ConnectorApi';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface JusticeConnectorProps {
  session: Session | null;
}

const JusticeConnector: React.FC<JusticeConnectorProps> = ({ session }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('highest-rated');
  const [specialization, setSpecialization] = useState('all');
  const [radius, setRadius] = useState('25');
  const [consultationType, setConsultationType] = useState('any');
  
  // Add state for API data
  const [lawyers, setLawyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch legal experts on component mount
  useEffect(() => {
    fetchLegalExperts();
  }, []);
  
  // Function to fetch legal experts from API
  const fetchLegalExperts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await justiceConnectorApi.getLegalExperts();
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch legal experts');
      }
      
      // Sort the legal experts based on sortBy value
      let sortedLawyers = [...response.data];
      
      if (sortBy === 'highest-rated') {
        sortedLawyers.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'price-low') {
        sortedLawyers.sort((a, b) => {
          const aPrice = parseFloat(a.rate.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.rate.replace(/[^0-9.]/g, ''));
          return aPrice - bPrice;
        });
      } else if (sortBy === 'price-high') {
        sortedLawyers.sort((a, b) => {
          const aPrice = parseFloat(a.rate.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.rate.replace(/[^0-9.]/g, ''));
          return bPrice - aPrice;
        });
      } else if (sortBy === 'experience') {
        sortedLawyers.sort((a, b) => b.years_experience - a.years_experience);
      }
      
      setLawyers(sortedLawyers);
    } catch (err: any) {
      console.error('Error fetching legal experts:', err);
      setError(err.message || 'Failed to fetch legal experts');
      
      // Fallback to empty array if API fails
      setLawyers([]);
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
      
      if (specialization !== 'all') {
        filters.specialties = specialization;
      }
      
      if (consultationType !== 'any') {
        filters.consultationType = consultationType;
      }
      
      if (location) {
        filters.location = location;
      }
      
      // Fetch legal experts with filters
      const response = await justiceConnectorApi.getLegalExperts(filters);
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch legal experts');
      }
      
      // Filter by search term if provided
      let filteredLawyers = response.data;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredLawyers = filteredLawyers.filter((lawyer: any) => 
          lawyer.name.toLowerCase().includes(searchLower) ||
          lawyer.bio.toLowerCase().includes(searchLower) ||
          lawyer.specialties.some((specialty: string) => 
            specialty.toLowerCase().includes(searchLower)
          )
        );
      }
      
      // Sort the legal experts based on sortBy value
      let sortedLawyers = [...filteredLawyers];
      
      if (sortBy === 'highest-rated') {
        sortedLawyers.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'price-low') {
        sortedLawyers.sort((a, b) => {
          const aPrice = parseFloat(a.rate.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.rate.replace(/[^0-9.]/g, ''));
          return aPrice - bPrice;
        });
      } else if (sortBy === 'price-high') {
        sortedLawyers.sort((a, b) => {
          const aPrice = parseFloat(a.rate.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.rate.replace(/[^0-9.]/g, ''));
          return bPrice - aPrice;
        });
      } else if (sortBy === 'experience') {
        sortedLawyers.sort((a, b) => b.years_experience - a.years_experience);
      }
      
      setLawyers(sortedLawyers);
    } catch (err: any) {
      console.error('Error searching legal experts:', err);
      setError(err.message || 'Failed to search legal experts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Justice Connector</h1>
        <p className="text-gray-600 dark:text-gray-400">Connect with experienced legal experts specializing in elder care and healthcare decisions</p>
      </div>
      
      {/* Search and Filter Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search by specialty, service, or name..."
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
                  <label className="block text-sm font-medium mb-2">Specialization</label>
                  <Select value={specialization} onValueChange={setSpecialization}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Specializations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      <SelectItem value="Elder Law">Elder Law</SelectItem>
                      <SelectItem value="Estate Planning">Estate Planning</SelectItem>
                      <SelectItem value="Healthcare Law">Healthcare Law</SelectItem>
                      <SelectItem value="Medicare/Medicaid">Medicare/Medicaid</SelectItem>
                      <SelectItem value="Guardianship">Guardianship</SelectItem>
                      <SelectItem value="Elder Abuse">Elder Abuse</SelectItem>
                      <SelectItem value="Trusts">Trusts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Consultation Type</label>
                  <Select value={consultationType} onValueChange={setConsultationType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any Type</SelectItem>
                      <SelectItem value="In-person">In-person</SelectItem>
                      <SelectItem value="Virtual">Virtual</SelectItem>
                      <SelectItem value="Phone">Phone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Sort by</label>
                  <Select value={sortBy} onValueChange={(value) => {
                    setSortBy(value);
                    // Re-sort lawyers when sort option changes
                    if (lawyers.length > 0) {
                      let sortedLawyers = [...lawyers];
                      
                      if (value === 'highest-rated') {
                        sortedLawyers.sort((a, b) => b.rating - a.rating);
                      } else if (value === 'price-low') {
                        sortedLawyers.sort((a, b) => {
                          const aPrice = parseFloat(a.rate.replace(/[^0-9.]/g, ''));
                          const bPrice = parseFloat(b.rate.replace(/[^0-9.]/g, ''));
                          return aPrice - bPrice;
                        });
                      } else if (value === 'price-high') {
                        sortedLawyers.sort((a, b) => {
                          const aPrice = parseFloat(a.rate.replace(/[^0-9.]/g, ''));
                          const bPrice = parseFloat(b.rate.replace(/[^0-9.]/g, ''));
                          return bPrice - aPrice;
                        });
                      } else if (value === 'experience') {
                        sortedLawyers.sort((a, b) => b.years_experience - a.years_experience);
                      }
                      
                      setLawyers(sortedLawyers);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Highest Rated" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="highest-rated">Highest Rated</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="experience">Most Experienced</SelectItem>
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
              Loading legal experts...
            </span>
          ) : (
            `${lawyers.length} Legal Experts Available`
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
      {!loading && lawyers.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">No legal experts found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Try adjusting your search filters or location to find more results.
          </p>
          <Button onClick={fetchLegalExperts}>
            Reset Filters
          </Button>
        </div>
      )}
      
      {/* Legal Experts Grid/List View */}
      {!loading && lawyers.length > 0 && (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lawyers.map(lawyer => (
              <Card key={lawyer.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-6">
                    <div className="flex items-start">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                        <AvatarFallback>{lawyer.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">{lawyer.name}</h3>
                          {lawyer.verified && (
                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                              <UserCheck size={12} className="mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{lawyer.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({lawyer.review_count} reviews)</span>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          {lawyer.location} • {lawyer.distance}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {lawyer.specialties && lawyer.specialties.map((specialty: string) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{lawyer.bio}</p>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <BriefcaseBusiness className="h-3 w-3 mr-1 text-gray-500" />
                        <span>{lawyer.years_experience} years exp.</span>
                      </div>
                      <div className="flex items-center">
                        <Scale className="h-3 w-3 mr-1 text-gray-500" />
                        <span>{lawyer.rate}</span>
                      </div>
                      <div className="flex items-center col-span-2">
                        <CalendarClock className="h-3 w-3 mr-1 text-gray-500" />
                        <span>
                          {lawyer.consultation_types && lawyer.consultation_types.join(', ')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button className="w-full">View Profile</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {lawyers.map(lawyer => (
              <Card key={lawyer.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row">
                    <div className="flex items-start mb-4 md:mb-0 md:mr-6">
                      <Avatar className="h-16 w-16 mr-4">
                        <AvatarImage src={lawyer.avatar} alt={lawyer.name} />
                        <AvatarFallback>{lawyer.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-semibold">{lawyer.name}</h3>
                          {lawyer.verified && (
                            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
                              <UserCheck size={12} className="mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span className="text-sm font-medium">{lawyer.rating}</span>
                          <span className="text-sm text-gray-500 ml-1">({lawyer.review_count} reviews)</span>
                        </div>
                        <div className="flex items-center mt-1 text-sm text-gray-600">
                          <MapPin className="h-3 w-3 mr-1" />
                          {lawyer.location} • {lawyer.distance}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex flex-wrap gap-1 mb-3">
                        {lawyer.specialties && lawyer.specialties.map((specialty: string) => (
                          <Badge key={specialty} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{lawyer.bio}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm mb-4">
                        <div className="flex items-center">
                          <BriefcaseBusiness className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{lawyer.years_experience} years exp.</span>
                        </div>
                        <div className="flex items-center">
                          <Scale className="h-3 w-3 mr-1 text-gray-500" />
                          <span>{lawyer.rate}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarClock className="h-3 w-3 mr-1 text-gray-500" />
                          <span>
                            {lawyer.consultation_types && lawyer.consultation_types.join(', ')}
                          </span>
                        </div>
                      </div>
                      
                      <Button>View Profile</Button>
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

export default JusticeConnector; 