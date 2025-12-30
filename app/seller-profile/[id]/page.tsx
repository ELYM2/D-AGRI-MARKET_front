"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { MapPin, Phone, Mail, Globe, Star, Package, Users, Clock, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSeller, getProducts } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { resolveMediaUrl } from "@/lib/media"
import Navbar from "@/components/navbar"

export default function SellerProfilePage() {
  const params = useParams()
  const [seller, setSeller] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      loadData()
    }
  }, [params.id])

  const loadData = async () => {
    try {
      setLoading(true)
      const [sellerData, productsData] = await Promise.all([
        getSeller(Number(params.id)),
        getProducts({ owner: Number(params.id) }) // Assuming filtering by owner is supported
      ])
      setSeller(sellerData)
      setProducts(productsData.results || [])
    } catch (error) {
      console.error("Error loading seller profile:", error)
      showToast("error", "Erreur", "Impossible de charger le profil du producteur")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  if (!seller) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Producteur non trouvé</h2>
          <Link href="/sellers">
            <Button>Retour aux producteurs</Button>
          </Link>
        </div>
      </div>
    )
  }

  const highlights = [
    { icon: Package, label: "Produits", value: `${seller.products_count || 0} produits` },
    { icon: Star, label: "Évaluation", value: seller.rating ? `${seller.rating}/5` : "N/A" },
    { icon: MapPin, label: "Ville", value: seller.city || "N/A" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="relative -mx-4 sm:mx-0 h-64 bg-muted flex items-center justify-center">
          <Leaf className="w-24 h-24 text-muted-foreground opacity-20" />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-32 rounded-lg" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-lg bg-card border-4 border-background -mt-16 overflow-hidden flex-shrink-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-primary">{seller.business_name?.charAt(0) || seller.username?.charAt(0)}</span>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-foreground">{seller.business_name || seller.username}</h1>
                <p className="text-muted-foreground">{seller.city}</p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="font-bold text-foreground">{seller.rating || 0}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">À propos</h2>
              <p className="text-foreground leading-relaxed">{seller.description || "Aucune description disponible."}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                {highlights.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="bg-card p-4 rounded-lg border border-border text-center">
                      <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-bold text-foreground mt-1">{item.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Produits</h2>
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.id}`}>
                      <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition h-full">
                        <div className="relative h-40 bg-muted">
                          <img
                            src={resolveMediaUrl(product.images?.[0]?.image) || "/placeholder.svg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-foreground truncate">{product.name}</h3>
                          <p className="text-lg font-bold text-primary mt-2">{Number(product.price).toFixed(0)} FCFA</p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">Aucun produit disponible.</p>
              )}
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24 space-y-6">
              <h3 className="text-lg font-bold text-foreground">Informations</h3>

              <div className="space-y-4">
                {seller.city && (
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs text-muted-foreground">Ville</p>
                      <p className="text-sm font-medium text-foreground">{seller.city}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  Horaires
                </h3>
                <div className="text-sm space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Lundi</span>
                    <span className="text-foreground">{seller.mon_open ? `${seller.mon_open.substring(0, 5)} - ${seller.mon_close.substring(0, 5)}` : "Fermé"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Samedi</span>
                    <span className="text-foreground">{seller.sat_open ? `${seller.sat_open.substring(0, 5)} - ${seller.sat_close.substring(0, 5)}` : "Fermé"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Dimanche</span>
                    <span className="text-foreground">{seller.sun_open ? `${seller.sun_open.substring(0, 5)} - ${seller.sun_close.substring(0, 5)}` : "Fermé"}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Livraison</h3>
                <div className="space-y-3">
                  {seller.min_order_amount > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Commande min.</p>
                      <p className="text-sm font-medium text-foreground">{Number(seller.min_order_amount).toLocaleString()} FCFA</p>
                    </div>
                  )}
                  {seller.delivery_time && (
                    <div>
                      <p className="text-xs text-muted-foreground">Temps estimé</p>
                      <p className="text-sm font-medium text-foreground">{seller.delivery_time}</p>
                    </div>
                  )}
                </div>
              </div>

              {seller.terms_of_sale && (
                <div className="border-t border-border pt-6 space-y-2">
                  <h3 className="text-sm font-bold text-foreground">Conditions</h3>
                  <p className="text-xs text-muted-foreground whitespace-pre-wrap">{seller.terms_of_sale}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
