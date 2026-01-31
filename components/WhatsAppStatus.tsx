'use client'

import { AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { isWhatsAppConfigured, getWhatsAppStatusMessage } from '@/lib/whatsapp'
import { WHATSAPP_NUMBER } from '@/lib/config'

export function WhatsAppStatus() {
  const configured = isWhatsAppConfigured()
  const statusMessage = getWhatsAppStatusMessage()

  return (
    <Alert className={configured ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
      <div className="flex gap-3">
        {configured ? (
          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
        ) : (
          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
        )}
        <div>
          <AlertTitle className={configured ? 'text-green-900' : 'text-yellow-900'}>
            WhatsApp Configuration
          </AlertTitle>
          <AlertDescription className={configured ? 'text-green-800' : 'text-yellow-800'}>
            {statusMessage}
            {!configured && (
              <div className="mt-2 text-sm">
                <p>Current value: <code className="bg-white px-2 py-1 rounded">{WHATSAPP_NUMBER}</code></p>
                <p className="mt-1">Add <code className="bg-white px-1">NEXT_PUBLIC_WHATSAPP_NUMBER</code> environment variable to your Vercel project.</p>
              </div>
            )}
          </AlertDescription>
        </div>
      </div>
    </Alert>
  )
}
