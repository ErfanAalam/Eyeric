# Admin System Setup Guide

This guide explains how to set up and use the admin system for the EYERIC application.

## Database Setup

1. **Run the database migrations:**

   First, run the admin table migration:
   ```sql
   -- Run the contents of database/migrations/create_admin_table.sql
   ```

   Then, run the admin invitations table migration:
   ```sql
   -- Run the contents of database/migrations/create_admin_invitations_table.sql
   ```

## Creating the First Admin

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Make sure you have your Supabase environment variables set in your `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Create the first admin:**
   ```bash
   node scripts/create-first-admin.js
   ```
   
   This will create an admin with:
   - Email: admin@example.com
   - Password: admin123
   
   **Important:** Change these credentials in the script before running it!

## Using the Admin System

### Admin Login
- Navigate to `/admin/login`
- Use your admin credentials to log in
- Upon successful login, you'll be redirected to `/admin/dashboard`

### Admin Dashboard
- Only authenticated admins can access `/admin/dashboard`
- If not authenticated, you'll be redirected to `/admin/login`

### Inviting New Admins
1. From the admin dashboard, enter the email address of the person you want to invite
2. Click "Send Invitation"
3. The system will generate a unique invitation link
4. **For testing:** The invitation link will be displayed in the success message
5. **For production:** You'll need to implement email sending to send the invitation link

### Setting Up New Admin Accounts
1. New admins receive an invitation link (e.g., `/admin/setup/[token]`)
2. They click the link and are taken to a password setup page
3. They enter and confirm their password
4. Upon successful setup, they're redirected to `/admin/login`
5. They can now log in with their email and the password they set

## Security Features

- **Password Hashing:** All passwords are hashed using bcrypt
- **Token-based Invitations:** Invitations use secure, unique tokens
- **Expiration:** Invitation tokens expire after 24 hours
- **Protected Routes:** Admin dashboard is only accessible to authenticated admins
- **Separate Authentication:** Admin system is completely separate from user authentication

## File Structure

```
src/
├── app/
│   └── admin/
│       ├── login/
│       │   └── page.tsx          # Admin login page
│       ├── dashboard/
│       │   └── page.tsx          # Admin dashboard
│       └── setup/
│           └── [token]/
│               └── page.tsx      # Password setup page
├── contexts/
│   └── AdminAuthContext.tsx      # Admin authentication context
database/
└── migrations/
    ├── create_admin_table.sql    # Admin table migration
    └── create_admin_invitations_table.sql  # Invitations table migration
scripts/
└── create-first-admin.js         # Script to create first admin
```

## Production Considerations

1. **Email Integration:** Implement proper email sending for invitations
2. **Environment Variables:** Use secure environment variables for all sensitive data
3. **Rate Limiting:** Consider implementing rate limiting for login attempts
4. **Audit Logging:** Consider logging admin actions for security
5. **Password Policy:** Implement stronger password requirements if needed

## Troubleshooting

- **"Invalid email or password"**: Check that the admin exists in the database and the password is correct
- **"Invalid or expired invitation link"**: The invitation token may be invalid or expired
- **Database errors**: Make sure all migrations have been run successfully 