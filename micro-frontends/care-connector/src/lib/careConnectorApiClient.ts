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

// API functions
export const getGroups = async (
  session: Session
): Promise<Group[]> => {
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
};

export const createGroup = async (
  group: Omit<Group, 'id' | 'created_at' | 'updated_at'>,
  session: Session
): Promise<Group> => {
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
      body: JSON.stringify(group)
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || response.statusText);
  }
  
  const result = await response.json();
  return result[0];
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
      return { data: null, error: new Error(error.message || response.statusText) };
    }
    
    const data = await response.json();
    if (data.length === 0) {
      return { data: null, error: new Error('Group not found') };
    }
    
    return { data: data[0], error: null };
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

export const getGroupMembers = async (
  groupId: string,
  session: Session
): Promise<{ data: ExtendedGroupMember[]; error: Error | null }> => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/care8_group_members?group_id=eq.${groupId}&select=*,user_id,profiles:user_id(display_name,avatar_url)`,
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
      return { data: [], error: new Error(error.message || response.statusText) };
    }
    
    const data = await response.json();
    const members: ExtendedGroupMember[] = data.map((member: any) => ({
      ...member,
      display_name: member.profiles?.display_name || '',
      avatar_url: member.profiles?.avatar_url || ''
    }));
    
    return { data: members, error: null };
  } catch (error) {
    return { data: [], error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

export const getTasks = async (
  session: Session,
  groupId?: string
): Promise<Task[]> => {
  let url = `${SUPABASE_URL}/rest/v1/care8_group_tasks?select=*`;
  
  if (groupId) {
    url += `&group_id=eq.${groupId}`;
  }
  
  const response = await fetch(
    url,
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
};

export const createTask = async (
  task: Omit<Task, 'id' | 'created_at' | 'updated_at'>,
  session: Session
): Promise<Task> => {
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
  
  const result = await response.json();
  return result[0];
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>,
  session: Session
): Promise<Task> => {
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
      body: JSON.stringify(updates)
    }
  );
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || response.statusText);
  }
  
  const result = await response.json();
  return result[0];
};

// New API function for getGroupTasks
export const getGroupTasks = async (
  groupId: string,
  title?: string,
  description?: string,
  dueDate?: string,
  assignedTo?: string,
  priority?: string,
  status?: string,
  taskId?: string
): Promise<{ data: Task[] | Task | null; error: Error | null }> => {
  try {
    // If taskId is provided, we're dealing with an update/delete operation
    if (taskId) {
      if (!title && !description) {
        // Delete task
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/care8_group_tasks?id=eq.${taskId}`,
          {
            method: 'DELETE',
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          const error = await response.json();
          return { data: null, error: new Error(error.message || response.statusText) };
        }
        
        return { data: null, error: null };
      } else {
        // Update task
        const response = await fetch(
          `${SUPABASE_URL}/rest/v1/care8_group_tasks?id=eq.${taskId}`,
          {
            method: 'PATCH',
            headers: {
              apikey: SUPABASE_ANON_KEY,
              Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              title: title || undefined,
              description: description || undefined,
              due_date: dueDate || undefined,
              assigned_to: assignedTo || undefined,
              status: status || undefined,
              priority: priority || undefined
            })
          }
        );
        
        if (!response.ok) {
          const error = await response.json();
          return { data: null, error: new Error(error.message || response.statusText) };
        }
        
        const result = await response.json();
        return { data: result[0] || null, error: null };
      }
    } else if (title) {
      // Create task
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/care8_group_tasks`,
        {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            title,
            description: description || '',
            due_date: dueDate || null,
            group_id: groupId,
            assigned_to: assignedTo || null,
            status: status || 'pending',
            priority: priority || 'medium',
            created_by: localStorage.getItem('user_id') || ''
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: new Error(error.message || response.statusText) };
      }
      
      const result = await response.json();
      return { data: result[0] || null, error: null };
    } else {
      // Get tasks
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/care8_group_tasks?group_id=eq.${groupId}`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        return { data: [], error: new Error(error.message || response.statusText) };
      }
      
      const result = await response.json();
      return { data: result, error: null };
    }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// New API function for getGroupEvents
