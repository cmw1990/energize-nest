
import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Image as ImageIcon, 
  Plus, 
  Edit, 
  Trash, 
  LayoutGridIcon, 
  Target, 
  Check,
  Link as LinkIcon,
  Loader2 
} from "lucide-react";
import { motion } from "framer-motion";

type VisionItem = {
  id?: string;
  user_id?: string;
  title: string;
  description?: string;
  image_url?: string;
  link_url?: string;
  category?: string;
  is_completed?: boolean;
  created_at?: string;
};

export function VisionBoard() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<VisionItem | null>(null);
  const [itemTitle, setItemTitle] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [itemCategory, setItemCategory] = useState("goals");
  const [itemImageUrl, setItemImageUrl] = useState("");
  const [itemLinkUrl, setItemLinkUrl] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  const { data: visionItems, isLoading } = useQuery({
    queryKey: ['vision-board', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data, error } = await supabase
        .from('vision_board')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as VisionItem[];
    },
    enabled: !!session?.user?.id,
  });

  const addItemMutation = useMutation({
    mutationFn: async (item: VisionItem) => {
      if (!session?.user?.id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('vision_board')
        .insert({
          user_id: session.user.id,
          title: item.title,
          description: item.description,
          image_url: item.image_url,
          link_url: item.link_url,
          category: item.category,
          is_completed: item.is_completed || false
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vision-board'] });
      resetForm();
      setIsAddDialogOpen(false);
      toast({
        title: "Item added",
        description: "Your vision board item has been added successfully.",
      });
    },
    onError: (error) => {
      console.error("Error adding vision board item:", error);
      toast({
        title: "Error",
        description: "Failed to add your vision board item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateItemMutation = useMutation({
    mutationFn: async (item: VisionItem) => {
      if (!item.id) throw new Error("Item ID is required");
      
      const { data, error } = await supabase
        .from('vision_board')
        .update({
          title: item.title,
          description: item.description,
          image_url: item.image_url,
          link_url: item.link_url,
          category: item.category,
          is_completed: item.is_completed
        })
        .eq('id', item.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vision-board'] });
      resetForm();
      setIsAddDialogOpen(false);
      toast({
        title: "Item updated",
        description: "Your vision board item has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating vision board item:", error);
      toast({
        title: "Error",
        description: "Failed to update your vision board item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { error } = await supabase
        .from('vision_board')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vision-board'] });
      toast({
        title: "Item deleted",
        description: "Your vision board item has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting vision board item:", error);
      toast({
        title: "Error",
        description: "Failed to delete your vision board item. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleCompleteMutation = useMutation({
    mutationFn: async ({ id, isCompleted }: { id: string; isCompleted: boolean }) => {
      const { data, error } = await supabase
        .from('vision_board')
        .update({ is_completed: isCompleted })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vision-board'] });
      toast({
        title: "Status updated",
        description: "Your item status has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating item status:", error);
      toast({
        title: "Error",
        description: "Failed to update item status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session?.user?.id) return;

    setIsUploading(true);
    try {
      // Upload image to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('vision_board_images')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded image
      const { data } = supabase.storage
        .from('vision_board_images')
        .getPublicUrl(filePath);
      
      if (data.publicUrl) {
        setItemImageUrl(data.publicUrl);
        toast({
          title: "Image uploaded",
          description: "Your image has been uploaded successfully.",
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast({
        title: "Upload error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddOrUpdate = () => {
    if (!itemTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please provide a title for your vision board item.",
        variant: "destructive",
      });
      return;
    }

    const item: VisionItem = {
      title: itemTitle,
      description: itemDescription,
      image_url: itemImageUrl,
      link_url: itemLinkUrl,
      category: itemCategory,
      is_completed: isCompleted
    };

    if (selectedItem?.id) {
      updateItemMutation.mutate({ ...item, id: selectedItem.id });
    } else {
      addItemMutation.mutate(item);
    }
  };

  const handleEdit = (item: VisionItem) => {
    setSelectedItem(item);
    setItemTitle(item.title);
    setItemDescription(item.description || "");
    setItemImageUrl(item.image_url || "");
    setItemLinkUrl(item.link_url || "");
    setItemCategory(item.category || "goals");
    setIsCompleted(item.is_completed || false);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItemMutation.mutate(id);
    }
  };

  const handleToggleComplete = (id: string, currentStatus: boolean) => {
    toggleCompleteMutation.mutate({ id, isCompleted: !currentStatus });
  };

  const resetForm = () => {
    setSelectedItem(null);
    setItemTitle("");
    setItemDescription("");
    setItemImageUrl("");
    setItemLinkUrl("");
    setItemCategory("goals");
    setIsCompleted(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "goals": return "bg-blue-100 text-blue-800";
      case "affirmations": return "bg-purple-100 text-purple-800";
      case "inspiration": return "bg-amber-100 text-amber-800";
      case "dreams": return "bg-emerald-100 text-emerald-800";
      case "achievements": return "bg-rose-100 text-rose-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredItems = visionItems?.filter(item => 
    activeTab === "all" || 
    (activeTab === "completed" && item.is_completed) || 
    (activeTab === "active" && !item.is_completed) ||
    item.category === activeTab
  );

  const categories = ["all", "active", "completed", "goals", "affirmations", "inspiration", "dreams", "achievements"];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <LayoutGridIcon className="h-5 w-5 text-primary" />
            Vision Board
          </CardTitle>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                size="sm"
                onClick={resetForm}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedItem ? "Edit Vision Board Item" : "Add to Your Vision Board"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="What do you want to achieve?"
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your vision in detail..."
                    value={itemDescription}
                    onChange={(e) => setItemDescription(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={itemCategory}
                    onChange={(e) => setItemCategory(e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="goals">Goals</option>
                    <option value="affirmations">Affirmations</option>
                    <option value="inspiration">Inspiration</option>
                    <option value="dreams">Dreams</option>
                    <option value="achievements">Achievements</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  {itemImageUrl ? (
                    <div className="relative rounded-md overflow-hidden h-40 bg-gray-100">
                      <img 
                        src={itemImageUrl} 
                        alt="Vision board" 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={() => setItemImageUrl("")}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        disabled={isUploading}
                      />
                      {isUploading && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Uploading...
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="link">Link (Optional)</Label>
                  <Input
                    id="link"
                    placeholder="https://example.com"
                    value={itemLinkUrl}
                    onChange={(e) => setItemLinkUrl(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-completed"
                    checked={isCompleted}
                    onChange={(e) => setIsCompleted(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="is-completed">Mark as completed</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddOrUpdate}
                  disabled={addItemMutation.isPending || updateItemMutation.isPending || isUploading}
                >
                  {(addItemMutation.isPending || updateItemMutation.isPending) ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    selectedItem ? "Update" : "Add to Vision Board"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4 flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="text-center py-10">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <p className="mt-2">Loading your vision board...</p>
              </div>
            ) : filteredItems && filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.02 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={`h-full overflow-hidden ${
                      item.is_completed ? "border-green-300 bg-green-50 dark:bg-green-900/10" : ""
                    }`}>
                      {item.image_url && (
                        <div className="w-full h-40 relative">
                          <img 
                            src={item.image_url} 
                            alt={item.title} 
                            className="w-full h-full object-cover"
                          />
                          {item.is_completed && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                              <Check className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{item.title}</h3>
                            <div className="flex gap-1 mt-1">
                              {item.category && (
                                <span className={`text-xs px-2 py-0.5 rounded-full ${getCategoryColor(item.category)}`}>
                                  {item.category}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(item)}
                              className="h-7 w-7"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(item.id!)}
                              className="h-7 w-7 text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {item.description && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {item.description}
                          </p>
                        )}
                        
                        <div className="mt-4 flex justify-between items-center">
                          {item.link_url ? (
                            <a 
                              href={item.link_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
                            >
                              <LinkIcon className="h-3 w-3" />
                              Visit Link
                            </a>
                          ) : (
                            <span></span>
                          )}
                          
                          <Button
                            variant={item.is_completed ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleToggleComplete(item.id!, item.is_completed || false)}
                          >
                            {item.is_completed ? (
                              <span className="flex items-center gap-1">
                                <Check className="h-4 w-4" />
                                Completed
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                Mark Complete
                              </span>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <LayoutGridIcon className="w-10 h-10 text-muted-foreground mx-auto" />
                <p className="mt-2">No vision board items found</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Add items to visualize your goals and dreams
                </p>
                <Button 
                  onClick={() => {
                    resetForm();
                    setIsAddDialogOpen(true);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Your First Item
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
