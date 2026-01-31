'use client'

import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react'

export function SupabaseStatus() {
  const [isConfigured, setIsConfigured] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const configured = isSupabaseConfigured()
    setIsConfigured(configured)
    console.log('[v0] SupabaseStatus - Configured:', configured)
  }, [])

  if (!mounted) return null

  if (isConfigured) {
    return (
      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-green-900 dark:text-green-100">Supabase Configured</h3>
          <p className="text-sm text-green-800 dark:text-green-200 mt-1">
            Your application is connected to Supabase. Orders will be saved to the database.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-amber-900 dark:text-amber-100">Supabase Not Configured</h3>
        <p className="text-sm text-amber-800 dark:text-amber-200 mt-1">
          Add your Supabase environment variables to enable database synchronization. 
          <a 
            href="https://supabase.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline ml-1 hover:font-bold"
          >
            Get started with Supabase
          </a>
        </p>
        <p className="text-xs text-amber-700 dark:text-amber-300 mt-2 font-mono bg-white dark:bg-amber-900/50 p-2 rounded">
          NEXT_PUBLIC_SUPABASE_URL<br/>
          NEXT_PUBLIC_SUPABASE_ANON_KEY
        </p>
      </div>
    </div>
  )
}
