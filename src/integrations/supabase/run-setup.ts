import { supabase } from './client';
import { checkAndCreateTables, testSupabaseConnection, initializeBlockingTables } from './test-connection';

/**
 * This is a utility script that can be run to test Supabase connection
 * and initialize the necessary tables for the distraction blocker feature.
 * 
 * It follows the SSOT guidelines for database setup and uses the version8 field
 * as required by the documentation.
 */
async function runSetup() {
  console.log('==== SUPABASE CONNECTION TEST ====');
  console.log('Testing connection to Supabase...');
  
  // First, check if we have an active session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    console.error('No active session found. Please login first.');
    return;
  }
  
  console.log('Using session for user:', session.user.email);
  
  // Test connection
  const { success, message, data, error } = await testSupabaseConnection();
  console.log('Connection test result:', success ? 'SUCCESS' : 'FAILED');
  console.log('Message:', message);
  
  if (error) {
    console.error('Error details:', error);
  }
  
  if (!success) {
    console.log('Attempting to create tables...');
    const initResult = await initializeBlockingTables();
    
    console.log('Table initialization result:', initResult.success ? 'SUCCESS' : 'FAILED');
    console.log('Message:', initResult.message);
    console.log('Tables modified:', initResult.tablesModified ? 'YES' : 'NO');
    
    if (initResult.success) {
      console.log('Tables were initialized successfully.');
      
      // Test the connection again to verify tables were created
      const secondTest = await testSupabaseConnection();
      console.log('Second connection test:', secondTest.success ? 'SUCCESS' : 'FAILED');
      
      if (secondTest.success) {
        console.log('Tables are now accessible.');
      } else {
        console.error('Tables were created but are not accessible:', secondTest.message);
      }
    }
  } else {
    console.log('Connection test passed. Tables exist and are accessible.');
  }
}

// Uncomment this to run the setup script directly
// runSetup().catch(console.error);

export default runSetup; 