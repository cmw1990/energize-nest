
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
import { Edit, ExternalLink, Globe, MapPin, Plus, Search, Star, StarHalf, Trash } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type TeaVendor = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  website?: string;
  location?: string;
  specialties?: string[];
  shipping_notes?: string;
  rating?: number;
  favorite: boolean;
  notes?: string;
  created_at: string;
};

export function TeaVendorsTab() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentVendor, setCurrentVendor] = useState<TeaVendor | null>(null);
  const [newVendor, setNewVendor] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    specialties: [],
    shipping_notes: "",
    rating: 5,
    favorite: false,
    notes: "",
  });

  const { data: vendors, isLoading, error, refetch } = useQuery({
    queryKey: ["tea-vendors", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("tea_vendors")
        .select("*")
        .eq("user_id", session.user.id)
        .order("favorite", { ascending: false })
        .order("name", { ascending: true });
      
      if (error) throw error;
      return data as TeaVendor[];
    },
    enabled: !!session?.user?.id,
  });

  const addVendor = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from("tea_vendors")
        .insert({
          user_id: session.user.id,
          name: newVendor.name,
          description: newVendor.description,
          website: newVendor.website || null,
          location: newVendor.location || null,
          specialties: newVendor.specialties.length > 0 ? newVendor.specialties : null,
          shipping_notes: newVendor.shipping_notes || null,
          rating: newVendor.rating,
          favorite: newVendor.favorite,
          notes: newVendor.notes || null,
        });
        
      if (error) throw error;
      
      toast({
        title: "Vendor added",
        description: `${newVendor.name} has been added to your tea vendors.`,
      });
      
      setAddDialogOpen(false);
      setNewVendor({
        name: "",
        description: "",
        website: "",
        location: "",
        specialties: [],
        shipping_notes: "",
        rating: 5,
        favorite: false,
        notes: "",
      });
      refetch();
    } catch (error) {
      console.error("Error adding vendor:", error);
      toast({
        title: "Error",
        description: "Failed to add vendor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateVendor = async () => {
    if (!session?.user?.id || !currentVendor) return;
    
    try {
      const { error } = await supabase
        .from("tea_vendors")
        .update({
          name: currentVendor.name,
          description: currentVendor.description,
          website: currentVendor.website || null,
          location: currentVendor.location || null,
          specialties: currentVendor.specialties?.length ? currentVendor.specialties : null,
          shipping_notes: currentVendor.shipping_notes || null,
          rating: currentVendor.rating,
          favorite: currentVendor.favorite,
          notes: currentVendor.notes || null,
        })
        .eq("id", currentVendor.id);
        
      if (error) throw error;
      
      toast({
        title: "Vendor updated",
        description: `${currentVendor.name} has been updated.`,
      });
      
      setEditDialogOpen(false);
      setCurrentVendor(null);
      refetch();
    } catch (error) {
      console.error("Error updating vendor:", error);
      toast({
        title: "Error",
        description: "Failed to update vendor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteVendor = async () => {
    if (!session?.user?.id || !currentVendor) return;
    
    try {
      const { error } = await supabase
        .from("tea_vendors")
        .delete()
        .eq("id", currentVendor.id);
        
      if (error) throw error;
      
      toast({
        title: "Vendor deleted",
        description: `${currentVendor.name} has been removed from your vendors.`,
      });
      
      setDeleteDialogOpen(false);
      setCurrentVendor(null);
      refetch();
    } catch (error) {
      console.error("Error deleting vendor:", error);
      toast({
        title: "Error",
        description: "Failed to delete vendor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSpecialtiesChange = (value: string) => {
    setNewVendor(prev => {
      const specialtiesArray = value.split(",").map(item => item.trim()).filter(Boolean);
      return { ...prev, specialties: specialtiesArray };
    });
  };

  const handleEditSpecialtiesChange = (value: string) => {
    if (!currentVendor) return;
    
    setCurrentVendor(prev => {
      if (!prev) return prev;
      const specialtiesArray = value.split(",").map(item => item.trim()).filter(Boolean);
      return { ...prev, specialties: specialtiesArray };
    });
  };

  const toggleFavorite = async (vendor: TeaVendor) => {
    try {
      const { error } = await supabase
        .from("tea_vendors")
        .update({ favorite: !vendor.favorite })
        .eq("id", vendor.id);
        
      if (error) throw error;
      
      toast({
        title: vendor.favorite ? "Removed from favorites" : "Added to favorites",
        description: `${vendor.name} has been ${vendor.favorite ? "removed from" : "added to"} your favorites.`,
      });
      
      refetch();
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredVendors = vendors?.filter(vendor => 
    vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (vendor.description && vendor.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (vendor.location && vendor.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (vendor.specialties && vendor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const renderRatingStars = (rating?: number) => {
    if (!rating) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-primary text-primary" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-primary text-primary" />}
        <span className="ml-1 text-xs text-muted-foreground">({rating})</span>
      </div>
    );
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading tea vendors...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-destructive">Error loading tea vendors: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search vendors..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 md:w-80"
          />
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Vendor
        </Button>
      </div>
      
      {filteredVendors && filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVendors.map((vendor) => (
            <Card key={vendor.id} className={`overflow-hidden hover:shadow-md transition-shadow ${vendor.favorite ? 'border-primary' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="flex items-center gap-2">
                    {vendor.name}
                    {vendor.favorite && (
                      <Badge variant="default" className="ml-2">Favorite</Badge>
                    )}
                  </CardTitle>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => toggleFavorite(vendor)}
                    >
                      <Star className={`h-4 w-4 ${vendor.favorite ? 'fill-primary text-primary' : ''}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setCurrentVendor(vendor);
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
                        setCurrentVendor(vendor);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {renderRatingStars(vendor.rating)}
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="mb-2">{vendor.description}</p>
                  
                  {vendor.location && (
                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{vendor.location}</span>
                    </div>
                  )}
                  
                  {vendor.website && (
                    <div className="flex items-center gap-2 mb-1 text-muted-foreground">
                      <Globe className="h-4 w-4" />
                      <a 
                        href={vendor.website.startsWith('http') ? vendor.website : `https://${vendor.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center"
                      >
                        {vendor.website.replace(/^https?:\/\//, '').replace(/^www\./, '')}
                        <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </div>
                  )}
                  
                  {vendor.specialties && vendor.specialties.length > 0 && (
                    <div className="mt-2">
                      <span className="font-medium">Specialties:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {vendor.specialties.map((specialty, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {vendor.shipping_notes && (
                    <div className="mt-2">
                      <span className="font-medium">Shipping Notes:</span>
                      <p className="text-muted-foreground mt-1">{vendor.shipping_notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              {vendor.notes && (
                <CardFooter className="border-t pt-3 text-sm">
                  <div>
                    <span className="font-medium">Notes:</span>
                    <p className="text-muted-foreground mt-1">{vendor.notes}</p>
                  </div>
                </CardFooter>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">No tea vendors found. Add your favorite tea vendors to get started.</p>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Vendor
          </Button>
        </div>
      )}

      {/* Add Vendor Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Tea Vendor</DialogTitle>
            <DialogDescription>
              Add details about a tea vendor or shop.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor_name">Vendor Name</Label>
                <Input 
                  id="vendor_name" 
                  value={newVendor.name} 
                  onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                  placeholder="e.g., Yunnan Sourcing"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor_description">Description</Label>
              <Textarea 
                id="vendor_description" 
                value={newVendor.description} 
                onChange={(e) => setNewVendor({...newVendor, description: e.target.value})}
                placeholder="Brief description of the vendor"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vendor_website">Website (Optional)</Label>
                <Input 
                  id="vendor_website" 
                  value={newVendor.website} 
                  onChange={(e) => setNewVendor({...newVendor, website: e.target.value})}
                  placeholder="e.g., https://yunnansourcing.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendor_location">Location (Optional)</Label>
                <Input 
                  id="vendor_location" 
                  value={newVendor.location} 
                  onChange={(e) => setNewVendor({...newVendor, location: e.target.value})}
                  placeholder="e.g., China, United States"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor_specialties">Specialties (Optional)</Label>
              <Input 
                id="vendor_specialties" 
                value={newVendor.specialties.join(", ")} 
                onChange={(e) => handleSpecialtiesChange(e.target.value)}
                placeholder="e.g., Pu-erh, Oolong, Teaware (comma separated)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor_shipping">Shipping Notes (Optional)</Label>
              <Textarea 
                id="vendor_shipping" 
                value={newVendor.shipping_notes} 
                onChange={(e) => setNewVendor({...newVendor, shipping_notes: e.target.value})}
                placeholder="Notes about shipping times, costs, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor_rating">Rating</Label>
              <Select 
                value={newVendor.rating.toString()} 
                onValueChange={(value) => setNewVendor({...newVendor, rating: Number(value)})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Poor</SelectItem>
                  <SelectItem value="2">2 - Fair</SelectItem>
                  <SelectItem value="3">3 - Good</SelectItem>
                  <SelectItem value="4">4 - Very Good</SelectItem>
                  <SelectItem value="5">5 - Excellent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="vendor_favorite" 
                checked={newVendor.favorite}
                onCheckedChange={(checked) => setNewVendor({...newVendor, favorite: !!checked})}
              />
              <Label htmlFor="vendor_favorite">Mark as favorite</Label>
            </div>
            <div className="space-y-2">
              <Label htmlFor="vendor_notes">Personal Notes (Optional)</Label>
              <Textarea 
                id="vendor_notes" 
                value={newVendor.notes} 
                onChange={(e) => setNewVendor({...newVendor, notes: e.target.value})}
                placeholder="Any additional personal notes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={addVendor}>
              Add Vendor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Vendor Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Tea Vendor</DialogTitle>
            <DialogDescription>
              Update the details of this tea vendor.
            </DialogDescription>
          </DialogHeader>
          {currentVendor && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_vendor_name">Vendor Name</Label>
                  <Input 
                    id="edit_vendor_name" 
                    value={currentVendor.name} 
                    onChange={(e) => setCurrentVendor({...currentVendor, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_vendor_description">Description</Label>
                <Textarea 
                  id="edit_vendor_description" 
                  value={currentVendor.description} 
                  onChange={(e) => setCurrentVendor({...currentVendor, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_vendor_website">Website</Label>
                  <Input 
                    id="edit_vendor_website" 
                    value={currentVendor.website || ""} 
                    onChange={(e) => setCurrentVendor({...currentVendor, website: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_vendor_location">Location</Label>
                  <Input 
                    id="edit_vendor_location" 
                    value={currentVendor.location || ""} 
                    onChange={(e) => setCurrentVendor({...currentVendor, location: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_vendor_specialties">Specialties</Label>
                <Input 
                  id="edit_vendor_specialties" 
                  value={currentVendor.specialties?.join(", ") || ""} 
                  onChange={(e) => handleEditSpecialtiesChange(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_vendor_shipping">Shipping Notes</Label>
                <Textarea 
                  id="edit_vendor_shipping" 
                  value={currentVendor.shipping_notes || ""} 
                  onChange={(e) => setCurrentVendor({...currentVendor, shipping_notes: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_vendor_rating">Rating</Label>
                <Select 
                  value={currentVendor.rating?.toString() || "5"} 
                  onValueChange={(value) => setCurrentVendor({...currentVendor, rating: Number(value)})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Poor</SelectItem>
                    <SelectItem value="2">2 - Fair</SelectItem>
                    <SelectItem value="3">3 - Good</SelectItem>
                    <SelectItem value="4">4 - Very Good</SelectItem>
                    <SelectItem value="5">5 - Excellent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="edit_vendor_favorite" 
                  checked={currentVendor.favorite}
                  onCheckedChange={(checked) => setCurrentVendor({...currentVendor, favorite: !!checked})}
                />
                <Label htmlFor="edit_vendor_favorite">Mark as favorite</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_vendor_notes">Personal Notes</Label>
                <Textarea 
                  id="edit_vendor_notes" 
                  value={currentVendor.notes || ""} 
                  onChange={(e) => setCurrentVendor({...currentVendor, notes: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={updateVendor}>
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
              Are you sure you want to delete {currentVendor?.name} from your vendors? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={deleteVendor}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
