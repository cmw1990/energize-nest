import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Check, Flame, List, BarChart2 } from "lucide-react";

interface CravingLog {
  id: string;
  user_id: string;
  craving_level: number;
  trigger: string;
  coping_strategy: string;
  created_at: string;
}

export function CravingTracker() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [cravingLevel, setCravingLevel] = useState(5);
  const [trigger, setTrigger] = useState("");
  const [copingStrategy, setCopingStrategy] = useState("");
  const [showHistory, setShowHistory] = useState(false);

  const { data: recentLogs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ["craving-logs", session?.user?.id],
    queryFn: () => fetchRecentLogs(session?.user?.id),
  });

  const addCravingLog = useMutation({
    mutationFn: () => {
      if (!trigger.trim() || !copingStrategy.trim()) {
        throw new Error("Please provide both trigger and coping strategy.");
      }

      const cravingData = {
        user_id: session?.user?.id,
        craving_level: cravingLevel,
        trigger: trigger,
        coping_strategy: copingStrategy,
        created_at: new Date().toISOString(),
      };

      return logCraving(cravingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["craving-logs"] });
      toast({
        title: "Craving Logged",
        description: "Your craving has been successfully logged.",
      });
      setTrigger("");
      setCopingStrategy("");
      setCravingLevel(5);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log craving. Please try again.",
        variant: "destructive",
      });
      console.error("Craving log error:", error);
    },
  });

  const fetchRecentLogs = async (userId: string) => {
    if (!userId) return [];
    
    try {
      const { data, error } = await supabase
        .from("craving_logs")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error("Error fetching craving logs:", error);
      return [];
    }
  };

  const logCraving = async (cravingData) => {
    try {
      const { data, error } = await supabase
        .from("craving_logs")
        .insert([cravingData]);
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error logging craving:", error);
      throw error;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5" />
          Craving Tracker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Craving Level (1-10)</label>
          <Slider
            defaultValue={[cravingLevel]}
            max={10}
            min={1}
            step={1}
            onValueChange={(value) => setCravingLevel(value[0])}
          />
          <p className="text-muted-foreground text-sm">
            Current Level: {cravingLevel}
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Trigger</label>
          <input
            type="text"
            placeholder="What triggered this craving?"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Coping Strategy</label>
          <input
            type="text"
            placeholder="How are you coping with this craving?"
            value={copingStrategy}
            onChange={(e) => setCopingStrategy(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
        </div>

        <Button
          onClick={() => addCravingLog.mutate()}
          disabled={addCravingLog.isPending}
          className="w-full"
        >
          {addCravingLog.isPending ? "Logging..." : "Log Craving"}
        </Button>

        <Button
          variant="secondary"
          onClick={() => setShowHistory(!showHistory)}
          className="w-full"
        >
          {showHistory ? "Hide History" : "Show Recent History"}
        </Button>

        {showHistory && (
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Recent Logs</h4>
            {isLoadingLogs ? (
              <p className="text-muted-foreground italic">Loading logs...</p>
            ) : recentLogs?.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-4">
                <AlertCircle className="h-6 w-6 text-muted-foreground mb-2 opacity-50" />
                <p className="text-muted-foreground">No logs found.</p>
              </div>
            ) : (
              <ul className="space-y-2">
                {recentLogs?.map((log) => (
                  <li
                    key={log.id}
                    className="p-3 border rounded-md bg-muted/50"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Level: {log.craving_level}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Trigger: {log.trigger}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Coping: {log.coping_strategy}
                        </p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        {new Date(log.created_at).toLocaleTimeString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
