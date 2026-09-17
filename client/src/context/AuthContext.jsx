import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import AuthModal from '../components/auth/AuthModal'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true) // true while checking session
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login')
  const [authSuccessCb, setAuthSuccessCb] = useState(null)

  // Check existing session on mount
  useEffect(() => {
    authService
      .getMe()
      .then((res) => {
        setUser(res.data)
        setIsAuthenticated(true)
      })
      .catch(() => {
        setUser(null)
        setIsAuthenticated(false)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await authService.login(email, password)
    setUser(res.data)
    setIsAuthenticated(true)
    return res.data
  }, [])

  const register = useCallback(async (name, email, password) => {
    const res = await authService.register(name, email, password)
    setUser(res.data)
    setIsAuthenticated(true)
    return res.data
  }, [])

  const logout = useCallback(async () => {
    await authService.logout().catch(() => {})
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const updateProfile = useCallback(async (data) => {
    const res = await authService.updateProfile(data)
    setUser(res.data)
    return res.data
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const res = await authService.getMe()
      setUser(res.data)
      setIsAuthenticated(true)
    } catch {
      setUser(null)
      setIsAuthenticated(false)
    }
  }, [])

  const openAuthModal = useCallback((mode = 'login', onSuccess = null) => {
    setAuthModalMode(mode)
    setAuthSuccessCb(onSuccess ? () => onSuccess : null)
    setAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false)
    setAuthSuccessCb(null)
  }, [])

  const handleAuthSuccess = useCallback(() => {
    if (authSuccessCb) {
      const cb = authSuccessCb
      setAuthSuccessCb(null)
      cb()
    }
  }, [authSuccessCb])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
      {/* Global auth modal — can be triggered from anywhere in the app */}
      <AuthModal
        isOpen={authModalOpen}
        mode={authModalMode}
        onClose={closeAuthModal}
        onSuccess={handleAuthSuccess}
      />
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
