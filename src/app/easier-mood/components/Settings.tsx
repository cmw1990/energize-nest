import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  Bell, 
  Lock, 
  Sliders, 
  User, 
  Brain,
  Moon,
  RefreshCw,
  Clock
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../components/ui/card';
import { Switch } from '../../../components/ui/switch';
import { Label } from '../../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../../components/ui/radio-group';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import { Separator } from '../../../components/ui/separator';
import { Slider } from '../../../components/ui/slider';
import { supabase } from '../../../integrations/supabase/client';

interface SettingsProps {
  session: Session | null;
}

export const Settings: React.FC<SettingsProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [moodReminders, setMoodReminders] = useState(true);
  const [journalReminders, setJournalReminders] = useState(false);
  const [reminderFrequency, setReminderFrequency] = useState('daily');
  const [reminderTime, setReminderTime] = useState('18:00');
  const [privacyLevel, setPrivacyLevel] = useState('private');
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Manage your profile information and account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {session ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input id="name" defaultValue={session.user?.user_metadata?.name || session.user?.email?.split('@')[0] || ''} />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={session.user?.email || ''} disabled />
                    <p className="text-xs text-muted-foreground">Email cannot be changed directly. Contact support for assistance.</p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label>Privacy Level</Label>
                    <RadioGroup value={privacyLevel} onValueChange={setPrivacyLevel}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="private" id="private" />
                        <Label htmlFor="private">Private (Only you can see your mood data)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="anonymous" id="anonymous" />
                        <Label htmlFor="anonymous">Anonymous (Share anonymously with community insights)</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="public" id="public" />
                        <Label htmlFor="public">Public (Share with your name in community)</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">Please sign in to access your profile settings</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
              <CardDescription>
                Manage how and when you receive mood tracking reminders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications on your device
                    </p>
                  </div>
                  <Switch 
                    checked={pushNotifications} 
                    onCheckedChange={setPushNotifications} 
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive updates and summaries via email
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications} 
                    onCheckedChange={setEmailNotifications} 
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Reminder Types</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Mood Check-ins</p>
                      <p className="text-xs text-muted-foreground">
                        Remind you to log your mood
                      </p>
                    </div>
                    <Switch 
                      checked={moodReminders} 
                      onCheckedChange={setMoodReminders} 
                      disabled={!pushNotifications && !emailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Journal Reminders</p>
                      <p className="text-xs text-muted-foreground">
                        Remind you to write in your journal
                      </p>
                    </div>
                    <Switch 
                      checked={journalReminders} 
                      onCheckedChange={setJournalReminders} 
                      disabled={!pushNotifications && !emailNotifications}
                    />
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-3">
                  <Label>Reminder Schedule</Label>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frequency" className="text-sm">Frequency</Label>
                    <Select value={reminderFrequency} onValueChange={setReminderFrequency}>
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="twice-daily">Twice Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-sm">Reminder Time</Label>
                    <Input 
                      id="time" 
                      type="time" 
                      value={reminderTime} 
                      onChange={(e) => setReminderTime(e.target.value)} 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">Save Notification Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                App Preferences
              </CardTitle>
              <CardDescription>
                Customize how the mood tracking app works for you
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="flex items-center gap-2">
                      <Moon className="h-4 w-4" />
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark themes
                    </p>
                  </div>
                  <Switch 
                    checked={darkMode} 
                    onCheckedChange={setDarkMode} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    Default Mood Tracking View
                  </Label>
                  <RadioGroup defaultValue="calendar">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="calendar" id="calendar" />
                      <Label htmlFor="calendar">Calendar View</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="list" id="list" />
                      <Label htmlFor="list">List View</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="chart" id="chart" />
                      <Label htmlFor="chart">Chart View</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Data Sync Frequency
                  </Label>
                  <Select defaultValue="realtime">
                    <SelectTrigger>
                      <SelectValue placeholder="Select sync frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="manual">Manual only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    How often the app syncs data with the server
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Time Format
                  </Label>
                  <RadioGroup defaultValue="24h">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="12h" id="12h" />
                      <Label htmlFor="12h">12-hour (AM/PM)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="24h" id="24h" />
                      <Label htmlFor="24h">24-hour</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Security
                  </Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Journal Privacy Lock</p>
                      <p className="text-xs text-muted-foreground">
                        Require authentication to view journal entries
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset Preferences</Button>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}; 