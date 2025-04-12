
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Edit, Plus, Search, Trash } from "lucide-react";

type TeaLibraryItem = {
  id: string;
  user_id: string;
  tea_name: string;
  tea_type: string;
  description: string;
  origin: string;
  vendor: string;
  purchase_date?: string;
  price?: string;
  shelf_life?: string;
  brewing_notes?: string;
  tags?: string[];
  image_url?: string;
  created_at: string;
};

const teaTypes = [
  { value: "black", label: "Black Tea" },
  { value: "green", label: "Green Tea" },
  { value: "white", label: "White Tea" },
  { value: "oolong", label: "Oolong Tea" },
  { value: "yellow", label: "Yellow Tea" },
  { value: "puerh", label: "Pu-erh Tea" },
  { value: "herbal", label: "Herbal Tea" },
  { value: "rooibos", label: "Rooibos" },
  { value: "mate", label: "Yerba Mate" },
  { value: "chai", label: "Chai" },
  { value: "blend", label: "Tea Blend" },
  { value: "other", label: "Other" },
];

export function TeaLibraryTab() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentTea, setCurrentTea] = useState<TeaLibraryItem | null>(null);
  const [newTea, setNewTea] = useState({
    tea_name: "",
    tea_type: "black",
    description: "",
    origin: "",
    vendor: "",
    purchase_date: "",
    price: "",
    shelf_life: "",
    brewing_notes: "",
    tags: [],
  });

  const { data: teaLibrary, isLoading, error, refetch } = useQuery({
    queryKey: ["tea-library", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("tea_library")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as TeaLibraryItem[];
    },
    enabled: !!session?.user?.id,
  });

  const addTeaToLibrary = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from("tea_library")
        .insert({
          user_id: session.user.id,
          tea_name: newTea.tea_name,
          tea_type: newTea.tea_type,
          description: newTea.description,
          origin: newTea.origin,
          vendor: newTea.vendor,
          purchase_date: newTea.purchase_date || null,
          price: newTea.price || null,
          shelf_life: newTea.shelf_life || null,
          brewing_notes: newTea.brewing_notes || null,
          tags: newTea.tags.length > 0 ? newTea.tags : null,
        });
        
      if (error) throw error;
      
      toast({
        title: "Tea added to library",
        description: `${newTea.tea_name} has been added to your tea library.`,
      });
      
      setAddDialogOpen(false);
      setNewTea({
        tea_name: "",
        tea_type: "black",
        description: "",
        origin: "",
        vendor: "",
        purchase_date: "",
        price: "",
        shelf_life: "",
        brewing_notes: "",
        tags: [],
      });
      refetch();
    } catch (error) {
      console.error("Error adding tea to library:", error);
      toast({
        title: "Error",
        description: "Failed to add tea to library. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateTeaInLibrary = async () => {
    if (!session?.user?.id || !currentTea) return;
    
    try {
      const { error } = await supabase
        .from("tea_library")
        .update({
          tea_name: currentTea.tea_name,
          tea_type: currentTea.tea_type,
          description: currentTea.description,
          origin: currentTea.origin,
          vendor: currentTea.vendor,
          purchase_date: currentTea.purchase_date || null,
          price: currentTea.price || null,
          shelf_life: currentTea.shelf_life || null,
          brewing_notes: currentTea.brewing_notes || null,
          tags: currentTea.tags?.length ? currentTea.tags : null,
        })
        .eq("id", currentTea.id);
        
      if (error) throw error;
      
      toast({
        title: "Tea updated",
        description: `${currentTea.tea_name} has been updated in your tea library.`,
      });
      
      setEditDialogOpen(false);
      setCurrentTea(null);
      refetch();
    } catch (error) {
      console.error("Error updating tea:", error);
      toast({
        title: "Error",
        description: "Failed to update tea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteTeaFromLibrary = async () => {
    if (!session?.user?.id || !currentTea) return;
    
    try {
      const { error } = await supabase
        .from("tea_library")
        .delete()
        .eq("id", currentTea.id);
        
      if (error) throw error;
      
      toast({
        title: "Tea deleted",
        description: `${currentTea.tea_name} has been removed from your tea library.`,
      });
      
      setDeleteDialogOpen(false);
      setCurrentTea(null);
      refetch();
    } catch (error) {
      console.error("Error deleting tea:", error);
      toast({
        title: "Error",
        description: "Failed to delete tea. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredTea = teaLibrary?.filter(tea => 
    tea.tea_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tea.tea_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tea.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tea.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (tea.description && tea.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleTagChange = (value: string) => {
    setNewTea(prev => {
      const tagArray = value.split(",").map(tag => tag.trim()).filter(Boolean);
      return { ...prev, tags: tagArray };
    });
  };

  const handleEditTagChange = (value: string) => {
    if (!currentTea) return;
    
    setCurrentTea(prev => {
      if (!prev) return prev;
      const tagArray = value.split(",").map(tag => tag.trim()).filter(Boolean);
      return { ...prev, tags: tagArray };
    });
  };

  const getTeaTypeColor = (type: string) => {
    switch (type) {
      case 'black': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'green': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'white': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'oolong': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'yellow': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'puerh': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'herbal': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'rooibos': return 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300';
      case 'mate': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300';
      case 'chai': return 'bg-brown-100 text-brown-800 dark:bg-brown-900 dark:text-brown-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading tea library...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-destructive">Error loading tea library: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search tea collection..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 md:w-80"
          />
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Tea
        </Button>
      </div>
      
      {filteredTea && filteredTea.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTea.map((tea) => (
            <Card key={tea.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{tea.tea_name}</CardTitle>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 ${getTeaTypeColor(tea.tea_type)}`}
                    >
                      {tea.tea_type}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setCurrentTea(tea);
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
                        setCurrentTea(tea);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {tea.vendor && (
                  <CardDescription>
                    {tea.vendor}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="mb-2">{tea.description}</p>
                  {tea.origin && (
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Origin:</span>
                      <span>{tea.origin}</span>
                    </div>
                  )}
                  {tea.price && (
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Price:</span>
                      <span>{tea.price}</span>
                    </div>
                  )}
                  {tea.purchase_date && (
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Purchased:</span>
                      <span>{new Date(tea.purchase_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {tea.brewing_notes && (
                    <div className="mt-2">
                      <span className="font-medium">Brewing Notes:</span>
                      <p className="text-muted-foreground mt-1">{tea.brewing_notes}</p>
                    </div>
                  )}
                  {tea.tags && tea.tags.length > 0 && (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-1 mt-1">
                        {tea.tags.map((tag, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
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
          <p className="text-muted-foreground mb-4">No teas in your library. Add your first tea to get started.</p>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Tea
          </Button>
        </div>
      )}

      {/* Add Tea Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Tea to Library</DialogTitle>
            <DialogDescription>
              Add a new tea to your personal tea library for easy tracking and brewing.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tea_name">Tea Name</Label>
                <Input 
                  id="tea_name" 
                  value={newTea.tea_name} 
                  onChange={(e) => setNewTea({...newTea, tea_name: e.target.value})}
                  placeholder="e.g., Dragonwell"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tea_type">Tea Type</Label>
                <Select 
                  value={newTea.tea_type} 
                  onValueChange={(value) => setNewTea({...newTea, tea_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select tea type" />
                  </SelectTrigger>
                  <SelectContent>
                    {teaTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newTea.description} 
                onChange={(e) => setNewTea({...newTea, description: e.target.value})}
                placeholder="Brief description of the tea"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Input 
                  id="origin" 
                  value={newTea.origin} 
                  onChange={(e) => setNewTea({...newTea, origin: e.target.value})}
                  placeholder="e.g., China, Yunnan"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor">Vendor</Label>
                <Input 
                  id="vendor" 
                  value={newTea.vendor} 
                  onChange={(e) => setNewTea({...newTea, vendor: e.target.value})}
                  placeholder="e.g., Yunnan Sourcing"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (Optional)</Label>
                <Input 
                  id="price" 
                  value={newTea.price} 
                  onChange={(e) => setNewTea({...newTea, price: e.target.value})}
                  placeholder="e.g., $12.99/50g"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="purchase_date">Purchase Date (Optional)</Label>
                <Input 
                  id="purchase_date" 
                  type="date"
                  value={newTea.purchase_date} 
                  onChange={(e) => setNewTea({...newTea, purchase_date: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shelf_life">Shelf Life (Optional)</Label>
                <Input 
                  id="shelf_life" 
                  value={newTea.shelf_life} 
                  onChange={(e) => setNewTea({...newTea, shelf_life: e.target.value})}
                  placeholder="e.g., 2 years"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (Optional)</Label>
                <Input 
                  id="tags" 
                  value={newTea.tags.join(", ")} 
                  onChange={(e) => handleTagChange(e.target.value)}
                  placeholder="e.g., floral, sweet, smooth"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="brewing_notes">Brewing Notes (Optional)</Label>
              <Textarea 
                id="brewing_notes" 
                value={newTea.brewing_notes} 
                onChange={(e) => setNewTea({...newTea, brewing_notes: e.target.value})}
                placeholder="Recommended brewing parameters and notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={addTeaToLibrary}>
              Add to Library
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tea Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Tea</DialogTitle>
            <DialogDescription>
              Update the details of your tea.
            </DialogDescription>
          </DialogHeader>
          {currentTea && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-tea-name">Tea Name</Label>
                  <Input 
                    id="edit-tea-name" 
                    value={currentTea.tea_name} 
                    onChange={(e) => setCurrentTea({...currentTea, tea_name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tea-type">Tea Type</Label>
                  <Select 
                    value={currentTea.tea_type} 
                    onValueChange={(value) => setCurrentTea({...currentTea, tea_type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select tea type" />
                    </SelectTrigger>
                    <SelectContent>
                      {teaTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea 
                  id="edit-description" 
                  value={currentTea.description} 
                  onChange={(e) => setCurrentTea({...currentTea, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-origin">Origin</Label>
                  <Input 
                    id="edit-origin" 
                    value={currentTea.origin} 
                    onChange={(e) => setCurrentTea({...currentTea, origin: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-vendor">Vendor</Label>
                  <Input 
                    id="edit-vendor" 
                    value={currentTea.vendor} 
                    onChange={(e) => setCurrentTea({...currentTea, vendor: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price</Label>
                  <Input 
                    id="edit-price" 
                    value={currentTea.price || ""} 
                    onChange={(e) => setCurrentTea({...currentTea, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-purchase-date">Purchase Date</Label>
                  <Input 
                    id="edit-purchase-date" 
                    type="date"
                    value={currentTea.purchase_date || ""} 
                    onChange={(e) => setCurrentTea({...currentTea, purchase_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-shelf-life">Shelf Life</Label>
                  <Input 
                    id="edit-shelf-life" 
                    value={currentTea.shelf_life || ""} 
                    onChange={(e) => setCurrentTea({...currentTea, shelf_life: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-tags">Tags</Label>
                  <Input 
                    id="edit-tags" 
                    value={currentTea.tags?.join(", ") || ""} 
                    onChange={(e) => handleEditTagChange(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-brewing-notes">Brewing Notes</Label>
                <Textarea 
                  id="edit-brewing-notes" 
                  value={currentTea.brewing_notes || ""} 
                  onChange={(e) => setCurrentTea({...currentTea, brewing_notes: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={updateTeaInLibrary}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {currentTea?.tea_name} from your tea library? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={deleteTeaFromLibrary}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
