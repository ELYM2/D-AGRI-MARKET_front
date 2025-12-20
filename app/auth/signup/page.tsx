"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { register } from "@/lib/auth"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"

export default function SignupPage() {
  const router = useRouter()
  const { reload } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [pending, setPending] = useState(false)
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!formData.username) newErrors.username = "Nom d'utilisateur requis"
    if (!formData.firstName) newErrors.firstName = "Le prénom est requis"
    if (!formData.lastName) newErrors.lastName = "Le nom est requis"
    if (!formData.email) newErrors.email = "L'email est requis"
    if (formData.password.length < 8) newErrors.password = "Au moins 8 caractères"
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Les mots de passe ne correspondent pas"
    if (!formData.agreeTerms) newErrors.agreeTerms = "Vous devez accepter les conditions"

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    try {
      setPending(true)
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
      })
      const me = await reload()
      showToast("success", "Inscription réussie", `Bienvenue ${me?.username ?? ""}`)
      router.replace("/")
      router.refresh?.()
    } catch (err: any) {
      console.error("Registration error:", err)

      // Parse error message from API
      let errorMessage = "Une erreur est survenue. Veuillez réessayer."
      const formErrors: Record<string, string> = {}

      if (err.message) {
        try {
          // Try to parse error message as JSON (from Django API)
          const errorData = JSON.parse(err.message)

          // Handle username errors
          if (errorData.username) {
            const usernameError = Array.isArray(errorData.username) ? errorData.username[0] : errorData.username
            if (usernameError.includes("already exists") || usernameError.includes("already taken")) {
              formErrors.username = "Ce nom d'utilisateur est déjà utilisé."
            } else if (usernameError.includes("required")) {
              formErrors.username = "Le nom d'utilisateur est requis."
            } else if (usernameError.includes("invalid")) {
              formErrors.username = "Ce nom d'utilisateur n'est pas valide."
            } else {
              formErrors.username = usernameError
            }
          }

          // Handle email errors
          if (errorData.email) {
            const emailError = Array.isArray(errorData.email) ? errorData.email[0] : errorData.email
            if (emailError.includes("already exists") || emailError.includes("already registered")) {
              formErrors.email = "Cet email est déjà utilisé. Essayez de vous connecter."
            } else if (emailError.includes("invalid")) {
              formErrors.email = "L'adresse email n'est pas valide."
            } else if (emailError.includes("required")) {
              formErrors.email = "L'email est requis."
            } else {
              formErrors.email = emailError
            }
          }

          // Handle password errors
          if (errorData.password) {
            const passwordError = Array.isArray(errorData.password) ? errorData.password[0] : errorData.password
            if (passwordError.includes("too common")) {
              formErrors.password = "Ce mot de passe est trop courant. Choisissez un mot de passe plus sécurisé (ex: MonMotDePasse2025!)."
            } else if (passwordError.includes("too short")) {
              formErrors.password = "Ce mot de passe est trop court. Minimum 8 caractères."
            } else if (passwordError.includes("entirely numeric")) {
              formErrors.password = "Le mot de passe ne peut pas être entièrement numérique."
            } else if (passwordError.includes("too similar")) {
              formErrors.password = "Le mot de passe est trop similaire à vos informations personnelles."
            } else if (passwordError.includes("required")) {
              formErrors.password = "Le mot de passe est requis."
            } else {
              formErrors.password = passwordError
            }
          }

          // Handle first_name errors
          if (errorData.first_name) {
            const firstNameError = Array.isArray(errorData.first_name) ? errorData.first_name[0] : errorData.first_name
            formErrors.firstName = firstNameError.includes("required") ? "Le prénom est requis." : firstNameError
          }

          // Handle last_name errors
          if (errorData.last_name) {
            const lastNameError = Array.isArray(errorData.last_name) ? errorData.last_name[0] : errorData.last_name
            formErrors.lastName = lastNameError.includes("required") ? "Le nom est requis." : lastNameError
          }

          // Handle generic non_field_errors
          if (errorData.non_field_errors) {
            const nonFieldError = Array.isArray(errorData.non_field_errors) ? errorData.non_field_errors[0] : errorData.non_field_errors
            errorMessage = nonFieldError
          }

          if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors)
            errorMessage = "Veuillez corriger les erreurs indiquées dans le formulaire."
          }
        } catch {
          // If not JSON, use the error message as is
          errorMessage = err.message
        }
      }

      showToast("error", "Erreur d'inscription", errorMessage)
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
            <h1 className="text-2xl font-bold text-foreground">Créer un compte</h1>
            <p className="text-sm text-muted-foreground">Rejoignez la communauté D-AGRI MARKET</p>
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
                className={`w-full px-4 py-2 bg-input border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition ${errors.username ? "border-red-500" : "border-border"
                  }`}
              />
              {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prénom</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="Jean"
                  className={`w-full px-4 py-2 bg-input border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition ${errors.firstName ? "border-red-500" : "border-border"
                    }`}
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Dupont"
                  className={`w-full px-4 py-2 bg-input border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition ${errors.lastName ? "border-red-500" : "border-border"
                    }`}
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="jean.dupont@exemple.com"
                className={`w-full px-4 py-2 bg-input border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition ${errors.email ? "border-red-500" : "border-border"
                  }`}
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 bg-input border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition ${errors.password ? "border-red-500" : "border-border"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirmer le mot de passe</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 bg-input border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition ${errors.confirmPassword ? "border-red-500" : "border-border"
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                name="agreeTerms"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleInputChange}
                className="mt-1 w-4 h-4 rounded border-border accent-primary"
              />
              <label htmlFor="agreeTerms" className="text-sm text-muted-foreground">
                J'accepte les <Link href="#" className="text-primary hover:text-primary/80 font-medium">conditions d'utilisation</Link> et la <Link href="#" className="text-primary hover:text-primary/80 font-medium">politique de confidentialite</Link>
              </label>
            </div>
            {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 py-2" disabled={pending} isLoading={pending}>
              Creer mon compte
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Deja inscrit ? </span>
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
