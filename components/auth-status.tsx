"use client"
import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"

export default function AuthStatus() {
  const { me, loading, logout } = useAuth()
  const [pending, setPending] = useState(false)

  const onLogout = async () => {
    try {
      setPending(true)
      await logout()
      showToast("success", "Deconnecte", "A bientot")
    } finally {
      setPending(false)
    }
  }

  if (loading) {
    return <span className="text-sm text-muted-foreground">Chargement...</span>
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
