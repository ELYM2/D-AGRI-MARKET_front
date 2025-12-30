"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, Filter, ShoppingBag, Star, Leaf, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProducts, toggleFavorite, getCategories } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"
import { resolveMediaUrl } from "@/lib/media"


import Navbar from "@/components/navbar"

const CATEGORIES = ["Tous", "Légumes", "Fruits", "Produits laitiers", "Œufs & Volaille", "Produits apicoles"]

type ApiProduct = {
  id: number
  name: string
  description?: string
  price: number | string
  stock?: number
  category?: number
  category_name?: string
  owner?: number
  owner_name?: string
  is_favorite?: boolean
  old_price?: number | string
  images?: { image: string }[]
}

export default function ProductsPage() {
  const { me } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [priceRange, setPriceRange] = useState([0, 50000])
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [promoOnly, setPromoOnly] = useState(false)
  const [apiProducts, setApiProducts] = useState<ApiProduct[] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        if (!cancelled) {
          setApiProducts(Array.isArray(productsData?.results) ? productsData.results : productsData)
          const resolvedCategories = Array.isArray(categoriesData?.results) ? categoriesData.results : categoriesData
          setCategories(resolvedCategories || [])
        }
      } catch {
        if (!cancelled) setApiProducts(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const sourceProducts = useMemo(() => {
    if (apiProducts && apiProducts.length) {
      return apiProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: Number(p.price),
        old_price: p.old_price ? Number(p.old_price) : undefined,
        rating: 0, // Default rating if API doesn't provide it
        reviews: 0,
        image: p.images && p.images.length > 0 ? resolveMediaUrl(p.images[0].image) : "/placeholder.svg",
        category: p.category_name || "Divers",
        seller: p.owner_name || "Vendeur",
        distance: null, // Don't default to 0km unless calculated
        fresh: false, // Don't default to true
        is_favorite: p.is_favorite || false,
      }))
    }
    return []
  }, [apiProducts])

  const handleToggleFavorite = async (e: React.MouseEvent, productId: number) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation()

    if (!me) {
      showToast("error", "Connexion requise", "Veuillez vous connecter pour ajouter aux favoris")
      return
    }

    try {
      const res = await toggleFavorite(productId)

      // Update local state
      if (apiProducts) {
        setApiProducts(apiProducts.map(p =>
          p.id === productId ? { ...p, is_favorite: res.is_favorite } : p
        ))
      }

      showToast("success", "Favoris", res.is_favorite ? "Ajouté aux favoris" : "Retiré des favoris")
    } catch (error) {
      showToast("error", "Erreur", "Impossible de modifier les favoris")
    }
  }

  const filteredProducts = useMemo(() => {
    let result = sourceProducts

    // Filter by search query
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.seller.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Filter by category
    if (selectedCategory !== "Tous") {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // Filter by price range
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (promoOnly) {
      result = result.filter((p) => p.old_price && p.old_price > p.price)
    }

    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [searchQuery, selectedCategory, priceRange, sortBy, promoOnly, sourceProducts])

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {loading && (
          <div className="text-sm text-muted-foreground mb-4">Chargement des produits…</div>
        )}
        {/* Search Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 bg-card p-3 rounded-lg border border-border">
            <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-input rounded-md">
              <Search className="w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="inline-flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={promoOnly}
                  onChange={(e) => setPromoOnly(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-foreground">Promos seulement</span>
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 bg-input rounded-md outline-none text-foreground text-sm"
              >
                <option value="popular">Populaire</option>
                <option value="rating">Meilleure note</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>

              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Filters Toggle */}
          {showFilters && (
            <div className="md:hidden bg-card p-4 rounded-lg border border-border space-y-4">
              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm">Catégories</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="category"
                      value="Tous"
                      checked={selectedCategory === "Tous"}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-foreground">Tous</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat.name}
                        checked={selectedCategory === cat.name}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3 text-sm">
                  Prix: {priceRange[0]} FCFA - {priceRange[1]} FCFA
                </h4>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="100"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex flex-col gap-6">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Catégories</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value="Tous"
                    checked={selectedCategory === "Tous"}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-4 h-4 accent-primary"
                  />
                  <span className="text-sm text-foreground group-hover:text-primary transition">Tous</span>
                </label>
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={cat.name}
                      checked={selectedCategory === cat.name}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition">{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-4">Prix</h3>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {priceRange[0].toFixed(0)} FCFA - {priceRange[1].toFixed(0)} FCFA
                </p>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="500"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseFloat(e.target.value)])}
                  className="w-full accent-primary"
                />
                <div className="flex gap-2 text-xs">
                  <input
                    type="number"
                    min="0"
                    max="50000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseFloat(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 bg-input rounded text-foreground"
                  />
                  <input
                    type="number"
                    min="0"
                    max="50000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseFloat(e.target.value)])}
                    className="w-20 px-2 py-1 bg-input rounded text-foreground"
                  />
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent"
              onClick={() => {
                setSearchQuery("")
                setSelectedCategory("Tous")
                setPriceRange([0, 50000])
                setPromoOnly(false)
              }}
            >
              Réinitialiser
            </Button>
          </aside>

          {/* Products Grid */}
          <div className="md:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} produit{filteredProducts.length !== 1 ? "s" : ""} trouvé
                {filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.id}`}>
                  <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition group cursor-pointer h-full flex flex-col">
                    {/* Product Image */}
                    <div className="relative overflow-hidden bg-muted h-48 flex items-center justify-center">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                        {product.fresh && (
                          <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Leaf className="w-3 h-3" />
                            Frais
                          </div>
                        )}
                        {product.old_price && product.old_price > product.price && (
                          <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-semibold">
                            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                          </div>
                        )}
                      </div>
                      <button
                        onClick={(e) => handleToggleFavorite(e, product.id)}
                        className={`absolute top-3 left-3 p-2 rounded-full transition ${product.is_favorite
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
                          }`}
                      >
                        <Heart className={`w-4 h-4 ${product.is_favorite ? "fill-current" : ""}`} />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="mb-3 flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{product.seller}</p>
                      </div>

                      {/* Rating - Only show if > 0 */}
                      {product.rating > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">({product.reviews})</span>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-bold text-primary">{Number(product.price).toFixed(0)} FCFA</p>
                            {product.old_price && product.old_price > product.price && (
                              <p className="text-sm text-muted-foreground line-through">
                                {Number(product.old_price).toFixed(0)} FCFA
                              </p>
                            )}
                          </div>
                          {product.distance !== null && (
                            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                              <MapPin className="w-3 h-3" />
                              {product.distance}km
                            </p>
                          )}
                        </div>
                        <Button size="sm" className="bg-primary hover:bg-primary/90">
                          <ShoppingBag className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Aucun produit ne correspond à votre recherche.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("Tous")
                    setPriceRange([0, 50000])
                    setPromoOnly(false)
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
