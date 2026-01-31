'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/hooks/useCart'

export function CartBadge() {
  const { isLoading, getItemCount } = useCart()
  const [itemCount, setItemCount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      setItemCount(getItemCount())
    }
  }, [mounted, getItemCount])

  if (!mounted) {
    return (
      <Link href="/cart">
        <Button variant="ghost" size="sm">
          <ShoppingCart className="w-5 h-5" />
        </Button>
      </Link>
    )
  }

  return (
    <Link href="/cart">
      <Button variant="ghost" size="sm" className="relative">
        <ShoppingCart className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-destructive text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
            {itemCount > 99 ? '99+' : itemCount}
          </span>
        )}
      </Button>
    </Link>
  )
}
