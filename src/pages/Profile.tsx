
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, Settings, Activity, Medal, Bell, FileEdit } from "lucide-react";

export default function Profile() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    username: "",
    bio: "",
    avatar_url: ""
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (error) throw error;
      
      setFormData({
        full_name: data.full_name || "",
        username: data.username || "",
        bio: data.bio || "",
        avatar_url: data.avatar_url || ""
      });
      
      return data;
    },
    enabled: !!session?.user?.id
  });

  const updateProfile = useMutation({
    mutationFn: async (profileData) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', session?.user?.id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
      console.error("Profile update error:", error);
    }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile.mutate(formData);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-4 space-y-6">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>{profile?.full_name ? getInitials(profile.full_name) : "User"}</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{profile?.full_name || "Welcome"}</h2>
              <p className="text-muted-foreground">@{profile?.username || "username"}</p>
              <div className="mt-4 w-full">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <FileEdit className="mr-2 h-4 w-4" />
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Progress Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Energy Management</span>
                  <span className="text-sm font-medium">65%</span>
                </div>
                <Progress value={65} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Focus</span>
                  <span className="text-sm font-medium">78%</span>
                </div>
                <Progress value={78} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Sleep</span>
                  <span className="text-sm font-medium">42%</span>
                </div>
                <Progress value={42} />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Stress Management</span>
                  <span className="text-sm font-medium">55%</span>
                </div>
                <Progress value={55} />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-8">
          <Tabs defaultValue={isEditing ? "edit" : "overview"} value={isEditing ? "edit" : "overview"}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview" disabled={isEditing}>
                <User className="mr-2 h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="edit" disabled={!isEditing}>
                <Settings className="mr-2 h-4 w-4" />
                Edit Profile
              </TabsTrigger>
              <TabsTrigger value="activity" disabled={isEditing}>
                <Activity className="mr-2 h-4 w-4" />
                Activity
              </TabsTrigger>
              <TabsTrigger value="achievements" disabled={isEditing}>
                <Medal className="mr-2 h-4 w-4" />
                Achievements
              </TabsTrigger>
              <TabsTrigger value="notifications" disabled={isEditing}>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>About Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {profile?.bio || "No bio provided yet. Tell us about yourself!"}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <p className="font-medium">Completed a 30-minute focus session</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <p className="font-medium">Created a new energy plan</p>
                      <p className="text-sm text-muted-foreground">Yesterday</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <p className="font-medium">Tracked sleep for 7 days in a row</p>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="edit">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal information</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input 
                        id="full_name" 
                        name="full_name" 
                        value={formData.full_name} 
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input 
                        id="username" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleInputChange}
                        rows={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="avatar_url">Avatar URL</Label>
                      <Input 
                        id="avatar_url" 
                        name="avatar_url" 
                        value={formData.avatar_url} 
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <Button type="submit" disabled={updateProfile.isPending}>
                        {updateProfile.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Your Activity Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <p className="font-medium">Completed a 30-minute focus session</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <p className="font-medium">Created a new energy plan</p>
                      <p className="text-sm text-muted-foreground">Yesterday</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <p className="font-medium">Tracked sleep for 7 days in a row</p>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <p className="font-medium">Completed meditation session</p>
                      <p className="text-sm text-muted-foreground">5 days ago</p>
                    </div>
                    <div className="border-l-4 border-primary pl-4 py-2">
                      <p className="font-medium">Added a new supplement to tracking</p>
                      <p className="text-sm text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle>Your Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Medal className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Early Riser</h3>
                        <p className="text-sm text-muted-foreground">Wake up before 7am for 5 days in a row</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">Focus Master</h3>
                        <p className="text-sm text-muted-foreground">Complete 10 focus sessions</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex items-center gap-4 opacity-50">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Bell className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Sleep Expert</h3>
                        <p className="text-sm text-muted-foreground">Track sleep for 30 days (15/30)</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex items-center gap-4 opacity-50">
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <Settings className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <h3 className="font-medium">Nutrition Tracker</h3>
                        <p className="text-sm text-muted-foreground">Log meals for 14 days (5/14)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Progress updates</p>
                        <p className="text-sm text-muted-foreground">Get notified about your progress milestones</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="progress_updates" className="mr-2" defaultChecked />
                        <Label htmlFor="progress_updates" className="sr-only">Progress updates</Label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Reminders</p>
                        <p className="text-sm text-muted-foreground">Receive reminders for your scheduled activities</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="reminders" className="mr-2" defaultChecked />
                        <Label htmlFor="reminders" className="sr-only">Reminders</Label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Community updates</p>
                        <p className="text-sm text-muted-foreground">Get notified about community activity</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="community_updates" className="mr-2" />
                        <Label htmlFor="community_updates" className="sr-only">Community updates</Label>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email notifications</p>
                        <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                      </div>
                      <div className="flex items-center">
                        <input type="checkbox" id="email_notifications" className="mr-2" defaultChecked />
                        <Label htmlFor="email_notifications" className="sr-only">Email notifications</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
