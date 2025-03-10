require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL connection
const connectionString = process.env.POSTGRES_CONNECTION_STRING || 
  'postgresql://postgres.zoubqdwxemivxrjruvam:Superstrongpasswordfor5527@@@aws-0-us-west-1.pooler.supabase.com:5432/postgres';

console.log('Environment loaded:', {
  POSTGRES_CONNECTION_STRING: !!process.env.POSTGRES_CONNECTION_STRING,
  SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  VITE_SUPABASE_SERVICE_ROLE_KEY: !!process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
});

console.log('Using connection string (first 20 chars):', connectionString.substring(0, 20) + '...');

// Fix the connection string format if necessary
const modifiedConnectionString = connectionString.replace(/(@+)(@)/g, '@');
console.log('Modified connection string (first 20 chars):', modifiedConnectionString.substring(0, 20) + '...');

const pool = new Pool({ connectionString: modifiedConnectionString });

// Read SQL file
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

// Execute each statement
async function migrateDatabase() {
  const client = await pool.connect();
  try {
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await client.query(statement);
        successCount++;
        console.log(`Statement ${i+1}/${statements.length} executed successfully`);
        
        // Log brief summary of the statement
        const firstLine = statement.split('\n')[0].substring(0, 80);
        console.log(`  - ${firstLine}${firstLine.length >= 80 ? '...' : ''}`);
      } catch (error) {
        errorCount++;
        
        // Don't fail on "already exists" errors
        if (error.message.includes('already exists')) {
          console.log(`Statement ${i+1}/${statements.length} - Object already exists (skipping)`);
        } else {
          console.error(`Statement ${i+1}/${statements.length} - Error:`, error.message);
          
          // Log the first 200 characters of the statement for context
          const statementPreview = statement.substring(0, 200).replace(/\n/g, ' ');
          console.error(`  Statement preview: ${statementPreview}...`);
        }
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

    // Verify the care_groups table exists by running a simple query
    try {
      const { rowCount } = await client.query("SELECT 1 FROM care_groups LIMIT 1");
      console.log('✅ Verification: care_groups table exists');
    } catch (error) {
      console.error('❌ Verification: care_groups table does not exist:', error.message);
    }
    
    // Verify the create_care_group function exists
    try {
      const { rows } = await client.query(`
        SELECT proname, proargtypes
        FROM pg_proc
        WHERE proname = 'create_care_group'
      `);
      
      if (rows.length > 0) {
        console.log('✅ Verification: create_care_group function exists');
      } else {
        console.log('❌ Verification: create_care_group function does not exist');
      }
    } catch (error) {
      console.error('❌ Verification: Could not check if create_care_group function exists:', error.message);
    }
    
    console.log('Migration completed');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    client.release();
  }
}

// Execute migration
migrateDatabase()
  .catch(console.error)
  .finally(() => {
    pool.end();
    console.log('Database connection closed');
  }); 