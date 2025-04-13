
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Moon,
  Sun,
  Globe,
  Bell,
  Volume2,
  Sparkles,
  Users,
  Activity,
  BarChart2,
  Mail,
  Smartphone,
  Clock,
  Download,
  Save,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";

type SettingsState = {
  appearance: {
    theme: string;
    language: string;
    enableNotifications: boolean;
    enableSounds: boolean;
    enableAnimations: boolean;
  };
  privacy: {
    showProfile: boolean;
    shareActivity: boolean;
    allowDataCollection: boolean;
    showOnlineStatus: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    reminderNotifications: boolean;
    updateNotifications: boolean;
  };
  account: {
    email: string;
  };
};

export default function Settings() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState({
    appearance: false,
    privacy: false,
    notifications: false,
    account: false
  });
  
  const [settings, setSettings] = useState<SettingsState>({
    appearance: {
      theme: "system",
      language: "en",
      enableNotifications: true,
      enableSounds: true,
      enableAnimations: true
    },
    privacy: {
      showProfile: true,
      shareActivity: true,
      allowDataCollection: true,
      showOnlineStatus: true
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      reminderNotifications: true,
      updateNotifications: true
    },
    account: {
      email: session?.user?.email || ""
    }
  });

  useEffect(() => {
    if (session?.user?.id) {
      fetchSettings();
    }
  }, [session]);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", session?.user?.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Record not found, use defaults
          return;
        }
        throw error;
      }

      if (data) {
        setSettings({
          appearance: {
            theme: data.theme || "system",
            language: data.language || "en",
            enableNotifications: data.enable_notifications !== false,
            enableSounds: data.enable_sounds !== false,
            enableAnimations: data.enable_animations !== false
          },
          privacy: {
            showProfile: data.show_profile !== false,
            shareActivity: data.share_activity !== false,
            allowDataCollection: data.allow_data_collection !== false,
            showOnlineStatus: data.show_online_status !== false
          },
          notifications: {
            emailNotifications: data.email_notifications !== false,
            pushNotifications: data.push_notifications !== false,
            reminderNotifications: data.reminder_notifications !== false,
            updateNotifications: data.update_notifications !== false
          },
          account: {
            email: session?.user?.email || ""
          }
        });
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast({
        title: "Error fetching settings",
        description: "Failed to load your settings. Please try again.",
        variant: "destructive"
      });
    }
  };

  const saveAppearanceSettings = async () => {
    try {
      setLoading({...loading, appearance: true});
      
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: session?.user?.id,
          theme: settings.appearance.theme,
          language: settings.appearance.language,
          enable_notifications: settings.appearance.enableNotifications,
          enable_sounds: settings.appearance.enableSounds,
          enable_animations: settings.appearance.enableAnimations,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your appearance settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to save your appearance settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading({...loading, appearance: false});
    }
  };

  const savePrivacySettings = async () => {
    try {
      setLoading({...loading, privacy: true});
      
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: session?.user?.id,
          show_profile: settings.privacy.showProfile,
          share_activity: settings.privacy.shareActivity,
          allow_data_collection: settings.privacy.allowDataCollection,
          show_online_status: settings.privacy.showOnlineStatus,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your privacy settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to save your privacy settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading({...loading, privacy: false});
    }
  };

  const saveNotificationSettings = async () => {
    try {
      setLoading({...loading, notifications: true});
      
      const { error } = await supabase
        .from("user_settings")
        .upsert({
          user_id: session?.user?.id,
          email_notifications: settings.notifications.emailNotifications,
          push_notifications: settings.notifications.pushNotifications,
          reminder_notifications: settings.notifications.reminderNotifications,
          update_notifications: settings.notifications.updateNotifications,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Failed to save your notification settings. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading({...loading, notifications: false});
    }
  };

  const updateEmail = async () => {
    try {
      setLoading({...loading, account: true});
      
      const { error } = await supabase.auth.updateUser({
        email: settings.account.email
      });

      if (error) throw error;

      toast({
        title: "Verification email sent",
        description: "Please check your email to confirm the change.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating email",
        description: error.message || "Failed to update your email. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading({...loading, account: false});
    }
  };

  const handleAppearanceChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [field]: value
      }
    });
  };

  const handlePrivacyChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [field]: value
      }
    });
  };

  const handleNotificationsChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value
      }
    });
  };

  const handleAccountChange = (field: string, value: any) => {
    setSettings({
      ...settings,
      account: {
        ...settings.account,
        [field]: value
      }
    });
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="appearance" className="space-y-6">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Account</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how the app looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">Theme</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer hover:border-primary ${
                        settings.appearance.theme === "light" ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleAppearanceChange("theme", "light")}
                    >
                      <div className="flex justify-center mb-4">
                        <Sun className="h-10 w-10 text-yellow-500" />
                      </div>
                      <p className="text-center font-medium">Light</p>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer hover:border-primary ${
                        settings.appearance.theme === "dark" ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleAppearanceChange("theme", "dark")}
                    >
                      <div className="flex justify-center mb-4">
                        <Moon className="h-10 w-10 text-indigo-500" />
                      </div>
                      <p className="text-center font-medium">Dark</p>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer hover:border-primary ${
                        settings.appearance.theme === "system" ? "border-primary bg-primary/5" : ""
                      }`}
                      onClick={() => handleAppearanceChange("theme", "system")}
                    >
                      <div className="flex justify-center mb-4">
                        <div className="flex gap-1">
                          <Sun className="h-10 w-10 text-yellow-500" />
                          <Moon className="h-10 w-10 text-indigo-500" />
                        </div>
                      </div>
                      <p className="text-center font-medium">System</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-2">Language</h3>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-5 w-5 text-muted-foreground" />
                    <select 
                      className="flex h-10 w-full sm:w-[300px] rounded-md border border-input bg-background px-3 py-2"
                      value={settings.appearance.language}
                      onChange={(e) => handleAppearanceChange("language", e.target.value)}
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                      <option value="zh">中文</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-3 pt-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="enableNotifications">Enable notifications</Label>
                    </div>
                    <Switch
                      id="enableNotifications"
                      checked={settings.appearance.enableNotifications}
                      onCheckedChange={(value) => handleAppearanceChange("enableNotifications", value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Volume2 className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="enableSounds">Enable sounds</Label>
                    </div>
                    <Switch
                      id="enableSounds"
                      checked={settings.appearance.enableSounds}
                      onCheckedChange={(value) => handleAppearanceChange("enableSounds", value)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="h-5 w-5 text-muted-foreground" />
                      <Label htmlFor="enableAnimations">Enable animations</Label>
                    </div>
                    <Switch
                      id="enableAnimations"
                      checked={settings.appearance.enableAnimations}
                      onCheckedChange={(value) => handleAppearanceChange("enableAnimations", value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveAppearanceSettings} 
                disabled={loading.appearance}
                className="ml-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading.appearance ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control what information is visible to others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="showProfile">Show profile to other users</Label>
                  </div>
                  <Switch
                    id="showProfile"
                    checked={settings.privacy.showProfile}
                    onCheckedChange={(value) => handlePrivacyChange("showProfile", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Activity className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="shareActivity">Share activity with friends</Label>
                  </div>
                  <Switch
                    id="shareActivity"
                    checked={settings.privacy.shareActivity}
                    onCheckedChange={(value) => handlePrivacyChange("shareActivity", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <BarChart2 className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="allowDataCollection">
                      Allow anonymous data collection for app improvement
                    </Label>
                  </div>
                  <Switch
                    id="allowDataCollection"
                    checked={settings.privacy.allowDataCollection}
                    onCheckedChange={(value) => handlePrivacyChange("allowDataCollection", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="showOnlineStatus">Show online status</Label>
                  </div>
                  <Switch
                    id="showOnlineStatus"
                    checked={settings.privacy.showOnlineStatus}
                    onCheckedChange={(value) => handlePrivacyChange("showOnlineStatus", value)}
                  />
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <EyeOff className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-600 dark:text-yellow-400">Data Privacy</h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Your privacy is important to us. We only collect data that's necessary to provide 
                      and improve our services. You can request a copy of your data or delete your account 
                      at any time.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={savePrivacySettings} 
                disabled={loading.privacy}
                className="ml-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading.privacy ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Control how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="emailNotifications">Email notifications</Label>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(value) => handleNotificationsChange("emailNotifications", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="pushNotifications">Push notifications</Label>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={settings.notifications.pushNotifications}
                    onCheckedChange={(value) => handleNotificationsChange("pushNotifications", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="reminderNotifications">Reminder notifications</Label>
                  </div>
                  <Switch
                    id="reminderNotifications"
                    checked={settings.notifications.reminderNotifications}
                    onCheckedChange={(value) => handleNotificationsChange("reminderNotifications", value)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Download className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="updateNotifications">Product update notifications</Label>
                  </div>
                  <Switch
                    id="updateNotifications"
                    checked={settings.notifications.updateNotifications}
                    onCheckedChange={(value) => handleNotificationsChange("updateNotifications", value)}
                  />
                </div>
              </div>
              
              <div className="rounded-lg border p-4">
                <h4 className="font-medium mb-2">When to send notifications</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Quiet hours start</label>
                    <Input type="time" value="22:00" disabled />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Quiet hours end</label>
                    <Input type="time" value="07:00" disabled />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Quiet hours functionality coming soon
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={saveNotificationSettings} 
                disabled={loading.notifications}
                className="ml-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading.notifications ? "Saving..." : "Save Changes"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account details and password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Email Address</h3>
                <div className="max-w-md space-y-2">
                  <Input 
                    type="email"
                    value={settings.account.email}
                    onChange={(e) => handleAccountChange("email", e.target.value)}
                    placeholder="Your email address"
                  />
                  <p className="text-sm text-muted-foreground">
                    Changing your email will require verification
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <div className="max-w-md space-y-4">
                  <Input type="password" placeholder="Current password" disabled />
                  <Input type="password" placeholder="New password" disabled />
                  <Input type="password" placeholder="Confirm new password" disabled />
                  <p className="text-sm text-muted-foreground">
                    Password change functionality coming soon
                  </p>
                </div>
              </div>
              
              <div className="pt-2">
                <h3 className="text-lg font-medium mb-4">Account Management</h3>
                <div className="space-y-4">
                  <Button variant="outline">Export My Data</Button>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={updateEmail} 
                disabled={loading.account || settings.account.email === session?.user?.email}
                className="ml-auto"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading.account ? "Updating..." : "Update Email"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
