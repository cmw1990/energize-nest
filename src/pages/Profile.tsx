
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, Lock, Shield, Edit, Image as ImageIcon, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Profile() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: "",
    username: "",
    bio: "",
    avatar_url: "",
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  async function fetchProfile() {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .single();
      
      if (error) throw error;
      
      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          username: data.username || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
        });
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile() {
    try {
      setLoading(true);
      
      if (!session?.user?.id) throw new Error('No user ID');
      
      const updates = {
        id: session.user.id,
        full_name: profileData.full_name,
        username: profileData.username,
        bio: profileData.bio,
        avatar_url: profileData.avatar_url,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .upsert(updates);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      
      setEditMode(false);
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const getInitials = () => {
    if (profileData.full_name) {
      return profileData.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();
    }
    return session?.user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>Profile Information</span>
                {!editMode ? (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditMode(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Update your profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="flex flex-col items-center gap-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profileData.avatar_url} />
                    <AvatarFallback className="text-xl">{getInitials()}</AvatarFallback>
                  </Avatar>
                  {editMode && (
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Change Avatar
                    </Button>
                  )}
                </div>
                
                <div className="flex-1 space-y-4 w-full">
                  <div className="grid gap-3">
                    <label className="font-medium text-sm">Full Name</label>
                    {editMode ? (
                      <Input 
                        name="full_name"
                        value={profileData.full_name}
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                    ) : (
                      <p>{profileData.full_name || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-3">
                    <label className="font-medium text-sm">Username</label>
                    {editMode ? (
                      <Input 
                        name="username"
                        value={profileData.username}
                        onChange={handleChange}
                        placeholder="Your username"
                      />
                    ) : (
                      <p>{profileData.username || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div className="grid gap-3">
                    <label className="font-medium text-sm">Bio</label>
                    {editMode ? (
                      <Textarea 
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                        className="min-h-[100px]"
                      />
                    ) : (
                      <p className="text-muted-foreground">{profileData.bio || 'No bio provided'}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
            {editMode && (
              <CardFooter>
                <Button onClick={updateProfile} disabled={loading} className="ml-auto flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                View your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <label className="font-medium text-sm">Email Address</label>
                <p className="flex items-center gap-2">
                  {session?.user?.email}
                  <span className="text-xs bg-green-100 text-green-700 dark:bg-green-800/30 dark:text-green-300 px-2 py-0.5 rounded-full">Verified</span>
                </p>
              </div>
              
              <div className="grid gap-2">
                <label className="font-medium text-sm">Account Created</label>
                <p className="text-muted-foreground">
                  {session?.user?.created_at ? new Date(session.user.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="font-medium">Password</h3>
                  <p className="text-sm text-muted-foreground">Last changed: Never</p>
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Change Password
                </Button>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Button variant="outline">Enable 2FA</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Active Sessions</h3>
                  <p className="text-sm text-muted-foreground">Manage your active sessions</p>
                </div>
                <Button variant="outline">View Sessions</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Preferences</CardTitle>
              <CardDescription>
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
                </div>
                <select className="border rounded px-3 py-1">
                  <option>System Default</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b">
                <div>
                  <h3 className="font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
                </div>
                <Button variant="outline">Configure</Button>
              </div>
              
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Privacy Settings</h3>
                  <p className="text-sm text-muted-foreground">Control what data is shared</p>
                </div>
                <Button variant="outline">Manage Privacy</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
