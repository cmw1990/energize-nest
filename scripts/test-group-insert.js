// Script to test direct group insertion to the database
const fetch = require('node-fetch');

// Supabase connection details from SSOT
const supabaseUrl = 'https://zoubqdwxemivxrjruvam.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQyMDE5NywiZXhwIjoyMDUzOTk2MTk3fQ.VMGEmVXub9PA-lQiE4b1XJu-dqjdUq1UpqVnppynYFw'; // Service role key for admin access
const userId = '25d09be5-ba5f-44a9-a9b3-d1e837cede0f'; // User ID from console

// Function to make a Supabase REST API call
async function supabaseRestCall(endpoint, options = {}) {
  const response = await fetch(`${supabaseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || response.statusText);
  }

  return await response.json();
}

// Test insert with direct SQL to bypass any potential issues
async function testDirectInsert() {
  console.log('Testing direct SQL insert...');
  
  try {
    // Use direct SQL to insert a group
    const data = await supabaseRestCall('/rest/v1/rpc/execute_sql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          INSERT INTO care_groups (name, description, is_public, created_by)
          VALUES ('Test Direct SQL', 'Created via direct SQL', false, '${userId}')
          RETURNING id;
        `
      })
    });
    
    console.log('Direct SQL insert result:', data);
    
    // If we got a group ID, try to add a member
    const groupId = data[0]?.id;
    if (groupId) {
      console.log(`Group created with ID: ${groupId}`);
      
      // Insert the creator as a member
      const memberData = await supabaseRestCall('/rest/v1/rpc/execute_sql', {
        method: 'POST',
        body: JSON.stringify({
          query: `
            INSERT INTO care_group_members (group_id, user_id, role)
            VALUES ('${groupId}', '${userId}', 'owner')
            RETURNING id;
          `
        })
      });
      
      console.log('Member inserted successfully:', memberData);
    }
  } catch (err) {
    console.error('Unexpected error in direct SQL test:', err);
  }
}

// Test insert with the API
async function testApiInsert() {
  console.log('Testing API insert...');
  
  try {
    // Insert using the API
    const data = await supabaseRestCall('/rest/v1/care_groups', {
      method: 'POST',
      headers: {
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        name: 'Test API Insert',
        description: 'Created via API',
        is_public: false,
        created_by: userId
      })
    });
    
    console.log('API insert result:', data);
    
    // If we got a group, try to add a member
    const groupId = data[0]?.id;
    if (groupId) {
      console.log(`Group created with ID: ${groupId}`);
      
      // Insert the creator as a member
      await supabaseRestCall('/rest/v1/care_group_members', {
        method: 'POST',
        body: JSON.stringify({
          group_id: groupId,
          user_id: userId,
          role: 'owner'
        })
      });
      
      console.log('Member inserted successfully');
    }
  } catch (err) {
    console.error('Unexpected error in API test:', err);
  }
}

// Run both tests
async function runTests() {
  console.log('Starting database tests...');
  
  // Get tables info
  try {
    const tableInfo = await supabaseRestCall('/rest/v1/rpc/execute_sql', {
      method: 'POST',
      body: JSON.stringify({
        query: `
          SELECT table_name, column_name, data_type
          FROM information_schema.columns
          WHERE table_name IN ('care_groups', 'care_group_members')
          ORDER BY table_name, ordinal_position;
        `
      })
    });
    
    console.log('Table structure:', tableInfo);
  } catch (error) {
    console.error('Error getting table info:', error.message);
  }
  
  // Check if any groups exist for this user
  try {
    const existingGroups = await supabaseRestCall('/rest/v1/care_groups?select=id,name,created_at&created_by=eq.' + userId);
    console.log('Existing groups:', existingGroups);
  } catch (error) {
    console.error('Error checking existing groups:', error.message);
  }
  
  // Run the direct SQL test
  await testDirectInsert();
  
  // Run the API test
  await testApiInsert();
  
  console.log('Tests completed');
}

runTests().catch(console.error); 