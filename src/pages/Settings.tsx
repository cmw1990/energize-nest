
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  User, Shield, Bell, Moon, Monitor, Globe, 
  PanelLeft, CircleDot, Languages, Smartphone
} from "lucide-react";

export default function Settings() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [generalSettings, setGeneralSettings] = useState({
    theme: "system",
    language: "en",
    enableNotifications: true,
    enableSounds: true,
    enableAnimations: true
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    shareActivity: true,
    allowDataCollection: true,
    showOnlineStatus: true
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reminderNotifications: true,
    updateNotifications: true
  });
  
  const [accountSettings, setAccountSettings] = useState({
    email: session?.user?.email || ""
  });

  const updateGeneralSettings = useMutation({
    mutationFn: async (settings) => {
      if (!session?.user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          general_settings: settings,
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast({
        title: "Settings Updated",
        description: "Your general settings have been updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive"
      });
      console.error("Settings update error:", error);
    }
  });
  
  const updatePrivacySettings = useMutation({
    mutationFn: async (settings) => {
      if (!session?.user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          privacy_settings: settings,
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast({
        title: "Privacy Settings Updated",
        description: "Your privacy settings have been updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update privacy settings. Please try again.",
        variant: "destructive"
      });
      console.error("Privacy settings update error:", error);
    }
  });
  
  const updateNotificationSettings = useMutation({
    mutationFn: async (settings) => {
      if (!session?.user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: session.user.id,
          notification_settings: settings,
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
      toast({
        title: "Notification Settings Updated",
        description: "Your notification settings have been updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive"
      });
      console.error("Notification settings update error:", error);
    }
  });
  
  const updateEmail = useMutation({
    mutationFn: async ({ email }) => {
      if (!session) throw new Error("User not authenticated");
      
      const { data, error } = await supabase.auth.updateUser({
        email: email
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Verification Email Sent",
        description: "Please check your email to verify your new address."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update email. Please try again.",
        variant: "destructive"
      });
      console.error("Email update error:", error);
    }
  });

  const handleThemeChange = (value) => {
    setGeneralSettings(prev => ({
      ...prev,
      theme: value
    }));
  };
  
  const handleLanguageChange = (value) => {
    setGeneralSettings(prev => ({
      ...prev,
      language: value
    }));
  };
  
  const handleToggleChange = (setting, value, setFunction) => {
    setFunction(prev => ({
      ...prev,
      [setting]: value
    }));
  };
  
  const handleSaveGeneralSettings = () => {
    updateGeneralSettings.mutate(generalSettings);
  };
  
  const handleSavePrivacySettings = () => {
    updatePrivacySettings.mutate(privacySettings);
  };
  
  const handleSaveNotificationSettings = () => {
    updateNotificationSettings.mutate(notificationSettings);
  };
  
  const handleEmailUpdate = (e) => {
    e.preventDefault();
    updateEmail.mutate({ email: accountSettings.email });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <Tabs defaultValue="account">
        <TabsList className="mb-4">
          <TabsTrigger value="account">
            <User className="mr-2 h-4 w-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Monitor className="mr-2 h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="privacy">
            <Shield className="mr-2 h-4 w-4" />
            Privacy
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <form onSubmit={handleEmailUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={accountSettings.email} 
                      onChange={(e) => setAccountSettings(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={updateEmail.isPending}>
                    {updateEmail.isPending ? "Updating..." : "Update Email"}
                  </Button>
                </form>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button>Change Password</Button>
                </form>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                <div className="border border-destructive/20 rounded-md p-4 bg-destructive/5">
                  <h4 className="font-medium text-destructive">Delete Account</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. This action cannot be undone.
                  </p>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select 
                      value={generalSettings.theme} 
                      onValueChange={handleThemeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">
                          <div className="flex items-center">
                            <CircleDot className="mr-2 h-4 w-4" />
                            Light
                          </div>
                        </SelectItem>
                        <SelectItem value="dark">
                          <div className="flex items-center">
                            <Moon className="mr-2 h-4 w-4" />
                            Dark
                          </div>
                        </SelectItem>
                        <SelectItem value="system">
                          <div className="flex items-center">
                            <Monitor className="mr-2 h-4 w-4" />
                            System
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={generalSettings.language} 
                      onValueChange={handleLanguageChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            English
                          </div>
                        </SelectItem>
                        <SelectItem value="es">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            Español
                          </div>
                        </SelectItem>
                        <SelectItem value="fr">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            Français
                          </div>
                        </SelectItem>
                        <SelectItem value="de">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            Deutsch
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableAnimations">Enable Animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Show animations throughout the application
                    </p>
                  </div>
                  <Switch 
                    id="enableAnimations"
                    checked={generalSettings.enableAnimations}
                    onCheckedChange={(checked) => 
                      handleToggleChange('enableAnimations', checked, setGeneralSettings)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enableSounds">Enable Sounds</Label>
                    <p className="text-sm text-muted-foreground">
                      Play sounds for notifications and interactions
                    </p>
                  </div>
                  <Switch 
                    id="enableSounds"
                    checked={generalSettings.enableSounds}
                    onCheckedChange={(checked) => 
                      handleToggleChange('enableSounds', checked, setGeneralSettings)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sidebarPosition">Sidebar Position</Label>
                    <p className="text-sm text-muted-foreground">
                      Choose the position of the sidebar
                    </p>
                  </div>
                  <Select defaultValue="left">
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">
                        <div className="flex items-center">
                          <PanelLeft className="mr-2 h-4 w-4" />
                          Left
                        </div>
                      </SelectItem>
                      <SelectItem value="right">
                        <div className="flex items-center">
                          <PanelLeft className="mr-2 h-4 w-4 rotate-180" />
                          Right
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Button onClick={handleSaveGeneralSettings}>
                {updateGeneralSettings.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Customize how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive important updates via email
                    </p>
                  </div>
                  <Switch 
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      handleToggleChange('emailNotifications', checked, setNotificationSettings)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="pushNotifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive real-time notifications on your device
                    </p>
                  </div>
                  <Switch 
                    id="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      handleToggleChange('pushNotifications', checked, setNotificationSettings)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="reminderNotifications">Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Get reminded about your scheduled activities
                    </p>
                  </div>
                  <Switch 
                    id="reminderNotifications"
                    checked={notificationSettings.reminderNotifications}
                    onCheckedChange={(checked) => 
                      handleToggleChange('reminderNotifications', checked, setNotificationSettings)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="updateNotifications">App Updates</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about new features and updates
                    </p>
                  </div>
                  <Switch 
                    id="updateNotifications"
                    checked={notificationSettings.updateNotifications}
                    onCheckedChange={(checked) => 
                      handleToggleChange('updateNotifications', checked, setNotificationSettings)
                    }
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Quiet Hours</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Don't send notifications during these hours
                </p>
                <div className="flex items-center gap-4">
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="quietHoursStart">Start Time</Label>
                    <Input id="quietHoursStart" type="time" defaultValue="22:00" />
                  </div>
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="quietHoursEnd">End Time</Label>
                    <Input id="quietHoursEnd" type="time" defaultValue="07:00" />
                  </div>
                </div>
              </div>
              
              <Button onClick={handleSaveNotificationSettings}>
                {updateNotificationSettings.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control who can see your information and how your data is used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showProfile">Profile Visibility</Label>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <Switch 
                    id="showProfile"
                    checked={privacySettings.showProfile}
                    onCheckedChange={(checked) => 
                      handleToggleChange('showProfile', checked, setPrivacySettings)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="shareActivity">Activity Sharing</Label>
                    <p className="text-sm text-muted-foreground">
                      Share your activity with the community
                    </p>
                  </div>
                  <Switch 
                    id="shareActivity"
                    checked={privacySettings.shareActivity}
                    onCheckedChange={(checked) => 
                      handleToggleChange('shareActivity', checked, setPrivacySettings)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="allowDataCollection">Data Collection</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow us to collect anonymous usage data to improve the app
                    </p>
                  </div>
                  <Switch 
                    id="allowDataCollection"
                    checked={privacySettings.allowDataCollection}
                    onCheckedChange={(checked) => 
                      handleToggleChange('allowDataCollection', checked, setPrivacySettings)
                    }
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="showOnlineStatus">Online Status</Label>
                    <p className="text-sm text-muted-foreground">
                      Show when you're active in the app
                    </p>
                  </div>
                  <Switch 
                    id="showOnlineStatus"
                    checked={privacySettings.showOnlineStatus}
                    onCheckedChange={(checked) => 
                      handleToggleChange('showOnlineStatus', checked, setPrivacySettings)
                    }
                  />
                </div>
              </div>
              
              <Button onClick={handleSavePrivacySettings}>
                {updatePrivacySettings.isPending ? "Saving..." : "Save Changes"}
              </Button>
              
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-2">Data Management</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Control and manage your personal data
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline">Download Your Data</Button>
                  <Button variant="outline" className="text-orange-500 border-orange-500">
                    Clear All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
