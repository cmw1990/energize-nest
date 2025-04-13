
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { 
  Shield, 
  X, 
  Plus,
  Bell,
  BellOff,
  ExternalLink,
  Phone,
  Smartphone,
  Laptop,
  Clock,
  Focus,
  ShieldAlert,
  Calendar,
  Save,
  Eye,
  EyeOff
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

interface DistractionSite {
  id: string;
  name: string;
  url: string;
  category: string;
  blocked: boolean;
}

interface FocusSession {
  id: string;
  name: string;
  duration: number; // in minutes
  blockedSites: string[];
  blockedApps: string[];
  notifications: boolean;
}

const DistractionManager = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [blockedSites, setBlockedSites] = useState<DistractionSite[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [newSite, setNewSite] = useState({ name: '', url: '', category: 'social' });
  const [activeFocusSession, setActiveFocusSession] = useState<FocusSession | null>(null);
  const [countdownTime, setCountdownTime] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [newSession, setNewSession] = useState<FocusSession>({
    id: '',
    name: '',
    duration: 30,
    blockedSites: [],
    blockedApps: [],
    notifications: false
  });

  // Fetch user's distraction data
  useEffect(() => {
    if (session?.user?.id) {
      fetchBlockedSites();
      fetchFocusSessions();
    }
  }, [session]);

  // Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isCountingDown && countdownTime > 0) {
      interval = setInterval(() => {
        setCountdownTime((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            endFocusSession();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isCountingDown, countdownTime]);

  const fetchBlockedSites = async () => {
    try {
      const { data, error } = await supabase
        .from('distraction_sites')
        .select('*')
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      
      setBlockedSites(data || []);
    } catch (error) {
      console.error('Error fetching blocked sites:', error);
    }
  };

  const fetchFocusSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      
      setFocusSessions(data || []);
    } catch (error) {
      console.error('Error fetching focus sessions:', error);
    }
  };

  const addBlockedSite = async () => {
    if (!newSite.name || !newSite.url) {
      toast({
        title: "Missing information",
        description: "Please provide both a name and URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('distraction_sites')
        .insert({
          user_id: session?.user?.id,
          name: newSite.name,
          url: newSite.url,
          category: newSite.category,
          blocked: true
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setBlockedSites([...blockedSites, data]);
      setNewSite({ name: '', url: '', category: 'social' });
      
      toast({
        title: "Site added",
        description: `${newSite.name} has been added to your blocked sites`,
      });
    } catch (error) {
      console.error('Error adding blocked site:', error);
      toast({
        title: "Error adding site",
        description: "There was a problem adding this site",
        variant: "destructive",
      });
    }
  };

  const toggleSiteBlock = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('distraction_sites')
        .update({ blocked: !currentStatus })
        .eq('id', id)
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      
      setBlockedSites(
        blockedSites.map(site => 
          site.id === id ? { ...site, blocked: !currentStatus } : site
        )
      );
    } catch (error) {
      console.error('Error updating site status:', error);
    }
  };

  const deleteSite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('distraction_sites')
        .delete()
        .eq('id', id)
        .eq('user_id', session?.user?.id);
      
      if (error) throw error;
      
      setBlockedSites(blockedSites.filter(site => site.id !== id));
      
      toast({
        title: "Site removed",
        description: "The site has been removed from your list",
      });
    } catch (error) {
      console.error('Error deleting site:', error);
    }
  };

  const saveFocusSession = async () => {
    if (!newSession.name || newSession.duration <= 0) {
      toast({
        title: "Invalid session",
        description: "Please provide a name and valid duration",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from('focus_sessions')
        .insert({
          user_id: session?.user?.id,
          name: newSession.name,
          duration: newSession.duration,
          blocked_sites: newSession.blockedSites,
          blocked_apps: newSession.blockedApps,
          notifications_allowed: newSession.notifications
        })
        .select()
        .single();
      
      if (error) throw error;
      
      setFocusSessions([...focusSessions, data]);
      setNewSession({
        id: '',
        name: '',
        duration: 30,
        blockedSites: [],
        blockedApps: [],
        notifications: false
      });
      
      toast({
        title: "Focus session saved",
        description: "Your focus session has been saved",
      });
    } catch (error) {
      console.error('Error saving focus session:', error);
    }
  };

  const startFocusSession = (session: FocusSession) => {
    setActiveFocusSession(session);
    setCountdownTime(session.duration * 60);
    setIsCountingDown(true);
    
    toast({
      title: "Focus session started",
      description: `${session.name} (${session.duration} minutes)`,
    });

    // In production, this would integrate with browser extensions/mobile APIs
    // For now, we'll simulate the experience
  };

  const endFocusSession = () => {
    setIsCountingDown(false);
    
    if (activeFocusSession) {
      logFocusSession();
      
      toast({
        title: "Focus session completed",
        description: `Great job! You've completed ${activeFocusSession.name}`,
      });
    }
    
    setActiveFocusSession(null);
  };

  const logFocusSession = async () => {
    if (!activeFocusSession) return;

    try {
      await supabase
        .from('focus_log')
        .insert({
          user_id: session?.user?.id,
          session_name: activeFocusSession.name,
          duration_minutes: activeFocusSession.duration,
          completed: true,
          session_date: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error logging focus session:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleSiteSelection = (url: string) => {
    setNewSession(prev => {
      const blockedSites = prev.blockedSites.includes(url)
        ? prev.blockedSites.filter(site => site !== url)
        : [...prev.blockedSites, url];
      
      return { ...prev, blockedSites };
    });
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Distraction Manager</h1>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <span className="font-medium text-primary">Focus Shield</span>
        </div>
      </div>

      {activeFocusSession && (
        <Card className="border-primary/20 bg-primary/5 shadow-lg animate-pulse">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-4xl font-bold">
                {formatTime(countdownTime)}
              </div>
              <h3 className="text-xl font-semibold">{activeFocusSession.name}</h3>
              <p className="text-muted-foreground">
                Focus mode active. Distractions are being minimized.
              </p>
              <Button 
                variant="destructive" 
                onClick={endFocusSession}
                className="mt-4"
              >
                End Session Early
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="sites" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sites" className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            <span>Blocked Sites</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Focus className="h-4 w-4" />
            <span>Focus Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Digital Wellness</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="sites" className="space-y-4">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Manage Blocked Sites</CardTitle>
              <CardDescription>
                Add sites that distract you to keep focused during work sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-end gap-2">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input 
                    id="site-name" 
                    placeholder="Facebook" 
                    value={newSite.name}
                    onChange={e => setNewSite({...newSite, name: e.target.value})}
                  />
                </div>
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="site-url">URL</Label>
                  <Input 
                    id="site-url" 
                    placeholder="facebook.com" 
                    value={newSite.url}
                    onChange={e => setNewSite({...newSite, url: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="site-category">Category</Label>
                  <select 
                    id="site-category"
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={newSite.category}
                    onChange={e => setNewSite({...newSite, category: e.target.value})}
                  >
                    <option value="social">Social Media</option>
                    <option value="news">News</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="shopping">Shopping</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Button onClick={addBlockedSite} className="h-10">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-4">URL</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <ScrollArea className="h-[300px]">
                  {blockedSites.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No sites added yet. Add your first distracting site.
                    </div>
                  ) : (
                    blockedSites.map(site => (
                      <div key={site.id} className="grid grid-cols-12 gap-4 p-4 border-t items-center">
                        <div className="col-span-3 font-medium">{site.name}</div>
                        <div className="col-span-4 text-muted-foreground flex items-center">
                          {site.url}
                          <ExternalLink className="h-3 w-3 ml-1 inline" />
                        </div>
                        <div className="col-span-2">
                          <Badge variant={site.category === 'social' ? "destructive" : "outline"}>
                            {site.category}
                          </Badge>
                        </div>
                        <div className="col-span-1 text-center">
                          <Switch 
                            checked={site.blocked} 
                            onCheckedChange={() => toggleSiteBlock(site.id, site.blocked)}
                          />
                        </div>
                        <div className="col-span-2 text-right">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => deleteSite(site.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {focusSessions.map(focusSession => (
              <Card key={focusSession.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{focusSession.name}</CardTitle>
                  <CardDescription className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    {focusSession.duration} minutes
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 text-primary" />
                    <span className="text-sm">{focusSession.blockedSites?.length || 0} sites blocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-primary" />
                    <span className="text-sm">{focusSession.blockedApps?.length || 0} apps blocked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {focusSession.notifications ? (
                      <>
                        <Bell className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Notifications allowed</span>
                      </>
                    ) : (
                      <>
                        <BellOff className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Notifications silenced</span>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => startFocusSession(focusSession)} 
                    className="w-full"
                  >
                    <Focus className="h-4 w-4 mr-2" />
                    Start Session
                  </Button>
                </CardFooter>
              </Card>
            ))}
            
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle>Create New Session</CardTitle>
                <CardDescription>
                  Configure a new focus session
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="session-name">Session Name</Label>
                  <Input 
                    id="session-name" 
                    placeholder="Deep Work"
                    value={newSession.name}
                    onChange={e => setNewSession({...newSession, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-duration">Duration (minutes)</Label>
                  <Input 
                    id="session-duration" 
                    type="number"
                    min={5}
                    max={180}
                    value={newSession.duration}
                    onChange={e => setNewSession({...newSession, duration: parseInt(e.target.value) || 30})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Block Sites</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {blockedSites.slice(0, 6).map(site => (
                      <div 
                        key={site.id}
                        className="flex items-center gap-2"
                      >
                        <input 
                          type="checkbox" 
                          id={`site-${site.id}`}
                          checked={newSession.blockedSites.includes(site.url)}
                          onChange={() => toggleSiteSelection(site.url)}
                          className="rounded"
                        />
                        <Label htmlFor={`site-${site.id}`}>{site.name}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor="allow-notifications">Allow Notifications</Label>
                  <Switch 
                    id="allow-notifications"
                    checked={newSession.notifications}
                    onCheckedChange={checked => setNewSession({...newSession, notifications: checked})}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={saveFocusSession}
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Session
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Digital Wellness Recommendations</CardTitle>
              <CardDescription>
                Tips and strategies to reduce digital distractions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Screen Time Management</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Set daily limits for apps and websites that distract you most. Use your device's built-in screen time tools.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Tips
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <BellOff className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Notification Detox</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Configure your notification settings to minimize interruptions. Only allow important alerts.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Tips
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 bg-muted rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <Laptop className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Digital Minimalism</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Regularly audit your digital tools. Remove apps you don't need and organize your digital environment.
                  </p>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Tips
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Recommended Browser Extensions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg flex items-start gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <ShieldAlert className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">StayFocusd</h4>
                      <p className="text-sm text-muted-foreground">
                        Restrict the amount of time you spend on time-wasting websites.
                      </p>
                      <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                        Learn More <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex items-start gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <EyeOff className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">News Feed Eradicator</h4>
                      <p className="text-sm text-muted-foreground">
                        Replace distracting social media feeds with inspiring quotes.
                      </p>
                      <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                        Learn More <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex items-start gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Pomodoro Timers</h4>
                      <p className="text-sm text-muted-foreground">
                        Use the Pomodoro technique to maintain focus and take regular breaks.
                      </p>
                      <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                        Learn More <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg flex items-start gap-3">
                    <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium">Digital Wellbeing Apps</h4>
                      <p className="text-sm text-muted-foreground">
                        Use apps like Forest or Freedom to stay focused and mindful.
                      </p>
                      <Button variant="link" size="sm" className="p-0 h-auto mt-1">
                        Learn More <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DistractionManager;
