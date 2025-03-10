import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  Calendar, 
  ClipboardList, 
  BarChart3, 
  Heart, 
  Settings, 
  UserCog,
  Bell,
  CheckCircle,
  Clock,
  Search,
  Filter,
  MessageSquare,
  UserPlus
} from 'lucide-react';
import { careConnector } from '@/api/apiClient';
import { useToast } from '@/components/ui/use-toast';
import { DataTable } from '@/components/ui/data-table';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Link } from 'react-router-dom';

interface DashboardProps {
  session: Session | null;
}

export const Dashboard: React.FC<DashboardProps> = ({ session }) => {
  console.log("Dashboard component rendering with session:", session);
  
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [dashboardView, setDashboardView] = useState('overview');
  const [userGroups, setUserGroups] = useState<any[]>([]);
  const [userStats, setUserStats] = useState<any>({
    totalGroups: 0,
    upcomingEvents: 0,
    openTasks: 0,
    notifications: 0,
    ownedGroups: 0,
    membershipsByRole: {
      owner: 0,
      admin: 0,
      member: 0
    }
  });
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [assignedTasks, setAssignedTasks] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<string>('member');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [careTeam, setCareTeam] = useState<any[]>([]);
  const [healthMetrics, setHealthMetrics] = useState<any[]>([]);
  
  useEffect(() => {
    console.log("Dashboard component mounted");
    
    // Always load real data from the database, never use mocks
    if (session?.user) {
      console.log("Dashboard: Loading data with session", session.user.id);
      loadDashboardData();
    } else {
      console.log("Dashboard: No session available, will retry when session is ready");
      setIsLoading(false);
      setError("Loading session data...");
    }
  }, [session]);
  
  // Add debug logging when Dashboard component renders
  useEffect(() => {
    console.log("Dashboard component rendered with session:", session);
  }, []);
  
  // Determine user role - whether they're an admin or owner of any groups
  useEffect(() => {
    if (userGroups.length > 0) {
      // Check if user is an owner or admin in any group
      const isAdmin = userGroups.some(group => 
        group.role === 'admin' || group.role === 'owner'
      );
      
      const isOwner = userGroups.some(group => 
        group.role === 'owner'
      );
      
      if (isOwner) {
        setUserRole('owner');
      } else if (isAdmin) {
        setUserRole('admin');
      } else {
        setUserRole('member');
      }
    }
  }, [userGroups]);
  
  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (!session?.user?.id) {
        throw new Error('No authenticated user found');
      }
      
      // Get user's group memberships
      const { data: memberships, error: membershipsError } = await careConnector.groups.getUserGroups();
      
      if (membershipsError) {
        throw new Error(`Error fetching user groups: ${membershipsError.message}`);
      }
      
      // Fetch details for each group
      const groupDetails = [];
      
      if (memberships && memberships.length > 0) {
        for (const membership of memberships) {
          const { data: groups } = await careConnector.groups.getGroupDetails(membership.group_id);
          if (groups && groups.length > 0) {
            groupDetails.push({
              ...groups[0],
              role: membership.role
            });
          }
        }
      }
      
      setUserGroups(groupDetails);
      
      // Count roles
      const roleCount = {
        owner: 0,
        admin: 0,
        member: 0
      };
      
      groupDetails.forEach(group => {
        if (roleCount[group.role as keyof typeof roleCount] !== undefined) {
          roleCount[group.role as keyof typeof roleCount]++;
        }
      });
      
      // Get upcoming events for the user
      const { data: events } = await careConnector.booking.getUserUpcomingEvents(session.user.id, 5);
      setUpcomingEvents(events || []);
      
      // Get tasks assigned to the user
      const { data: tasks } = await careConnector.search.searchTasks({
        assignedTo: session.user.id,
        status: 'pending',
        limit: 5
      });
      setAssignedTasks(tasks || []);
      
      // Build user stats
      setUserStats({
        totalGroups: groupDetails.length,
        upcomingEvents: events ? events.length : 0,
        openTasks: tasks ? tasks.length : 0,
        notifications: 0, // Placeholder for notification system
        ownedGroups: roleCount.owner,
        membershipsByRole: roleCount
      });
      
      // Get recent activity for all groups
      const activityPromises = groupDetails.map(group => 
        careConnector.groups.getGroupActivity(group.id, 3)
      );
      
      const activityResults = await Promise.all(activityPromises);
      const allActivity = activityResults.flatMap(result => result.data || [])
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
      
      setRecentActivity(allActivity);
      
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'An error occurred while loading dashboard data');
      toast({
        title: 'Error',
        description: err.message || 'Failed to load dashboard data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTaskStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await careConnector.tasks.updateTask(taskId, { status: newStatus });
      
      // Refresh tasks list
      const { data: tasks } = await careConnector.search.searchTasks({
        assignedTo: session?.user?.id,
        status: 'pending',
        limit: 5
      });
      
      setAssignedTasks(tasks || []);
      
      toast({
        title: 'Task updated',
        description: `Task status changed to ${newStatus}`,
        variant: 'default'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update task',
        variant: 'destructive'
      });
    }
  };
  
  // Render different dashboard views based on user role
  const renderDashboardContent = () => {
    // Base dashboard that all roles can see
    if (dashboardView === 'overview') {
      return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.totalGroups}</div>
              <p className="text-xs text-muted-foreground">
                {userStats.membershipsByRole.owner} owned, {userStats.membershipsByRole.admin} admin
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.upcomingEvents}</div>
              <p className="text-xs text-muted-foreground">
                Next: {upcomingEvents.length > 0 
                  ? new Date(upcomingEvents[0].start_time).toLocaleDateString() 
                  : 'No upcoming events'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Tasks</CardTitle>
              <ClipboardList className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats.openTasks}</div>
              <p className="text-xs text-muted-foreground">
                Assigned to you
              </p>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest activity across all groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No recent activity</p>
                ) : (
                  recentActivity.slice(0, 5).map((activity, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-4">
                        {activity.type === 'event' && <Calendar className="h-5 w-5 text-blue-500" />}
                        {activity.type === 'task' && <ClipboardList className="h-5 w-5 text-yellow-500" />}
                        {activity.type === 'post' && <MessageSquare className="h-5 w-5 text-green-500" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.title || activity.content || 'Activity'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>
                Events scheduled in your groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                ) : (
                  upcomingEvents.slice(0, 3).map((event, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-4">
                        <Calendar className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">{event.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(event.start_time).toLocaleDateString()} at {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // My Tasks view
    if (dashboardView === 'tasks') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">My Tasks</h2>
            <div className="flex space-x-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tasks</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {assignedTasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No tasks assigned to you</p>
                <Button className="mt-4" variant="outline">Create a Task</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {assignedTasks.map((task, i) => (
                <Card key={i}>
                  <CardContent className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{task.title}</h3>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="flex mt-2 space-x-2">
                          <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'outline'}>
                            {task.priority}
                          </Badge>
                          {task.due_date && (
                            <Badge variant="outline">
                              Due: {new Date(task.due_date).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">Mark as...</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => handleTaskStatusChange(task.id, 'in-progress')}>
                            In Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleTaskStatusChange(task.id, 'completed')}>
                            Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
    }
    
    // Calendar view
    if (dashboardView === 'calendar') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Calendar</h2>
            <div className="flex space-x-2">
              <Button variant="outline">Month</Button>
              <Button variant="outline">Week</Button>
              <Button variant="outline">Day</Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedDate ? selectedDate.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : 'Select a date'}
                </CardTitle>
                <CardDescription>
                  Events scheduled for this day
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingEvents.filter(event => {
                  if (!selectedDate) return false;
                  const eventDate = new Date(event.start_time);
                  return eventDate.getDate() === selectedDate.getDate() &&
                    eventDate.getMonth() === selectedDate.getMonth() &&
                    eventDate.getFullYear() === selectedDate.getFullYear();
                }).length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events scheduled for this day</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingEvents.filter(event => {
                      if (!selectedDate) return false;
                      const eventDate = new Date(event.start_time);
                      return eventDate.getDate() === selectedDate.getDate() &&
                        eventDate.getMonth() === selectedDate.getMonth() &&
                        eventDate.getFullYear() === selectedDate.getFullYear();
                    }).map((event, i) => (
                      <div key={i} className="flex items-center">
                        <div className="mr-4">
                          <Clock className="h-5 w-5 text-blue-500" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{event.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            {event.end_time && ` - ${new Date(event.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
                          </p>
                          {event.location && (
                            <p className="text-xs text-muted-foreground">{event.location}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    
    // Admin dashboard - only for admins and owners
    if (dashboardView === 'admin' && (userRole === 'admin' || userRole === 'owner')) {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <Button>
              <UserCog className="mr-2 h-4 w-4" /> Manage Users
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Group Membership Stats</CardTitle>
                <CardDescription>
                  Overview of the groups you administer
                </CardDescription>
              </CardHeader>
              <CardContent>
                {userGroups.filter(g => g.role === 'admin' || g.role === 'owner').length === 0 ? (
                  <p className="text-sm text-muted-foreground">You don't administer any groups</p>
                ) : (
                  <div className="space-y-4">
                    {userGroups.filter(g => g.role === 'admin' || g.role === 'owner').map((group, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="font-medium">{group.name}</h3>
                          <Badge>{group.role}</Badge>
                        </div>
                        <div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground mb-1">
                            <span>Members</span>
                            <span>Target: 10</span>
                          </div>
                          <Progress value={40} className="h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Group Activity</CardTitle>
                <CardDescription>
                  Recent activity in your groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.filter(a => 
                    userGroups.some(g => g.id === a.group_id && (g.role === 'admin' || g.role === 'owner'))
                  ).slice(0, 5).map((activity, i) => (
                    <div key={i} className="flex items-center">
                      <div className="mr-4">
                        {activity.type === 'event' && <Calendar className="h-5 w-5 text-blue-500" />}
                        {activity.type === 'task' && <ClipboardList className="h-5 w-5 text-yellow-500" />}
                        {activity.type === 'post' && <MessageSquare className="h-5 w-5 text-green-500" />}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {activity.title || activity.content || 'Activity'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>
                  People invited to your groups
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground pb-4">
                  No pending invitations
                </p>
                <Button variant="outline" size="sm">
                  <UserPlus className="mr-2 h-4 w-4" /> Invite Members
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Task Management</CardTitle>
              <CardDescription>
                Overview of tasks in your groups
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Pending Tasks</h3>
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <Progress value={40} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">In Progress</h3>
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <Progress value={20} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <h3 className="font-medium">Completed</h3>
                    <span className="text-sm font-bold">8</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
              </div>
              
              <div className="mt-6">
                <Button variant="outline" size="sm">
                  View All Tasks
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Owner dashboard - only for owners
    if (dashboardView === 'owner' && userRole === 'owner') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Group Owner Dashboard</h2>
            <Button>
              <Users className="mr-2 h-4 w-4" /> Create New Group
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">
                  Across all your groups
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Members</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18</div>
                <p className="text-xs text-muted-foreground">
                  75% active in the last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Task Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Event Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82%</div>
                <p className="text-xs text-muted-foreground">
                  Average attendance rate
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Group Growth</CardTitle>
                <CardDescription>
                  Member growth over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">
                  Chart visualization would be here
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Member Engagement</CardTitle>
                <CardDescription>
                  Activity levels by group
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <div className="text-muted-foreground">
                  Chart visualization would be here
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Your Groups</CardTitle>
                <CardDescription>
                  Groups you own and manage
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userGroups.filter(g => g.role === 'owner').map((group, i) => (
                  <div key={i} className="flex items-start justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-4">
                        <AvatarImage src={group.image_url || ''} alt={group.name} />
                        <AvatarFallback>{group.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">{group.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Created {new Date(group.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Link to={`/care-connector/groups/${group.id}`}>
                      <Button variant="ghost" size="sm">
                        Manage
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }
    
    // Fallback - shouldn't happen
    return (
      <div className="text-center p-8">
        <p>Unknown dashboard view or insufficient permissions</p>
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={() => setDashboardView('overview')}
        >
          Return to Overview
        </Button>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Select
            value={dashboardView}
            onValueChange={setDashboardView}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview</SelectItem>
              <SelectItem value="tasks">My Tasks</SelectItem>
              <SelectItem value="calendar">Calendar</SelectItem>
              {(userRole === 'admin' || userRole === 'owner') && (
                <SelectItem value="admin">Admin Dashboard</SelectItem>
              )}
              {userRole === 'owner' && (
                <SelectItem value="owner">Owner Dashboard</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={loadDashboardData}>Try Again</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <Card className="md:col-span-4">
              <CardContent className="p-0">
                <Tabs defaultValue="overview" value={dashboardView} onValueChange={setDashboardView} className="h-full">
                  <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 h-16 p-1">
                    <TabsTrigger value="overview" className="flex items-center">
                      <Home className="mr-2 h-4 w-4" /> Overview
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="flex items-center">
                      <ClipboardList className="mr-2 h-4 w-4" /> Tasks
                    </TabsTrigger>
                    <TabsTrigger value="calendar" className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" /> Calendar
                    </TabsTrigger>
                    {(userRole === 'admin' || userRole === 'owner') && (
                      <TabsTrigger value="admin" className="flex items-center">
                        <BarChart3 className="mr-2 h-4 w-4" /> Admin
                      </TabsTrigger>
                    )}
                    {userRole === 'owner' && (
                      <TabsTrigger value="owner" className="flex items-center">
                        <UserCog className="mr-2 h-4 w-4" /> Owner
                      </TabsTrigger>
                    )}
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={session?.user?.user_metadata?.avatar_url || ''} alt={session?.user?.email || 'User'} />
                  <AvatarFallback>{session?.user?.email?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <h3 className="mt-2 font-medium text-center">{session?.user?.user_metadata?.full_name || session?.user?.email}</h3>
                <Badge className="mt-1">{userRole}</Badge>
              </CardContent>
            </Card>
          </div>
          
          {renderDashboardContent()}
        </div>
      )}
    </div>
  );
}; 