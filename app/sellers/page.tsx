"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { MapPin, Star, Leaf, ShoppingBag, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSellers } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import Navbar from "@/components/navbar"

interface Seller {
  id: number
  business_name: string
  description: string
  rating: number
  city: string
  products_count: number
}

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")

  useEffect(() => {
    loadSellers()
  }, [])

  const loadSellers = async () => {
    try {
      setLoading(true)
      const data = await getSellers()
      setSellers(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      console.error("Error loading sellers:", error)
      showToast("error", "Erreur", "Impossible de charger les producteurs")
    } finally {
      setLoading(false)
    }
  }

  const filteredSellers = sellers.filter(
    (seller) =>
      seller.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      seller.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0)
    return 0
  })

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Producteurs locaux</h1>
          <p className="text-muted-foreground">Découvrez les producteurs près de chez vous</p>
        </div>

        <div className="bg-card rounded-lg border border-border p-6 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-input rounded-lg border border-border">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un producteur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-input rounded-lg outline-none text-foreground border border-border"
            >
              <option value="rating">Meilleure note</option>
              <option value="name">Nom</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Chargement des producteurs...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSellers.map((seller) => (
              <Link key={seller.id} href={`/seller-profile/${seller.id}`}>
                <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition group">
                  <div className="relative h-48 bg-muted overflow-hidden flex items-center justify-center">
                    {/* Placeholder for seller image since we don't have one yet */}
                    <Leaf className="w-16 h-16 text-muted-foreground opacity-20" />
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition">
                        {seller.business_name || "Producteur sans nom"}
                      </h3>
                      <p className="text-sm text-muted-foreground">{seller.city || "Localisation inconnue"}</p>
                    </div>

                    <p className="text-sm text-foreground line-clamp-2">{seller.description || "Aucune description"}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-semibold text-foreground">{seller.rating || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-sm text-muted-foreground">{seller.products_count} produits</span>
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        Voir
                      </Button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && filteredSellers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun producteur trouvé pour cette recherche.</p>
          </div>
        )}
      </main>
    </div>
  )
}
