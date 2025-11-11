"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Search, MapPin, Filter, ShoppingBag, Star, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Tomates biologiques",
    price: 4.5,
    image: "/tomates-biologiques.jpg",
    seller: "Ferme du soleil",
    category: "Légumes",
    rating: 4.8,
    reviews: 145,
    distance: 2.3,
    fresh: true,
  },
  {
    id: 2,
    name: "Carottes fraiches",
    price: 3.2,
    image: "/carottes-fraiches.jpg",
    seller: "Potager bio",
    category: "Légumes",
    rating: 4.9,
    reviews: 89,
    distance: 1.8,
    fresh: true,
  },
  {
    id: 3,
    name: "Fromage fermier",
    price: 12.0,
    image: "/fromage-fermier.jpg",
    seller: "Laiterie locale",
    category: "Produits laitiers",
    rating: 4.7,
    reviews: 234,
    distance: 3.5,
    fresh: true,
  },
  {
    id: 4,
    name: "Miel naturel",
    price: 8.5,
    image: "/miel-naturel.jpg",
    seller: "Ruches locales",
    category: "Produits apicoles",
    rating: 4.9,
    reviews: 156,
    distance: 4.2,
    fresh: false,
  },
  {
    id: 5,
    name: "Laitue biologique",
    price: 2.8,
    image: "/laitue-biologique.jpg",
    seller: "Ferme du soleil",
    category: "Légumes",
    rating: 4.6,
    reviews: 67,
    distance: 2.3,
    fresh: true,
  },
  {
    id: 6,
    name: "Pommes de saison",
    price: 5.99,
    image: "/pommes-saison.jpg",
    seller: "Verger traditionnels",
    category: "Fruits",
    rating: 4.8,
    reviews: 312,
    distance: 3.1,
    fresh: true,
  },
  {
    id: 7,
    name: "Oeufs fermiers",
    price: 6.5,
    image: "/oeufs-fermiers.jpg",
    seller: "Ferme Dupont",
    category: "Œufs & Volaille",
    rating: 4.9,
    reviews: 201,
    distance: 2.9,
    fresh: true,
  },
  {
    id: 8,
    name: "Yaourt maison",
    price: 4.2,
    image: "/yaourt-maison.jpg",
    seller: "Laiterie locale",
    category: "Produits laitiers",
    rating: 4.7,
    reviews: 98,
    distance: 3.5,
    fresh: true,
  },
]

const CATEGORIES = ["Tous", "Légumes", "Fruits", "Produits laitiers", "Œufs & Volaille", "Produits apicoles"]

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [priceRange, setPriceRange] = useState([0, 20])
  const [sortBy, setSortBy] = useState("popular")
  const [showFilters, setShowFilters] = useState(false)

  const filteredProducts = useMemo(() => {
    let result = MOCK_PRODUCTS

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

    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    }

    return result
  }, [searchQuery, selectedCategory, priceRange, sortBy])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LocalMarket</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-medium text-primary">
              Produits
            </Link>
            <Link href="/sellers" className="text-sm text-foreground hover:text-primary transition">
              Producteurs
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/account">
              <Button size="sm" variant="outline">
                Mon compte
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                  Prix: ${priceRange[0]} - ${priceRange[1]}
                </h4>
                <input
                  type="range"
                  min="0"
                  max="20"
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
                  ${priceRange[0].toFixed(2)} - ${priceRange[1].toFixed(2)}
                </p>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="0.5"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseFloat(e.target.value)])}
                  className="w-full accent-primary"
                />
                <div className="flex gap-2 text-xs">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number.parseFloat(e.target.value), priceRange[1]])}
                    className="w-16 px-2 py-1 bg-input rounded text-foreground"
                  />
                  <input
                    type="number"
                    min="0"
                    max="20"
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
                setPriceRange([0, 20])
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
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {product.fresh && (
                        <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <Leaf className="w-3 h-3" />
                          Frais
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4 flex-1 flex flex-col">
                      <div className="mb-3 flex-1">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition line-clamp-2">
                          {product.name}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{product.seller}</p>
                      </div>

                      {/* Rating */}
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

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div>
                          <p className="text-lg font-bold text-primary">${product.price.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {product.distance}km
                          </p>
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
                    setPriceRange([0, 20])
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
