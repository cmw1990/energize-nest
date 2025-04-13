
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Clock, AlertTriangle, BatteryFull, Brain, Info } from 'lucide-react';
import { MetricCard } from "@/components/ui/metric-card";

interface WithdrawalMilestone {
  day: number;
  title: string;
  description: string;
  category: 'physical' | 'mental' | 'achievement';
  icon: React.ReactNode;
}

interface WithdrawalTimelineProps {
  daysSinceQuit?: number;
  substance?: string;
}

export const WithdrawalTimeline: React.FC<WithdrawalTimelineProps> = ({ 
  daysSinceQuit = 0, 
  substance = 'nicotine' 
}) => {
  // Nicotine withdrawal timeline milestones
  const nicotineMilestones: WithdrawalMilestone[] = [
    {
      day: 1,
      title: "First Day Completed",
      description: "Nicotine levels have dropped significantly. You may experience irritability and cravings.",
      category: 'physical',
      icon: <Clock className="h-5 w-5 text-orange-500" />,
    },
    {
      day: 2,
      title: "Peak Withdrawal",
      description: "Physical withdrawal symptoms peak. Headaches and anxiety may be strong.",
      category: 'physical',
      icon: <AlertTriangle className="h-5 w-5 text-orange-500" />,
    },
    {
      day: 3,
      title: "Nicotine-Free Body",
      description: "Your body is now completely free of nicotine. Cravings may still be intense.",
      category: 'achievement',
      icon: <Check className="h-5 w-5 text-green-500" />,
    },
    {
      day: 7,
      title: "One Week Milestone",
      description: "Physical withdrawal symptoms begin to decrease. Breathing is improving.",
      category: 'achievement',
      icon: <Check className="h-5 w-5 text-green-500" />,
    },
    {
      day: 14,
      title: "Two Weeks Milestone",
      description: "Circulation improves. Lung function begins to improve.",
      category: 'physical',
      icon: <BatteryFull className="h-5 w-5 text-blue-500" />,
    },
    {
      day: 21,
      title: "Three Weeks Milestone",
      description: "The habit of smoking has been broken. Cravings become less frequent.",
      category: 'mental',
      icon: <Brain className="h-5 w-5 text-purple-500" />,
    },
    {
      day: 30,
      title: "One Month Milestone",
      description: "Your lungs are healing. Coughing and shortness of breath decrease.",
      category: 'achievement',
      icon: <Check className="h-5 w-5 text-green-500" />,
    },
    {
      day: 90,
      title: "Three Months Milestone",
      description: "Circulation has substantially improved. Lung function increased up to 30%.",
      category: 'physical',
      icon: <BatteryFull className="h-5 w-5 text-blue-500" />,
    },
    {
      day: 180,
      title: "Six Months Milestone",
      description: "Withdrawal symptoms mostly gone. Lungs are significantly cleaner.",
      category: 'achievement',
      icon: <Check className="h-5 w-5 text-green-500" />,
    },
    {
      day: 365,
      title: "One Year Milestone",
      description: "Risk of heart disease has dropped to half that of a smoker.",
      category: 'achievement',
      icon: <Check className="h-5 w-5 text-green-500" />,
    },
  ];

  // Get milestones based on the substance
  const milestones = substance === 'nicotine' ? nicotineMilestones : nicotineMilestones;

  // Find the next milestone
  const nextMilestone = milestones.find(milestone => milestone.day > daysSinceQuit);
  const nextMilestoneIndex = nextMilestone ? milestones.indexOf(nextMilestone) : milestones.length;
  
  // Calculate progress to next milestone
  const previousMilestoneDay = nextMilestoneIndex > 0 ? milestones[nextMilestoneIndex - 1].day : 0;
  const daysUntilNextMilestone = nextMilestone ? nextMilestone.day - daysSinceQuit : 0;
  const totalDaysToNextMilestone = nextMilestone ? nextMilestone.day - previousMilestoneDay : 0;
  const progressToNextMilestone = totalDaysToNextMilestone > 0 
    ? ((totalDaysToNextMilestone - daysUntilNextMilestone) / totalDaysToNextMilestone) * 100
    : 100;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          title="Days Since Quitting"
          value={daysSinceQuit}
          description="Your journey to fresh"
        />
        
        {nextMilestone ? (
          <MetricCard 
            icon={nextMilestone.icon}
            title="Next Milestone"
            value={`Day ${nextMilestone.day}`}
            description={nextMilestone.title}
          />
        ) : (
          <MetricCard 
            icon={<Check className="h-4 w-4 text-green-500" />}
            title="Status"
            value="All Milestones Reached"
            description="Incredible achievement!"
          />
        )}
        
        <MetricCard 
          icon={<Brain className="h-4 w-4 text-purple-500" />}
          title="Mental Recovery"
          value={daysSinceQuit >= 30 ? "Significant" : daysSinceQuit >= 14 ? "In Progress" : "Early Stage"}
          description="Psychological healing"
        />
        
        <MetricCard 
          icon={<BatteryFull className="h-4 w-4 text-blue-500" />}
          title="Physical Recovery"
          value={Math.min(Math.round((daysSinceQuit / 90) * 100), 100) + "%"}
          description="Body restoration progress"
        />
      </div>
      
      {nextMilestone && (
        <Card className="bg-muted/50">
          <CardContent className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Progress to next milestone</h3>
              <span className="text-xs text-muted-foreground">
                {totalDaysToNextMilestone - daysUntilNextMilestone} of {totalDaysToNextMilestone} days
              </span>
            </div>
            <Progress value={progressToNextMilestone} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {daysUntilNextMilestone} days until {nextMilestone.title}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="relative">
        <div className="absolute left-5 top-0 h-full w-0.5 bg-muted-foreground/20"></div>
        <div className="space-y-8 pt-2">
          {milestones.map((milestone, index) => (
            <div key={milestone.day} className="relative ml-10">
              <div className={`absolute -left-14 flex h-8 w-8 items-center justify-center rounded-full ${daysSinceQuit >= milestone.day ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'}`}>
                {daysSinceQuit >= milestone.day ? (
                  <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                ) : (
                  <span className="text-xs font-medium text-muted-foreground">
                    {milestone.day}
                  </span>
                )}
              </div>
              <Card className={`${daysSinceQuit >= milestone.day ? 'border-green-200 dark:border-green-900/50' : 'border-muted'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-sm">Day {milestone.day}: {milestone.title}</h3>
                    <Badge variant={daysSinceQuit >= milestone.day ? "default" : "outline"}>
                      {daysSinceQuit >= milestone.day ? "Achieved" : "Upcoming"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{milestone.description}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
      
      <Card className="border border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10">
        <CardContent className="p-4 flex gap-2">
          <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-medium text-blue-700 dark:text-blue-400">Everyone's Journey is Different</h3>
            <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
              This timeline represents average withdrawal experiences. Your personal journey may vary depending on your history with {substance}, your overall health, and your unique body chemistry.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
