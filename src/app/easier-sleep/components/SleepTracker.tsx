import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { dbClient } from '@/lib/db-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Clock, Moon, Plus, Save } from 'lucide-react';

interface SleepTrackerProps {
  session: Session | null;
}

export const SleepTracker: React.FC<SleepTrackerProps> = ({ session }) => {
  const [date, setDate] = useState<Date>(new Date());
  const [bedtime, setBedtime] = useState<string>("22:00");
  const [wakeTime, setWakeTime] = useState<string>("06:30");
  const [sleepQuality, setSleepQuality] = useState<number>(4);
  const [notes, setNotes] = useState<string>("");
  const [saving, setSaving] = useState(false);
  
  const handleSaveSleepEntry = async () => {
    if (!session?.user?.id) return;
    
    setSaving(true);
    
    try {
      // Calculate sleep duration in hours
      const bedtimeHours = parseInt(bedtime.split(':')[0]);
      const bedtimeMinutes = parseInt(bedtime.split(':')[1]);
      const wakeHours = parseInt(wakeTime.split(':')[0]);
      const wakeMinutes = parseInt(wakeTime.split(':')[1]);
      
      // Handle cases where sleep crosses midnight
      let sleepDuration = wakeHours - bedtimeHours + (wakeMinutes - bedtimeMinutes) / 60;
      if (sleepDuration < 0) {
        sleepDuration += 24;
      }
      
      const formattedDate = date.toISOString().split('T')[0];
      
      const { error } = await dbClient
        .from('sleep_entries')
        .upsert({
          user_id: session.user.id,
          date: formattedDate,
          bedtime,
          wake_time: wakeTime,
          sleep_duration: sleepDuration,
          sleep_quality: sleepQuality,
          notes,
          created_at: new Date().toISOString()
        }, { 
          onConflict: 'user_id,date' 
        });
      
      if (error) {
        console.error('Error saving sleep entry:', error);
        alert('Failed to save sleep data. Please try again.');
        return;
      }
      
      alert('Sleep data saved successfully!');
      
    } catch (err) {
      console.error('Error in saving sleep entry:', err);
      alert('An error occurred while saving your sleep data.');
    } finally {
      setSaving(false);
    }
  };
  
  const qualityOptions = [
    { value: 1, label: "Poor" },
    { value: 2, label: "Fair" },
    { value: 3, label: "Good" },
    { value: 4, label: "Very Good" },
    { value: 5, label: "Excellent" }
  ];
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Sleep Tracker</h2>
        <p className="text-muted-foreground">
          Record and analyze your sleep patterns
        </p>
      </div>
      
      <Tabs defaultValue="log">
        <TabsList className="mb-4">
          <TabsTrigger value="log">Log Sleep</TabsTrigger>
          <TabsTrigger value="history">Sleep History</TabsTrigger>
          <TabsTrigger value="trends">Sleep Trends</TabsTrigger>
        </TabsList>
        
        <TabsContent value="log">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Log Sleep</CardTitle>
                <CardDescription>
                  Record your sleep details for better tracking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="border rounded-md p-2">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        disabled={(date) => date > new Date()}
                        className="mx-auto"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bedtime">Bedtime</Label>
                      <div className="flex items-center space-x-2">
                        <Moon className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="bedtime"
                          type="time"
                          value={bedtime}
                          onChange={(e) => setBedtime(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="wake-time">Wake Time</Label>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          id="wake-time"
                          type="time"
                          value={wakeTime}
                          onChange={(e) => setWakeTime(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sleep Quality</Label>
                    <div className="flex space-x-2">
                      {qualityOptions.map((option) => (
                        <Button
                          key={option.value}
                          type="button"
                          variant={sleepQuality === option.value ? "default" : "outline"}
                          className="flex-1"
                          onClick={() => setSleepQuality(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <textarea
                      id="notes"
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      placeholder="Any factors that affected your sleep..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  
                  <Button 
                    type="button" 
                    className="w-full"
                    disabled={saving}
                    onClick={handleSaveSleepEntry}
                  >
                    {saving ? 'Saving...' : 'Save Sleep Entry'}
                    <Save className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sleep Summary</CardTitle>
                <CardDescription>
                  Based on your recorded sleep patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Estimated Sleep Duration</h4>
                    <div className="flex items-end space-x-2">
                      <h2 className="text-3xl font-bold">
                        {(() => {
                          const bedtimeHours = parseInt(bedtime.split(':')[0]);
                          const bedtimeMinutes = parseInt(bedtime.split(':')[1]);
                          const wakeHours = parseInt(wakeTime.split(':')[0]);
                          const wakeMinutes = parseInt(wakeTime.split(':')[1]);
                          
                          let sleepDuration = wakeHours - bedtimeHours + (wakeMinutes - bedtimeMinutes) / 60;
                          if (sleepDuration < 0) sleepDuration += 24;
                          
                          return sleepDuration.toFixed(1);
                        })()}
                      </h2>
                      <p className="text-xl">hours</p>
                    </div>
                    
                    {(() => {
                      const bedtimeHours = parseInt(bedtime.split(':')[0]);
                      const wakeHours = parseInt(wakeTime.split(':')[0]);
                      const bedtimeMinutes = parseInt(bedtime.split(':')[1]);
                      const wakeMinutes = parseInt(wakeTime.split(':')[1]);
                      
                      let sleepDuration = wakeHours - bedtimeHours + (wakeMinutes - bedtimeMinutes) / 60;
                      if (sleepDuration < 0) sleepDuration += 24;
                      
                      if (sleepDuration < 7) {
                        return (
                          <p className="text-amber-600 text-sm mt-1">
                            This is below the recommended 7-9 hours for adults.
                          </p>
                        );
                      } else if (sleepDuration > 9) {
                        return (
                          <p className="text-amber-600 text-sm mt-1">
                            This is above the recommended 7-9 hours for adults.
                          </p>
                        );
                      } else {
                        return (
                          <p className="text-green-600 text-sm mt-1">
                            This is within the recommended 7-9 hours for adults.
                          </p>
                        );
                      }
                    })()}
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">Sleep Quality</h4>
                    <div className="grid grid-cols-5 gap-1">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <div 
                          key={value}
                          className={`h-2 rounded-full ${
                            value <= sleepQuality 
                              ? 'bg-blue-500' 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm">
                      {qualityOptions.find(option => option.value === sleepQuality)?.label} quality sleep
                    </p>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium mb-3">Smart Suggestions</h4>
                    <ul className="space-y-2">
                      <li className="text-sm flex items-start space-x-2">
                        <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                          <Moon className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Try to go to bed 30 minutes earlier to increase total sleep time.</span>
                      </li>
                      <li className="text-sm flex items-start space-x-2">
                        <div className="rounded-full bg-blue-100 p-1 mt-0.5">
                          <Clock className="h-3 w-3 text-blue-600" />
                        </div>
                        <span>Maintain a consistent sleep schedule, even on weekends.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Sleep History</CardTitle>
              <CardDescription>
                View and analyze your past sleep records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Your sleep history will appear here once you've recorded sleep data.
                <br />
                Start by logging your sleep on the previous tab.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Sleep Trends</CardTitle>
              <CardDescription>
                Visualize patterns in your sleep habits over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-muted-foreground">
                Sleep trend analysis will appear here once you have enough data.
                <br />
                We recommend logging at least a week of sleep data for accurate trends.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
