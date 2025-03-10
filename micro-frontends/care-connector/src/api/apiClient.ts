// API Client for Well-Charged platform
// This file provides a consistent interface for making API calls to the backend

// Environment variables for API endpoints
export const API_URL = import.meta.env.VITE_SUPABASE_URL || 'https://example.com';
export const API_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Helper function for making API requests
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  try {
    // Get auth token from localStorage if available
    const authToken = localStorage.getItem('auth_token');
    
    // Set up headers with auth token if available
    const headers = {
      'Content-Type': 'application/json',
      'apikey': API_KEY,
      ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
      ...(options.headers || {})
    };
    
    // Make the request
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || response.statusText || 'API request failed');
    }
    
    // Parse and return the response
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    throw error;
  }
};

// Care Connector API
export const careConnector = {
  // Groups
  getGroups: async () => {
    return apiRequest('/rest/v1/care8_groups?select=*');
  },
  
  getGroupById: async (id: string) => {
    return apiRequest(`/rest/v1/care8_groups?id=eq.${id}&select=*`);
  },
  
  createGroup: async (data: any) => {
    return apiRequest('/rest/v1/care8_groups', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        created_by: localStorage.getItem('user_id') || ''
      }),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  },
  
  updateGroup: async (id: string, data: any) => {
    return apiRequest(`/rest/v1/care8_groups?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  },
  
  deleteGroup: async (id: string) => {
    return apiRequest(`/rest/v1/care8_groups?id=eq.${id}`, {
      method: 'DELETE'
    });
  },
  
  // Group Members
  getGroupMembers: async (groupId: string) => {
    return apiRequest(`/rest/v1/care8_group_members?group_id=eq.${groupId}&select=*,user_id,profiles:user_id(display_name,avatar_url)`);
  },
  
  addGroupMember: async (data: any) => {
    return apiRequest('/rest/v1/care8_group_members', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  },
  
  removeGroupMember: async (id: string) => {
    return apiRequest(`/rest/v1/care8_group_members?id=eq.${id}`, {
      method: 'DELETE'
    });
  },
  
  // Tasks
  getTasks: async (groupId?: string) => {
    let endpoint = '/rest/v1/care8_group_tasks?select=*';
    if (groupId) {
      endpoint += `&group_id=eq.${groupId}`;
    }
    return apiRequest(endpoint);
  },
  
  getTaskById: async (id: string) => {
    return apiRequest(`/rest/v1/care8_group_tasks?id=eq.${id}&select=*`);
  },
  
  createTask: async (data: any) => {
    return apiRequest('/rest/v1/care8_group_tasks', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        assigned_by: localStorage.getItem('user_id') || ''
      }),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  },
  
  updateTask: async (id: string, data: any) => {
    return apiRequest(`/rest/v1/care8_group_tasks?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  },
  
  deleteTask: async (id: string) => {
    return apiRequest(`/rest/v1/care8_group_tasks?id=eq.${id}`, {
      method: 'DELETE'
    });
  },
  
  // Events
  getEvents: async (groupId?: string) => {
    let endpoint = '/rest/v1/care8_group_events?select=*';
    if (groupId) {
      endpoint += `&group_id=eq.${groupId}`;
    }
    return apiRequest(endpoint);
  },
  
  getEventById: async (id: string) => {
    return apiRequest(`/rest/v1/care8_group_events?id=eq.${id}&select=*`);
  },
  
  createEvent: async (data: any) => {
    return apiRequest('/rest/v1/care8_group_events', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        created_by: localStorage.getItem('user_id') || ''
      }),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  },
  
  updateEvent: async (id: string, data: any) => {
    return apiRequest(`/rest/v1/care8_group_events?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  },
  
  deleteEvent: async (id: string) => {
    return apiRequest(`/rest/v1/care8_group_events?id=eq.${id}`, {
      method: 'DELETE'
    });
  },
  
  // Posts
  getPosts: async (groupId: string) => {
    return apiRequest(`/rest/v1/care8_group_posts?group_id=eq.${groupId}&select=*`);
  },
  
  getPostById: async (id: string) => {
    return apiRequest(`/rest/v1/care8_group_posts?id=eq.${id}&select=*`);
  },
  
  createPost: async (data: any) => {
    return apiRequest('/rest/v1/care8_group_posts', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        created_by: localStorage.getItem('user_id') || ''
      }),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  },
  
  updatePost: async (id: string, data: any) => {
    return apiRequest(`/rest/v1/care8_group_posts?id=eq.${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  },
  
  deletePost: async (id: string) => {
    return apiRequest(`/rest/v1/care8_group_posts?id=eq.${id}`, {
      method: 'DELETE'
    });
  },
  
  // Comments
  getComments: async (postId: string) => {
    return apiRequest(`/rest/v1/care8_group_post_comments?post_id=eq.${postId}&select=*`);
  },
  
  createComment: async (data: any) => {
    return apiRequest('/rest/v1/care8_group_post_comments', {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        created_by: localStorage.getItem('user_id') || ''
      }),
      headers: {
        'Prefer': 'return=representation'
      }
    });
  },
  
  deleteComment: async (id: string) => {
    return apiRequest(`/rest/v1/care8_group_post_comments?id=eq.${id}`, {
      method: 'DELETE'
    });
  }
}; 