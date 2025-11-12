"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getMe, logout } from "@/lib/auth"
import { showToast } from "@/components/toast-notification"

type Me = { id: number; username: string; email?: string }

export default function AuthStatus() {
  const [me, setMe] = useState<Me | null>(null)
  const [pending, setPending] = useState(false)

  async function load() {
    try {
      const m = await getMe()
      setMe(m)
    } catch {
      setMe(null)
    }
  }

  useEffect(() => {
    load()
    const handler = () => load()
    window.addEventListener("auth:changed", handler as any)
    window.addEventListener("focus", handler as any)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") load()
    })
    return () => {
      window.removeEventListener("auth:changed", handler as any)
      window.removeEventListener("focus", handler as any)
      document.removeEventListener("visibilitychange", handler as any)
    }
  }, [])

  const onLogout = async () => {
    try {
      setPending(true)
      await logout()
      setMe(null)
      showToast("success", "Deconnecte", "A bientot")
    } finally {
      setPending(false)
    }
  }

  if (!me) {
    return (
      <nav className="flex items-center gap-2">
        <Button asChild variant="ghost">
          <Link href="/auth/login">Se connecter</Link>
        </Button>
        <Button asChild>
          <Link href="/auth/signup">S'inscrire</Link>
        </Button>
      </nav>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-zinc-700">Bonjour, <strong>{me.username}</strong></span>
      <Button asChild variant="ghost">
        <Link href="/account">Mon compte</Link>
      </Button>
      <Button onClick={onLogout} isLoading={pending} variant="outline">Se deconnecter</Button>
    </div>
  )
}
