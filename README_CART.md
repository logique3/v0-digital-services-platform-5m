# AtlasVault - Shopping Cart System Guide

## Welcome! 🎉

Your AtlasVault platform now has a **fully functional shopping cart system** with WhatsApp integration. Here's everything you need to know.

## Quick Start

### 1. Set Your WhatsApp Number

Go to your Vercel project and add this environment variable:

**Variable:** `NEXT_PUBLIC_WHATSAPP_NUMBER`
**Value:** `+216XXXXXXXXX` (replace with your business WhatsApp number)

Example: `+21612345678`

[How to add environment variables in Vercel](https://vercel.com/docs/projects/environment-variables)

### 2. Test the Cart

Visit: `https://yoursite.com/test`

This page lets you:
- See WhatsApp configuration status
- Add test items to cart
- View cart contents
- Test the checkout flow

### 3. Go Live!

Once WhatsApp is configured, your customers can:
1. Browse products
2. Add items to cart
3. Checkout via WhatsApp
4. You receive and confirm orders

## How Customers Will Use It

### Step 1: Browse Products
- Customer visits your store
- Browses 4 categories: Vault, Telecom, Gaming, Business

### Step 2: Add to Cart
- Clicks "Add to Cart" on any item
- Gets a notification "Added to cart!"
- Continues shopping or goes to cart

### Step 3: Review Cart
- Clicks cart icon in navigation
- Sees all items with quantities
- Can adjust amounts or remove items
- Sees total price

### Step 4: Checkout
- Clicks "Proceed to Checkout"
- WhatsApp opens automatically
- Pre-filled message shows:
  - All items with quantities
  - Unit prices
  - Total amount

### Step 5: You Confirm
- You receive WhatsApp message from customer
- Review their order
- Confirm payment method
- Process the order manually

## How It Works (Technical)

### The Cart
- **Storage:** Browser's localStorage (persists between sessions)
- **Updates:** Real-time, no page reload needed
- **Sync:** Automatic across all pages

### Checkout Flow
```
Customer clicks "Checkout"
    ↓
Cart items formatted
    ↓
WhatsApp URL created with message
    ↓
WhatsApp app/web opens
    ↓
Message pre-filled with order details
    ↓
Customer sends message
    ↓
Admin receives WhatsApp notification
    ↓
Admin confirms payment
    ↓
Order fulfilled
```

### Key Pages

| URL | Purpose |
|-----|---------|
| `/` | Home page with categories |
| `/products?category=vault` | Browse products by category |
| `/cart` | Shopping cart and checkout |
| `/test` | Test cart system (for you) |

## Features

✅ **Persistent Cart** - Survives page refresh
✅ **Real-time Updates** - No reloads needed
✅ **Easy Checkout** - One click to WhatsApp
✅ **Automatic Formatting** - Order details pre-filled
✅ **Mobile Friendly** - Works on any device
✅ **Fast** - No database queries needed
✅ **Secure** - Client-side processing

## Customization

### Add More Products

Edit `/app/products/page.tsx` and add items to `categoryData`:

```javascript
const categoryData = {
  vault: {
    name: 'The Vault',
    items: [
      { 
        id: 'netflix', 
        name: 'Netflix Premium', 
        price: 15.99, 
        description: '4K Ultra HD streaming' 
      },
      // Add more items here
    ]
  }
}
```

### Change WhatsApp Message

Edit `/lib/whatsapp.ts`, modify the `formatWhatsAppMessage` function:

```typescript
export function formatWhatsAppMessage(items, total): string {
  // Your custom message here
}
```

### Customize Cart Appearance

Edit `/app/cart/page.tsx` to change colors, layout, text, etc.

## Troubleshooting

### Problem: Cart is empty after refresh
**Solution:** Make sure:
- Cookies/localStorage isn't disabled in browser
- You're on a supported browser (Chrome, Firefox, Safari, etc.)
- Try clearing browser cache

### Problem: WhatsApp doesn't open
**Solution:** Check:
- WhatsApp number format: `+216XXXXXXXXX`
- WhatsApp is installed on device
- Try refreshing the page

### Problem: Wrong WhatsApp number
**Solution:**
- Update `NEXT_PUBLIC_WHATSAPP_NUMBER` env var
- Redeploy your application
- Hard refresh browser (Ctrl+Shift+R)

### Problem: Cart items disappear
**Solution:**
- localStorage might be cleared
- Try adding items again
- Check if private/incognito browsing is on

## Performance Tips

- 💡 Cart uses localStorage (no database calls)
- 💡 No page reloads on cart updates
- 💡 Cart loads instantly on `/cart` page
- 💡 WhatsApp opens in new tab (keeps shopping experience)

## Security Notes

The cart system is **read-only** from a data perspective:
- ✅ Prices shown are for reference only
- ✅ Actual orders processed through WhatsApp
- ✅ No payment processing server-side
- ✅ No user accounts needed
- ⚠️ Don't store sensitive data in localStorage

## Advanced: Database Integration

If you want to save orders to a database:

1. Enable Supabase integration
2. Create `orders` and `order_items` tables
3. On checkout, save order to database before WhatsApp
4. Share order ID in WhatsApp message
5. Admin can search orders by ID

[See advanced setup guide](./CART_SETUP.md)

## Files Overview

```
/app
  /products/page.tsx      → Browse and add to cart
  /cart/page.tsx          → View cart, adjust, checkout
  /test/page.tsx          → Test page for development
  /page.tsx               → Home page

/hooks
  /useCart.ts             → Cart state management

/components
  /CartBadge.tsx          → Cart icon with count
  /WhatsAppStatus.tsx     → Config status display

/lib
  /whatsapp.ts            → WhatsApp utilities
  /config.ts              → Configuration
  /supabase.ts            → Database (optional)
```

## Key Features by File

| File | Feature |
|------|---------|
| useCart.ts | Add/remove items, persist to localStorage |
| CartBadge.tsx | Shows item count in navigation |
| WhatsAppStatus.tsx | Shows if WhatsApp is configured |
| formatWhatsAppMessage | Creates pre-filled message |

## Next Steps

1. ✅ Set `NEXT_PUBLIC_WHATSAPP_NUMBER` environment variable
2. ✅ Test at `/test` page
3. ✅ Share store URL with customers
4. ✅ Monitor WhatsApp for incoming orders
5. ✅ Process orders manually (confirm payment, fulfill)

## Support & Questions

For detailed information, see:
- `CART_SETUP.md` - Complete setup guide
- `IMPLEMENTATION_SUMMARY.md` - Technical details

---

**You're all set! 🚀**

Your customers can now browse, add to cart, and checkout via WhatsApp.

Happy selling! 💰
