'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignupPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to products page after 2 seconds
    const timer = setTimeout(() => {
      router.push('/products')
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">No Sign-up Required</CardTitle>
          <CardDescription>Shop without creating an account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            At AtlasVault, you can browse and purchase digital services instantly without creating an account. Complete your payment directly via WhatsApp.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Redirecting you to the shop...</p>
            <Button 
              onClick={() => router.push('/products')}
              className="w-full"
            >
              Start Shopping Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
