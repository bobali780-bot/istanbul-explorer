// Simple script to set up contact submissions table in Supabase
// Run this after creating the table in your Supabase dashboard

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testContactTable() {
  try {
    console.log('Testing contact submissions table...');
    
    // Try to insert a test record
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Database Test',
        message: 'Testing if the table works',
        status: 'new'
      });

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n📋 To fix this, run the SQL in your Supabase dashboard:');
      console.log('1. Go to your Supabase project dashboard');
      console.log('2. Navigate to SQL Editor');
      console.log('3. Copy and paste the contents of create-contact-table.sql');
      console.log('4. Run the SQL');
    } else {
      console.log('✅ Contact table is working!');
      console.log('Test record inserted:', data);
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

testContactTable();
