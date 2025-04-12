import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Visibility } from "@/types/database";
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Clock, Battery, Plus, Timer, ChevronRight, Zap, Trash2 } from "lucide-react";
import { format } from "date-fns";

type PlanType = 'standard' | 'focus' | 'recovery' | 'custom';
type PlanCategory = 'productivity' | 'wellness' | 'mental_health' | 'physical' | 'other';

interface PlanActivity {
  id: string;
  title: string;
  duration_minutes: number;
  description?: string;
  category?: string;
  energy_impact?: number;
}

interface EnergyPlanFormData {
  plan_name: string;
  plan_type: PlanType;
  category: PlanCategory;
  description: string;
  duration_minutes: number;
  visibility: Visibility;
  activities: PlanActivity[];
  tags: string[];
}

const PLAN_TYPES = [
  { value: 'standard', label: 'Standard Plan', description: 'A balanced energy plan for everyday use' },
  { value: 'focus', label: 'Focus Plan', description: 'Optimized for deep work and concentration' },
  { value: 'recovery', label: 'Recovery Plan', description: 'Designed to restore energy and reduce stress' },
  { value: 'custom', label: 'Custom Plan', description: 'Create your own unique energy plan' },
];

const PLAN_CATEGORIES = [
  { value: 'productivity', label: 'Productivity' },
  { value: 'wellness', label: 'Wellness' },
  { value: 'mental_health', label: 'Mental Health' },
  { value: 'physical', label: 'Physical Health' },
  { value: 'other', label: 'Other' },
];

const DEFAULT_ACTIVITIES: Record<PlanType, PlanActivity[]> = {
  standard: [
    { id: '1', title: 'Morning Meditation', duration_minutes: 10, energy_impact: 8, category: 'wellness' },
    { id: '2', title: 'Focused Work Session', duration_minutes: 90, energy_impact: -5, category: 'productivity' },
    { id: '3', title: 'Energy Break', duration_minutes: 15, energy_impact: 7, category: 'recovery' },
  ],
  focus: [
    { id: '1', title: 'Preparation Ritual', duration_minutes: 5, energy_impact: 3, category: 'productivity' },
    { id: '2', title: 'Deep Work Session', duration_minutes: 90, energy_impact: -6, category: 'productivity' },
    { id: '3', title: 'Mindful Break', duration_minutes: 10, energy_impact: 8, category: 'recovery' },
    { id: '4', title: 'Review & Plan', duration_minutes: 15, energy_impact: -2, category: 'productivity' },
  ],
  recovery: [
    { id: '1', title: 'Gentle Stretching', duration_minutes: 10, energy_impact: 6, category: 'physical' },
    { id: '2', title: 'Deep Breathing', duration_minutes: 5, energy_impact: 7, category: 'wellness' },
    { id: '3', title: 'Nature Walk', duration_minutes: 20, energy_impact: 9, category: 'physical' },
    { id: '4', title: 'Restorative Yoga', duration_minutes: 15, energy_impact: 8, category: 'wellness' },
  ],
  custom: [],
};

