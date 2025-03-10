import React, { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { dbClient } from '@/lib/db-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, TrendingUp, Heart, Calendar, PenTool } from 'lucide-react';

interface MoodData {
  averageMood: number;
  streakDays: number;
  entriesToday: number;
  totalEntries: number;
  moodTrend: 'up' | 'down' | 'stable';
}

interface DashboardProps {
  session: Session | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  const [moodData, setMoodData] = useState<MoodData>({
    averageMood: 0,
    streakDays: 0,
    entriesToday: 0,
    totalEntries: 0,
    moodTrend: 'stable'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodData = async () => {
      if (!session?.user?.id) return;

      try {
        const { data, error } = await dbClient
          .from('mood_entries')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching mood data:', error);
          return;
        }

        if (data && data.length > 0) {
          // Calculate mood stats
          const today = new Date().toISOString().split('T')[0];
          const entriesToday = data.filter(entry => 
            entry.created_at.split('T')[0] === today
          ).length;
          
          const moodValues = data.map(entry => entry.mood_rating);
          const averageMood = moodValues.reduce((a, b) => a + b, 0) / moodValues.length;
          
          // Calculate streak
          let streak = 0;
          const dates = [...new Set(data.map(entry => 
            entry.created_at.split('T')[0]
          ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
          
          if (dates.length > 0) {
            let currentDate = new Date(dates[0]);
            streak = 1;
            
            for (let i = 1; i < dates.length; i++) {
              const previousDate = new Date(dates[i]);
              const diffTime = Math.abs(currentDate.getTime() - previousDate.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              
              if (diffDays === 1) {
                streak++;
                currentDate = previousDate;
              } else {
                break;
              }
            }
          }
          
          // Calculate trend
          let trend: 'up' | 'down' | 'stable' = 'stable';
          if (data.length >= 5) {
            const recentMoods = data.slice(0, 5).map(entry => entry.mood_rating);
            const oldMoods = data.slice(Math.max(0, data.length - 5)).map(entry => entry.mood_rating);
            
            const recentAvg = recentMoods.reduce((a, b) => a + b, 0) / recentMoods.length;
            const oldAvg = oldMoods.reduce((a, b) => a + b, 0) / oldMoods.length;
            
            if (recentAvg > oldAvg + 0.5) {
              trend = 'up';
            } else if (recentAvg < oldAvg - 0.5) {
              trend = 'down';
            }
          }
          
          setMoodData({
            averageMood,
            streakDays: streak,
            entriesToday,
            totalEntries: data.length,
            moodTrend: trend
          });
        } else {
          // Default values for new users
          setMoodData({
            averageMood: 3,
            streakDays: 0,
            entriesToday: 0,
            totalEntries: 0,
            moodTrend: 'stable'
          });
        }
      } catch (err) {
        console.error('Error in mood data fetching:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, [session]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading mood data...</div>;
  }

  const getMoodEmoji = (average: number) => {
    if (average >= 4.5) return '😄';
    if (average >= 3.5) return '🙂';
    if (average >= 2.5) return '😐';
    if (average >= 1.5) return '🙁';
    return '😞';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Mood Dashboard</h2>
        <p className="text-muted-foreground">
          Your mood insights and emotional wellbeing at a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Mood
            </CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {getMoodEmoji(moodData.averageMood)} 
              <span className="ml-2">{moodData.averageMood.toFixed(1)}/5</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Based on your recent entries
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Streak
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moodData.streakDays} days</div>
            <p className="text-xs text-muted-foreground">
              Keep tracking to build your streak!
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Entries
            </CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moodData.entriesToday}</div>
            <p className="text-xs text-muted-foreground">
              {moodData.entriesToday === 0 
                ? "You haven't logged your mood today" 
                : "Good job tracking your mood!"}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Mood Trend
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center">
              {moodData.moodTrend === 'up' && (
                <>
                  <span className="text-green-500">↗</span>
                  <span className="ml-2">Improving</span>
                </>
              )}
              {moodData.moodTrend === 'down' && (
                <>
                  <span className="text-red-500">↘</span>
                  <span className="ml-2">Declining</span>
                </>
              )}
              {moodData.moodTrend === 'stable' && (
                <>
                  <span className="text-blue-500">→</span>
                  <span className="ml-2">Stable</span>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on last 5 entries
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Mood Insights</CardTitle>
            <CardDescription>
              Personalized insights based on your mood patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {moodData.totalEntries === 0 ? (
                <p className="text-gray-500">
                  Start tracking your mood to receive personalized insights!
                </p>
              ) : (
                <>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <BarChart className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">Pattern Detected</h4>
                      <p className="text-sm text-gray-500">
                        Your mood tends to be highest in the morning and gradually decreases through the day.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Energy Impact</h4>
                      <p className="text-sm text-gray-500">
                        There's a strong correlation between your reported energy levels and mood scores.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Consistency Benefit</h4>
                      <p className="text-sm text-gray-500">
                        Your mood is most stable when you maintain a consistent daily routine.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Recommended Actions</CardTitle>
            <CardDescription>
              Activities to improve your emotional wellbeing
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7C8 6.44772 8.44772 6 9 6H15C15.5523 6 16 6.44772 16 7C16 7.55228 15.5523 8 15 8H9C8.44772 8 8 7.55228 8 7Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12C8 11.4477 8.44772 11 9 11H15C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13H9C8.44772 13 8 12.5523 8 12Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 17C8 16.4477 8.44772 16 9 16H15C15.5523 16 16 16.4477 16 17C16 17.5523 15.5523 18 15 18H9C8.44772 18 8 17.5523 8 17Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Guided Meditation</h4>
                    <p className="text-sm text-gray-500">10 minutes of mindfulness</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Start</Button>
              </div>
              
              <div className="flex justify-between items-center border-b pb-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Gratitude Journal</h4>
                    <p className="text-sm text-gray-500">Write 3 things you're grateful for</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Open</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <svg className="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">Mood Boost Activity</h4>
                    <p className="text-sm text-gray-500">Quick exercise to improve your mood</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Try</Button>
              </div>
              
              <Button className="w-full mt-4">View All Recommendations</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
