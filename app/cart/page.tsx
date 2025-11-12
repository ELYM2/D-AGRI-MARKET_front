"use client"

import { useState } from "react"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  image: string
  seller: string
}

const MOCK_CART_ITEMS: CartItem[] = [
  {
    id: 1,
    name: "Tomates biologiques",
    price: 4.5,
    quantity: 2,
    image: "/placeholder.svg?key=2uxza",
    seller: "Ferme du soleil",
  },
  {
    id: 2,
    name: "Carottes fraiches",
    price: 3.2,
    quantity: 1,
    image: "/placeholder.svg?key=ri250",
    seller: "Potager bio",
  },
  {
    id: 3,
    name: "Fromage fermier",
    price: 12.0,
    quantity: 1,
    image: "/placeholder.svg?key=iy62b",
    seller: "Laiterie locale",
  },
]

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(MOCK_CART_ITEMS)

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }
    setItems(items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = 5.0
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
        <h1 className="text-3xl font-bold text-foreground mb-8">Mon panier</h1>

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
              {items.map((item) => (
                <div
                  key={item.id}
                  className="bg-card p-6 rounded-lg border border-border flex gap-6 hover:border-primary/20 transition"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-lg">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.seller}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-muted transition text-foreground"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded border border-border flex items-center justify-center hover:bg-muted transition text-foreground"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="text-xl font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-destructive/10 rounded transition text-destructive"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-card p-6 rounded-lg border border-border sticky top-24 space-y-6">
                <h2 className="text-lg font-bold text-foreground">Résumé de la commande</h2>

                <div className="space-y-3 border-b border-border pb-6">
                  <div className="flex justify-between text-foreground">
                    <span>Sous-total</span>
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

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-bold text-primary">${total.toFixed(2)}</span>
                </div>

                <Link href="/checkout">
                  <Button className="w-full bg-primary hover:bg-primary/90 py-6 text-base font-semibold">
                    Procéder au paiement
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground text-center">
                  Livraison gratuite pour les commandes supérieures à 50€
                </p>

                {/* Promo Code */}
                <div className="space-y-2 pt-4 border-t border-border">
                  <label className="text-sm font-medium text-foreground">Code promo</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Entrez votre code"
                      className="flex-1 px-3 py-2 bg-input border border-border rounded-md outline-none text-foreground placeholder:text-muted-foreground text-sm focus:border-primary transition"
                    />
                    <Button variant="outline" size="sm">
                      Appliquer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
