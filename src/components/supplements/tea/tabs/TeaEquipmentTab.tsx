
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
import { useQueryClient } from "@tanstack/react-query";

type TeaEquipment = {
  id: string;
  user_id: string;
  name: string;
  type: string;
  description: string;
  material: string;
  capacity?: string;
  brand?: string;
  purchase_date?: string;
  price?: string;
  notes?: string;
  image_url?: string;
  created_at: string;
};

const equipmentTypes = [
  { value: "teapot", label: "Teapot" },
  { value: "gaiwan", label: "Gaiwan" },
  { value: "teacup", label: "Teacup/Mug" },
  { value: "kettle", label: "Kettle" },
  { value: "infuser", label: "Infuser/Strainer" },
  { value: "scale", label: "Scale" },
  { value: "storage", label: "Storage Container" },
  { value: "pitcher", label: "Pitcher/Fairness Cup" },
  { value: "thermometer", label: "Thermometer" },
  { value: "timer", label: "Timer" },
  { value: "tea_tray", label: "Tea Tray" },
  { value: "other", label: "Other" },
];

const materials = [
  { value: "porcelain", label: "Porcelain" },
  { value: "ceramic", label: "Ceramic" },
  { value: "clay", label: "Clay/Yixing" },
  { value: "glass", label: "Glass" },
  { value: "cast_iron", label: "Cast Iron" },
  { value: "stainless_steel", label: "Stainless Steel" },
  { value: "wood", label: "Wood" },
  { value: "bamboo", label: "Bamboo" },
  { value: "silver", label: "Silver" },
  { value: "plastic", label: "Plastic" },
  { value: "other", label: "Other" },
];

