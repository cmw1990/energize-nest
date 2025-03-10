import { apiRequest } from './apiClient';

// Direct API client for Care8 Connector tables
// This follows SSOT4001 guidelines to use direct API calls instead of Supabase client

// Caregiver Connector API
export const caregiverConnectorApi = {
  // Get all caregivers with optional filters
  getCaregivers: async (filters: Record<string, any> = {}) => {
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
      
      return await apiRequest(endpoint, { method: 'GET' });
    } catch (error) {
      console.error('Error fetching caregivers:', error);
      return { data: [], error };
    }
  },
  
  // Get a single caregiver by ID
  getCaregiverById: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_caregivers?id=eq.${id}&select=*`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching caregiver:', error);
      return { data: null, error };
    }
  }
};

// Pal Connector API
export const palConnectorApi = {
  // Get all companions with optional filters
  getCompanions: async (filters: Record<string, any> = {}) => {
    try {
      let endpoint = '/rest/v1/care8_companions?select=*';
      
      // Add filters if provided
      if (filters.interests) {
        endpoint += `&interests=cs.{${filters.interests}}`;
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
      
      return await apiRequest(endpoint, { method: 'GET' });
    } catch (error) {
      console.error('Error fetching companions:', error);
      return { data: [], error };
    }
  },
  
  // Get a single companion by ID
  getCompanionById: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_companions?id=eq.${id}&select=*`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching companion:', error);
      return { data: null, error };
    }
  }
};

// Justice Connector API
export const justiceConnectorApi = {
  // Get all legal experts with optional filters
  getLegalExperts: async (filters: Record<string, any> = {}) => {
    try {
      let endpoint = '/rest/v1/care8_legal_experts?select=*';
      
      // Add filters if provided
      if (filters.specialties) {
        endpoint += `&specialties=cs.{${filters.specialties}}`;
      }
      
      if (filters.consultationType) {
        endpoint += `&consultation_types=cs.{${filters.consultationType}}`;
      }
      
      if (filters.location) {
        endpoint += `&location=ilike.*${filters.location}*`;
      }
      
      if (filters.yearsExperience) {
        endpoint += `&years_experience=gte.${filters.yearsExperience}`;
      }
      
      return await apiRequest(endpoint, { method: 'GET' });
    } catch (error) {
      console.error('Error fetching legal experts:', error);
      return { data: [], error };
    }
  },
  
  // Get a single legal expert by ID
  getLegalExpertById: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_legal_experts?id=eq.${id}&select=*`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching legal expert:', error);
      return { data: null, error };
    }
  }
};

// Care Facilities Comparer API
export const careFacilitiesApi = {
  // Get all care facilities with optional filters
  getFacilities: async (filters: Record<string, any> = {}) => {
    try {
      let endpoint = '/rest/v1/care8_care_facilities?select=*';
      
      // Add filters if provided
      if (filters.type) {
        endpoint += `&type=eq.${filters.type}`;
      }
      
      if (filters.priceMin && filters.priceMax) {
        // Note: This is a simplified approach since price_range is stored as a string
        // In a real implementation, you'd want to store min and max prices as separate numeric fields
        endpoint += `&price_range=ilike.*${filters.priceMin}*`;
      }
      
      if (filters.availableBeds) {
        endpoint += `&available_beds=gte.${filters.availableBeds}`;
      }
      
      if (filters.amenities) {
        endpoint += `&amenities=cs.{${filters.amenities}}`;
      }
      
      return await apiRequest(endpoint, { method: 'GET' });
    } catch (error) {
      console.error('Error fetching care facilities:', error);
      return { data: [], error };
    }
  },
  
  // Get a single care facility by ID
  getFacilityById: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_care_facilities?id=eq.${id}&select=*`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching care facility:', error);
      return { data: null, error };
    }
  }
};

