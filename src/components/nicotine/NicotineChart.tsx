
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Bar, BarChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoIcon } from "lucide-react";

interface NicotineChartProps {
  data: any[];
  isLoading?: boolean;
}

export const NicotineChart: React.FC<NicotineChartProps> = ({ data, isLoading = false }) => {
  const [activeTab, setActiveTab] = React.useState('amount');

  if (isLoading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="amount">Nicotine</TabsTrigger>
          <TabsTrigger value="energy">Energy Impact</TabsTrigger>
          <TabsTrigger value="mood">Mood Impact</TabsTrigger>
          <TabsTrigger value="craving">Cravings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="amount" className="pt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  label={{ value: 'mg', angle: -90, position: 'insideLeft' }} 
                  domain={[0, 'dataMax + 5']}
                />
                <Tooltip formatter={(value) => [`${value} mg`, 'Nicotine']} />
                <Area 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#ff6b6b" 
                  fill="#ff6b6b" 
                  fillOpacity={0.3}
                  activeDot={{ r: 8 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="energy" className="pt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  label={{ value: 'Impact (1-10)', angle: -90, position: 'insideLeft' }} 
                  domain={[0, 10]}
                />
                <Tooltip formatter={(value) => [`${value}/10`, 'Energy Impact']} />
                <Bar 
                  dataKey="energy" 
                  fill="#4dabf7" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="mood" className="pt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  label={{ value: 'Impact (1-10)', angle: -90, position: 'insideLeft' }} 
                  domain={[0, 10]}
                />
                <Tooltip formatter={(value) => [`${value}/10`, 'Mood Impact']} />
                <Bar 
                  dataKey="mood" 
                  fill="#63e6be" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
        
        <TabsContent value="craving" className="pt-4">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis 
                  label={{ value: 'Level (1-10)', angle: -90, position: 'insideLeft' }} 
                  domain={[0, 10]}
                />
                <Tooltip formatter={(value) => [`${value}/10`, 'Craving Level']} />
                <Area 
                  type="monotone" 
                  dataKey="craving" 
                  stroke="#ffa94d" 
                  fill="#ffa94d" 
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <InfoIcon className="h-4 w-4" />
        <p>
          Charts show the relationship between nicotine consumption and its effects on energy, mood, and cravings over time.
        </p>
      </div>
    </div>
  );
};
