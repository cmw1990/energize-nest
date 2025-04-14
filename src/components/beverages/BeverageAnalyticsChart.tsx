
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  TooltipProps
} from "recharts";
import { WeeklyData } from "@/types/beverages";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Droplet, Coffee, Wine, CircleDollarSign } from "lucide-react";
import { AxisDomain } from "recharts/types/util/types";

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <Card className="border shadow-sm">
        <CardContent className="p-3 space-y-2">
          <p className="font-medium">{label}</p>
          {payload.map((entry) => (
            <p key={entry.name} className="text-sm flex items-center gap-1" style={{ color: entry.color }}>
              {entry.name === "Water" && <Droplet className="h-3 w-3" />}
              {entry.name === "Caffeine" && <Coffee className="h-3 w-3" />}
              {entry.name === "Alcohol" && <Wine className="h-3 w-3" />}
              {entry.name === "Calories" && <CircleDollarSign className="h-3 w-3" />}
              <span className="font-medium">{entry.name}: </span>
              <span>
                {entry.value}
                {entry.name === "Water" && "ml"}
                {entry.name === "Caffeine" && "mg"}
                {entry.name === "Alcohol" && "g"}
                {entry.name === "Calories" && " cal"}
              </span>
            </p>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  return null;
};

export function BeverageAnalyticsChart({ data }: { data: WeeklyData[] }) {
  const [view, setView] = useState("water");
  
  const getYAxisDomain = (): AxisDomain => {
    switch (view) {
      case "water":
        return [0, 'auto'];
      case "caffeine":
        return [0, 400]; // Max recommended caffeine
      case "alcohol":
        return [0, 'auto'];
      case "calories":
        return [0, 'auto'];
      default:
        return [0, 'auto'];
    }
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue={view} value={view} onValueChange={setView}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="water" className="flex items-center gap-1.5">
            <Droplet className="h-4 w-4" />
            <span>Water</span>
          </TabsTrigger>
          <TabsTrigger value="caffeine" className="flex items-center gap-1.5">
            <Coffee className="h-4 w-4" />
            <span>Caffeine</span>
          </TabsTrigger>
          <TabsTrigger value="alcohol" className="flex items-center gap-1.5">
            <Wine className="h-4 w-4" />
            <span>Alcohol</span>
          </TabsTrigger>
          <TabsTrigger value="calories" className="flex items-center gap-1.5">
            <CircleDollarSign className="h-4 w-4" />
            <span>Calories</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="water" className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={getYAxisDomain()} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="water" name="Water" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="caffeine" className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={getYAxisDomain()} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="caffeine" name="Caffeine" fill="#92400e" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="alcohol" className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={getYAxisDomain()} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="alcohol" name="Alcohol" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        
        <TabsContent value="calories" className="mt-4 h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" />
              <YAxis domain={getYAxisDomain()} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="calories" name="Calories" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
}
