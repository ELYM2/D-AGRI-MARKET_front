"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Star, MapPin, ShoppingBag, Leaf, Heart, Share2, ArrowLeft, Truck, Shield, Clock, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProduct, addToCart, toggleFavorite } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { resolveMediaUrl } from "@/lib/media"
import { useAuth } from "@/hooks/use-auth"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { me } = useAuth()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!params.id) return

      try {
        setLoading(true)
        const data = await getProduct(Number.parseInt(params.id as string))
        if (!cancelled && data) {
          setProduct({
            id: data.id,
            name: data.name,
            price: Number(data.price),
            old_price: data.old_price ? Number(data.old_price) : undefined,
            description: data.description || "Aucune description disponible.",
            rating: data.average_rating || 0, // Default rating
            reviews: data.review_count || 0,
            images:
              data.images && data.images.length > 0
                ? data.images.map((img: any) => resolveMediaUrl(img.image))
                : ["/placeholder.svg"],
            category: data.category_name || "Divers",
            seller: data.owner_name || "Vendeur",
            distance: data.distance_km || null, // Don't default to 0km logic
            fresh: data.is_fresh || false, // Don't default to true
            stock: data.stock,
            is_favorite: data.is_favorite || false,
            unit: data.unit || "kg" // Handle unit
          })

          if (data.images && data.images.length > 0) {
            setSelectedImage(resolveMediaUrl(data.images[0].image))
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError("Impossible de charger le produit")
          showToast("error", "Erreur", "Impossible de charger le produit")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [params.id])

  const handleAddToCart = async () => {
    if (product) {
      try {
        await addToCart(product.id, quantity)
        showToast("success", "Ajouté au panier", `${quantity}x ${product.name} ajouté au panier`)
      } catch (error) {
        console.error("Error adding to cart:", error)
        showToast("error", "Erreur", "Impossible d'ajouter au panier. Veuillez vous connecter.")
      }
    }
  }

  const handleToggleFavorite = async () => {
    if (!me) {
      showToast("error", "Connexion requise", "Veuillez vous connecter pour ajouter aux favoris")
      return
    }

    if (product) {
      try {
        const res = await toggleFavorite(product.id)
        setProduct((prev: any) => (prev ? { ...prev, is_favorite: res.is_favorite } : null))
        showToast("success", "Favoris", res.is_favorite ? "Ajouté aux favoris" : "Retiré des favoris")
      } catch (error) {
        showToast("error", "Erreur", "Impossible de modifier les favoris")
      }
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: product?.name,
          text: `Découvrez ${product?.name} sur D-AGRI MARKET`,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        showToast("success", "Lien copié", "Le lien a été copié dans le presse-papier")
      }
    } catch (error) {
      // Ignore abort errors
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Produit non trouvé</h1>
          <p className="text-muted-foreground mb-8">
            Le produit que vous cherchez n'existe pas ou a été supprimé.
          </p>
          <Link href="/products">
            <Button>Retour aux produits</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/products">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={handleShare}>
              <Share2 className="w-5 h-5 text-muted-foreground" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images Section */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-xl overflow-hidden border border-border">
              <Image
                src={selectedImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              {product.fresh && (
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <Leaf className="w-4 h-4" />
                  Frais
                </div>
              )}
              {product.old_price && product.old_price > product.price && (
                <div className="absolute top-4 right-4 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-bold">
                  -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${selectedImage === img ? "border-primary" : "border-transparent hover:border-primary/50"
                      }`}
                  >
                    <Image src={img || "/placeholder.svg"} alt={`${product.name} ${i + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div>
            <div className="mb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mb-4">
                    <span className="font-medium text-foreground">{product.category}</span>
                    <span>•</span>
                    <span className="text-primary">{product.seller}</span>
                  </div>
                </div>
                <button
                  onClick={handleToggleFavorite}
                  className={`p-2 rounded-full transition ${product.is_favorite
                    ? "bg-red-50 text-red-500 hover:bg-red-100"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                >
                  <Heart className={`w-6 h-6 ${product.is_favorite ? "fill-current" : ""}`} />
                </button>
              </div>

              {product.rating > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? "fill-accent text-accent" : "text-muted"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-foreground font-medium">{product.rating}/5</span>
                  <span className="text-sm text-muted-foreground">({product.reviews} avis)</span>
                </div>
              )}

              <div className="bg-card border border-border rounded-xl p-6 mb-8">
                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-4xl font-bold text-primary">
                    {product.price.toLocaleString("fr-FR")} FCFA
                  </span>
                  {product.unit && (
                    <span className="text-xl text-muted-foreground font-medium">
                      / {product.unit}
                    </span>
                  )}
                </div>
                {product.old_price && product.old_price > product.price && (
                  <p className="text-lg text-muted-foreground line-through mb-6">
                    {product.old_price.toLocaleString("fr-FR")} FCFA
                  </p>
                )}

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-border rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-muted transition text-foreground"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-muted transition text-foreground"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <Button onClick={handleAddToCart} className="flex-1 bg-primary hover:bg-primary/90 h-12 text-lg">
                      <ShoppingBag className="w-5 h-5 mr-2" />
                      Ajouter au panier
                    </Button>
                  </div>
                  {product.stock !== undefined && (
                    <p className={`text-sm ${product.stock > 0 ? "text-green-600" : "text-destructive"}`}>
                      {product.stock > 0 ? `${product.stock} disponibles` : "Rupture de stock"}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-3">Description</h3>
                  <div
                    className="text-muted-foreground leading-relaxed prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br />') }}
                  />
                </div>

                {product.distance !== null && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>
                      Ce produit est situé à <span className="font-bold text-foreground">{product.distance}km</span> de votre
                      position.
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                    <Truck className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Livraison rapide</p>
                      <p className="text-xs text-muted-foreground">24-48h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
                    <Shield className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium text-foreground">Paiement sécurisé</p>
                      <p className="text-xs text-muted-foreground">Mobile Money</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section - Placeholder for now */}
        <div className="mt-16 border-t border-border pt-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">Avis clients</h2>
          {product.review_count > 0 ? (
            <div className="bg-muted p-8 rounded-xl text-center">
              <p>Les avis seront affichés ici.</p>
            </div>
          ) : (
            <div className="bg-muted/50 p-8 rounded-xl text-center">
              <p className="text-muted-foreground">Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
