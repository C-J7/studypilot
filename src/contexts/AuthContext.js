'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'

const AuthContext = createContext({})

const DEMO_FLAG = 'studypilot-demo'

//Shared demo account, seeded by the API on every boot, so visitors can explore without signing up
const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@studypilot.app',
  isDemo: true,
  user_metadata: { full_name: 'Demo Student', department: 'Computer Science' },
}

const isDemoActive = () => {
  try {
    return localStorage.getItem(DEMO_FLAG) === '1'
  } catch {
    return false
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoActive()) {
      setUser(DEMO_USER)
      setLoading(false)
      return
    }

    supabase.auth.getSession()
      .then(({ data: { session } }) => setUser(session?.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isDemoActive()) setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const startDemo = () => {
    localStorage.setItem(DEMO_FLAG, '1')
    setUser(DEMO_USER)
  }

  const signOut = async () => {
    if (user?.isDemo) {
      localStorage.removeItem(DEMO_FLAG)
      setUser(null)
      return
    }
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, startDemo }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  return useContext(AuthContext)
}
