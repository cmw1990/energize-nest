import React, { useState, useEffect, useRef } from 'react'; // Added useRef
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
  EyeOff,
  Repeat // Added Repeat icon for recurrence
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"; // Added useMutation, useQueryClient
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added Select

interface DistractionSite {
  id: string;
  user_id: string; // Added user_id for RLS
  name: string;
  url: string;
  category: string;
  blocked: boolean;
}

interface FocusSession {
  id: string;
  user_id: string; // Added user_id for RLS
  name: string;
  duration: number; // in minutes
  blocked_sites: string[]; // Changed from blockedSites
  blocked_apps: string[]; // Changed from blockedApps
  notifications_allowed: boolean; // Changed from notifications
  start_time?: string | null; // Added for scheduling (HH:MM)
  end_time?: string | null; // Added for scheduling (HH:MM)
  recurrence_rule?: string | null; // Added for scheduling (e.g., 'daily', 'weekdays', 'weekends')
}

// Placeholder App Data
const placeholderApps = [
  { id: 'app-social-1', name: 'SocialApp', category: 'Social' },
  { id: 'app-game-1', name: 'GameZone', category: 'Games' },
  { id: 'app-news-1', name: 'NewsFeed', category: 'News' },
  { id: 'app-ent-1', name: 'VideoStream', category: 'Entertainment' },
];

