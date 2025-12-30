"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Calendar, Package, CheckCircle2, Clock, AlertTriangle, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getOrders } from "@/lib/api"
import { showToast } from "@/components/toast-notification"

type OrderItem = {
  id: number
  product_name: string
  quantity: number
  price: number
}

type SubOrder = {
  id: number
  seller_name: string
  status: "pending" | "processing" | "delivered" | "cancelled"
  status_display: string
  subtotal: number
}

type Order = {
  id: number
  order_number: string
  // Global status is less relevant now, we rely on sub-orders
  status: "pending" | "processing" | "delivered" | "cancelled"
  status_display: string
  total_amount: number
  created_at: string
  items: OrderItem[]
  sub_orders: SubOrder[]
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await getOrders()
        // Sort by date desc
        const sorted = (Array.isArray(data) ? data : data?.results || []).sort(
          (a: Order, b: Order) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        setOrders(sorted)
      } catch (error: any) {
        console.error("Error loading orders", error)
        showToast("error", "Erreur", error?.message || "Impossible de charger vos commandes")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders
    return orders.filter((o) => {
      // Filter based on if ANY sub-order matches, or if the main status matches (fallback)
      if (o.sub_orders && o.sub_orders.length > 0) {
        return o.sub_orders.some(sub => sub.status === statusFilter)
      }
      return o.status === statusFilter
    })
  }, [orders, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-green-600 bg-green-100"
      case "processing":
        return "text-blue-600 bg-blue-100"
      case "pending":
        return "text-yellow-600 bg-yellow-100"
      case "cancelled":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered": return "Livré"
      case "processing": return "En cours"
      case "pending": return "En attente"
      case "cancelled": return "Annulée"
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">D-AGRI MARKET</span>
          </Link>
          <Link href="/products">
            <Button variant="ghost">Continuer mes achats</Button>
          </Link>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mes commandes</h1>
            <p className="text-muted-foreground">Suivez vos commandes et leur statut.</p>
          </div>

          <div className="flex items-center gap-2">
            {[
              { key: "all", label: "Toutes" },
              { key: "pending", label: "En attente" },
              { key: "processing", label: "En cours" },
              { key: "delivered", label: "Livrées" },
              { key: "cancelled", label: "Annulées" },
            ].map((s) => (
              <Button
                key={s.key}
                size="sm"
                variant={statusFilter === s.key ? "default" : "outline"}
                onClick={() => setStatusFilter(s.key)}
              >
                {s.label}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-16">Chargement de vos commandes...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">Aucune commande pour ce filtre.</div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-card rounded-lg border border-border p-5 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-lg text-foreground">{order.order_number}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right mt-2 md:mt-0">
                    <p className="text-xl font-bold text-primary">{Number(order.total_amount).toFixed(0)} FCFA</p>
                    <p className="text-sm text-muted-foreground">{order.items?.length || 0} article(s)</p>
                  </div>
                </div>

                {/* Sub Orders Display */}
                {order.sub_orders && order.sub_orders.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Détails des expéditions</h4>
                    {order.sub_orders.map(sub => (
                      <div key={sub.id} className="flex items-center justify-between bg-muted/30 p-3 rounded-md border border-border/50">
                        <div>
                          <p className="font-medium text-foreground">Vendeur : {sub.seller_name}</p>
                          <p className="text-xs text-muted-foreground">Sous-total : {Number(sub.subtotal).toFixed(0)} FCFA</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(sub.status)}`}>
                          {sub.status === "processing" ? <Clock className="w-3 h-3" /> : sub.status === "delivered" ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                          {getStatusLabel(sub.status)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Fallback for old orders without sub-orders or if logic fails */
                  <div className="flex justify-end">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
