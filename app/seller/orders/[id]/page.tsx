"use client"

import Link from "next/link"
import { ArrowLeft, User, MapPin, Phone, Mail, Download, Printer } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const ORDER_DETAIL = {
  id: "ORD-001",
  customer: { name: "Jean Dupont", email: "jean@email.com", phone: "+33 6 12 34 56 78" },
  address: "123 Rue de la Paix, 75000 Paris",
  date: "2025-01-16",
  status: "delivered",
  items: [
    { id: 1, name: "Tomates biologiques", qty: 2, price: 4.5, subtotal: 9.0 },
    { id: 2, name: "Carottes fraiches", qty: 1, price: 3.2, subtotal: 3.2 },
    { id: 3, name: "Laitue biologique", qty: 1, price: 2.8, subtotal: 2.8 },
  ],
  subtotal: 15.0,
  tax: 2.85,
  shipping: 6.65,
  total: 24.5,
}

export default function OrderDetailPage() {
  const [status, setStatus] = useState(ORDER_DETAIL.status)

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/seller/orders" className="flex items-center gap-2 text-primary hover:text-primary/80 transition">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Retour aux commandes</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Printer className="w-4 h-4 mr-2" />
              Imprimer
            </Button>
            <Button size="sm" variant="outline">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Header */}
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">{ORDER_DETAIL.id}</h1>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="px-4 py-2 bg-input rounded-lg outline-none text-foreground border border-border"
            >
              <option value="pending">En attente</option>
              <option value="processing">En cours</option>
              <option value="delivered">Livré</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-3 font-medium">Client</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground">{ORDER_DETAIL.customer.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <a href={`mailto:${ORDER_DETAIL.customer.email}`} className="text-primary hover:underline">
                    {ORDER_DETAIL.customer.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${ORDER_DETAIL.customer.phone}`} className="text-primary hover:underline">
                    {ORDER_DETAIL.customer.phone}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-3 font-medium">Adresse de livraison</h3>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                <p className="text-foreground">{ORDER_DETAIL.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Produit</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Quantité</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Prix unitaire</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ORDER_DETAIL.items.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="px-6 py-4 text-foreground">{item.name}</td>
                    <td className="px-6 py-4 text-foreground">{item.qty}</td>
                    <td className="px-6 py-4 text-foreground">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4 font-semibold text-foreground">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="space-y-3 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span className="text-foreground">Sous-total</span>
              <span className="text-foreground">${ORDER_DETAIL.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">TVA (19%)</span>
              <span className="text-foreground">${ORDER_DETAIL.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground">Livraison</span>
              <span className="text-foreground">${ORDER_DETAIL.shipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold text-foreground">Total</span>
              <span className="text-lg font-bold text-primary">${ORDER_DETAIL.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
