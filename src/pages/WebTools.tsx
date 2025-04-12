
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { TopNav } from "@/components/layout/TopNav";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  Brain, 
  Leaf, 
  HeartPulse, 
  Settings, 
  ChartBar, 
  Waves, 
  Music2, 
  Focus, 
  Wind, 
  Footprints, 
  Moon, 
  Coffee, 
  Cigarette, 
  Battery, 
  Droplets, 
  Bath, 
  Calculator, 
  Search, 
  Clock, 
  Dumbbell, 
  Activity, 
  ThermometerSun 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";

interface WebTool {
  id?: string;
  title: string;
  description: string;
  slug?: string;
  path?: string;
  icon?: string;
  tags: string[];
  category: string;
  is_premium?: boolean;
  view_count?: number;
  published?: boolean;
  content?: string;
  created_at?: string;
}

const iconMap: Record<string, LucideIcon> = {
  'white-noise': Wind,
  'binaural-beats': Waves,
  'nature-sounds': Music2,
  'bathing': Bath,
  'breathing': Wind,
  'sleep-guide': Moon,
  'focus-timer': Focus,
  'meditation': Brain,
  'supplement-guide': Leaf,
  'caffeine-guide': Coffee,
  'energy-drinks-guide': Battery,
  'hydration-guide': Droplets,
  'bmi-calculator': Calculator,
  'body-fat-calculator': Calculator,
  'bmr-calculator': Calculator,
  'hrv-calculator': Calculator,
  'sleep-calculator': Clock,
  'calorie-calculator': ChartBar,
  'workout-timer': Dumbbell,
  'step-counter': Footprints,
  'heart-rate-calculator': HeartPulse,
  'stress-test': Activity,
  'temperature-converter': ThermometerSun,
};

// Default tools to seed if none exist in database
const defaultWebTools: WebTool[] = [
  {
    title: "White Noise Generator",
    description: "Customize and play different types of white, pink, and brown noise to enhance focus and relaxation. Try our science-backed sound profiles.",
    slug: "white-noise",
    path: "/tools/white-noise",
    tags: ["focus", "sound", "productivity"],
    category: "meditation",
    published: true,
    is_premium: false
  },
  {
    title: "Binaural Beats",
    description: "Experience different frequency ranges for meditation, focus, and relaxation. Access basic frequencies for free.",
    slug: "binaural-beats",
    path: "/tools/binaural-beats",
    tags: ["meditation", "focus", "sound"],
    category: "meditation",
    published: true,
    is_premium: true
  },
  {
    title: "Nature Sounds",
    description: "Calming nature sounds for relaxation and focus. Perfect for meditation or background noise while working.",
    slug: "nature-sounds",
    path: "/tools/nature-sounds",
    tags: ["relaxation", "sound", "focus"],
    category: "meditation",
    published: true
  },
  {
    title: "BMI Calculator",
    description: "Calculate your Body Mass Index (BMI) to assess if your weight is in a healthy range. Get instant results and interpretations.",
    slug: "bmi-calculator",
    path: "/tools/bmi-calculator",
    tags: ["health", "fitness", "calculator"],
    category: "health",
    is_premium: false,
    published: true
  },
  {
    title: "Body Fat Calculator",
    description: "Calculate your body fat percentage using the U.S. Navy Method. Get accurate measurements and understand your body composition.",
    slug: "body-fat-calculator",
    path: "/tools/body-fat-calculator",
    tags: ["health", "fitness", "calculator"],
    category: "health",
    is_premium: false,
    published: true
  },
  {
    title: "BMR Calculator",
    description: "Calculate your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) to understand your daily caloric needs.",
    slug: "bmr-calculator",
    path: "/tools/bmr-calculator",
    tags: ["health", "fitness", "calculator"],
    category: "health",
    is_premium: false,
    published: true
  },
  {
    title: "HRV Calculator",
    description: "Calculate your Heart Rate Variability (HRV) to assess your autonomic nervous system health and stress levels.",
    slug: "hrv-calculator",
    path: "/tools/hrv-calculator",
    tags: ["health", "fitness", "calculator"],
    category: "health",
    is_premium: false,
    published: true
  },
  {
    title: "Tea Database",
    description: "Comprehensive guide to teas, their compounds, health benefits, and brewing methods.",
    slug: "tea-database",
    path: "/tools/tea-database",
    tags: ["health", "tea", "wellness"],
    category: "health",
    published: true
  },
  {
    title: "Energy Enhancement Database",
    description: "Comprehensive database of energy drinks, stimulants, and natural energy boosters with detailed analysis.",
    slug: "energy-enhancement",
    path: "/tools/energy-enhancement",
    tags: ["energy", "health", "wellness"],
    category: "health",
    published: true
  },
  {
    title: "Sleep Optimization",
    description: "Evidence-based methods for improving sleep quality and recovery.",
    slug: "sleep",
    path: "/tools/sleep",
    tags: ["sleep", "health", "wellness"],
    category: "health",
    published: true
  },
  {
    title: "Light Optimization",
    description: "Strategic light exposure protocols for circadian health and cellular function.",
    slug: "light",
    path: "/tools/light",
    tags: ["light", "health", "wellness"],
    category: "health",
    published: true
  },
  {
    title: "The Well-Recharged Guide to Sleep",
    description: "Comprehensive sleep resource hub with science-backed guides, product reviews, and tools for better sleep. Access sleep tracking, environment optimization, and expert advice.",
    slug: "sleep-guide",
    path: "/tools/sleep-guide",
    tags: ["sleep", "health", "wellness", "education"],
    category: "health",
    published: true
  },
  {
    title: "Sleep Calculator",
    description: "Plan your bedtime or wake time to optimize your sleep cycles for better rest and energy.",
    slug: "sleep-calculator",
    path: "/tools/sleep-calculator",
    tags: ["sleep", "health", "calculator"],
    category: "health",
    published: true
  },
  {
    title: "Calorie Calculator",
    description: "Calculate your daily caloric needs based on activity level, goals, and personal metrics.",
    slug: "calorie-calculator",
    path: "/tools/calorie-calculator",
    tags: ["nutrition", "fitness", "calculator"],
    category: "health",
    published: true
  },
  {
    title: "Workout Timer",
    description: "Interval timer for HIIT, Tabata, and circuit workouts with customizable work/rest periods.",
    slug: "workout-timer",
    path: "/tools/workout-timer",
    tags: ["fitness", "exercise", "timer"],
    category: "fitness",
    published: true
  },
  {
    title: "Step Counter",
    description: "Track your daily steps and calculate distances without needing a fitness tracker.",
    slug: "step-counter",
    path: "/tools/step-counter",
    tags: ["fitness", "activity", "tracking"],
    category: "fitness",
    published: true
  },
  {
    title: "Heart Rate Zone Calculator",
    description: "Calculate your heart rate zones for optimal training intensity based on your age and fitness level.",
    slug: "heart-rate-calculator",
    path: "/tools/heart-rate-calculator",
    tags: ["fitness", "health", "calculator"],
    category: "fitness",
    published: true
  },
  {
    title: "Stress Test",
    description: "Quick assessment to evaluate your current stress levels with personalized recommendations.",
    slug: "stress-test",
    path: "/tools/stress-test",
    tags: ["mental-health", "wellness", "assessment"],
    category: "mental-health",
    published: true
  }
];

