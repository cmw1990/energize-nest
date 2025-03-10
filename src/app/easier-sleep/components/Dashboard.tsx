import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { dbClient } from '@/lib/db-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Moon, Battery, BarChart } from 'lucide-react';

interface SleepStats {
  averageSleepDuration: number;
  sleepScore: number;
  sleepDebt: number;
  sleepEfficiency: number;
}

interface DashboardProps {
  session: Session | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  const [stats, setStats] = useState<SleepStats>({
    averageSleepDuration: 0,
    sleepScore: 0,
    sleepDebt: 0,
    sleepEfficiency: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSleepStats = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await dbClient
          .from('sleep_stats')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching sleep stats:', error);
          return;
        }

        if (data) {
          setStats({
            averageSleepDuration: data.average_sleep_duration || 7.2,
            sleepScore: data.sleep_score || 82,
            sleepDebt: data.sleep_debt || 1.5,
            sleepEfficiency: data.sleep_efficiency || 92
          });
        } else {
          // Use placeholders for new users
          setStats({
            averageSleepDuration: 7.2,
            sleepScore: 82,
            sleepDebt: 1.5,
            sleepEfficiency: 92
          });
        }
      } catch (err) {
        console.error('Error in sleep stats fetching:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSleepStats();
  }, [session]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading sleep data...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sleep Dashboard</h2>
        <p className="text-muted-foreground">
          Your sleep insights and recommendations for better rest.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Sleep
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageSleepDuration} hrs</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days average
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sleep Score
            </CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sleepScore}/100</div>
            <Progress value={stats.sleepScore} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sleep Debt
            </CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sleepDebt} hrs</div>
            <p className="text-xs text-muted-foreground">
              Try to reduce below 1 hour
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Sleep Efficiency
            </CardTitle>
            <Moon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sleepEfficiency}%</div>
            <Progress value={stats.sleepEfficiency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sleep Recommendations</CardTitle>
            <CardDescription>
              Personalized tips based on your sleep patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex items-start space-x-2">
                <div className="rounded-full bg-blue-100 p-1">
                  <Moon className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Consistent bedtime</p>
                  <p className="text-sm text-gray-500">Try to go to bed at 10:30 PM each night to regulate your circadian rhythm.</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="rounded-full bg-blue-100 p-1">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Screen time</p>
                  <p className="text-sm text-gray-500">Reduce screen exposure 1 hour before bedtime to improve sleep quality.</p>
                </div>
              </li>
              <li className="flex items-start space-x-2">
                <div className="rounded-full bg-blue-100 p-1">
                  <Battery className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Sleep debt reduction</p>
                  <p className="text-sm text-gray-500">Add 20 minutes to your sleep time for the next week to reduce sleep debt.</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Tonight's Sleep Plan</CardTitle>
            <CardDescription>
              Your personalized schedule for optimal rest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-amber-100 text-amber-800 rounded-full p-1">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Wind Down</span>
                </div>
                <span>9:30 PM</span>
              </div>
              
              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-indigo-100 text-indigo-800 rounded-full p-1">
                    <Moon className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Bedtime</span>
                </div>
                <span>10:30 PM</span>
              </div>

              <div className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center space-x-2">
                  <div className="bg-green-100 text-green-800 rounded-full p-1">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <span className="font-medium">Wake Up</span>
                </div>
                <span>6:30 AM</span>
              </div>

              <button className="w-full mt-4 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors">
                Start Sleep Session
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
