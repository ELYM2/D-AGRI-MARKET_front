"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Heart, Leaf, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getFavorites, toggleFavorite } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import Image from "next/image"
import { resolveMediaUrl } from "@/lib/media"

type Favorite = {
  id: number
  product: {
    id: number
    name: string
    price: number
    old_price?: number
    images?: { image: string }[]
    owner_name?: string
  }
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await getFavorites()
        setFavorites(Array.isArray(data) ? data : data?.results || [])
      } catch (error: unknown) {
        console.error("Error loading favorites", error)
        const message = error instanceof Error ? error.message : "Impossible de charger vos favoris"
        showToast("error", "Erreur", message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleRemove = async (productId: number) => {
    try {
      const res = await toggleFavorite(productId)
      if (res.is_favorite === false) {
        setFavorites((prev) => prev.filter((f) => f.product.id !== productId))
        showToast("success", "Favori retiré", "Le produit a été retiré de vos favoris")
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Impossible de retirer des favoris"
      showToast("error", "Erreur", message)
    }
  }

  const hasFavorites = useMemo(() => favorites.length > 0, [favorites])

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Mes favoris</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Heart className="w-4 h-4" />
            {favorites.length} produit(s)
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-16">Chargement de vos favoris...</div>
        ) : !hasFavorites ? (
          <div className="text-center text-muted-foreground py-16 space-y-4">
            <Heart className="w-12 h-12 mx-auto opacity-50" />
            <p>Vous n'avez pas encore de favoris.</p>
            <Link href="/products">
              <Button variant="outline">Découvrir des produits</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((fav) => (
              <div key={fav.id} className="bg-card rounded-lg border border-border overflow-hidden flex flex-col">
                  <div className="relative h-44 bg-muted">
                    <Image
                      src={resolveMediaUrl(fav.product.images?.[0]?.image) || "/placeholder.svg"}
                      alt={fav.product.name}
                      fill
                      className="object-cover"
                      sizes="176px"
                    />
                    <button
                      onClick={() => handleRemove(fav.product.id)}
                      className="absolute top-3 right-3 bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{fav.product.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{fav.product.owner_name || "Producteur"}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold text-primary">{Number(fav.product.price).toFixed(0)} FCFA</p>
                      {fav.product.old_price && Number(fav.product.old_price) > Number(fav.product.price) && (
                        <p className="text-sm text-muted-foreground line-through">
                          {Number(fav.product.old_price).toFixed(0)} FCFA
                        </p>
                      )}
                    </div>
                  </div>
                  <Link href={`/products/${fav.product.id}`} className="mt-4">
                    <Button className="w-full bg-primary hover:bg-primary/90">Voir le produit</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
