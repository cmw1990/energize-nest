
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Smartphone, Plus, Trash } from "lucide-react";
import { Capacitor } from '@capacitor/core';

export const AppBlocker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [apps, setApps] = useState<any[]>([]);
  const [newApp, setNewApp] = useState("");
  const isMobile = Capacitor.isNativePlatform();

  useEffect(() => {
    if (isMobile) {
      loadApps();
    }
  }, [session?.user?.id]);

  const loadApps = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('distraction_blocking')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('block_type', 'app')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading apps:', error);
      return;
    }

    setApps(data || []);
  };

  const addApp = async () => {
    if (!session?.user?.id || !newApp) return;

    try {
      const { error } = await supabase
        .from('distraction_blocking')
        .insert({
          user_id: session.user.id,
          block_type: 'app',
          target: newApp,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "App blocked",
        description: `${newApp} has been added to your block list`
      });

      setNewApp("");
      loadApps();
    } catch (error) {
      console.error('Error adding app:', error);
      toast({
        title: "Error adding app",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const toggleApp = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('distraction_blocking')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      loadApps();
    } catch (error) {
      console.error('Error toggling app:', error);
      toast({
        title: "Error updating app",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const deleteApp = async (id: string) => {
    try {
      const { error } = await supabase
        .from('distraction_blocking')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "App removed",
        description: "App has been removed from your block list"
      });

      loadApps();
    } catch (error) {
      console.error('Error deleting app:', error);
      toast({
        title: "Error removing app",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  if (!isMobile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            App Blocker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            App blocking is only available on mobile devices. Please install our mobile app
            to use this feature.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5" />
          App Blocker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter app name"
            value={newApp}
            onChange={(e) => setNewApp(e.target.value)}
          />
          <Button onClick={addApp}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-4">
          {apps.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Switch
                  checked={app.is_active}
                  onCheckedChange={() => toggleApp(app.id, app.is_active)}
                />
                <Label>{app.target}</Label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteApp(app.id)}
              >
                <Trash className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