export const getGroupEvents = async (
  groupId: string,
  title?: string,
  description?: string,
  startTime?: string,
  endTime?: string,
  location?: string,
  eventId?: string
): Promise<{ data: GroupEvent[] | GroupEvent | null; error: Error | null }> => {
  try {
    // If eventId is provided, we're dealing with an update/delete operation
    if (eventId && !title) {
      // Delete event
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/care8_group_events?id=eq.${eventId}`,
        {
          method: 'DELETE',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: new Error(error.message || response.statusText) };
      }
      
      return { data: null, error: null };
    } else if (title) {
      // Create/update event
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/care8_group_events`,
        {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            title,
            description: description || '',
            start_time: startTime || new Date().toISOString(),
            end_time: endTime || new Date().toISOString(),
            location: location || '',
            group_id: groupId,
            created_by: localStorage.getItem('user_id') || ''
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: new Error(error.message || response.statusText) };
      }
      
      const result = await response.json();
      return { data: result[0] || null, error: null };
    } else {
      // Get events
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/care8_group_events?group_id=eq.${groupId}`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        return { data: [], error: new Error(error.message || response.statusText) };
      }
      
      const result = await response.json();
      return { data: result, error: null };
    }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// New API function for getGroupPosts
export const getGroupPosts = async (
  groupId: string,
  content?: string,
  authorId?: string,
  authorName?: string,
  authorAvatar?: string,
  parentId?: string,
  isComment?: boolean,
  postId?: string,
  commentContent?: string
): Promise<{ data: GroupPost[] | GroupPost | null; error: Error | null }> => {
  try {
    // If postId and commentContent are provided, we're adding a comment
    if (postId && commentContent) {
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/care8_group_post_comments`,
        {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            post_id: postId,
            content: commentContent,
            created_by: localStorage.getItem('user_id') || '',
            author_name: authorName || 'Anonymous',
            author_avatar: authorAvatar || ''
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: new Error(error.message || response.statusText) };
      }
      
      return { data: null, error: null }; // Just return success for comments
    } else if (postId && !content) {
      // Delete post
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/care8_group_posts?id=eq.${postId}`,
        {
          method: 'DELETE',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: new Error(error.message || response.statusText) };
      }
      
      return { data: null, error: null };
    } else if (content) {
      // Create post
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/care8_group_posts`,
        {
          method: 'POST',
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            group_id: groupId,
            content,
            created_by: localStorage.getItem('user_id') || '',
            author_name: authorName || 'Anonymous',
            author_avatar: authorAvatar || '',
            parent_id: parentId || null,
            is_comment: isComment || false
          })
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        return { data: null, error: new Error(error.message || response.statusText) };
      }
      
      const result = await response.json();
      return { data: result[0] || null, error: null };
    } else {
      // Get posts
      const response = await fetch(
        `${SUPABASE_URL}/rest/v1/care8_group_posts?group_id=eq.${groupId}&is_comment=eq.false`,
        {
          headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        return { data: [], error: new Error(error.message || response.statusText) };
      }
      
      const posts = await response.json();
      
      // Get comments for each post
      const postsWithComments = await Promise.all(
        posts.map(async (post: GroupPost) => {
          const commentResponse = await fetch(
            `${SUPABASE_URL}/rest/v1/care8_group_post_comments?post_id=eq.${post.id}`,
            {
              headers: {
                apikey: SUPABASE_ANON_KEY,
                Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
                'Content-Type': 'application/json'
              }
            }
          );
          
          if (commentResponse.ok) {
            const comments = await commentResponse.json();
            return {
              ...post,
              comments,
              comment_count: comments.length
            };
          }
          
          return {
            ...post,
            comments: [],
            comment_count: 0
          };
        })
      );
      
      return { data: postsWithComments, error: null };
    }
  } catch (error) {
    return { data: null, error: error instanceof Error ? error : new Error('Unknown error') };
  }
}; 