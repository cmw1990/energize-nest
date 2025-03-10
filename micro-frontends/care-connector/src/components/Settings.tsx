import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  User, 
  Bell, 
  Shield, 
  Lock, 
  LogOut, 
  Save, 
  UserPlus, 
  Mail, 
  Phone, 
  Clipboard,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { careConnector } from '@/api/apiClient';

interface SettingsProps {
  session: Session | null;
}

interface UserProfile {
  id: string;
  display_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
  phone: string | null;
  bio: string | null;
  preferences: {
    email_notifications: boolean;
    sms_notifications: boolean;
    task_reminders: boolean;
    event_reminders: boolean;
    new_group_invites: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

export const Settings: React.FC<SettingsProps> = ({ session }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [copySuccess, setCopySuccess] = useState('');
  
  const { toast } = useToast();
  
  // Load user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user profile
        const { data, error } = await careConnector.get(`/users/${session.user.id}`);
          
        if (error) throw error;
        
        // If profile exists, use it, otherwise create default profile
        if (data) {
          setUserProfile({
            id: session.user.id,
            display_name: data.display_name || session.user.email?.split('@')[0] || 'User',
            full_name: data.full_name || '',
            avatar_url: data.avatar_url || null,
            email: session.user.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            preferences: data.preferences || {
              email_notifications: true,
              sms_notifications: false,
              task_reminders: true,
              event_reminders: true,
              new_group_invites: true,
              theme: 'system',
              language: 'en',
            }
          });
        } else {
          // Create default profile if none exists
          const defaultProfile = {
            id: session.user.id,
            display_name: session.user.email?.split('@')[0] || 'User',
            full_name: '',
            avatar_url: null,
            email: session.user.email || '',
            phone: '',
            bio: '',
            preferences: {
              email_notifications: true,
              sms_notifications: false,
              task_reminders: true,
              event_reminders: true,
              new_group_invites: true,
              theme: 'system',
              language: 'en',
            }
          };
          
          setUserProfile(defaultProfile);
          
          // Create the user profile in the database
          const { error: insertError } = await careConnector.post('/users', defaultProfile);
            
          if (insertError) throw insertError;
        }
      } catch (err: any) {
        console.error('Error fetching user profile:', err);
        setError(err.message);
        toast({
          title: 'Error loading profile',
          description: err.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserProfile();
  }, [session, toast]);
  
  // Save profile changes
  const handleSaveProfile = async () => {
    if (!userProfile || !session?.user?.id) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await careConnector.put(`/users/${session.user.id}`, {
        display_name: userProfile.display_name,
        full_name: userProfile.full_name,
        avatar_url: userProfile.avatar_url,
        phone: userProfile.phone,
        bio: userProfile.bio,
        updated_at: new Date().toISOString()
      });
        
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated',
        variant: 'default'
      });
    } catch (err: any) {
      console.error('Error updating profile:', err);
      toast({
        title: 'Error updating profile',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save notification preferences
  const handleSavePreferences = async () => {
    if (!userProfile || !session?.user?.id) return;
    
    try {
      setIsSaving(true);
      
      const { error } = await careConnector.put(`/users/${session.user.id}/preferences`, {
        preferences: userProfile.preferences,
        updated_at: new Date().toISOString()
      });
        
      if (error) throw error;
      
      toast({
        title: 'Preferences updated',
        description: 'Your notification preferences have been saved',
        variant: 'default'
      });
    } catch (err: any) {
      console.error('Error updating preferences:', err);
      toast({
        title: 'Error updating preferences',
        description: err.message,
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      const { error } = await careConnector.post('/auth/signout');
      if (error) throw error;
      
      // Redirect to home page
      window.location.href = '/';
    } catch (err: any) {
      console.error('Error signing out:', err);
      toast({
        title: 'Error signing out',
        description: err.message,
        variant: 'destructive'
      });
    }
  };
  
  // Copy user ID to clipboard
  const copyToClipboard = () => {
    if (!userProfile) return;
    
    navigator.clipboard.writeText(userProfile.id);
    setCopySuccess('Copied!');
    
    setTimeout(() => {
      setCopySuccess('');
    }, 2000);
  };
  
  // Update profile field
  const updateProfile = (field: keyof UserProfile, value: any) => {
    if (!userProfile) return;
    
    setUserProfile(prev => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };
  
  // Update preference field
  const updatePreference = (field: keyof UserProfile['preferences'], value: any) => {
    if (!userProfile) return;
    
    setUserProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        preferences: {
          ...prev.preferences,
          [field]: value
        }
      };
    });
  };
  
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : error ? (
        <div className="text-center p-6 bg-red-50 rounded-lg">
          <p className="text-red-600 mb-4">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      ) : userProfile ? (
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full md:w-[400px] mb-6">
            <TabsTrigger value="profile">
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="account">
              <Shield className="h-4 w-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Tab */}
          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Your Profile</CardTitle>
                  <CardDescription>
                    Manage your personal information visible to other members
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input 
                      id="display-name" 
                      value={userProfile.display_name || ''} 
                      onChange={e => updateProfile('display_name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="full-name">Full Name</Label>
                    <Input 
                      id="full-name" 
                      value={userProfile.full_name || ''} 
                      onChange={e => updateProfile('full_name', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      value={userProfile.email || ''} 
                      disabled
                    />
                    <p className="text-xs text-gray-500">
                      Email address cannot be changed
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      value={userProfile.phone || ''} 
                      onChange={e => updateProfile('phone', e.target.value)}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      value={userProfile.bio || ''} 
                      onChange={e => updateProfile('bio', e.target.value)}
                      placeholder="Tell other care group members about yourself"
                      rows={4}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button disabled={isSaving} onClick={handleSaveProfile}>
                    {isSaving && <Save className="mr-2 h-4 w-4 animate-spin" />}
                    Save Profile
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                  <CardDescription>
                    Upload an image to personalize your profile
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  <Avatar className="h-32 w-32 mb-4">
                    <AvatarImage src={userProfile.avatar_url || ''} />
                    <AvatarFallback className="text-2xl">
                      {userProfile.display_name?.charAt(0) || userProfile.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-4 w-full">
                    <div className="space-y-2">
                      <Label htmlFor="avatar-url">Image URL</Label>
                      <Input 
                        id="avatar-url" 
                        value={userProfile.avatar_url || ''} 
                        onChange={e => updateProfile('avatar_url', e.target.value)}
                        placeholder="https://example.com/your-image.jpg"
                      />
                    </div>
                    
                    <p className="text-xs text-gray-500 text-center">
                      Enter a URL for your profile picture
                    </p>
                    
                    {/* For future implementation: file upload button */}
                    <Button variant="outline" className="w-full" disabled>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Upload Image
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Manage how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Communication Channels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch 
                        id="email-notifications"
                        checked={userProfile.preferences.email_notifications}
                        onCheckedChange={value => updatePreference('email_notifications', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications via text message
                        </p>
                      </div>
                      <Switch 
                        id="sms-notifications"
                        checked={userProfile.preferences.sms_notifications}
                        onCheckedChange={value => updatePreference('sms_notifications', value)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="task-reminders">Task Reminders</Label>
                        <p className="text-sm text-gray-500">
                          Receive reminders for upcoming and overdue tasks
                        </p>
                      </div>
                      <Switch 
                        id="task-reminders"
                        checked={userProfile.preferences.task_reminders}
                        onCheckedChange={value => updatePreference('task_reminders', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="event-reminders">Event Reminders</Label>
                        <p className="text-sm text-gray-500">
                          Receive reminders for upcoming group events
                        </p>
                      </div>
                      <Switch 
                        id="event-reminders"
                        checked={userProfile.preferences.event_reminders}
                        onCheckedChange={value => updatePreference('event_reminders', value)}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="group-invites">Group Invitations</Label>
                        <p className="text-sm text-gray-500">
                          Receive notifications for new group invitations
                        </p>
                      </div>
                      <Switch 
                        id="group-invites"
                        checked={userProfile.preferences.new_group_invites}
                        onCheckedChange={value => updatePreference('new_group_invites', value)}
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Display Preferences</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="theme-select">Theme</Label>
                      <Select 
                        value={userProfile.preferences.theme}
                        onValueChange={(value: 'light' | 'dark' | 'system') => updatePreference('theme', value)}
                      >
                        <SelectTrigger id="theme-select">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System Default</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language-select">Language</Label>
                      <Select 
                        value={userProfile.preferences.language}
                        onValueChange={value => updatePreference('language', value)}
                      >
                        <SelectTrigger id="language-select">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button disabled={isSaving} onClick={handleSavePreferences}>
                  {isSaving && <Save className="mr-2 h-4 w-4 animate-spin" />}
                  Save Preferences
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Account Tab */}
          <TabsContent value="account">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>
                    View your account details and ID
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Account Email</Label>
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4 text-gray-500" />
                      <span>{userProfile.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Account ID</Label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 flex items-center border rounded-md p-2 bg-gray-50">
                        <span className="text-sm font-mono text-gray-700 truncate">{userProfile.id}</span>
                      </div>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        onClick={copyToClipboard}
                        className="h-10 w-10"
                      >
                        {copySuccess ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clipboard className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      This ID is needed when contacting support
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Account Created</Label>
                    <div className="flex items-center">
                      <div className="text-gray-700">
                        {new Date(session?.user?.created_at || '').toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security and sign out
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Button variant="outline" className="w-full" disabled>
                      <Lock className="mr-2 h-4 w-4" />
                      Change Password
                    </Button>
                    <p className="text-xs text-gray-500 mt-2">
                      Password changes are managed through your authentication provider
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Session Management</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Sign out from your current session
                    </p>
                    <Button variant="destructive" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      ) : (
        <p>No user profile found. Please sign in again.</p>
      )}
    </div>
  );
}; 