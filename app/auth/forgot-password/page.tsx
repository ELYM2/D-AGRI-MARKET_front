"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Leaf, ArrowLeft, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      console.log("[v0] Forgot password for:", email)
      setSubmitted(true)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Retour à l'accueil</span>
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
            <h1 className="text-2xl font-bold text-foreground">Mot de passe oublié</h1>
            <p className="text-sm text-muted-foreground">Réinitialisez votre mot de passe en quelques étapes</p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Nous vous enverrons un email avec les instructions pour réinitialiser votre mot de passe.
              </p>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-2">
                Envoyer le lien
              </Button>

              <div className="text-center">
                <Link href="/auth/login" className="text-sm text-primary hover:text-primary/80 font-medium transition">
                  Retour à la connexion
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground mb-2">Email envoyé !</h2>
                <p className="text-sm text-muted-foreground">
                  Vérifiez votre email {email} pour les instructions de réinitialisation du mot de passe.
                </p>
              </div>

              <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 text-left">
                <p className="text-xs text-muted-foreground">
                  Pas reçu l'email ? Vérifiez votre dossier spam ou{" "}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary hover:text-primary/80 font-medium transition"
                  >
                    réessayez
                  </button>
                  .
                </p>
              </div>

              <Link href="/auth/login">
                <Button variant="outline" className="w-full bg-transparent">
                  Retour à la connexion
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
