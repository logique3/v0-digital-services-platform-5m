'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { toast } from 'sonner'
import { WhatsAppStatus } from '@/components/WhatsAppStatus'

export default function TestPage() {
  const { cart, addToCart, clearCart, getTotal, getItemCount } = useCart()
  const [testAdded, setTestAdded] = useState(false)

  const addTestItems = () => {
    clearCart()
    addToCart({
      service_id: 'test-netflix',
      name: 'Netflix Premium',
      price: 15.99,
      quantity: 1,
    })
    addToCart({
      service_id: 'test-spotify',
      name: 'Spotify Premium',
      price: 12.99,
      quantity: 2,
    })
    setTestAdded(true)
    toast.success('Test items added to cart!')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 text-primary hover:underline mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold">Cart System Test Page</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Test Controls */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <WhatsAppStatus />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Click the button below to add test items to your cart.
                </p>
                <Button 
                  onClick={addTestItems}
                  className="w-full"
                  size="lg"
                >
                  Add Test Items to Cart
                </Button>
                <Button 
                  onClick={() => {
                    clearCart()
                    setTestAdded(false)
                    toast.success('Cart cleared!')
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Clear Cart
                </Button>
                <Link href="/cart" className="w-full block">
                  <Button className="w-full" variant="secondary">
                    Go to Cart
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Cart Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cart Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-4 rounded">
                    <p className="text-sm text-muted-foreground">Items</p>
                    <p className="text-2xl font-bold">{getItemCount()}</p>
                  </div>
                  <div className="bg-muted p-4 rounded">
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{getTotal().toFixed(2)} TND</p>
                  </div>
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Cart is empty</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Click "Add Test Items" to populate the cart
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm">Items in Cart:</h3>
                    <ul className="space-y-2">
                      {cart.map((item) => (
                        <li key={item.service_id} className="text-sm p-2 bg-muted rounded">
                          <div className="flex justify-between">
                            <span>{item.name}</span>
                            <span>x{item.quantity}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {(item.price * item.quantity).toFixed(2)} TND
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <ol className="space-y-2 list-decimal list-inside">
                  <li>Click "Add Test Items to Cart"</li>
                  <li>See cart update above</li>
                  <li>Click "Go to Cart"</li>
                  <li>Test adjusting quantities</li>
                  <li>Click "Proceed to Checkout"</li>
                  <li>WhatsApp should open</li>
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
