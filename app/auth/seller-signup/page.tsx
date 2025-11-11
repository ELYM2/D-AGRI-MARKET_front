"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Leaf, Eye, EyeOff, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SellerSignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Business Info
    businessName: "",
    businessType: "",
    description: "",
    // Owner Info
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    // Address
    address: "",
    city: "",
    postalCode: "",
    country: "",
    // Account
    password: "",
    agreeTerms: false,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.businessName) newErrors.businessName = "Le nom du commerce est requis"
      if (!formData.businessType) newErrors.businessType = "Le type de commerce est requis"
      if (!formData.description) newErrors.description = "La description est requise"
    } else if (step === 2) {
      if (!formData.firstName) newErrors.firstName = "Le prénom est requis"
      if (!formData.lastName) newErrors.lastName = "Le nom est requis"
      if (!formData.email) newErrors.email = "L'email est requis"
      if (!formData.phone) newErrors.phone = "Le téléphone est requis"
    } else if (step === 3) {
      if (!formData.address) newErrors.address = "L'adresse est requise"
      if (!formData.city) newErrors.city = "La ville est requise"
      if (!formData.postalCode) newErrors.postalCode = "Le code postal est requis"
      if (!formData.country) newErrors.country = "Le pays est requis"
    } else if (step === 4) {
      if (formData.password.length < 8) newErrors.password = "Au moins 8 caractères"
      if (!formData.agreeTerms) newErrors.agreeTerms = "Vous devez accepter les conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep()) {
      console.log("[v0] Seller signup:", formData)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Back Button */}
        <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Retour à l'accueil</span>
        </Link>

        {/* Card */}
        <div className="bg-card p-8 rounded-xl border border-border space-y-8">
          {/* Logo & Title */}
          <div className="space-y-2 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <Leaf className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Devenir vendeur</h1>
            <p className="text-sm text-muted-foreground">Vendez vos produits locaux sur LocalMarket</p>
          </div>

          {/* Progress Steps */}
          <div className="flex gap-4 justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className={`flex-1 h-2 rounded-full transition ${s <= step ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Business Info */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Informations du commerce</h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Nom du commerce *</label>
                  <input
                    type="text"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Ex: Ferme du Soleil"
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                  />
                  {errors.businessName && <p className="text-xs text-destructive mt-1">{errors.businessName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Type de commerce *</label>
                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                  >
                    <option value="">Sélectionner</option>
                    <option value="farm">Ferme/Agriculture</option>
                    <option value="dairy">Produits laitiers</option>
                    <option value="bakery">Boulangerie</option>
                    <option value="other">Autre</option>
                  </select>
                  {errors.businessType && <p className="text-xs text-destructive mt-1">{errors.businessType}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Description du commerce *</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre commerce et vos produits..."
                    rows={4}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition resize-none"
                  />
                  {errors.description && <p className="text-xs text-destructive mt-1">{errors.description}</p>}
                </div>
              </div>
            )}

            {/* Step 2: Owner Info */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Vos informations personnelles</h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Prénom *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Jean"
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                    />
                    {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Nom *</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Dupont"
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                    />
                    {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="vous@exemple.com"
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                  />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                  />
                  {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                </div>
              </div>
            )}

            {/* Step 3: Address */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Adresse du commerce</h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Adresse *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Rue de la Ferme"
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                  />
                  {errors.address && <p className="text-xs text-destructive mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Ville *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Paris"
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                    />
                    {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Code postal *</label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="75001"
                      className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                    />
                    {errors.postalCode && <p className="text-xs text-destructive mt-1">{errors.postalCode}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Pays *</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                  >
                    <option value="">Sélectionner</option>
                    <option value="FR">France</option>
                    <option value="BE">Belgique</option>
                    <option value="CH">Suisse</option>
                    <option value="LU">Luxembourg</option>
                  </select>
                  {errors.country && <p className="text-xs text-destructive mt-1">{errors.country}</p>}
                </div>
              </div>
            )}

            {/* Step 4: Account & Agreement */}
            {step === 4 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-foreground">Créer votre compte</h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Mot de passe *</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="••••••••"
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
                  {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    id="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 rounded border-border accent-primary"
                  />
                  <label htmlFor="agreeTerms" className="text-sm text-muted-foreground">
                    J'accepte les{" "}
                    <Link href="#" className="text-primary hover:text-primary/80 font-medium">
                      conditions d'utilisation
                    </Link>{" "}
                    et m'engage à respecter les règles de la plateforme
                  </label>
                </div>
                {errors.agreeTerms && <p className="text-xs text-destructive">{errors.agreeTerms}</p>}

                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-xs text-muted-foreground">
                    Votre commerce sera examiné avant publication. Nous vous enverrons un email de confirmation.
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-4 pt-8 border-t border-border">
              {step > 1 && (
                <Button type="button" onClick={() => setStep(step - 1)} variant="outline" className="px-8">
                  Retour
                </Button>
              )}

              {step < 4 ? (
                <Button type="button" onClick={handleNext} className="flex-1 bg-primary hover:bg-primary/90">
                  Continuer
                </Button>
              ) : (
                <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                  Créer mon commerce
                </Button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm border-t border-border pt-6">
            <span className="text-muted-foreground">Déjà vendeur ? </span>
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-medium transition">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
