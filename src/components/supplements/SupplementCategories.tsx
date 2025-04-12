
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  X, 
  Check, 
  Edit, 
  Tag, 
  Loader2,
  Brain,
  Battery,
  Heart,
  ZZZ,
  GanttChart,
  Dumbbell,
  Pill,
  Zap
} from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
}

interface UserCategory {
  id: string;
  user_id: string;
  category_id: string;
}

export function SupplementCategories() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCategory, setNewCategory] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [selectedIcon, setSelectedIcon] = useState("pill");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const colors = [
    { name: "blue", class: "bg-blue-100 text-blue-800 hover:bg-blue-200" },
    { name: "green", class: "bg-green-100 text-green-800 hover:bg-green-200" },
    { name: "purple", class: "bg-purple-100 text-purple-800 hover:bg-purple-200" },
    { name: "pink", class: "bg-pink-100 text-pink-800 hover:bg-pink-200" },
    { name: "yellow", class: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" },
    { name: "orange", class: "bg-orange-100 text-orange-800 hover:bg-orange-200" },
    { name: "red", class: "bg-red-100 text-red-800 hover:bg-red-200" },
    { name: "indigo", class: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200" },
  ];

  const icons = [
    { name: "pill", component: <Pill className="h-4 w-4" /> },
    { name: "brain", component: <Brain className="h-4 w-4" /> },
    { name: "battery", component: <Battery className="h-4 w-4" /> },
    { name: "heart", component: <Heart className="h-4 w-4" /> },
    { name: "sleep", component: <ZZZ className="h-4 w-4" /> },
    { name: "dumbbell", component: <Dumbbell className="h-4 w-4" /> },
    { name: "chart", component: <GanttChart className="h-4 w-4" /> },
    { name: "zap", component: <Zap className="h-4 w-4" /> },
  ];

  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['supplementCategories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplement_categories')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Category[];
    },
  });

  const { data: userCategoryMappings, isLoading: isLoadingMappings } = useQuery({
    queryKey: ['supplementCategoryMappings', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplement_category_mappings')
        .select('*')
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      return data as UserCategory[];
    },
    enabled: !!session?.user?.id,
  });

  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: { name: string; description?: string; color?: string; icon?: string }) => {
      const { data, error } = await supabase
        .from('supplement_categories')
        .insert(categoryData)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplementCategories'] });
      toast({
        title: "Success",
        description: "Category added successfully",
      });
      setNewCategory("");
      setNewCategoryDesc("");
      setIsAddDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
      console.error("Error adding category:", error);
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async (categoryData: { id: string; name: string; description?: string; color?: string; icon?: string }) => {
      const { id, ...updateData } = categoryData;
      const { error } = await supabase
        .from('supplement_categories')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplementCategories'] });
      toast({
        title: "Success",
        description: "Category updated successfully",
      });
      setEditingCategory(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
      console.error("Error updating category:", error);
    },
  });

  const toggleUserCategoryMutation = useMutation({
    mutationFn: async ({ categoryId, isSelected }: { categoryId: string; isSelected: boolean }) => {
      if (isSelected) {
        // Remove the mapping
        const { error } = await supabase
          .from('supplement_category_mappings')
          .delete()
          .eq('user_id', session?.user?.id)
          .eq('category_id', categoryId);
        
        if (error) throw error;
      } else {
        // Add the mapping
        const { error } = await supabase
          .from('supplement_category_mappings')
          .insert({
            user_id: session?.user?.id,
            category_id: categoryId,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplementCategoryMappings'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update category selection",
        variant: "destructive",
      });
      console.error("Error toggling category:", error);
    },
  });

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    addCategoryMutation.mutate({
      name: newCategory,
      description: newCategoryDesc,
      color: selectedColor,
      icon: selectedIcon,
    });
  };

  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      updateCategoryMutation.mutate({
        id: editingCategory.id,
        name: editingCategory.name,
        description: editingCategory.description,
        color: editingCategory.color || selectedColor,
        icon: editingCategory.icon || selectedIcon,
      });
    }
  };

  const handleToggleCategory = (categoryId: string) => {
    const isSelected = userCategoryMappings?.some(
      mapping => mapping.category_id === categoryId
    );
    
    toggleUserCategoryMutation.mutate({
      categoryId,
      isSelected: !!isSelected,
    });
  };

  const getIconComponent = (iconName: string) => {
    const icon = icons.find(i => i.name === iconName);
    return icon ? icon.component : <Pill className="h-4 w-4" />;
  };

  const getCategoryColorClass = (colorName: string) => {
    const color = colors.find(c => c.name === colorName);
    return color ? color.class : "bg-blue-100 text-blue-800 hover:bg-blue-200";
  };

  const isLoading = isLoadingCategories || isLoadingMappings;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-primary" />
            <span>Supplement Categories</span>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
                <DialogDescription>
                  Create a new category to organize your supplements
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category Name</label>
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Category name"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (optional)</label>
                  <Input
                    value={newCategoryDesc}
                    onChange={(e) => setNewCategoryDesc(e.target.value)}
                    placeholder="Brief description"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Color</label>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        className={`w-6 h-6 rounded-full ${color.class} ${
                          selectedColor === color.name ? 'ring-2 ring-primary ring-offset-2' : ''
                        }`}
                        onClick={() => setSelectedColor(color.name)}
                        type="button"
                      />
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Icon</label>
                  <div className="flex flex-wrap gap-2">
                    {icons.map((icon) => (
                      <button
                        key={icon.name}
                        className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                          selectedIcon === icon.name 
                            ? 'bg-primary/10 border-primary' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedIcon(icon.name)}
                        type="button"
                      >
                        {icon.component}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCategory} disabled={!newCategory.trim() || addCategoryMutation.isPending}>
                  {addCategoryMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Category'
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {categories?.map((category) => {
            const isSelected = userCategoryMappings?.some(
              mapping => mapping.category_id === category.id
            );
            
            return (
              <Badge
                key={category.id}
                variant="outline"
                className={`flex items-center gap-1 px-3 py-1.5 ${category.color ? getCategoryColorClass(category.color) : 'bg-blue-100 text-blue-800'}`}
              >
                {category.icon && (
                  <span className="mr-1">{getIconComponent(category.icon)}</span>
                )}
                <span>{category.name}</span>
                <button
                  className={`ml-1 rounded-full p-0.5 ${
                    isSelected 
                      ? 'bg-primary/20 hover:bg-primary/30' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                  onClick={() => handleToggleCategory(category.id)}
                >
                  {isSelected ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <Plus className="h-3 w-3" />
                  )}
                </button>
              </Badge>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
