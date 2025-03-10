import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  Bell, 
  Lock, 
  Sliders, 
  User, 
  Share2,
  Database,
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

interface SettingsProps {
  session: Session | null;
}

export const Settings: React.FC<SettingsProps> = ({ session }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [waterReminders, setWaterReminders] = useState(true);
  const [metricSystem, setMetricSystem] = useState('metric');
  const [syncFrequency, setSyncFrequency] = useState('realtime');
  const [calorieGoal, setCalorieGoal] = useState<number[]>([2000]);
  const [proteinGoal, setProteinGoal] = useState<number[]>([120]);
  const [carbGoal, setCarbGoal] = useState<number[]>([250]);
  const [fatGoal, setFatGoal] = useState<number[]>([65]);
  const [waterGoal, setWaterGoal] = useState<number[]>([2500]);
  
  return (
    <div className="space-y-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-lg mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
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
                    <Label htmlFor="gender">Gender</Label>
                    <Select defaultValue="female">
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="birthdate">Date of Birth</Label>
                    <Input id="birthdate" type="date" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Height</Label>
                    <div className="flex space-x-2 items-center">
                      <Input id="height" type="number" defaultValue="170" />
                      <span className="text-sm text-muted-foreground">{metricSystem === 'metric' ? 'cm' : 'in'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight</Label>
                    <div className="flex space-x-2 items-center">
                      <Input id="weight" type="number" defaultValue="70" />
                      <span className="text-sm text-muted-foreground">{metricSystem === 'metric' ? 'kg' : 'lbs'}</span>
                    </div>
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
        
        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="h-5 w-5" />
                Nutrition Goals
              </CardTitle>
              <CardDescription>
                Set your daily nutrition targets
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between mb-1">
                    <Label>Daily Calories</Label>
                    <span className="text-sm font-medium">{calorieGoal[0]} kcal</span>
                  </div>
                  <Slider 
                    value={calorieGoal} 
                    onValueChange={setCalorieGoal} 
                    min={1200} 
                    max={4000} 
                    step={50} 
                  />
                  <p className="text-xs text-muted-foreground">Recommended range: 1500-3000 kcal based on your activity level</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between mb-1">
                    <Label>Protein</Label>
                    <span className="text-sm font-medium">{proteinGoal[0]} g</span>
                  </div>
                  <Slider 
                    value={proteinGoal} 
                    onValueChange={setProteinGoal} 
                    min={50} 
                    max={250} 
                    step={5} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between mb-1">
                    <Label>Carbohydrates</Label>
                    <span className="text-sm font-medium">{carbGoal[0]} g</span>
                  </div>
                  <Slider 
                    value={carbGoal} 
                    onValueChange={setCarbGoal} 
                    min={100} 
                    max={500} 
                    step={10} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between mb-1">
                    <Label>Fat</Label>
                    <span className="text-sm font-medium">{fatGoal[0]} g</span>
                  </div>
                  <Slider 
                    value={fatGoal} 
                    onValueChange={setFatGoal} 
                    min={20} 
                    max={150} 
                    step={5} 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between mb-1">
                    <Label>Water</Label>
                    <span className="text-sm font-medium">{waterGoal[0]} ml</span>
                  </div>
                  <Slider 
                    value={waterGoal} 
                    onValueChange={setWaterGoal} 
                    min={1000} 
                    max={5000} 
                    step={100} 
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <Label>Dietary Preferences</Label>
                <RadioGroup defaultValue="none">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="none" id="none" />
                    <Label htmlFor="none">No restrictions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegetarian" id="vegetarian" />
                    <Label htmlFor="vegetarian">Vegetarian</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="vegan" id="vegan" />
                    <Label htmlFor="vegan">Vegan</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paleo" id="paleo" />
                    <Label htmlFor="paleo">Paleo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="keto" id="keto" />
                    <Label htmlFor="keto">Keto</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Nutrition Goals</Button>
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
                Manage how and when you receive notifications
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
                  <Label>Notification Types</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Meal Reminders</p>
                      <p className="text-xs text-muted-foreground">
                        Remind you to log your meals
                      </p>
                    </div>
                    <Switch 
                      checked={mealReminders} 
                      onCheckedChange={setMealReminders} 
                      disabled={!pushNotifications && !emailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Water Reminders</p>
                      <p className="text-xs text-muted-foreground">
                        Remind you to stay hydrated
                      </p>
                    </div>
                    <Switch 
                      checked={waterReminders} 
                      onCheckedChange={setWaterReminders} 
                      disabled={!pushNotifications && !emailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Weekly Summary</p>
                      <p className="text-xs text-muted-foreground">
                        Get a weekly report of your nutrition
                      </p>
                    </div>
                    <Switch 
                      disabled={!pushNotifications && !emailNotifications}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Goal Achievements</p>
                      <p className="text-xs text-muted-foreground">
                        Notifications when you reach nutrition goals
                      </p>
                    </div>
                    <Switch 
                      defaultChecked 
                      disabled={!pushNotifications && !emailNotifications}
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
                Customize how the app works for you
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
                    <Database className="h-4 w-4" />
                    Measurement System
                  </Label>
                  <RadioGroup value={metricSystem} onValueChange={setMetricSystem}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="metric" id="metric" />
                      <Label htmlFor="metric">Metric (kg, cm)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="imperial" id="imperial" />
                      <Label htmlFor="imperial">Imperial (lb, in)</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Sync Frequency
                  </Label>
                  <Select value={syncFrequency} onValueChange={setSyncFrequency}>
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
                    <Share2 className="h-4 w-4" />
                    Privacy
                  </Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Allow Data Analytics</p>
                      <p className="text-xs text-muted-foreground">
                        Help us improve by sharing anonymous usage data
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Security
                  </Label>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Biometric Authentication</p>
                      <p className="text-xs text-muted-foreground">
                        Use fingerprint or face recognition to secure the app
                      </p>
                    </div>
                    <Switch />
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