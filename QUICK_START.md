# Quick Start Checklist ✅

Get your AtlasVault cart system running in 5 minutes!

## Step 1: Configure WhatsApp (2 min)

- [ ] Go to https://vercel.com → Your Project → Settings → Environment Variables
- [ ] Click "Add New"
- [ ] **Name:** `NEXT_PUBLIC_WHATSAPP_NUMBER`
- [ ] **Value:** `+216XXXXXXXXX` (your WhatsApp number with country code)
  - Example: `+21612345678`
- [ ] Click "Add"
- [ ] Your project automatically redeploys

## Step 2: Test the System (2 min)

- [ ] Visit `https://yoursite.com/test` 
- [ ] See "WhatsApp Configuration" status
- [ ] Click "Add Test Items to Cart"
- [ ] See cart update with test items (Netflix, Spotify)
- [ ] Click "Go to Cart"
- [ ] Adjust quantities with +/- buttons
- [ ] Remove an item with trash icon
- [ ] Click "Proceed to Checkout"
- [ ] WhatsApp should open with your message

## Step 3: Customize Products (1 min - Optional)

- [ ] Edit `/app/products/page.tsx`
- [ ] Find `categoryData` object (line ~23)
- [ ] Change prices, names, descriptions to your products
- [ ] Save and visit `/products` to see changes

## Step 4: Go Live! (0 min)

- [ ] Share your store link: `https://yoursite.com`
- [ ] Customers can start browsing and ordering
- [ ] Monitor WhatsApp for incoming orders

## What Happens Now

### When Customer Shops
1. Visits `https://yoursite.com`
2. Clicks "Shop" or category
3. Adds items to cart
4. Clicks checkout
5. WhatsApp opens with order details

### When You Receive Order on WhatsApp
```
Customer: 
Bonjour, je voudrais passer une commande:

• Netflix Premium: 1x 15.99 TND = 15.99 TND
• Spotify Premium: 2x 12.99 TND = 25.98 TND

Total: 41.97 TND

Verification et confirmation du paiement.
```

You confirm payment and process order manually.

## Key Pages

| URL | Description |
|-----|-------------|
| `/` | Home page |
| `/products` | Shop all products |
| `/products?category=vault` | Streaming subscriptions |
| `/products?category=telecom` | Internet & mobile |
| `/products?category=gaming` | Gaming credits |
| `/products?category=business` | Business tools |
| `/cart` | Shopping cart |
| `/test` | Test page (development) |

## Features Already Enabled

✅ Shopping cart with persistence
✅ Add/remove items
✅ Adjust quantities
✅ Real-time calculations
✅ WhatsApp integration
✅ Automatic message formatting
✅ Mobile responsive
✅ Admin navigation link

## Troubleshooting

**WhatsApp number not working?**
- Make sure format is: `+216XXXXXXXXX`
- Check environment variable is set
- Hard refresh browser (Ctrl+Shift+R)
- Ensure WhatsApp is installed

**Cart not saving?**
- Check if localStorage is enabled
- Try in regular (non-private) browsing
- Clear browser cache and refresh

**Can't see changes?**
- Wait for Vercel deployment (usually 30-60 sec)
- Hard refresh browser (Ctrl+Shift+R)
- Check if you saved the file

## Next Level Features (Optional)

Want to add more? Check these docs:

- **Database integration:** See `CART_SETUP.md`
- **Custom styling:** Edit `app/page.tsx`, `app/products/page.tsx`, `app/cart/page.tsx`
- **More categories:** Add to `categoryData` in `/app/products/page.tsx`
- **Email confirmations:** Integrate SendGrid or similar
- **Order tracking:** Add Supabase database

## Support

- 📖 Full guide: `README_CART.md`
- 🛠️ Technical details: `IMPLEMENTATION_SUMMARY.md`
- ⚙️ Setup guide: `CART_SETUP.md`

---

**Done! 🎉**

Your store is ready. Customers can now shop and order via WhatsApp.

Let's make some sales! 💰