export function TeaEquipmentTab() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEquipment, setCurrentEquipment] = useState<TeaEquipment | null>(null);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    type: "teapot",
    description: "",
    material: "porcelain",
    capacity: "",
    brand: "",
    purchase_date: "",
    price: "",
    notes: "",
  });

  const { data: equipment, isLoading, error, refetch } = useQuery({
    queryKey: ["tea-equipment", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("tea_equipment")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as TeaEquipment[];
    },
    enabled: !!session?.user?.id,
  });

  const addEquipment = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from("tea_equipment")
        .insert({
          user_id: session.user.id,
          name: newEquipment.name,
          type: newEquipment.type,
          description: newEquipment.description,
          material: newEquipment.material,
          capacity: newEquipment.capacity || null,
          brand: newEquipment.brand || null,
          purchase_date: newEquipment.purchase_date || null,
          price: newEquipment.price || null,
          notes: newEquipment.notes || null,
        });
        
      if (error) throw error;
      
      toast({
        title: "Equipment added",
        description: `${newEquipment.name} has been added to your tea equipment.`,
      });
      
      setAddDialogOpen(false);
      setNewEquipment({
        name: "",
        type: "teapot",
        description: "",
        material: "porcelain",
        capacity: "",
        brand: "",
        purchase_date: "",
        price: "",
        notes: "",
      });
      refetch();
    } catch (error) {
      console.error("Error adding equipment:", error);
      toast({
        title: "Error",
        description: "Failed to add equipment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateEquipment = async () => {
    if (!session?.user?.id || !currentEquipment) return;
    
    try {
      const { error } = await supabase
        .from("tea_equipment")
        .update({
          name: currentEquipment.name,
          type: currentEquipment.type,
          description: currentEquipment.description,
          material: currentEquipment.material,
          capacity: currentEquipment.capacity || null,
          brand: currentEquipment.brand || null,
          purchase_date: currentEquipment.purchase_date || null,
          price: currentEquipment.price || null,
          notes: currentEquipment.notes || null,
        })
        .eq("id", currentEquipment.id);
        
      if (error) throw error;
      
      toast({
        title: "Equipment updated",
        description: `${currentEquipment.name} has been updated.`,
      });
      
      setEditDialogOpen(false);
      setCurrentEquipment(null);
      refetch();
    } catch (error) {
      console.error("Error updating equipment:", error);
      toast({
        title: "Error",
        description: "Failed to update equipment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteEquipment = async () => {
    if (!session?.user?.id || !currentEquipment) return;
    
    try {
      const { error } = await supabase
        .from("tea_equipment")
        .delete()
        .eq("id", currentEquipment.id);
        
      if (error) throw error;
      
      toast({
        title: "Equipment deleted",
        description: `${currentEquipment.name} has been removed from your equipment.`,
      });
      
      setDeleteDialogOpen(false);
      setCurrentEquipment(null);
      refetch();
    } catch (error) {
      console.error("Error deleting equipment:", error);
      toast({
        title: "Error",
        description: "Failed to delete equipment. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredEquipment = equipment?.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'teapot': return '🫖';
      case 'gaiwan': return '🍵';
      case 'teacup': return '☕';
      case 'kettle': return '🔥';
      case 'infuser': return '🧂';
      case 'scale': return '⚖️';
      case 'storage': return '🏺';
      case 'pitcher': return '🧴';
      case 'thermometer': return '🌡️';
      case 'timer': return '⏱️';
      case 'tea_tray': return '🪵';
      default: return '🍃';
    }
  };

  const getMaterialColor = (material: string) => {
    switch (material) {
      case 'porcelain': return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300';
      case 'ceramic': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      case 'clay': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'glass': return 'bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300';
      case 'cast_iron': return 'bg-stone-100 text-stone-800 dark:bg-stone-900 dark:text-stone-300';
      case 'stainless_steel': return 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900 dark:text-zinc-300';
      case 'wood': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'bamboo': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'silver': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
      case 'plastic': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading tea equipment...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-destructive">Error loading tea equipment: {(error as Error).message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder="Search equipment..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 md:w-80"
          />
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Equipment
        </Button>
      </div>
      
      {filteredEquipment && filteredEquipment.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    <span className="text-2xl" role="img" aria-label={item.type}>
                      {getTypeIcon(item.type)}
                    </span>
                    <div>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>
                        {equipmentTypes.find(t => t.value === item.type)?.label || item.type}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setCurrentEquipment(item);
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
                        setCurrentEquipment(item);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <div className="mb-2">
                    <Badge 
                      variant="outline" 
                      className={getMaterialColor(item.material)}
                    >
                      {materials.find(m => m.value === item.material)?.label || item.material}
                    </Badge>
                    {item.capacity && (
                      <Badge variant="outline" className="ml-2">
                        {item.capacity}
                      </Badge>
                    )}
                  </div>
                  
                  <p className="mb-2">{item.description}</p>
                  
                  {item.brand && (
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Brand:</span>
                      <span>{item.brand}</span>
                    </div>
                  )}
                  
                  {item.price && (
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Price:</span>
                      <span>{item.price}</span>
                    </div>
                  )}
                  
                  {item.purchase_date && (
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">Purchased:</span>
                      <span>{new Date(item.purchase_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  {item.notes && (
                    <div className="mt-2">
                      <span className="font-medium">Notes:</span>
                      <p className="text-muted-foreground mt-1">{item.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground mb-4">No tea equipment found. Add your first piece of equipment to get started.</p>
          <Button onClick={() => setAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Equipment
          </Button>
        </div>
      )}

      {/* Add Equipment Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Tea Equipment</DialogTitle>
            <DialogDescription>
              Add details about your tea brewing equipment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipment_name">Name</Label>
                <Input 
                  id="equipment_name" 
                  value={newEquipment.name} 
                  onChange={(e) => setNewEquipment({...newEquipment, name: e.target.value})}
                  placeholder="e.g., Ceremonial Teapot"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipment_type">Type</Label>
                <Select 
                  value={newEquipment.type} 
                  onValueChange={(value) => setNewEquipment({...newEquipment, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipmentTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment_material">Material</Label>
                <Select 
                  value={newEquipment.material} 
                  onValueChange={(value) => setNewEquipment({...newEquipment, material: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select material" />
                  </SelectTrigger>
                  <SelectContent>
                    {materials.map((material) => (
                      <SelectItem key={material.value} value={material.value}>
                        {material.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment_description">Description</Label>
              <Textarea 
                id="equipment_description" 
                value={newEquipment.description} 
                onChange={(e) => setNewEquipment({...newEquipment, description: e.target.value})}
                placeholder="Brief description of the equipment"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipment_capacity">Capacity (Optional)</Label>
                <Input 
                  id="equipment_capacity" 
                  value={newEquipment.capacity} 
                  onChange={(e) => setNewEquipment({...newEquipment, capacity: e.target.value})}
                  placeholder="e.g., 250ml"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment_brand">Brand (Optional)</Label>
                <Input 
                  id="equipment_brand" 
                  value={newEquipment.brand} 
                  onChange={(e) => setNewEquipment({...newEquipment, brand: e.target.value})}
                  placeholder="e.g., Hario"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="equipment_price">Price (Optional)</Label>
                <Input 
                  id="equipment_price" 
                  value={newEquipment.price} 
                  onChange={(e) => setNewEquipment({...newEquipment, price: e.target.value})}
                  placeholder="e.g., $35"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="equipment_purchase_date">Purchase Date (Optional)</Label>
                <Input 
                  id="equipment_purchase_date" 
                  type="date"
                  value={newEquipment.purchase_date} 
                  onChange={(e) => setNewEquipment({...newEquipment, purchase_date: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="equipment_notes">Notes (Optional)</Label>
              <Textarea 
                id="equipment_notes" 
                value={newEquipment.notes} 
                onChange={(e) => setNewEquipment({...newEquipment, notes: e.target.value})}
                placeholder="Any additional notes about this equipment"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={addEquipment}>
              Add Equipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Equipment Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Tea Equipment</DialogTitle>
            <DialogDescription>
              Update the details of your tea equipment.
            </DialogDescription>
          </DialogHeader>
          {currentEquipment && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_equipment_name">Name</Label>
                  <Input 
                    id="edit_equipment_name" 
                    value={currentEquipment.name} 
                    onChange={(e) => setCurrentEquipment({...currentEquipment, name: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_equipment_type">Type</Label>
                  <Select 
                    value={currentEquipment.type} 
                    onValueChange={(value) => setCurrentEquipment({...currentEquipment, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipmentTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_equipment_material">Material</Label>
                  <Select 
                    value={currentEquipment.material} 
                    onValueChange={(value) => setCurrentEquipment({...currentEquipment, material: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map((material) => (
                        <SelectItem key={material.value} value={material.value}>
                          {material.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_equipment_description">Description</Label>
                <Textarea 
                  id="edit_equipment_description" 
                  value={currentEquipment.description} 
                  onChange={(e) => setCurrentEquipment({...currentEquipment, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_equipment_capacity">Capacity</Label>
                  <Input 
                    id="edit_equipment_capacity" 
                    value={currentEquipment.capacity || ""} 
                    onChange={(e) => setCurrentEquipment({...currentEquipment, capacity: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_equipment_brand">Brand</Label>
                  <Input 
                    id="edit_equipment_brand" 
                    value={currentEquipment.brand || ""} 
                    onChange={(e) => setCurrentEquipment({...currentEquipment, brand: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_equipment_price">Price</Label>
                  <Input 
                    id="edit_equipment_price" 
                    value={currentEquipment.price || ""} 
                    onChange={(e) => setCurrentEquipment({...currentEquipment, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_equipment_purchase_date">Purchase Date</Label>
                  <Input 
                    id="edit_equipment_purchase_date" 
                    type="date"
                    value={currentEquipment.purchase_date || ""} 
                    onChange={(e) => setCurrentEquipment({...currentEquipment, purchase_date: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_equipment_notes">Notes</Label>
                <Textarea 
                  id="edit_equipment_notes" 
                  value={currentEquipment.notes || ""} 
                  onChange={(e) => setCurrentEquipment({...currentEquipment, notes: e.target.value})}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={updateEquipment}>
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
              Are you sure you want to delete {currentEquipment?.name} from your equipment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button type="button" variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={deleteEquipment}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
