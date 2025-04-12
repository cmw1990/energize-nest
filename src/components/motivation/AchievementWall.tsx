
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Award, 
  Medal, 
  Share2, 
  Trophy, 
  Target, 
  Dumbbell, 
  Coffee, 
  Brain,
  Moon,
  Focus,
  Utensils,
  Droplet
} from "lucide-react";
import { motion } from "framer-motion";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  category: string;
  level: number;
  achieved: boolean;
  date_achieved?: string;
  progress?: number;
  total_required?: number;
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

type LucideIcon = typeof Trophy;

// Fix database type to match Achievement interface
interface DatabaseAchievement {
  id: string;
  category: string;
  created_at: string;
  description: string;
  icon: string;
  level: number;
  next_level_points: number;
  points: number;
  progress: number;
  streak_count: number;
  target_value: number;
  title: string;
  type: string;
  unlocked_at: string;
  user_id: string;
  unlocked?: boolean;
}

const mockAchievements: Achievement[] = [
  {
    id: "1",
    name: "Early Bird",
    description: "Complete 5 morning routines before 7AM",
    icon: Coffee,
    category: "habits",
    level: 1,
    achieved: true,
    date_achieved: "2023-11-15",
    rarity: "common"
  },
  {
    id: "2",
    name: "Mindfulness Master",
    description: "Complete 10 meditation sessions",
    icon: Brain,
    category: "wellness",
    level: 1,
    achieved: true,
    date_achieved: "2023-12-01",
    rarity: "uncommon"
  },
  {
    id: "3",
    name: "Goal Crusher",
    description: "Achieve 3 weekly goals in a row",
    icon: Target,
    category: "productivity",
    level: 1,
    achieved: true,
    date_achieved: "2023-12-10",
    rarity: "uncommon"
  },
  {
    id: "4",
    name: "Strength Builder",
    description: "Complete 20 workout sessions",
    icon: Dumbbell,
    category: "fitness",
    level: 2,
    achieved: false,
    progress: 15,
    total_required: 20,
    rarity: "rare"
  },
  {
    id: "5",
    name: "Sleep Champion",
    description: "Maintain good sleep schedule for 14 days",
    icon: Moon,
    category: "wellness",
    level: 2,
    achieved: false,
    progress: 8,
    total_required: 14,
    rarity: "rare"
  },
  {
    id: "6",
    name: "Focus Guru",
    description: "Complete 30 focus sessions",
    icon: Focus,
    category: "productivity",
    level: 3,
    achieved: false,
    progress: 22,
    total_required: 30,
    rarity: "epic"
  },
  {
    id: "7",
    name: "Nutrition Expert",
    description: "Log your meals for 30 consecutive days",
    icon: Utensils,
    category: "nutrition",
    level: 3,
    achieved: false,
    progress: 18,
    total_required: 30,
    rarity: "epic"
  },
  {
    id: "8",
    name: "Water Wise",
    description: "Meet your daily water goal for 21 days in a row",
    icon: Droplet,
    category: "nutrition",
    level: 2,
    achieved: false,
    progress: 14,
    total_required: 21,
    rarity: "rare"
  }
];

