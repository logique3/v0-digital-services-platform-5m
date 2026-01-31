import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey)
}

// Initialize Supabase client
export const supabase = isSupabaseConfigured() 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null

// Database functions with proper error handling
export async function getServices() {
  console.log('[v0] Fetching services from Supabase...')
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('[v0] Supabase not configured - services unavailable')
    return []
  }

  try {
    const { data, error } = await supabase.from('services').select('*')
    if (error) {
      console.error('[v0] Error fetching services:', error.message)
      return []
    }
    console.log('[v0] Services fetched successfully:', data?.length || 0)
    return data || []
  } catch (error) {
    console.error('[v0] Exception fetching services:', error)
    return []
  }
}

export async function createOrder(userId: string, items: any[], total: number) {
  console.log('[v0] Creating order in Supabase...')
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('[v0] Supabase not configured - order not created')
    return null
  }

  try {
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        total_amount: total,
        status: 'pending',
        payment_method: 'whatsapp'
      })
      .select()
      .single()

    if (orderError) {
      console.error('[v0] Error creating order:', orderError.message)
      return null
    }

    console.log('[v0] Order created:', order.id)

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      service_id: item.service_id,
      quantity: item.quantity,
      unit_price: item.price
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('[v0] Error creating order items:', itemsError.message)
      return order
    }

    console.log('[v0] Order items created successfully')
    return order
  } catch (error) {
    console.error('[v0] Exception creating order:', error)
    return null
  }
}

export async function getUser() {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('[v0] Supabase not configured')
    return null
  }
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch (error) {
    console.error('[v0] Error getting user:', error)
    return null
  }
}

export async function getUserProfile(userId: string) {
  if (!isSupabaseConfigured() || !supabase) {
    console.warn('[v0] Supabase not configured')
    return null
  }
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) {
      console.error('[v0] Error fetching profile:', error.message)
      return null
    }
    return data
  } catch (error) {
    console.error('[v0] Exception fetching profile:', error)
    return null
  }
}
