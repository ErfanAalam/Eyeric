const bcrypt = require('bcryptjs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// You'll need to add your Supabase URL and anon key here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createFirstAdmin() {
  const email = 'erfankhansiwani@gmail.com'; // Change this to your desired admin email
  const password = 'admin123'; // Change this to your desired password

  try {
    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Insert the admin
    const { error } = await supabase
      .from('admin')
      .insert({
        email: email,
        password_hash: passwordHash
      });

    if (error) {
      console.error('Error creating admin:', error);
      return;
    }

    console.log('Admin created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('You can now login at /admin/login');
  } catch (error) {
    console.error('Error:', error);
  }
}

createFirstAdmin(); 