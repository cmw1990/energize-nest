import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash, ExternalLink, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { TeaTracker } from "@/components/supplements/tea/TeaTracker";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { assertType } from "@/utils/typeSafeUtils";

interface Supplement {
  id: string;
  name: string;
  description: string;
  dosage: string;
  frequency: string;
  category: string;
  notes?: string;
  created_at: string;
  user_id: string;
  effects?: string[];
  source?: string;
  brand?: string;
}

const Supplements = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSupplement, setSelectedSupplement] = useState<Supplement | null>(null);
  const [newSupplement, setNewSupplement] = useState({
    name: "",
    description: "",
    dosage: "",
    frequency: "daily",
    category: "vitamin",
    notes: "",
    effects: [],
    source: "",
    brand: ""
  });
  
  const { data: supplements, isLoading, error, refetch } = useQuery({
    queryKey: ['supplements', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });
  
  const handleAddSupplement = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from('supplements')
        .insert([{
          ...newSupplement,
          user_id: session.user.id
        }]);
        
      if (error) throw error;
      
      toast({
        title: "Supplement added",
        description: `${newSupplement.name} has been added to your supplements.`
      });
      
      setAddDialogOpen(false);
      setNewSupplement({
        name: "",
        description: "",
        dosage: "",
        frequency: "daily",
        category: "vitamin",
        notes: "",
        effects: [],
        source: "",
        brand: ""
      });
      refetch();
    } catch (err) {
      console.error("Error adding supplement:", err);
      toast({
        title: "Error",
        description: "Failed to add supplement. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditSupplement = async () => {
    if (!session?.user?.id || !selectedSupplement) return;
    
    try {
      const { error } = await supabase
        .from('supplements')
        .update(selectedSupplement)
        .eq('id', selectedSupplement.id);
        
      if (error) throw error;
      
      toast({
        title: "Supplement updated",
        description: `${selectedSupplement.name} has been updated.`
      });
      
      setEditDialogOpen(false);
      setSelectedSupplement(null);
      refetch();
    } catch (err) {
      console.error("Error updating supplement:", err);
      toast({
        title: "Error",
        description: "Failed to update supplement. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteSupplement = async () => {
    if (!session?.user?.id || !selectedSupplement) return;
    
    try {
      const { error } = await supabase
        .from('supplements')
        .delete()
        .eq('id', selectedSupplement.id);
        
      if (error) throw error;
      
      toast({
        title: "Supplement deleted",
        description: `${selectedSupplement.name} has been removed from your supplements.`
      });
      
      setDeleteDialogOpen(false);
      setSelectedSupplement(null);
      refetch();
    } catch (err) {
      console.error("Error deleting supplement:", err);
      toast({
        title: "Error",
        description: "Failed to delete supplement. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const filteredSupplements = supplements?.filter(supp => 
    supp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supp.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getCategoryColor = (category: string): string => {
    switch (category.toLowerCase()) {
      case 'vitamin': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'mineral': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'herb': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'nootropic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'amino': return 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300';
      case 'probiotic': return 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading supplements...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error loading supplements: {(error as Error).message}</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Supplements Tracker</h1>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Supplement
        </Button>
      </div>
      
      <Tabs defaultValue="supplements" className="w-full">
        <TabsList>
          <TabsTrigger value="supplements">My Supplements</TabsTrigger>
          <TabsTrigger value="tea">Tea Tracker</TabsTrigger>
          <TabsTrigger value="database">Supplement Database</TabsTrigger>
        </TabsList>
        
        <TabsContent value="supplements" className="space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search supplements..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          
          {filteredSupplements && filteredSupplements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredSupplements.map((supplement) => (
                <Card key={supplement.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{supplement.name}</CardTitle>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setSelectedSupplement(supplement);
                            setEditDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="text-destructive"
                          onClick={() => {
                            setSelectedSupplement(supplement);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-1">
                      <Badge 
                        variant="outline" 
                        className={getCategoryColor(supplement.category)}
                      >
                        {supplement.category}
                      </Badge>
                      <Badge variant="outline">{supplement.frequency}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2 mt-1">
                      {supplement.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium">Dosage:</span>
                        <span>{supplement.dosage}</span>
                      </div>
                      {supplement.brand && (
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Brand:</span>
                          <span>{supplement.brand}</span>
                        </div>
                      )}
                      {supplement.effects && supplement.effects.length > 0 && (
                        <div className="mt-2">
                          <span className="font-medium">Effects:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {supplement.effects.map((effect, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {effect}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-muted/20">
              <p className="text-muted-foreground mb-4">No supplements found. Add your first supplement to get started.</p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Supplement
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="tea">
          <TeaTracker />
        </TabsContent>
        
        <TabsContent value="database">
          <Card>
            <CardHeader>
              <CardTitle>Supplement Database</CardTitle>
              <CardDescription>
                Browse our comprehensive database of supplements, including information on efficacy, side effects, and interactions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                Our supplement database is being updated with the latest research. Check back soon for more information.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add New Supplement</DialogTitle>
            <DialogDescription>
              Enter the details of the supplement you're taking. This helps you track your supplement intake effectively.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={newSupplement.name} 
                  onChange={(e) => setNewSupplement({...newSupplement, name: e.target.value})}
                  placeholder="e.g., Vitamin D3"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={newSupplement.category} 
                  onValueChange={(value) => setNewSupplement({...newSupplement, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vitamin">Vitamin</SelectItem>
                    <SelectItem value="mineral">Mineral</SelectItem>
                    <SelectItem value="herb">Herb/Botanical</SelectItem>
                    <SelectItem value="nootropic">Nootropic</SelectItem>
                    <SelectItem value="amino">Amino Acid</SelectItem>
                    <SelectItem value="probiotic">Probiotic</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newSupplement.description} 
                onChange={(e) => setNewSupplement({...newSupplement, description: e.target.value})}
                placeholder="Brief description of the supplement"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input 
                  id="dosage" 
                  value={newSupplement.dosage} 
                  onChange={(e) => setNewSupplement({...newSupplement, dosage: e.target.value})}
                  placeholder="e.g., 1000 IU"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select 
                  value={newSupplement.frequency} 
                  onValueChange={(value) => setNewSupplement({...newSupplement, frequency: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="twice_daily">Twice Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="as_needed">As Needed</SelectItem>
                    <SelectItem value="morning">Morning Only</SelectItem>
                    <SelectItem value="evening">Evening Only</SelectItem>
                    <SelectItem value="with_food">With Food</SelectItem>
                    <SelectItem value="before_bed">Before Bed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand (Optional)</Label>
                <Input 
                  id="brand" 
                  value={newSupplement.brand} 
                  onChange={(e) => setNewSupplement({...newSupplement, brand: e.target.value})}
                  placeholder="e.g., NOW Foods"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="source">Source (Optional)</Label>
                <Input 
                  id="source" 
                  value={newSupplement.source} 
                  onChange={(e) => setNewSupplement({...newSupplement, source: e.target.value})}
                  placeholder="e.g., Online store"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                value={newSupplement.notes} 
                onChange={(e) => setNewSupplement({...newSupplement, notes: e.target.value})}
                placeholder="Any additional notes about this supplement"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleAddSupplement}>
              Add Supplement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Supplement</DialogTitle>
            <DialogDescription>
              Update the details of your supplement.
            </DialogDescription>
          </DialogHeader>
          {selectedSupplement && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Name</Label>
                  <Input 
                    id="edit-name" 
                    value={selectedSupplement.name} 
                    onChange={(e) => setSelectedSupplement({...selectedSupplement, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <Select 
                    value={selectedSupplement.category} 
                    onValueChange={(value) => setSelectedSupplement({...selectedSupplement, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vitamin">Vitamin</SelectItem>
                      <SelectItem value="mineral">Mineral</SelectItem>
                      <SelectItem value="herb">Herb/Botanical</SelectItem>
                      <SelectItem value="nootropic">Nootropic</SelectItem>
                      <SelectItem value="amino">Amino Acid</SelectItem>
                      <SelectItem value="probiotic">Probiotic</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={selectedSupplement.description} 
                  onChange={(e) => setSelectedSupplement({...selectedSupplement, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-dosage">Dosage</Label>
                  <Input 
                    id="edit-dosage" 
                    value={selectedSupplement.dosage} 
                    onChange={(e) => setSelectedSupplement({...selectedSupplement, dosage: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-frequency">Frequency</Label>
                  <Select 
                    value={selectedSupplement.frequency} 
                    onValueChange={(value) => setSelectedSupplement({...selectedSupplement, frequency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="twice_daily">Twice Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="as_needed">As Needed</SelectItem>
                      <SelectItem value="morning">Morning Only</SelectItem>
                      <SelectItem value="evening">Evening Only</SelectItem>
                      <SelectItem value="with_food">With Food</SelectItem>
                      <SelectItem value="before_bed">Before Bed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-brand">Brand (Optional)</Label>
                  <Input 
                    id="edit-brand" 
                    value={selectedSupplement.brand || ""} 
                    onChange={(e) => setSelectedSupplement({...selectedSupplement, brand: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-source">Source (Optional)</Label>
                  <Input 
                    id="edit-source" 
                    value={selectedSupplement.source || ""} 
                    onChange={(e) => setSelectedSupplement({...selectedSupplement, source: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-notes">Notes (Optional)</Label>
                <Textarea 
                  id="edit-notes" 
                  value={selectedSupplement.notes || ""} 
                  onChange={(e) => setSelectedSupplement({...selectedSupplement, notes: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleEditSupplement}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this supplement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleDeleteSupplement}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Supplements;
