"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Menu, X, Eye, Package, Calendar, AlertCircle, Inbox, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSellerOrders } from "@/lib/api"
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
  user_name: string
  status: "pending" | "processing" | "delivered" | "cancelled"
  status_display: string
  subtotal: number
  shipping_city: string
  created_at: string
  items: OrderItem[]
}

export default function SellerOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true)
        const data = await getSellerOrders()
        setOrders(Array.isArray(data) ? data : data?.results || [])
      } catch (error: any) {
        console.error("Erreur de chargement des commandes :", error)
        showToast("error", "Erreur", error?.message || "Impossible de charger les commandes")
      } finally {
        setLoading(false)
      }
    }

    loadOrders()
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
        return "Livré"
      case "Livré":
        return status
      case "processing":
        return "En cours"
      case "En cours":
        return status
      case "pending":
        return "En attente"
      case "En attente":
        return status
      case "cancelled":
        return "Annulée"
      case "Annulée":
        return status
      default:
        return status
    }
  }

  return (
    <div className="flex h-screen bg-background">
      <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-64 bg-card border-r border-border`}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <span className="font-bold text-foreground">D-AGRI MARKET</span>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link href="/seller" className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg">
            Dashboard
          </Link>
          <Link
            href="/seller/orders"
            className="flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
          >
            <Package className="w-5 h-5" />
            Commandes
          </Link>
          <Link
            href="/seller/messages"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg"
          >
            <Inbox className="w-5 h-5" />
            Messages
          </Link>
          <Link
            href="/seller/reviews"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Avis
          </Link>
          <Link
            href="/seller/analytics"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg"
          >
            Statistiques
          </Link>
          <Link
            href="/seller/settings"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg"
          >
            Paramètres
          </Link>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden">
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Commandes</h1>
          </div>

          <div className="flex items-center gap-2">
            {["all", "pending", "processing", "delivered", "cancelled"].map((status) => (
              <Button
                key={status}
                size="sm"
                variant={statusFilter === status ? "default" : "outline"}
                onClick={() => setStatusFilter(status)}
              >
                {status === "all"
                  ? "Tous"
                  : status === "pending"
                    ? "Attente"
                    : status === "processing"
                      ? "Cours"
                      : status === "delivered"
                        ? "Livrés"
                        : "Annulées"}
              </Button>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
              <span>Chargement des commandes...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground gap-3">
              <AlertCircle className="w-6 h-6" />
              <span>Aucune commande pour ce filtre.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <Link key={order.id} href={`/seller/orders/${order.id}`}>
                  <div className="bg-card p-4 rounded-lg border border-border hover:border-primary/20 transition cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">Client : {order.user_name || "Inconnu"}</p>
                        <p className="text-sm text-foreground mt-1">
                          {(order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) ?? 0)} article(s)
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">
                            {Number(order.subtotal || 0).toFixed(0)} FCFA
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-end">
                            <Calendar className="w-3 h-3" />
                            {order.created_at ? new Date(order.created_at).toLocaleDateString() : "-"}
                          </p>
                        </div>

                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status_display || order.status)}
                        </span>

                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {order.items && order.items.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
                        {order.items.slice(0, 3).map((item) => (
                          <span key={item.id} className="px-2 py-1 bg-muted rounded-md">
                            {item.quantity}x {item.product_name}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="px-2 py-1 bg-muted rounded-md">+{order.items.length - 3} autres</span>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
