# Orders Table Setup Instructions

## Setting up the Orders Table

To set up the orders table in your Supabase database, follow these steps:

### 1. Access Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to the "SQL Editor" section

### 2. Run the Orders Migration
1. Copy the contents of `database/migrations/create_orders_table.sql`
2. Paste it into the SQL Editor
3. Click "Run" to execute the migration

### 3. Verify the Setup
After running the migration, you should see:
- A new `orders` table in your database
- Row Level Security (RLS) enabled with proper policies
- A function to generate unique order numbers
- Indexes for better query performance
- Automatic timestamp updates

## Table Structure

The `orders` table includes the following columns:

### Core Fields
- `id` (UUID, Primary Key) - Unique order identifier
- `user_id` (UUID) - References the user who placed the order
- `order_number` (TEXT) - Unique order number in format YYYYMMDD-XXXX
- `status` (TEXT) - Current order status (pending, confirmed, processing, shipped, delivered, cancelled, refunded)

### Customer Information
- `customer_name` (TEXT) - Customer's full name
- `customer_phone` (TEXT) - Customer's phone number
- `customer_email` (TEXT) - Customer's email address

### Shipping Address
- `shipping_address` (JSONB) - Complete shipping address information

### Order Details
- `items` (JSONB) - Array of cart items with product, lens, power, and quantity details
- `subtotal` (NUMERIC) - Order subtotal before taxes and shipping
- `shipping_cost` (NUMERIC) - Shipping cost
- `tax_amount` (NUMERIC) - Tax amount (GST)
- `discount_amount` (NUMERIC) - Discount amount from coupons
- `total_amount` (NUMERIC) - Final total amount

### Coupon Information
- `applied_coupon` (TEXT) - Coupon code applied
- `coupon_discount_percentage` (INTEGER) - Discount percentage

### Payment Information
- `payment_method` (TEXT) - Payment method (cod, online, upi)
- `payment_status` (TEXT) - Payment status (pending, paid, failed, refunded)
- `transaction_id` (TEXT) - Payment transaction ID

### Order Meta
- `notes` (TEXT) - Additional order notes
- `estimated_delivery` (DATE) - Estimated delivery date
- `actual_delivery_date` (DATE) - Actual delivery date

### Timestamps
- `created_at` (TIMESTAMP) - When the order was created
- `updated_at` (TIMESTAMP) - When the order was last updated

## Features

### Automatic Order Number Generation
The table includes a function `generate_order_number()` that automatically creates unique order numbers in the format YYYYMMDD-XXXX (e.g., 20241201-0001).

### Row Level Security (RLS)
- Users can only view and manage their own orders
- Admins can view and manage all orders
- Secure access control based on user authentication

### Automatic Timestamps
- `created_at` is automatically set when an order is created
- `updated_at` is automatically updated whenever an order is modified

### Performance Indexes
- Indexes on user_id, status, created_at, order_number, and payment_status for fast queries

## Usage Examples

### Creating an Order
```sql
INSERT INTO orders (
  user_id, 
  customer_name, 
  customer_phone, 
  customer_email,
  shipping_address,
  items,
  subtotal,
  shipping_cost,
  tax_amount,
  discount_amount,
  total_amount,
  payment_method
) VALUES (
  'user-uuid',
  'John Doe',
  '1234567890',
  'john@example.com',
  '{"name": "John Doe", "addressLine1": "123 Main St", ...}',
  '[{"product": {...}, "quantity": 1}]',
  1000.00,
  100.00,
  180.00,
  0.00,
  1280.00,
  'cod'
);
```

### Querying Orders
```sql
-- Get all orders for a user
SELECT * FROM orders WHERE user_id = 'user-uuid' ORDER BY created_at DESC;

-- Get orders by status
SELECT * FROM orders WHERE status = 'pending';

-- Get orders from today
SELECT * FROM orders WHERE DATE(created_at) = CURRENT_DATE;
```

## Security Policies

The table includes the following RLS policies:
1. **Users can view own orders** - Users can only see their own orders
2. **Users can insert own orders** - Users can create orders for themselves
3. **Admins can view all orders** - Admins can see and manage all orders

## Troubleshooting

### Common Issues
1. **RLS Policy Errors** - Ensure the user is authenticated and has proper permissions
2. **Order Number Generation** - The function requires proper date formatting
3. **JSONB Data** - Ensure cart items and shipping address are properly formatted JSON

### Testing
After setup, test the following:
1. Create a test order
2. Verify order number generation
3. Check RLS policies work correctly
4. Test order status updates

## Next Steps

Once the orders table is set up:
1. Update your frontend to use the new order system
2. Test the complete order flow from cart to order creation
3. Implement order management in the admin dashboard
4. Add order tracking and status updates 