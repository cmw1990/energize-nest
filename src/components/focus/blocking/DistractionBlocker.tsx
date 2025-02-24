import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Shield, Plus, X, Settings2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { focusDb } from "@/lib/focus-db";

interface BlockedSite {
  id: string;
  domain: string;
  isBlocked: boolean;
}

interface BlockingSettings {
  blockAds: boolean;
  blockSocialMedia: boolean;
  blockNotifications: boolean;
  allowlist: string[];
  scheduleEnabled: boolean;
  scheduleStart: string;
  scheduleEnd: string;
}

export const DistractionBlocker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newSite, setNewSite] = useState("");
  const [settings, setSettings] = useState<BlockingSettings>({
    blockAds: true,
    blockSocialMedia: true,
    blockNotifications: true,
    allowlist: [],
    scheduleEnabled: false,
    scheduleStart: "09:00",
    scheduleEnd: "17:00",
  });

  // Load blocked sites
  const { data: blockedSites = [] } = useQuery({
    queryKey: ['blocked-sites'],
    queryFn: () => focusDb.getBlockedSites(),
  });

  // Load blocking settings
  const { data: savedSettings } = useQuery({
    queryKey: ['blocking-settings'],
    queryFn: () => focusDb.getBlockingSettings(),
    onSuccess: (data) => {
      if (data) {
        setSettings(data);
      }
    },
  });

  // Update settings
  const updateSettings = useMutation({
    mutationFn: async (newSettings: BlockingSettings) => {
      await focusDb.updateBlockingSettings(newSettings);
    },
    onSuccess: () => {
      toast({
        title: "Settings updated",
        description: "Your blocking settings have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['blocking-settings'] });
    },
  });

  // Add site to block list
  const addSite = useMutation({
    mutationFn: async (domain: string) => {
      await focusDb.addBlockedSite({ domain });
    },
    onSuccess: () => {
      setNewSite("");
      toast({
        title: "Site added",
        description: "The site has been added to your block list.",
      });
      queryClient.invalidateQueries({ queryKey: ['blocked-sites'] });
    },
  });

  // Remove site from block list
  const removeSite = useMutation({
    mutationFn: async (id: string) => {
      await focusDb.removeBlockedSite(id);
    },
    onSuccess: () => {
      toast({
        title: "Site removed",
        description: "The site has been removed from your block list.",
      });
      queryClient.invalidateQueries({ queryKey: ['blocked-sites'] });
    },
  });

  // Toggle site blocking
  const toggleSite = useMutation({
    mutationFn: async ({ id, isBlocked }: { id: string; isBlocked: boolean }) => {
      await focusDb.updateBlockedSite(id, { isBlocked });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocked-sites'] });
    },
  });

  const handleSettingChange = (key: keyof BlockingSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    updateSettings.mutate(newSettings);
  };

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSite) return;
    addSite.mutate(newSite);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Distraction Blocker
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add new site */}
          <form onSubmit={handleAddSite} className="flex gap-2 mb-6">
            <Input
              value={newSite}
              onChange={(e) => setNewSite(e.target.value)}
              placeholder="Enter website domain (e.g., facebook.com)"
              className="flex-1"
            />
            <Button type="submit" disabled={!newSite}>
              <Plus className="h-4 w-4 mr-2" />
              Add Site
            </Button>
          </form>

          {/* Blocked sites list */}
          <div className="space-y-2 mb-6">
            {blockedSites.map((site: BlockedSite) => (
              <div
                key={site.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-primary/5"
              >
                <span>{site.domain}</span>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={site.isBlocked}
                    onCheckedChange={(checked) =>
                      toggleSite.mutate({ id: site.id, isBlocked: checked })
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSite.mutate(site.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Blocking settings */}
          <Card className="bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                Blocking Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="blockAds">Block Advertisements</Label>
                <Switch
                  id="blockAds"
                  checked={settings.blockAds}
                  onCheckedChange={(checked) =>
                    handleSettingChange("blockAds", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="blockSocialMedia">Block Social Media</Label>
                <Switch
                  id="blockSocialMedia"
                  checked={settings.blockSocialMedia}
                  onCheckedChange={(checked) =>
                    handleSettingChange("blockSocialMedia", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="blockNotifications">Block Notifications</Label>
                <Switch
                  id="blockNotifications"
                  checked={settings.blockNotifications}
                  onCheckedChange={(checked) =>
                    handleSettingChange("blockNotifications", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="scheduleEnabled">Enable Schedule</Label>
                <Switch
                  id="scheduleEnabled"
                  checked={settings.scheduleEnabled}
                  onCheckedChange={(checked) =>
                    handleSettingChange("scheduleEnabled", checked)
                  }
                />
              </div>

              {settings.scheduleEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Start Time</Label>
                    <Input
                      type="time"
                      value={settings.scheduleStart}
                      onChange={(e) =>
                        handleSettingChange("scheduleStart", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <Label>End Time</Label>
                    <Input
                      type="time"
                      value={settings.scheduleEnd}
                      onChange={(e) =>
                        handleSettingChange("scheduleEnd", e.target.value)
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Extension Status */}
      <Card className="bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span className="text-sm font-medium">Extension Active</span>
            </div>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              Configure Extension
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
