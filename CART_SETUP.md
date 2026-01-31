# Cart & WhatsApp Integration Setup

## Overview

Your AtlasVault platform now has a fully functional shopping cart system that:
- Persists cart data using localStorage (automatically synced between pages)
- Allows users to add/remove products and manage quantities
- Redirects to WhatsApp for payment confirmation with pre-filled order details

## Configuration

### Step 1: Set Your WhatsApp Business Number

The cart redirects customers to WhatsApp with their order details. To enable this:

1. **Add Environment Variable:**
   In your Vercel project settings, add:
   ```
   NEXT_PUBLIC_WHATSAPP_NUMBER=+216XXXXXXXXX
   ```
   Replace `XXXXXXXXX` with your actual WhatsApp business number (with country code)

2. **Example:**
   ```
   NEXT_PUBLIC_WHATSAPP_NUMBER=+21612345678
   ```

### Step 2: Verify Configuration

The current fallback is set to `+216XXXXXXXXX`. Once you set the environment variable, customers will be directed to your actual WhatsApp number.

## Features

### Shopping Cart (`/cart`)
- View all added items
- Increase/decrease quantities
- Remove items from cart
- See live total calculation
- Persistent storage (survives page refresh)

### Product Pages (`/products`)
- Browse 4 categories: Vault, Telecom Hub, Gaming Corner, Business Suite
- Add items to cart with one click
- Cart badge shows item count on navigation

### Checkout Flow
When users click "Proceed to Checkout":
1. Cart summary is automatically formatted
2. WhatsApp opens with pre-filled message containing:
   - All items with quantities and prices
   - Subtotal calculation
   - Order ID reference
3. Admin confirms payment and processes order

## How It Works

### Cart Management Hook (`/hooks/useCart.ts`)

The `useCart` hook provides:
- `cart` - Array of cart items
- `addToCart(item)` - Add item to cart
- `removeFromCart(serviceId)` - Remove item
- `updateQuantity(serviceId, quantity)` - Update quantity
- `clearCart()` - Empty the cart
- `getTotal()` - Calculate total price
- `getItemCount()` - Get total items

### Local Storage Structure

Cart items are stored as:
```json
[
  {
    "service_id": "netflix",
    "name": "Netflix Premium",
    "price": 15.99,
    "quantity": 2,
    "image_url": ""
  }
]
```

## Testing

1. **Add to Cart:**
   - Go to `/products`
   - Click "Add to Cart" on any item
   - See cart badge update

2. **Manage Cart:**
   - Go to `/cart`
   - Adjust quantities with +/- buttons
   - Remove items with trash icon

3. **Checkout:**
   - Click "Proceed to Checkout"
   - WhatsApp should open with your message
   - Adjust phone number if needed

## Customization

### Add More Products

Products are defined in `/app/products/page.tsx` in the `categoryData` object:

```javascript
const categoryData = {
  vault: {
    name: 'The Vault',
    items: [
      { id: 'netflix', name: 'Netflix Premium', price: 15.99, description: '4K Ultra HD streaming' },
      // Add more items here
    ]
  }
}
```

### Modify WhatsApp Message

Edit the message template in `/app/cart/page.tsx`:

```javascript
const message = encodeURIComponent(
  `Your custom message here...`
)
```

## Future Enhancements

- [ ] Database sync with Supabase for order history
- [ ] Order tracking for customers
- [ ] Admin dashboard to view orders from WhatsApp
- [ ] Email confirmations
- [ ] Cart wishlist feature

## Troubleshooting

**Cart not persisting?**
- Check browser localStorage is enabled
- Clear browser cache and refresh

**WhatsApp not opening?**
- Ensure WhatsApp is installed on the device
- Check WhatsApp number format (+country code + number)
- Test with a valid phone number

**Wrong phone number?**
- Update `NEXT_PUBLIC_WHATSAPP_NUMBER` environment variable
- Redeploy your application

---

For questions or support, contact your development team.
