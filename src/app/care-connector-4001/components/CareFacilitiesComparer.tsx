import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Search, Filter, MapPin, Star, Home, Check, X, PhoneCall, Bed, DollarSign, Clock, CalendarClock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { careFacilitiesApi } from '@/api/care8ConnectorApi';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CareFacilitiesComparerProps {
  session: Session | null;
}

const CareFacilitiesComparer: React.FC<CareFacilitiesComparerProps> = ({ session }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [facilityType, setFacilityType] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [availability, setAvailability] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [compareList, setCompareList] = useState<number[]>([]);
  
  // Add state for API data
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch facilities on component mount
  useEffect(() => {
    fetchFacilities();
  }, []);
  
  // Function to fetch facilities from API
  const fetchFacilities = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await careFacilitiesApi.getFacilities();
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch facilities');
      }
      
      // Sort the facilities based on sortBy value
      let sortedFacilities = [...response.data];
      
      if (sortBy === 'rating') {
        sortedFacilities.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'price-low') {
        sortedFacilities.sort((a, b) => {
          const aPrice = parseFloat(a.price_range.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.price_range.replace(/[^0-9.]/g, ''));
          return aPrice - bPrice;
        });
      } else if (sortBy === 'price-high') {
        sortedFacilities.sort((a, b) => {
          const aPrice = parseFloat(a.price_range.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.price_range.replace(/[^0-9.]/g, ''));
          return bPrice - aPrice;
        });
      } else if (sortBy === 'distance') {
        sortedFacilities.sort((a, b) => {
          const aDistance = parseFloat(a.distance.replace(/[^0-9.]/g, ''));
          const bDistance = parseFloat(b.distance.replace(/[^0-9.]/g, ''));
          return aDistance - bDistance;
        });
      } else if (sortBy === 'availability') {
        sortedFacilities.sort((a, b) => b.available_beds - a.available_beds);
      }
      
      setFacilities(sortedFacilities);
    } catch (err: any) {
      console.error('Error fetching facilities:', err);
      setError(err.message || 'Failed to fetch facilities');
      
      // Fallback to empty array if API fails
      setFacilities([]);
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
      
      if (facilityType !== 'all') {
        filters.type = facilityType;
      }
      
      if (priceRange.min && priceRange.max) {
        filters.priceMin = priceRange.min;
        filters.priceMax = priceRange.max;
      }
      
      if (availability) {
        filters.availableBeds = parseInt(availability);
      }
      
      if (location) {
        filters.location = location;
      }
      
      // Fetch facilities with filters
      const response = await careFacilitiesApi.getFacilities(filters);
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch facilities');
      }
      
      // Filter by search term if provided
      let filteredFacilities = response.data;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filteredFacilities = filteredFacilities.filter((facility: any) => 
          facility.name.toLowerCase().includes(searchLower) ||
          facility.description.toLowerCase().includes(searchLower) ||
          facility.type.toLowerCase().includes(searchLower) ||
          facility.amenities.some((amenity: string) => 
            amenity.toLowerCase().includes(searchLower)
          ) ||
          facility.medical_services.some((service: string) => 
            service.toLowerCase().includes(searchLower)
          )
        );
      }
      
      // Sort the facilities based on sortBy value
      let sortedFacilities = [...filteredFacilities];
      
      if (sortBy === 'rating') {
        sortedFacilities.sort((a, b) => b.rating - a.rating);
      } else if (sortBy === 'price-low') {
        sortedFacilities.sort((a, b) => {
          const aPrice = parseFloat(a.price_range.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.price_range.replace(/[^0-9.]/g, ''));
          return aPrice - bPrice;
        });
      } else if (sortBy === 'price-high') {
        sortedFacilities.sort((a, b) => {
          const aPrice = parseFloat(a.price_range.replace(/[^0-9.]/g, ''));
          const bPrice = parseFloat(b.price_range.replace(/[^0-9.]/g, ''));
          return bPrice - aPrice;
        });
      } else if (sortBy === 'distance') {
        sortedFacilities.sort((a, b) => {
          const aDistance = parseFloat(a.distance.replace(/[^0-9.]/g, ''));
          const bDistance = parseFloat(b.distance.replace(/[^0-9.]/g, ''));
          return aDistance - bDistance;
        });
      } else if (sortBy === 'availability') {
        sortedFacilities.sort((a, b) => b.available_beds - a.available_beds);
      }
      
      setFacilities(sortedFacilities);
    } catch (err: any) {
      console.error('Error searching facilities:', err);
      setError(err.message || 'Failed to search facilities');
    } finally {
      setLoading(false);
    }
  };

  const handleCompareToggle = (id: number) => {
    if (compareList.includes(id)) {
      setCompareList(compareList.filter(facilityId => facilityId !== id));
    } else {
      // Limit to comparing 3 facilities at a time
      if (compareList.length < 3) {
        setCompareList([...compareList, id]);
      }
    }
  };

  const getComparedFacilities = () => {
    return facilities.filter(facility => compareList.includes(facility.id));
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Care Facilities Comparer</h1>
        <p className="text-gray-600 dark:text-gray-400">Compare care facilities to find the best option for your needs</p>
      </div>
      
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="search">Search Facilities</TabsTrigger>
          <TabsTrigger value="compare" disabled={compareList.length < 2}>
            Compare ({compareList.length}/3)
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="search" className="mt-6">
          {/* Search and Filter Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  placeholder="Search by name, amenities, or services..."
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Facility Type</label>
                      <Select value={facilityType} onValueChange={setFacilityType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Assisted Living">Assisted Living</SelectItem>
                          <SelectItem value="Memory Care">Memory Care</SelectItem>
                          <SelectItem value="Nursing Home">Nursing Home</SelectItem>
                          <SelectItem value="Independent Living">Independent Living</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Price Range (Monthly)</label>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={priceRange.min}
                          onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                          className="w-full"
                        />
                        <span>-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={priceRange.max}
                          onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                          className="w-full"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Available Beds</label>
                      <Select value={availability} onValueChange={setAvailability}>
                        <SelectTrigger>
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Any</SelectItem>
                          <SelectItem value="1">At least 1</SelectItem>
                          <SelectItem value="3">At least 3</SelectItem>
                          <SelectItem value="5">At least 5</SelectItem>
                          <SelectItem value="10">At least 10</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Sort by</label>
                      <Select value={sortBy} onValueChange={(value) => {
                        setSortBy(value);
                        // Re-sort facilities when sort option changes
                        if (facilities.length > 0) {
                          let sortedFacilities = [...facilities];
                          
                          if (value === 'rating') {
                            sortedFacilities.sort((a, b) => b.rating - a.rating);
                          } else if (value === 'price-low') {
                            sortedFacilities.sort((a, b) => {
                              const aPrice = parseFloat(a.price_range.replace(/[^0-9.]/g, ''));
                              const bPrice = parseFloat(b.price_range.replace(/[^0-9.]/g, ''));
                              return aPrice - bPrice;
                            });
                          } else if (value === 'price-high') {
                            sortedFacilities.sort((a, b) => {
                              const aPrice = parseFloat(a.price_range.replace(/[^0-9.]/g, ''));
                              const bPrice = parseFloat(b.price_range.replace(/[^0-9.]/g, ''));
                              return bPrice - aPrice;
                            });
                          } else if (value === 'distance') {
                            sortedFacilities.sort((a, b) => {
                              const aDistance = parseFloat(a.distance.replace(/[^0-9.]/g, ''));
                              const bDistance = parseFloat(b.distance.replace(/[^0-9.]/g, ''));
                              return aDistance - bDistance;
                            });
                          } else if (value === 'availability') {
                            sortedFacilities.sort((a, b) => b.available_beds - a.available_beds);
                          }
                          
                          setFacilities(sortedFacilities);
                        }
                      }}>
                        <SelectTrigger>
                          <SelectValue placeholder="Highest Rated" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rating">Highest Rated</SelectItem>
                          <SelectItem value="price-low">Price: Low to High</SelectItem>
                          <SelectItem value="price-high">Price: High to Low</SelectItem>
                          <SelectItem value="distance">Closest to me</SelectItem>
                          <SelectItem value="availability">Most Available Beds</SelectItem>
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
                  Loading facilities...
                </span>
              ) : (
                `${facilities.length} Facilities Available`
              )}
            </h2>
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
          {!loading && facilities.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No facilities found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Try adjusting your search filters or location to find more results.
              </p>
              <Button onClick={fetchFacilities}>
                Reset Filters
              </Button>
            </div>
          )}
          
          {/* Facilities Grid */}
          {!loading && facilities.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facilities.map(facility => (
                <Card key={facility.id} className="overflow-hidden">
                  <div className="relative h-48 bg-gray-100">
                    <img 
                      src={facility.image || '/images/placeholder-facility.jpg'} 
                      alt={facility.name}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-white text-black">
                      {facility.type}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{facility.name}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                        <span className="text-sm font-medium">{facility.rating}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{facility.address}</span>
                      <span className="ml-1">• {facility.distance}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 mr-1 text-gray-500" />
                        <span>{facility.price_range}</span>
                      </div>
                      <div className="flex items-center">
                        <Bed className="h-3 w-3 mr-1 text-gray-500" />
                        <span>{facility.available_beds} available</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{facility.description}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {facility.amenities && facility.amenities.slice(0, 3).map((amenity: string) => (
                        <Badge key={amenity} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {facility.amenities && facility.amenities.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{facility.amenities.length - 3} more
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => handleCompareToggle(facility.id)}>
                        {compareList.includes(facility.id) ? (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Remove
                          </>
                        ) : (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Compare
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm">
                        <PhoneCall className="h-3 w-3 mr-1" />
                        {facility.phone}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="compare" className="mt-6">
          {compareList.length >= 2 ? (
            <div>
              <h2 className="text-xl font-semibold mb-6">Comparing {compareList.length} Facilities</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">Feature</th>
                      {getComparedFacilities().map(facility => (
                        <th key={facility.id} className="text-left p-4 font-medium">
                          {facility.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Type</td>
                      {getComparedFacilities().map(facility => (
                        <td key={facility.id} className="p-4">{facility.type}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Rating</td>
                      {getComparedFacilities().map(facility => (
                        <td key={facility.id} className="p-4">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span>{facility.rating} ({facility.review_count} reviews)</span>
                          </div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Price Range</td>
                      {getComparedFacilities().map(facility => (
                        <td key={facility.id} className="p-4">{facility.price_range}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Available Beds</td>
                      {getComparedFacilities().map(facility => (
                        <td key={facility.id} className="p-4">{facility.available_beds} of {facility.beds}</td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Location</td>
                      {getComparedFacilities().map(facility => (
                        <td key={facility.id} className="p-4">
                          <div>{facility.address}</div>
                          <div className="text-sm text-gray-500">{facility.distance}</div>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Amenities</td>
                      {getComparedFacilities().map(facility => (
                        <td key={facility.id} className="p-4">
                          <ul className="list-disc list-inside">
                            {facility.amenities && facility.amenities.map((amenity: string) => (
                              <li key={amenity} className="text-sm mb-1">{amenity}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Medical Services</td>
                      {getComparedFacilities().map(facility => (
                        <td key={facility.id} className="p-4">
                          <ul className="list-disc list-inside">
                            {facility.medical_services && facility.medical_services.map((service: string) => (
                              <li key={service} className="text-sm mb-1">{service}</li>
                            ))}
                          </ul>
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 font-medium">Contact</td>
                      {getComparedFacilities().map(facility => (
                        <td key={facility.id} className="p-4">
                          <Button variant="outline" size="sm">
                            <PhoneCall className="h-3 w-3 mr-1" />
                            {facility.phone}
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => setCompareList([])}>
                  Clear Comparison
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">Select at least 2 facilities to compare</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Use the "Compare" button on facility cards to add them to your comparison.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CareFacilitiesComparer; 