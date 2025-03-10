require('dotenv').config();
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

// Service role key needed for schema changes
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://zoubqdwxemivxrjruvam.supabase.co';
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('Error: VITE_SUPABASE_SERVICE_ROLE_KEY is required for database schema changes');
  process.exit(1);
}

console.log('Using Supabase URL:', supabaseUrl);
console.log('Service role key available:', !!supabaseServiceKey);

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

// Read SQL file
const sqlFilePath = path.join(__dirname, '../integrations/supabase/care-connector-tables.sql');
const sqlCommands = fs.readFileSync(sqlFilePath, 'utf8');

// Split commands by semicolon to execute them one by one
const commands = sqlCommands
  .replace(/--.*$/gm, '') // Remove comments
  .split(';')
  .map(command => command.trim())
  .filter(command => command.length > 0);

async function executeCommands() {
  let succeeded = 0;
  let failed = 0;

  console.log(`Preparing to execute ${commands.length} SQL commands...`);

  for (let i = 0; i < commands.length; i++) {
    const command = commands[i];
    try {
      // Execute SQL using RPC
      await supabaseRestCall('/rest/v1/rpc/execute_sql', {
        method: 'POST',
        body: JSON.stringify({ query: command })
      });
      
      console.log(`Command ${i + 1} executed successfully`);
      succeeded++;
    } catch (err) {
      console.error(`Error executing command ${i + 1}:`, err.message);
      console.error('Command:', command);
      failed++;
    }
  }

  console.log(`Execution complete: ${succeeded} succeeded, ${failed} failed`);
}

executeCommands().catch(err => {
  console.error('Script execution failed:', err);
  process.exit(1);
}); 