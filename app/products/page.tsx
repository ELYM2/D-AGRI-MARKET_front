"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Search, MapPin, Filter, ShoppingBag, Star, Leaf, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProducts, toggleFavorite, addToCart } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"
import { resolveMediaUrl } from "@/lib/media"
import { ProductCard } from "@/components/product-card"


const CATEGORIES = ["Tous", "Légumes", "Fruits", "Produits laitiers", "Œufs & Volaille", "Produits apicoles"]
const DEFAULT_PRICE_LIMIT = 20000

type ApiProduct = {
  id: number
  name: string
  description?: string
  price: number | string
  old_price?: number | string
  stock?: number
  category?: number
  category_name?: string
  owner?: number
  owner_name?: string
  is_favorite?: boolean
  images?: { image: string }[]
  unit?: string
}

const UNIT_LABELS: Record<string, string> = {
  kg: "kg",
  g: "g",
  piece: "pièce",
  liter: "L",
  bunch: "botte",
  bag: "sac",
  box: "boîte",
}

export default function ProductsPage() {
  const { me } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [priceRange, setPriceRange] = useState<[number, number]>([0, DEFAULT_PRICE_LIMIT])
  const [priceLimit, setPriceLimit] = useState(DEFAULT_PRICE_LIMIT)
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)
  const [promoOnly, setPromoOnly] = useState(false)
  const [apiProducts, setApiProducts] = useState<ApiProduct[] | null>(null)
  const [loading, setLoading] = useState(false)

  const priceStep = Math.max(1, Math.round(priceLimit / 200))

  const updatePriceFilters = (products: ApiProduct[] | null) => {
    if (!products || products.length === 0) {
      setPriceLimit(DEFAULT_PRICE_LIMIT)
      setPriceRange([0, DEFAULT_PRICE_LIMIT])
      return
    }

    const maxPriceFromProducts = Math.max(
      DEFAULT_PRICE_LIMIT,
      ...products.map((product) => Number(product.price) || 0),
    )

    setPriceLimit(maxPriceFromProducts)
    setPriceRange([0, maxPriceFromProducts])
  }

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        setLoading(true)
        const data = await getProducts({ is_active: true })
        if (!cancelled) {
          const products = Array.isArray(data?.results) ? data.results : data
          setApiProducts(products)
          updatePriceFilters(products)
        }
      } catch {
        if (!cancelled) {
          setApiProducts(null)
          updatePriceFilters(null)
        }
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
      return apiProducts.map((p) => {
        const imageUrl = resolveMediaUrl(p.images?.[0]?.image) || "/placeholder.svg"
        return {
          id: p.id,
          name: p.name,
          price: Number(p.price),
          old_price: p.old_price ? Number(p.old_price) : undefined,
          rating: 0, // Default rating
          reviews: 0,
          image: imageUrl,
          category: p.category_name || "Divers",
          seller: p.owner_name || "Vendeur",
          distance: "0 km",
          fresh: true,
          is_favorite: p.is_favorite || false,
          unit: p.unit,
          stock: p.stock,
        }
      })
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
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">D-AGRI MARKET</span>
          </Link>
          <Link href="/">
            <Button variant="ghost">Retour à l'accueil</Button>
          </Link>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-foreground">{cat}</span>
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
                  max={priceLimit}
                  step={priceStep}
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
                {CATEGORIES.map((cat) => (
                  <label key={cat} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={selectedCategory === cat}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-4 h-4 accent-primary"
                    />
                    <span className="text-sm text-foreground group-hover:text-primary transition">{cat}</span>
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
                  max={priceLimit}
                  step={priceStep}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseFloat(e.target.value)])}
                  className="w-full accent-primary"
                />
                <div className="flex gap-2 text-xs">
                  <input
                    type="number"
                    min="0"
                    max={priceLimit}
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseFloat(e.target.value), priceRange[1]])}
                    className="w-16 px-2 py-1 bg-input rounded text-foreground"
                  />
                  <input
                    type="number"
                    min="0"
                    max={priceLimit}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number.parseFloat(e.target.value)])}
                    className="w-16 px-2 py-1 bg-input rounded text-foreground"
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
                setPriceRange([0, priceLimit])
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      old_price: product.old_price,
                      unit: product.unit,
                      image: product.image,
                      category: product.category,
                      seller: product.seller,
                      isFavorite: product.is_favorite,
                      fresh: product.fresh,
                      stock: product.stock
                    }}
                    onToggleFavorite={(e) => handleToggleFavorite(e, product.id)}
                    onAddToCart={async (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      try {
                        await addToCart(product.id, 1)
                        showToast("success", "Ajouté au panier", `${product.name} a été ajouté à votre panier`)
                      } catch (error) {
                        showToast("error", "Erreur", "Impossible d'ajouter au panier")
                      }
                    }}
                  />
                </div>
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
                    setPriceRange([0, priceLimit])
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
