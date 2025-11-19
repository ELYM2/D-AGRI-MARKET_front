"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Eye, EyeOff, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/toast-notification"
import { changePassword } from "@/lib/auth"
import { useAuth } from "@/hooks/use-auth"

export default function ChangePasswordPage() {
  const router = useRouter()
  const { me, loading } = useAuth()
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading && !me) {
      router.replace("/auth/login")
    }
  }, [loading, me, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.newPassword !== formData.confirmPassword) {
      showToast("error", "Erreur", "Les mots de passe ne correspondent pas")
      return
    }

    if (formData.newPassword.length < 8) {
      showToast("error", "Erreur", "Le mot de passe doit contenir au moins 8 caractères")
      return
    }

    setIsLoading(true)
    try {
      await changePassword({
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
      })
      showToast("success", "Succes", "Votre mot de passe a ete modifie avec succes")
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    } catch (err) {
      console.error(err)
      showToast("error", "Erreur", "Impossible de modifier le mot de passe")
    } finally {
      setIsLoading(false)
    }
  }

  if (!me && !loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold">Connexion requise</h1>
        <p className="text-muted-foreground">Connectez-vous pour mettre a jour votre mot de passe.</p>
        <Button asChild>
          <Link href="/auth/login">Se connecter</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">D-AGRI MARKET</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link href="/account" className="flex items-center gap-2 text-primary hover:text-primary/80 mb-6 transition">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Retour au profil</span>
        </Link>

        <div className="bg-card rounded-lg border border-border p-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Modifier le mot de passe</h1>
          <p className="text-muted-foreground mb-8">Entrez votre mot de passe actuel et votre nouveau mot de passe</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mot de passe actuel</label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition pr-10"
                  placeholder="Entrez votre mot de passe actuel"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition pr-10"
                  placeholder="Au moins 8 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition pr-10"
                  placeholder="Confirmez votre nouveau mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90">
              {isLoading ? "Modification en cours..." : "Modifier le mot de passe"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}
