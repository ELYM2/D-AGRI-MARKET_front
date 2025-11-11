"use client"

import { useState } from "react"
import Link from "next/link"
import { Star, MapPin, ShoppingBag, Leaf, Heart, Share2, ArrowLeft, Truck, Shield, Clock } from "lucide-react"
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
    description:
      "Délicieuses tomates biologiques cultivées sans pesticides, directement de notre ferme. Parfaites pour vos salades et sauces.",
    weight: "1 kg",
    origin: "Vallée locale",
    harvest: "Récolte du jour",
    ingredients: "Tomates 100% biologiques",
    storage: "À conserver à température ambiante",
    rating_detail: [
      { stars: 5, count: 98 },
      { stars: 4, count: 35 },
      { stars: 3, count: 10 },
      { stars: 2, count: 2 },
      { stars: 1, count: 0 },
    ],
    recent_reviews: [
      {
        id: 1,
        author: "Jean M.",
        rating: 5,
        date: "Il y a 2 jours",
        text: "Excellentes tomates, très fraiches et délicieuses! Je recommande vivement.",
      },
      {
        id: 2,
        author: "Marie L.",
        rating: 5,
        date: "Il y a 5 jours",
        text: "Produit de qualité, livraison rapide. Très satisfait!",
      },
      {
        id: 3,
        author: "Pierre D.",
        rating: 4,
        date: "Il y a 1 semaine",
        text: "Bon produit, un peu petit mais excellent goût.",
      },
    ],
    seller_info: {
      name: "Ferme du soleil",
      location: "2.3 km de vous",
      since: "Membre depuis 2019",
      rating: 4.8,
      reviews: 892,
      description: "Ferme familiale spécialisée dans la production biologique de fruits et légumes frais.",
      response_time: "Répond généralement en &lt; 1h",
    },
  },
  // ... autres produits
]

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = MOCK_PRODUCTS.find((p) => p.id === Number.parseInt(params.id)) || MOCK_PRODUCTS[0]
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("reviews")

  const handleAddToCart = () => {
    console.log(`Added ${quantity} of ${product.name} to cart`)
    const event = new CustomEvent("toast", {
      detail: {
        type: "success",
        title: "Ajouté au panier",
        message: `${quantity}x ${product.name} ajouté au panier`,
      },
    })
    window.dispatchEvent(event)
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    const event = new CustomEvent("toast", {
      detail: {
        type: "success",
        title: isFavorite ? "Retiré" : "Ajouté",
        message: isFavorite ? "Retiré de vos favoris" : "Ajouté à vos favoris",
      },
    })
    window.dispatchEvent(event)
  }

  const handleShare = () => {
    const event = new CustomEvent("toast", {
      detail: {
        type: "success",
        title: "Copié",
        message: "Lien copié dans le presse-papiers",
      },
    })
    window.dispatchEvent(event)
  }

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

          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="sm">
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
        {/* Breadcrumb */}
        <Link href="/products" className="flex items-center gap-2 text-primary hover:text-primary/80 transition mb-6">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Retour aux produits</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="flex flex-col gap-4">
            <div className="relative overflow-hidden bg-muted rounded-lg h-96 flex items-center justify-center">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.fresh && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  Frais aujourd'hui
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            {/* Title and Rating */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleFavorite}
                    className={isFavorite ? "bg-primary/10 border-primary" : ""}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{product.rating}</span>
                </div>
                <p className="text-sm text-muted-foreground">({product.reviews} avis)</p>
              </div>
            </div>

            {/* Price and Seller */}
            <div className="border-t border-b border-border py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Prix:</span>
                <span className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vendeur:</span>
                <Link href="#" className="text-primary font-medium hover:underline">
                  {product.seller}
                </Link>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Distance:
                </span>
                <span className="font-medium text-foreground">{product.distance} km</span>
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-3 bg-muted/50 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Poids</p>
                  <p className="font-semibold text-foreground">{product.weight}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Origine</p>
                  <p className="font-semibold text-foreground">{product.origin}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Récolte</p>
                  <p className="font-semibold text-foreground">{product.harvest}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Catégorie</p>
                  <p className="font-semibold text-foreground">{product.category}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            </div>

            {/* Additional Info */}
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-semibold text-foreground">Ingrédients:</span>{" "}
                <span className="text-muted-foreground">{product.ingredients}</span>
              </p>
              <p className="text-sm">
                <span className="font-semibold text-foreground">Conservation:</span>{" "}
                <span className="text-muted-foreground">{product.storage}</span>
              </p>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="border-t border-border pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Quantité:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-12 h-10 text-center bg-background border-0 outline-none text-foreground"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button onClick={handleAddToCart} className="w-full bg-primary hover:bg-primary/90 h-12">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Ajouter au panier
              </Button>

              {/* Shipping Info */}
              <div className="space-y-3 bg-primary/5 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Truck className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">Livraison gratuite</p>
                    <p className="text-xs text-muted-foreground">Pour les commandes &gt; $50</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">Livraison rapide</p>
                    <p className="text-xs text-muted-foreground">Généralement 24-48h</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-semibold text-sm text-foreground">Paiement sécurisé</p>
                    <p className="text-xs text-muted-foreground">SSL et protection garantie</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seller Section */}
        <div className="bg-card rounded-lg border border-border p-6 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">À propos du vendeur</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">{product.seller_info.name}</h3>
              <div className="space-y-3 text-sm">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{product.seller_info.location}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-muted-foreground">{product.seller_info.since}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-muted-foreground">{product.seller_info.response_time}</span>
                </p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Évaluation</h4>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.seller_info.rating) ? "fill-accent text-accent" : "text-muted"}`}
                    />
                  ))}
                </div>
                <span className="font-semibold text-foreground">{product.seller_info.rating}</span>
              </div>
              <p className="text-sm text-muted-foreground">({product.seller_info.reviews} avis)</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-4">{product.seller_info.description}</p>
              <Button variant="outline" className="w-full bg-transparent">
                Voir tous les produits
              </Button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 border-b-2 font-medium transition ${
                activeTab === "reviews"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Avis ({product.reviews})
            </button>
            <button
              onClick={() => setActiveTab("distribution")}
              className={`pb-3 border-b-2 font-medium transition ${
                activeTab === "distribution"
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Distribution
            </button>
          </div>

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {product.recent_reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{review.author}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < review.rating ? "fill-accent text-accent" : "text-muted"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "distribution" && (
            <div className="space-y-4">
              {product.rating_detail.map((item) => (
                <div key={item.stars} className="flex items-center gap-4">
                  <div className="flex items-center gap-1 w-20">
                    {[...Array(item.stars)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                    ))}
                    {[...Array(5 - item.stars)].map((_, i) => (
                      <Star key={i + item.stars} className="w-4 h-4 text-muted" />
                    ))}
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div className="bg-primary h-full" style={{ width: `${(item.count / product.reviews) * 100}%` }} />
                  </div>
                  <p className="text-sm text-muted-foreground w-12 text-right">{item.count}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
