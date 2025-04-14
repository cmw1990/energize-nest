
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pill, Search, List, Grid3X3, Filter, Info, Star, PlusCircle, Timer, Brain, Zap, Flame, Heart, Coffee, Eye } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/components/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";

// Supplement type definition
interface Supplement {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  evidence_level: 'high' | 'moderate' | 'low' | 'very-low';
  safety_concerns: string[];
  typical_dosage: string;
  timing: string;
  interactions: string[];
  is_favorite?: boolean;
  user_notes?: string;
  effectiveness_rating?: number;
  is_tracked?: boolean;
}

// Category icon mapping
const categoryIcons: Record<string, React.ReactNode> = {
  'nootropic': <Brain className="h-5 w-5 text-indigo-500" />,
  'energy': <Zap className="h-5 w-5 text-amber-500" />,
  'vitamin': <Pill className="h-5 w-5 text-emerald-500" />,
  'mineral': <Coffee className="h-5 w-5 text-cyan-500" />,
  'amino-acid': <Flame className="h-5 w-5 text-red-500" />,
  'herbal': <Pill className="h-5 w-5 text-green-500" />,
  'hormonal': <Eye className="h-5 w-5 text-purple-500" />,
  'sleep': <Timer className="h-5 w-5 text-blue-500" />,
  'cardiovascular': <Heart className="h-5 w-5 text-pink-500" />,
  'other': <Pill className="h-5 w-5 text-gray-500" />
};

// Evidence level badge mapping
const evidenceBadgeVariant: Record<string, string> = {
  'high': 'default',
  'moderate': 'secondary',
  'low': 'outline',
  'very-low': 'destructive'
};

