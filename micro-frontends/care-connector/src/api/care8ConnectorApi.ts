import { Session } from '@supabase/supabase-js';

// Constants for API endpoints
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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

// Direct API client for Care8 Connector tables
// This follows SSOT4001 guidelines to use direct API calls instead of Supabase client

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

// Pal Connector API
export const palConnectorApi = {
  // Get all pals with optional filters
  getPals: async (filters: Record<string, any> = {}, session: Session) => {
    try {
      let endpoint = '/rest/v1/care8_pals?select=*';
      
      // Add filters if provided
      if (filters.services) {
        endpoint += `&services=cs.{${filters.services}}`;
      }
      
      if (filters.hourlyRate) {
        endpoint += `&hourly_rate=ilike.*${filters.hourlyRate}*`;
      }
      
      if (filters.location) {
        endpoint += `&location=ilike.*${filters.location}*`;
      }
      
      return await apiRequest(endpoint, { method: 'GET' }, session);
    } catch (error) {
      console.error('Error fetching pals:', error);
      return { data: [], error };
    }
  },
  
  // Get a single pal by ID
  getPalById: async (id: string, session: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_pals?id=eq.${id}&select=*`, {
        method: 'GET'
      }, session);
    } catch (error) {
      console.error('Error fetching pal:', error);
      return { data: null, error };
    }
  }
};

// Justice Connector API
export const justiceConnectorApi = {
  // Get all legal resources with optional filters
  getLegalResources: async (filters: Record<string, any> = {}, session: Session) => {
    try {
      let endpoint = '/rest/v1/care8_legal_resources?select=*';
      
      // Add filters if provided
      if (filters.specialties) {
        endpoint += `&specialties=cs.{${filters.specialties}}`;
      }
      
      if (filters.location) {
        endpoint += `&location=ilike.*${filters.location}*`;
      }
      
      if (filters.pro_bono) {
        endpoint += `&pro_bono=eq.${filters.pro_bono}`;
      }
      
      return await apiRequest(endpoint, { method: 'GET' }, session);
    } catch (error) {
      console.error('Error fetching legal resources:', error);
      return { data: [], error };
    }
  },
  
  // Get a single legal resource by ID
  getLegalResourceById: async (id: string, session: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_legal_resources?id=eq.${id}&select=*`, {
        method: 'GET'
      }, session);
    } catch (error) {
      console.error('Error fetching legal resource:', error);
      return { data: null, error };
    }
  }
};

// Care Facilities API
export const careFacilitiesApi = {
  // Get all care facilities with optional filters
  getFacilities: async (filters: Record<string, any> = {}, session: Session) => {
    try {
      let endpoint = '/rest/v1/care8_facilities?select=*';
      
      // Add filters if provided
      if (filters.type) {
        endpoint += `&facility_type=eq.${filters.type}`;
      }
      
      if (filters.location) {
        endpoint += `&location=ilike.*${filters.location}*`;
      }
      
      if (filters.rating) {
        endpoint += `&rating=gte.${filters.rating}`;
      }
      
      return await apiRequest(endpoint, { method: 'GET' }, session);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      return { data: [], error };
    }
  },
  
  // Get a single facility by ID
  getFacilityById: async (id: string, session: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_facilities?id=eq.${id}&select=*`, {
        method: 'GET'
      }, session);
    } catch (error) {
      console.error('Error fetching facility:', error);
      return { data: null, error };
    }
  }
};

// Care Products API
export const careProductsApi = {
  // Get all care products with optional filters
  getProducts: async (filters: Record<string, any> = {}, session: Session) => {
    try {
      let endpoint = '/rest/v1/care8_products?select=*';
      
      // Add filters if provided
      if (filters.category) {
        endpoint += `&category=eq.${filters.category}`;
      }
      
      if (filters.price_range) {
        const [min, max] = filters.price_range.split('-');
        if (min) endpoint += `&price=gte.${min}`;
        if (max) endpoint += `&price=lte.${max}`;
      }
      
      if (filters.rating) {
        endpoint += `&rating=gte.${filters.rating}`;
      }
      
      return await apiRequest(endpoint, { method: 'GET' }, session);
    } catch (error) {
      console.error('Error fetching products:', error);
      return { data: [], error };
    }
  },
  
  // Get a single product by ID
  getProductById: async (id: string, session: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_products?id=eq.${id}&select=*`, {
        method: 'GET'
      }, session);
    } catch (error) {
      console.error('Error fetching product:', error);
      return { data: null, error };
    }
  }
};

