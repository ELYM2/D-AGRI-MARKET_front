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

type Order = {
  id: number
  order_number: string
  status: "pending" | "processing" | "delivered" | "cancelled"
  status_display: string
  total_amount: number
  created_at: string
  items: OrderItem[]
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
        setOrders(Array.isArray(data) ? data : data?.results || [])
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
    return orders.filter((o) => o.status === statusFilter)
  }, [orders, statusFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
      case "Livré":
        return "Livré"
      case "processing":
      case "En cours":
        return "En cours"
      case "pending":
      case "En attente":
        return "En attente"
      case "cancelled":
      case "Annulée":
        return "Annulée"
      default:
        return status
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
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-card rounded-lg border border-border p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> {order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) ?? 0} article(s)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{Number(order.total_amount || 0).toFixed(0)} FCFA</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${getStatusColor(order.status)}`}>
                      {order.status === "processing" ? <Clock className="w-3 h-3" /> : order.status === "delivered" ? <CheckCircle2 className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                      {getStatusLabel(order.status_display || order.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
