import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { addEnergyMetric, getEnergyMetrics } from '@/lib/api';
import { useUser } from '@/hooks/useUser';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function SleepTracker() {
  const { user } = useUser();
  const [sleepData, setSleepData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [sleepQuality, setSleepQuality] = React.useState(80);

  React.useEffect(() => {
    if (user) {
      loadSleepData();
    }
  }, [user]);

  const loadSleepData = async () => {
    try {
      const data = await getEnergyMetrics(user!.id);
      setSleepData(data.filter(metric => metric.type === 'sleep'));
    } catch (error) {
      console.error('Error loading sleep data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addEnergyMetric({
        user_id: user.id,
        type: 'sleep',
        value: sleepQuality,
        notes: `Sleep quality tracked: ${sleepQuality}/100`,
        timestamp: new Date().toISOString()
      });
      loadSleepData();
    } catch (error) {
      console.error('Error saving sleep data:', error);
    }
  };

  if (loading) {
    return <div>Loading sleep data...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sleep Quality Tracker</CardTitle>
          <CardDescription>Monitor your sleep quality</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Sleep Quality</Label>
              <Slider
                value={[sleepQuality]}
                onValueChange={([value]) => setSleepQuality(value)}
                min={0}
                max={100}
                step={1}
              />
              <div className="text-sm text-gray-500">
                {sleepQuality} / 100
              </div>
            </div>

            <Button type="submit">Log Sleep Quality</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sleep History</CardTitle>
          <CardDescription>Your sleep quality over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sleepData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(time) => new Date(time).toLocaleDateString()}
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  name="Sleep Quality"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
