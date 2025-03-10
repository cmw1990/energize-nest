require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Get environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zoubqdwxemivxrjruvam.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: Supabase service role key is required');
  process.exit(1);
}

console.log('Environment loaded:', {
  SUPABASE_URL: !!supabaseUrl,
  SERVICE_KEY_EXISTS: !!supabaseServiceKey
});

// Initialize Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Read the functions SQL file which we'll execute in parts using RPC
const sqlFilePath = path.resolve(__dirname, './care-connector-functions.sql');
const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');

console.log(`SQL file loaded from ${sqlFilePath}`);

// Split into statements - more careful splitting to handle function definitions
const statements = [];
let currentStatement = '';
let inFunction = false;
let bracketCount = 0;

sqlContent.split('\n').forEach(line => {
  const trimmedLine = line.trim();
  
  // Skip empty lines and comments
  if (trimmedLine === '' || trimmedLine.startsWith('--')) {
    return;
  }
  
  // Check if we're entering a function definition
  if (trimmedLine.includes('FUNCTION') && trimmedLine.includes('AS $$')) {
    inFunction = true;
  }
  
  // Track bracket count for BEGIN/END blocks
  if (inFunction) {
    if (trimmedLine === 'BEGIN') bracketCount++;
    if (trimmedLine === 'END;') bracketCount--;
    
    // Check if we're exiting the function definition
    if (trimmedLine.includes('$$ LANGUAGE') && bracketCount === 0) {
      inFunction = false;
    }
  }
  
  // Add line to current statement
  currentStatement += line + '\n';
  
  // If line ends with semicolon and we're not in a function, end the statement
  if (trimmedLine.endsWith(';') && !inFunction) {
    statements.push(currentStatement.trim());
    currentStatement = '';
  }
});

// Add any remaining statement
if (currentStatement.trim()) {
  statements.push(currentStatement.trim());
}

console.log(`Found ${statements.length} SQL statements to execute`);

// Function to execute a single SQL statement
async function executeSql(sql) {
  try {
    const { data, error } = await supabase.rpc('execute_sql', { query: sql });
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    // If the execute_sql function doesn't exist, we'll create it
    if (error.message && error.message.includes('function execute_sql() does not exist')) {
      console.log('Creating execute_sql function...');
      
      const createFunctionSql = `
      CREATE OR REPLACE FUNCTION execute_sql(query text)
      RETURNS JSONB
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        result JSONB;
      BEGIN
        EXECUTE query;
        result := '{"status": "success"}'::JSONB;
        RETURN result;
      EXCEPTION WHEN OTHERS THEN
        result := jsonb_build_object(
          'status', 'error',
          'message', SQLERRM,
          'code', SQLSTATE
        );
        RETURN result;
      END;
      $$;
      `;
      
      // Execute this using a direct RPC call to the pg_execute function
      // which is available by default
      const { error: createFnError } = await supabase.rpc('pg_execute', { 
        query: createFunctionSql 
      });
      
      if (createFnError) {
        console.error('Error creating execute_sql function:', createFnError);
        
        // Last resort: try to use REST API
        const { error: restError } = await supabase
          .from('_rpc')
          .select('*')
          .limit(1); // Just to check if we can access Supabase at all
        
        if (restError) {
          console.error('Error accessing Supabase API:', restError);
          throw new Error('Cannot access Supabase API. Check credentials and permissions.');
        } else {
          console.log('Supabase REST API is accessible.');
          throw new Error('Could not create execute_sql function but REST API works.');
        }
      } else {
        console.log('execute_sql function created successfully');
        // Now try again with our original query
        return executeSql(sql);
      }
    } else {
      throw error;
    }
  }
}

// Execute migration
async function migrateDatabase() {
  try {
    let successCount = 0;
    let errorCount = 0;
    
    // First, verify we can connect to Supabase
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.error('Error connecting to Supabase Auth:', authError);
      throw new Error('Cannot connect to Supabase Auth. Check credentials and permissions.');
    }
    
    console.log('Successfully connected to Supabase!');
    
    // Execute each statement using the REST API method instead of RPC
    // We'll create them one by one using the SQL editor REST API
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const firstLine = statement.split('\n')[0].substring(0, 80);
      
      try {
        console.log(`Executing statement ${i+1}/${statements.length}: ${firstLine}${firstLine.length >= 80 ? '...' : ''}`);
        
        // Direct SQL query using the API
        const queryUrl = `${supabaseUrl}/rest/v1/sql`;
        const response = await fetch(queryUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`
          },
          body: JSON.stringify({ query: statement })
        });
        
        if (response.ok) {
          successCount++;
          console.log(`  ✅ Success!`);
        } else {
          const errorText = await response.text();
          errorCount++;
          
          // Don't fail on "already exists" errors
          if (errorText.includes('already exists')) {
            console.log(`  ⚠️ Object already exists (skipping)`);
          } else {
            console.error(`  ❌ Error: ${errorText}`);
          }
        }
      } catch (error) {
        errorCount++;
        console.error(`  ❌ Error: ${error.message}`);
      }
      
      // Add a brief pause between statements
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`
Migration summary:
- Total statements: ${statements.length}
- Successfully executed: ${successCount}
- Errors: ${errorCount} (some may be 'already exists' errors which are expected)
`);

    // Verify that tables and functions exist
    try {
      // Check if the care_groups table exists
      const { data: groupsData, error: groupsError } = await supabase
        .from('care_groups')
        .select('id')
        .limit(1);
        
      if (groupsError) {
        console.error('❌ care_groups table is not accessible:', groupsError.message);
      } else {
        console.log('✅ care_groups table is accessible');
      }
      
      // Try to call the create_care_group function
      try {
        const { data: funcResult, error: funcError } = await supabase.rpc('create_care_group', { 
          p_name: 'Test Group', 
          p_description: 'This is a test group created by the migration script',
          p_is_public: true
        });
        
        if (funcError) {
          console.error('❌ create_care_group function is not working:', funcError.message);
        } else {
          console.log('✅ create_care_group function is working! Created group with ID:', funcResult);
          
          // Clean up the test group
          const { error: deleteError } = await supabase
            .from('care_groups')
            .delete()
            .eq('id', funcResult);
            
          if (deleteError) {
            console.error('❌ Could not delete test group:', deleteError.message);
          } else {
            console.log('✅ Test group deleted successfully');
          }
        }
      } catch (error) {
        console.error('❌ Error testing create_care_group function:', error.message);
      }
    } catch (error) {
      console.error('❌ Error verifying migration:', error.message);
    }
    
    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

// Run the migration
migrateDatabase().catch(console.error); 