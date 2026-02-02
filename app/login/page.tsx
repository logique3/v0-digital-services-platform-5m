'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LoginPage() {
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
          <CardTitle className="text-2xl font-bold">User Authentication Disabled</CardTitle>
          <CardDescription>No user login required for our store</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Our store allows you to shop and checkout without creating an account. You'll complete your order via WhatsApp.
          </p>
          <div className="space-y-2">
            <p className="text-sm font-medium">Redirecting you to the shop...</p>
            <Button 
              onClick={() => router.push('/products')}
              className="w-full"
            >
              Go to Shop Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
