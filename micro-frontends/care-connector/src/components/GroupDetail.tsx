import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Users, 
  CalendarDays, 
  MessageSquare, 
  CheckSquare, 
  Settings, 
  UserPlus, 
  Calendar, 
  Clock, 
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { getGroupById, getGroupMembers, getTasks, getGroupEvents, getGroupPosts, ExtendedGroupMember } from '../lib/careConnectorApiClient';

interface GroupDetailProps {
  session: Session | null;
}

// Interface for group data
interface GroupData {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  created_by: string;
  image_url: string | null;
  member_count?: number;
  user_role?: string;
}

// Interface for task data
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  group_id: string;
}

// Interface for event data
interface GroupEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  created_by: string;
  created_at: string;
}

// Interface for post data
interface GroupPost {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  author_name?: string;
  author_avatar?: string;
  like_count?: number;
  comment_count?: number;
}

export const GroupDetail: React.FC<GroupDetailProps> = ({ session }) => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State definitions
  const [isLoading, setIsLoading] = useState(true);
  const [groupData, setGroupData] = useState<GroupData | null>(null);
  const [members, setMembers] = useState<ExtendedGroupMember[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<GroupEvent[]>([]);
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [useDemo, setUseDemo] = useState(false);
  const [error, setError] = useState<{ message: string; details: string } | null>(null);
  const [activeTab, setActiveTab] = useState('members');
  
  // Timeout ref to prevent infinite loading
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load group data function
  const loadGroupData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (!session) {
        setError({ message: 'No session found', code: 401 });
        setIsLoading(false);
        return;
      }
      
      // Fetch group basic information
      const { data: groupData, error: groupError } = await getGroupById(groupId as string, session);

      if (groupError) {
        console.error('Error fetching group:', groupError);
        setError({ 
          message: groupError.message || 'Error loading group', 
          code: 500 
        });
        setIsLoading(false);
        return;
      } 
      
      if (!groupData) {
        setGroupData(null);
        setError({ 
          message: 'Group not found', 
          code: 404 
        });
        setIsLoading(false);
        return;
      }

      // Group data loaded successfully
      setGroupData(groupData as unknown as GroupData);

      // Load all related data in parallel
      const [
        { data: membersData, error: membersError },
        { data: tasksData, error: tasksError },
        { data: eventsData, error: eventsError },
        { data: postsData, error: postsError }
      ] = await Promise.all([
        getGroupMembers(groupId as string, session),
        getTasks(groupId as string),
        getGroupEvents(groupId as string),
        getGroupPosts(groupId as string)
      ]);

      if (membersError) {
        console.error('Error fetching members:', membersError);
      } else {
        setMembers(membersData || []);
      }

      if (tasksError) {
        console.error('Error fetching tasks:', tasksError);
      } else {
        // Ensure we're setting an array of tasks
        setTasks(Array.isArray(tasksData) ? tasksData : []);
      }

      if (eventsError) {
        console.error('Error fetching events:', eventsError);
      } else {
        // Ensure we're setting an array of events
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      }

      if (postsError) {
        console.error('Error fetching posts:', postsError);
      } else {
        // Ensure we're setting an array of posts
        setPosts(Array.isArray(postsData) ? postsData : []);
      }

    } catch (error: any) {
      console.error('Error in loadGroupData:', error);
      setError({ 
        message: error.message || 'An unexpected error occurred', 
        code: 500 
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Effect to load data on mount and when dependencies change
  useEffect(() => {
    if (groupId) {
      loadGroupData();
    }
    
    return () => {
      // Cleanup on unmount
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [groupId, loadGroupData]);

  // Debug logging
  useEffect(() => {
    console.log('Component State:', {
      isLoading,
      hasGroup: !!groupData,
      hasMembers: members?.length,
      hasTasks: tasks?.length,
      hasEvents: events?.length,
      hasPosts: posts?.length,
      error
    });
  }, [isLoading, groupData, members, tasks, events, posts, error]);
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  };
  
  // Function to get days of current week
  const getCurrentWeekDays = () => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
    const days = [];
    
    // Calculate the start of the week (Sunday)
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - dayOfWeek);
    
    // Generate array of dates for the week
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    
    return days;
  };
  
  const weekDays = getCurrentWeekDays();
  
  // Find events for a specific day
  const getEventsForDay = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  const handleBackClick = () => {
    navigate('/care-connector');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
          <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em]"></div>
          <p className="mt-4 text-lg">Loading group data...</p>
        </div>
          </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
        <div className="text-center max-w-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error.message}</h2>
          <p className="mb-6 text-gray-700">{error.details}</p>
          <Button variant="default" onClick={handleBackClick}>
            Back to Care Connector
          </Button>
        </div>
      </div>
    );
  }
  
  if (!groupData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px] p-6">
        <div className="text-center max-w-lg">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Not Found</h2>
          <p className="mb-6 text-gray-700">The group you're looking for could not be found. It may have been deleted or you might not have permission to view it.</p>
          <Button variant="default" onClick={handleBackClick}>
            Back to Care Connector
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {/* Group Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBackClick}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{groupData.name}</h1>
            <p className="text-gray-500">{members.length} member{members.length !== 1 ? 's' : ''}</p>
          </div>
        </div>
          
          {(groupData.user_role === 'owner' || groupData.user_role === 'admin') && (
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
            Manage Group
            </Button>
          )}
      </div>
      
      {/* Group Description */}
      {groupData.description && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <p>{groupData.description}</p>
          </CardContent>
        </Card>
      )}
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="calendar">
            <CalendarDays className="h-4 w-4 mr-2" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="tasks">
            <CheckSquare className="h-4 w-4 mr-2" />
            Tasks
          </TabsTrigger>
          <TabsTrigger value="discussion">
            <MessageSquare className="h-4 w-4 mr-2" />
            Discussion
          </TabsTrigger>
        </TabsList>
        
        {/* Members Tab */}
        <TabsContent value="members">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Group Members</h2>
            {(groupData.user_role === 'owner' || groupData.user_role === 'admin') && (
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Members
              </Button>
            )}
          </div>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {members.map(member => (
              <Card key={member.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={member.avatar_url || ''} />
                      <AvatarFallback>{member.display_name?.charAt(0) || member.user_id.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                      <div className="font-medium">{member.display_name || `User ${member.user_id.substring(0, 8)}`}</div>
                      <Badge variant={
                        member.role === 'owner' ? 'default' : 
                        member.role === 'admin' ? 'outline' : 'secondary'
                      }>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    </div>
                </div>
              </CardContent>
            </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Calendar Tab */}
        <TabsContent value="calendar">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Group Calendar</h2>
            {(groupData.user_role === 'owner' || 
              groupData.user_role === 'admin' || 
              groupData.user_role === 'member') && (
              <Button onClick={() => {
                // Show event creation dialog
                const eventTitle = window.prompt('Event title:');
                if (!eventTitle) return;
                
                const eventDesc = window.prompt('Event description (optional):');
                const eventLocation = window.prompt('Event location (optional):');
                
                const startDate = window.prompt('Start date and time (YYYY-MM-DD HH:MM):', 
                  new Date().toISOString().slice(0, 16).replace('T', ' '));
                if (!startDate) return;
                
                const endDate = window.prompt('End date and time (YYYY-MM-DD HH:MM):', 
                  new Date(new Date().getTime() + 3600000).toISOString().slice(0, 16).replace('T', ' '));
                if (!endDate) return;
                
                // Create the event
                (async () => {
                  try {
                    setIsLoading(true);
                    const { data, error } = await getGroupEvents(groupId as string, eventTitle, eventDesc || '', new Date(startDate).toISOString(), new Date(endDate).toISOString(), eventLocation || '');
                    
                    if (error) {
                      toast({
                        title: "Error creating event",
                        description: error.message,
                        variant: "destructive"
                      });
                    } else {
                      toast({
                        title: "Event created",
                        description: "Your event has been added to the calendar",
                      });
                      
                      // Reload events
                      loadGroupData();
                    }
                  } catch (err: any) {
                    toast({
                      title: "Error creating event",
                      description: err.message || "An unexpected error occurred",
                      variant: "destructive"
                    });
                  } finally {
                    setIsLoading(false);
                  }
                })();
              }}>
                <Calendar className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            )}
          </div>
          
          {/* Calendar view */}
          <div className="mb-6">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-medium p-2">{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map((day, i) => {
                const dayEvents = getEventsForDay(day);
                const isToday = new Date().toDateString() === day.toDateString();
                
                return (
                  <div 
                    key={i} 
                    className={`p-2 min-h-[100px] border rounded ${isToday ? 'bg-blue-50 border-blue-200' : ''}`}
                  >
                    <div className="text-right text-sm font-medium mb-1">
                      {day.getDate()}
                    </div>
                    {dayEvents.length > 0 ? (
                      <div className="space-y-1">
                        {dayEvents.map(event => (
                          <div 
                            key={event.id}
                            className="text-xs p-1 bg-blue-100 rounded truncate cursor-pointer"
                            onClick={() => {
                              // Show event details
                              toast({
                                title: event.title,
                                description: `${formatDate(event.start_time)} - ${event.description || 'No description'}`,
                              });
                            }}
                          >
                            {event.title}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Event list */}
          <h3 className="text-lg font-medium mb-3">Upcoming Events</h3>
          {events.length > 0 ? (
            <div className="grid gap-4 grid-cols-1">
              {events.map(event => (
                <Card key={event.id}>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>{event.title}</CardTitle>
                      {(groupData.user_role === 'owner' || groupData.user_role === 'admin') && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Delete the event
                            if (window.confirm(`Are you sure you want to delete event "${event.title}"?`)) {
                              (async () => {
                                try {
                                  setIsLoading(true);
                                  const { error } = await getGroupEvents(groupId as string, '', '', '', '', '', event.id);
                                  
                                  if (error) {
                                    toast({
                                      title: "Error deleting event",
                                      description: error.message,
                                      variant: "destructive"
                                    });
                                  } else {
                                    toast({
                                      title: "Event deleted",
                                      description: "The event has been removed from the calendar",
                                    });
                                    
                                    // Reload events
                                    loadGroupData();
                                  }
                                } catch (err: any) {
                                  toast({
                                    title: "Error deleting event",
                                    description: err.message || "An unexpected error occurred",
                                    variant: "destructive"
                                  });
                                } finally {
                                  setIsLoading(false);
                                }
                              })();
                            }
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                    <CardDescription>{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(event.start_time).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(event.start_time).toLocaleTimeString()} - {new Date(event.end_time).toLocaleTimeString()}
                      </span>
                    </div>
                    {event.location && (
                      <div className="mt-2">
                        <span className="font-semibold">Location:</span> {event.location}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No events scheduled yet</p>
              <div className="flex justify-center mt-4 space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Create a sample event
                    (async () => {
                      try {
                        setIsLoading(true);
                        const today = new Date();
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        tomorrow.setHours(10, 0, 0, 0);
                        
                        const endTime = new Date(tomorrow);
                        endTime.setHours(11, 0, 0, 0);
                        
                        const { data, error } = await getGroupEvents(groupId as string, "Group Meeting", "Weekly team check-in and planning session", tomorrow.toISOString(), endTime.toISOString(), "Video Conference");
                        
                        if (error) {
                          toast({
                            title: "Error creating event",
                            description: error.message,
                            variant: "destructive"
                          });
                        } else {
                          toast({
                            title: "Sample event created",
                            description: "A sample event has been added to the calendar",
                          });
                          
                          // Reload events
                          loadGroupData();
                        }
                      } catch (err: any) {
                        toast({
                          title: "Error creating event",
                          description: err.message || "An unexpected error occurred",
                          variant: "destructive"
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    })();
                  }}
                >
                  Create a Sample Event
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setActiveTab('tasks')}
                >
                  Go to Tasks
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Tasks Tab */}
        <TabsContent value="tasks">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Group Tasks</h2>
            {(groupData.user_role === 'owner' || 
              groupData.user_role === 'admin' || 
              groupData.user_role === 'member') && (
              <Button onClick={() => {
                // Show task creation dialog
                const taskTitle = window.prompt('Task title:');
                if (!taskTitle) return;
                
                const taskDesc = window.prompt('Task description (optional):');
                
                const dueDate = window.prompt('Due date (YYYY-MM-DD):', 
                  new Date(new Date().getTime() + 86400000 * 3).toISOString().split('T')[0]);
                if (!dueDate) return;
                
                // Get list of members for assignment
                const memberOptions = members.map(member => ({
                  id: member.user_id,
                  name: member.display_name || `User ${member.user_id.substring(0, 8)}`
                }));
                
                // Create a numbered list for selection
                const membersList = memberOptions.map((member, index) => 
                  `${index + 1}. ${member.name}`).join('\n');
                
                const assigneeIndex = parseInt(window.prompt(
                  `Assign to (enter number):\n${membersList}`) || '0') - 1;
                
                const assigneeId = memberOptions[assigneeIndex]?.id || null;
                
                const priority = window.prompt('Priority (low, medium, high):', 'medium');
                
                // Create the task
                (async () => {
                  try {
                    setIsLoading(true);
                    const { data, error } = await getTasks(groupId as string, taskTitle, taskDesc || '', new Date(dueDate).toISOString(), assigneeId || '');
                    
                    if (error) {
                      toast({
                        title: "Error creating task",
                        description: error.message,
                        variant: "destructive"
                      });
                    } else {
                      toast({
                        title: "Task created",
                        description: "Your task has been added to the group",
                      });
                      
                      // Reload tasks
                      loadGroupData();
                    }
                  } catch (err: any) {
                    toast({
                      title: "Error creating task",
                      description: err.message || "An unexpected error occurred",
                      variant: "destructive"
                    });
                  } finally {
                    setIsLoading(false);
                  }
                })();
              }}>
                <CheckSquare className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
          
          {/* Task filters */}
          <div className="mb-4 flex space-x-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              className="mb-2"
              onClick={() => {
                // Filter for all tasks
                loadGroupData();
              }}
            >
              All
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="mb-2"
              onClick={() => {
                // Filter for pending tasks
                setTasks(tasks.filter(task => task.status === 'pending'));
              }}
            >
              Pending
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="mb-2"
              onClick={() => {
                // Filter for in-progress tasks
                setTasks(tasks.filter(task => task.status === 'in_progress'));
              }}
            >
              In Progress
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="mb-2"
              onClick={() => {
                // Filter for completed tasks
                setTasks(tasks.filter(task => task.status === 'completed'));
              }}
            >
              Completed
            </Button>
          </div>
          
          {tasks.length > 0 ? (
            <div className="grid gap-4 grid-cols-1">
              {tasks.map(task => (
                <Card key={task.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{task.title}</CardTitle>
                      <div className="flex">
                        <div className="flex mr-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              // Toggle task status
                              const nextStatus = task.status === 'pending' ? 'in_progress' : 
                                                task.status === 'in_progress' ? 'completed' : 'pending';
                              
                              handleUpdateTaskStatus(task.id, nextStatus as 'pending' | 'in_progress' | 'completed' | 'cancelled');
                            }}
                          >
                            Next Status
                          </Button>
                        </div>
                        
                        {(groupData.user_role === 'owner' || groupData.user_role === 'admin') && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              // Delete the task
                              if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
                                (async () => {
                                  try {
                                    setIsLoading(true);
                                    const { error } = await getTasks(groupId as string, '', '', '', '', '', '', task.id);
                                    
                                    if (error) {
                                      toast({
                                        title: "Error deleting task",
                                        description: error.message,
                                        variant: "destructive"
                                      });
                                    } else {
                                      toast({
                                        title: "Task deleted",
                                        description: "The task has been removed",
                                      });
                                      
                                      // Reload tasks
                                      loadGroupData();
                                    }
                                  } catch (err: any) {
                                    toast({
                                      title: "Error deleting task",
                                      description: err.message || "An unexpected error occurred",
                                      variant: "destructive"
                                    });
                                  } finally {
                                    setIsLoading(false);
                                  }
                                })();
                              }
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </div>
                      <Badge variant={
                        task.status === 'completed' ? 'default' : 
                        task.status === 'in_progress' ? 'outline' : 
                        'secondary'
                      }>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {task.description && <p className="mb-2">{task.description}</p>}
                    <div className="flex justify-between text-sm text-gray-500">
                      <div>
                        Priority: <Badge variant={
                          task.priority === 'high' ? 'destructive' : 
                          task.priority === 'medium' ? 'default' : 
                          'outline'
                        }>
                          {task.priority}
                        </Badge>
                      </div>
                      {task.due_date && (
                        <div>
                          Due: {new Date(task.due_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    {task.assigned_to && (
                      <div className="mt-2 text-sm text-gray-500">
                        Assigned to: {members.find(m => m.user_id === task.assigned_to)?.display_name || 
                          `User ${task.assigned_to.substring(0, 8)}`}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No tasks created yet</p>
              <div className="flex justify-center mt-4 space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Create sample tasks
                    (async () => {
                      try {
                        setIsLoading(true);
                        
                        // Create three sample tasks with different statuses
                        const today = new Date();
                        const tomorrow = new Date(today);
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        
                        const nextWeek = new Date(today);
                        nextWeek.setDate(nextWeek.getDate() + 7);
                        
                        const sampleTasks = [
                          {
                            title: "Schedule medical appointment",
                            description: "Call Dr. Smith's office to schedule the next check-up",
                            due_date: tomorrow.toISOString(),
                            status: 'pending',
                            priority: 'high'
                          },
                          {
                            title: "Pick up prescription",
                            description: "Don't forget to bring the insurance card",
                            due_date: nextWeek.toISOString(),
                            status: 'in_progress',
                            priority: 'medium'
                          },
                          {
                            title: "Organize group activity",
                            description: "Plan details for the monthly get-together",
                            due_date: nextWeek.toISOString(),
                            status: 'pending',
                            priority: 'low'
                          }
                        ];
                        
                        for (const task of sampleTasks) {
                          await getTasks(groupId as string, task.title, task.description, task.due_date, session?.user?.id || '');
                        }
                        
                        toast({
                          title: "Sample tasks created",
                          description: "Sample tasks have been added to the group",
                        });
                        
                        // Reload tasks
                        loadGroupData();
                      } catch (err: any) {
                        toast({
                          title: "Error creating sample tasks",
                          description: err.message || "An unexpected error occurred",
                          variant: "destructive"
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    })();
                  }}
                >
                  Create Sample Tasks
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setActiveTab('calendar')}
                >
                  Go to Calendar
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setActiveTab('discussion')}
                >
                  Go to Discussion
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        {/* Discussion Tab */}
        <TabsContent value="discussion">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Group Discussion</h2>
            {(groupData.user_role === 'owner' || 
              groupData.user_role === 'admin' || 
              groupData.user_role === 'member') && (
              <Button onClick={() => {
                // Show post creation dialog
                const postContent = window.prompt('What would you like to share with the group?');
                if (!postContent) return;
                
                // Create the post
                (async () => {
                  try {
                    setIsLoading(true);
                    const { data, error } = await getGroupPosts(groupId as string, postContent);
                    
                    if (error) {
                      toast({
                        title: "Error creating post",
                        description: error.message,
                        variant: "destructive"
                      });
                    } else {
                      toast({
                        title: "Post created",
                        description: "Your message has been shared with the group",
                      });
                      
                      // Reload posts
                      loadGroupData();
                    }
                  } catch (err: any) {
                    toast({
                      title: "Error creating post",
                      description: err.message || "An unexpected error occurred",
                      variant: "destructive"
                    });
                  } finally {
                    setIsLoading(false);
                  }
                })();
              }}>
                <MessageSquare className="h-4 w-4 mr-2" />
                New Post
              </Button>
            )}
          </div>
          
          {/* Post creation form */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session?.user?.user_metadata?.avatar_url || ''} />
                  <AvatarFallback>{session?.user?.email?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <textarea 
                    className="w-full p-3 border rounded-md text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    placeholder="Share updates, questions, or thoughts with your care group..."
                    onKeyDown={(e) => {
                      // Submit on Ctrl+Enter
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        const content = (e.target as HTMLTextAreaElement).value.trim();
                        if (content) {
                          // Create the post
                          (async () => {
                            try {
                              setIsLoading(true);
                              const { data, error } = await getGroupPosts(groupId as string, content);
                              
                              if (error) {
                                toast({
                                  title: "Error creating post",
                                  description: error.message,
                                  variant: "destructive"
                                });
                              } else {
                                toast({
                                  title: "Post created",
                                  description: "Your message has been shared with the group",
                                });
                                
                                // Clear the textarea
                                (e.target as HTMLTextAreaElement).value = '';
                                
                                // Reload posts
                                loadGroupData();
                              }
                            } catch (err: any) {
                              toast({
                                title: "Error creating post",
                                description: err.message || "An unexpected error occurred",
                                variant: "destructive"
                              });
                            } finally {
                              setIsLoading(false);
                            }
                          })();
                        }
                      }
                    }}
                  ></textarea>
                  <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                    <div>Tip: Press Ctrl+Enter to post</div>
                    <Button size="sm" onClick={(e) => {
                      const textarea = (e.target as HTMLElement).closest('.flex-1')?.querySelector('textarea');
                      const content = textarea?.value.trim();
                      
                      if (content) {
                        // Create the post
                        (async () => {
                          try {
                            setIsLoading(true);
                            const { data, error } = await getGroupPosts(groupId as string, content);
                            
                            if (error) {
                              toast({
                                title: "Error creating post",
                                description: error.message,
                                variant: "destructive"
                              });
                            } else {
                              toast({
                                title: "Post created",
                                description: "Your message has been shared with the group",
                              });
                              
                              // Clear the textarea
                              if (textarea) textarea.value = '';
                              
                              // Reload posts
                              loadGroupData();
                            }
                          } catch (err: any) {
                            toast({
                              title: "Error creating post",
                              description: err.message || "An unexpected error occurred",
                              variant: "destructive"
                            });
                          } finally {
                            setIsLoading(false);
                          }
                        })();
                      }
                    }}>
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {posts.length > 0 ? (
            <div className="grid gap-4 grid-cols-1">
              {posts.map(post => (
                <Card key={post.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={post.author_avatar || ''} />
                          <AvatarFallback>{post.author_name?.charAt(0) || post.created_by.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{post.author_name || `User ${post.created_by.substring(0, 8)}`}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(post.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      
                      {(groupData.user_role === 'owner' || 
                        groupData.user_role === 'admin' || 
                        session?.user?.id === post.created_by) && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            // Delete the post
                            if (window.confirm("Are you sure you want to delete this post?")) {
                              handleDeletePost(post.id);
                            }
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p>{post.content}</p>
                  </CardContent>
                  <CardFooter className="pt-0 text-sm text-gray-500">
                    <div className="flex space-x-4">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          handleAddComment(post.id, '');
                        }}
                      >
                        {post.like_count || 0} Likes
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-gray-500 hover:text-gray-700"
                        onClick={() => {
                          const comment = window.prompt("Add a comment:");
                          if (!comment) return;
                          
                          handleAddComment(post.id, comment);
                        }}
                      >
                        {post.comment_count || 0} Comments
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>No posts yet. Start a conversation!</p>
              <div className="flex justify-center mt-4 space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    // Create sample posts
                    (async () => {
                      try {
                        setIsLoading(true);
                        
                        const samplePosts = [
                          "Hi everyone! I'm excited to be part of this care group and look forward to supporting each other.",
                          "Just a reminder that we have a group video call scheduled for next Tuesday at 7 PM. Hope everyone can join!",
                          "Does anyone have recommendations for meal delivery services? Looking for options to help out during busy weeks."
                        ];
                        
                        for (const content of samplePosts) {
                          await getGroupPosts(groupId as string, content);
                        }
                        
                        toast({
                          title: "Sample posts created",
                          description: "Sample conversation has been added to the group",
                        });
                        
                        // Reload posts
                        loadGroupData();
                      } catch (err: any) {
                        toast({
                          title: "Error creating sample posts",
                          description: err.message || "An unexpected error occurred",
                          variant: "destructive"
                        });
                      } finally {
                        setIsLoading(false);
                      }
                    })();
                  }}
                >
                  Create Sample Discussion
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setActiveTab('calendar')}
                >
                  Go to Calendar
                </Button>
                <Button 
                  variant="ghost"
                  onClick={() => setActiveTab('tasks')}
                >
                  Go to Tasks
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Fix the task status update function
const handleUpdateTaskStatus = async (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
  try {
    setIsLoading(true);
    const { error } = await getTasks(
      groupId as string, 
      undefined, 
      undefined, 
      undefined, 
      undefined, 
      undefined,
      newStatus,
      taskId
    );
    
    if (error) {
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Task status has been updated",
      });
      
      // Refresh tasks
      const { data } = await getTasks(groupId as string);
      if (Array.isArray(data)) {
        setTasks(data);
      }
    }
  } catch (error: any) {
    console.error('Error updating task status:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to update task",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

// Fix the deletePost function
const handleDeletePost = async (postId: string) => {
  try {
    setIsLoading(true);
    const { error } = await getGroupPosts(
      groupId as string, 
      undefined, 
      undefined, 
      undefined, 
      undefined, 
      undefined, 
      undefined,
      postId
    );
    
    if (error) {
      toast({
        title: "Error",
        description: `Failed to delete post: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Post has been deleted",
      });
      
      // Refresh posts
      const { data } = await getGroupPosts(groupId as string);
      if (Array.isArray(data)) {
        setPosts(data);
      }
    }
  } catch (error: any) {
    console.error('Error deleting post:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to delete post",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
};

// Fix the addComment function
const handleAddComment = async (postId: string, comment: string) => {
  try {
    setIsLoading(true);
    const { error } = await getGroupPosts(
      groupId as string, 
      undefined, 
      undefined, 
      undefined, 
      undefined, 
      undefined, 
      undefined,
      postId,
      comment
    );
    
    if (error) {
      toast({
        title: "Error",
        description: `Failed to add comment: ${error.message}`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Comment has been added",
      });
      
      // Refresh posts
      const { data } = await getGroupPosts(groupId as string);
      if (Array.isArray(data)) {
        setPosts(data);
      }
    }
  } catch (error: any) {
    console.error('Error adding comment:', error);
    toast({
      title: "Error",
      description: error.message || "Failed to add comment",
      variant: "destructive",
    });
  } finally {
    setIsLoading(false);
  }
}; 