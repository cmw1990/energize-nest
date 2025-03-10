// CARE8 API CLIENT
// This API client works with the new care8 tables structure
// Replace your existing API client methods with these

// ----- CARE8 GROUPS FUNCTIONS -----

// Get user's groups
const getUserGroups = async () => {
  // Get the current user's session
  const session = await supabase.auth.getSession();
  const userId = session.data.session?.user?.id;
  
  if (!userId) {
    throw new Error('No authenticated user found');
  }
  
  // Query the care8_group_members table
  return apiRequest(`/rest/v1/care8_group_members?user_id=eq.${userId}&select=group_id`, {
    method: 'GET'
  });
};

// Get a specific group's details
const getGroupDetails = async (groupId) => {
  return apiRequest(`/rest/v1/care8_groups?id=eq.${groupId}`, {
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
    
    // Create the group
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

    // Add the user as an owner of the group
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
};

// ----- CARE8 GROUP MEMBERS FUNCTIONS -----

// Get members of a specific group
const getGroupMembers = async (groupId) => {
  return apiRequest(`/rest/v1/care8_group_members?group_id=eq.${groupId}&select=id,user_id,role,joined_at`, {
    method: 'GET'
  });
};

// Add a member to a group
const addGroupMember = async (groupId, userId, role = 'member') => {
  return apiRequest('/rest/v1/care8_group_members', {
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
  return apiRequest(`/rest/v1/care8_group_members?group_id=eq.${groupId}&user_id=eq.${userId}`, {
    method: 'DELETE'
  });
};

// ----- CARE8 GROUP INVITATIONS FUNCTIONS -----

// Get invitations for a user by email
const getUserInvitations = async (email) => {
  return apiRequest(`/rest/v1/care8_group_invitations?invited_email=eq.${encodeURIComponent(email)}&status=eq.pending&select=id,group_id`, {
    method: 'GET'
  });
};

// Create an invitation
const createInvitation = async (groupId, email) => {
  // Get the current user's session
  const session = await supabase.auth.getSession();
  if (!session.data.session?.user) {
    return { data: null, error: { message: 'No authenticated user found' } };
  }
  
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
};

// Accept an invitation
const acceptInvitation = async (invitationId, userId) => {
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
};

// Decline an invitation
const declineInvitation = async (invitationId) => {
  return apiRequest(`/rest/v1/care8_group_invitations?id=eq.${invitationId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'declined'
    })
  });
};

// ----- CARE8 GROUP EVENTS FUNCTIONS -----

// Get events for a group
const getGroupEvents = async (groupId) => {
  return apiRequest(`/rest/v1/care8_group_events?group_id=eq.${groupId}&order=start_time.asc`, {
    method: 'GET'
  });
};

// Create an event
const createEvent = async (groupId, title, description, startTime, endTime, location) => {
  // Get the current user's session
  const session = await supabase.auth.getSession();
  if (!session.data.session?.user) {
    return { data: null, error: { message: 'No authenticated user found' } };
  }
  
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
};

// ----- CARE8 GROUP TASKS FUNCTIONS -----

// Get tasks for a group
const getGroupTasks = async (groupId) => {
  return apiRequest(`/rest/v1/care8_group_tasks?group_id=eq.${groupId}&order=due_date.asc`, {
    method: 'GET'
  });
};

// Create a task
const createTask = async (groupId, title, description, dueDate, assignedTo) => {
  // Get the current user's session
  const session = await supabase.auth.getSession();
  if (!session.data.session?.user) {
    return { data: null, error: { message: 'No authenticated user found' } };
  }
  
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
};

// Update a task status
const updateTaskStatus = async (taskId, status) => {
  return apiRequest(`/rest/v1/care8_group_tasks?id=eq.${taskId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status,
      updated_at: new Date().toISOString()
    })
  });
};

// ----- CARE8 GROUP VOLUNTEERS FUNCTIONS -----

// Get volunteer opportunities for a group
const getVolunteerOpportunities = async (groupId) => {
  return apiRequest(`/rest/v1/care8_group_volunteers?group_id=eq.${groupId}&order=start_time.asc`, {
    method: 'GET'
  });
};

// Create a volunteer opportunity
const createVolunteerOpportunity = async (groupId, title, description, startTime, endTime, location, maxVolunteers) => {
  // Get the current user's session
  const session = await supabase.auth.getSession();
  if (!session.data.session?.user) {
    return { data: null, error: { message: 'No authenticated user found' } };
  }
  
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
}; 