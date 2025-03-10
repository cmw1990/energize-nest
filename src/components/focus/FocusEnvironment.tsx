import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Sun, Moon, Volume2, Wind, Lightbulb, Settings } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";

export const FocusEnvironment = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [whiteNoise, setWhiteNoise] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [temperature, setTemperature] = useState(72);

  const { data: preferences } = useQuery({
    queryKey: ['focus-environment'],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('focus_environment_preferences8')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!session?.user?.id
  });

  const updatePreferences = useMutation({
    mutationFn: async (preferences: any) => {
      if (!session?.user?.id) throw new Error("No user ID");

      const { error } = await supabase
        .from('focus_environment_preferences8')
        .upsert({
          user_id: session.user.id,
          noise_type: whiteNoise ? ['white'] : [],
          light_preference: `${brightness}%`,
          temperature_preference: `${temperature}F`,
          ...preferences
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Preferences saved",
        description: "Your environment settings have been updated.",
      });
    },
  });

  useEffect(() => {
    if (preferences) {
      setWhiteNoise(preferences.noise_type?.includes('white') || false);
      setBrightness(parseInt(preferences.light_preference) || 100);
      setTemperature(parseInt(preferences.temperature_preference) || 72);
    }
  }, [preferences]);

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-amber-500" />
          Focus Environment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>White Noise</Label>
              <p className="text-sm text-muted-foreground">
                Background noise to help concentration
              </p>
            </div>
            <Switch
              checked={whiteNoise}
              onCheckedChange={setWhiteNoise}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Brightness</Label>
              <Sun className="h-4 w-4 text-amber-500" />
            </div>
            <Slider
              value={[brightness]}
              onValueChange={(value) => setBrightness(value[0])}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Temperature</Label>
              <Wind className="h-4 w-4 text-blue-500" />
            </div>
            <Slider
              value={[temperature]}
              onValueChange={(value) => setTemperature(value[0])}
              min={65}
              max={80}
              step={1}
            />
            <p className="text-sm text-muted-foreground text-right">
              {temperature}°F
            </p>
          </div>
        </div>

        <Button 
          onClick={() => updatePreferences.mutate({})}
          className="w-full"
          disabled={!session?.user?.id}
        >
          <Lightbulb className="h-4 w-4 mr-2" />
          Save Settings
        </Button>

        {!session?.user?.id && (
          <p className="text-sm text-muted-foreground text-center">
            Sign in to save your environment preferences
          </p>
        )}
      </CardContent>
    </Card>
  );
};
