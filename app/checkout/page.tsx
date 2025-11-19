"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/toast-notification"
import { getCart, createOrder } from "@/lib/api"

type CheckoutStep = "shipping" | "payment" | "confirmation"

export default function CheckoutPage() {
  const router = useRouter()
  const [step, setStep] = useState<CheckoutStep>("shipping")
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    // Shipping
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    // Payment
    paymentMethod: "card",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    mobileMoneyNumber: "",
  })

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      const data = await getCart()
      setCart(data)
      if (!data || !data.items || data.items.length === 0) {
        showToast("error", "Panier vide", "Votre panier est vide")
        router.push("/cart")
      }
    } catch (error) {
      console.error("Error loading cart:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast("success", "Adresse confirmée", "Votre adresse de livraison a été enregistrée")
    setStep("payment")
  }

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Create order in backend
      await createOrder({
        shipping_address: `${formData.address}, ${formData.country}`,
        shipping_city: formData.city,
        shipping_postal_code: formData.postalCode
      })

      showToast("success", "Paiement traité", "Votre commande a été confirmée avec succès")
      setStep("confirmation")
    } catch (error) {
      console.error("Error creating order:", error)
      showToast("error", "Erreur", "Impossible de traiter la commande")
    } finally {
      setLoading(false)
    }
  }

  if (!cart) return null

  const subtotal = cart.total_price || 0
  const shipping = subtotal > 50 ? 0 : 5.0
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">D-AGRI MARKET</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-between max-w-2xl mx-auto">
          {(["shipping", "payment", "confirmation"] as const).map((s, index) => (
            <div key={s} className="flex items-center gap-4">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${step === s
                  ? "bg-primary text-primary-foreground"
                  : ["shipping", "payment", "confirmation"].indexOf(step) > index
                    ? "bg-green-100 text-green-800"
                    : "bg-muted text-muted-foreground"
                  }`}
              >
                {["shipping", "payment", "confirmation"].indexOf(step) > index ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </div>
              {index < 2 && (
                <div
                  className={`h-1 flex-1 mx-2 transition ${["shipping", "payment", "confirmation"].indexOf(step) > index ? "bg-green-100" : "bg-border"
                    }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {step === "shipping" && (
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h2 className="text-xl font-bold text-foreground mb-6">Adresse de livraison</h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Prénom *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Nom *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Téléphone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Adresse *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Ville *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Code postal *</label>
                        <input
                          type="text"
                          name="postalCode"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Pays *</label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                      >
                        <option value="">Sélectionner un pays</option>
                        <option value="FR">France</option>
                        <option value="BE">Belgique</option>
                        <option value="CH">Suisse</option>
                        <option value="LU">Luxembourg</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Link href="/cart">
                      <Button type="button" variant="outline">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour
                      </Button>
                    </Link>
                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                      Continuer vers le paiement
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Payment Step */}
            {step === "payment" && (
              <form onSubmit={handlePaymentSubmit} className="space-y-6">
                <div className="bg-card p-6 rounded-lg border border-border">
                  <h2 className="text-xl font-bold text-foreground mb-6">Mode de paiement</h2>

                  {/* Payment Method Selection */}
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "card" }))}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition ${formData.paymentMethod === "card"
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                        }`}
                    >
                      <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">CB</span>
                      </div>
                      <span className="text-sm font-medium">Carte</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "om" }))}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition ${formData.paymentMethod === "om"
                        ? "border-[#ff7900] bg-[#ff7900]/5 text-[#ff7900]"
                        : "border-border hover:border-[#ff7900]/50"
                        }`}
                    >
                      <div className="w-8 h-8 rounded bg-[#ff7900] flex items-center justify-center">
                        <span className="text-xs font-bold text-white">OM</span>
                      </div>
                      <span className="text-sm font-medium">Orange Money</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: "momo" }))}
                      className={`p-4 rounded-lg border-2 flex flex-col items-center justify-center gap-2 transition ${formData.paymentMethod === "momo"
                        ? "border-[#ffcc00] bg-[#ffcc00]/5 text-[#ffcc00]"
                        : "border-border hover:border-[#ffcc00]/50"
                        }`}
                    >
                      <div className="w-8 h-8 rounded bg-[#ffcc00] flex items-center justify-center">
                        <span className="text-xs font-bold text-black">MTN</span>
                      </div>
                      <span className="text-sm font-medium">MTN Money</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.paymentMethod === "card" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Nom sur la carte *</label>
                          <input
                            type="text"
                            name="cardName"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">Numéro de carte *</label>
                          <input
                            type="text"
                            name="cardNumber"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            placeholder="1234 5678 9012 3456"
                            required
                            maxLength={19}
                            className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">Date d'expiration *</label>
                            <input
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleInputChange}
                              placeholder="MM/YY"
                              required
                              maxLength={5}
                              className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-foreground mb-2">CVV *</label>
                            <input
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleInputChange}
                              placeholder="123"
                              required
                              maxLength={3}
                              className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                            />
                          </div>
                        </div>
                      </>
                    )}

                    {(formData.paymentMethod === "om" || formData.paymentMethod === "momo") && (
                      <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Numéro de téléphone {formData.paymentMethod === "om" ? "Orange Money" : "MTN Mobile Money"} *
                        </label>
                        <div className="flex gap-2">
                          <div className="px-3 py-2 bg-muted border border-border rounded-lg text-muted-foreground">
                            +237
                          </div>
                          <input
                            type="tel"
                            name="mobileMoneyNumber"
                            value={formData.mobileMoneyNumber || ""}
                            onChange={handleInputChange}
                            placeholder="6..."
                            required
                            className="flex-1 px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Vous recevrez une notification sur votre téléphone pour valider le paiement.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-8">
                    <Button type="button" variant="outline" onClick={() => setStep("shipping")}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Retour
                    </Button>
                    <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90" disabled={loading}>
                      {loading ? "Traitement..." : `Payer avec ${formData.paymentMethod === "card" ? "Carte" :
                        formData.paymentMethod === "om" ? "Orange Money" : "MTN Money"
                        }`}
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Confirmation Step */}
            {step === "confirmation" && (
              <div className="bg-card p-6 rounded-lg border border-border text-center space-y-6">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-foreground">Commande confirmée !</h2>
                <p className="text-muted-foreground">
                  Merci pour votre achat. Vous recevrez bientôt un email de confirmation avec les détails de votre
                  commande et le suivi de livraison.
                </p>
                <div className="bg-muted p-4 rounded-lg text-left space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Statut: <span className="font-semibold text-foreground">Payé</span>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Livraison estimée: <span className="font-semibold text-foreground">2-3 jours ouvrables</span>
                  </p>
                </div>
                <Link href="/products">
                  <Button className="w-full bg-primary hover:bg-primary/90">Continuer les achats</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-lg border border-border sticky top-24 space-y-6">
              <h2 className="text-lg font-bold text-foreground">Résumé de la commande</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-foreground">
                  <span>{cart.total_items} articles</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Livraison</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>TVA (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-foreground">Total</span>
                <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p className="text-green-600 font-medium">Livraison sécurisée garantie</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
