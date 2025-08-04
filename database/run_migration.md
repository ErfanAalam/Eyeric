# Running the Cart Migration

To fix the cart persistence issue, you need to run the database migration that adds the required columns to the user table.

## Steps to Run the Migration:

### 1. Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" section

### 2. Run the Migration
1. Copy the contents of `database/migrations/add_cart_and_powers_columns.sql`
2. Paste it into the SQL Editor
3. Click "Run" to execute the migration

### 3. Verify the Migration
After running the migration, you should see:
- Two new columns added to the `user` table:
  - `cart_items` (JSONB) - Stores cart items
  - `powers` (JSONB) - Stores saved power entries
- Two new indexes created for better performance

### 4. Test the Cart Functionality
After running the migration:
1. Add items to your cart
2. Refresh the page
3. The cart items should now persist

## What This Migration Does:

- **Adds `cart_items` column**: Stores an array of cart item objects as JSONB
- **Adds `powers` column**: Stores an array of power entry objects as JSONB  
- **Creates indexes**: Improves query performance for cart and power operations
- **Sets default values**: Both columns default to empty arrays `[]`

## Troubleshooting:

If you get an error saying the columns already exist, that's fine - the migration uses `IF NOT EXISTS` so it won't fail.

If you still have issues after running the migration:
1. Check the browser console for any error messages
2. Verify the migration ran successfully in Supabase
3. Try logging out and back in to refresh the user session 