export function SupplementGuide() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [evidenceFilter, setEvidenceFilter] = useState<string>('');
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const [isAddingSupplementLog, setIsAddingSupplementLog] = useState(false);
  
  // Fetch all supplements
  const { data: supplements = [], isLoading } = useQuery({
    queryKey: ['supplements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching supplements:', error);
        throw error;
      }
      
      return data as Supplement[];
    }
  });
  
  // Fetch user's favorite supplements
  const { data: userSupplements = [] } = useQuery({
    queryKey: ['user-supplements', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_supplements')
        .select('*, supplement_id(*)')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error('Error fetching user supplements:', error);
        throw error;
      }
      
      // Convert to proper format
      return data.map(item => ({
        ...item.supplement_id,
        is_favorite: true,
        user_notes: item.notes,
        effectiveness_rating: item.effectiveness_rating,
        is_tracked: item.is_tracked
      })) as Supplement[];
    },
    enabled: !!session?.user?.id
  });
  
  // Toggle supplement favorite status
  const toggleFavorite = useMutation({
    mutationFn: async (supplement: Supplement) => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      if (supplement.is_favorite) {
        // Remove favorite
        const { error } = await supabase
          .from('user_supplements')
          .delete()
          .eq('user_id', session.user.id)
          .eq('supplement_id', supplement.id);
        
        if (error) throw error;
        return { ...supplement, is_favorite: false };
      } else {
        // Add favorite
        const { error } = await supabase
          .from('user_supplements')
          .insert({
            user_id: session.user.id,
            supplement_id: supplement.id,
            is_tracked: false,
            effectiveness_rating: 0,
            notes: ''
          });
        
        if (error) throw error;
        return { ...supplement, is_favorite: true };
      }
    },
    onSuccess: (updatedSupplement) => {
      queryClient.invalidateQueries({ queryKey: ['user-supplements', session?.user?.id] });
      toast({
        title: updatedSupplement.is_favorite 
          ? 'Added to favorites' 
          : 'Removed from favorites',
        description: `${updatedSupplement.name} has been ${updatedSupplement.is_favorite ? 'added to' : 'removed from'} your tracked supplements.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating favorites',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  });
  
  // Update supplement tracking info
  const updateSupplementTracking = useMutation({
    mutationFn: async (data: { 
      supplementId: string; 
      isTracked?: boolean;
      effectivenessRating?: number;
      notes?: string;
    }) => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      const { data: existingData, error: fetchError } = await supabase
        .from('user_supplements')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('supplement_id', data.supplementId)
        .single();
      
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      const updateData: any = {};
      if (data.isTracked !== undefined) updateData.is_tracked = data.isTracked;
      if (data.effectivenessRating !== undefined) updateData.effectiveness_rating = data.effectivenessRating;
      if (data.notes !== undefined) updateData.notes = data.notes;
      
      if (existingData) {
        // Update existing entry
        const { error } = await supabase
          .from('user_supplements')
          .update(updateData)
          .eq('user_id', session.user.id)
          .eq('supplement_id', data.supplementId);
        
        if (error) throw error;
      } else {
        // Insert new entry
        const { error } = await supabase
          .from('user_supplements')
          .insert({
            user_id: session.user.id,
            supplement_id: data.supplementId,
            is_tracked: data.isTracked || false,
            effectiveness_rating: data.effectivenessRating || 0,
            notes: data.notes || ''
          });
        
        if (error) throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-supplements', session?.user?.id] });
      toast({
        title: 'Supplement updated',
        description: 'Your supplement tracking information has been updated.',
      });
      setIsAddingSupplementLog(false);
    },
    onError: (error) => {
      toast({
        title: 'Error updating supplement',
        description: (error as Error).message,
        variant: 'destructive',
      });
    }
  });
  
  // Filter supplements based on active tab, search, and filters
  const filteredSupplements = React.useMemo(() => {
    let result = [...supplements];
    
    // Add favorite status from userSupplements
    result = result.map(supp => {
      const userSupp = userSupplements.find(us => us.id === supp.id);
      return userSupp ? { ...supp, ...userSupp } : supp;
    });
    
    // Filter by tab
    if (activeTab === 'favorites') {
      result = result.filter(supp => supp.is_favorite);
    } else if (activeTab === 'tracked') {
      result = result.filter(supp => supp.is_tracked);
    }
    
    // Apply search filter
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(supp => 
        supp.name.toLowerCase().includes(lowercaseSearch) ||
        supp.description.toLowerCase().includes(lowercaseSearch) ||
        supp.benefits.some(b => b.toLowerCase().includes(lowercaseSearch))
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(supp => supp.category === categoryFilter);
    }
    
    // Apply evidence filter
    if (evidenceFilter) {
      result = result.filter(supp => supp.evidence_level === evidenceFilter);
    }
    
    return result;
  }, [supplements, userSupplements, activeTab, searchTerm, categoryFilter, evidenceFilter]);
  
  // Get all available categories
  const categories = React.useMemo(() => {
    const uniqueCategories = new Set(supplements.map(supp => supp.category));
    return Array.from(uniqueCategories);
  }, [supplements]);
  
  // Handle supplement selection
  const handleSelectSupplement = (supplement: Supplement) => {
    setSelectedSupplement(supplement);
  };
  
  // Format text for improved readability
  const formatBulletList = (items: string[]) => {
    return items.length === 0 ? (
      <p className="text-muted-foreground text-sm">None reported</p>
    ) : (
      <ul className="list-disc list-inside space-y-1 text-sm">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  };
  
  // Render supplement card
  const renderSupplementCard = (supplement: Supplement) => (
    <Card 
      key={supplement.id} 
      className={`h-full transition-shadow hover:shadow-md ${supplement.is_favorite ? 'border-primary/30' : ''}`}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            {categoryIcons[supplement.category] || <Pill className="h-5 w-5 text-muted-foreground" />}
            <CardTitle className="text-base truncate max-w-[180px]">
              {supplement.name}
            </CardTitle>
          </div>
          
          <div className="flex space-x-1">
            <Badge variant={evidenceBadgeVariant[supplement.evidence_level] || 'outline'}>
              {supplement.evidence_level?.replace('-', ' ')}
            </Badge>
            
            {supplement.is_tracked && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30">
                Tracking
              </Badge>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-2 h-10">
          {supplement.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Top Benefits</h4>
            <div className="flex flex-wrap gap-1">
              {supplement.benefits.slice(0, 3).map((benefit, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {benefit}
                </Badge>
              ))}
              {supplement.benefits.length > 3 && (
                <Badge variant="outline" className="text-xs">+{supplement.benefits.length - 3}</Badge>
              )}
            </div>
          </div>
          
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-1">Typical Dosage</h4>
            <p className="text-sm">{supplement.typical_dosage}</p>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => handleSelectSupplement(supplement)}
        >
          <Info className="h-4 w-4 mr-1" />
          Details
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFavorite.mutate(supplement)}
          disabled={!session?.user?.id}
        >
          <Star 
            className={`h-4 w-4 ${supplement.is_favorite ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}`} 
          />
        </Button>
      </CardFooter>
    </Card>
  );
  
  // Render supplement in list format
  const renderSupplementListItem = (supplement: Supplement) => (
    <div 
      key={supplement.id} 
      className={`py-3 px-4 border-b hover:bg-muted/50 transition-colors ${supplement.is_favorite ? 'bg-primary/5' : ''}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1">
            {categoryIcons[supplement.category] || <Pill className="h-4 w-4 text-muted-foreground" />}
            <h3 className="font-medium text-base">{supplement.name}</h3>
            <Badge variant={evidenceBadgeVariant[supplement.evidence_level] || 'outline'} className="text-xs">
              {supplement.evidence_level?.replace('-', ' ')}
            </Badge>
            
            {supplement.is_tracked && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30 text-xs">
                Tracking
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
            {supplement.description}
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-xs text-muted-foreground mr-1">Dosage:</span>
              {supplement.typical_dosage}
            </div>
            <div>
              <span className="text-xs text-muted-foreground mr-1">Timing:</span>
              {supplement.timing}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleSelectSupplement(supplement)}
          >
            <Info className="h-4 w-4 mr-1" />
            Details
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite.mutate(supplement)}
            disabled={!session?.user?.id}
          >
            <Star 
              className={`h-4 w-4 ${supplement.is_favorite ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}`} 
            />
          </Button>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div className="flex-grow relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search supplements..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 border rounded-md">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-none rounded-l-md"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="sm"
              className="rounded-none rounded-r-md"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[170px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Category" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  <div className="flex items-center gap-2">
                    {categoryIcons[category] || <Pill className="h-4 w-4" />}
                    <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={evidenceFilter} onValueChange={setEvidenceFilter}>
            <SelectTrigger className="w-[170px]">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                <SelectValue placeholder="Evidence Level" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Evidence Levels</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="very-low">Very Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-[400px]">
          <TabsTrigger value="all">All Supplements</TabsTrigger>
          <TabsTrigger value="favorites">
            Saved
            <Badge variant="secondary" className="ml-2">{userSupplements.filter(s => s.is_favorite).length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="tracked">
            Tracking
            <Badge variant="secondary" className="ml-2">{userSupplements.filter(s => s.is_tracked).length}</Badge>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <Card key={i} className="h-[220px] animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-muted rounded w-2/3 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-3/4 mt-1"></div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="h-4 bg-muted rounded w-full mt-4 mb-2"></div>
                    <div className="flex gap-1">
                      <div className="h-6 bg-muted rounded w-16"></div>
                      <div className="h-6 bg-muted rounded w-16"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-1/2 mt-4"></div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="h-8 bg-muted rounded w-20"></div>
                    <div className="h-8 bg-muted rounded w-8"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredSupplements.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSupplements.map(renderSupplementCard)}
              </div>
            ) : (
              <div className="border rounded-md">
                {filteredSupplements.map(renderSupplementListItem)}
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <Pill className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No supplements found</h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters to see more results.
              </p>
              
              {(categoryFilter || evidenceFilter || searchTerm) && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setCategoryFilter('');
                    setEvidenceFilter('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          {!session?.user?.id ? (
            <div className="text-center py-12 border rounded-md">
              <h3 className="text-lg font-medium">Sign in to save supplements</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Create an account to save and track your favorite supplements.
              </p>
              <Button>Sign In</Button>
            </div>
          ) : userSupplements.filter(s => s.is_favorite).length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No saved supplements</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Save supplements by clicking the star icon to add them to your favorites.
              </p>
              <Button variant="outline" onClick={() => setActiveTab('all')}>
                Browse Supplements
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSupplements.map(renderSupplementCard)}
            </div>
          ) : (
            <div className="border rounded-md">
              {filteredSupplements.map(renderSupplementListItem)}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tracked" className="mt-6">
          {!session?.user?.id ? (
            <div className="text-center py-12 border rounded-md">
              <h3 className="text-lg font-medium">Sign in to track supplements</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Create an account to track supplements you're taking and rate their effectiveness.
              </p>
              <Button>Sign In</Button>
            </div>
          ) : userSupplements.filter(s => s.is_tracked).length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <PlusCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No tracked supplements</h3>
              <p className="text-muted-foreground mt-1 mb-4">
                Add supplements to your tracking list to monitor effectiveness and keep notes.
              </p>
              <Button variant="outline" onClick={() => setActiveTab('all')}>
                Browse Supplements
              </Button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSupplements.map(renderSupplementCard)}
            </div>
          ) : (
            <div className="border rounded-md">
              {filteredSupplements.map(renderSupplementListItem)}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Supplement Detail Sheet */}
      <Sheet open={!!selectedSupplement} onOpenChange={(open) => !open && setSelectedSupplement(null)}>
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto">
          <SheetHeader>
            <div className="flex items-center gap-2">
              {selectedSupplement && categoryIcons[selectedSupplement.category]}
              <SheetTitle>{selectedSupplement?.name}</SheetTitle>
            </div>
            <SheetDescription>
              {selectedSupplement?.description}
            </SheetDescription>
          </SheetHeader>
          
          {selectedSupplement && (
            <div className="py-4 space-y-6">
              <div className="flex flex-wrap gap-2">
                <Badge variant={evidenceBadgeVariant[selectedSupplement.evidence_level] || 'outline'}>
                  {selectedSupplement.evidence_level?.replace('-', ' ')} evidence
                </Badge>
                <Badge variant="outline">{selectedSupplement.category}</Badge>
                {selectedSupplement.is_tracked && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30">
                    Currently Tracking
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Typical Dosage</h3>
                  <p className="text-sm">{selectedSupplement.typical_dosage}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Timing</h3>
                  <p className="text-sm">{selectedSupplement.timing}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Benefits</h3>
                {formatBulletList(selectedSupplement.benefits)}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Safety Concerns</h3>
                {formatBulletList(selectedSupplement.safety_concerns)}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-1">Potential Interactions</h3>
                {formatBulletList(selectedSupplement.interactions)}
              </div>
              
              {session?.user?.id && (
                <>
                  {selectedSupplement.is_tracked && (
                    <div className="border-t pt-4 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <h3 className="text-sm font-medium">Your Tracking</h3>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setIsAddingSupplementLog(true)}
                        >
                          <PlusCircle className="h-4 w-4 mr-1" />
                          Update
                        </Button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs text-muted-foreground">Effectiveness Rating</h4>
                          <div className="flex items-center gap-1 mt-1">
                            {Array(5).fill(0).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-5 w-5 ${i < (selectedSupplement.effectiveness_rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs text-muted-foreground">Your Notes</h4>
                          <p className="text-sm mt-1">
                            {selectedSupplement.user_notes || "No notes added yet."}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between gap-4">
                      <Button 
                        variant={selectedSupplement.is_favorite ? "default" : "outline"}
                        onClick={() => toggleFavorite.mutate(selectedSupplement)}
                        className="flex-1"
                      >
                        <Star className={`h-4 w-4 mr-2 ${selectedSupplement.is_favorite ? 'fill-white' : ''}`} />
                        {selectedSupplement.is_favorite ? 'Saved' : 'Save'}
                      </Button>
                      <Button 
                        variant={selectedSupplement.is_tracked ? "secondary" : "outline"}
                        onClick={() => selectedSupplement.is_tracked
                          ? updateSupplementTracking.mutate({
                              supplementId: selectedSupplement.id,
                              isTracked: false
                            })
                          : setIsAddingSupplementLog(true)
                        }
                        className="flex-1"
                      >
                        {selectedSupplement.is_tracked ? (
                          <>
                            <Checkbox 
                              checked={true} 
                              className="h-4 w-4 mr-2 pointer-events-none" 
                            />
                            Tracking
                          </>
                        ) : (
                          <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Track
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          
          <SheetFooter className="mt-2">
            <SheetClose asChild>
              <Button variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      
      {/* Add/Update Tracking Dialog */}
      {selectedSupplement && (
        <Dialog open={isAddingSupplementLog} onOpenChange={setIsAddingSupplementLog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Track {selectedSupplement.name}</DialogTitle>
              <DialogDescription>
                Track this supplement and record its effectiveness.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label 
                    htmlFor="tracking-status" 
                    className="text-base font-normal flex items-center gap-2"
                  >
                    <Checkbox 
                      id="tracking-status" 
                      checked={true} 
                      className="pointer-events-none" 
                    />
                    Currently Taking
                  </Label>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="effectiveness">Effectiveness Rating</Label>
                <div className="flex items-center gap-1">
                  {Array(5).fill(0).map((_, i) => (
                    <Button 
                      key={i} 
                      variant="ghost" 
                      size="sm" 
                      className="p-1 h-auto"
                      onClick={() => updateSupplementTracking.mutate({
                        supplementId: selectedSupplement.id,
                        effectivenessRating: i + 1,
                        isTracked: true
                      })}
                    >
                      <Star 
                        className={`h-6 w-6 ${i < (selectedSupplement.effectiveness_rating || 0) ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground'}`} 
                      />
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  placeholder="Add your observations, side effects, or any other notes here..."
                  value={selectedSupplement.user_notes || ''}
                  onChange={(e) => updateSupplementTracking.mutate({
                    supplementId: selectedSupplement.id,
                    notes: e.target.value,
                    isTracked: true
                  })}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddingSupplementLog(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => updateSupplementTracking.mutate({
                  supplementId: selectedSupplement.id,
                  isTracked: true
                })}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
