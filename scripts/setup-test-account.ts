const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zoubqdwxemivxrjruvam.supabase.co';
const supabaseServiceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQyMDE5NywiZXhwIjoyMDUzOTk2MTk3fQ.VMGEmVXub9PA-lQiE4b1XJu-dqjdUq1UpqVnppynYFw';

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupTestAccount() {
  try {
    // Create test account
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
      email: 'superwellcharged@gmail.com',
      password: 'superwellcharged@gmail.com',
      email_confirm: true, // Auto-confirm email
    });

    if (createError) {
      throw createError;
    }

    console.log('Test account created successfully:', user);

    // Update auth settings to disable email confirmation
    const { error: updateError } = await supabase.auth.admin.updateConfig({
      email_confirm_required: false,
    });

    if (updateError) {
      throw updateError;
    }

    console.log('Email confirmation disabled successfully');

  } catch (error) {
    console.error('Error setting up test account:', error);
  }
}

setupTestAccount();
