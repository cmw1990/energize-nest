
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { DailyMotivation } from "@/components/motivation/DailyMotivation";
import { MotivationStats } from "@/components/motivation/MotivationStats";
import { AchievementWall } from "@/components/motivation/AchievementWall";
import { MotivationJournal } from "@/components/motivation/MotivationJournal";
import { VisionBoard } from "@/components/motivation/VisionBoard";
import { Sparkles, Lightbulb, Brain, Target, Rocket, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const Motivation = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch personalized motivation tips based on user data
  const { data: motivationTips } = useQuery({
    queryKey: ['motivation-tips'],
    queryFn: async () => {
      const tips = [
        {
          id: 1,
          title: "Morning Routine Impact",
          description: "Starting your day with intention sets the tone for productivity",
          icon: Lightbulb,
          color: "text-amber-500",
          bgColor: "bg-amber-50",
        },
        {
          id: 2,
          title: "Mindfulness Breaks",
          description: "Short mental breaks improve focus and reduce burnout",
          icon: Brain,
          color: "text-purple-500",
          bgColor: "bg-purple-50",
        },
        {
          id: 3,
          title: "Goal Visualization",
          description: "Regularly visualizing your goals increases achievement rates",
          icon: Target,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
        },
        {
          id: 4,
          title: "Progress Celebration",
          description: "Celebrating small wins boosts dopamine and motivation",
          icon: Rocket,
          color: "text-emerald-500",
          bgColor: "bg-emerald-50",
        },
      ];
      
      // In a real app, we would fetch personalized tips from the backend
      return tips;
    }
  });

  // Animation variants for staggered loading
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-7 w-7 text-primary" />
            Motivation Center
          </h1>
          <p className="text-muted-foreground mt-1">
            Tools to keep you motivated and focused on your wellness journey
          </p>
        </div>
        <div className="w-full md:w-auto">
          <Input
            placeholder="Search motivation resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
      </div>
      
      <motion.div 
        className="grid gap-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <DailyMotivation />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MotivationStats />
        </motion.div>
      </motion.div>

      <motion.div 
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
      >
        <AchievementWall />
      </motion.div>
      
      <motion.div 
        className="grid gap-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <motion.div variants={itemVariants}>
          <MotivationJournal />
        </motion.div>
        <motion.div variants={itemVariants}>
          <VisionBoard />
        </motion.div>
      </motion.div>

      {/* Personalized Tips Section */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Motivation Science
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {motivationTips?.map((tip) => (
                <Card key={tip.id} className={`${tip.bgColor} dark:bg-transparent dark:border-primary/20 transition-all hover:shadow-md`}>
                  <CardContent className="p-4">
                    <tip.icon className={`h-8 w-8 ${tip.color} mb-2`} />
                    <h3 className="font-medium">{tip.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {tip.description}
                    </p>
                    <Button 
                      variant="link" 
                      className={`p-0 h-auto mt-2 ${tip.color}`}
                      onClick={() => toast({
                        title: "Feature coming soon",
                        description: "Detailed motivation resources will be available soon!"
                      })}
                    >
                      Learn more
                      <ArrowUpRight className="h-3 w-3 ml-1" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Motivation;
