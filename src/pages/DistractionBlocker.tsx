
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Ban, Clock, Sparkles, Shield } from "lucide-react";
import { BlockingSchedule } from "@/components/distraction/BlockingSchedule";
import { WebsiteBlocker } from "@/components/distraction/WebsiteBlocker";
import { AppBlocker } from "@/components/distraction/AppBlocker";
import { BlockingStats } from "@/components/distraction/BlockingStats";
import { SmartBlockingRules } from "@/components/distraction/SmartBlockingRules";
import { BlockingConfirmDialog } from "@/components/distraction/BlockingConfirmDialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DistractionBlocker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [blockAllOpen, setBlockAllOpen] = useState(false);
  const [allowAllOpen, setAllowAllOpen] = useState(false);
  const [blockingEnabled, setBlockingEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState("websites");
  const [metrics, setMetrics] = useState({
    focusDuration: 0,
    distractionsBlocked: 0,
    productivityScore: 0
  });

  useEffect(() => {
    loadBlockingSettings();
    loadMetrics();
  }, [session?.user?.id]);

  const loadBlockingSettings = async () => {
    if (!session?.user?.id) return;

    try {
      const { data, error } = await supabase
        .from('distraction_blocking')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;
      
      // Check if any blocking rules are active
      const anyActive = data?.some(rule => rule.is_active);
      setBlockingEnabled(anyActive || false);
      
      console.log('Loaded settings:', data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading blocking settings:', error);
      toast({
        title: "Error loading settings",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const loadMetrics = async () => {
    if (!session?.user?.id) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('productivity_metrics')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setMetrics({
          focusDuration: data.focus_duration || 0,
          distractionsBlocked: data.distractions_blocked || 0,
          productivityScore: data.productivity_score || 0
        });
      } else {
        // Create default metrics record for today
        const { error: insertError } = await supabase
          .from('productivity_metrics')
          .insert({
            user_id: session.user.id,
            date: today,
            focus_duration: 0,
            distractions_blocked: 0,
            productivity_score: 0,
            focus_sessions: 0
          });
          
        if (insertError) console.error('Error creating initial metrics:', insertError);
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
    }
  };

  const startFocusSession = async () => {
    if (!session?.user?.id) return;
    
    setBlockAllOpen(true);
  };

  const endFocusSession = async () => {
    if (!session?.user?.id) return;
    
    setAllowAllOpen(true);
  };

  const toggleBlockingActivation = async (activate: boolean) => {
    if (!session?.user?.id) return;
    
    try {
      if (activate) {
        setBlockAllOpen(true);
      } else {
        setAllowAllOpen(true);
      }
    } catch (error) {
      console.error('Error toggling distraction blocking:', error);
      toast({
        title: "Error updating blocking status",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const exportBlockingSettings = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from('distraction_blocking')
        .select('*')
        .eq('user_id', session.user.id);
        
      if (error) throw error;
      
      const settingsJson = JSON.stringify(data, null, 2);
      const blob = new Blob([settingsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `distraction_blocking_settings_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Settings exported",
        description: "Your blocking settings have been exported successfully."
      });
    } catch (error) {
      console.error('Error exporting settings:', error);
      toast({
        title: "Error exporting settings",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const importBlockingSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const content = e.target?.result as string;
          const settings = JSON.parse(content);
          
          if (!Array.isArray(settings)) throw new Error('Invalid settings format');
          
          // Process and import each setting
          const importPromises = settings.map(async (setting) => {
            // Remove the id and create a new record
            const { id, created_at, ...settingData } = setting;
            
            // Override user_id with current user
            settingData.user_id = session?.user?.id;
            
            // Check if similar setting exists
            const { data: existingData, error: checkError } = await supabase
              .from('distraction_blocking')
              .select('id')
              .eq('user_id', session?.user?.id)
              .eq('block_type', settingData.block_type)
              .eq('target', settingData.target)
              .maybeSingle();
              
            if (checkError) throw checkError;
            
            if (existingData) {
              // Update existing
              const { error } = await supabase
                .from('distraction_blocking')
                .update(settingData)
                .eq('id', existingData.id);
                
              if (error) throw error;
            } else {
              // Create new
              const { error } = await supabase
                .from('distraction_blocking')
                .insert([settingData]);
                
              if (error) throw error;
            }
          });
          
          await Promise.all(importPromises);
          
          toast({
            title: "Settings imported",
            description: "Your blocking settings have been imported successfully."
          });
          
          loadBlockingSettings();
        };
        
        reader.readAsText(file);
      } catch (error) {
        console.error('Error importing settings:', error);
        toast({
          title: "Error importing settings",
          description: "The file format is invalid or there was an error processing the settings.",
          variant: "destructive"
        });
      }
    };
    
    input.click();
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Ban className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Distraction Blocker</h1>
            <p className="text-muted-foreground">Keep focused by blocking distracting content</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={blockingEnabled ? "outline" : "default"}
            onClick={() => toggleBlockingActivation(!blockingEnabled)}
            className="flex-1 md:flex-none"
          >
            {blockingEnabled ? "Disable Blocking" : "Enable Blocking"}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sparkles className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={exportBlockingSettings}>
                Export Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={importBlockingSettings}>
                Import Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
        <div>
          <h2 className="text-xl font-semibold">Focus Mode</h2>
          <p className="text-muted-foreground">Block all distractions to help you stay productive</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="default" 
            onClick={startFocusSession}
            disabled={blockingEnabled}
            className="w-full md:w-auto"
          >
            <Shield className="mr-2 h-4 w-4" /> Start Focus Session
          </Button>
          <Button 
            variant="outline" 
            onClick={endFocusSession}
            disabled={!blockingEnabled}
            className="w-full md:w-auto"
          >
            <Clock className="mr-2 h-4 w-4" /> End Focus Session
          </Button>
        </div>
      </div>

      <BlockingStats />

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="websites">Websites</TabsTrigger>
          <TabsTrigger value="apps">Apps</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
        </TabsList>
        
        <TabsContent value="websites" className="space-y-4">
          <WebsiteBlocker />
          <SmartBlockingRules />
        </TabsContent>
        
        <TabsContent value="apps">
          <AppBlocker />
        </TabsContent>
        
        <TabsContent value="schedule">
          <BlockingSchedule />
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
          <CardDescription>
            Understanding how distraction blocking helps your productivity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">1. Add Distractions</h3>
              <p className="text-sm text-muted-foreground">
                Add websites and apps that distract you and reduce your productivity.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">2. Set Your Schedule</h3>
              <p className="text-sm text-muted-foreground">
                Define when you want to be focused and when distractions should be blocked.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">3. Stay Productive</h3>
              <p className="text-sm text-muted-foreground">
                Our smart blocking system learns from your patterns and helps you stay focused.
              </p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <p className="text-sm">
              To fully utilize website blocking, you'll need to install our browser extension.
              App blocking features are only available in our mobile app.
            </p>
          </div>
        </CardContent>
      </Card>

      <BlockingConfirmDialog 
        open={blockAllOpen}
        onOpenChange={setBlockAllOpen}
        action="block"
      />

      <BlockingConfirmDialog 
        open={allowAllOpen}
        onOpenChange={setAllowAllOpen}
        action="allow"
      />
    </div>
  );
};

export default DistractionBlocker;
