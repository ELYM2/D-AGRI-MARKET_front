"use client"
import Link from "next/link"
import { BarChart3, TrendingUp, DollarSign, Users, Package, ArrowUp, ArrowDown, Menu, X, Inbox, MessageCircle } from "lucide-react"
import { useState } from "react"

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const stats = [
    { label: "Ventes totales", value: "8,450 FCFA", change: "+24%", icon: DollarSign, positive: true },
    { label: "Commandes", value: "156", change: "+12%", icon: Package, positive: true },
    { label: "Clients", value: "89", change: "+8%", icon: Users, positive: true },
    { label: "Panier moyen", value: "54.20 FCFA", change: "+3%", icon: TrendingUp, positive: true },
  ]

  const monthlyData = [
    { month: "Jan", sales: 2400, orders: 24 },
    { month: "Fév", sales: 3200, orders: 32 },
    { month: "Mar", sales: 2800, orders: 28 },
    { month: "Avr", sales: 3900, orders: 39 },
    { month: "Mai", sales: 4200, orders: 42 },
    { month: "Juin", sales: 5100, orders: 51 },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
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
            href="/seller/analytics"
            className="flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
          >
            <BarChart3 className="w-5 h-5" />
            Statistiques
          </Link>
          <Link
            href="/seller/orders"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg"
          >
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
            <h1 className="text-2xl font-bold text-foreground">Statistiques</h1>
          </div>

          <select className="px-4 py-2 bg-input rounded-lg outline-none text-foreground text-sm border border-border">
            <option>Les 30 derniers jours</option>
            <option>Les 90 derniers jours</option>
            <option>Cette année</option>
          </select>
        </header>

        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => {
              const Icon = stat.icon
              return (
                <div key={stat.label} className="bg-card p-6 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p
                    className={`text-sm mt-2 flex items-center gap-1 ${stat.positive ? "text-green-600" : "text-red-600"}`}
                  >
                    {stat.positive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    {stat.change}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Charts */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Ventes mensuelles</h3>
              <div className="h-64 flex items-end gap-3">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-primary rounded-t opacity-80 hover:opacity-100 transition"
                      style={{ height: `${(d.sales / 5100) * 100}%` }}
                    />
                    <p className="text-xs text-muted-foreground">{d.month}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border border-border">
              <h3 className="text-lg font-bold text-foreground mb-4">Commandes par mois</h3>
              <div className="h-64 flex items-end gap-3">
                {monthlyData.map((d) => (
                  <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-accent rounded-t opacity-80 hover:opacity-100 transition"
                      style={{ height: `${(d.orders / 51) * 100}%` }}
                    />
                    <p className="text-xs text-muted-foreground">{d.month}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg font-bold text-foreground mb-4">Meilleurs produits</h3>
            <div className="space-y-3">
              {[
                { name: "Tomates biologiques", sales: 145, revenue: "652.50 FCFA" },
                { name: "Laitue biologique", sales: 98, revenue: "274.40 FCFA" },
                { name: "Carottes fraiches", sales: 87, revenue: "278.40 FCFA" },
              ].map((p) => (
                <div key={p.name} className="flex items-center justify-between p-3 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.sales} ventes</p>
                  </div>
                  <p className="font-bold text-primary">{p.revenue}</p>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
