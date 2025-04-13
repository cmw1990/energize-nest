
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Moon, Sun, Coffee, Utensils, Dumbbell, Tv, Wine, 
  Clock, Calendar, Zap, BedDouble, Heart, Brain, 
  Bell, ThumbsUp, Snowflake 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const SleepRecommendations = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [savedRecommendations, setSavedRecommendations] = useState<string[]>([]);
  
  // Fetch user's sleep data
  const { data: sleepData, isLoading: isSleepLoading } = useQuery({
    queryKey: ["sleep_recommendations", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("sleep_logs")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(7);
      
      if (error) {
        console.error("Error fetching sleep data:", error);
        return [];
      }
      
      return data || [];
    },
    enabled: !!session?.user?.id
  });
  
  // Fetch user's saved recommendations
  const { data: savedData } = useQuery({
    queryKey: ["saved_recommendations", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("saved_sleep_recommendations")
        .select("recommendation_id")
        .eq("user_id", session.user.id);
      
      if (error) {
        console.error("Error fetching saved recommendations:", error);
        return null;
      }
      
      return data.map(item => item.recommendation_id);
    },
    enabled: !!session?.user?.id,
    onSuccess: (data) => {
      if (data) setSavedRecommendations(data);
    }
  });
  
  const saveRecommendation = async (recommendationId: string) => {
    if (!session?.user?.id) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save recommendations.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from("saved_sleep_recommendations")
        .insert({
          user_id: session.user.id,
          recommendation_id: recommendationId,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setSavedRecommendations(prev => [...prev, recommendationId]);
      
      toast({
        title: "Recommendation saved",
        description: "We'll use this to personalize your sleep plan.",
      });
    } catch (error) {
      console.error("Error saving recommendation:", error);
      toast({
        title: "Couldn't save recommendation",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const removeRecommendation = async (recommendationId: string) => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase
        .from("saved_sleep_recommendations")
        .delete()
        .eq("user_id", session.user.id)
        .eq("recommendation_id", recommendationId);
      
      if (error) throw error;
      
      setSavedRecommendations(prev => prev.filter(id => id !== recommendationId));
      
      toast({
        title: "Recommendation removed",
        description: "We've updated your preferences.",
      });
    } catch (error) {
      console.error("Error removing recommendation:", error);
      toast({
        title: "Couldn't remove recommendation",
        description: "Please try again later.",
        variant: "destructive"
      });
    }
  };
  
  const getRecommendations = () => {
    if (!sleepData || sleepData.length === 0) {
      return getDefaultRecommendations();
    }
    
    const recommendations = [...getDefaultRecommendations()];
    const issues = analyzeIssues();
    
    issues.forEach(issue => {
      recommendations.push(...issue.recommendations);
    });
    
    // Remove duplicates and limit to 8 recommendations
    return Array.from(new Set(recommendations.map(r => r.id)))
      .map(id => recommendations.find(r => r.id === id))
      .filter(Boolean)
      .slice(0, 8);
  };
  
  const analyzeIssues = () => {
    const issues = [];
    
    // Calculate average metrics
    const avgDuration = sleepData.reduce((sum, log) => sum + (log.sleep_duration || 0), 0) / sleepData.length;
    const avgQuality = sleepData.reduce((sum, log) => sum + (log.sleep_quality || 0), 0) / sleepData.length;
    const avgDeep = sleepData.reduce((sum, log) => sum + (log.deep_percentage || 0), 0) / sleepData.length;
    const avgInterruptions = sleepData.reduce((sum, log) => sum + (log.interruptions || 0), 0) / sleepData.length;
    
    // Check for short sleep duration
    if (avgDuration < 7) {
      issues.push({
        type: "short_duration",
        recommendations: [
          {
            id: "increase_duration",
            icon: <Clock className="h-5 w-5 text-primary" />,
            title: "Increase Sleep Duration",
            description: "Aim for 7-9 hours of sleep. Try going to bed 30 minutes earlier than usual.",
            priority: "high"
          },
          {
            id: "consistent_schedule",
            icon: <Calendar className="h-5 w-5 text-primary" />,
            title: "Consistent Schedule",
            description: "Maintain the same bedtime and wake time, even on weekends.",
            priority: "medium"
          }
        ]
      });
    }
    
    // Check for poor sleep quality
    if (avgQuality < 6) {
      issues.push({
        type: "poor_quality",
        recommendations: [
          {
            id: "improve_environment",
            icon: <Moon className="h-5 w-5 text-primary" />,
            title: "Improve Sleep Environment",
            description: "Ensure your bedroom is dark, quiet, and at a comfortable temperature (60-67°F/15-19°C).",
            priority: "high"
          },
          {
            id: "morning_light",
            icon: <Sun className="h-5 w-5 text-primary" />,
            title: "Morning Sunlight Exposure",
            description: "Get 15-30 minutes of sunlight in the morning to regulate your circadian rhythm.",
            priority: "medium"
          }
        ]
      });
    }
    
    // Check for low deep sleep
    if (avgDeep < 15) {
      issues.push({
        type: "low_deep_sleep",
        recommendations: [
          {
            id: "regular_exercise",
            icon: <Dumbbell className="h-5 w-5 text-primary" />,
            title: "Regular Exercise",
            description: "Exercise regularly, but not within 2-3 hours of bedtime to promote deeper sleep.",
            priority: "high"
          },
          {
            id: "limit_caffeine",
            icon: <Coffee className="h-5 w-5 text-primary" />,
            title: "Limit Caffeine",
            description: "Avoid caffeine at least 8 hours before bedtime to improve deep sleep.",
            priority: "medium"
          }
        ]
      });
    }
    
    // Check for frequent interruptions
    if (avgInterruptions > 2) {
      issues.push({
        type: "frequent_interruptions",
        recommendations: [
          {
            id: "digital_sunset",
            icon: <Tv className="h-5 w-5 text-primary" />,
            title: "Digital Sunset",
            description: "Avoid screens 1-2 hours before bed to reduce sleep interruptions.",
            priority: "high"
          },
          {
            id: "light_meals",
            icon: <Utensils className="h-5 w-5 text-primary" />,
            title: "Light Evening Meals",
            description: "Have dinner at least 3 hours before bedtime to prevent digestive disturbances.",
            priority: "medium"
          }
        ]
      });
    }
    
    return issues;
  };
  
  const getDefaultRecommendations = () => {
    return [
      {
        id: "consistent_schedule",
        icon: <BedDouble className="h-5 w-5 text-primary" />,
        title: "Consistent Sleep Schedule",
        description: "Go to bed and wake up at the same time every day, including weekends.",
        priority: "high"
      },
      {
        id: "morning_sunlight",
        icon: <Sun className="h-5 w-5 text-primary" />,
        title: "Morning Sunlight",
        description: "Expose yourself to sunlight in the morning to help regulate your circadian rhythm.",
        priority: "medium"
      },
      {
        id: "limit_caffeine",
        icon: <Coffee className="h-5 w-5 text-primary" />,
        title: "Limit Caffeine",
        description: "Avoid caffeine in the afternoon and evening, as it can disrupt your sleep for up to 8 hours.",
        priority: "medium"
      },
      {
        id: "regular_exercise",
        icon: <Dumbbell className="h-5 w-5 text-primary" />,
        title: "Regular Exercise",
        description: "Exercise regularly, but try to finish at least 3 hours before bedtime.",
        priority: "medium"
      },
      {
        id: "limit_screens",
        icon: <Tv className="h-5 w-5 text-primary" />,
        title: "Limit Screen Time",
        description: "Avoid screens (phones, computers, TV) at least 1 hour before bedtime.",
        priority: "high"
      },
      {
        id: "moderate_alcohol",
        icon: <Wine className="h-5 w-5 text-primary" />,
        title: "Moderate Alcohol",
        description: "Limit alcohol consumption, especially close to bedtime, as it disrupts sleep quality.",
        priority: "medium"
      },
      {
        id: "light_meals",
        icon: <Utensils className="h-5 w-5 text-primary" />,
        title: "Light Evening Meals",
        description: "Eat lighter meals in the evening and at least 2-3 hours before bedtime.",
        priority: "medium"
      },
      {
        id: "relaxation_techniques",
        icon: <Zap className="h-5 w-5 text-primary" />,
        title: "Relaxation Techniques",
        description: "Practice relaxation techniques like deep breathing or meditation before bed.",
        priority: "high"
      },
      {
        id: "comfortable_bedding",
        icon: <ThumbsUp className="h-5 w-5 text-primary" />,
        title: "Comfortable Bedding",
        description: "Invest in a quality mattress and pillows that support your sleep position.",
        priority: "medium"
      },
      {
        id: "cool_room",
        icon: <Snowflake className="h-5 w-5 text-primary" />,
        title: "Cool Room Temperature",
        description: "Keep your bedroom between 60-67°F (15-19°C) for optimal sleep.",
        priority: "medium"
      },
      {
        id: "limit_naps",
        icon: <Clock className="h-5 w-5 text-primary" />,
        title: "Limit Daytime Naps",
        description: "Keep naps under 30 minutes and before 3 PM to avoid disrupting nighttime sleep.",
        priority: "medium"
      },
      {
        id: "sleep_routine",
        icon: <Bell className="h-5 w-5 text-primary" />,
        title: "Bedtime Routine",
        description: "Develop a relaxing pre-sleep routine that helps signal to your body it's time to sleep.",
        priority: "high"
      }
    ];
  };
  
  const recommendations = getRecommendations();
  
  if (isSleepLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.map((recommendation, index) => (
        <motion.div
          key={recommendation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          whileHover={{ scale: 1.02 }}
        >
          <Card className="overflow-hidden border-primary/10 hover:shadow-md transition-shadow h-full">
            <CardContent className="p-0">
              <div className="flex items-start space-x-4 p-6">
                <div className="rounded-full bg-primary/10 p-3 mt-1">
                  {recommendation.icon}
                </div>
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{recommendation.title}</h3>
                      <Badge variant={recommendation.priority === "high" ? "default" : "outline"}>
                        {recommendation.priority === "high" ? "Priority" : "Recommended"}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0"
                      onClick={() => savedRecommendations.includes(recommendation.id) 
                        ? removeRecommendation(recommendation.id)
                        : saveRecommendation(recommendation.id)
                      }
                    >
                      <Heart 
                        className={`h-5 w-5 ${savedRecommendations.includes(recommendation.id) ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} 
                      />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

export default SleepRecommendations;
