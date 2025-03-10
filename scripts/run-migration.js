// Script to run database migrations
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Get the migration file path
const migrationFile = path.resolve(__dirname, '../supabase/migrations/20250415_fix_care_groups.sql');

// Supabase connection details from SSOT
const host = 'aws-0-us-west-1.pooler.supabase.com';
const port = '5432';
const database = 'postgres';
const user = 'postgres.zoubqdwxemivxrjruvam';
const password = 'Superstrongpasswordfor5527@@@';

// Ensure the migration file exists
if (!fs.existsSync(migrationFile)) {
  console.error(`Migration file does not exist: ${migrationFile}`);
  process.exit(1);
}

console.log(`Running migration from: ${migrationFile}`);

// Set environment variable for password
process.env.PGPASSWORD = password;

// Run the migration using psql
const psql = spawn('psql', [
  '-h', host,
  '-p', port,
  '-d', database,
  '-U', user,
  '-f', migrationFile
]);

// Handle stdout
psql.stdout.on('data', (data) => {
  console.log(`${data}`);
});

// Handle stderr
psql.stderr.on('data', (data) => {
  console.error(`${data}`);
});

// Handle process completion
psql.on('close', (code) => {
  if (code === 0) {
    console.log('Migration completed successfully');
  } else {
    console.error(`Migration failed with code: ${code}`);
  }
}); 