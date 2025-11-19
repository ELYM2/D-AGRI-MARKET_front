"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  Leaf,
  Menu,
  X,
  LogOut,
  Settings,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const SELLER_STATS = [
  { label: "Ventes ce mois", value: "$2,450", change: "+12%", icon: TrendingUp },
  { label: "Commandes actives", value: "24", change: "+5", icon: ShoppingCart },
  { label: "Produits", value: "18", change: "3 nouveaux", icon: Package },
  { label: "Clients", value: "156", change: "+8", icon: Users },
]

const SELLER_PRODUCTS = [
  {
    id: 1,
    name: "Tomates biologiques",
    category: "Légumes",
    price: 4.5,
    stock: 24,
    sold: 89,
    status: "active",
    image: "/placeholder.svg?key=2uxza",
  },
  {
    id: 2,
    name: "Laitue biologique",
    category: "Légumes",
    price: 2.8,
    stock: 45,
    sold: 156,
    status: "active",
    image: "/placeholder.svg?key=rcaih",
  },
  {
    id: 3,
    name: "Herbes aromatiques",
    category: "Légumes",
    price: 3.5,
    stock: 0,
    sold: 78,
    status: "outofstock",
    image: "/placeholder.svg?key=ab123",
  },
]

const RECENT_ORDERS = [
  {
    id: "ORD-001",
    customer: "Jean Dupont",
    items: 3,
    total: 24.5,
    status: "delivered",
    date: "2025-01-15",
  },
  {
    id: "ORD-002",
    customer: "Marie Martin",
    items: 2,
    total: 15.8,
    status: "processing",
    date: "2025-01-16",
  },
  {
    id: "ORD-003",
    customer: "Pierre Bernard",
    items: 5,
    total: 48.9,
    status: "pending",
    date: "2025-01-16",
  },
]

export default function SellerDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "active":
        return "bg-green-100 text-green-800"
      case "outofstock":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-64 bg-card border-r border-border`}>
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">D-AGRI MARKET</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/seller"
            className="flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
          >
            <BarChart3 className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/seller/products"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
          >
            <Package className="w-5 h-5" />
            Produits
          </Link>
          <Link
            href="/seller/orders"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
          >
            <ShoppingCart className="w-5 h-5" />
            Commandes
          </Link>
          <Link
            href="/seller/analytics"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
          >
            <TrendingUp className="w-5 h-5" />
            Statistiques
          </Link>
        </nav>

        <div className="p-4 space-y-2 mt-auto">
          <Link
            href="/seller/settings"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg transition"
          >
            <Settings className="w-5 h-5" />
            Paramètres
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-destructive hover:bg-muted rounded-lg transition">
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/seller/profile">
              <Button variant="outline" size="sm">
                Mon profil
              </Button>
            </Link>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SELLER_STATS.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="bg-card p-6 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Products Section */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Mes produits</h2>
              <Link href="/seller/products/new">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un produit
                </Button>
              </Link>
            </div>

            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Produit</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Catégorie</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Prix</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Stock</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ventes</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SELLER_PRODUCTS.map((product) => (
                      <tr key={product.id} className="border-b border-border hover:bg-muted/30 transition">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div>
                            <p className="font-medium text-foreground">{product.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                        <td className="px-6 py-4 font-semibold text-foreground">${product.price}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${product.stock > 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                          >
                            {product.stock} unités
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">{product.sold}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                          >
                            {product.status === "active" ? "Actif" : "Rupture"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button className="p-1 hover:bg-muted rounded transition">
                              <Eye className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-1 hover:bg-muted rounded transition">
                              <Edit className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button className="p-1 hover:bg-muted rounded transition">
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Recent Orders */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Commandes récentes</h2>
              <Link href="/seller/orders">
                <Button variant="outline" size="sm">
                  Voir tout
                </Button>
              </Link>
            </div>

            <div className="grid gap-4">
              {RECENT_ORDERS.map((order) => (
                <div
                  key={order.id}
                  className="bg-card p-4 rounded-lg border border-border flex items-center justify-between hover:border-primary/20 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <p className="font-semibold text-foreground">{order.id}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status === "delivered"
                          ? "Livré"
                          : order.status === "processing"
                            ? "En cours"
                            : "En attente"}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Client: {order.customer}</span>
                      <span>{order.items} article(s)</span>
                      <span>{order.date}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">${order.total.toFixed(2)}</p>
                    <Button size="sm" variant="outline" className="mt-2 bg-transparent">
                      Détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
