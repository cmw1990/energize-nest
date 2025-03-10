// Fixed import statements and RLS policies - force refresh
import React, { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Filter,
  ArrowRight,
  Clock,
  UserPlus,
  MoreHorizontal,
  Settings,
  Trash2,
  LogOut,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { care8GroupsApi } from '@/api/care8ConnectorApi';

// Helper function to handle API errors
const handleApiError = (error: any, toast: any, customMessage?: string) => {
  console.error(customMessage || "API Error:", error);
  
  // Extract the error message
  let errorMessage = "An unexpected error occurred";
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (error && typeof error === 'object') {
    errorMessage = error.message || error.error || JSON.stringify(error);
  }
  
    toast({
      title: "Error",
    description: customMessage ? `${customMessage}: ${errorMessage}` : errorMessage,
      variant: "destructive"
    });
};

// Helper function to format dates
const getTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
};

// Define types
interface CareGroupsProps {
  session: Session | null;
}

interface CareGroup {
  id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  created_by: string;
  updated_at: string;
  image_url: string | null;
  role?: string; // From join with members
  member_count?: number; // Calculated
  recent_activity?: string; // From activity log
}

interface GroupInvitation {
  id: string;
  group_id: string;
  invited_email: string;
  invited_by: string;
  created_at: string;
  expires_at: string;
  status: string;
  group_name?: string; // Joined from care_groups
  inviter_name?: string; // Joined from profiles
  inviter_avatar?: string; // Joined from profiles
}

// Add upcoming event type from new API features
interface UpcomingEvent {
  id: string;
  group_id: string;
  group_name: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
}

// Add volunteer opportunity type from new API features
interface VolunteerOpportunity {
  id: string;
  group_id: string;
  group_name: string;
  title: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string;
  max_volunteers: number;
  current_volunteers: number;
}