// Care Groups API
export const care8GroupsApi = {
  // Get all groups with optional filters
  getGroups: async (filters: Record<string, any> = {}, session?: Session) => {
    try {
      let endpoint = '/rest/v1/care8_groups?select=*';
      
      // Add filters if provided
      if (filters.isPublic) {
        endpoint += `&is_private=eq.false`;
      }
      
      if (filters.name) {
        endpoint += `&name=ilike.*${filters.name}*`;
      }
      
      return await apiRequest(endpoint, { method: 'GET' }, session);
    } catch (error) {
      console.error('Error fetching groups:', error);
      return { data: [], error };
    }
  },
  
  // Get groups where user is a member
  getUserGroups: async (userId: string, session?: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_groups?select=*&or=(created_by.eq.${userId},id.in.(select group_id from care8_group_members where user_id=eq.${userId}))`, {
        method: 'GET'
      }, session);
    } catch (error) {
      console.error('Error fetching user groups:', error);
      return { data: [], error };
    }
  },
  
  // Create a new group
  createGroup: async (groupData: any, session: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_groups`, {
        method: 'POST',
        body: JSON.stringify({
          ...groupData,
          created_by: session.user.id
        }),
        headers: {
          'Prefer': 'return=representation'
        }
      }, session);
    } catch (error) {
      console.error('Error creating group:', error);
      return { data: null, error };
    }
  },
  
  // Add a member to a group
  addGroupMember: async (memberData: any, session?: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_members`, {
        method: 'POST',
        body: JSON.stringify(memberData),
        headers: {
          'Prefer': 'return=representation'
        }
      }, session);
    } catch (error) {
      console.error('Error adding group member:', error);
      return { data: null, error };
    }
  },
  
  // Check if a user is a member of a group
  isGroupMember: async (groupId: string, userId: string, session?: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_members?group_id=eq.${groupId}&user_id=eq.${userId}`, {
        method: 'GET'
      }, session);
    } catch (error) {
      console.error('Error checking group membership:', error);
      return { data: null, error };
    }
  },
  
  // Get group invitations for a user
  getUserInvitations: async (userEmail: string, session?: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_invitations?email=eq.${encodeURIComponent(userEmail)}&status=eq.pending`, {
        method: 'GET'
      }, session);
    } catch (error) {
      console.error('Error fetching user invitations:', error);
      return { data: [], error };
    }
  },
  
  // Update invitation status
  updateInvitationStatus: async (invitationId: string, status: 'accepted' | 'declined', session?: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_invitations?id=eq.${invitationId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
        headers: {
          'Prefer': 'return=representation'
        }
      }, session);
    } catch (error) {
      console.error('Error updating invitation status:', error);
      return { data: null, error };
    }
  },
  
  // Get events for a group
  getGroupEvents: async (groupId: string, session?: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_events?group_id=eq.${groupId}`, {
        method: 'GET'
      }, session);
    } catch (error) {
      console.error('Error fetching group events:', error);
      return { data: [], error };
    }
  },
  
  // Create an event for a group
  createEvent: async (eventData: any, session?: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_group_events`, {
        method: 'POST',
        body: JSON.stringify(eventData),
        headers: {
          'Prefer': 'return=representation'
        }
      }, session);
    } catch (error) {
      console.error('Error creating event:', error);
      return { data: null, error };
    }
  },
  
  // Get volunteer opportunities for a group
  getGroupVolunteerOpportunities: async (groupId: string, session?: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_volunteer_opportunities?group_id=eq.${groupId}`, {
        method: 'GET'
      }, session);
    } catch (error) {
      console.error('Error fetching volunteer opportunities:', error);
      return { data: [], error };
    }
  },
  
  // Create a volunteer opportunity for a group
  createVolunteerOpportunity: async (opportunityData: any, session?: Session) => {
    try {
      return await apiRequest(`/rest/v1/care8_volunteer_opportunities`, {
        method: 'POST',
        body: JSON.stringify(opportunityData),
        headers: {
          'Prefer': 'return=representation'
        }
      }, session);
    } catch (error) {
      console.error('Error creating volunteer opportunity:', error);
      return { data: null, error };
    }
  }
}; 