
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Coffee, Utensils, Dumbbell, Tv, Wine, Clock, Calendar, Zap } from "lucide-react";

const SleepRecommendations = () => {
  const { session } = useAuth();
  
  const { data: sleepData } = useQuery({
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
    return Array.from(new Set(recommendations)).slice(0, 8);
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
            icon: <Clock className="h-5 w-5 text-primary" />,
            title: "Increase Sleep Duration",
            description: "Aim for 7-9 hours of sleep. Try going to bed 30 minutes earlier than usual.",
            priority: "high"
          },
          {
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
            icon: <Moon className="h-5 w-5 text-primary" />,
            title: "Improve Sleep Environment",
            description: "Ensure your bedroom is dark, quiet, and at a comfortable temperature (60-67°F/15-19°C).",
            priority: "high"
          },
          {
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
            icon: <Dumbbell className="h-5 w-5 text-primary" />,
            title: "Regular Exercise",
            description: "Exercise regularly, but not within 2-3 hours of bedtime to promote deeper sleep.",
            priority: "high"
          },
          {
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
            icon: <Tv className="h-5 w-5 text-primary" />,
            title: "Digital Sunset",
            description: "Avoid screens 1-2 hours before bed to reduce sleep interruptions.",
            priority: "high"
          },
          {
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
        icon: <Moon className="h-5 w-5 text-primary" />,
        title: "Consistent Sleep Schedule",
        description: "Go to bed and wake up at the same time every day, including weekends.",
        priority: "high"
      },
      {
        icon: <Sun className="h-5 w-5 text-primary" />,
        title: "Morning Sunlight",
        description: "Expose yourself to sunlight in the morning to help regulate your circadian rhythm.",
        priority: "medium"
      },
      {
        icon: <Coffee className="h-5 w-5 text-primary" />,
        title: "Limit Caffeine",
        description: "Avoid caffeine in the afternoon and evening, as it can disrupt your sleep.",
        priority: "medium"
      },
      {
        icon: <Dumbbell className="h-5 w-5 text-primary" />,
        title: "Regular Exercise",
        description: "Exercise regularly, but not too close to bedtime. Aim to finish at least 3 hours before sleep.",
        priority: "medium"
      },
      {
        icon: <Tv className="h-5 w-5 text-primary" />,
        title: "Limit Screen Time",
        description: "Avoid screens (phones, computers, TV) at least 1 hour before bedtime.",
        priority: "high"
      },
      {
        icon: <Wine className="h-5 w-5 text-primary" />,
        title: "Moderate Alcohol",
        description: "Limit alcohol consumption, especially close to bedtime, as it disrupts sleep quality.",
        priority: "medium"
      },
      {
        icon: <Utensils className="h-5 w-5 text-primary" />,
        title: "Light Evening Meals",
        description: "Eat lighter meals in the evening and at least 2-3 hours before bedtime.",
        priority: "medium"
      },
      {
        icon: <Zap className="h-5 w-5 text-primary" />,
        title: "Relaxation Techniques",
        description: "Practice relaxation techniques like deep breathing or meditation before bed.",
        priority: "high"
      }
    ];
  };
  
  const recommendations = getRecommendations();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {recommendations.map((recommendation, index) => (
        <Card key={index} className="overflow-hidden border-primary/10 hover:shadow-md transition-shadow">
          <CardContent className="p-0">
            <div className="flex items-start space-x-4 p-6">
              <div className="rounded-full bg-primary/10 p-3 mt-1">
                {recommendation.icon}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{recommendation.title}</h3>
                  <Badge variant={recommendation.priority === "high" ? "default" : "outline"}>
                    {recommendation.priority === "high" ? "Priority" : "Recommended"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{recommendation.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SleepRecommendations;