export default function CareGroups({ session }: CareGroupsProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // State variables
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessingInvite, setIsProcessingInvite] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  
  // State for groups
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [publicGroups, setPublicGroups] = useState<any[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [volunteerOpportunities, setVolunteerOpportunities] = useState<any[]>([]);
  
  // UI state
  const [activeTab, setActiveTab] = useState("my-groups");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showVolunteerModal, setShowVolunteerModal] = useState(false);
  const [showInvitationModal, setShowInvitationModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState<any>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // Form state
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [eventName, setEventName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [volunteerTitle, setVolunteerTitle] = useState("");
  const [volunteerDescription, setVolunteerDescription] = useState("");
  const [volunteerDate, setVolunteerDate] = useState("");
  
  // Event form state
  const [eventForm, setEventForm] = useState({
    groupId: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    isRecurring: false,
    recurrenceType: 'weekly' as 'daily' | 'weekly' | 'monthly',
    endDate: ''
  });
  
  // Volunteer form state
  const [volunteerForm, setVolunteerForm] = useState({
    groupId: '',
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    location: '',
    maxVolunteers: 1
  });
  
  // Load data on component mount
  useEffect(() => {
    if (session) {
      loadGroups();
      loadInvitations();
      loadUpcomingEvents();
      loadVolunteerOpportunities();
    }
  }, [session]);
  
  // Load groups data
  const loadGroups = async () => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    setHasError(false);
    
    try {
      // Get user's groups
      const userGroupsResponse = await care8GroupsApi.getGroups(session.user.id);
      
      if (userGroupsResponse.error) {
        throw new Error(userGroupsResponse.error.message || 'Failed to load your groups');
      }
      
      // Transform the data to include role from the join
      const userGroups = userGroupsResponse.data.map((item: any) => ({
        ...item.group,
        role: item.role
      }));
      
      setMyGroups(userGroups);
      
      // Get public groups
      const publicGroupsResponse = await care8GroupsApi.getGroups({ isPublic: true });
      
      if (publicGroupsResponse.error) {
        throw new Error(publicGroupsResponse.error.message || 'Failed to load public groups');
      }
      
      // Filter out groups the user is already a member of
      const userGroupIds = userGroups.map((g: any) => g.id);
      const filteredPublicGroups = publicGroupsResponse.data.filter(
        (g: any) => !userGroupIds.includes(g.id)
      );
      
      setPublicGroups(filteredPublicGroups);
    } catch (error) {
      console.error('Error loading groups:', error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : 'Failed to load groups');
      handleApiError(error, toast, 'Failed to load groups');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load invitations
  const loadInvitations = async () => {
    if (!session?.user?.email) return;
    
    try {
      const response = await care8GroupsApi.getGroups(session.user.email);
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to load invitations');
      }
      
      setInvitations(response.data);
    } catch (error) {
      console.error('Error loading invitations:', error);
      handleApiError(error, toast, 'Failed to load invitations');
    }
  };
  
  // Load upcoming events
  const loadUpcomingEvents = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Get user's groups first
      const userGroupsResponse = await care8GroupsApi.getGroups(session.user.id);
      
      if (userGroupsResponse.error) {
        throw new Error(userGroupsResponse.error.message || 'Failed to load your groups');
      }
      
      // Get events for each group
      const userGroupIds = userGroupsResponse.data.map((item: any) => item.group.id);
      
      let allEvents: any[] = [];
      
      for (const groupId of userGroupIds) {
        const eventsResponse = await care8GroupsApi.getGroups(groupId);
        
        if (!eventsResponse.error && eventsResponse.data) {
          // Add group name to each event
          const groupName = userGroupsResponse.data.find((item: any) => item.group.id === groupId)?.group.name || '';
          
          const eventsWithGroupName = eventsResponse.data.map((event: any) => ({
            ...event,
            group_name: groupName
          }));
          
          allEvents = [...allEvents, ...eventsWithGroupName];
        }
      }
      
      // Filter to only include upcoming events (events that haven't ended yet)
      const now = new Date();
      const upcomingEventsFiltered = allEvents.filter((event: any) => {
        const endTime = new Date(event.end_time);
        return endTime > now;
      });
      
      // Sort by start time
      upcomingEventsFiltered.sort((a: any, b: any) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
      });
      
      setUpcomingEvents(upcomingEventsFiltered);
    } catch (error) {
      console.error('Error loading upcoming events:', error);
      handleApiError(error, toast, 'Failed to load upcoming events');
    }
  };
  
  // Load volunteer opportunities
  const loadVolunteerOpportunities = async () => {
    if (!session?.user?.id) return;
    
    try {
      // Get public groups first
      const publicGroupsResponse = await care8GroupsApi.getGroups({ isPublic: true });
      
      if (publicGroupsResponse.error) {
        throw new Error(publicGroupsResponse.error.message || 'Failed to load public groups');
      }
      
      // Get volunteer opportunities for each public group
      const publicGroupIds = publicGroupsResponse.data.map((group: any) => group.id);
      
      let allOpportunities: any[] = [];
      
      for (const groupId of publicGroupIds) {
        const opportunitiesResponse = await care8GroupsApi.getGroups(groupId);
        
        if (!opportunitiesResponse.error && opportunitiesResponse.data) {
          // Add group name to each opportunity
          const groupName = publicGroupsResponse.data.find((group: any) => group.id === groupId)?.name || '';
          
          const opportunitiesWithGroupName = opportunitiesResponse.data.map((opportunity: any) => ({
            ...opportunity,
            group_name: groupName
          }));
          
          allOpportunities = [...allOpportunities, ...opportunitiesWithGroupName];
        }
      }
      
      // Filter to only include upcoming opportunities (opportunities that haven't ended yet)
      const now = new Date();
      const upcomingOpportunitiesFiltered = allOpportunities.filter((opportunity: any) => {
        const endTime = new Date(opportunity.end_time);
        return endTime > now;
      });
      
      // Sort by start time
      upcomingOpportunitiesFiltered.sort((a: any, b: any) => {
        return new Date(a.start_time).getTime() - new Date(b.start_time).getTime();
      });
      
      setVolunteerOpportunities(upcomingOpportunitiesFiltered);
    } catch (error) {
      console.error('Error loading volunteer opportunities:', error);
      handleApiError(error, toast, 'Failed to load volunteer opportunities');
    }
  };
  
  // Create a new group
  const createGroup = async () => {
    if (!session?.user?.id) return;
    
    if (!groupName.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await care8GroupsApi.createGroup({
        name: groupName.trim(),
        description: groupDescription.trim() || null,
        is_public: isPublic,
        created_by: session.user.id
      });
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to create group');
      }
      
      // Add the creator as an owner member
      const newGroupId = response.data[0].id;
      
      await care8GroupsApi.getGroups(session.user.id);
      
      toast({
        title: "Success",
        description: "Group created successfully",
      });
      
      // Reset form
      setGroupName("");
      setGroupDescription("");
      setIsPublic(false);
      setShowCreateModal(false);
      
      // Reload groups
      loadGroups();
    } catch (error) {
      console.error('Error creating group:', error);
      handleApiError(error, toast, 'Failed to create group');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a volunteer opportunity
  const createVolunteerOpportunity = async () => {
    if (!session?.user?.id) return;
    
    if (!volunteerForm.groupId || !volunteerForm.title || !volunteerForm.startTime || !volunteerForm.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await care8GroupsApi.getGroups(volunteerForm.groupId);
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to create volunteer opportunity');
      }
      
      toast({
        title: "Success",
        description: "Volunteer opportunity created successfully",
      });
      
      // Reset form
      setVolunteerForm({
        groupId: '',
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        maxVolunteers: 1
      });
      setShowVolunteerModal(false);
      
      // Reload volunteer opportunities
      loadVolunteerOpportunities();
    } catch (error) {
      console.error('Error creating volunteer opportunity:', error);
      handleApiError(error, toast, 'Failed to create volunteer opportunity');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create a recurring event
  const createRecurringEvent = async () => {
    if (!session?.user?.id) return;
    
    if (!eventForm.groupId || !eventForm.title || !eventForm.startTime || !eventForm.endTime) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For recurring events, we'll create multiple event instances
      const startDate = new Date(eventForm.startTime);
      const endDate = eventForm.endDate ? new Date(eventForm.endDate) : new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 3); // Default to 3 months if no end date
      
      const startTime = new Date(eventForm.startTime);
      const endTime = new Date(eventForm.endTime);
      const duration = endTime.getTime() - startTime.getTime();
      
      // Calculate recurrence interval
      let interval = 7; // Default to weekly
      if (eventForm.recurrenceType === 'daily') interval = 1;
      if (eventForm.recurrenceType === 'monthly') interval = 30;
      
      // Create events
      const eventPromises = [];
      let currentDate = new Date(startDate);
      
      while (currentDate <= endDate) {
        const eventStartTime = new Date(currentDate);
        const eventEndTime = new Date(eventStartTime.getTime() + duration);
        
        eventPromises.push(
          care8GroupsApi.getGroups(eventForm.groupId)
        );
        
        // Move to next occurrence
        currentDate.setDate(currentDate.getDate() + interval);
      }
      
      await Promise.all(eventPromises);
      
      toast({
        title: "Success",
        description: `${eventPromises.length} events created successfully`,
      });
      
      // Reset form
      setEventForm({
        groupId: '',
        title: '',
        description: '',
        startTime: '',
        endTime: '',
        location: '',
        isRecurring: false,
        recurrenceType: 'weekly',
        endDate: ''
      });
      setShowEventModal(false);
      
      // Reload events
      loadUpcomingEvents();
    } catch (error) {
      console.error('Error creating events:', error);
      handleApiError(error, toast, 'Failed to create events');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Join a group
  const joinGroup = async (groupId: string) => {
    if (!session?.user?.id) return;
    
    setIsLoading(true);
    
    try {
      // Check if already a member
      const membershipResponse = await care8GroupsApi.getGroups(session.user.id);
      
      if (membershipResponse.error) {
        throw new Error(membershipResponse.error.message || 'Failed to check membership');
      }
      
      if (membershipResponse.data.isMember) {
        toast({
          title: "Info",
          description: "You are already a member of this group",
        });
        return;
      }
      
      // Join the group
      const response = await care8GroupsApi.getGroups(session.user.id);
      
      if (response.error) {
        throw new Error(response.error.message || 'Failed to join group');
      }
      
      toast({
        title: "Success",
        description: "You have joined the group successfully",
      });
      
      // Reload groups
      loadGroups();
    } catch (error) {
      console.error('Error joining group:', error);
      handleApiError(error, toast, 'Failed to join group');
    } finally {
      setIsLoading(false);
    }
  };
  
  // View invitation details
  const handleViewInvitation = async (invitationId: string) => {
    const invitation = invitations.find(inv => inv.id === invitationId);
    
    if (!invitation) {
      toast({
        title: "Error",
        description: "Invitation not found",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedInvitation(invitation);
    setShowInvitationModal(true);
  };
  
  // Accept invitation
  const acceptInvitation = async () => {
    if (!session?.user?.id || !selectedInvitation) return;
    
    setIsProcessingInvite(true);
    
    try {
      // Update invitation status
      const updateResponse = await care8GroupsApi.getGroups(selectedInvitation.id);
      
      if (updateResponse.error) {
        throw new Error(updateResponse.error.message || 'Failed to accept invitation');
      }
      
      // Add user to group
      const addMemberResponse = await care8GroupsApi.getGroups(session.user.id);
      
      if (addMemberResponse.error) {
        throw new Error(addMemberResponse.error.message || 'Failed to add you to the group');
      }
      
      toast({
        title: "Success",
        description: "You have joined the group successfully",
      });
      
      // Close modal and reload data
      setShowInvitationModal(false);
      setSelectedInvitation(null);
      loadGroups();
      loadInvitations();
    } catch (error) {
      console.error('Error accepting invitation:', error);
      handleApiError(error, toast, 'Failed to accept invitation');
    } finally {
      setIsProcessingInvite(false);
    }
  };
  
  // Decline invitation
  const declineInvitation = async () => {
    if (!selectedInvitation) return;
    
    setIsProcessingInvite(true);
    
    try {
      // Update invitation status
      const updateResponse = await care8GroupsApi.getGroups(selectedInvitation.id);
      
      if (updateResponse.error) {
        throw new Error(updateResponse.error.message || 'Failed to decline invitation');
      }
      
      toast({
        title: "Success",
        description: "Invitation declined",
      });
      
      // Close modal and reload invitations
      setShowInvitationModal(false);
      setSelectedInvitation(null);
      loadInvitations();
    } catch (error) {
      console.error('Error declining invitation:', error);
      handleApiError(error, toast, 'Failed to decline invitation');
    } finally {
      setIsProcessingInvite(false);
    }
  };
  
  // Filter groups based on search query
  const filterGroups = (groups: any[]) => {
    if (!searchQuery) return groups;
    
    const query = searchQuery.toLowerCase();
    return groups.filter(group => 
      group.name.toLowerCase().includes(query) || 
      (group.description && group.description.toLowerCase().includes(query))
    );
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Care Groups</h1>
      
      {/* Main content */}
      <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-gray-600 mt-1">Manage and join care coordination groups</p>
        </div>
          <div className="flex space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search groups..."
                className="pl-8 w-[200px] md:w-[300px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
              Create Group
        </Button>
      </div>
        </div>

      {hasError && (
          <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setActiveTab('my-groups')}>My Groups</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setActiveTab('public-groups')}>Public Groups</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {/* Create Group Dialog */}
      <Dialog open={showCreateModal} onOpenChange={(open) => {
        // Only allow closing the dialog if not in the creating state
        if (!isLoading || !open) {
          setShowCreateModal(open);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Care Group</DialogTitle>
            <DialogDescription>
              Create a group to coordinate care with family, friends, and caregivers.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="groupName" className="flex items-center">
                Group Name <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                id="groupName"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g., Family Care Group"
                disabled={isLoading}
                className={!groupName.trim() ? "border-red-300 focus:border-red-500" : ""}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && groupName.trim()) {
                    createGroup();
                  }
                }}
              />
              {!groupName.trim() && (
                <p className="text-red-500 text-sm mt-1">Group name is required</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="groupDescription">Description</Label>
              <Textarea
                id="groupDescription"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="Describe the purpose of this group..."
                rows={3}
                disabled={isLoading}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="publicGroup"
                checked={isPublic}
                onCheckedChange={setIsPublic}
                disabled={isLoading}
              />
              <Label htmlFor="publicGroup">Make this group public</Label>
            </div>

            {isLoading && (
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md text-blue-800 dark:text-blue-200 flex items-center mt-4">
                <div className="w-5 h-5 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mr-3"></div>
                <div>
                  <p className="font-medium">Creating your group...</p>
                  <p className="text-sm text-blue-600 dark:text-blue-300">This may take a few moments. Please don't close this dialog.</p>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateModal(false)} disabled={isLoading}>
              Cancel
            </Button>
            
            {isLoading ? (
              <Button disabled>
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating your group...
                </span>
              </Button>
            ) : (
              <Button onClick={createGroup}>
                Create Group
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading state */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">Loading care groups...</h3>
        </div>
      ) : (
        <>
          <Tabs defaultValue="my-groups" onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="my-groups">My Groups</TabsTrigger>
              <TabsTrigger value="public-groups">Public Groups</TabsTrigger>
            </TabsList>

            {/* My Groups Tab */}
            <TabsContent value="my-groups" className="space-y-6">
              {filterGroups(myGroups).length === 0 ? (
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  {searchQuery ? (
                    <>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No groups match your search.</p>
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </Button>
                    </>
                  ) : (
                    <>
                      <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">You don't have any care groups yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Create a care group to coordinate care with family, friends, and caregivers.
                      </p>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setShowCreateModal(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Group
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterGroups(myGroups).map((group) => (
                    <Card key={group.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Avatar className="h-10 w-10 mr-3">
                              <AvatarImage src={group.image_url || undefined} />
                              <AvatarFallback>{group.name?.[0] || 'G'}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-lg">{group.name || 'Unnamed Group'}</CardTitle>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={group.role === 'owner' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                                           group.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300' : 
                                           'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}>
                              {group.role || 'member'}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Open menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => group.id && navigate(`/care-connector/app/groups/${group.id}`)}>
                                  View Group
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => group.id && navigate(`/care-connector/app/groups/${group.id}/members`)}>
                                  Members
                                </DropdownMenuItem>
                                {(group.role === 'owner' || group.role === 'admin') && (
                                  <DropdownMenuItem onClick={() => group.id && navigate(`/care-connector/app/groups/${group.id}/settings`)}>
                                    <Settings className="h-4 w-4 mr-2" />
                                    Group Settings
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => console.log('Leaving group:', group.id)}
                                >
                                  <LogOut className="h-4 w-4 mr-2" />
                                  {group.role === 'owner' ? 'Delete Group' : 'Leave Group'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="line-clamp-2 mb-3">
                          {group.description || "No description provided"}
                        </CardDescription>
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {group.member_count || 1} member{(group.member_count || 1) !== 1 ? 's' : ''}
                          </span>
                          {group.recent_activity && (
                            <span className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {group.recent_activity}
                            </span>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-center text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
                          onClick={() => group.id && navigate(`/care-connector/app/groups/${group.id}`)}
                        >
                          View Group
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Public Groups Tab */}
            <TabsContent value="public-groups" className="space-y-6">
              {filterGroups(publicGroups).length === 0 ? (
                <div className="text-center p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  {searchQuery ? (
                    <>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">No public groups match your search.</p>
                      <Button
                        variant="outline"
                        onClick={() => setSearchQuery('')}
                      >
                        Clear Search
                      </Button>
                    </>
                  ) : (
                    <>
                      <Users className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No public groups available</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        There are currently no public care groups to join. Create your own group instead!
                      </p>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                        onClick={() => setShowCreateModal(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Create New Group
                      </Button>
                    </>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterGroups(publicGroups).map((group) => (
                    <Card key={group.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center">
                          <Avatar className="h-9 w-9 mr-2">
                            <AvatarImage src={group.image_url || undefined} />
                            <AvatarFallback>{group.name?.[0] || 'G'}</AvatarFallback>
                          </Avatar>
                          <CardTitle className="text-lg">{group.name || 'Unnamed Group'}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="line-clamp-2 mb-3">
                          {group.description || "No description provided"}
                        </CardDescription>
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {group.member_count || 0} member{(group.member_count || 0) !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => group.id && joinGroup(group.id)}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Join Group
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
      </div>
      
      {/* Invitation Details Modal */}
      <Dialog open={showInvitationModal} onOpenChange={setShowInvitationModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Group Invitation</DialogTitle>
            <DialogDescription>
              You've been invited to join a care group
            </DialogDescription>
          </DialogHeader>
          
          {selectedInvitation && (
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold text-lg mb-1">{selectedInvitation.group_name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{selectedInvitation.group_description}</p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Message: {selectedInvitation.invitation_message}</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button
              variant="outline"
              onClick={() => declineInvitation()}
              disabled={isLoading}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Decline
            </Button>
            <Button
              onClick={() => acceptInvitation()}
              disabled={isLoading}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept & Join
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 