const WebTools = () => {
  const { toolSlug } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  // Fetch tools from database
  const { data: dbTools, isLoading } = useQuery({
    queryKey: ['webTools'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('web_tools')
          .select('*')
          .eq('published', true)
          .order('view_count', { ascending: false });

        if (error) throw error;
        
        // Seed tools if none exist
        if (!data?.length) {
          await seedWebTools();
          const { data: seededData, error: seededError } = await supabase
            .from('web_tools')
            .select('*')
            .eq('published', true)
            .order('view_count', { ascending: false });
            
          if (seededError) throw seededError;
          return seededData as WebTool[];
        }
        
        return data as WebTool[];
      } catch (error) {
        console.error("Error fetching web tools:", error);
        // Return default tools as fallback
        return defaultWebTools;
      }
    }
  });

  // Fetch specific tool if toolSlug is provided
  const { data: currentTool, isLoading: isToolLoading } = useQuery({
    queryKey: ['webTool', toolSlug],
    queryFn: async () => {
      if (!toolSlug) return null;
      
      const { data, error } = await supabase
        .from('web_tools')
        .select('*')
        .eq('slug', toolSlug)
        .eq('published', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') { // No rows returned
          // Try to find in default tools
          const defaultTool = defaultWebTools.find(t => t.slug === toolSlug);
          if (defaultTool) return defaultTool;
          
          // Not found in defaults either, redirect to tools page
          navigate('/tools');
          return null;
        }
        throw error;
      }
      
      return data as WebTool;
    },
    enabled: !!toolSlug
  });

  const trackViewMutation = useMutation({
    mutationFn: async (toolId: string) => {
      const { data, error } = await supabase
        .from('web_tools')
        .select('view_count')
        .eq('id', toolId)
        .single();
      
      if (error) throw error;
      
      const { error: updateError } = await supabase
        .from('web_tools')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', toolId);
      
      if (updateError) throw updateError;
    },
    onError: (error) => {
      console.error('Error tracking tool view:', error);
    }
  });

  const seedWebTools = async () => {
    console.log("Seeding web tools...");
    
    const toolsToSeed = defaultWebTools.map(tool => ({
      ...tool,
      content: tool.description,
      path: `/tools/${tool.slug}`,
      view_count: 0
    }));
    
    for (const tool of toolsToSeed) {
      try {
        const { error } = await supabase
          .from('web_tools')
          .upsert(tool, { onConflict: 'slug' });
        
        if (error) console.error('Error seeding tool:', error);
      } catch (err) {
        console.error('Exception seeding tool:', err);
      }
    }
    
    console.log("Seeding complete");
  };

  // Track view when a tool is accessed
  useEffect(() => {
    if (currentTool?.id && !isToolLoading) {
      trackViewMutation.mutate(currentTool.id);
    }
  }, [currentTool?.id, isToolLoading]);

  // Filter tools by search term and category
  const filteredTools = React.useMemo(() => {
    if (!dbTools) return [];
    
    return dbTools.filter(tool => {
      const matchesSearch = 
        tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = activeCategory ? tool.category === activeCategory : true;
      
      return matchesSearch && matchesCategory;
    });
  }, [dbTools, searchTerm, activeCategory]);

  // Get unique categories from tools
  const categories = React.useMemo(() => {
    if (!dbTools) return [];
    return Array.from(new Set(dbTools.map(tool => tool.category)));
  }, [dbTools]);

  // Helper to get Icon component from string
  const getIconComponent = (iconName?: string): LucideIcon => {
    if (!iconName) return Brain;
    return iconMap[iconName] || Brain;
  };

  if (toolSlug && currentTool) {
    // Render individual tool view
    return (
      <div className="min-h-screen bg-background">
        <TopNav />
        <div className="container mx-auto p-4 space-y-6">
          <Button variant="outline" onClick={() => navigate('/tools')}>
            ← Back to Tools
          </Button>
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-full">
              {React.createElement(getIconComponent(currentTool.slug), {
                className: "h-8 w-8 text-primary"
              })}
            </div>
            <div>
              <h1 className="text-3xl font-bold">{currentTool.title}</h1>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentTool.tags?.map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {currentTool.is_premium && (
                  <Badge variant="default" className="text-xs">
                    Premium Available
                  </Badge>
                )}
              </div>
            </div>
          </div>
          
          <Card className="prose max-w-none dark:prose-invert">
            <CardContent className="pt-6">
              <p className="text-lg">{currentTool.description}</p>
              
              {currentTool.content && currentTool.content !== currentTool.description && (
                <div className="mt-4" dangerouslySetInnerHTML={{ __html: currentTool.content }} />
              )}
              
              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="text-lg font-semibold mb-2">Tool Coming Soon</h3>
                <p>
                  We're currently developing this tool for you. Sign in to get notified when it's available!
                </p>
                <div className="mt-4">
                  <Button onClick={() => navigate('/auth')}>Sign In</Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Related Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {dbTools
                  ?.filter(tool => 
                    tool.category === currentTool.category && 
                    tool.id !== currentTool.id
                  )
                  .slice(0, 3)
                  .map((tool) => (
                    <Link key={tool.id || tool.slug} to={`/tools/${tool.slug}`}>
                      <Card className="h-full hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{tool.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {tool.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Render tools listing
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      
      <div className="container mx-auto p-4 space-y-6">
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Transform Your Well-being with Science-Backed Tools
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience our comprehensive collection of wellness tools designed to optimize your focus, energy, and health. 
            From advanced sound therapy to precise health calculators - all backed by scientific research.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link to="/auth">
              <Button variant="default" size="lg" className="w-full sm:w-auto">
                Get Started Free
              </Button>
            </Link>
            <Link to="/why-us">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Why The Well-Charged?
              </Button>
            </Link>
            <Link to="/app">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Open Web App
              </Button>
            </Link>
          </div>
          <div className="flex justify-center gap-4 items-center text-sm text-muted-foreground mt-4">
            <span>✨ No credit card required</span>
            <span className="hidden sm:inline">•</span>
            <span>🔒 Privacy focused</span>
            <span className="hidden sm:inline">•</span>
            <span>🚀 Instant access</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                className="pl-10" 
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <Tabs 
            value={activeCategory || "all"} 
            onValueChange={(value) => setActiveCategory(value === "all" ? null : value)}
            className="w-full md:w-auto"
          >
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-64 bg-muted rounded-lg"></div>
            ))}
          </div>
        ) : filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool: WebTool) => (
              <Link 
                key={tool.id || tool.title} 
                to={tool.path || `/tools/${tool.slug}`}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-2 border-primary/20">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {tool.icon ? React.createElement(iconMap[tool.icon], {
                          className: "h-6 w-6 text-primary"
                        }) : tool.slug && iconMap[tool.slug] ? React.createElement(iconMap[tool.slug], {
                          className: "h-6 w-6 text-primary"
                        }) : <Brain className="h-6 w-6 text-primary" />}
                      </div>
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {tool.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {tool.tags?.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-secondary/10 text-secondary text-sm rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                      {tool.is_premium && (
                        <span className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full">
                          Premium Available
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 border rounded-lg bg-muted/20">
            <h3 className="text-xl font-semibold mb-2">No tools found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any tools matching your search criteria.
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setActiveCategory(null);
            }}>
              Clear Filters
            </Button>
          </div>
        )}

        <div className="mt-12 text-center">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Need More Features?</CardTitle>
              <CardDescription>
                Try our full web app for advanced features like:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="list-disc text-left pl-6 mb-4 space-y-2">
                <li>Personal progress tracking</li>
                <li>Customizable dashboards</li>
                <li>Advanced analytics</li>
                <li>Session history</li>
                <li>Goal setting and tracking</li>
              </ul>
              <Link to="/app">
                <Button size="lg">Launch Web App</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Basic tools are free to use. Sign in to access the full web app with advanced features and progress tracking.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WebTools;
