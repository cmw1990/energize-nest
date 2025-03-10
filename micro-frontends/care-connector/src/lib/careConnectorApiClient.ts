import { Session } from '@supabase/supabase-js';

// Constants for API endpoints
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Define interfaces
export interface Group {
  id: string;
  name: string;
  description: string;
  created_by: string;
  is_private: boolean;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to?: string;
  assigned_by: string;
  group_id?: string;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}

// Additional interfaces needed by GroupDetail
export interface GroupEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  created_by: string;
  created_at: string;
  group_id: string;
}

export interface GroupPost {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
  author_name?: string;
  author_avatar?: string;
  like_count?: number;
  comment_count?: number;
  comments?: GroupPostComment[];
}

export interface GroupPostComment {
  id: string;
  post_id: string;
  content: string;
  created_at: string;
  created_by: string;
  author_name?: string;
  author_avatar?: string;
}

// Extend GroupMember interface to match usage in GroupDetail
export interface ExtendedGroupMember extends GroupMember {
  display_name?: string;
  avatar_url?: string;
}

// Helper function for API requests
const apiRequest = async (endpoint: string, options: RequestInit = {}, session?: Session) => {
  const headers: Record<string, string> = {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };

  if (session) {
    headers['Authorization'] = `Bearer ${session.access_token}`;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    return { data: await response.json(), error: null };
  } catch (error) {
    console.error('API request error:', error);
    return { data: null, error };
  }
};

// Caregiver Connector API
export const caregiverConnectorApi = {
  // Get all caregivers with optional filters
  getCaregivers: async (filters: Record<string, any> = {}, session: Session) => {
    try {
      let endpoint = '/rest/v1/care8_caregivers?select=*';
      
      // Add filters if provided
      if (filters.specialties) {
        endpoint += `&specialties=cs.{${filters.specialties}}`;
      }
      
      if (filters.hourlyRate) {
        endpoint += `&hourly_rate=ilike.*${filters.hourlyRate}*`;
      }
      
      if (filters.location) {
        endpoint += `&location=ilike.*${filters.location}*`;
      }
      
      if (filters.verified) {
        endpoint += `&verified=eq.${filters.verified}`;
      }
      
      return await apiRequest(endpoint, { method: 'GET' }, session);
    } catch (error) {
      console.error('Error fetching caregivers:', error);
      return { data: [], error };
    }
  },
  
  // Get a single caregiver by ID
  getCaregiverById: async (id: string, session: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_caregivers?id=eq.${id}&select=*`, {
        method: 'GET'
      }, session);
    } catch (error) {
      console.error('Error fetching caregiver:', error);
      return { data: null, error };
    }
  }
};

// Groups API functions
export const getGroups = async (
  session: Session
): Promise<Group[]> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/care8_groups?select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
};

export const createGroup = async (
  group: Omit<Group, 'id' | 'created_at' | 'updated_at'>,
  session: Session
): Promise<Group> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/care8_groups`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...group,
          created_by: session.user.id
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    
    const result = await response.json();
    return Array.isArray(result) ? result[0] : result;
  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};

export const getGroupById = async (
  groupId: string,
  session: Session
): Promise<{ data: Group | null; error: Error | null }> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/care8_groups?id=eq.${groupId}`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    
    const data = await response.json();
    return { data: data[0] || null, error: null };
  } catch (error) {
    console.error('Error fetching group:', error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

export const getGroupMembers = async (
  groupId: string,
  session: Session
): Promise<{ data: ExtendedGroupMember[]; error: Error | null }> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/care8_group_members?group_id=eq.${groupId}&select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    
    const members = await response.json();
    
    // Get user profiles for members
    const memberProfiles = await Promise.all(
      members.map(async (member: GroupMember) => {
        const userResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?id=eq.${member.user_id}&select=display_name,avatar_url`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (userResponse.ok) {
          const userProfiles = await userResponse.json();
          const profile = userProfiles[0] || {};
          return {
            ...member,
            display_name: profile.display_name,
            avatar_url: profile.avatar_url
          };
        }
        
        return member;
      })
    );
    
    return { data: memberProfiles, error: null };
  } catch (error) {
    console.error('Error fetching group members:', error);
    return { data: [], error: error instanceof Error ? error : new Error(String(error)) };
  }
};

export const getTasks = async (
  session: Session,
  groupId?: string
): Promise<Task[]> => {
  try {
    let endpoint = `${SUPABASE_URL}/rest/v1/care8_group_tasks?select=*`;
    
    if (groupId) {
      endpoint += `&group_id=eq.${groupId}`;
    } else {
      // If no group ID, get tasks where the user is the assignee or creator
      endpoint += `&or=(assigned_to.eq.${session.user.id},assigned_by.eq.${session.user.id})`;
    }
    
    const response = await fetch(
      endpoint,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const createTask = async (
  task: Omit<Task, 'id' | 'created_at' | 'updated_at'>,
  session: Session
): Promise<Task> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/care8_group_tasks`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(task)
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    
    return await response.json()[0];
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>,
  session: Session
): Promise<Task> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/care8_group_tasks?id=eq.${taskId}`,
      {
        method: 'PATCH',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...updates,
          updated_at: new Date().toISOString()
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    
    const result = await response.json();
    return Array.isArray(result) ? result[0] : result;
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const getGroupEvents = async (
  groupId: string,
  session: Session
): Promise<{ data: GroupEvent[]; error: Error | null }> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/care8_group_events?group_id=eq.${groupId}&select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    
    return { data: await response.json(), error: null };
  } catch (error) {
    console.error('Error fetching group events:', error);
    return { data: [], error: error instanceof Error ? error : new Error(String(error)) };
  }
};

export const createGroupEvent = async (
  event: Omit<GroupEvent, 'id' | 'created_at'>,
  session: Session
): Promise<{ data: GroupEvent | null; error: Error | null }> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/care8_group_events`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...event,
          created_by: session.user.id
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    
    const result = await response.json();
    return { data: Array.isArray(result) ? result[0] : result, error: null };
  } catch (error) {
    console.error('Error creating group event:', error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

export const getGroupPosts = async (
  groupId: string,
  session: Session
): Promise<{ data: GroupPost[]; error: Error | null }> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/care8_group_posts?group_id=eq.${groupId}&select=*`,
      {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    
    const posts = await response.json();
    
    // Get user profiles for post authors
    const postsWithAuthorInfo = await Promise.all(
      posts.map(async (post: GroupPost) => {
        const userResponse = await fetch(
          `${SUPABASE_URL}/rest/v1/profiles?id=eq.${post.created_by}&select=display_name,avatar_url`,
          {
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${session.access_token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (userResponse.ok) {
          const userProfiles = await userResponse.json();
          const profile = userProfiles[0] || {};
          return {
            ...post,
            author_name: profile.display_name,
            author_avatar: profile.avatar_url
          };
        }
        
        return post;
      })
    );
    
    return { data: postsWithAuthorInfo, error: null };
  } catch (error) {
    console.error('Error fetching group posts:', error);
    return { data: [], error: error instanceof Error ? error : new Error(String(error)) };
  }
};

export const createGroupPost = async (
  post: { content: string; group_id: string },
  session: Session
): Promise<{ data: GroupPost | null; error: Error | null }> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/care8_group_posts`,
      {
        method: 'POST',
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          ...post,
          created_by: session.user.id
        })
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }
    
    const result = await response.json();
    return { data: Array.isArray(result) ? result[0] : result, error: null };
  } catch (error) {
    console.error('Error creating group post:', error);
    return { data: null, error: error instanceof Error ? error : new Error(String(error)) };
  }
};

// Add more functions as needed 