
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

// Define the trigger types for nicotine usage
const TRIGGER_TYPES = [
  "Stress", 
  "Boredom", 
  "Social situation", 
  "After meal", 
  "Emotional", 
  "Craving", 
  "Habit", 
  "Work break"
];

export const NicotineTracker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [productType, setProductType] = useState("cigarette");
  const [moodImpact, setMoodImpact] = useState(5);
  const [energyImpact, setEnergyImpact] = useState(5);
  const [trigger, setTrigger] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch nicotine product types
  const { data: productTypes } = useQuery({
    queryKey: ['nicotine-product-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('nicotine_product_types')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data || [];
    }
  });

  // Fetch user's recent products for quick selection
  const { data: recentProducts } = useQuery({
    queryKey: ['recent-nicotine-products', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('nicotine_logs')
        .select('product_type, amount, energy_impact, mood_impact')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Error",
        description: "You must be logged in to track nicotine usage",
        variant: "destructive"
      });
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid nicotine amount",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('nicotine_logs').insert({
        user_id: session.user.id,
        amount: Number(amount),
        product_type: productType,
        mood_impact: moodImpact,
        energy_impact: energyImpact,
        trigger_type: trigger || null
      });
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Nicotine usage logged successfully",
      });
      
      // Reset form
      setAmount("");
      setMoodImpact(5);
      setEnergyImpact(5);
      setTrigger("");
    } catch (error) {
      console.error("Error logging nicotine usage:", error);
      toast({
        title: "Error",
        description: "Failed to log nicotine usage",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const quickLog = (product: any) => {
    setAmount(product.amount.toString());
    setProductType(product.product_type);
    setMoodImpact(product.mood_impact || 5);
    setEnergyImpact(product.energy_impact || 5);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount (mg)
          </label>
          <Input
            id="amount"
            type="number"
            step="0.1"
            min="0"
            placeholder="Nicotine amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor="product-type" className="block text-sm font-medium mb-1">
            Product Type
          </label>
          <Select value={productType} onValueChange={setProductType}>
            <SelectTrigger id="product-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {productTypes?.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <label htmlFor="trigger" className="block text-sm font-medium mb-1">
          Trigger
        </label>
        <Select value={trigger} onValueChange={setTrigger}>
          <SelectTrigger id="trigger">
            <SelectValue placeholder="What triggered usage?" />
          </SelectTrigger>
          <SelectContent>
            {TRIGGER_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Energy Impact (1-10)
        </label>
        <Slider
          value={[energyImpact]}
          min={1}
          max={10}
          step={1}
          onValueChange={(value) => setEnergyImpact(value[0])}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Low Energy</span>
          <span>High Energy</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Mood Impact (1-10)
        </label>
        <Slider
          value={[moodImpact]}
          min={1}
          max={10}
          step={1}
          onValueChange={(value) => setMoodImpact(value[0])}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>Negative</span>
          <span>Positive</span>
        </div>
      </div>
      
      {recentProducts && recentProducts.length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Quick Log
          </label>
          <div className="flex flex-wrap gap-2">
            {recentProducts.map((product, index) => (
              <Button
                key={index}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => quickLog(product)}
              >
                {product.product_type} ({product.amount}mg)
              </Button>
            ))}
          </div>
        </div>
      )}
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Logging..." : "Log Nicotine Usage"}
      </Button>
    </form>
  );
};
