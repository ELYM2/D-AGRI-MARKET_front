"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, Plus, Eye, Edit, Trash2, Leaf, PauseCircle, PlayCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSellerStats, getProducts, updateProduct, deleteProduct } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { SalesChart } from "@/components/sales-chart"
import { FileDown, Printer } from "lucide-react"
import jsPDF from "jspdf"

export default function SellerDashboard() {
  const router = useRouter()
  const { me: user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboard()
    }
  }, [user])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const [statsData, productsData] = await Promise.all([
        getSellerStats().catch(() => ({ sales_this_month: 0, active_orders: 0, total_products: 0, total_customers: 0, daily_sales: [] })),
        user?.id ? getProducts({ owner: user.id }).catch(() => ({ results: [] })) : Promise.resolve({ results: [] })
      ])

      setStats(statsData)
      setProducts(productsData.results || [])
    } catch (error) {
      console.error("Error loading dashboard:", error)
      showToast("error", "Erreur", "Impossible de charger le tableau de bord")
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (product: any) => {
    try {
      const updated = await updateProduct(product.id, { is_active: !product.is_active })
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, ...updated } : p)))
      showToast("success", "Produit mis à jour", updated.is_active ? "Le produit est actif" : "Le produit est en pause")
    } catch (error: any) {
      showToast("error", "Erreur", error?.message || "Impossible de mettre à jour le produit")
    }
  }

  const handleDelete = async (productId: number) => {
    const confirmed = window.confirm("Supprimer ce produit ? Cette action est irréversible.")
    if (!confirmed) return

    try {
      await deleteProduct(productId)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      showToast("success", "Produit supprimé", "Le produit a été retiré")
    } catch (error: any) {
      showToast("error", "Erreur", error?.message || "Impossible de supprimer le produit")
    }
  }

  const generateReport = () => {
    const doc = new jsPDF()
    doc.setFontSize(20)
    doc.text("Rapport de Ventes - D-AGRI", 20, 20)
    doc.setFontSize(12)
    doc.text(`Vendeur: ${user?.username}`, 20, 30)
    doc.text(`Ventes totales: ${stats?.total_sales || 0} FCFA`, 20, 40)
    doc.text(`Nombre de produits: ${products.length}`, 20, 50)
    doc.save("rapport-ventes.pdf")
    showToast("success", "PDF Généré", "Le rapport a été téléchargé")
  }

  const generateShippingLabel = (product: any) => {
    const doc = new jsPDF()
    doc.rect(20, 20, 100, 60)
    doc.setFontSize(16)
    doc.text("ETIQUETTE D'EXPÉDITION", 30, 35)
    doc.setFontSize(10)
    doc.text(`Produit: ${product.name}`, 30, 45)
    doc.text(`Vendeur: ${user?.username}`, 30, 55)
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 30, 65)
    doc.save(`label-${product.id}.pdf`)
    showToast("success", "Label Généré", "L'étiquette est prête")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  const statsCards = [
    { label: "Ventes ce mois", value: `${stats?.sales_this_month || 0} FCFA`, icon: TrendingUp },
    { label: "Commandes Actives", value: stats?.active_orders || 0, icon: ShoppingCart },
    { label: "Produits", value: stats?.total_products || products.length, icon: Package },
    { label: "Clients", value: stats?.total_customers || 0, icon: Users },
  ]

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

          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="ghost">
                Retour à l'accueil
              </Button>
            </Link>
            <Link href="/seller/products/new">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau produit
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Tableau de bord vendeur</h1>
          <p className="text-muted-foreground">Bienvenue {user?.username || 'Vendeur'}</p>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Performance des ventes</h2>
              <Button variant="outline" size="sm" onClick={generateReport}>
                <FileDown className="w-4 h-4 mr-2" />
                Télécharger le rapport
              </Button>
            </div>
            <SalesChart data={stats?.daily_sales || []} />
          </div>

          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Alertes Stock</h2>
            <div className="space-y-4">
              {products.filter(p => p.stock < 10).slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                  <div>
                    <p className="text-sm font-bold text-red-800">{p.name}</p>
                    <p className="text-xs text-red-600">Stock critique: {p.stock}</p>
                  </div>
                  <Link href={`/seller/products/${p.id}`}>
                    <Button size="sm" variant="ghost" className="text-red-700 hover:bg-red-100">Réappro.</Button>
                  </Link>
                </div>
              ))}
              {products.filter(p => p.stock < 10).length === 0 && (
                <p className="text-sm text-center text-muted-foreground py-10 italic">Aucune alerte stock</p>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Products Section */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Mes produits</h2>
            <Link href="/seller/products/new">
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter un produit
              </Button>
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Aucun produit</h3>
              <p className="text-muted-foreground mb-4">Commencez par ajouter votre premier produit</p>
              <Link href="/seller/products/new">
                <Button className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Ajouter un produit
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Produit</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Catégorie</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Prix</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Statut</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.slice(0, 10).map((product) => (
                    <tr key={product.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 bg-muted rounded overflow-hidden flex-shrink-0">
                            <Image
                              src={product.images?.[0]?.image || "/placeholder.svg"}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium text-foreground">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">{product.category_name}</td>
                      <td className="py-3 px-4 text-sm font-medium text-foreground">
                        <div className="flex items-center gap-2">
                          <span>{Number(product.price).toFixed(0)} FCFA</span>
                          {product.old_price && Number(product.old_price) > Number(product.price) && (
                            <span className="text-xs text-muted-foreground line-through">
                              {Number(product.old_price).toFixed(0)} FCFA
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                          {product.is_active ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/products/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Link href={`/seller/products/${product.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(product)}
                            title={product.is_active ? "Mettre en pause" : "Activer"}
                          >
                            {product.is_active ? (
                              <PauseCircle className="w-4 h-4 text-yellow-600" />
                            ) : (
                              <PlayCircle className="w-4 h-4 text-green-600" />
                            )}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => generateShippingLabel(product)}>
                            <Printer className="w-4 h-4 text-primary" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(product.id)}>
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/seller/products/new" className="bg-card rounded-lg border border-border p-6 hover:border-primary transition">
            <Plus className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Ajouter un produit</h3>
            <p className="text-sm text-muted-foreground">Créez un nouveau produit à vendre</p>
          </Link>

          <Link href="/seller/orders" className="bg-card rounded-lg border border-border p-6 hover:border-primary transition">
            <ShoppingCart className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Gérer les commandes</h3>
            <p className="text-sm text-muted-foreground">Voir et traiter vos commandes</p>
          </Link>

          <Link href="/seller/analytics" className="bg-card rounded-lg border border-border p-6 hover:border-primary transition">
            <BarChart3 className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-semibold text-foreground mb-2">Statistiques</h3>
            <p className="text-sm text-muted-foreground">Analysez vos performances</p>
          </Link>
        </div>
      </main>
    </div>
  )
}
