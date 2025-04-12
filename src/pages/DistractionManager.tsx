
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BlockingConfirmDialog } from "@/components/distraction/BlockingConfirmDialog";
import { WebsiteBlocker } from "@/components/distraction/WebsiteBlocker";
import { AppBlocker } from "@/components/distraction/AppBlocker";
import { BlockingSchedule } from "@/components/distraction/BlockingSchedule";
import { FocusEnvironment } from "@/components/focus/FocusEnvironment";
import { Shield, Eye, BarChart4, BellRing, Settings, ShieldAlert, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

const DistractionManager = () => {
  const { session } = useAuth();
  const [isBlockingDialogOpen, setIsBlockingDialogOpen] = useState(false);
  const [blockingAction, setBlockingAction] = useState<"block" | "allow">("block");
  const [blockedSites, setBlockedSites] = useState<number>(0);

  const { data: blockingStatus, isLoading } = useQuery({
    queryKey: ['blocking-status', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return { isActive: false, totalBlocked: 0 };

      const { data: sites, error } = await supabase
        .from('distraction_blocking')
        .select('is_active')
        .eq('user_id', session.user.id)
        .eq('block_type', 'website');
      
      if (error) throw error;

      const activeBlocking = sites?.some(site => site.is_active) || false;
      const totalBlocked = sites?.length || 0;

      // For realistic UI, simulate some blocking metrics
      const blockedCount = Math.floor(Math.random() * 50) + (activeBlocking ? 10 : 0);
      setBlockedSites(blockedCount);

      return {
        isActive: activeBlocking,
        totalBlocked
      };
    },
    enabled: !!session?.user?.id,
  });

  const { data: focusStats } = useQuery({
    queryKey: ['focus-stats', session?.user?.id],
    queryFn: async () => {
      // Placeholder data for visualization - in a real app this would come from the backend
      return {
        dailyFocusTime: Math.floor(Math.random() * 240) + 60, // in minutes
        distractionsBlocked: blockedSites,
        productivityScore: Math.floor(Math.random() * 30) + 70, // out of 100
        streakDays: Math.floor(Math.random() * 10) + 1
      };
    },
    enabled: !!session?.user?.id,
  });

  const handleToggleBlocking = (action: "block" | "allow") => {
    setBlockingAction(action);
    setIsBlockingDialogOpen(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Shield className="h-7 w-7 text-primary" />
            Distraction Manager
          </h1>
          <p className="text-muted-foreground">
            Control digital distractions and optimize your focus environment
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button
            variant={blockingStatus?.isActive ? "outline" : "default"}
            size="sm"
            className="font-medium"
            onClick={() => handleToggleBlocking("block")}
            disabled={blockingStatus?.isActive}
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            Enable Blocking
          </Button>
          
          <Button
            variant={!blockingStatus?.isActive ? "outline" : "destructive"}
            size="sm"
            className="font-medium"
            onClick={() => handleToggleBlocking("allow")}
            disabled={!blockingStatus?.isActive}
          >
            <ShieldAlert className="mr-2 h-4 w-4" />
            Disable Blocking
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="rounded-full p-3 bg-blue-100 mb-2">
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold">{focusStats?.dailyFocusTime || 0} min</h3>
                <p className="text-sm text-muted-foreground">Daily Focus Time</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="rounded-full p-3 bg-amber-100 mb-2">
                  <Shield className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="text-2xl font-bold">{focusStats?.distractionsBlocked || 0}</h3>
                <p className="text-sm text-muted-foreground">Distractions Blocked</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="rounded-full p-3 bg-green-100 mb-2">
                  <BarChart4 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold">{focusStats?.productivityScore || 0}%</h3>
                <p className="text-sm text-muted-foreground">Productivity Score</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="rounded-full p-3 bg-purple-100 mb-2">
                  <BellRing className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold">{focusStats?.streakDays || 0} days</h3>
                <p className="text-sm text-muted-foreground">Focus Streak</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="websites" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-6">
          <TabsTrigger value="websites" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            Websites
          </TabsTrigger>
          <TabsTrigger value="apps" className="flex items-center gap-1">
            <Shield className="h-4 w-4" />
            Apps
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Environment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="websites" className="space-y-4">
          <WebsiteBlocker />
        </TabsContent>

        <TabsContent value="apps" className="space-y-4">
          <AppBlocker />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <BlockingSchedule />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <FocusEnvironment />
          
          {/* Smart Blocking Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Smart Blocking Settings
                </CardTitle>
                <CardDescription>
                  Configure advanced distraction blocking features
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Strict Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Prevents disabling blocking during focused work
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Adaptive Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically adjusts blocking based on your focus patterns
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Learning Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      AI learns your distraction patterns over time
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto-adjust</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically updates block lists based on your usage
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Time Boxing</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow distractions only during scheduled breaks
                    </p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <BlockingConfirmDialog 
        open={isBlockingDialogOpen}
        onOpenChange={setIsBlockingDialogOpen}
        action={blockingAction}
      />
    </div>
  );
};

export default DistractionManager;
