"use client"

import Link from "next/link"
import { ArrowLeft, Package, Calendar, MapPin } from "lucide-react"

const ORDER = {
  id: "ORD-2025-001",
  date: "2025-01-15",
  status: "delivered",
  seller: "Ferme du soleil",
  items: [
    { name: "Tomates biologiques (x2)", price: 9.0 },
    { name: "Carottes fraiches", price: 3.2 },
  ],
  subtotal: 12.2,
  tax: 2.32,
  shipping: 5.18,
  total: 19.7,
  address: "123 Rue de la Paix, 75000 Paris",
  deliveryDate: "2025-01-16",
  trackingNumber: "TRK-2025-001",
}

export default function OrderDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/account" className="flex items-center gap-2 text-primary hover:text-primary/80 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour au compte</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Order Header */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">{ORDER.id}</h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${ORDER.status === "delivered" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"}`}
            >
              {ORDER.status === "delivered" ? "Livré" : "En cours"}
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Vendeur</p>
              <p className="text-foreground font-medium">{ORDER.seller}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Date de commande
              </p>
              <p className="text-foreground font-medium">{ORDER.date}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Livrée le
              </p>
              <p className="text-foreground font-medium">{ORDER.deliveryDate}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Numéro de suivi</p>
              <p className="text-foreground font-medium">{ORDER.trackingNumber}</p>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-primary" />
            Articles commandés
          </h2>

          <div className="space-y-3">
            {ORDER.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <span className="text-foreground">{item.name}</span>
                <span className="font-semibold text-foreground">${item.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="space-y-3 max-w-xs ml-auto">
            <div className="flex justify-between text-foreground">
              <span>Sous-total</span>
              <span>${ORDER.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>TVA (19%)</span>
              <span>${ORDER.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground">
              <span>Livraison</span>
              <span>${ORDER.shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">${ORDER.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-card rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Adresse de livraison
          </h2>
          <p className="text-foreground">{ORDER.address}</p>
        </div>
      </main>
    </div>
  )
}
