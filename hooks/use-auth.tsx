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
  const isLoadingRef = useRef(false)

  const loadProfile = useCallback(async ({ silent = false } = {}): Promise<Me | null> => {
    // Éviter les appels simultanés multiples
    if (isLoadingRef.current) {
      // Attendre que l'appel en cours se termine (max 5 secondes)
      let attempts = 0
      while (isLoadingRef.current && attempts < 100) {
        await new Promise(resolve => setTimeout(resolve, 50))
        attempts++
      }
      // Retourner null si on n'a pas pu obtenir le résultat à temps
      return null
    }
    
    isLoadingRef.current = true
    if (!silent) setLoading(true)
    try {
      const profile = await fetchProfile()
      // Si le profil est null (non authentifié), c'est normal, ne pas mettre d'erreur
      if (profile === null) {
        setMe(null)
        setError(null) // Pas d'erreur si juste non authentifié
        return null
      }
      setMe(profile)
      setError(null)
      return profile
    } catch (err) {
      // Seulement mettre une erreur si c'est vraiment une erreur (pas un 401)
      const message = err instanceof Error ? err.message : "Impossible de récupérer le profil"
      // Ne pas considérer les erreurs d'authentification comme des vraies erreurs
      if (!message.includes("401") && !message.includes("Unauthorized")) {
        setError(message)
      } else {
        setError(null)
      }
      setMe(null)
      return null
    } finally {
      hasLoadedRef.current = true
      isLoadingRef.current = false
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  // Recharge silencieusement quand une action auth survient
  useEffect(() => {
    if (typeof window === "undefined") return
    
    let debounceTimer: NodeJS.Timeout | null = null
    let lastLoadTime = 0
    
    const handleAuthChange = () => {
      // Debounce pour éviter les appels multiples rapides
      if (debounceTimer) clearTimeout(debounceTimer)
      
      // Ne pas recharger si on vient de charger il y a moins de 1 seconde
      const now = Date.now()
      if (now - lastLoadTime < 1000) {
        return
      }
      
      debounceTimer = setTimeout(() => {
        if (!isLoadingRef.current) {
          lastLoadTime = Date.now()
          void loadProfile({ silent: true })
        }
      }, 300) // Augmenté à 300ms pour plus de stabilité
    }
    
    const handleFocus = () => {
      // Ne recharger que si on n'a pas encore chargé
      if (!hasLoadedRef.current && !isLoadingRef.current) {
        handleAuthChange()
      }
    }
    
    const visibilityHandler = () => {
      // Ne recharger que si la page devient visible et qu'on n'a pas encore chargé
      if (document.visibilityState === "visible" && !hasLoadedRef.current && !isLoadingRef.current) {
        handleAuthChange()
      }
    }
    
    window.addEventListener("auth:changed", handleAuthChange)
    window.addEventListener("focus", handleFocus)
    document.addEventListener("visibilitychange", visibilityHandler)

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer)
      window.removeEventListener("auth:changed", handleAuthChange)
      window.removeEventListener("focus", handleFocus)
      document.removeEventListener("visibilitychange", visibilityHandler)
    }
  }, [loadProfile])

  const login = useCallback(
    async (payload: LoginPayload) => {
      await apiLogin(payload)
      // apiLogin() dispatch déjà auth:changed, pas besoin de le refaire
      
      // En production, les cookies cross-domain peuvent prendre plus de temps
      // Attendre que les cookies soient disponibles avant de charger le profil
      // On fait plusieurs tentatives avec délai croissant
      let profile: Me | null = null
      for (let attempt = 0; attempt < 3; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 500 + attempt * 500))
        profile = await loadProfile({ silent: true })
        if (profile) break
      }
      
      return profile
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
