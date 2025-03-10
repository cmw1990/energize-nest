// SIMPLIFIED API CLIENT REFERENCE
// These functions use direct REST API calls without relying on RPC calls
// Copy these to your main apiClient.ts file as needed

// ----- CARE GROUPS FUNCTIONS -----

// Get user's groups - simplest possible implementation
const getUserGroups = async () => {
  // Get the current user's session
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user?.id;
  
  if (!userId) {
    throw new Error('No authenticated user found');
  }
  
  // Simplest query that won't trigger recursion
  return apiRequest(`/rest/v1/care_group_members?user_id=eq.${userId}&select=group_id`, {
    method: 'GET'
  });
};

// Get a specific group's details
const getGroupDetails = async (groupId) => {
  return apiRequest(`/rest/v1/care_groups?id=eq.${groupId}`, {
    method: 'GET'
  });
};

// Create a new group
const createGroup = async (name, description, isPublic) => {
  try {
    // Get the current user's session
    const session = await supabase.auth.getSession();
    if (!session.data.session?.user) {
      return { data: null, error: { message: 'No authenticated user found' } };
    }
    
    // Simple direct REST API call to create a group - no RPC calls
    const response = await apiRequest('/rest/v1/care_groups', {
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

    // Add the user as an owner of the group
    const memberResponse = await apiRequest('/rest/v1/care_group_members', {
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
};

// ----- CARE GROUP MEMBERS FUNCTIONS -----

// Get members of a specific group
const getGroupMembers = async (groupId) => {
  return apiRequest(`/rest/v1/care_group_members?group_id=eq.${groupId}&select=id,user_id,role,joined_at`, {
    method: 'GET'
  });
};

// Add a member to a group
const addGroupMember = async (groupId, userId, role = 'member') => {
  return apiRequest('/rest/v1/care_group_members', {
    method: 'POST',
    body: JSON.stringify({
      group_id: groupId,
      user_id: userId,
      role: role,
      joined_at: new Date().toISOString()
    })
  });
};

// Remove a member from a group
const removeGroupMember = async (groupId, userId) => {
  return apiRequest(`/rest/v1/care_group_members?group_id=eq.${groupId}&user_id=eq.${userId}`, {
    method: 'DELETE'
  });
};

// ----- CARE GROUP INVITATIONS FUNCTIONS -----

// Get invitations for a user by email
const getUserInvitations = async (email) => {
  return apiRequest(`/rest/v1/care_group_invitations?invited_email=eq.${encodeURIComponent(email)}&status=eq.pending&select=id,group_id`, {
    method: 'GET'
  });
};

// Create an invitation
const createInvitation = async (groupId, email) => {
  return apiRequest('/rest/v1/care_group_invitations', {
    method: 'POST',
    body: JSON.stringify({
      group_id: groupId,
      invited_email: email,
      status: 'pending',
      created_at: new Date().toISOString()
    })
  });
};

// Accept an invitation
const acceptInvitation = async (invitationId, userId) => {
  try {
    // First get the invitation details
    const { data: invitationData, error: invitationError } = await apiRequest(
      `/rest/v1/care_group_invitations?id=eq.${invitationId}&select=id,group_id`,
      { method: 'GET' }
    );

    if (invitationError || !invitationData || invitationData.length === 0) {
      return { data: null, error: invitationError || { message: 'Invitation not found' } };
    }

    const groupId = invitationData[0].group_id;

    // Add user to the group
    const { data: memberData, error: memberError } = await apiRequest(
      '/rest/v1/care_group_members',
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

    // Delete the invitation
    const { data: deleteData, error: deleteError } = await apiRequest(
      `/rest/v1/care_group_invitations?id=eq.${invitationId}`,
      { method: 'DELETE' }
    );

    if (deleteError) {
      // If we can't delete the invitation, we still consider this a success since the user is in the group
      console.error('Error deleting invitation:', deleteError);
      return { data: memberData, error: null };
    }

    return { data: memberData, error: null };
  } catch (error) {
    console.error('Error accepting invitation:', error);
    return { data: null, error };
  }
};

// Decline an invitation (delete it)
const declineInvitation = async (invitationId) => {
  return apiRequest(`/rest/v1/care_group_invitations?id=eq.${invitationId}`, {
    method: 'DELETE'
  });
}; 