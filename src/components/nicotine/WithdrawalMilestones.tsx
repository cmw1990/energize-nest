
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Trophy, Calendar, Flag, Star, Award, Clock, SmilePlus } from 'lucide-react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { MetricCard } from "@/components/ui/metric-card";

interface Milestone {
  id: string;
  title: string;
  description: string;
  day: number;
  icon: React.ReactNode;
  healthBenefit: string;
  type: 'health' | 'achievement' | 'custom';
}

export const WithdrawalMilestones = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [activeType, setActiveType] = useState<string>('all');

  // Get user's quit tracking info
  const { data: quitInfo } = useQuery({
    queryKey: ['quit-tracking', session?.user?.id, 'nicotine'],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('quit_tracking')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('substance', 'nicotine')
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching quit info:", error);
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Calculate days since quitting
  const daysSinceQuit = quitInfo ? 
    Math.ceil(Math.abs(new Date().getTime() - new Date(quitInfo.quit_date).getTime()) / (1000 * 60 * 60 * 24)) : 
    0;

  // Get user's completed milestones
  const { data: completedMilestones = [] } = useQuery({
    queryKey: ['completed-milestones', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('withdrawal_milestones')
        .select('milestone_id')
        .eq('user_id', session.user.id)
        .eq('completed', true);
      
      if (error) {
        console.error("Error fetching completed milestones:", error);
        return [];
      }
      
      return data.map(item => item.milestone_id);
    },
    enabled: !!session?.user?.id,
  });

  // Nicotine withdrawal milestones
  const milestones: Milestone[] = [
    {
      id: '20min',
      title: '20 Minutes',
      description: 'Your heart rate and blood pressure drop to normal levels.',
      day: 0.014, // fraction of a day (20 min)
      icon: <Clock />,
      healthBenefit: 'Cardiovascular function begins to improve',
      type: 'health'
    },
    {
      id: '12hr',
      title: '12 Hours',
      description: 'Carbon monoxide in your blood drops to normal levels.',
      day: 0.5,
      icon: <SmilePlus />,
      healthBenefit: 'Oxygen levels in blood normalize',
      type: 'health'
    },
    {
      id: '24hr',
      title: '24 Hours',
      description: 'Your risk of heart attack begins to decrease.',
      day: 1,
      icon: <Check />,
      healthBenefit: 'Reduced cardiac stress',
      type: 'health'
    },
    {
      id: '48hr',
      title: '48 Hours',
      description: 'Nerve endings start to regrow and your sense of taste and smell improve.',
      day: 2,
      icon: <Check />,
      healthBenefit: 'Enhanced sensory perception',
      type: 'health'
    },
    {
      id: '72hr',
      title: '72 Hours',
      description: 'Your body is nicotine-free and bronchial tubes begin to relax.',
      day: 3,
      icon: <Trophy />,
      healthBenefit: 'Breathing becomes easier',
      type: 'achievement'
    },
    {
      id: '2weeks',
      title: '2 Weeks',
      description: 'Circulation improves and lung function increases.',
      day: 14,
      icon: <Flag />,
      healthBenefit: 'Improved physical endurance',
      type: 'health'
    },
    {
      id: '1month',
      title: '1 Month',
      description: 'Many nicotine withdrawal symptoms have subsided.',
      day: 30,
      icon: <Calendar />,
      healthBenefit: 'Less coughing and shortness of breath',
      type: 'achievement'
    },
    {
      id: '3months',
      title: '3 Months',
      description: 'Your lung function has significantly improved.',
      day: 90,
      icon: <Star />,
      healthBenefit: 'Lung function increased by up to 30%',
      type: 'health'
    },
    {
      id: '6months',
      title: '6 Months',
      description: 'Coughing, sinus congestion, and shortness of breath have decreased significantly.',
      day: 180,
      icon: <Award />,
      healthBenefit: 'Reduced respiratory infections',
      type: 'achievement'
    },
    {
      id: '1year',
      title: '1 Year',
      description: 'Your risk of coronary heart disease is half that of a smoker.',
      day: 365,
      icon: <Trophy />,
      healthBenefit: 'Heart disease risk reduced by 50%',
      type: 'achievement'
    },
    {
      id: '5years',
      title: '5 Years',
      description: 'Your risk of stroke has reduced to that of a non-smoker.',
      day: 1825,
      icon: <Star />,
      healthBenefit: 'Stroke risk normalized',
      type: 'health'
    },
    {
      id: '10years',
      title: '10 Years',
      description: 'Your risk of lung cancer is half that of a smoker.',
      day: 3650,
      icon: <Award />,
      healthBenefit: 'Lung cancer risk reduced by 50%',
      type: 'achievement'
    },
    {
      id: '15years',
      title: '15 Years',
      description: 'Your risk of coronary heart disease is the same as a non-smoker.',
      day: 5475,
      icon: <Trophy />,
      healthBenefit: 'Heart disease risk normalized',
      type: 'health'
    },
  ];

  // Filter milestones by type
  const filteredMilestones = milestones.filter(milestone => 
    activeType === 'all' || milestone.type === activeType
  );

  // Count completed milestones
  const completedCount = milestones.filter(
    milestone => daysSinceQuit >= milestone.day || completedMilestones.includes(milestone.id)
  ).length;

  // Find next milestone
  const nextMilestone = milestones.find(milestone => 
    daysSinceQuit < milestone.day && !completedMilestones.includes(milestone.id)
  );

  // Calculate days until next milestone
  const daysUntilNext = nextMilestone ? Math.ceil(nextMilestone.day - daysSinceQuit) : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          icon={<Trophy className="h-4 w-4 text-yellow-500" />}
          title="Milestones Achieved"
          value={`${completedCount} / ${milestones.length}`}
          description="Your progress so far"
        />
        
        <MetricCard
          icon={<Flag className="h-4 w-4 text-blue-500" />}
          title="Next Milestone"
          value={nextMilestone ? nextMilestone.title : "All Complete!"}
          description={nextMilestone ? `In ${daysUntilNext} days` : "Congratulations!"}
        />
        
        <MetricCard
          icon={<SmilePlus className="h-4 w-4 text-green-500" />}
          title="Health Recovery"
          value={`${Math.min(Math.round((daysSinceQuit / 5475) * 100), 100)}%`}
          description="Based on health milestones"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeType === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveType('all')}
        >
          All Milestones
        </Button>
        <Button
          variant={activeType === 'health' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveType('health')}
          className="flex items-center gap-1"
        >
          <SmilePlus className="h-4 w-4" />
          Health Benefits
        </Button>
        <Button
          variant={activeType === 'achievement' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setActiveType('achievement')}
          className="flex items-center gap-1"
        >
          <Trophy className="h-4 w-4" />
          Achievements
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredMilestones.map((milestone) => {
          const isCompleted = daysSinceQuit >= milestone.day || completedMilestones.includes(milestone.id);
          const isUpcoming = !isCompleted && nextMilestone?.id === milestone.id;
          
          return (
            <Card 
              key={milestone.id} 
              className={`transition-colors ${isCompleted ? 'border-green-200 dark:border-green-900/40' : isUpcoming ? 'border-blue-200 dark:border-blue-900/40' : ''}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${isCompleted ? 'bg-green-100 dark:bg-green-900/20' : 'bg-muted'}`}>
                    <div className={`${isCompleted ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`}>
                      {milestone.icon}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{milestone.title}</h3>
                        <p className="text-sm text-muted-foreground mb-1">{milestone.description}</p>
                      </div>
                      <Badge variant={isCompleted ? "default" : isUpcoming ? "secondary" : "outline"}>
                        {isCompleted ? "Achieved" : isUpcoming ? "Upcoming" : "Future"}
                      </Badge>
                    </div>
                    
                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <SmilePlus className="h-3 w-3" />
                      Health benefit: {milestone.healthBenefit}
                    </div>
                    
                    {isUpcoming && (
                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress to milestone</span>
                          <span>{Math.round((daysSinceQuit / milestone.day) * 100)}%</span>
                        </div>
                        <Progress value={(daysSinceQuit / milestone.day) * 100} className="h-1.5" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
