'use client'

import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

const STORAGE_KEY = 'studypilot-workspace'

//shortcut: a private workspace id per browser instead of accounts; the API trusts userId, add real auth before storing personal data
const newWorkspace = (name) => ({
  id: `ws-${crypto.randomUUID().replaceAll('-', '').slice(0, 16)}`,
  user_metadata: { full_name: name?.trim() || 'Student', department: 'Personal workspace' },
})

const readWorkspace = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY))
  } catch {
    return null
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(readWorkspace())
    setLoading(false)
  }, [])

  const start = (name) => {
    const workspace = newWorkspace(name)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace))
    } catch {
      //Private mode: the workspace still works for this tab
    }
    setUser(workspace)
    return workspace
  }

  const signOut = async () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, start, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
