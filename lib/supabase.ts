import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let supabase: any = null

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  // Create a mock client for development when env vars are missing
  supabase = {
    auth: {
      getUser: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
      signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
      signOut: async () => ({ error: new Error('Supabase not configured') }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error('Supabase not configured') }),
        }),
      }),
    }),
  }
}

export { supabase }

export async function getUser() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[v0] Supabase not configured: Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
    throw new Error('Supabase not configured. Please add your Supabase credentials to the environment variables.')
  }
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile(userId: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[v0] Supabase not configured: Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
    throw new Error('Supabase not configured. Please add your Supabase credentials to the environment variables.')
  }
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export async function signUp(email: string, password: string, fullName: string, phone: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[v0] Supabase not configured: Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
    throw new Error('Supabase not configured. Please add your Supabase credentials to the environment variables.')
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
      }
    }
  })
  
  if (error) throw error
  return data
}

export async function signIn(email: string, password: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[v0] Supabase not configured: Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
    throw new Error('Supabase not configured. Please add your Supabase credentials to the environment variables.')
  }
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) throw error
  return data
}

export async function signOut() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[v0] Supabase not configured: Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
    throw new Error('Supabase not configured. Please add your Supabase credentials to the environment variables.')
  }
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
