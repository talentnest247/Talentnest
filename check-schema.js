const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  try {
    // Try to query the users table to see its current structure
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);
      
    if (error) {
      console.log('Error querying users table:', error.message);
      console.log('Error code:', error.code);
    } else {
      console.log('Users table exists.');
      if (data && data.length > 0) {
        console.log('Current columns:', Object.keys(data[0]));
      } else {
        console.log('Table exists but is empty - let me check all users');
        
        // Check if there are any users at all
        const { data: allUsers, error: allError } = await supabase
          .from('users')
          .select('id, email, first_name, last_name')
          .limit(5);
          
        if (allError) {
          console.log('Error checking all users:', allError.message);
        } else if (allUsers && allUsers.length > 0) {
          console.log(`Found ${allUsers.length} users:`);
          console.log('Available columns from query:', Object.keys(allUsers[0]));
          allUsers.forEach(user => {
            console.log(`- ${user.email} (${user.first_name} ${user.last_name})`);
          });
        } else {
          console.log('No users found in table');
        }
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkSchema();
