'use client'

import { useState, useEffect, useCallback } from 'react'
import { isSupabaseConfigured, createOrder, getUser } from '@/lib/supabase'

export interface CartItem {
  service_id: string
  name: string
  price: number
  quantity: number
  image_url?: string
}

const CART_STORAGE_KEY = 'atlas_cart'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [supabaseReady, setSupabaseReady] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    console.log('[v0] Initializing cart hook...')
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        setCart(JSON.parse(storedCart))
        console.log('[v0] Cart loaded from localStorage')
      }
    } catch (error) {
      console.error('[v0] Error loading cart from localStorage:', error)
      setCart([])
    } finally {
      // Check Supabase configuration
      const configured = isSupabaseConfigured()
      setSupabaseReady(configured)
      if (configured) {
        console.log('[v0] Supabase is configured and ready')
      } else {
        console.log('[v0] Supabase not configured - using localStorage only')
      }
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
        console.log('[v0] Cart saved to localStorage')
      } catch (error) {
        console.error('[v0] Error saving cart to localStorage:', error)
      }
    }
  }, [cart, isLoading])

  const addToCart = useCallback((item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((ci) => ci.service_id === item.service_id)
      
      if (existingItem) {
        return prevCart.map((ci) =>
          ci.service_id === item.service_id
            ? { ...ci, quantity: ci.quantity + item.quantity }
            : ci
        )
      }
      
      return [...prevCart, item]
    })
  }, [])

  const removeFromCart = useCallback((serviceId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.service_id !== serviceId))
  }, [])

  const updateQuantity = useCallback((serviceId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(serviceId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.service_id === serviceId ? { ...item, quantity } : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const getTotal = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }, [cart])

  const getItemCount = useCallback(() => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }, [cart])

  const submitOrderToSupabase = useCallback(async () => {
    console.log('[v0] Submitting order to Supabase...')
    
    if (!supabaseReady) {
      console.warn('[v0] Supabase not ready - order saved locally only')
      return { success: true, orderId: null, message: 'Order saved locally (Supabase not configured)' }
    }

    if (cart.length === 0) {
      console.error('[v0] Cannot submit empty cart')
      return { success: false, message: 'Cart is empty' }
    }

    try {
      // Get current user
      const user = await getUser()
      if (!user) {
        console.warn('[v0] No user - creating guest order')
        // For guest orders, use a temporary ID
        const guestId = 'guest_' + Date.now()
        const order = await createOrder(guestId, cart, getTotal())
        
        if (order) {
          console.log('[v0] Guest order created:', order.id)
          clearCart()
          return { success: true, orderId: order.id, message: 'Order submitted successfully' }
        }
      } else {
        const order = await createOrder(user.id, cart, getTotal())
        
        if (order) {
          console.log('[v0] Order created for user:', order.id)
          clearCart()
          return { success: true, orderId: order.id, message: 'Order submitted successfully' }
        }
      }

      return { success: false, message: 'Failed to create order' }
    } catch (error) {
      console.error('[v0] Error submitting order:', error)
      return { success: false, message: 'Error submitting order' }
    }
  }, [cart, supabaseReady, getTotal, clearCart])

  return {
    cart,
    isLoading,
    supabaseReady,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
    submitOrderToSupabase,
  }
}
