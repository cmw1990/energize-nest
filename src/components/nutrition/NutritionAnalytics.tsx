import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { 
  AreaChart, Area, RadialBarChart, RadialBar, XAxis, YAxis, CartesianGrid, 
  ResponsiveContainer, Legend, Tooltip as RechartsTooltip
} from 'recharts';
import { Activity, TrendingUp, BarChart2, PieChartIcon, Target, Clock } from 'lucide-react';
import { NutritionData, NutritionGoal } from '@/types/nutrition';
import { cn } from '@/lib/utils';

interface NutritionAnalyticsProps {
  nutritionData: NutritionData;
  dailyGoal: NutritionGoal;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-emerald-500';
  if (score >= 70) return 'text-blue-500';
  if (score >= 50) return 'text-yellow-500';
  return 'text-red-500';
};

const calculateNutritionScore = () => 82;
const calculateMacroScore = () => 85;
const calculateMicroScore = () => 75;
const calculateMealTimingScore = () => 90;
const calculateBalanceScore = () => 80;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-background border rounded-md shadow-lg p-3 text-sm">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <p>{`${entry.name}: ${Math.round(entry.value)}${entry.unit || ''}`}</p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const NutritionAnalytics: React.FC<NutritionAnalyticsProps> = ({ nutritionData, dailyGoal }) => {
  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-gradient-to-r from-green-500 to-emerald-600';
    if (value >= 70) return 'bg-gradient-to-r from-blue-500 to-indigo-600';
    if (value >= 50) return 'bg-gradient-to-r from-yellow-500 to-amber-600';
    return 'bg-gradient-to-r from-red-500 to-rose-600';
  };

  const nutritionScore = calculateNutritionScore();
  const scores = {
    macros: calculateMacroScore(),
    micros: calculateMicroScore(),
    timing: calculateMealTimingScore(),
    balance: calculateBalanceScore()
  };

  const scoreData = [
    { name: 'Overall', value: nutritionScore },
    { name: 'Macros', value: scores.macros },
    { name: 'Micros', value: scores.micros },
    { name: 'Timing', value: scores.timing },
    { name: 'Balance', value: scores.balance }
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Nutrition Analytics</CardTitle>
                <CardDescription>Track and analyze your nutritional balance</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <motion.div 
                        className={cn("flex items-center gap-2 px-4 py-2 rounded-full", getProgressColor(nutritionScore))}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Target className="h-5 w-5 text-white" />
                        <span className="text-xl font-bold text-white">{nutritionScore}</span>
                      </motion.div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium mb-2">Nutrition Score Breakdown</p>
                      <div className="space-y-1">
                        {Object.entries(scores).map(([key, value]) => (
                          <div key={key} className="flex items-center justify-between gap-2">
                            <span className="capitalize">{key}</span>
                            <span className={cn("font-medium", getScoreColor(value))}>
                              {value}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />Overview
                </TabsTrigger>
                <TabsTrigger value="macros" className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />Macros
                </TabsTrigger>
                <TabsTrigger value="micros" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />Micros
                </TabsTrigger>
                <TabsTrigger value="trends" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />Trends
                </TabsTrigger>
                <TabsTrigger value="timing" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />Timing
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent value="overview">
                  <motion.div variants={containerVariants} initial="hidden" animate="show" exit="hidden" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div variants={itemVariants}>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Score Distribution</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <RadialBarChart 
                                innerRadius="10%" 
                                outerRadius="80%" 
                                data={scoreData}
                                startAngle={90}
                                endAngle={-270}
                              >
                                <RadialBar
                                  dataKey="value"
                                  background={{ fill: '#f5f5f5' }}
                                />
                                <Legend />
                                <RechartsTooltip content={<CustomTooltip />} />
                              </RadialBarChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div variants={itemVariants}>
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-base">Daily Progress</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                              <AreaChart data={nutritionData.weeklyData}>
                                <defs>
                                  <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                                  </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Area
                                  type="monotone"
                                  dataKey="calories"
                                  stroke="#3B82F6"
                                  fillOpacity={1}
                                  fill="url(#colorCalories)"
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};
