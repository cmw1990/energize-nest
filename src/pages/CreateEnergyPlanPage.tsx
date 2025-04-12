
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

const CreateEnergyPlanPage = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    plan_type: "energizing_boost",
    category: "charged",
    energy_level_required: 5,
    estimated_duration_minutes: 30,
    recommended_time_of_day: [],
    suitable_contexts: [],
    tags: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create an energy plan",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.from('energy_plans').insert({
        ...formData,
        created_by: session.user.id,
        visibility: 'private'
      }).select().single();
      
      if (error) throw error;
      
      toast({
        title: "Energy plan created",
        description: "Your new energy plan has been created successfully",
      });
      
      navigate(`/energy-plans/${data.id}`);
    } catch (error) {
      console.error("Error creating energy plan:", error);
      toast({
        title: "Error",
        description: "Failed to create energy plan. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 pt-6">
        <h1 className="text-3xl font-bold mb-6">Create Energy Plan</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Create New Energy Plan</CardTitle>
            <CardDescription>Design a personalized energy plan to optimize your day</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Plan Title</Label>
                  <Input 
                    id="title" 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="E.g., Morning Energy Boost" 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    placeholder="Describe the purpose and benefits of this energy plan" 
                    rows={3} 
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plan_type">Plan Type</Label>
                    <Select 
                      value={formData.plan_type} 
                      onValueChange={(value) => handleSelectChange("plan_type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="energizing_boost">Energizing Boost</SelectItem>
                        <SelectItem value="sustained_focus">Sustained Focus</SelectItem>
                        <SelectItem value="mental_clarity">Mental Clarity</SelectItem>
                        <SelectItem value="physical_vitality">Physical Vitality</SelectItem>
                        <SelectItem value="deep_relaxation">Deep Relaxation</SelectItem>
                        <SelectItem value="stress_relief">Stress Relief</SelectItem>
                        <SelectItem value="evening_winddown">Evening Wind-down</SelectItem>
                        <SelectItem value="sleep_preparation">Sleep Preparation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="charged">Energy Boost</SelectItem>
                        <SelectItem value="recharged">Recovery & Rest</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="energy_level_required">Energy Level Required (1-10)</Label>
                    <Input 
                      id="energy_level_required" 
                      name="energy_level_required" 
                      type="number" 
                      min="1" 
                      max="10" 
                      value={formData.energy_level_required} 
                      onChange={handleChange} 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="estimated_duration_minutes">Duration (minutes)</Label>
                    <Input 
                      id="estimated_duration_minutes" 
                      name="estimated_duration_minutes" 
                      type="number" 
                      min="1" 
                      value={formData.estimated_duration_minutes} 
                      onChange={handleChange} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/energy-plans')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Plan"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateEnergyPlanPage;