const CreateEnergyPlanPage = () => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState<EnergyPlanFormData>({
    plan_name: "",
    plan_type: "standard",
    category: "productivity",
    description: "",
    duration_minutes: 60,
    visibility: Visibility.PRIVATE,
    activities: DEFAULT_ACTIVITIES.standard,
    tags: [],
  });
  
  const [tagsInput, setTagsInput] = useState("");
  const [newActivity, setNewActivity] = useState<Partial<PlanActivity>>({
    title: "",
    duration_minutes: 15,
    energy_impact: 0,
    category: "productivity",
    description: "",
  });
  
  const createPlanMutation = useMutation({
    mutationFn: async (planData: {
      plan_name: string;
      plan_type: PlanType;
      category: PlanCategory;
      description: string;
      duration_minutes: number;
      visibility: Visibility;
      activities: Record<string, any>;
      tags: string[];
      user_id: string;
    }) => {
      const { data, error } = await supabase
        .from('energy_plans')
        .insert(planData)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Your energy plan has been created!',
      });
      navigate(`/energy-plan/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create plan: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: 'destructive',
      });
    }
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    if (name === 'plan_type') {
      const planType = value as PlanType;
      setFormData(prev => ({
        ...prev,
        plan_type: planType,
        activities: DEFAULT_ACTIVITIES[planType],
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };
  
  const handleVisibilityChange = (value: string) => {
    setFormData(prev => ({ ...prev, visibility: value as Visibility }));
  };
  
  const handleDurationChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, duration_minutes: value[0] }));
  };
  
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagsInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagsInput.trim())) {
        setFormData(prev => ({ ...prev, tags: [...prev.tags, tagsInput.trim()] }));
      }
      setTagsInput("");
    }
  };
  
  const handleRemoveTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };
  
  const handleNewActivityChange = (name: string, value: any) => {
    setNewActivity(prev => ({ ...prev, [name]: value }));
  };
  
  const handleAddActivity = () => {
    if (!newActivity.title) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a title for the activity.',
        variant: 'destructive',
      });
      return;
    }
    
    const activity: PlanActivity = {
      id: `new-${Date.now()}`,
      title: newActivity.title || "",
      duration_minutes: newActivity.duration_minutes || 15,
      description: newActivity.description,
      category: newActivity.category,
      energy_impact: newActivity.energy_impact,
    };
    
    setFormData(prev => ({
      ...prev,
      activities: [...prev.activities, activity],
      duration_minutes: prev.duration_minutes + activity.duration_minutes,
    }));
    
    setNewActivity({
      title: "",
      duration_minutes: 15,
      energy_impact: 0,
      category: "productivity",
      description: "",
    });
  };
  
  const handleRemoveActivity = (id: string) => {
    const activity = formData.activities.find(a => a.id === id);
    if (!activity) return;
    
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter(a => a.id !== id),
      duration_minutes: Math.max(0, prev.duration_minutes - activity.duration_minutes),
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user?.id) {
      toast({
        title: 'Error',
        description: 'You must be logged in to create a plan',
        variant: 'destructive',
      });
      return;
    }
    
    if (!formData.plan_name.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a name for your energy plan.',
        variant: 'destructive',
      });
      return;
    }
    
    if (formData.activities.length === 0) {
      toast({
        title: 'Missing Activities',
        description: 'Your energy plan needs at least one activity.',
        variant: 'destructive',
      });
      return;
    }
    
    const activitiesObject = formData.activities.reduce((acc, activity, index) => {
      acc[index.toString()] = activity;
      return acc;
    }, {} as Record<string, any>);
    
    const planData = {
      plan_name: formData.plan_name,
      plan_type: formData.plan_type,
      category: formData.category,
      description: formData.description,
      duration_minutes: formData.duration_minutes,
      visibility: formData.visibility,
      activities: activitiesObject,
      tags: formData.tags,
      user_id: session.user.id,
      created_at: new Date().toISOString(),
    };
    
    createPlanMutation.mutate(planData);
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Create Energy Plan</h1>
        <p className="text-muted-foreground">
          Design a personalized energy plan to optimize your daily flow
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Start by giving your energy plan a name and selecting its type
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="plan_name">Plan Name</Label>
                <Input
                  id="plan_name"
                  name="plan_name"
                  placeholder="My Energy Plan"
                  value={formData.plan_name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan_type">Plan Type</Label>
                  <Select 
                    value={formData.plan_type} 
                    onValueChange={(value) => handleSelectChange('plan_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {PLAN_TYPES.find(t => t.value === formData.plan_type)?.description}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAN_CATEGORIES.map(category => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
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
                  name="description"
                  placeholder="Describe your energy plan and its purpose..."
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <div 
                      key={tag} 
                      className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        className="text-primary hover:text-primary/80 focus:outline-none"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
                <Input
                  id="tags"
                  placeholder="Add tags (press Enter to add)"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
                <p className="text-xs text-muted-foreground">
                  Press Enter to add a tag. Tags help others find your plan if shared.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="duration">Total Duration</Label>
                  <span className="text-sm font-medium">
                    {formData.duration_minutes} minutes
                  </span>
                </div>
                <Slider
                  defaultValue={[formData.duration_minutes]}
                  max={240}
                  min={5}
                  step={5}
                  onValueChange={handleDurationChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5 min</span>
                  <span>4 hours</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="visibility">Visibility</Label>
                <Select 
                  value={formData.visibility} 
                  onValueChange={handleVisibilityChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Visibility.PRIVATE}>Private (Only you)</SelectItem>
                    <SelectItem value={Visibility.SHARED}>Shared (With link)</SelectItem>
                    <SelectItem value={Visibility.PUBLIC}>Public (Everyone)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Plan Activities
              </CardTitle>
              <CardDescription>
                Add activities to your energy plan to structure your time effectively
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {formData.activities.length > 0 ? (
                  formData.activities.map((activity, index) => (
                    <div 
                      key={activity.id} 
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <div className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>{activity.duration_minutes} minutes</span>
                            {activity.category && (
                              <>
                                <span>•</span>
                                <span className="capitalize">{activity.category}</span>
                              </>
                            )}
                            {activity.energy_impact !== undefined && (
                              <>
                                <span>•</span>
                                <span className={
                                  activity.energy_impact > 0 
                                    ? 'text-green-500' 
                                    : activity.energy_impact < 0 
                                      ? 'text-red-500' 
                                      : ''
                                }>
                                  Energy: {activity.energy_impact > 0 ? '+' : ''}{activity.energy_impact}
                                </span>
                              </>
                            )}
                          </div>
                          {activity.description && (
                            <p className="text-sm mt-1">{activity.description}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveActivity(activity.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 border border-dashed rounded-lg">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No activities yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto mb-4">
                      Add activities to your energy plan to structure your time effectively
                    </p>
                  </div>
                )}
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Add New Activity</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="activity_title">Activity Title</Label>
                      <Input
                        id="activity_title"
                        placeholder="e.g., Deep Work Session"
                        value={newActivity.title}
                        onChange={(e) => handleNewActivityChange('title', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="activity_category">Category</Label>
                      <Select 
                        value={newActivity.category as string || "productivity"} 
                        onValueChange={(value) => handleNewActivityChange('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="productivity">Productivity</SelectItem>
                          <SelectItem value="wellness">Wellness</SelectItem>
                          <SelectItem value="recovery">Recovery</SelectItem>
                          <SelectItem value="physical">Physical</SelectItem>
                          <SelectItem value="mental">Mental</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="activity_duration">Duration (minutes)</Label>
                        <span className="text-sm font-medium">
                          {newActivity.duration_minutes} minutes
                        </span>
                      </div>
                      <Slider
                        defaultValue={[newActivity.duration_minutes || 15]}
                        value={[newActivity.duration_minutes || 15]}
                        max={120}
                        min={5}
                        step={5}
                        onValueChange={(value) => handleNewActivityChange('duration_minutes', value[0])}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="energy_impact">Energy Impact</Label>
                        <span className={`text-sm font-medium ${
                          (newActivity.energy_impact || 0) > 0 
                            ? 'text-green-500' 
                            : (newActivity.energy_impact || 0) < 0 
                              ? 'text-red-500' 
                              : ''
                        }`}>
                          {(newActivity.energy_impact || 0) > 0 ? '+' : ''}
                          {newActivity.energy_impact || 0}
                        </span>
                      </div>
                      <Slider
                        defaultValue={[newActivity.energy_impact || 0]}
                        value={[newActivity.energy_impact || 0]}
                        max={10}
                        min={-10}
                        step={1}
                        onValueChange={(value) => handleNewActivityChange('energy_impact', value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Draining</span>
                        <span>Neutral</span>
                        <span>Energizing</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="activity_description">Description (Optional)</Label>
                    <Textarea
                      id="activity_description"
                      placeholder="Describe the activity..."
                      value={newActivity.description || ""}
                      onChange={(e) => handleNewActivityChange('description', e.target.value)}
                      rows={2}
                    />
                  </div>
                  
                  <Button
                    type="button"
                    onClick={handleAddActivity}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Activity
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">Plan Summary</p>
              <p className="text-sm text-muted-foreground">
                {formData.activities.length} activities • {formData.duration_minutes} minutes total
              </p>
            </div>
            
            <Button 
              type="submit" 
              size="lg"
              disabled={createPlanMutation.isPending}
              className="gap-2"
            >
              {createPlanMutation.isPending ? (
                "Creating Plan..."
              ) : (
                <>
                  Create Energy Plan
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateEnergyPlanPage;
