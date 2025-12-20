"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { BarChart3, Package, ShoppingCart, Users, TrendingUp, Plus, Eye, Edit, Trash2, Leaf, PauseCircle, PlayCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSellerStats, getProducts, updateProduct, deleteProduct, getMessages } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { resolveMediaUrl } from "@/lib/media"

export default function SellerDashboard() {
  const router = useRouter()
  const { me, loading: authLoading } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState(0)

  useEffect(() => {
    // Redirect if not authenticated or not a seller
    if (!authLoading && !me) {
      router.push("/auth/login")
      return
    }

    if (!authLoading && me && !me.is_seller) {
      showToast("error", "Accès refusé", "Vous devez être vendeur pour accéder à cette page")
      router.push("/")
      return
    }

    if (me && me.is_seller) {
      loadDashboard()
    }
  }, [me, authLoading, router])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      const [statsData, productsData] = await Promise.all([
        getSellerStats(),
        getProducts({ owner: me?.id }),
      ])
      setStats(statsData)
      setProducts(Array.isArray(productsData) ? productsData : productsData.results || [])

      // Load unread messages count
      try {
        const messagesData = await getMessages("received")
        const messages = Array.isArray(messagesData) ? messagesData : messagesData.results || []
        const unread = messages.filter((msg: any) => !msg.is_read).length
        setUnreadMessages(unread)
      } catch (error) {
        console.error("Error loading messages:", error)
      }
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated or not a seller (will redirect in useEffect)
  if (!me || !me.is_seller) {
    return null
  }

  const statsCards = [
    { label: "Ventes ce mois", value: `${stats?.total_sales || 0} FCFA`, icon: TrendingUp },
    { label: "Commandes", value: stats?.total_orders || 0, icon: ShoppingCart },
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
            <Link href="/messages">
              <Button variant="ghost" className="relative">
                <Mail className="w-4 h-4 mr-2" />
                Messages
                {unreadMessages > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </Button>
            </Link>
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
          <p className="text-muted-foreground">Bienvenue {me?.username || 'Vendeur'}</p>
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
                            <img
                              src={resolveMediaUrl(product.images?.[0]?.image) || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              decoding="async"
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
