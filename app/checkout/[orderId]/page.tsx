'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/config'

export default function CheckoutPage() {
  const params = useParams()
  const orderId = params.orderId as string
  
  const [processing, setProcessing] = useState(false)

  // For demo purposes, show sample order
  const sampleOrder = {
    id: orderId,
    total_amount: 29.99,
    order_items: [
      { service: { name: 'Netflix Subscription' }, quantity: 1, unit_price: 29.99 }
    ]
  }

  const handleWhatsAppCheckout = () => {
    setProcessing(true)
    try {
      const items = sampleOrder.order_items
        .map(item => `• ${item.service.name}: ${item.quantity}x ${item.unit_price} TND`)
        .join('%0A')
      
      const message = `Bonjour, j'aimerais confirmer ma commande:%0A%0A${items}%0A%0ATotal: ${sampleOrder.total_amount.toFixed(2)} TND%0A%0AID Commande: ${orderId}`
      
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
      toast.success('Redirecting to WhatsApp for confirmation...')
    } catch (error) {
      toast.error('Failed to open WhatsApp')
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Confirm Your Order</h1>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sampleOrder.order_items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-sm">
                <div>
                  <p className="font-medium">{item.service.name}</p>
                  <p className="text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">{(item.unit_price * item.quantity).toFixed(2)} TND</p>
              </div>
            ))}
            <div className="border-t pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{sampleOrder.total_amount.toFixed(2)} TND</span>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded border border-blue-200 dark:border-blue-800 space-y-3">
              <p className="text-sm font-medium flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Complete Payment via WhatsApp
              </p>
              <p className="text-xs text-muted-foreground">
                Click the button below to contact us on WhatsApp. Our team will guide you through the payment process and confirm your order.
              </p>
            </div>

            <Button 
              className="w-full mt-6"
              size="lg"
              onClick={handleWhatsAppCheckout}
              disabled={processing}
            >
              {processing ? 'Opening WhatsApp...' : `Confirm via WhatsApp`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
