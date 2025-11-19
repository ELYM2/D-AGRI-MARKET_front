"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { MapPin, Star, Leaf, ShoppingBag, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

const MOCK_SELLERS = [
  {
    id: 1,
    name: "Ferme du soleil",
    category: "Légumes biologiques",
    rating: 4.8,
    reviews: 245,
    distance: 2.3,
    image: "/organic-farm.jpg",
    products: 18,
    description: "Ferme bio certifiée proposant des légumes frais de saison",
  },
  {
    id: 2,
    name: "Laiterie locale",
    category: "Produits laitiers",
    rating: 4.9,
    reviews: 156,
    distance: 3.5,
    image: "/dairy-farm.jpg",
    products: 12,
    description: "Fromages et produits laitiers artisanaux",
  },
  {
    id: 3,
    name: "Verger traditionnels",
    category: "Fruits de saison",
    rating: 4.7,
    reviews: 189,
    distance: 4.1,
    image: "/fruit-orchard.jpg",
    products: 15,
    description: "Fruits frais cueillis à maturité",
  },
  {
    id: 4,
    name: "Ruches locales",
    category: "Miel et apiculture",
    rating: 4.9,
    reviews: 201,
    distance: 2.8,
    image: "/beehives-honey.jpg",
    products: 8,
    description: "Miel pur et produits de la ruche",
  },
]

export default function SellersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [radiusFilter, setRadiusFilter] = useState(10)
  const [sortBy, setSortBy] = useState("distance")

  const filteredSellers = MOCK_SELLERS.filter(
    (seller) =>
      seller.distance <= radiusFilter &&
      (seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        seller.category.toLowerCase().includes(searchQuery.toLowerCase())),
  ).sort((a, b) => {
    if (sortBy === "distance") return a.distance - b.distance
    if (sortBy === "rating") return b.rating - a.rating
    return 0
  })

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

          <div className="flex items-center gap-4">
            <Link href="/products">
              <Button variant="outline" size="sm">
                Produits
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant="ghost" size="sm">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

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
              value={radiusFilter}
              onChange={(e) => setRadiusFilter(Number(e.target.value))}
              className="px-4 py-2 bg-input rounded-lg outline-none text-foreground border border-border"
            >
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
              <option value={25}>25 km</option>
              <option value={50}>50 km</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 bg-input rounded-lg outline-none text-foreground border border-border"
            >
              <option value="distance">Plus proche</option>
              <option value="rating">Meilleure note</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSellers.map((seller) => (
            <Link key={seller.id} href={`/seller-profile/${seller.id}`}>
              <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition group">
                <div className="relative h-48 bg-muted overflow-hidden">
                  <Image
                    src={seller.image || "/placeholder.svg"}
                    alt={seller.name}
                    fill
                    className="object-cover transition group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition">
                      {seller.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{seller.category}</p>
                  </div>

                  <p className="text-sm text-foreground line-clamp-2">{seller.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="font-semibold text-foreground">{seller.rating}</span>
                        <span className="text-xs text-muted-foreground">({seller.reviews})</span>
                      </div>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {seller.distance} km
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">{seller.products} produits</span>
                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                      Voir
                    </Button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredSellers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Aucun producteur trouvé pour cette recherche.</p>
          </div>
        )}
      </main>
    </div>
  )
}
