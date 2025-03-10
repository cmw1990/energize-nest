import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const demoData = [
  { name: 'Mon', energy: 80, focus: 65, sleep: 75 },
  { name: 'Tue', energy: 85, focus: 70, sleep: 80 },
  { name: 'Wed', energy: 75, focus: 80, sleep: 85 },
  { name: 'Thu', energy: 90, focus: 85, sleep: 70 },
  { name: 'Fri', energy: 85, focus: 75, sleep: 80 },
  { name: 'Sat', energy: 70, focus: 60, sleep: 85 },
  { name: 'Sun', energy: 80, focus: 70, sleep: 90 },
];

const Analytics = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Wellness Analytics</CardTitle>
          <CardDescription>Track your progress and insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="weekly">
            <TabsList>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
            <TabsContent value="weekly" className="space-y-6">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={demoData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="energy" stroke="#8884d8" name="Energy" />
                    <Line type="monotone" dataKey="focus" stroke="#82ca9d" name="Focus" />
                    <Line type="monotone" dataKey="sleep" stroke="#ffc658" name="Sleep" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Energy Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85%</div>
                    <p className="text-sm text-muted-foreground">+5% from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Focus Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">72%</div>
                    <p className="text-sm text-muted-foreground">+2% from last week</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sleep Quality</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">80%</div>
                    <p className="text-sm text-muted-foreground">+8% from last week</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
