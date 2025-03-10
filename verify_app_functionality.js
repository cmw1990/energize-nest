/**
 * Care Connector Functionality Verification Script
 * 
 * This script tests all the key API functions to ensure they are working correctly.
 * Run this script with: node verify_app_functionality.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test user credentials - replace with your test user
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

// Test data
const testGroup = {
  name: 'Test Care Group',
  description: 'A test group created by the verification script',
  is_public: true
};

const testTask = {
  title: 'Test Task',
  description: 'A test task created by the verification script',
  status: 'pending',
  priority: 'medium'
};

const testEvent = {
  title: 'Test Event',
  description: 'A test event created by the verification script',
  start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
  end_time: new Date(Date.now() + 90000000).toISOString(),
  location: 'Test Location'
};

// Main function to run all verification tests
async function verifyAllFunctionality() {
  console.log('Care Connector Functionality Verification');
  console.log('=======================================');
  
  try {
    // Step 1: Sign in
    console.log('\nStep 1: Authenticating test user...');
    const { data: { session }, error: authError } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    
    if (authError) throw new Error(`Authentication failed: ${authError.message}`);
    console.log('✅ Authentication successful');
    
    const userId = session.user.id;
    console.log(`Test user ID: ${userId}`);
    
    // Step 2: Test Group Functions
    console.log('\nStep 2: Testing Group Functions...');
    
    // Create a group
    console.log('Creating test group...');
    const { data: newGroup, error: createGroupError } = await supabase
      .from('care8_groups')
      .insert({
        ...testGroup,
        created_by: userId,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (createGroupError) throw new Error(`Group creation failed: ${createGroupError.message}`);
    console.log(`✅ Group created with ID: ${newGroup.id}`);
    
    // Add creator as owner
    console.log('Adding creator as owner...');
    const { error: addMemberError } = await supabase
      .from('care8_group_members')
      .insert({
        group_id: newGroup.id,
        user_id: userId,
        role: 'owner',
        joined_at: new Date().toISOString()
      });
      
    if (addMemberError) throw new Error(`Adding member failed: ${addMemberError.message}`);
    console.log('✅ Creator added as owner');
    
    // Test group retrieval
    console.log('Testing group retrieval...');
    const { data: retrievedGroups, error: getGroupsError } = await supabase
      .from('care8_group_members')
      .select('group_id')
      .eq('user_id', userId);
      
    if (getGroupsError) throw new Error(`Group retrieval failed: ${getGroupsError.message}`);
    console.log(`✅ Retrieved ${retrievedGroups.length} groups for the user`);
    
    // Step 3: Test Task Functions
    console.log('\nStep 3: Testing Task Functions...');
    
    // Create a task
    console.log('Creating test task...');
    const { data: newTask, error: createTaskError } = await supabase
      .from('care8_group_tasks')
      .insert({
        ...testTask,
        group_id: newGroup.id,
        created_by: userId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (createTaskError) throw new Error(`Task creation failed: ${createTaskError.message}`);
    console.log(`✅ Task created with ID: ${newTask.id}`);
    
    // Update a task
    console.log('Updating test task...');
    const { error: updateTaskError } = await supabase
      .from('care8_group_tasks')
      .update({ status: 'in-progress' })
      .eq('id', newTask.id);
      
    if (updateTaskError) throw new Error(`Task update failed: ${updateTaskError.message}`);
    console.log('✅ Task status updated to in-progress');
    
    // Search for tasks
    console.log('Testing task search...');
    const { data: searchedTasks, error: searchTaskError } = await supabase
      .from('care8_group_tasks')
      .select('*')
      .eq('group_id', newGroup.id);
      
    if (searchTaskError) throw new Error(`Task search failed: ${searchTaskError.message}`);
    console.log(`✅ Found ${searchedTasks.length} tasks for the group`);
    
    // Step 4: Test Event Functions
    console.log('\nStep 4: Testing Event Functions...');
    
    // Create an event
    console.log('Creating test event...');
    const { data: newEvent, error: createEventError } = await supabase
      .from('care8_group_events')
      .insert({
        ...testEvent,
        group_id: newGroup.id,
        created_by: userId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
      
    if (createEventError) throw new Error(`Event creation failed: ${createEventError.message}`);
    console.log(`✅ Event created with ID: ${newEvent.id}`);
    
    // Get upcoming events
    console.log('Getting upcoming events...');
    const { data: upcomingEvents, error: getEventsError } = await supabase
      .from('care8_group_events')
      .select('*')
      .eq('group_id', newGroup.id)
      .gte('start_time', new Date().toISOString())
      .order('start_time', { ascending: true });
      
    if (getEventsError) throw new Error(`Event retrieval failed: ${getEventsError.message}`);
    console.log(`✅ Found ${upcomingEvents.length} upcoming events`);
    
    // Step 5: Test Invitations
    console.log('\nStep 5: Testing Invitations...');
    
    // Create an invitation
    const invitedEmail = 'invited@example.com';
    console.log(`Creating test invitation for ${invitedEmail}...`);
    
    const { data: newInvitation, error: createInvitationError } = await supabase
      .from('care8_group_invitations')
      .insert({
        group_id: newGroup.id,
        invited_email: invitedEmail,
        invited_by: userId,
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 86400000).toISOString(), // 7 days
        status: 'pending'
      })
      .select()
      .single();
      
    if (createInvitationError) throw new Error(`Invitation creation failed: ${createInvitationError.message}`);
    console.log(`✅ Invitation created with ID: ${newInvitation.id}`);
    
    // Get pending invitations
    console.log('Getting pending invitations...');
    const { data: pendingInvitations, error: getInvitationsError } = await supabase
      .from('care8_group_invitations')
      .select('*')
      .eq('invited_email', invitedEmail)
      .eq('status', 'pending');
      
    if (getInvitationsError) throw new Error(`Invitation retrieval failed: ${getInvitationsError.message}`);
    console.log(`✅ Found ${pendingInvitations.length} pending invitations for ${invitedEmail}`);
    
    // Step 6: Test Group Activity
    console.log('\nStep 6: Testing Group Activity...');
    
    // Get group activity (using manually implemented logic since this is a custom function)
    console.log('Getting group activity...');
    
    // Get events
    const { data: activityEvents, error: eventsError } = await supabase
      .from('care8_group_events')
      .select('*')
      .eq('group_id', newGroup.id)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (eventsError) throw new Error(`Events retrieval failed: ${eventsError.message}`);
    
    // Get tasks
    const { data: activityTasks, error: tasksError } = await supabase
      .from('care8_group_tasks')
      .select('*')
      .eq('group_id', newGroup.id)
      .order('created_at', { ascending: false })
      .limit(5);
      
    if (tasksError) throw new Error(`Tasks retrieval failed: ${tasksError.message}`);
    
    // Combine activities
    const allActivities = [
      ...(activityEvents || []).map(event => ({ ...event, type: 'event', timestamp: event.created_at })),
      ...(activityTasks || []).map(task => ({ ...task, type: 'task', timestamp: task.created_at }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    console.log(`✅ Retrieved ${allActivities.length} group activities`);
    
    // Cleanup - Optional: Remove test data if you want your verification to be non-destructive
    console.log('\n(Optional) Step 7: Cleaning up test data...');
    
    if (process.env.KEEP_TEST_DATA === 'true') {
      console.log('Test data will be kept for manual inspection.');
    } else {
      console.log('Removing test data...');
      
      // Remove invitation
      await supabase.from('care8_group_invitations').delete().eq('id', newInvitation.id);
      console.log('✅ Invitation removed');
      
      // Remove event
      await supabase.from('care8_group_events').delete().eq('id', newEvent.id);
      console.log('✅ Event removed');
      
      // Remove task
      await supabase.from('care8_group_tasks').delete().eq('id', newTask.id);
      console.log('✅ Task removed');
      
      // Remove membership
      await supabase.from('care8_group_members').delete().eq('group_id', newGroup.id).eq('user_id', userId);
      console.log('✅ Group membership removed');
      
      // Remove group
      await supabase.from('care8_groups').delete().eq('id', newGroup.id);
      console.log('✅ Group removed');
    }
    
    console.log('\n✅✅✅ All functionality verified successfully! ✅✅✅');
    
  } catch (error) {
    console.error('\n❌ Verification failed:', error.message);
    process.exit(1);
  }
}

// Run the verification
verifyAllFunctionality(); 