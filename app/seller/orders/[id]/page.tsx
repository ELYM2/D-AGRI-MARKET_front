"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, User, MapPin, Phone, Mail, Download, Printer, PackageCheck, Ban, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSellerOrder, updateOrderStatus } from "@/lib/api"
import { showToast } from "@/components/toast-notification"

type OrderItem = {
  id: number
  product_name: string
  quantity: number
  price: number
}

type OrderDetail = {
  id: number
  order_number: string
  user_name: string
  status: "pending" | "processing" | "delivered" | "cancelled"
  status_display: string
  subtotal: number
  shipping_city: string
  created_at: string
  items: OrderItem[]
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = Number(params?.id)

  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState<OrderDetail["status"]>("pending")
  const [reason, setReason] = useState("")

  useEffect(() => {
    if (!orderId) return

    const loadOrder = async () => {
      try {
        setLoading(true)
        const data = await getSellerOrder(orderId)
        setOrder(data)
        setStatus(data.status)
      } catch (error: any) {
        console.error("Error loading order:", error)
        showToast("error", "Erreur", error?.message || "Commande introuvable")
        router.push("/seller/orders")
      } finally {
        setLoading(false)
      }
    }

    loadOrder()
  }, [orderId, router])

  const subtotal = useMemo(() => {
    if (!order?.items) return 0
    return order.items.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0)
  }, [order])

  const handleStatusUpdate = async (newStatus: OrderDetail["status"]) => {
    if (!order) return
    try {
      setUpdating(true)
      const updated = await updateOrderStatus(order.id, newStatus, reason || undefined)
      setOrder(updated)
      setStatus(updated.status)
      showToast("success", "Statut mis à jour", `Commande ${updated.order_number} → ${updated.status_display || updated.status}`)
    } catch (error: any) {
      showToast("error", "Erreur", error?.message || "Impossible de changer le statut")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de la commande...</p>
        </div>
      </div>
    )
  }

  if (!order) return null

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
            <div>
              <p className="text-sm text-muted-foreground mb-1">Commande</p>
              <h1 className="text-3xl font-bold text-foreground">{order.order_number}</h1>
              <p className="text-sm text-muted-foreground">Client : {order.user_name || "Inconnu"}</p>
            </div>
            <div className="flex items-center gap-2">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderDetail["status"])}
                className="px-4 py-2 bg-input rounded-lg outline-none text-foreground border border-border"
                disabled={updating}
              >
                <option value="pending">En attente</option>
                <option value="processing">En cours</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulée</option>
              </select>
              <Button
                size="sm"
                onClick={() => handleStatusUpdate(status)}
                disabled={updating}
                className="bg-primary hover:bg-primary/90"
              >
                Mettre à jour
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm text-muted-foreground mb-3 font-medium">Client</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <p className="text-foreground">{order.user_name || "Client"}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm text-muted-foreground mb-3 font-medium">Adresse de livraison</h3>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                <p className="text-foreground">
                  {order.shipping_city} (Adresse complète masquée pour confidentialité du sous-vendeur si nécessaire)
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {["processing", "delivered", "cancelled"].includes(status) && (
              <div className="w-full md:w-1/2">
                <label className="text-sm text-muted-foreground mb-1 block">Motif (optionnel, visible par l'acheteur)</label>
                <input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="ex: rupture sur 1 article, proposé un remplacement..."
                  className="w-full px-3 py-2 bg-input border border-border rounded-md outline-none text-foreground"
                />
              </div>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate("processing")}
              disabled={updating || order.status === "processing"}
            >
              <PackageCheck className="w-4 h-4 mr-2" />
              Accepter / En cours
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleStatusUpdate("delivered")}
              disabled={updating || order.status === "delivered"}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Marquer livré
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => handleStatusUpdate("cancelled")}
              disabled={updating || order.status === "cancelled"}
            >
              <Ban className="w-4 h-4 mr-2" />
              Refuser / Annuler
            </Button>
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
                {order.items?.map((item) => (
                  <tr key={item.id} className="border-b border-border hover:bg-muted/30 transition">
                    <td className="px-6 py-4 text-foreground">{item.product_name}</td>
                    <td className="px-6 py-4 text-foreground">{item.quantity}</td>
                    <td className="px-6 py-4 text-foreground">{Number(item.price).toFixed(0)} FCFA</td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {(Number(item.price) * Number(item.quantity)).toFixed(0)} FCFA
                    </td>
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
              <span className="text-foreground">{subtotal.toFixed(0)} FCFA</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between">
              <span className="font-bold text-foreground">Total (Votre part)</span>
              <span className="text-lg font-bold text-primary">{Number(order.subtotal || subtotal).toFixed(0)} FCFA</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
