"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import {
  getMe as fetchProfile,
  login as apiLogin,
  logout as apiLogout,
  refresh as apiRefresh,
  updateProfile as apiUpdateProfile,
  type UpdateProfilePayload,
} from "@/lib/auth"

type Profile = {
  phone?: string | null
  address?: string | null
  city?: string | null
  postal_code?: string | null
  is_seller?: boolean
  business_name?: string | null
  business_description?: string | null
  business_address?: string | null
  business_city?: string | null
  business_postal_code?: string | null
  business_country?: string | null
  min_order_amount?: number | null
  delivery_time?: string | null
  terms_of_sale?: string | null
  mon_open?: string | null
  mon_close?: string | null
  sat_open?: string | null
  sat_close?: string | null
  sun_open?: string | null
  sun_close?: string | null
}

type Me = {
  id: number
  username: string
  email?: string
  first_name?: string
  last_name?: string
  profile?: Profile | null
  is_seller?: boolean
}

type LoginPayload = { username: string; password: string }

type AuthContextValue = {
  me: Me | null
  loading: boolean
  error: string | null
  login: (payload: LoginPayload) => Promise<Me | null>
  logout: () => Promise<void>
  refresh: () => Promise<Me | null>
  reload: () => Promise<Me | null>
  updateProfile: (payload: UpdateProfilePayload) => Promise<Me | null>
}

declare global {
  interface WindowEventMap {
    "auth:changed": CustomEvent<void>
  }
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [me, setMe] = useState<Me | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasLoadedRef = useRef(false)

  const loadProfile = useCallback(async ({ silent = false } = {}): Promise<Me | null> => {
    if (!silent) setLoading(true)
    try {
      const profile = await fetchProfile()
      setMe(profile)
      setError(null)
      return profile
    } catch (err) {
      const message = err instanceof Error ? err.message : "Impossible de récupérer le profil"
      setError(message)
      setMe(null)
      return null
    } finally {
      hasLoadedRef.current = true
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  // Recharge silencieusement quand une action auth survient
  useEffect(() => {
    if (typeof window === "undefined") return
    const handleAuthChange = () => {
      void loadProfile({ silent: true })
    }
    const handleFocus = () => {
      handleAuthChange()
    }
    const visibilityHandler = () => {
      if (document.visibilityState === "visible") {
        handleAuthChange()
      }
    }
    window.addEventListener("auth:changed", handleAuthChange)
    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", visibilityHandler)

    return () => {
      window.removeEventListener("auth:changed", handleAuthChange)
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", visibilityHandler)
    }
  }, [loadProfile])

  const login = useCallback(
    async (payload: LoginPayload) => {
      await apiLogin(payload)
      return loadProfile({ silent: true })
    },
    [loadProfile],
  )

  const logout = useCallback(async () => {
    await apiLogout()
    setMe(null)
  }, [])

  const refresh = useCallback(async () => {
    await apiRefresh()
    return loadProfile({ silent: true })
  }, [loadProfile])

  const reload = useCallback(async () => {
    return loadProfile({ silent: hasLoadedRef.current })
  }, [loadProfile])

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload) => {
      try {
        const updated = await apiUpdateProfile(payload)
        setMe(updated)
        setError(null)
        return updated
      } catch (err) {
        const message = err instanceof Error ? err.message : "Impossible de mettre a jour le profil"
        setError(message)
        throw err
      }
    },
    [],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      me,
      loading,
      error,
      login,
      logout,
      refresh,
      reload,
      updateProfile,
    }),
    [me, loading, error, login, logout, refresh, reload, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider")
  }
  return context
}
