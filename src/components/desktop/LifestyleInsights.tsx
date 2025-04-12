
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Activity, Brain, Clock, Heart } from 'lucide-react';

const mockData = [
  { date: '01/01', energy: 80, focus: 75, sleep: 85, mood: 70 },
  { date: '01/02', energy: 75, focus: 80, sleep: 80, mood: 75 },
  { date: '01/03', energy: 70, focus: 65, sleep: 70, mood: 65 },
  { date: '01/04', energy: 85, focus: 80, sleep: 85, mood: 80 },
  { date: '01/05', energy: 90, focus: 85, sleep: 90, mood: 85 },
  { date: '01/06', energy: 85, focus: 80, sleep: 85, mood: 80 },
  { date: '01/07', energy: 80, focus: 75, sleep: 80, mood: 75 },
];

export const LifestyleInsights = () => {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Lifestyle Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
              <Brain className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">82%</div>
            <div className="text-xs text-muted-foreground">Focus</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
              <Activity className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">78%</div>
            <div className="text-xs text-muted-foreground">Energy</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
              <Heart className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">75%</div>
            <div className="text-xs text-muted-foreground">Mood</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary mb-2">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold">7.8h</div>
            <div className="text-xs text-muted-foreground">Sleep</div>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={mockData}
            margin={{
              top: 5,
              right: 10,
              left: 0,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="energy" stroke="#8884d8" strokeWidth={2} />
            <Line type="monotone" dataKey="focus" stroke="#82ca9d" strokeWidth={2} />
            <Line type="monotone" dataKey="sleep" stroke="#ffc658" strokeWidth={2} />
            <Line type="monotone" dataKey="mood" stroke="#ff8042" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
