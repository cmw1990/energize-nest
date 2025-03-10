require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zoubqdwxemivxrjruvam.supabase.co';
const supabaseServiceRoleKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQyMDE5NywiZXhwIjoyMDUzOTk2MTk3fQ.VMGEmVXub9PA-lQiE4b1XJu-dqjdUq1UpqVnppynYFw';
const supabaseAccessToken = process.env.SUPABASE_ACCESS_TOKEN || 'sbp_fca39aadfe2d2b4e34054ea5c97f2d6a8b27c417';
const projectId = process.env.SUPABASE_PROJECT_ID || 'zoubqdwxemivxrjruvam';

// Read the SQL file
const sqlFilePath = path.resolve(__dirname, '../integrations/supabase/care-connector-tables.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
console.log(`SQL file loaded from ${sqlFilePath}`);

// Process the SQL content: remove comments and split into statements
const sqlStatements = sqlContent
  .replace(/--.*$/gm, '') // Remove SQL comments
  .split(';')
  .map(statement => statement.trim())
  .filter(statement => statement.length > 0);

console.log(`Found ${sqlStatements.length} SQL statements to execute`);

// Function to execute SQL using the Supabase Management API
async function executeSqlViaApi(sql) {
  try {
    const response = await fetch(`https://api.supabase.com/projects/${projectId}/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAccessToken}`
      },
      body: JSON.stringify({
        query: sql
      })
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error executing SQL via API:', error);
    throw error;
  }
}

// Function to make a Supabase REST API call
async function supabaseRestCall(endpoint, options = {}) {
  const response = await fetch(`${supabaseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceRoleKey,
      'Authorization': `Bearer ${supabaseServiceRoleKey}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || response.statusText);
  }

  return await response.json();
}

// Execute each SQL statement
async function executeScript() {
  console.log(`Starting execution of ${sqlStatements.length} SQL statements`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < sqlStatements.length; i++) {
    const statement = sqlStatements[i];
    console.log(`Executing statement ${i + 1}/${sqlStatements.length}: ${statement.substring(0, 80)}...`);
    
    try {
      const result = await executeSqlViaApi(statement);
      
      if (result.error) {
        console.error(`Error executing statement ${i + 1}:`, result.error);
        
        // Don't fail on "already exists" errors
        if (result.error.message && result.error.message.includes('already exists')) {
          console.log('Table or policy already exists. Continuing...');
        } else {
          failCount++;
        }
      } else {
        console.log(`Statement ${i + 1} executed successfully`);
        successCount++;
      }
    } catch (error) {
      console.error(`Error executing statement ${i + 1}:`, error.message);
      failCount++;
    }
  }
  
  console.log(`\nExecution complete: ${successCount} succeeded, ${failCount} failed.`);
  
  // Verify that the tables are accessible
  try {
    const data = await supabaseRestCall('/rest/v1/care_groups?select=id&limit=1');
    console.log('Successfully verified access to care_groups table');
  } catch (error) {
    console.error('Error checking care_groups table:', error.message);
  }
}

// Execute the script
console.log('Starting execution of Care Connector database setup via Supabase Management API...');
executeScript()
  .then(() => {
    console.log('Script execution completed');
    process.exit(0);
  })
  .catch(error => {
    console.error('Script execution failed:', error);
    process.exit(1);
  }); 