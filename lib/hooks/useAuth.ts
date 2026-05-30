import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Buyer, AuthTokens } from '../types'

// ── Context shape ────────────────────────────────────────────

type AuthState = {
  buyer: Buyer | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (tokens: AuthTokens) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthState>({
  buyer: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
})

// ── Provider hook (used in app/_layout.tsx) ──────────────────

export function useAuthState(): AuthState {
  const [buyer, setBuyer] = useState<Buyer | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Restore session on app start
  useEffect(() => {
    AsyncStorage.multiGet(['cluckr_token', 'cluckr_buyer'])
      .then(([[, t], [, b]]) => {
        if (t) setToken(t)
        if (b) setBuyer(JSON.parse(b))
      })
      .finally(() => setIsLoading(false))
  }, [])

  const login = async (tokens: AuthTokens) => {
    await AsyncStorage.multiSet([
      ['cluckr_token', tokens.accessToken],
      ['cluckr_buyer', JSON.stringify(tokens.buyer)],
    ])
    setToken(tokens.accessToken)
    setBuyer(tokens.buyer)
  }

  const logout = async () => {
    await AsyncStorage.multiRemove(['cluckr_token', 'cluckr_buyer'])
    setToken(null)
    setBuyer(null)
  }

  return {
    buyer,
    token,
    isLoading,
    isAuthenticated: !!token && !!buyer,
    login,
    logout,
  }
}

// ── Consumer hook ─────────────────────────────────────────────

export const useAuth = () => useContext(AuthContext)