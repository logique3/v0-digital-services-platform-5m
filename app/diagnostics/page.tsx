'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { SupabaseStatus } from '@/components/SupabaseStatus'
import { isSupabaseConfigured, getServices } from '@/lib/supabase'
import { useCart } from '@/hooks/useCart'
import { CheckCircle, XCircle, AlertCircle, Zap } from 'lucide-react'

export default function DiagnosticsPage() {
  const { supabaseReady, getItemCount, cart } = useCart()
  const [tests, setTests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const runDiagnostics = async () => {
      console.log('[v0] Running diagnostics...')
      const diagnosticTests = []

      // Test 1: Supabase Configuration
      const supabaseConfigured = isSupabaseConfigured()
      diagnosticTests.push({
        name: 'Supabase Configuration',
        status: supabaseConfigured ? 'success' : 'warning',
        message: supabaseConfigured 
          ? 'Supabase environment variables are configured'
          : 'Supabase not configured - add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY',
        icon: supabaseConfigured ? CheckCircle : AlertCircle
      })

      // Test 2: localStorage
      try {
        const testKey = '__test__'
        localStorage.setItem(testKey, 'test')
        localStorage.removeItem(testKey)
        diagnosticTests.push({
          name: 'localStorage Availability',
          status: 'success',
          message: 'localStorage is working correctly',
          icon: CheckCircle
        })
      } catch (error) {
        diagnosticTests.push({
          name: 'localStorage Availability',
          status: 'error',
          message: 'localStorage is not available - cart persistence disabled',
          icon: XCircle
        })
      }

      // Test 3: Cart System
      diagnosticTests.push({
        name: 'Cart System',
        status: 'success',
        message: `Cart system ready - ${getItemCount()} items in cart, ${cart.length} unique items`,
        icon: CheckCircle
      })

      // Test 4: Services Loading (if Supabase configured)
      if (supabaseConfigured) {
        try {
          const services = await getServices()
          diagnosticTests.push({
            name: 'Services Loading',
            status: services.length > 0 ? 'success' : 'warning',
            message: services.length > 0 
              ? `Successfully loaded ${services.length} services from database`
              : 'No services found in database',
            icon: services.length > 0 ? CheckCircle : AlertCircle
          })
        } catch (error) {
          diagnosticTests.push({
            name: 'Services Loading',
            status: 'error',
            message: `Error loading services: ${error instanceof Error ? error.message : 'Unknown error'}`,
            icon: XCircle
          })
        }
      }

      // Test 5: WhatsApp Configuration
      const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
      diagnosticTests.push({
        name: 'WhatsApp Configuration',
        status: whatsappNumber ? 'success' : 'warning',
        message: whatsappNumber 
          ? `WhatsApp configured: ${whatsappNumber}`
          : 'WhatsApp number not configured - add NEXT_PUBLIC_WHATSAPP_NUMBER',
        icon: whatsappNumber ? CheckCircle : AlertCircle
      })

      setTests(diagnosticTests)
      setLoading(false)
    }

    runDiagnostics()
  }, [getItemCount, cart.length])

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline mb-4 inline-flex items-center gap-2">
            ← Back Home
          </Link>
          <h1 className="text-4xl font-bold mb-2">System Diagnostics</h1>
          <p className="text-muted-foreground">Check the health and configuration of your AtlasVault application</p>
        </div>

        {/* Supabase Status */}
        <div className="mb-8">
          <SupabaseStatus />
        </div>

        {/* Diagnostic Tests */}
        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Running diagnostics...</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {tests.map((test, idx) => {
              const Icon = test.icon
              const statusColor = test.status === 'success' 
                ? 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800'
                : test.status === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800'
                : 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'

              const textColor = test.status === 'success'
                ? 'text-green-900 dark:text-green-100'
                : test.status === 'warning'
                ? 'text-amber-900 dark:text-amber-100'
                : 'text-red-900 dark:text-red-100'

              const iconColor = test.status === 'success'
                ? 'text-green-600 dark:text-green-400'
                : test.status === 'warning'
                ? 'text-amber-600 dark:text-amber-400'
                : 'text-red-600 dark:text-red-400'

              return (
                <Card key={idx} className={`border ${statusColor}`}>
                  <CardContent className="py-4 flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColor}`} />
                    <div className="flex-1">
                      <h3 className={`font-semibold ${textColor}`}>{test.name}</h3>
                      <p className={`text-sm mt-1 ${textColor}`}>{test.message}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Configuration Guide */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Quick Setup Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">1. Configure Supabase (Optional)</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Add these variables to enable database synchronization:
                </p>
                <div className="bg-muted p-3 rounded font-mono text-xs space-y-1">
                  <p>NEXT_PUBLIC_SUPABASE_URL=your-url</p>
                  <p>NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">2. Configure WhatsApp</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Set your WhatsApp business number for checkout:
                </p>
                <div className="bg-muted p-3 rounded font-mono text-xs">
                  <p>NEXT_PUBLIC_WHATSAPP_NUMBER=+21612345678</p>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/SUPABASE_SETUP.md">
                  <Button variant="outline" className="w-full">
                    View Full Setup Guide
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Console Logs */}
        <div className="mt-8 p-4 bg-black/50 text-green-400 rounded-lg font-mono text-xs overflow-auto max-h-64">
          <p className="text-blue-400"># Open your browser console (F12) to see detailed logs</p>
          <p className="text-blue-400"># All logs are prefixed with [v0]</p>
          <p className="mt-2">&gt; Cart items: {getItemCount()}</p>
          <p>&gt; Supabase ready: {supabaseReady ? 'true' : 'false'}</p>
          <p>&gt; Tests completed: {tests.length}/5</p>
        </div>
      </div>
    </div>
  )
}
