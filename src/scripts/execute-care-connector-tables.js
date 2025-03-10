require('dotenv').config({ path: '../../.env' });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zoubqdwxemivxrjruvam.supabase.co';

// Try to get the service key from environment variables, but use hardcoded fallback for development
let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  // Fallback to hardcoded value for development only
  console.warn('WARNING: Using hardcoded service key from SSOT document. This should only be used in development.');
  supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQyMDE5NywiZXhwIjoyMDUzOTk2MTk3fQ.VMGEmVXub9PA-lQiE4b1XJu-dqjdUq1UpqVnppynYFw';
}

console.log('Environment variables:');
console.log('- SUPABASE_URL:', supabaseUrl);
console.log('- SERVICE_KEY exists:', !!supabaseServiceKey);

// PostgreSQL connection string - use hardcoded value if environment variable isn't available
const connectionString = process.env.POSTGRES_CONNECTION_STRING || 
  'postgresql://postgres.zoubqdwxemivxrjruvam:Superstrongpasswordfor5527@@@aws-0-us-west-1.pooler.supabase.com:5432/postgres';

console.log('- POSTGRES_CONNECTION_STRING exists:', !!process.env.POSTGRES_CONNECTION_STRING);
console.log('- Using connection string (first 20 chars):', connectionString.substring(0, 20) + '...');

// Initialize PostgreSQL pool
const pool = new Pool({ connectionString });

// Function to execute a raw SQL query
async function executeRawSql(sql) {
  const client = await pool.connect();
  try {
    const result = await client.query(sql);
    return result;
  } catch (error) {
    console.error('Error executing SQL:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// Function to make a Supabase REST API call
async function supabaseRestCall(endpoint, options = {}) {
  const response = await fetch(`${supabaseUrl}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || response.statusText);
  }

  return await response.json();
}

// Main function to execute the SQL script
async function executeScript() {
  try {
    console.log('Starting to execute Care Connector tables script...');
    
    // Read the SQL file
    const sqlFilePath = path.resolve(__dirname, '../integrations/supabase/care-connector-tables.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split into individual statements
    const statements = sqlContent
      .replace(/--.*$/gm, '') // Remove SQL comments
      .split(';')
      .filter(stmt => stmt.trim().length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      try {
        const statement = statements[i].trim();
        await executeRawSql(statement);
        successCount++;
        
        // Log progress for every 10 statements
        if (i % 10 === 0 || i === statements.length - 1) {
          console.log(`Progress: ${i + 1}/${statements.length} statements executed`);
        }
      } catch (error) {
        errorCount++;
        
        // Don't fail on "relation already exists" errors
        if (error.message.includes('already exists')) {
          console.log(`Statement ${i + 1} - Table or relation already exists (skipping)`);
        } else {
          console.error(`Statement ${i + 1} - Error:`, error.message);
        }
      }
    }
    
    console.log(`
Execution summary:
- Total statements: ${statements.length}
- Successfully executed: ${successCount}
- Errors: ${errorCount}
`);

    // Verify that the care_groups table exists and is accessible
    console.log('Checking if care_groups table is accessible...');
    
    try {
      await supabaseRestCall('/rest/v1/care_groups?select=id&limit=1');
      console.log('Success! care_groups table is accessible');
    } catch (error) {
      console.error('Error accessing care_groups table:', error.message);
    }
    
    // Verify that the create_care_group function exists
    console.log('Checking if create_care_group function is accessible...');
    
    try {
      const testGroup = await supabaseRestCall('/rest/v1/rpc/create_care_group', {
        method: 'POST',
        body: JSON.stringify({
          p_name: 'Test Group (Temporary)',
          p_description: 'This is a test group created by the installation script',
          p_is_public: false
        })
      });
      
      console.log('Success! create_care_group function is working properly');
      
      // Clean up the test group if created
      if (testGroup) {
        console.log('Cleaning up test group...');
        await supabaseRestCall(`/rest/v1/care_groups?id=eq.${testGroup}`, {
          method: 'DELETE'
        });
      }
    } catch (error) {
      console.error('Error testing create_care_group function:', error.message);
    }
    
    console.log('Script execution completed.');
  } catch (error) {
    console.error('Script execution failed:', error);
    process.exit(1);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

// Execute the script
executeScript()
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  }); 