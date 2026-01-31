'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { WHATSAPP_NUMBER } from '@/lib/config'

interface CartItem {
  id: string
  service_id: string
  quantity: number
  service?: {
    id: string
    name: string
    price: number
    description: string
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const total = cartItems.reduce((sum, item) => {
    const qty = quantities[item.service_id] || item.quantity || 1
    return sum + ((item.service?.price || 0) * qty)
  }, 0)

  const handleQuantityChange = (serviceId: string, newQty: number) => {
    if (newQty < 1) return
    setQuantities(prev => ({ ...prev, [serviceId]: newQty }))
  }

  const removeFromCart = (serviceId: string) => {
    setCartItems(prev => prev.filter(item => item.service_id !== serviceId))
    setQuantities(prev => {
      const newQty = { ...prev }
      delete newQty[serviceId]
      return newQty
    })
    toast.success('Removed from cart')
  }

  const handleCheckout = async () => {
    setLoading(true)
    try {
      // Create order summary for WhatsApp
      const orderSummary = cartItems.map(item => 
        `• ${item.service?.name}: ${quantities[item.service_id] || item.quantity || 1}x ${item.service?.price} TND`
      ).join('%0A')
      
      const message = `Bonjour, je voudrais passer une commande:%0A%0A${orderSummary}%0A%0ATotal: ${total.toFixed(2)} TND%0A%0AVerification et confirmation du paiement.`
      
      // Redirect to WhatsApp with order details
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
      
      toast.success('Redirecting to WhatsApp for payment confirmation...')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to process order')
    } finally {
      setLoading(false)
    }
  }

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
        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            {cartItems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Link href="/products">
                    <Button>Continue Shopping</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <Card key={item.service_id}>
                    <CardContent className="py-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.service?.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {item.service?.description}
                          </p>
                          <p className="text-lg font-bold text-primary mt-2">
                            {item.service?.price} TND
                          </p>
                        </div>
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            min="1"
                            value={quantities[item.service_id] || item.quantity || 1}
                            onChange={(e) => handleQuantityChange(item.service_id, parseInt(e.target.value))}
                            className="w-16"
                          />
                          <button
                            onClick={() => removeFromCart(item.service_id)}
                            className="p-2 hover:bg-destructive/10 rounded text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          {cartItems.length > 0 && (
            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
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
                      <span className="text-primary">{total.toFixed(2)} TND</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleCheckout}
                    disabled={loading}
                  >
                    {loading ? 'Processing...' : 'Proceed to Checkout'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
