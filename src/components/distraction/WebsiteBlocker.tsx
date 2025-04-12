
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Globe, Plus, Trash } from "lucide-react";

export const WebsiteBlocker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [websites, setWebsites] = useState<any[]>([]);
  const [newWebsite, setNewWebsite] = useState("");

  useEffect(() => {
    loadWebsites();
  }, [session?.user?.id]);

  const loadWebsites = async () => {
    if (!session?.user?.id) return;

    const { data, error } = await supabase
      .from('distraction_blocking')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('block_type', 'website')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading websites:', error);
      return;
    }

    setWebsites(data || []);
  };

  const addWebsite = async () => {
    if (!session?.user?.id || !newWebsite) return;

    try {
      const { error } = await supabase
        .from('distraction_blocking')
        .insert({
          user_id: session.user.id,
          block_type: 'website',
          target: newWebsite,
          is_active: true
        });

      if (error) throw error;

      toast({
        title: "Website blocked",
        description: `${newWebsite} has been added to your block list`
      });

      setNewWebsite("");
      loadWebsites();
    } catch (error) {
      console.error('Error adding website:', error);
      toast({
        title: "Error adding website",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const toggleWebsite = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('distraction_blocking')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;

      loadWebsites();
    } catch (error) {
      console.error('Error toggling website:', error);
      toast({
        title: "Error updating website",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const deleteWebsite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('distraction_blocking')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Website removed",
        description: "Website has been removed from your block list"
      });

      loadWebsites();
    } catch (error) {
      console.error('Error deleting website:', error);
      toast({
        title: "Error removing website",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Website Blocker
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter website URL"
            value={newWebsite}
            onChange={(e) => setNewWebsite(e.target.value)}
          />
          <Button onClick={addWebsite}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>

        <div className="space-y-4">
          {websites.map((website) => (
            <div
              key={website.id}
              className="flex items-center justify-between p-2 border rounded-lg"
            >
              <div className="flex items-center gap-2">
                <Switch
                  checked={website.is_active}
                  onCheckedChange={() => toggleWebsite(website.id, website.is_active)}
                />
                <Label>{website.target}</Label>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteWebsite(website.id)}
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
