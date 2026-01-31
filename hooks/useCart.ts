'use client'

import { useState, useEffect, useCallback } from 'react'

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

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        setCart(JSON.parse(storedCart))
      }
    } catch (error) {
      console.error('[v0] Error loading cart from localStorage:', error)
      setCart([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
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

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  }
}
