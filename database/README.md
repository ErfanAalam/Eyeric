# Database Setup Instructions

## Setting up the User Table

To set up the user table in your Supabase database, follow these steps:

### 1. Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" section

### 2. Run the Initial Migration
1. Copy the contents of `database/migrations/create_user_table.sql`
2. Paste it into the SQL Editor
3. Click "Run" to execute the migration

### 3. Run the Fix Migration (Important!)
1. Copy the contents of `database/migrations/fix_user_insert.sql`
2. Paste it into the SQL Editor
3. Click "Run" to execute the migration

**This second migration is crucial as it:**
- Creates a database trigger that automatically creates user profiles
- Fixes the Row Level Security (RLS) policy issues
- Allows the signup process to work properly

### 4. Verify the Setup
After running both migrations, you should see:
- A new `user` table in your database
- Row Level Security (RLS) enabled with proper policies
- A database trigger that automatically creates user profiles
- An index on the email column for performance

### 5. Table Structure
The `user` table includes the following columns:
- `id` (UUID, Primary Key) - References auth.users(id)
- `first_name` (TEXT) - User's first name
- `last_name` (TEXT) - User's last name
- `email` (TEXT) - User's email address
- `created_at` (TIMESTAMP) - When the record was created
- `updated_at` (TIMESTAMP) - When the record was last updated

### 6. How It Works
1. User fills out the signup form with first name, last name, email, and password
2. Supabase Auth creates the user account
3. A database trigger automatically creates a corresponding record in the `user` table
4. The user receives an email confirmation link
5. After confirming their email, they can log in and access their profile

### 7. Security Features
- Row Level Security (RLS) is enabled
- Users can only access their own profile data
- Automatic timestamp updates on record modifications
- Email uniqueness constraint
- Database trigger ensures profile creation happens automatically


## Testing the Setup
After setting up the table, you can test the signup functionality:
1. Navigate to your signup page
2. Fill in the form with first name, last name, email, and password
3. Submit the form
4. Check your Supabase dashboard to verify the user data is stored in the `user` table
5. The user should receive a confirmation email

## Troubleshooting
If you encounter RLS policy errors:
1. Make sure you've run both migration files
2. Check that the database trigger was created successfully
3. Verify that the RLS policies are in place
4. Ensure the user table exists and has the correct structure 