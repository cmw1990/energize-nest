#!/usr/bin/env node

/**
 * L1 Core Table Verification Script
 * This script verifies that all essential tables exist in the Supabase database
 */

import { createClient } from '@supabase/supabase-js';

// SSOT8001 compliant hardcoded credentials
const SUPABASE_URL = 'https://zoubqdwxemivxrjruvam.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQyMDE5NywiZXhwIjoyMDUzOTk2MTk3fQ.VMGEmVXub9PA-lQiE4b1XJu-dqjdUq1UpqVnppynYFw';

// Initialize Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// List of essential tables to verify
const tables = [
  'user_settings8',
  'guide_articles8',
  'nrt_products8',
  'progress8',
  'consumption_logs8',
  'quit_plans8',
  'financial_tracking8',
  'craving_logs8',
  'connected_devices'
];

// Check if a table exists
async function checkTableExists(tableName) {
  try {
    const { count, error } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error(`Error checking table ${tableName}:`, error);
      return false;
    }
    
    console.log(`Table ${tableName} exists and has ${count} rows`);
    return true;
  } catch (error) {
    console.error(`Error checking if table ${tableName} exists:`, error);
    return false;
  }
}

// Main function
async function main() {
  console.log('Verifying essential tables...');
  
  let allTablesExist = true;
  
  for (const tableName of tables) {
    const exists = await checkTableExists(tableName);
    if (!exists) {
      allTablesExist = false;
      console.error(`Missing table: ${tableName}`);
    }
  }
  
  if (allTablesExist) {
    console.log('\nAll essential tables exist and are accessible!');
    console.log('The application is ready to use.');
  } else {
    console.error('\nSome essential tables are missing.');
    console.error('Please run the l1-migrations.js script to create the missing tables.');
  }
}

// Run the main function
main(); 