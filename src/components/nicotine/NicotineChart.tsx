import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Area,
  AreaChart,
  ComposedChart,
  Cell,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart3,
  PieChart,
  LineChart as LineChartIcon,
  Calendar,
  Layers,
  Activity,
  Zap,
  TrendingDown,
  TrendingUp,
  BadgeCheck,
  AlertCircle,
  Info as InfoCircle
} from "lucide-react";
import { format, subDays } from "date-fns";
import { motion } from "framer-motion";

interface NicotineChartProps {
  data: {
    date: string;
    amount: number;
    energy: number;
    mood: number;
    craving?: number;
    withdrawalScore?: number;
  }[];
  isLoading: boolean;
}

export function NicotineChart({ data, isLoading }: NicotineChartProps) {
  const [chartType, setChartType] = useState<"line" | "bar" | "area" | "composed">("line");
  const [activeSeries, setActiveSeries] = useState<"all" | "amount" | "impact" | "withdrawal">("all");
  const [timeRange, setTimeRange] = useState<"7" | "30" | "90" | "180">("30");
  const [filteredData, setFilteredData] = useState<typeof data>([]);
  const [trendData, setTrendData] = useState<{
    amountTrend: number;
    energyTrend: number;
    moodTrend: number;
  }>({ amountTrend: 0, energyTrend: 0, moodTrend: 0 });

  useEffect(() => {
    const daysAgo = parseInt(timeRange);
    const cutoffDate = subDays(new Date(), daysAgo).getTime();
    
    const filtered = data.filter(item => {
      const itemDate = new Date(item.date).getTime();
      return itemDate >= cutoffDate;
    });
    
    setFilteredData(filtered);
    
    if (filtered.length > 1) {
      const calculateTrend = (property: 'amount' | 'energy' | 'mood') => {
        const values = filtered.map(item => item[property]);
        const firstHalf = values.slice(0, Math.floor(values.length / 2));
        const secondHalf = values.slice(Math.floor(values.length / 2));
        
        const firstHalfAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
        
        return ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
      };
      
      setTrendData({
        amountTrend: calculateTrend('amount'),
        energyTrend: calculateTrend('energy'),
        moodTrend: calculateTrend('mood'),
      });
    }
  }, [data, timeRange]);

  const getTrendIcon = (trend: number, positive: boolean) => {
    if (Math.abs(trend) < 5) return null;
    
    if (trend > 0) {
      return positive ? (
        <BadgeCheck className="h-4 w-4 text-green-500" />
      ) : (
        <TrendingUp className="h-4 w-4 text-red-500" />
      );
    } else {
      return positive ? (
        <TrendingDown className="h-4 w-4 text-red-500" />
      ) : (
        <TrendingDown className="h-4 w-4 text-green-500" />
      );
    }
  };

  const formatTrendPercent = (value: number) => {
    if (Math.abs(value) < 0.1) return "0%";
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="bg-background border shadow-md">
          <CardContent className="p-3 space-y-2">
            <p className="text-sm font-medium">{label}</p>
            <div className="space-y-1">
              {payload.map((entry: any, index: number) => (
                <div key={`item-${index}`} className="flex items-center gap-2">
                  <div 
                    className="h-3 w-3 rounded-full" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {entry.name}:
                  </span>
                  <span className="text-xs font-medium">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      );
    }
  
    return null;
  };

  if (isLoading) {
    return (
      <div className="h-full">
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
          <Skeleton className="h-9 w-10" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!filteredData || filteredData.length < 2) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
        <h3 className="font-medium mb-1">Not enough data to display chart</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-md">
          Log your nicotine intake regularly to see usage trends and patterns. Try to log at least 2-3 entries for meaningful visualizations.
        </p>
      </div>
    );
  }
  
  const colors = {
    amount: "#8884d8",
    energy: "#82ca9d",
    mood: "#ffc658",
    craving: "#ff8042",
    withdrawal: "#ff3333"
  };

  const getActiveSeries = () => {
    switch (activeSeries) {
      case "amount":
        return ["amount"];
      case "impact":
        return ["energy", "mood"];
      case "withdrawal":
        return ["craving", "withdrawalScore"];
      case "all":
      default:
        return ["amount", "energy", "mood", "craving", "withdrawalScore"];
    }
  };
  
  const activeSeriesList = getActiveSeries().filter(series => 
    filteredData.some(item => item[series as keyof typeof item] !== undefined)
  );

  return (
    <div className="h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <Button
            variant={timeRange === "7" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("7")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            7 Days
          </Button>
          <Button
            variant={timeRange === "30" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("30")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            30 Days
          </Button>
          <Button
            variant={timeRange === "90" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("90")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            90 Days
          </Button>
          <Button
            variant={timeRange === "180" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("180")}
          >
            <Calendar className="mr-2 h-4 w-4" />
            6 Months
          </Button>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            size="sm"
            className="p-2"
            onClick={() => setChartType("line")}
          >
            <LineChartIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === "bar" ? "default" : "outline"}
            size="sm"
            className="p-2"
            onClick={() => setChartType("bar")}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === "area" ? "default" : "outline"}
            size="sm"
            className="p-2"
            onClick={() => setChartType("area")}
          >
            <Layers className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === "composed" ? "default" : "outline"}
            size="sm"
            className="p-2"
            onClick={() => setChartType("composed")}
          >
            <PieChart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-medium">Nicotine Usage</h3>
            {getTrendIcon(trendData.amountTrend, false)}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold">
                {filteredData.length > 0 
                  ? Math.round(filteredData.reduce((sum, item) => sum + item.amount, 0) / filteredData.length)
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">avg. per day</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${trendData.amountTrend < 0 ? 'text-green-600' : trendData.amountTrend > 0 ? 'text-red-600' : ''}`}>
                {formatTrendPercent(trendData.amountTrend)}
              </p>
              <p className="text-xs text-muted-foreground">vs. previous period</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-100 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h3 className="font-medium">Energy Level</h3>
            {getTrendIcon(trendData.energyTrend, true)}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold">
                {filteredData.length > 0 
                  ? (filteredData.reduce((sum, item) => sum + (item.energy || 0), 0) / filteredData.length).toFixed(1)
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">avg. rating (0-10)</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${trendData.energyTrend > 0 ? 'text-green-600' : trendData.energyTrend < 0 ? 'text-red-600' : ''}`}>
                {formatTrendPercent(trendData.energyTrend)}
              </p>
              <p className="text-xs text-muted-foreground">vs. previous period</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-medium">Mood</h3>
            {getTrendIcon(trendData.moodTrend, true)}
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-2xl font-bold">
                {filteredData.length > 0 
                  ? (filteredData.reduce((sum, item) => sum + (item.mood || 0), 0) / filteredData.length).toFixed(1)
                  : 0}
              </p>
              <p className="text-xs text-muted-foreground">avg. rating (0-10)</p>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${trendData.moodTrend > 0 ? 'text-green-600' : trendData.moodTrend < 0 ? 'text-red-600' : ''}`}>
                {formatTrendPercent(trendData.moodTrend)}
              </p>
              <p className="text-xs text-muted-foreground">vs. previous period</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="usage" className="mb-6">
        <TabsList className="w-full">
          <TabsTrigger 
            value="usage" 
            className="flex-1"
            onClick={() => setActiveSeries("amount")}
          >
            Usage
          </TabsTrigger>
          <TabsTrigger 
            value="impact" 
            className="flex-1"
            onClick={() => setActiveSeries("impact")}
          >
            Impact
          </TabsTrigger>
          <TabsTrigger 
            value="withdrawal" 
            className="flex-1"
            onClick={() => setActiveSeries("withdrawal")}
          >
            Withdrawal
          </TabsTrigger>
          <TabsTrigger 
            value="all" 
            className="flex-1"
            onClick={() => setActiveSeries("all")}
          >
            All
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="h-[400px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "line" && (
            <LineChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" domain={[0, 'auto']} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {activeSeriesList.includes("amount") && (
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="amount"
                  stroke={colors.amount}
                  activeDot={{ r: 8 }}
                  name="Nicotine Amount"
                />
              )}
              
              {activeSeriesList.includes("energy") && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="energy"
                  stroke={colors.energy}
                  name="Energy Impact"
                />
              )}
              
              {activeSeriesList.includes("mood") && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="mood"
                  stroke={colors.mood}
                  name="Mood Impact"
                />
              )}
              
              {activeSeriesList.includes("craving") && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="craving"
                  stroke={colors.craving}
                  name="Craving Level"
                />
              )}
              
              {activeSeriesList.includes("withdrawalScore") && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="withdrawalScore"
                  stroke={colors.withdrawal}
                  name="Withdrawal Score"
                />
              )}
            </LineChart>
          )}
          
          {chartType === "bar" && (
            <BarChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" domain={[0, 'auto']} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {activeSeriesList.includes("amount") && (
                <Bar
                  yAxisId="left"
                  dataKey="amount"
                  fill={colors.amount}
                  name="Nicotine Amount"
                />
              )}
              
              {activeSeriesList.includes("energy") && (
                <Bar
                  yAxisId="right"
                  dataKey="energy"
                  fill={colors.energy}
                  name="Energy Impact"
                />
              )}
              
              {activeSeriesList.includes("mood") && (
                <Bar
                  yAxisId="right"
                  dataKey="mood"
                  fill={colors.mood}
                  name="Mood Impact"
                />
              )}
              
              {activeSeriesList.includes("craving") && (
                <Bar
                  yAxisId="right"
                  dataKey="craving"
                  fill={colors.craving}
                  name="Craving Level"
                />
              )}
              
              {activeSeriesList.includes("withdrawalScore") && (
                <Bar
                  yAxisId="right"
                  dataKey="withdrawalScore"
                  fill={colors.withdrawal}
                  name="Withdrawal Score"
                />
              )}
            </BarChart>
          )}
          
          {chartType === "area" && (
            <AreaChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" domain={[0, 'auto']} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {activeSeriesList.includes("amount") && (
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="amount"
                  fill={`${colors.amount}80`}
                  stroke={colors.amount}
                  name="Nicotine Amount"
                />
              )}
              
              {activeSeriesList.includes("energy") && (
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="energy"
                  fill={`${colors.energy}80`}
                  stroke={colors.energy}
                  name="Energy Impact"
                />
              )}
              
              {activeSeriesList.includes("mood") && (
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="mood"
                  fill={`${colors.mood}80`}
                  stroke={colors.mood}
                  name="Mood Impact"
                />
              )}
              
              {activeSeriesList.includes("craving") && (
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="craving"
                  fill={`${colors.craving}80`}
                  stroke={colors.craving}
                  name="Craving Level"
                />
              )}
              
              {activeSeriesList.includes("withdrawalScore") && (
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="withdrawalScore"
                  fill={`${colors.withdrawal}80`}
                  stroke={colors.withdrawal}
                  name="Withdrawal Score"
                />
              )}
            </AreaChart>
          )}
          
          {chartType === "composed" && (
            <ComposedChart data={filteredData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" domain={[0, 'auto']} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              
              {activeSeriesList.includes("amount") && (
                <Bar
                  yAxisId="left"
                  dataKey="amount"
                  fill={colors.amount}
                  name="Nicotine Amount"
                />
              )}
              
              {activeSeriesList.includes("energy") && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="energy"
                  stroke={colors.energy}
                  name="Energy Impact"
                />
              )}
              
              {activeSeriesList.includes("mood") && (
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="mood"
                  stroke={colors.mood}
                  name="Mood Impact"
                />
              )}
              
              {activeSeriesList.includes("craving") && (
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="craving"
                  fill={`${colors.craving}60`}
                  stroke={colors.craving}
                  name="Craving Level"
                />
              )}
              
              {activeSeriesList.includes("withdrawalScore") && (
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="withdrawalScore"
                  fill={`${colors.withdrawal}60`}
                  stroke={colors.withdrawal}
                  name="Withdrawal Score"
                />
              )}
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </motion.div>
      
      <div className="mt-6 p-4 bg-muted/10 rounded-lg border text-sm">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <InfoCircle className="h-4 w-4 text-primary" />
          Chart Insights
        </h4>
        <p className="text-muted-foreground mb-2">
          This chart shows your nicotine usage patterns and their impact on your energy levels and mood. Track consistently to identify patterns and improve your wellness journey.
        </p>
        {trendData.amountTrend < -5 && (
          <p className="text-green-600 mt-1 flex items-center gap-1">
            <TrendingDown className="h-4 w-4" /> 
            Great progress! Your nicotine consumption has decreased by {Math.abs(trendData.amountTrend).toFixed(1)}% compared to the previous period.
          </p>
        )}
        {trendData.energyTrend > 5 && (
          <p className="text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> 
            Your energy levels have increased by {trendData.energyTrend.toFixed(1)}% compared to the previous period.
          </p>
        )}
        {trendData.moodTrend > 5 && (
          <p className="text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> 
            Your mood has improved by {trendData.moodTrend.toFixed(1)}% compared to the previous period.
          </p>
        )}
      </div>
    </div>
  );
}
