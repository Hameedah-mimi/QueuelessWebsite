import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import api from '../api/client'

const AuthContext = createContext(null)

const ROLES = {
  CUSTOMER: 'customer',
  WORKER: 'worker',
  ORGANIZATION: 'organization',
  ADMIN: 'admin',
}

// Helper to extract clean error message from Django / Axios responses
const extractErrorMessage = (err, fallback) => {
  if (err.response?.data) {
    const data = err.response.data
    // Custom backend shape { error: { message: "..." } }
    if (data.error?.message) return data.error.message
    // DRF default detail shape { detail: "..." }
    if (typeof data.detail === 'string') return data.detail
    // DRF validation error shape { email: ["..."], non_field_errors: ["..."] }
    if (typeof data === 'object') {
      const firstKey = Object.keys(data)[0]
      if (firstKey) {
        const val = data[firstKey]
        if (Array.isArray(val)) return `${firstKey}: ${val[0]}`
        if (typeof val === 'string') return `${firstKey}: ${val}`
      }
    }
  }
  return err.message || fallback
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load user from localStorage on mount + listen to Firebase
  useEffect(() => {
    const saved = localStorage.getItem('ql_user')
    if (saved) {
      try {
        setUser(JSON.parse(saved))
      } catch {}
    }

    if (!auth) {
      setLoading(false)
      return
    }

    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          await fbUser.getIdToken()
          // Stored Django user session is retained
        } catch (e) {
          console.warn('Firebase token error', e)
        }
      }
      setLoading(false)
    })

    return () => unsub()
  }, [])

  const persist = (userData, tokens = {}) => {
    if (tokens.access) localStorage.setItem('ql_access', tokens.access)
    if (tokens.refresh) localStorage.setItem('ql_refresh', tokens.refresh)
    if (userData) {
      localStorage.setItem('ql_user', JSON.stringify(userData))
      setUser(userData)
    }
  }

  const clear = () => {
    localStorage.removeItem('ql_access')
    localStorage.removeItem('ql_refresh')
    localStorage.removeItem('ql_user')
    setUser(null)
  }

  // ---------- Email / Password (Django JWT) ----------
  const loginWithEmail = async (email, password, role) => {
    setError(null)
    try {
      const { data } = await api.post('/api/v1/auth/login/', { email, password })
      
      // Enforce role match
      if (data.user.role !== role) {
        throw new Error(`This account is a ${data.user.role}, not a ${role}`)
      }
      // Admin accounts must be pre-approved
      if (role === ROLES.ADMIN && !data.user.is_approved) {
        throw new Error('Admin account is not approved yet')
      }

      persist(data.user, { access: data.access, refresh: data.refresh })
      return data.user
    } catch (err) {
      const msg = extractErrorMessage(err, 'Login failed')
      setError(msg)
      throw new Error(msg)
    }
  }

  const registerWithEmail = async (payload) => {
    setError(null)
    // Admin cannot self-register
    if (payload.role === ROLES.ADMIN) {
      const msg = 'Admin accounts are invite-only. Contact support.'
      setError(msg)
      throw new Error(msg)
    }
    try {
      const { data } = await api.post('/api/v1/auth/register/', payload)
      persist(data.user, { access: data.access, refresh: data.refresh })
      return data.user
    } catch (err) {
      const msg = extractErrorMessage(err, 'Registration failed')
      setError(msg)
      throw new Error(msg)
    }
  }

  // ---------- Google (Firebase → exchange for Django JWT) ----------
  const loginWithGoogle = async (role) => {
    setError(null)
    if (!auth) throw new Error('Firebase is not configured. Add your keys to .env')
    if (role === ROLES.ADMIN) {
      throw new Error('Admin accounts cannot use Google sign-in. Contact support.')
    }
    try {
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()
      
      // Send Firebase ID token to Django to exchange for JWT
      const { data } = await api.post('/api/v1/auth/firebase/', {
        id_token: idToken,
        role,
      })
      persist(data.user, { access: data.access, refresh: data.refresh })
      return data.user
    } catch (err) {
      const msg = extractErrorMessage(err, 'Google sign-in failed')
      setError(msg)
      throw new Error(msg)
    }
  }

  const logout = async () => {
    try {
      if (auth) await firebaseSignOut(auth)
    } catch {}
    clear()
  }

  const updateProfile = (partial) => {
    const next = { ...user, ...partial }
    localStorage.setItem('ql_user', JSON.stringify(next))
    setUser(next)
  }

  const value = {
    user,
    loading,
    error,
    setError,
    isAuthenticated: !!user,
    role: user?.role || null,
    loginWithEmail,
    registerWithEmail,
    loginWithGoogle,
    logout,
    updateProfile,
    ROLES,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}