export function AchievementWall() {
  const { session } = useAuth();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data: achievements } = useQuery({
    queryKey: ['achievements', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return mockAchievements;
      
      try {
        const { data, error } = await supabase
          .from('achievements')
          .select('*')
          .eq('user_id', session.user.id);
        
        if (error) throw error;
        
        // If no achievements yet, return the mock data
        if (!data || data.length === 0) return mockAchievements;
        
        // Process achievements from the database - map database schema to Achievement interface
        return data.map((achievement: DatabaseAchievement) => ({
          id: achievement.id,
          name: achievement.title,
          description: achievement.description,
          icon: getIconByName(achievement.icon),
          category: achievement.category,
          level: achievement.level,
          achieved: !!achievement.unlocked_at,
          date_achieved: achievement.unlocked_at,
          progress: achievement.progress,
          total_required: achievement.target_value,
        } as Achievement));
      } catch (error) {
        console.error('Error fetching achievements:', error);
        return mockAchievements;
      }
    },
    enabled: true, // Enable even without session to show mock data
  });

  const getIconByName = (iconName: string): LucideIcon => {
    const iconMap: Record<string, LucideIcon> = {
      Award: Award,
      Medal: Medal,
      Trophy: Trophy,
      Target: Target,
      Dumbbell: Dumbbell,
      Coffee: Coffee,
      Brain: Brain,
      Moon: Moon,
      Focus: Focus,
      Utensils: Utensils,
      Droplet: Droplet
    };
    
    return iconMap[iconName] || Trophy;
  };

  const getRarityColor = (rarity: string | undefined) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800";
      case "uncommon": return "bg-green-100 text-green-800";
      case "rare": return "bg-blue-100 text-blue-800";
      case "epic": return "bg-purple-100 text-purple-800";
      case "legendary": return "bg-amber-100 text-amber-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number = 0, total: number = 100) => {
    const percentage = (progress / total) * 100;
    if (percentage < 30) return "bg-red-500";
    if (percentage < 70) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1: return "bg-bronze text-white";
      case 2: return "bg-silver text-white";
      case 3: return "bg-gold text-white";
      default: return "bg-bronze text-white";
    }
  };

  const filteredAchievements = achievements?.filter(achievement => 
    activeCategory === "all" || achievement.category === activeCategory
  );

  const achievedCount = achievements?.filter(a => a.achieved).length || 0;
  const totalCount = achievements?.length || 0;
  const completionPercentage = totalCount > 0 ? Math.round((achievedCount / totalCount) * 100) : 0;

  const categories = ["all", ...new Set(achievements?.map(a => a.category))];

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-amber-500" />
            Achievement Wall
          </CardTitle>
          <Badge variant="outline" className="gap-1">
            <Trophy className="h-3 w-3" />
            {achievedCount}/{totalCount} ({completionPercentage}%)
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-4 flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeCategory} className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredAchievements?.map((achievement) => (
                <motion.div
                  key={achievement.id}
                  whileHover={{ scale: 1.02 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dialog>
                    <DialogTrigger asChild>
                      <Card 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          achievement.achieved ? "border-amber-200" : ""
                        }`}
                        onClick={() => setSelectedAchievement(achievement)}
                      >
                        <CardContent className="p-4 flex flex-col items-center text-center space-y-2">
                          <div className={`p-3 rounded-full ${achievement.achieved ? "bg-amber-100" : "bg-gray-100"}`}>
                            <achievement.icon className={`h-8 w-8 ${achievement.achieved ? "text-amber-500" : "text-gray-500"}`} />
                          </div>
                          <div>
                            <h3 className="font-medium truncate max-w-[120px]">{achievement.name}</h3>
                            <p className="text-xs text-muted-foreground line-clamp-2 h-8">
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.achieved ? (
                            <Badge className={getLevelBadge(achievement.level)}>
                              Level {achievement.level}
                            </Badge>
                          ) : (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div 
                                className={`h-2.5 rounded-full ${getProgressColor(achievement.progress, achievement.total_required)}`}
                                style={{ width: `${(achievement.progress || 0) / (achievement.total_required || 1) * 100}%` }}
                              ></div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </DialogTrigger>
                    <DialogContent>
                      {selectedAchievement && (
                        <>
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <selectedAchievement.icon className={`h-5 w-5 ${selectedAchievement.achieved ? "text-amber-500" : "text-gray-500"}`} />
                              {selectedAchievement.name}
                            </DialogTitle>
                            <DialogDescription>
                              {selectedAchievement.description}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="flex flex-wrap gap-2">
                              <Badge className={getRarityColor(selectedAchievement.rarity)}>
                                {selectedAchievement.rarity}
                              </Badge>
                              <Badge className={getLevelBadge(selectedAchievement.level)}>
                                Level {selectedAchievement.level}
                              </Badge>
                              <Badge variant="outline" className="capitalize">
                                {selectedAchievement.category}
                              </Badge>
                            </div>
                            
                            {selectedAchievement.achieved ? (
                              <div className="bg-green-50 text-green-800 p-3 rounded-md">
                                <p className="text-sm font-medium">Achievement unlocked!</p>
                                <p className="text-xs">
                                  Achieved on {new Date(selectedAchievement.date_achieved || "").toLocaleDateString()}
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <p className="text-sm font-medium">Progress</p>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className={`h-2.5 rounded-full ${getProgressColor(selectedAchievement.progress, selectedAchievement.total_required)}`}
                                    style={{ width: `${(selectedAchievement.progress || 0) / (selectedAchievement.total_required || 1) * 100}%` }}
                                  ></div>
                                </div>
                                <p className="text-xs text-muted-foreground text-right">
                                  {selectedAchievement.progress || 0}/{selectedAchievement.total_required || 0}
                                </p>
                              </div>
                            )}
                          </div>
                          
                          {selectedAchievement.achieved && (
                            <div className="flex justify-end">
                              <Button size="sm" variant="outline" className="gap-1">
                                <Share2 className="h-4 w-4" />
                                Share
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    </DialogContent>
                  </Dialog>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Add these functions if they aren't already defined elsewhere in the file
const getRarityColor = (rarity: string | undefined) => {
  switch (rarity) {
    case "common": return "bg-gray-100 text-gray-800";
    case "uncommon": return "bg-green-100 text-green-800";
    case "rare": return "bg-blue-100 text-blue-800";
    case "epic": return "bg-purple-100 text-purple-800";
    case "legendary": return "bg-amber-100 text-amber-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

const getProgressColor = (progress: number = 0, total: number = 100) => {
  const percentage = (progress / total) * 100;
  if (percentage < 30) return "bg-red-500";
  if (percentage < 70) return "bg-amber-500";
  return "bg-emerald-500";
};

const getLevelBadge = (level: number) => {
  switch (level) {
    case 1: return "bg-bronze text-white";
    case 2: return "bg-silver text-white";
    case 3: return "bg-gold text-white";
    default: return "bg-bronze text-white";
  }
};
