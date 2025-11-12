"use client"

import Link from "next/link"
import { Menu, X, Eye, Package, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const ORDERS = [
  {
    id: "ORD-001",
    customer: "Jean Dupont",
    date: "2025-01-16",
    items: 3,
    total: 24.5,
    status: "delivered",
  },
  {
    id: "ORD-002",
    customer: "Marie Martin",
    date: "2025-01-16",
    items: 2,
    total: 15.8,
    status: "processing",
  },
  {
    id: "ORD-003",
    customer: "Pierre Bernard",
    date: "2025-01-15",
    items: 5,
    total: 48.9,
    status: "pending",
  },
]

export default function SellerOrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredOrders = statusFilter === "all" ? ORDERS : ORDERS.filter((o) => o.status === statusFilter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return "Livré"
      case "processing":
        return "En cours"
      case "pending":
        return "En attente"
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
          <a href="/seller" className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg">
            Dashboard
          </a>
          <a
            href="/seller/orders"
            className="flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
          >
            <Package className="w-5 h-5" />
            Commandes
          </a>
          <a
            href="/seller/analytics"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg"
          >
            Statistiques
          </a>
          <a
            href="/seller/settings"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg"
          >
            Paramètres
          </a>
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
            {["all", "pending", "processing", "delivered"].map((status) => (
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
                      : "Livrés"}
              </Button>
            ))}
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-3">
            {filteredOrders.map((order) => (
              <Link key={order.id} href={`/seller/orders/${order.id}`}>
                <div className="bg-card p-4 rounded-lg border border-border hover:border-primary/20 transition cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                      <p className="text-sm text-foreground mt-1">{order.items} article(s)</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-lg font-bold text-primary">${order.total.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {order.date}
                        </p>
                      </div>

                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>

                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}
