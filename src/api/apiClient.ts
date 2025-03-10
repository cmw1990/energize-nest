import { getToken } from '../utils/auth';
import { supabase } from '../lib/supabase';

// Environment variables for API access
export const API_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Standard API client for making requests to the backend
 * No Supabase client dependency, just using fetch API
 */

// Core API request function
export const apiRequest = async (
  endpoint: string, 
  options: RequestInit = {}, 
  customHeaders: Record<string, string> = {}
): Promise<{ data: any, error: any }> => {
  try {
    // Get auth token if available
    const token = getToken();
    
    // Default headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'apikey': API_KEY,
      'Authorization': token ? `Bearer ${token}` : `Bearer ${API_KEY}`,
      'Prefer': 'return=representation'
    };
    
    // Merge headers
    const headers = {
      ...defaultHeaders,
      ...customHeaders,
      ...(options.headers || {})
    };
    
    // Make the request
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Parse response
    const responseData = await response.json();
    
    // Return standardized response format
    if (!response.ok) {
      return { data: null, error: responseData };
    }
    
    return { data: responseData, error: null };
  } catch (error) {
    console.error('API request error:', error);
    return { 
      data: null, 
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: error
      } 
    };
  }
};

// REST API Functions
export const restApi = {
  // GET request to fetch data
  get: async (path: string, queryParams: Record<string, string> = {}) => {
    // Build URL with query parameters
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=eq.${encodeURIComponent(value)}`)
      .join('&');
    
    const endpoint = `${path}${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint, { method: 'GET' });
  },
  
  // POST request to create data
  post: async (path: string, data: any) => {
    return apiRequest(path, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },
  
  // PUT request to replace data
  put: async (path: string, data: any) => {
    return apiRequest(path, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  },
  
  // PATCH request to update data
  patch: async (path: string, data: any, queryParams: Record<string, string> = {}) => {
    // Build URL with query parameters
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=eq.${encodeURIComponent(value)}`)
      .join('&');
    
    const endpoint = `${path}${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  },
  
  // DELETE request to remove data
  delete: async (path: string, queryParams: Record<string, string> = {}) => {
    // Build URL with query parameters
    const queryString = Object.entries(queryParams)
      .map(([key, value]) => `${encodeURIComponent(key)}=eq.${encodeURIComponent(value)}`)
      .join('&');
    
    const endpoint = `${path}${queryString ? `?${queryString}` : ''}`;
    
    return apiRequest(endpoint, { method: 'DELETE' });
  }
};

// RPC Function caller
export const rpc = {
  call: async (functionName: string, params: Record<string, any> = {}) => {
    return apiRequest(`/rest/v1/rpc/${functionName}`, {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }
};

// Care Connector Specific API Functions
export const careConnector = {
  // Group functions
  groups: {
    // Get user's groups
    getUserGroups: async () => {
      try {
        // Get the current user's session
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user?.id;
        
        if (!userId) {
          throw new Error('No authenticated user found');
        }
        
        // Query the care8_group_members table instead of care_group_members
        return apiRequest(`/rest/v1/care8_group_members?user_id=eq.${userId}&select=group_id`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error in getUserGroups:', error);
        return { data: null, error };
      }
    },
    
    // Get public groups
    getPublicGroups: async () => {
      try {
        // Use care8_groups instead of care_groups
        return apiRequest('/rest/v1/care8_groups?is_public=eq.true&select=id,name,description,created_at,image_url', {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error in getPublicGroups:', error);
        return { data: null, error };
      }
    },
    
    // Get group details
    getGroupDetails: async (groupId: string) => {
      try {
        // Query the care8_groups table instead of care_groups
        return apiRequest(`/rest/v1/care8_groups?id=eq.${groupId}`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error in getGroupDetails:', error);
        return { data: null, error };
      }
    },
    
    // Create a new group
    createGroup: async (name: string, description: string, isPublic: boolean) => {
      try {
        // Get the current user's session
        const session = await supabase.auth.getSession();
        if (!session.data.session?.user) {
          return { data: null, error: { message: 'No authenticated user found' } };
        }
        
        // Create the group in care8_groups table
        const response = await apiRequest('/rest/v1/care8_groups', {
          method: 'POST',
          body: JSON.stringify({
            name,
            description,
            is_public: isPublic,
            created_by: session.data.session.user.id,
            created_at: new Date().toISOString()
          })
        });

        if (response.error) {
          console.error('Error creating group:', response.error);
          return response;
        }

        // If group creation was successful, add the creator as an owner
        const groupId = response.data?.[0]?.id;
        
        if (!groupId) {
          return { data: null, error: { message: 'Failed to get group ID after creation' } };
        }

        // Add the user as an owner of the group in care8_group_members
        const memberResponse = await apiRequest('/rest/v1/care8_group_members', {
          method: 'POST',
          body: JSON.stringify({
            group_id: groupId,
            user_id: session.data.session.user.id,
            role: 'owner',
            joined_at: new Date().toISOString()
          })
        });

        if (memberResponse.error) {
          console.error('Error adding user as group owner:', memberResponse.error);
          // We still return the group creation as successful since the group exists
          return response;
        }

        return response;
      } catch (error) {
        console.error('Error in createGroup:', error);
        return { data: null, error };
      }
    },
    
    // Join a group
    joinGroup: async (groupId: string) => {
      // First, get the current authenticated user's ID
      const authResponse = await apiRequest('/auth/v1/user', { method: 'GET' });
      
      if (authResponse.error) {
        console.error('Error getting user:', authResponse.error);
        return { data: null, error: authResponse.error };
      }
      
      const userId = authResponse.data?.id;
      
      if (!userId) {
        return { data: null, error: { message: 'User not authenticated' } };
      }
      
      // Now join the group
      return apiRequest('/rest/v1/care8_group_members', {
        method: 'POST',
        body: JSON.stringify({
          group_id: groupId,
          user_id: userId,
          role: 'member',
          joined_at: new Date().toISOString(),
        }),
      });
    },
    
    // Leave a group
    leaveGroup: async (groupId: string) => {
      // Using direct REST API call instead of RPC function
      return apiRequest(`/rest/v1/care8_group_members?group_id=eq.${groupId}`, {
        method: 'DELETE'
      });
    },
    
    // Search groups by name or description
    searchGroups: async (searchTerm: string) => {
      try {
        return apiRequest(`/rest/v1/care8_groups?or=(name.ilike.%${encodeURIComponent(searchTerm)}%,description.ilike.%${encodeURIComponent(searchTerm)}%)`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error searching groups:', error);
        return { data: null, error };
      }
    },
    
    // Get groups by category (implemented through tags)
    getGroupsByCategory: async (category: string) => {
      try {
        // This would be more robust with a proper tagging system
        return apiRequest(`/rest/v1/care8_groups?description.ilike.%${encodeURIComponent(category)}%`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error getting groups by category:', error);
        return { data: null, error };
      }
    },
    
    // Update group details
    updateGroup: async (groupId: string, updates: { 
      name?: string; 
      description?: string; 
      is_public?: boolean;
      image_url?: string;
    }) => {
      try {
        return apiRequest(`/rest/v1/care8_groups?id=eq.${groupId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            ...updates,
            updated_at: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error updating group:', error);
        return { data: null, error };
      }
    },
    
    // Delete a group
    deleteGroup: async (groupId: string) => {
      try {
        return apiRequest(`/rest/v1/care8_groups?id=eq.${groupId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting group:', error);
        return { data: null, error };
      }
    },
    
    // Get recent activity for a group
    getGroupActivity: async (groupId: string, limit: number = 10) => {
      try {
        // This combines recent events, posts, and tasks in a single activity feed
        const [eventsRes, postsRes, tasksRes] = await Promise.all([
          apiRequest(`/rest/v1/care8_group_events?group_id=eq.${groupId}&order=created_at.desc&limit=${limit}`, {
            method: 'GET'
          }),
          apiRequest(`/rest/v1/care8_group_posts?group_id=eq.${groupId}&order=created_at.desc&limit=${limit}`, {
            method: 'GET'
          }),
          apiRequest(`/rest/v1/care8_group_tasks?group_id=eq.${groupId}&order=created_at.desc&limit=${limit}`, {
            method: 'GET'
          })
        ]);
        
        // Combine and sort all activities by date
        const events = (eventsRes.data || []).map(event => ({ 
          ...event, 
          type: 'event',
          timestamp: event.created_at
        }));
        
        const posts = (postsRes.data || []).map(post => ({ 
          ...post, 
          type: 'post',
          timestamp: post.created_at  
        }));
        
        const tasks = (tasksRes.data || []).map(task => ({ 
          ...task, 
          type: 'task',
          timestamp: task.created_at
        }));
        
        // Combine all activities and sort by timestamp (most recent first)
        const allActivities = [...events, ...posts, ...tasks]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, limit);
          
        return { data: allActivities, error: null };
      } catch (error) {
        console.error('Error getting group activity:', error);
        return { data: null, error };
      }
    },
    
    // Recommended groups for a user based on their interests and existing memberships
    getRecommendedGroups: async (userId: string, limit: number = 5) => {
      try {
        // First get user's current groups to exclude them
        const { data: userGroups } = await apiRequest(`/rest/v1/care8_group_members?user_id=eq.${userId}&select=group_id`, {
          method: 'GET'
        });
        
        const userGroupIds = (userGroups || []).map(membership => membership.group_id);
        
        // Now get public groups excluding ones the user is already in
        const excludeFilter = userGroupIds.length > 0 
          ? `&id=not.in.(${userGroupIds.join(',')})` 
          : '';
          
        return apiRequest(`/rest/v1/care8_groups?is_public=eq.true${excludeFilter}&limit=${limit}`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error getting recommended groups:', error);
        return { data: null, error };
      }
    },
    
    // Get statistics for a group
    getGroupStats: async (groupId: string) => {
      try {
        const [membersRes, eventsRes, postsRes, tasksRes] = await Promise.all([
          apiRequest(`/rest/v1/care8_group_members?group_id=eq.${groupId}`, {
            method: 'GET'
          }),
          apiRequest(`/rest/v1/care8_group_events?group_id=eq.${groupId}`, {
            method: 'GET'
          }),
          apiRequest(`/rest/v1/care8_group_posts?group_id=eq.${groupId}`, {
            method: 'GET'
          }),
          apiRequest(`/rest/v1/care8_group_tasks?group_id=eq.${groupId}`, {
            method: 'GET'
          })
        ]);
        
        const stats = {
          memberCount: (membersRes.data || []).length,
          eventCount: (eventsRes.data || []).length,
          postCount: (postsRes.data || []).length,
          taskCount: (tasksRes.data || []).length,
          completedTaskCount: (tasksRes.data || []).filter(task => task.status === 'completed').length,
          pendingTaskCount: (tasksRes.data || []).filter(task => task.status === 'pending').length
        };
        
        return { data: stats, error: null };
      } catch (error) {
        console.error('Error getting group stats:', error);
        return { data: null, error };
      }
    }
  },
  
  // Member functions
  members: {
    // Get group members
    getGroupMembers: async (groupId: string) => {
      try {
        return apiRequest(`/rest/v1/care8_group_members?group_id=eq.${groupId}`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error getting group members:', error);
        return { data: null, error };
      }
    },
    
    // Add member to group
    addMemberToGroup: async (groupId: string, userId: string, role: string) => {
      try {
        return apiRequest('/rest/v1/care8_group_members', {
          method: 'POST',
          body: JSON.stringify({
            group_id: groupId,
            user_id: userId,
            role,
            joined_at: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error adding member to group:', error);
        return { data: null, error };
      }
    },
    
    // Update member role
    updateMemberRole: async (memberId: string, role: string) => {
      try {
        // Use care8_group_members instead of care_group_members
        return apiRequest(`/rest/v1/care8_group_members?id=eq.${memberId}`, {
          method: 'PATCH',
          body: JSON.stringify({ role })
        });
      } catch (error) {
        console.error('Error updating member role:', error);
        return { data: null, error };
      }
    },
    
    // Remove member from group
    removeGroupMember: async (memberId: string) => {
      try {
        // Use care8_group_members instead of care_group_members
        return apiRequest(`/rest/v1/care8_group_members?id=eq.${memberId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error removing group member:', error);
        return { data: null, error };
      }
    }
  },
  
  // Task functions
  tasks: {
    // Get group tasks
    getGroupTasks: async (groupId: string) => {
      try {
        // Query the care8_group_tasks table instead of care_group_tasks
        return apiRequest(`/rest/v1/care8_group_tasks?group_id=eq.${groupId}&order=due_date.asc`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error in getGroupTasks:', error);
        return { data: null, error };
      }
    },
    
    // Create a task
    createTask: async (groupId: string, title: string, description: string, dueDate: string, assignedTo: string) => {
      try {
        // Get the current user's session
        const session = await supabase.auth.getSession();
        if (!session.data.session?.user) {
          return { data: null, error: { message: 'No authenticated user found' } };
        }
        
        // Create task in care8_group_tasks
        return apiRequest('/rest/v1/care8_group_tasks', {
          method: 'POST',
          body: JSON.stringify({
            group_id: groupId,
            title,
            description,
            due_date: dueDate,
            assigned_to: assignedTo,
            status: 'pending',
            created_by: session.data.session.user.id,
            created_at: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error in createTask:', error);
        return { data: null, error };
      }
    },
    
    // Update a task
    updateTask: async (taskId: string, updates: any) => {
      try {
        // Use care8_group_tasks instead of care_tasks
        return apiRequest(`/rest/v1/care8_group_tasks?id=eq.${taskId}`, {
          method: 'PATCH',
          body: JSON.stringify(updates)
        });
      } catch (error) {
        console.error('Error updating task:', error);
        return { data: null, error };
      }
    },
    
    // Delete a task
    deleteTask: async (taskId: string) => {
      try {
        // Use care8_group_tasks instead of care_tasks
        return apiRequest(`/rest/v1/care8_group_tasks?id=eq.${taskId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting task:', error);
        return { data: null, error };
      }
    },
    
    // Update a task status
    updateTaskStatus: async (taskId: string, status: string) => {
      try {
        // Update task in care8_group_tasks
        return apiRequest(`/rest/v1/care8_group_tasks?id=eq.${taskId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status,
            updated_at: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error in updateTaskStatus:', error);
        return { data: null, error };
      }
    }
  },
  
  // Event functions
  events: {
    // Get group events
    getGroupEvents: async (groupId: string) => {
      try {
        // Query the care8_group_events table instead of care_group_events
        return apiRequest(`/rest/v1/care8_group_events?group_id=eq.${groupId}&order=start_time.asc`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error in getGroupEvents:', error);
        return { data: null, error };
      }
    },
    
    // Create an event
    createEvent: async (groupId: string, title: string, description: string, startTime: string, endTime: string, location: string) => {
      try {
        // Get the current user's session
        const session = await supabase.auth.getSession();
        if (!session.data.session?.user) {
          return { data: null, error: { message: 'No authenticated user found' } };
        }
        
        // Create event in care8_group_events
        return apiRequest('/rest/v1/care8_group_events', {
          method: 'POST',
          body: JSON.stringify({
            group_id: groupId,
            title,
            description,
            start_time: startTime,
            end_time: endTime,
            location,
            created_by: session.data.session.user.id,
            created_at: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error in createEvent:', error);
        return { data: null, error };
      }
    },
    
    // Update an event
    updateEvent: async (eventId: string, updates: any) => {
      try {
        // Use care8_group_events instead of care_group_events
        return apiRequest(`/rest/v1/care8_group_events?id=eq.${eventId}`, {
          method: 'PATCH',
          body: JSON.stringify(updates)
        });
      } catch (error) {
        console.error('Error updating event:', error);
        return { data: null, error };
      }
    },
    
    // Delete an event
    deleteEvent: async (eventId: string) => {
      try {
        // Use care8_group_events instead of care_group_events
        return apiRequest(`/rest/v1/care8_group_events?id=eq.${eventId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting event:', error);
        return { data: null, error };
      }
    }
  },
  
  // Post functions
  posts: {
    // Get group posts
    getGroupPosts: async (groupId: string) => {
      try {
        // Try to fetch posts, but handle the case where the table doesn't exist
        const response = await apiRequest(`/rest/v1/care8_group_posts?group_id=eq.${groupId}`, {
          method: 'GET'
        });
        
        // If the error is about the table not existing, return empty array instead of error
        if (response.error && response.error.code === '42P01') {
          console.warn('Posts table does not exist yet, returning empty array');
          return { data: [], error: null };
        }
        
        return response;
      } catch (error) {
        console.error('Error getting group posts:', error);
        return { data: [], error }; // Return empty array instead of null
      }
    },
    
    // Get a single post
    getPost: async (postId: string) => {
      try {
        // Use care8_group_posts instead of care_group_posts
        return apiRequest(`/rest/v1/care8_group_posts?id=eq.${postId}`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error getting post:', error);
        return { data: null, error };
      }
    },
    
    // Create a post
    createPost: async (groupId: string, content: string) => {
      try {
        // Get the current user session
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user?.id;

        // Use care8_group_posts instead of care_group_posts
        return apiRequest('/rest/v1/care8_group_posts', {
          method: 'POST',
          body: JSON.stringify({
            group_id: groupId,
            content,
            created_by: userId,
            created_at: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error creating post:', error);
        return { data: null, error };
      }
    },
    
    // Update a post
    updatePost: async (postId: string, updates: any) => {
      try {
        // Use care8_group_posts instead of care_group_posts
        return apiRequest(`/rest/v1/care8_group_posts?id=eq.${postId}`, {
          method: 'PATCH',
          body: JSON.stringify(updates)
        });
      } catch (error) {
        console.error('Error updating post:', error);
        return { data: null, error };
      }
    },
    
    // Delete a post
    deletePost: async (postId: string) => {
      try {
        // Use care8_group_posts instead of care_group_posts
        return apiRequest(`/rest/v1/care8_group_posts?id=eq.${postId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting post:', error);
        return { data: null, error };
      }
    },
    
    // Add comment to post
    addComment: async (postId: string, content: string) => {
      try {
        // Get the current user session
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user?.id;

        // Use care8_group_comments instead of care_group_comments
        return apiRequest('/rest/v1/care8_group_comments', {
          method: 'POST',
          body: JSON.stringify({
            post_id: postId,
            content,
            created_by: userId,
            created_at: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error adding comment:', error);
        return { data: null, error };
      }
    },
    
    // Update a comment
    updateComment: async (commentId: string, content: string) => {
      try {
        // Use care8_group_comments instead of care_group_comments
        return apiRequest(`/rest/v1/care8_group_comments?id=eq.${commentId}`, {
          method: 'PATCH',
          body: JSON.stringify({ content })
        });
      } catch (error) {
        console.error('Error updating comment:', error);
        return { data: null, error };
      }
    },
    
    // Delete a comment
    deleteComment: async (commentId: string) => {
      try {
        // Use care8_group_comments instead of care_group_comments
        return apiRequest(`/rest/v1/care8_group_comments?id=eq.${commentId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error deleting comment:', error);
        return { data: null, error };
      }
    }
  },
  
  // Enhanced group features inspired by LotsaHelpingHands
  calendar: {
    // Get upcoming events across all user groups
    getUpcomingEvents: async (limit: number = 10) => {
      return rpc.call('get_user_upcoming_events', { limit_param: limit });
    },
    
    // Register for an event (RSVP)
    registerForEvent: async (eventId: string, status: 'attending' | 'maybe' | 'not_attending' = 'attending') => {
      return rpc.call('register_for_event', { 
        event_id_param: eventId,
        status_param: status
      });
    },
    
    // Get event attendees
    getEventAttendees: async (eventId: string) => {
      return rpc.call('get_event_attendees', { event_id_param: eventId });
    },
    
    // Create a recurring event
    createRecurringEvent: async (
      groupId: string, 
      title: string,
      description: string,
      startTime: string,
      endTime: string | null,
      location: string | null,
      recurrence: 'daily' | 'weekly' | 'monthly',
      endDate: string
    ) => {
      return rpc.call('create_recurring_event', {
        group_id_param: groupId,
        title_param: title,
        description_param: description,
        start_time_param: startTime,
        end_time_param: endTime,
        location_param: location,
        recurrence_param: recurrence,
        end_date_param: endDate
      });
    }
  },
  
  // Health tracking features
  health: {
    // Log a health observation
    logHealthObservation: async (
      groupId: string,
      subjectId: string,
      category: string,
      observation: string,
      severity: 'low' | 'medium' | 'high' = 'medium',
      isPrivate: boolean = false
    ) => {
      return rpc.call('log_health_observation', {
        group_id_param: groupId,
        subject_id_param: subjectId,
        category_param: category,
        observation_param: observation,
        severity_param: severity,
        private_param: isPrivate
      });
    },
    
    // Get health log for a subject
    getHealthLog: async (subjectId: string, startDate: string, endDate: string) => {
      return rpc.call('get_health_log', {
        subject_id_param: subjectId,
        start_date_param: startDate,
        end_date_param: endDate
      });
    }
  },
  
  // Resource sharing
  resources: {
    // Upload a resource
    uploadResource: async (
      groupId: string,
      title: string,
      description: string,
      resourceUrl: string,
      resourceType: 'document' | 'link' | 'contact' | 'other',
      isPublic: boolean = true
    ) => {
      return rpc.call('upload_group_resource', {
        group_id_param: groupId,
        title_param: title,
        description_param: description,
        resource_url_param: resourceUrl,
        resource_type_param: resourceType,
        is_public_param: isPublic
      });
    },
    
    // Get group resources
    getGroupResources: async (groupId: string) => {
      return rpc.call('get_group_resources', { 
        group_id_param: groupId 
      });
    }
  },
  
  // Volunteer management
  volunteers: {
    // Get volunteer opportunities for a group
    getVolunteerOpportunities: async (groupId: string) => {
      try {
        // Query the care8_group_volunteers table instead of care_group_volunteers
        return apiRequest(`/rest/v1/care8_group_volunteers?group_id=eq.${groupId}&order=start_time.asc`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error in getVolunteerOpportunities:', error);
        return { data: null, error };
      }
    },
    
    // Create a volunteer opportunity
    createVolunteerOpportunity: async (groupId: string, title: string, description: string, startTime: string, endTime: string, location: string, maxVolunteers: number) => {
      try {
        // Get the current user's session
        const session = await supabase.auth.getSession();
        if (!session.data.session?.user) {
          return { data: null, error: { message: 'No authenticated user found' } };
        }
        
        // Create opportunity in care8_group_volunteers
        return apiRequest('/rest/v1/care8_group_volunteers', {
          method: 'POST',
          body: JSON.stringify({
            group_id: groupId,
            title,
            description,
            start_time: startTime,
            end_time: endTime,
            location,
            max_volunteers: maxVolunteers || 1,
            created_by: session.data.session.user.id,
            created_at: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error in createVolunteerOpportunity:', error);
        return { data: null, error };
      }
    },
    
    // Sign up for volunteer opportunity
    volunteerSignup: async (opportunityId: string) => {
      return rpc.call('volunteer_signup', { 
        opportunity_id_param: opportunityId 
      });
    },
    
    // Get group volunteer opportunities
    getGroupVolunteerOpportunities: async (groupId: string) => {
      return rpc.call('get_group_volunteer_opportunities', { 
        group_id_param: groupId 
      });
    }
  },
  
  // Invitation functions
  invitations: {
    // Get invitations for a user by email
    getUserInvitations: async (email: string) => {
      try {
        // Query the care8_group_invitations table instead of care_group_invitations
        return apiRequest(`/rest/v1/care8_group_invitations?invited_email=eq.${encodeURIComponent(email)}&status=eq.pending&select=id,group_id`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error in getUserInvitations:', error);
        return { data: null, error };
      }
    },
    
    // Get invitation details
    getInvitationDetails: async (invitationId: string) => {
      try {
        // Use care8_group_invitations instead of care_group_invitations
        return apiRequest(`/rest/v1/care8_group_invitations?id=eq.${invitationId}`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error getting invitation details:', error);
        return { data: null, error };
      }
    },
    
    // Accept an invitation
    acceptInvitation: async (invitationId: string, userId: string) => {
      try {
        // First get the invitation details
        const { data: invitationData, error: invitationError } = await apiRequest(
          `/rest/v1/care8_group_invitations?id=eq.${invitationId}&select=id,group_id`,
          { method: 'GET' }
        );

        if (invitationError || !invitationData || invitationData.length === 0) {
          return { data: null, error: invitationError || { message: 'Invitation not found' } };
        }

        const groupId = invitationData[0].group_id;

        // Add user to the group
        const { data: memberData, error: memberError } = await apiRequest(
          '/rest/v1/care8_group_members',
          {
            method: 'POST',
            body: JSON.stringify({
              group_id: groupId,
              user_id: userId,
              role: 'member',
              joined_at: new Date().toISOString()
            })
          }
        );

        if (memberError) {
          return { data: null, error: memberError };
        }

        // Update invitation status to accepted
        const { data: updateData, error: updateError } = await apiRequest(
          `/rest/v1/care8_group_invitations?id=eq.${invitationId}`,
          { 
            method: 'PATCH',
            body: JSON.stringify({
              status: 'accepted'
            })
          }
        );

        if (updateError) {
          console.error('Error updating invitation status:', updateError);
          // We still consider this a success since the user is in the group
          return { data: memberData, error: null };
        }

        return { data: memberData, error: null };
      } catch (error) {
        console.error('Error accepting invitation:', error);
        return { data: null, error };
      }
    },
    
    // Decline an invitation
    declineInvitation: async (invitationId: string) => {
      try {
        // Update invitation in care8_group_invitations
        return apiRequest(`/rest/v1/care8_group_invitations?id=eq.${invitationId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: 'declined'
          })
        });
      } catch (error) {
        console.error('Error declining invitation:', error);
        return { data: null, error };
      }
    },
    
    // Create an invitation
    createInvitation: async (groupId: string, email: string) => {
      try {
        // Get the current user's session
        const session = await supabase.auth.getSession();
        if (!session.data.session?.user) {
          return { data: null, error: { message: 'No authenticated user found' } };
        }
        
        // Create invitation in care8_group_invitations
        return apiRequest('/rest/v1/care8_group_invitations', {
          method: 'POST',
          body: JSON.stringify({
            group_id: groupId,
            invited_email: email,
            invited_by: session.data.session.user.id,
            status: 'pending',
            created_at: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error in createInvitation:', error);
        return { data: null, error };
      }
    }
  },
  
  // Advanced search functions
  search: {
    // Advanced group search with filters
    advancedGroupSearch: async (params: {
      searchTerm?: string;
      isPublic?: boolean;
      memberCountMin?: number;
      memberCountMax?: number;
      createdAfter?: string;
      createdBefore?: string;
      sortBy?: 'name' | 'created_at' | 'member_count';
      sortDirection?: 'asc' | 'desc';
      limit?: number;
      offset?: number;
    }) => {
      try {
        // Build query parameters
        const queryParts = [];
        
        // Text search
        if (params.searchTerm) {
          queryParts.push(`or=(name.ilike.%${encodeURIComponent(params.searchTerm)}%,description.ilike.%${encodeURIComponent(params.searchTerm)}%)`);
        }
        
        // Is public filter
        if (params.isPublic !== undefined) {
          queryParts.push(`is_public=eq.${params.isPublic}`);
        }
        
        // Date range filters
        if (params.createdAfter) {
          queryParts.push(`created_at=gt.${params.createdAfter}`);
        }
        
        if (params.createdBefore) {
          queryParts.push(`created_at=lt.${params.createdBefore}`);
        }
        
        // Sorting
        let orderBy = 'created_at.desc'; // default sorting
        if (params.sortBy) {
          orderBy = `${params.sortBy}.${params.sortDirection || 'asc'}`;
        }
        queryParts.push(`order=${orderBy}`);
        
        // Pagination
        if (params.limit) {
          queryParts.push(`limit=${params.limit}`);
        }
        
        if (params.offset) {
          queryParts.push(`offset=${params.offset}`);
        }
        
        // Member count filters need to be applied after fetching results
        const queryString = queryParts.join('&');
        
        // First get the groups
        const { data: groups, error } = await apiRequest(`/rest/v1/care8_groups?${queryString}`, {
          method: 'GET'
        });
        
        if (error || !groups) {
          return { data: null, error };
        }
        
        // If we have member count filters, we need to fetch member counts
        if (params.memberCountMin !== undefined || params.memberCountMax !== undefined) {
          // Get member counts for all the groups
          const groupIds = groups.map((group: any) => group.id);
          
          // Skip if no groups were found
          if (groupIds.length === 0) {
            return { data: [], error: null };
          }
          
          const { data: members } = await apiRequest(`/rest/v1/care8_group_members?group_id=in.(${groupIds.join(',')})`, {
            method: 'GET'
          });
          
          // Count members per group
          const memberCounts: Record<string, number> = {};
          if (members) {
            members.forEach((member: any) => {
              memberCounts[member.group_id] = (memberCounts[member.group_id] || 0) + 1;
            });
          }
          
          // Filter groups by member count
          const filteredGroups = groups.filter((group: any) => {
            const count = memberCounts[group.id] || 0;
            
            // Apply min filter if specified
            if (params.memberCountMin !== undefined && count < params.memberCountMin) {
              return false;
            }
            
            // Apply max filter if specified
            if (params.memberCountMax !== undefined && count > params.memberCountMax) {
              return false;
            }
            
            return true;
          });
          
          // Add member count to each group
          filteredGroups.forEach((group: any) => {
            group.member_count = memberCounts[group.id] || 0;
          });
          
          return { data: filteredGroups, error: null };
        }
        
        // If no member count filters, just return the groups
        return { data: groups, error: null };
      } catch (error) {
        console.error('Error in advanced group search:', error);
        return { data: null, error };
      }
    },
    
    // Find members with specific skills or roles
    findMembersWithSkills: async (groupId: string, skills: string[]) => {
      try {
        // In a real application, you'd have a user_skills table
        // For now, we'll search in user profiles for mentions of the skills
        const { data: members } = await apiRequest(`/rest/v1/care8_group_members?group_id=eq.${groupId}&select=user_id,role`, {
          method: 'GET'
        });
        
        if (!members || members.length === 0) {
          return { data: [], error: null };
        }
        
        const userIds = members.map((member: any) => member.user_id);
        
        // For now, returning all members as we don't have a skills table
        // In a real implementation, you'd filter by skills
        return { 
          data: members.map((member: any) => ({
            ...member,
            skills: [] // Placeholder for real skills data
          })), 
          error: null 
        };
      } catch (error) {
        console.error('Error finding members with skills:', error);
        return { data: null, error };
      }
    },
    
    // Search tasks with filters
    searchTasks: async (params: {
      groupId?: string;
      status?: string;
      priority?: string;
      assignedTo?: string;
      dueBefore?: string;
      dueAfter?: string;
      searchTerm?: string;
      limit?: number;
      offset?: number;
    }) => {
      try {
        const queryParts = [];
        
        // Group filter
        if (params.groupId) {
          queryParts.push(`group_id=eq.${params.groupId}`);
        }
        
        // Status filter
        if (params.status) {
          queryParts.push(`status=eq.${params.status}`);
        }
        
        // Priority filter
        if (params.priority) {
          queryParts.push(`priority=eq.${params.priority}`);
        }
        
        // Assigned to filter
        if (params.assignedTo) {
          queryParts.push(`assigned_to=eq.${params.assignedTo}`);
        }
        
        // Due date filters
        if (params.dueBefore) {
          queryParts.push(`due_date=lt.${params.dueBefore}`);
        }
        
        if (params.dueAfter) {
          queryParts.push(`due_date=gt.${params.dueAfter}`);
        }
        
        // Text search
        if (params.searchTerm) {
          queryParts.push(`or=(title.ilike.%${encodeURIComponent(params.searchTerm)}%,description.ilike.%${encodeURIComponent(params.searchTerm)}%)`);
        }
        
        // Pagination
        if (params.limit) {
          queryParts.push(`limit=${params.limit}`);
        }
        
        if (params.offset) {
          queryParts.push(`offset=${params.offset}`);
        }
        
        const queryString = queryParts.join('&');
        
        return apiRequest(`/rest/v1/care8_group_tasks?${queryString}`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error searching tasks:', error);
        return { data: null, error };
      }
    },
    
    // Search events with filters
    searchEvents: async (params: {
      groupId?: string;
      startAfter?: string;
      startBefore?: string;
      searchTerm?: string;
      limit?: number;
      offset?: number;
    }) => {
      try {
        const queryParts = [];
        
        // Group filter
        if (params.groupId) {
          queryParts.push(`group_id=eq.${params.groupId}`);
        }
        
        // Start date filters
        if (params.startAfter) {
          queryParts.push(`start_time=gt.${params.startAfter}`);
        }
        
        if (params.startBefore) {
          queryParts.push(`start_time=lt.${params.startBefore}`);
        }
        
        // Text search
        if (params.searchTerm) {
          queryParts.push(`or=(title.ilike.%${encodeURIComponent(params.searchTerm)}%,description.ilike.%${encodeURIComponent(params.searchTerm)}%)`);
        }
        
        // Default sorting by start time
        queryParts.push('order=start_time.asc');
        
        // Pagination
        if (params.limit) {
          queryParts.push(`limit=${params.limit}`);
        }
        
        if (params.offset) {
          queryParts.push(`offset=${params.offset}`);
        }
        
        const queryString = queryParts.join('&');
        
        return apiRequest(`/rest/v1/care8_group_events?${queryString}`, {
          method: 'GET'
        });
      } catch (error) {
        console.error('Error searching events:', error);
        return { data: null, error };
      }
    }
  },
  
  // Booking and availability management
  booking: {
    // Get user availability
    getUserAvailability: async (userId: string, startDate: string, endDate: string) => {
      try {
        // Get all events where the user is a member of the group
        const { data: memberships } = await apiRequest(`/rest/v1/care8_group_members?user_id=eq.${userId}&select=group_id`, {
          method: 'GET'
        });
        
        if (!memberships || memberships.length === 0) {
          return { data: [], error: null };
        }
        
        const groupIds = memberships.map((m: any) => m.group_id);
        
        // Get all events for these groups in the date range
        const { data: events } = await apiRequest(
          `/rest/v1/care8_group_events?group_id=in.(${groupIds.join(',')})&start_time=gte.${startDate}&start_time=lt.${endDate}`,
          { method: 'GET' }
        );
        
        return { data: events || [], error: null };
      } catch (error) {
        console.error('Error getting user availability:', error);
        return { data: null, error };
      }
    },
    
    // Get available time slots for a group
    getGroupAvailability: async (groupId: string, date: string) => {
      try {
        // Get all events for this group on the specified date
        // We use start_time for the date filter (assuming format: '2023-01-01')
        const { data: events } = await apiRequest(
          `/rest/v1/care8_group_events?group_id=eq.${groupId}&start_time=gte.${date}&start_time=lt.${date}T23:59:59`,
          { method: 'GET' }
        );
        
        // Convert events to busy time slots
        const busySlots = [];
        if (events && events.length > 0) {
          for (const event of events) {
            const start = new Date(event.start_time);
            const end = event.end_time 
              ? new Date(event.end_time) 
              : new Date(new Date(event.start_time).setHours(new Date(event.start_time).getHours() + 1));
            busySlots.push({ start, end });
          }
        }
        
        // Generate available time slots (30-minute slots from 8 AM to 8 PM)
        const availableSlots = [];
        const dateObj = new Date(date);
        
        // Start at 8 AM
        dateObj.setHours(8, 0, 0, 0);
        
        // Generate slots until 8 PM
        while (dateObj.getHours() < 20) {
          const slotStart = new Date(dateObj);
          
          // Slot duration: 30 minutes
          dateObj.setMinutes(dateObj.getMinutes() + 30);
          
          const slotEnd = new Date(dateObj);
          
          // Check if this slot overlaps with any busy slot
          let isAvailable = true;
          for (const busySlot of busySlots) {
            if (
              (slotStart >= busySlot.start && slotStart < busySlot.end) || 
              (slotEnd > busySlot.start && slotEnd <= busySlot.end) ||
              (slotStart <= busySlot.start && slotEnd >= busySlot.end)
            ) {
              isAvailable = false;
              break;
            }
          }
          
          if (isAvailable) {
            availableSlots.push({
              start: slotStart.toISOString(),
              end: slotEnd.toISOString()
            });
          }
        }
        
        return { data: availableSlots, error: null };
      } catch (error) {
        console.error('Error getting group availability:', error);
        return { data: null, error };
      }
    },
    
    // Book a time slot for a group event
    bookTimeSlot: async (groupId: string, title: string, description: string, startTime: string, endTime: string, location?: string) => {
      try {
        // Get the current user's session
        const session = await supabase.auth.getSession();
        if (!session.data.session?.user) {
          return { data: null, error: { message: 'No authenticated user found' } };
        }
        
        // Create a new event
        return apiRequest('/rest/v1/care8_group_events', {
          method: 'POST',
          body: JSON.stringify({
            group_id: groupId,
            title,
            description,
            start_time: startTime,
            end_time: endTime,
            location,
            created_by: session.data.session.user.id,
            created_at: new Date().toISOString()
          })
        });
      } catch (error) {
        console.error('Error booking time slot:', error);
        return { data: null, error };
      }
    },
    
    // Cancel a booking
    cancelBooking: async (eventId: string) => {
      try {
        return apiRequest(`/rest/v1/care8_group_events?id=eq.${eventId}`, {
          method: 'DELETE'
        });
      } catch (error) {
        console.error('Error canceling booking:', error);
        return { data: null, error };
      }
    },
    
    // Update a booking
    updateBooking: async (eventId: string, updates: {
      title?: string;
      description?: string;
      start_time?: string;
      end_time?: string;
      location?: string;
    }) => {
      try {
        return apiRequest(`/rest/v1/care8_group_events?id=eq.${eventId}`, {
          method: 'PATCH',
          body: JSON.stringify(updates)
        });
      } catch (error) {
        console.error('Error updating booking:', error);
        return { data: null, error };
      }
    },
    
    // Get upcoming events for a user
    getUserUpcomingEvents: async (userId: string, limit: number = 10) => {
      try {
        // Get all groups the user is a member of
        const { data: memberships } = await apiRequest(`/rest/v1/care8_group_members?user_id=eq.${userId}&select=group_id`, {
          method: 'GET'
        });
        
        if (!memberships || memberships.length === 0) {
          return { data: [], error: null };
        }
        
        const groupIds = memberships.map((m: any) => m.group_id);
        
        // Get upcoming events for these groups
        const now = new Date().toISOString();
        const { data: events } = await apiRequest(
          `/rest/v1/care8_group_events?group_id=in.(${groupIds.join(',')})&start_time=gte.${now}&order=start_time.asc&limit=${limit}`,
          { method: 'GET' }
        );
        
        return { data: events || [], error: null };
      } catch (error) {
        console.error('Error getting user upcoming events:', error);
        return { data: null, error };
      }
    }
  }
};

export default {
  restApi,
  rpc,
  careConnector
}; 