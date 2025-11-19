"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"

export default function LoginPage() {
  const router = useRouter()
  const { login: loginUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setPending(true)
      const me = await loginUser({ username: formData.username, password: formData.password })
      showToast("success", "Connexion reussie", `Bienvenue ${me?.username ?? ""}`)
      router.replace("/")
      router.refresh?.()
    } catch (err) {
      console.error(err)
      showToast("error", "Echec de connexion", "Identifiants invalides")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Retour a l'accueil</span>
        </Link>

        {/* Card */}
        <div className="bg-card p-8 rounded-xl border border-border space-y-6">
          {/* Logo & Title */}
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Connexion</h1>
            <p className="text-sm text-muted-foreground">Bienvenue sur D-AGRI MARKET</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom d'utilisateur</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="ex: jdupont"
                required
                className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="********"
                  required
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-2" disabled={pending} isLoading={pending}>
              Se connecter
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">ou</span>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-3">
            <Link href="/forgot-password">
              <Button variant="outline" className="w-full bg-transparent">
                Mot de passe oublie ?
              </Button>
            </Link>
          </div>

          {/* Signup Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Pas encore inscrit ? </span>
            <Link href="/auth/signup" className="text-primary hover:text-primary/80 font-medium transition">
              Creer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