const DistractionManager = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient(); // Get query client
  const [blockedSites, setBlockedSites] = useState<DistractionSite[]>([]);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>([]);
  const [newSite, setNewSite] = useState({ name: '', url: '', category: 'social' });
  const [activeFocusSession, setActiveFocusSession] = useState<FocusSession | null>(null);
  const [countdownTime, setCountdownTime] = useState(0);
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [newSession, setNewSession] = useState<Omit<FocusSession, 'id' | 'user_id'>>({ // Use Omit for new session state
    name: '',
    duration: 30,
    blocked_sites: [],
    blocked_apps: [],
    notifications_allowed: false,
    start_time: null,
    end_time: null,
    recurrence_rule: null,
  });
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null); // Ref for interval

  // Fetch user's distraction data
  useEffect(() => {
    if (session?.user?.id) {
      fetchBlockedSites();
      fetchFocusSessions();
    }
  }, [session]);

  // Countdown timer
  useEffect(() => {
    if (isCountingDown && countdownTime > 0) {
      countdownIntervalRef.current = setInterval(() => {
        setCountdownTime((prevTime) => {
          if (prevTime <= 1) {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
            endFocusSession();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else if (countdownTime === 0 && isCountingDown) {
       // Ensure timer stops if it reaches 0 while active
       endFocusSession();
    }

    // Cleanup interval on unmount or when dependencies change
    return () => {
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isCountingDown, countdownTime]); // Dependencies: isCountingDown, countdownTime

  const fetchBlockedSites = async () => {
    if (!session?.user?.id) return;
    try {
      // TODO: Replace with REST API call if required
      const { data, error } = await supabase
        .from('distraction_sites')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      setBlockedSites(data || []);
    } catch (error) {
      console.error('Error fetching blocked sites:', error);
      toast({ title: "Error", description: "Could not load blocked sites.", variant: "destructive" });
    }
  };

  const fetchFocusSessions = async () => {
     if (!session?.user?.id) return;
    try {
      // TODO: Replace with REST API call if required
      const { data, error } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      setFocusSessions(data || []);
    } catch (error) {
      console.error('Error fetching focus sessions:', error);
      toast({ title: "Error", description: "Could not load focus sessions.", variant: "destructive" });
    }
  };

  // --- Mutations ---

  const addSiteMutation = useMutation({
     mutationFn: async (siteData: Omit<DistractionSite, 'id' | 'user_id'> & { user_id: string }) => {
       // TODO: Replace with REST API call if required
       const { data, error } = await supabase
         .from('distraction_sites')
         .insert(siteData)
         .select()
         .single();
       if (error) throw error;
       return data;
     },
     onSuccess: (data) => {
       setBlockedSites(prev => [...prev, data]);
       setNewSite({ name: '', url: '', category: 'social' });
       toast({ title: "Site added", description: `${data.name} added to blocked sites.` });
       queryClient.invalidateQueries({ queryKey: ['distraction_sites', session?.user?.id] });
     },
     onError: (error) => {
       console.error('Error adding blocked site:', error);
       toast({ title: "Error", description: "Failed to add site.", variant: "destructive" });
     }
  });

  const toggleSiteBlockMutation = useMutation({
     mutationFn: async ({ id, blocked }: { id: string; blocked: boolean }) => {
       // TODO: Replace with REST API call if required
       const { error } = await supabase
         .from('distraction_sites')
         .update({ blocked: !blocked })
         .eq('id', id)
         .eq('user_id', session?.user?.id); // Ensure RLS policy allows this
       if (error) throw error;
       return { id, blocked: !blocked };
     },
     onSuccess: ({ id, blocked }) => {
       setBlockedSites(prev => prev.map(site => site.id === id ? { ...site, blocked } : site));
       // No toast needed for toggle usually
       queryClient.invalidateQueries({ queryKey: ['distraction_sites', session?.user?.id] });
     },
     onError: (error) => {
       console.error('Error toggling site block:', error);
       toast({ title: "Error", description: "Failed to update site status.", variant: "destructive" });
       // Optionally revert optimistic update here if needed
     }
  });

  const deleteSiteMutation = useMutation({
     mutationFn: async (id: string) => {
       // TODO: Replace with REST API call if required
       const { error } = await supabase
         .from('distraction_sites')
         .delete()
         .eq('id', id)
         .eq('user_id', session?.user?.id); // Ensure RLS policy allows this
       if (error) throw error;
       return id;
     },
     onSuccess: (id) => {
       setBlockedSites(prev => prev.filter(site => site.id !== id));
       toast({ title: "Site removed", description: "Site removed from your list." });
       queryClient.invalidateQueries({ queryKey: ['distraction_sites', session?.user?.id] });
     },
     onError: (error) => {
       console.error('Error deleting site:', error);
       toast({ title: "Error", description: "Failed to delete site.", variant: "destructive" });
     }
  });

  const saveFocusSessionMutation = useMutation({
     mutationFn: async (sessionData: Omit<FocusSession, 'id' | 'user_id'> & { user_id: string }) => {
       // TODO: Replace with REST API call if required
       const { data, error } = await supabase
         .from('focus_sessions')
         .insert(sessionData)
         .select()
         .single();
       if (error) throw error;
       return data;
     },
     onSuccess: (data) => {
       setFocusSessions(prev => [...prev, data]);
       setNewSession({ name: '', duration: 30, blocked_sites: [], blocked_apps: [], notifications_allowed: false, start_time: null, end_time: null, recurrence_rule: null });
       toast({ title: "Focus session saved", description: `${data.name} saved successfully.` });
       queryClient.invalidateQueries({ queryKey: ['focus_sessions', session?.user?.id] });
     },
     onError: (error) => {
       console.error('Error saving focus session:', error);
       toast({ title: "Error", description: "Failed to save focus session.", variant: "destructive" });
     }
  });

   const logFocusSessionMutation = useMutation({
     mutationFn: async (logData: { session_name: string; duration_minutes: number; completed: boolean }) => {
       if (!session?.user?.id) throw new Error("User not authenticated");
       // TODO: Replace with REST API call if required
       const { error } = await supabase
         .from('focus_log') // Assuming this table exists
         .insert({
           user_id: session.user.id,
           session_name: logData.session_name,
           duration_minutes: logData.duration_minutes,
           completed: logData.completed,
           session_date: new Date().toISOString()
         });
       if (error) throw error;
     },
     onError: (error) => {
       console.error('Error logging focus session:', error);
       // Optional: Show subtle error to user if logging fails
     }
   });

  // --- Handlers ---

  const handleAddBlockedSite = () => {
    if (!newSite.name || !newSite.url) {
      toast({ title: "Missing information", description: "Please provide both a name and URL", variant: "destructive" });
      return;
    }
    if (!session?.user?.id) {
       toast({ title: "Authentication Error", description: "Please log in to add sites.", variant: "destructive" });
       return;
    }
    // Add basic URL validation if needed
    let formattedUrl = newSite.url.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
       // Attempt to normalize, but backend/extension should handle variations
       formattedUrl = formattedUrl.replace(/^(www\.)?/, ''); // Remove www. if present
    }

    addSiteMutation.mutate({
       user_id: session.user.id,
       name: newSite.name.trim(),
       url: formattedUrl, // Use potentially formatted URL
       category: newSite.category,
       blocked: true
    });
  };

  const handleToggleSiteBlock = (id: string, currentStatus: boolean) => {
     toggleSiteBlockMutation.mutate({ id, blocked: currentStatus });
  };

  const handleDeleteSite = (id: string) => {
     deleteSiteMutation.mutate(id);
  };

  const handleSaveFocusSession = () => {
    if (!newSession.name || newSession.duration <= 0) {
      toast({ title: "Invalid session", description: "Please provide a name and valid duration", variant: "destructive" });
      return;
    }
     if (!session?.user?.id) {
       toast({ title: "Authentication Error", description: "Please log in to save sessions.", variant: "destructive" });
       return;
    }
    saveFocusSessionMutation.mutate({ ...newSession, user_id: session.user.id });
  };

  const startFocusSession = (sessionToStart: FocusSession) => {
    setActiveFocusSession(sessionToStart);
    setCountdownTime(sessionToStart.duration * 60);
    setIsCountingDown(true);
    toast({ title: "Focus session started", description: `${sessionToStart.name} (${sessionToStart.duration} minutes)` });
    // Actual blocking logic would happen via browser extension / native API
  };

  const endFocusSession = () => {
    setIsCountingDown(false);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    if (activeFocusSession) {
      logFocusSessionMutation.mutate({
         session_name: activeFocusSession.name,
         duration_minutes: activeFocusSession.duration,
         completed: countdownTime <= 0 // Mark as completed only if timer ran out
      });
      toast({ title: "Focus session ended", description: `Great job on your ${activeFocusSession.name} session!` });
    }
    setActiveFocusSession(null);
    setCountdownTime(0); // Reset countdown
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleSiteSelection = (url: string) => {
    setNewSession(prev => ({
      ...prev,
      blocked_sites: prev.blocked_sites.includes(url)
        ? prev.blocked_sites.filter(site => site !== url)
        : [...prev.blocked_sites, url]
    }));
  };

   const toggleAppSelection = (appName: string) => {
     setNewSession(prev => ({
       ...prev,
       blocked_apps: prev.blocked_apps.includes(appName)
         ? prev.blocked_apps.filter(app => app !== appName)
         : [...prev.blocked_apps, appName]
     }));
   };

  return (
    <div className="space-y-6"> {/* Use Layout's container padding */}
      {/* Header might be redundant */}
      {/* <div className="flex items-center justify-between"> ... </div> */}

      {activeFocusSession && (
        <Card className="border-primary/20 bg-primary/5 shadow-lg animate-pulse">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="text-4xl font-bold font-mono">{formatTime(countdownTime)}</div>
              <h3 className="text-xl font-semibold">{activeFocusSession.name}</h3>
              <p className="text-muted-foreground">Focus mode active. Distractions are being minimized.</p>
              <Button variant="destructive" onClick={endFocusSession} className="mt-4">End Session Early</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="sites" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sites" className="flex items-center gap-2"><ShieldAlert className="h-4 w-4" /><span>Blocked Sites</span></TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2"><Focus className="h-4 w-4" /><span>Focus Sessions</span></TabsTrigger>
          <TabsTrigger value="recommendations" className="flex items-center gap-2"><Calendar className="h-4 w-4" /><span>Digital Wellness</span></TabsTrigger>
        </TabsList>

        <TabsContent value="sites" className="space-y-4">
          <Card className="border-primary/10">
            <CardHeader>
              <CardTitle>Manage Blocked Sites</CardTitle>
              <CardDescription>Add sites that distract you to keep focused during work sessions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-end gap-2"> {/* Use flex-wrap */}
                <div className="grid flex-grow gap-1 min-w-[150px]"> {/* Added min-width */}
                  <Label htmlFor="site-name">Site Name</Label>
                  <Input id="site-name" placeholder="Facebook" value={newSite.name} onChange={e => setNewSite({...newSite, name: e.target.value})}/>
                </div>
                <div className="grid flex-grow gap-1 min-w-[150px]"> {/* Added min-width */}
                  <Label htmlFor="site-url">URL (e.g., facebook.com)</Label>
                  <Input id="site-url" placeholder="facebook.com" value={newSite.url} onChange={e => setNewSite({...newSite, url: e.target.value})}/>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="site-category">Category</Label>
                  <Select value={newSite.category} onValueChange={(value) => setNewSite({...newSite, category: value})}>
                     <SelectTrigger id="site-category" className="w-[150px]">
                       <SelectValue placeholder="Select category" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="social">Social Media</SelectItem>
                       <SelectItem value="news">News</SelectItem>
                       <SelectItem value="entertainment">Entertainment</SelectItem>
                       <SelectItem value="shopping">Shopping</SelectItem>
                       <SelectItem value="other">Other</SelectItem>
                     </SelectContent>
                   </Select>
                </div>
                <Button onClick={handleAddBlockedSite} className="h-10" disabled={addSiteMutation.isPending}>
                  <Plus className="h-4 w-4 mr-2" />
                  {addSiteMutation.isPending ? "Adding..." : "Add"}
                </Button>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="grid grid-cols-12 gap-4 p-4 bg-muted font-medium text-sm">
                  <div className="col-span-3">Name</div>
                  <div className="col-span-4">URL</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1 text-center">Blocked</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <ScrollArea className="h-[300px]">
                  {blockedSites.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">No sites added yet.</div>
                  ) : (
                    blockedSites.map(site => (
                      <div key={site.id} className="grid grid-cols-12 gap-4 p-4 border-t items-center text-sm">
                        <div className="col-span-3 font-medium truncate">{site.name}</div>
                        <div className="col-span-4 text-muted-foreground truncate flex items-center">
                          <a href={`http://${site.url}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{site.url}</a>
                          <ExternalLink className="h-3 w-3 ml-1 inline flex-shrink-0" />
                        </div>
                        <div className="col-span-2"><Badge variant={site.category === 'social' ? "destructive" : "secondary"} className="capitalize">{site.category}</Badge></div>
                        <div className="col-span-1 flex justify-center">
                           <Switch checked={site.blocked} onCheckedChange={() => handleToggleSiteBlock(site.id, site.blocked)} disabled={toggleSiteBlockMutation.isPending}/>
                        </div>
                        <div className="col-span-2 text-right">
                           <Button variant="ghost" size="icon" onClick={() => handleDeleteSite(site.id)} disabled={deleteSiteMutation.isPending}><X className="h-4 w-4" /></Button>
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
               <Card key={focusSession.id} className="hover:shadow-md transition-shadow flex flex-col">
                 <CardHeader>
                   <CardTitle className="text-lg">{focusSession.name}</CardTitle>
                   <CardDescription className="flex items-center"><Clock className="h-4 w-4 mr-1" />{focusSession.duration} minutes</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-2 flex-grow">
                   <div className="flex items-center gap-2"><ShieldAlert className="h-4 w-4 text-primary flex-shrink-0" /><span className="text-sm truncate">{focusSession.blocked_sites?.length || 0} sites blocked</span></div>
                   <div className="flex items-center gap-2"><Smartphone className="h-4 w-4 text-primary flex-shrink-0" /><span className="text-sm truncate">{focusSession.blocked_apps?.length || 0} apps blocked</span></div>
                   <div className="flex items-center gap-2">
                     {focusSession.notifications_allowed ? (<><Bell className="h-4 w-4 text-yellow-500 flex-shrink-0" /><span className="text-sm">Notifications allowed</span></>) : (<><BellOff className="h-4 w-4 text-green-500 flex-shrink-0" /><span className="text-sm">Notifications silenced</span></>)}
                   </div>
                 </CardContent>
                 <CardFooter>
                   <Button onClick={() => startFocusSession(focusSession)} className="w-full"><Focus className="h-4 w-4 mr-2" />Start Session</Button>
                 </CardFooter>
               </Card>
             ))}

             <Card className="border-dashed border-2 hover:border-primary/50 transition-colors flex flex-col">
               <CardHeader>
                 <CardTitle>Create New Session</CardTitle>
                 <CardDescription>Configure a new focus session</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4 flex-grow">
                 <div className="space-y-2">
                   <Label htmlFor="session-name">Session Name</Label>
                   <Input id="session-name" placeholder="Deep Work" value={newSession.name} onChange={e => setNewSession({...newSession, name: e.target.value})}/>
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="session-duration">Duration (minutes)</Label>
                   <Input id="session-duration" type="number" min={5} max={180} value={newSession.duration} onChange={e => setNewSession({...newSession, duration: parseInt(e.target.value) || 30})}/>
                 </div>
                 {/* Blocked Sites Selection */}
                 <div className="space-y-2">
                   <Label>Block Sites ({newSession.blocked_sites.length})</Label>
                   <ScrollArea className="h-24 border rounded-md p-2">
                     {blockedSites.map(site => (
                       <div key={site.id} className="flex items-center gap-2 py-1">
                         <Checkbox id={`sel-site-${site.id}`} checked={newSession.blocked_sites.includes(site.url)} onCheckedChange={() => toggleSiteSelection(site.url)} />
                         <Label htmlFor={`sel-site-${site.id}`} className="text-sm font-normal truncate">{site.name} ({site.url})</Label>
                       </div>
                     ))}
                   </ScrollArea>
                 </div>
                 {/* Placeholder App Blocking Selection */}
                 <div className="space-y-2">
                   <Label>Block Apps (Placeholder - Requires Native Integration)</Label>
                   <ScrollArea className="h-24 border rounded-md p-2">
                     {placeholderApps.map(app => (
                       <div key={app.id} className="flex items-center gap-2 py-1">
                         <Checkbox id={`sel-app-${app.id}`} checked={newSession.blocked_apps.includes(app.name)} onCheckedChange={() => toggleAppSelection(app.name)} />
                         <Label htmlFor={`sel-app-${app.id}`} className="text-sm font-normal truncate">{app.name} ({app.category})</Label>
                       </div>
                     ))}
                   </ScrollArea>
                 </div>
                 {/* Scheduling Inputs */}
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <Label htmlFor="start-time">Start Time (Optional)</Label>
                       <Input id="start-time" type="time" value={newSession.start_time || ''} onChange={e => setNewSession({...newSession, start_time: e.target.value || null})} />
                    </div>
                    <div className="space-y-2">
                       <Label htmlFor="end-time">End Time (Optional)</Label>
                       <Input id="end-time" type="time" value={newSession.end_time || ''} onChange={e => setNewSession({...newSession, end_time: e.target.value || null})} />
                    </div>
                 </div>
                  <div className="space-y-2">
                     <Label htmlFor="recurrence-rule">Recurrence (Optional)</Label>
                     <Select value={newSession.recurrence_rule || ''} onValueChange={(value) => setNewSession({...newSession, recurrence_rule: value || null})}>
                       <SelectTrigger id="recurrence-rule">
                         <SelectValue placeholder="No Recurrence" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="none">No Recurrence</SelectItem>
                         <SelectItem value="daily">Daily</SelectItem>
                         <SelectItem value="weekdays">Weekdays</SelectItem>
                         <SelectItem value="weekends">Weekends</SelectItem>
                         {/* Add more complex rules later if needed */}
                       </SelectContent>
                     </Select>
                  </div>
                 <div className="flex items-center gap-2 pt-2">
                   <Switch id="allow-notifications" checked={newSession.notifications_allowed} onCheckedChange={checked => setNewSession({...newSession, notifications_allowed: checked})} />
                   <Label htmlFor="allow-notifications">Allow Notifications</Label>
                 </div>
               </CardContent>
               <CardFooter>
                 <Button onClick={handleSaveFocusSession} className="w-full" disabled={saveFocusSessionMutation.isPending}><Save className="h-4 w-4 mr-2" />{saveFocusSessionMutation.isPending ? "Saving..." : "Save Session"}</Button>
               </CardFooter>
             </Card>
           </div>
         </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Digital Wellness Recommendations</CardTitle><CardDescription>Tips and strategies to reduce digital distractions</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-muted rounded-lg space-y-2"><div className="flex items-center gap-2"><Smartphone className="h-5 w-5 text-primary" /><h3 className="font-medium">Screen Time Management</h3></div><p className="text-sm text-muted-foreground">Set daily limits for apps and websites that distract you most. Use your device's built-in screen time tools.</p><div className="pt-2"><Button variant="outline" size="sm" className="w-full"><Eye className="h-4 w-4 mr-2" />View Tips</Button></div></div>
                <div className="p-4 bg-muted rounded-lg space-y-2"><div className="flex items-center gap-2"><BellOff className="h-5 w-5 text-primary" /><h3 className="font-medium">Notification Detox</h3></div><p className="text-sm text-muted-foreground">Configure your notification settings to minimize interruptions. Only allow important alerts.</p><div className="pt-2"><Button variant="outline" size="sm" className="w-full"><Eye className="h-4 w-4 mr-2" />View Tips</Button></div></div>
                <div className="p-4 bg-muted rounded-lg space-y-2"><div className="flex items-center gap-2"><Laptop className="h-5 w-5 text-primary" /><h3 className="font-medium">Digital Minimalism</h3></div><p className="text-sm text-muted-foreground">Regularly audit your digital tools. Remove apps you don't need and organize your digital environment.</p><div className="pt-2"><Button variant="outline" size="sm" className="w-full"><Eye className="h-4 w-4 mr-2" />View Tips</Button></div></div>
              </div>
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-2">Recommended Browser Extensions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg flex items-start gap-3"><div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center"><ShieldAlert className="h-5 w-5 text-primary" /></div><div><h4 className="font-medium">StayFocusd</h4><p className="text-sm text-muted-foreground">Restrict the amount of time you spend on time-wasting websites.</p><Button variant="link" size="sm" className="p-0 h-auto mt-1">Learn More <ExternalLink className="h-3 w-3 ml-1" /></Button></div></div>
                  <div className="p-4 border rounded-lg flex items-start gap-3"><div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center"><EyeOff className="h-5 w-5 text-primary" /></div><div><h4 className="font-medium">News Feed Eradicator</h4><p className="text-sm text-muted-foreground">Replace distracting social media feeds with inspiring quotes.</p><Button variant="link" size="sm" className="p-0 h-auto mt-1">Learn More <ExternalLink className="h-3 w-3 ml-1" /></Button></div></div>
                  <div className="p-4 border rounded-lg flex items-start gap-3"><div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center"><Clock className="h-5 w-5 text-primary" /></div><div><h4 className="font-medium">Pomodoro Timers</h4><p className="text-sm text-muted-foreground">Use the Pomodoro technique to maintain focus and take regular breaks.</p><Button variant="link" size="sm" className="p-0 h-auto mt-1">Learn More <ExternalLink className="h-3 w-3 ml-1" /></Button></div></div>
                  <div className="p-4 border rounded-lg flex items-start gap-3"><div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center"><Phone className="h-5 w-5 text-primary" /></div><div><h4 className="font-medium">Digital Wellbeing Apps</h4><p className="text-sm text-muted-foreground">Use apps like Forest or Freedom to stay focused and mindful.</p><Button variant="link" size="sm" className="p-0 h-auto mt-1">Learn More <ExternalLink className="h-3 w-3 ml-1" /></Button></div></div>
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
