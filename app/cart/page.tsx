"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Leaf } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getCart, removeFromCart, updateCartQuantity, clearCart } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)

  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    try {
      setLoading(true)
      const data = await getCart()
      setCart(data)
    } catch (error) {
      console.error("Error loading cart:", error)
      // Si l'utilisateur n'est pas connecté, on affiche un panier vide
      setCart({ items: [] })
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(itemId)
      return
    }

    try {
      setUpdating(itemId)
      await updateCartQuantity(itemId, newQuantity)
      await loadCart()
      showToast("success", "Panier mis à jour", "La quantité a été modifiée")
    } catch (error) {
      console.error("Error updating quantity:", error)
      showToast("error", "Erreur", "Impossible de mettre à jour la quantité")
    } finally {
      setUpdating(null)
    }
  }

  const handleRemoveItem = async (itemId: number) => {
    try {
      setUpdating(itemId)
      await removeFromCart(itemId)
      await loadCart()
      showToast("success", "Article retiré", "L'article a été retiré du panier")
    } catch (error) {
      console.error("Error removing item:", error)
      showToast("error", "Erreur", "Impossible de retirer l'article")
    } finally {
      setUpdating(null)
    }
  }

  const handleClearCart = async () => {
    if (!confirm("Êtes-vous sûr de vouloir vider le panier ?")) return

    try {
      await clearCart()
      await loadCart()
      showToast("success", "Panier vidé", "Tous les articles ont été retirés")
    } catch (error) {
      console.error("Error clearing cart:", error)
      showToast("error", "Erreur", "Impossible de vider le panier")
    }
  }

  const handleCheckout = () => {
    if (!cart?.items || cart.items.length === 0) {
      showToast("error", "Panier vide", "Ajoutez des articles avant de passer commande")
      return
    }
    router.push("/checkout")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du panier...</p>
        </div>
      </div>
    )
  }

  const items = cart?.items || []
  const subtotal = items.reduce((sum: number, item: any) => sum + Number(item.product.price) * item.quantity, 0)
  const shipping = subtotal > 50 ? 0 : 5.0
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

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

          <Link href="/products">
            <Button variant="outline" size="sm">
              Continuer les achats
            </Button>
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mon panier</h1>
          {items.length > 0 && (
            <Button variant="outline" onClick={handleClearCart} className="text-destructive hover:text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Vider le panier
            </Button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Votre panier est vide</h2>
            <p className="text-muted-foreground mb-6">Découvrez nos produits frais et locaux</p>
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90">Explorer les produits</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="bg-card rounded-lg border border-border p-4 flex gap-4">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={item.product.images?.[0]?.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.product.id}`}>
                          <h3 className="font-semibold text-foreground hover:text-primary transition truncate">
                            {item.product.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-muted-foreground">Par {item.product.owner_name}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={updating === item.id}
                        className="text-muted-foreground hover:text-destructive transition p-1"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-border rounded-lg">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          disabled={updating === item.id}
                          className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 h-8 flex items-center justify-center text-sm font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          disabled={updating === item.id || item.quantity >= item.product.stock}
                          className="w-8 h-8 flex items-center justify-center text-foreground hover:bg-muted transition disabled:opacity-50"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">${Number(item.product.price).toFixed(2)} / unité</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                <h2 className="text-xl font-bold text-foreground mb-6">Résumé de la commande</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Sous-total ({items.length} articles)</span>
                    <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Livraison</span>
                    <span className="font-medium text-foreground">{shipping === 0 ? "Gratuite" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  {shipping === 0 && (
                    <p className="text-xs text-green-600">✓ Livraison gratuite appliquée</p>
                  )}
                  {shipping > 0 && subtotal < 50 && (
                    <p className="text-xs text-muted-foreground">
                      Ajoutez ${(50 - subtotal).toFixed(2)} pour la livraison gratuite
                    </p>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes (10%)</span>
                    <span className="font-medium text-foreground">${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between">
                    <span className="font-semibold text-foreground">Total</span>
                    <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button onClick={handleCheckout} className="w-full bg-primary hover:bg-primary/90 h-12 mb-4">
                  Passer la commande
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    Paiement sécurisé
                  </p>
                  <p>Livraison gratuite pour les commandes &gt; $50</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
