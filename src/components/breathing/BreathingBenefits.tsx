
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Brain, 
  Heart,
  HeartPulse,
  Zap,
  ThermometerSnowflake,
  Dumbbell,
  Clock,
  Sparkles,
  BrainCircuit,
  GraduationCap,
  FlaskConical
} from 'lucide-react';

export const BreathingBenefits = () => {
  const benefits = [
    {
      title: "Stress Reduction",
      description: "Activates your parasympathetic nervous system to reduce stress hormones",
      icon: <ThermometerSnowflake className="h-5 w-5 text-blue-500" />,
      color: "blue"
    },
    {
      title: "Better Sleep",
      description: "Calming breathing patterns help you fall asleep faster and sleep more deeply",
      icon: <Clock className="h-5 w-5 text-indigo-500" />,
      color: "indigo"
    },
    {
      title: "Improved Focus",
      description: "Increases oxygen to your brain for better concentration and mental clarity",
      icon: <Brain className="h-5 w-5 text-violet-500" />,
      color: "violet"
    },
    {
      title: "Energy Boost",
      description: "Energizing breathing techniques increase alertness and vitality",
      icon: <Zap className="h-5 w-5 text-amber-500" />,
      color: "amber"
    },
    {
      title: "Better Digestion",
      description: "Promotes parasympathetic state that supports digestive function",
      icon: <Heart className="h-5 w-5 text-green-500" />,
      color: "green"
    },
    {
      title: "Lower Blood Pressure",
      description: "Regular practice can contribute to healthier blood pressure levels",
      icon: <HeartPulse className="h-5 w-5 text-red-500" />,
      color: "red"
    },
    {
      title: "Stronger Immunity",
      description: "Reduces inflammation and supports immune system function",
      icon: <Dumbbell className="h-5 w-5 text-emerald-500" />,
      color: "emerald"
    },
    {
      title: "Emotional Balance",
      description: "Helps regulate emotions and respond more calmly to challenges",
      icon: <Sparkles className="h-5 w-5 text-purple-500" />,
      color: "purple"
    },
    {
      title: "Brain Health",
      description: "Increases neuroplasticity and supports cognitive function",
      icon: <BrainCircuit className="h-5 w-5 text-cyan-500" />,
      color: "cyan"
    },
    {
      title: "Habit Formation",
      description: "Creates a foundation for other mindfulness and wellness practices",
      icon: <GraduationCap className="h-5 w-5 text-teal-500" />,
      color: "teal"
    },
    {
      title: "Respiratory Strength",
      description: "Strengthens diaphragm and intercostal muscles for better breathing capacity",
      icon: <FlaskConical className="h-5 w-5 text-pink-500" />,
      color: "pink"
    },
    {
      title: "Longevity",
      description: "Associated with longer telomeres and cellular health markers",
      icon: <Clock className="h-5 w-5 text-orange-500" />,
      color: "orange"
    }
  ];

  const getCardStyle = (color: string) => {
    const styles = {
      blue: "from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10",
      indigo: "from-indigo-50 to-indigo-100/50 dark:from-indigo-900/20 dark:to-indigo-800/10",
      violet: "from-violet-50 to-violet-100/50 dark:from-violet-900/20 dark:to-violet-800/10",
      amber: "from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10",
      green: "from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/10",
      red: "from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/10",
      emerald: "from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10",
      purple: "from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/10",
      cyan: "from-cyan-50 to-cyan-100/50 dark:from-cyan-900/20 dark:to-cyan-800/10",
      teal: "from-teal-50 to-teal-100/50 dark:from-teal-900/20 dark:to-teal-800/10",
      pink: "from-pink-50 to-pink-100/50 dark:from-pink-900/20 dark:to-pink-800/10",
      orange: "from-orange-50 to-orange-100/50 dark:from-orange-900/20 dark:to-orange-800/10"
    };
    
    return `bg-gradient-to-br ${styles[color]}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {benefits.map((benefit, index) => (
        <Card 
          key={index} 
          className={`border-0 shadow-sm transition-all hover:shadow-md ${getCardStyle(benefit.color)}`}
        >
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="rounded-full bg-white/50 dark:bg-black/10 p-3 mb-4">
              {benefit.icon}
            </div>
            <h3 className="font-medium text-lg mb-2">{benefit.title}</h3>
            <p className="text-sm text-muted-foreground">{benefit.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