// Care Products Comparer API
export const careProductsApi = {
  // Get all care products with optional filters
  getProducts: async (filters: Record<string, any> = {}) => {
    try {
      let endpoint = '/rest/v1/care8_care_products?select=*';
      
      // Add filters if provided
      if (filters.type) {
        endpoint += `&type=eq.${filters.type}`;
      }
      
      if (filters.category) {
        endpoint += `&category=eq.${filters.category}`;
      }
      
      if (filters.priceMin) {
        endpoint += `&price=gte.${filters.priceMin}`;
      }
      
      if (filters.priceMax) {
        endpoint += `&price=lte.${filters.priceMax}`;
      }
      
      if (filters.inStock) {
        endpoint += `&in_stock=eq.${filters.inStock}`;
      }
      
      if (filters.freeShipping) {
        endpoint += `&free_shipping=eq.${filters.freeShipping}`;
      }
      
      if (filters.popular) {
        endpoint += `&popular=eq.${filters.popular}`;
      }
      
      return await apiRequest(endpoint, { method: 'GET' });
    } catch (error) {
      console.error('Error fetching care products:', error);
      return { data: [], error };
    }
  },
  
  // Get a single care product by ID
  getProductById: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_care_products?id=eq.${id}&select=*`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching care product:', error);
      return { data: null, error };
    }
  }
};

// Care8 Groups API
export const care8GroupsApi = {
  // Get all groups with optional filters
  getGroups: async (filters: Record<string, any> = {}) => {
    try {
      let endpoint = '/rest/v1/care8_groups?select=*';
      
      // Add filters if provided
      if (filters.isPublic !== undefined) {
        endpoint += `&is_public=eq.${filters.isPublic}`;
      }
      
      if (filters.createdBy) {
        endpoint += `&created_by=eq.${filters.createdBy}`;
      }
      
      if (filters.name) {
        endpoint += `&name=ilike.*${filters.name}*`;
      }
      
      return await apiRequest(endpoint, { method: 'GET' });
    } catch (error) {
      console.error('Error fetching groups:', error);
      return { data: [], error };
    }
  },
  
  // Get a single group by ID
  getGroupById: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_groups?id=eq.${id}&select=*`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching group:', error);
      return { data: null, error };
    }
  },
  
  // Create a new group
  createGroup: async (groupData: {
    name: string;
    description?: string;
    is_public: boolean;
    created_by: string;
    image_url?: string;
  }) => {
    try {
      return await apiRequest('/rest/v1/care8_groups', {
        method: 'POST',
        body: JSON.stringify(groupData)
      });
    } catch (error) {
      console.error('Error creating group:', error);
      return { data: null, error };
    }
  },
  
  // Update a group
  updateGroup: async (id: string, groupData: {
    name?: string;
    description?: string;
    is_public?: boolean;
    image_url?: string;
  }) => {
    try {
      return await apiRequest(`/rest/v1/care8_groups?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...groupData,
          updated_at: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error updating group:', error);
      return { data: null, error };
    }
  },
  
  // Delete a group
  deleteGroup: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_groups?id=eq.${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting group:', error);
      return { data: null, error };
    }
  },
  
  // Get all members of a group
  getGroupMembers: async (groupId: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_members?group_id=eq.${groupId}&select=*,user:user_id(id,email,display_name,avatar_url)`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching group members:', error);
      return { data: [], error };
    }
  },
  
  // Add a member to a group
  addGroupMember: async (memberData: {
    group_id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'member';
  }) => {
    try {
      return await apiRequest('/rest/v1/care8_group_members', {
        method: 'POST',
        body: JSON.stringify(memberData)
      });
    } catch (error) {
      console.error('Error adding group member:', error);
      return { data: null, error };
    }
  },
  
  // Update a member's role
  updateMemberRole: async (id: string, role: 'owner' | 'admin' | 'member') => {
    try {
      return await apiRequest(`/rest/v1/care8_group_members?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ role })
      });
    } catch (error) {
      console.error('Error updating member role:', error);
      return { data: null, error };
    }
  },
  
  // Remove a member from a group
  removeGroupMember: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_members?id=eq.${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error removing group member:', error);
      return { data: null, error };
    }
  },
  
  // Get all invitations for a group
  getGroupInvitations: async (groupId: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_invitations?group_id=eq.${groupId}&select=*`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching group invitations:', error);
      return { data: [], error };
    }
  },
  
  // Get invitations for a user by email
  getUserInvitations: async (email: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_invitations?invited_email=eq.${email}&status=eq.pending&select=*,group:group_id(id,name,description,image_url),inviter:invited_by(id,email,display_name,avatar_url)`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching user invitations:', error);
      return { data: [], error };
    }
  },
  
  // Create a group invitation
  createInvitation: async (invitationData: {
    group_id: string;
    invited_email: string;
    invited_by: string;
  }) => {
    try {
      return await apiRequest('/rest/v1/care8_group_invitations', {
        method: 'POST',
        body: JSON.stringify(invitationData)
      });
    } catch (error) {
      console.error('Error creating invitation:', error);
      return { data: null, error };
    }
  },
  
  // Update invitation status
  updateInvitationStatus: async (id: string, status: 'accepted' | 'declined') => {
    try {
      return await apiRequest(`/rest/v1/care8_group_invitations?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    } catch (error) {
      console.error('Error updating invitation status:', error);
      return { data: null, error };
    }
  },
  
  // Get all events for a group
  getGroupEvents: async (groupId: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_events?group_id=eq.${groupId}&select=*&order=start_time.asc`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching group events:', error);
      return { data: [], error };
    }
  },
  
  // Create a group event
  createEvent: async (eventData: {
    group_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    location?: string;
    created_by: string;
  }) => {
    try {
      return await apiRequest('/rest/v1/care8_group_events', {
        method: 'POST',
        body: JSON.stringify(eventData)
      });
    } catch (error) {
      console.error('Error creating event:', error);
      return { data: null, error };
    }
  },
  
  // Update a group event
  updateEvent: async (id: string, eventData: {
    title?: string;
    description?: string;
    start_time?: string;
    end_time?: string;
    location?: string;
  }) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_events?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...eventData,
          updated_at: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error updating event:', error);
      return { data: null, error };
    }
  },
  
  // Delete a group event
  deleteEvent: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_events?id=eq.${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      return { data: null, error };
    }
  },
  
  // Get all tasks for a group
  getGroupTasks: async (groupId: string, filters: Record<string, any> = {}) => {
    try {
      let endpoint = `/rest/v1/care8_group_tasks?group_id=eq.${groupId}&select=*,assignee:assigned_to(id,email,display_name,avatar_url)`;
      
      if (filters.status) {
        endpoint += `&status=eq.${filters.status}`;
      }
      
      if (filters.assignedTo) {
        endpoint += `&assigned_to=eq.${filters.assignedTo}`;
      }
      
      return await apiRequest(endpoint, { method: 'GET' });
    } catch (error) {
      console.error('Error fetching group tasks:', error);
      return { data: [], error };
    }
  },
  
  // Create a group task
  createTask: async (taskData: {
    group_id: string;
    title: string;
    description?: string;
    due_date?: string;
    assigned_to?: string;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    created_by: string;
  }) => {
    try {
      return await apiRequest('/rest/v1/care8_group_tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
      });
    } catch (error) {
      console.error('Error creating task:', error);
      return { data: null, error };
    }
  },
  
  // Update a group task
  updateTask: async (id: string, taskData: {
    title?: string;
    description?: string;
    due_date?: string;
    assigned_to?: string;
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  }) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_tasks?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...taskData,
          updated_at: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error updating task:', error);
      return { data: null, error };
    }
  },
  
  // Delete a group task
  deleteTask: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_tasks?id=eq.${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      return { data: null, error };
    }
  },
  
  // Get all notes for a group
  getGroupNotes: async (groupId: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_notes?group_id=eq.${groupId}&select=*,author:created_by(id,email,display_name,avatar_url)&order=created_at.desc`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching group notes:', error);
      return { data: [], error };
    }
  },
  
  // Create a group note
  createNote: async (noteData: {
    group_id: string;
    title: string;
    content: string;
    created_by: string;
  }) => {
    try {
      return await apiRequest('/rest/v1/care8_group_notes', {
        method: 'POST',
        body: JSON.stringify(noteData)
      });
    } catch (error) {
      console.error('Error creating note:', error);
      return { data: null, error };
    }
  },
  
  // Update a group note
  updateNote: async (id: string, noteData: {
    title?: string;
    content?: string;
  }) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_notes?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...noteData,
          updated_at: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Error updating note:', error);
      return { data: null, error };
    }
  },
  
  // Delete a group note
  deleteNote: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_notes?id=eq.${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      return { data: null, error };
    }
  },
  
  // Get all resources for a group
  getGroupResources: async (groupId: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_resources?group_id=eq.${groupId}&select=*,author:created_by(id,email,display_name,avatar_url)&order=created_at.desc`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching group resources:', error);
      return { data: [], error };
    }
  },
  
  // Create a group resource
  createResource: async (resourceData: {
    group_id: string;
    title: string;
    description?: string;
    resource_url?: string;
    resource_type: 'link' | 'document' | 'image' | 'video' | 'other';
    created_by: string;
  }) => {
    try {
      return await apiRequest('/rest/v1/care8_group_resources', {
        method: 'POST',
        body: JSON.stringify(resourceData)
      });
    } catch (error) {
      console.error('Error creating resource:', error);
      return { data: null, error };
    }
  },
  
  // Delete a group resource
  deleteResource: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_resources?id=eq.${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting resource:', error);
      return { data: null, error };
    }
  },
  
  // Get all volunteer opportunities for a group
  getGroupVolunteerOpportunities: async (groupId: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_volunteers?group_id=eq.${groupId}&select=*&order=start_time.asc`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching volunteer opportunities:', error);
      return { data: [], error };
    }
  },
  
  // Create a volunteer opportunity
  createVolunteerOpportunity: async (opportunityData: {
    group_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
    location?: string;
    max_volunteers: number;
    created_by: string;
  }) => {
    try {
      return await apiRequest('/rest/v1/care8_group_volunteers', {
        method: 'POST',
        body: JSON.stringify(opportunityData)
      });
    } catch (error) {
      console.error('Error creating volunteer opportunity:', error);
      return { data: null, error };
    }
  },
  
  // Update a volunteer opportunity
  updateVolunteerOpportunity: async (id: string, opportunityData: {
    title?: string;
    description?: string;
    start_time?: string;
    end_time?: string;
    location?: string;
    max_volunteers?: number;
  }) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_volunteers?id=eq.${id}`, {
        method: 'PATCH',
        body: JSON.stringify(opportunityData)
      });
    } catch (error) {
      console.error('Error updating volunteer opportunity:', error);
      return { data: null, error };
    }
  },
  
  // Delete a volunteer opportunity
  deleteVolunteerOpportunity: async (id: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_volunteers?id=eq.${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Error deleting volunteer opportunity:', error);
      return { data: null, error };
    }
  },
  
  // Get groups for a user (as member)
  getUserGroups: async (userId: string) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_members?user_id=eq.${userId}&select=id,role,group:group_id(*)`, {
        method: 'GET'
      });
    } catch (error) {
      console.error('Error fetching user groups:', error);
      return { data: [], error };
    }
  },
  
  // Check if user is a member of a group
  isGroupMember: async (groupId: string, userId: string) => {
    try {
      const response = await apiRequest(`/rest/v1/care8_group_members?group_id=eq.${groupId}&user_id=eq.${userId}&select=id,role`, {
        method: 'GET'
      });
      
      return { 
        data: { 
          isMember: response.data && response.data.length > 0,
          role: response.data && response.data.length > 0 ? response.data[0].role : null,
          memberId: response.data && response.data.length > 0 ? response.data[0].id : null
        }, 
        error: response.error 
      };
    } catch (error) {
      console.error('Error checking group membership:', error);
      return { data: { isMember: false, role: null, memberId: null }, error };
    }
  }
}; 