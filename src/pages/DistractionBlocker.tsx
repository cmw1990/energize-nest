import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { useToast } from "../hooks/use-toast";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "../components/AuthProvider";
import { Ban, Activity, Loader2, ShieldAlert, RefreshCw } from "lucide-react";
import { BlockingSchedule } from "../components/distraction/BlockingSchedule";
import { WebsiteBlocker } from "../components/distraction/WebsiteBlocker";
import { AppBlocker } from "../components/distraction/AppBlocker";
import { AdBlocker } from "../components/distraction/AdBlocker";
import { BlockingStats } from "../components/distraction/BlockingStats";
import { SmartBlockingRules } from "../components/distraction/SmartBlockingRules";
import { DatabaseService } from "../services/DatabaseService";
import { DatabaseTest } from "../components/DatabaseTest";

const DistractionBlocker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showDatabaseTest, setShowDatabaseTest] = useState(false);
  const [metrics, setMetrics] = useState({
    focusDuration: 0,
    distractionsBlocked: 0,
    productivityScore: 0,
    focusSessions: 0
  });

  useEffect(() => {
    // Initialize when component mounts
    const initialize = async () => {
      setIsLoading(true);
      setIsError(false);
      setConnectionError(null);
      
      if (!session?.user?.id) {
        setConnectionError('Please log in to use the Distraction Blocker');
        setIsError(true);
        setIsLoading(false);
        return;
      }

      try {
        // Ensure database connection using DatabaseService
        const dbService = DatabaseService.getInstance();
        const isInitialized = await dbService.initialize();
        
        if (!isInitialized) {
          const status = dbService.getConnectionStatus();
          setConnectionError(status.errorMessage);
          setIsError(true);
          toast({
            title: "Database Connection Error",
            description: status.errorMessage || "Unable to connect to the database. Please try again later.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        console.log('Database initialized, loading blocking settings and metrics');
        await loadBlockingSettings();
        await loadMetrics();
      } catch (err) {
        console.error('Initialization error:', err);
        setIsError(true);
        setConnectionError(err instanceof Error ? err.message : 'Unknown error occurred');
        toast({
          title: "Initialization Error",
          description: "An error occurred while loading the distraction blocker. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [session?.user?.id]);

  const loadBlockingSettings = async () => {
    if (!session?.user?.id) {
      console.log('No user session, cannot load blocking settings');
      return;
    }

    try {
      console.log('Loading blocking settings for user:', session.user.id);
      const { data, error } = await supabase
        .from('distraction_blocking')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error loading blocking settings:', error);
        throw error;
      }
      
      console.log('Loaded settings successfully:', data?.length || 0, 'items');
    } catch (error) {
      console.error('Error loading blocking settings:', error);
      toast({
        title: "Error loading settings",
        description: "Please try again later",
        variant: "destructive"
      });
      throw error; // Rethrow for the caller to handle
    }
  };

  const loadMetrics = async () => {
    if (!session?.user?.id) {
      console.log('No user session, cannot load metrics');
      return;
    }

    try {
      console.log('Loading metrics for user:', session.user.id, 'date:', new Date().toISOString().split('T')[0]);
      const { data, error } = await supabase
        .from('productivity_metrics')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('date', new Date().toISOString().split('T')[0])
        .maybeSingle();

      if (error) {
        console.error('Error loading metrics:', error);
        throw error;
      }

      if (data) {
        console.log('Metrics found for today:', data);
        setMetrics({
          focusDuration: data.focus_duration || 0,
          distractionsBlocked: data.distractions_blocked || 0,
          productivityScore: data.productivity_score || 0,
          focusSessions: data.focus_sessions || 0
        });
      } else {
        // If no metrics exist for today, create a default record
        console.log('No metrics found for today, creating default record');
        try {
          const { data: newData, error: insertError } = await supabase
            .from('productivity_metrics')
            .insert({
              user_id: session.user.id,
              date: new Date().toISOString().split('T')[0],
              focus_duration: 0,
              distractions_blocked: 0,
              productivity_score: 0,
              focus_sessions: 0
            })
            .select()
            .single();
            
          if (insertError) {
            console.error('Error creating metrics:', insertError);
            throw insertError;
          }
          
          if (newData) {
            console.log('Created default metrics for today:', newData);
            setMetrics({
              focusDuration: newData.focus_duration || 0,
              distractionsBlocked: newData.distractions_blocked || 0,
              productivityScore: newData.productivity_score || 0,
              focusSessions: newData.focus_sessions || 0
            });
          }
        } catch (insertErr) {
          console.error('Error creating metrics:', insertErr);
          // Continue without metrics rather than failing completely
        }
      }
    } catch (error) {
      console.error('Error loading or creating metrics:', error);
      // Continue without metrics rather than failing completely
      toast({
        title: "Error loading metrics",
        description: "Your productivity metrics could not be loaded",
        variant: "destructive"
      });
    }
  };

  const handleRetry = async () => {
    const dbService = DatabaseService.getInstance();
    dbService.resetConnectionStatus();
    
    setIsLoading(true);
    setIsError(false);
    setConnectionError(null);
    
    try {
      const isInitialized = await dbService.initialize();
      
      if (!isInitialized) {
        const status = dbService.getConnectionStatus();
        setConnectionError(status.errorMessage);
        setIsError(true);
        toast({
          title: "Database Connection Error",
          description: status.errorMessage || "Still unable to connect to the database. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      
      await loadBlockingSettings();
      await loadMetrics();
      
      toast({
        title: "Connection Restored",
        description: "Successfully reconnected to the database"
      });
    } catch (err) {
      console.error('Retry error:', err);
      setIsError(true);
      setConnectionError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-xl font-medium">Loading Distraction Blocker...</p>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-full">
            <ShieldAlert className="h-6 w-6 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold">Distraction Blocker</h1>
        </div>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center p-4">
              <ShieldAlert className="h-12 w-12 text-red-600 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
              <p className="text-gray-700 mb-4">
                {connectionError || "We're having trouble connecting to the database. Please try again later."}
              </p>
              <div className="flex gap-3 mb-4">
                <Button 
                  onClick={handleRetry}
                  className="bg-red-600 hover:bg-red-700 flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Retry Connection
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowDatabaseTest(!showDatabaseTest)}
                >
                  {showDatabaseTest ? 'Hide' : 'Show'} Database Tools
                </Button>
              </div>
              
              {showDatabaseTest && (
                <div className="w-full mt-6">
                  <DatabaseTest />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show the main component
  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-full">
          <Ban className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-3xl font-bold">Distraction Blocker</h1>
      </div>

      <BlockingStats />

      <div className="grid gap-6 md:grid-cols-2">
        <WebsiteBlocker />
        <AppBlocker />
      </div>

      <AdBlocker />

      <SmartBlockingRules />

      <BlockingSchedule />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Today's Focus Metrics
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-4">
          <div className="space-y-1">
            <Label>Focus Duration</Label>
            <p className="text-2xl font-bold">{Math.round(metrics.focusDuration / 60)} hrs</p>
          </div>
          <div className="space-y-1">
            <Label>Focus Sessions</Label>
            <p className="text-2xl font-bold">{metrics.focusSessions}</p>
          </div>
          <div className="space-y-1">
            <Label>Distractions Blocked</Label>
            <p className="text-2xl font-bold">{metrics.distractionsBlocked}</p>
          </div>
          <div className="space-y-1">
            <Label>Productivity Score</Label>
            <p className="text-2xl font-bold">{metrics.productivityScore}%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DistractionBlocker;