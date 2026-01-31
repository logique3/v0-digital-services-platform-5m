'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/hooks/useCart'
import { WHATSAPP_NUMBER } from '@/lib/config'
import { formatWhatsAppMessage, isWhatsAppConfigured } from '@/lib/whatsapp'

export default function CartPage() {
  const { cart, isLoading, supabaseReady, removeFromCart, updateQuantity, getTotal, submitOrderToSupabase } = useCart()
  const [processing, setProcessing] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty')
      return
    }

    if (!isWhatsAppConfigured()) {
      toast.error('WhatsApp number not configured. Please contact support.')
      return
    }

    setProcessing(true)
    try {
      // Submit order to Supabase if configured
      if (supabaseReady) {
        console.log('[v0] Submitting order to Supabase...')
        const result = await submitOrderToSupabase()
        if (!result.success) {
          toast.error(result.message)
          setProcessing(false)
          return
        }
        console.log('[v0] Order submitted to Supabase:', result.orderId)
        toast.success('Order saved to database!')
      }

      const total = getTotal()
      const message = encodeURIComponent(formatWhatsAppMessage(cart, total))
      
      // Redirect to WhatsApp with order details
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
      
      toast.success('Redirecting to WhatsApp for payment confirmation...')
    } catch (error) {
      console.error('[v0] Checkout error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to process order')
    } finally {
      setProcessing(false)
    }
  }

  if (!mounted) {
    return null
  }

  const total = getTotal()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/products" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-96">
            <p className="text-muted-foreground">Loading cart...</p>
          </div>
        ) : cart.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4 text-lg">Your cart is empty</p>
              <Link href="/products">
                <Button>Continue Shopping</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="md:col-span-2">
              <div className="space-y-4">
                {cart.map((item) => (
                  <Card key={item.service_id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="py-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{item.name}</h3>
                          <p className="text-lg font-bold text-primary mt-2">
                            {item.price.toFixed(2)} TND
                          </p>
                        </div>
                        <div className="flex gap-2 items-center bg-muted rounded-lg p-2">
                          <button
                            onClick={() => updateQuantity(item.service_id, item.quantity - 1)}
                            className="p-1 hover:bg-background rounded transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 font-semibold min-w-12 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.service_id, item.quantity + 1)}
                            className="p-1 hover:bg-background rounded transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <div className="w-px h-6 bg-border mx-1" />
                          <button
                            onClick={() => {
                              removeFromCart(item.service_id)
                              toast.success('Removed from cart')
                            }}
                            className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-muted-foreground text-right">
                        Subtotal: {(item.price * item.quantity).toFixed(2)} TND
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Items</span>
                      <span>{cart.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{total.toFixed(2)} TND</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary text-lg">{total.toFixed(2)} TND</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={processing}
                    size="lg"
                  >
                    {processing ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                  <Link href="/products">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
