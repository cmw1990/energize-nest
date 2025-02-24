import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Save } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";

export const FocusInterruptionTracker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [interruptionType, setInterruptionType] = useState("");
  const [copingStrategy, setCopingStrategy] = useState("");
  const [effectivenessRating, setEffectivenessRating] = useState<number>(5);

  const logInterruption = async () => {
    if (!session?.user) return;

    try {
      const { error } = await supabase.from('focus_interruption_logs8').insert({
        user_id: session.user.id,
        interruption_type: interruptionType,
        coping_strategy: copingStrategy,
        effectiveness_rating: effectivenessRating,
      });

      if (error) throw error;

      toast({
        title: "Interruption logged",
        description: "Your interruption has been recorded",
      });

      // Reset form
      setInterruptionType("");
      setCopingStrategy("");
      setEffectivenessRating(5);
    } catch (error) {
      console.error('Error logging interruption:', error);
      toast({
        title: "Error",
        description: "Failed to log interruption",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-yellow-500" />
          Log Interruption
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>What interrupted you?</Label>
          <Input
            value={interruptionType}
            onChange={(e) => setInterruptionType(e.target.value)}
            placeholder="e.g., notification, noise, thought"
          />
        </div>

        <div className="space-y-2">
          <Label>How did you handle it?</Label>
          <Input
            value={copingStrategy}
            onChange={(e) => setCopingStrategy(e.target.value)}
            placeholder="e.g., turned off notifications, used noise-canceling"
          />
        </div>

        <div className="space-y-2">
          <Label>How effective was your strategy? (1-10)</Label>
          <Input
            type="number"
            min="1"
            max="10"
            value={effectivenessRating}
            onChange={(e) => setEffectivenessRating(parseInt(e.target.value))}
          />
        </div>

        <Button onClick={logInterruption} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Interruption Log
        </Button>
      </CardContent>
    </Card>
  );
};
