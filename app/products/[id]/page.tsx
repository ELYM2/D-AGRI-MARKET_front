"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Star, MapPin, ShoppingBag, Leaf, Heart, Share2, ArrowLeft, Truck, Shield, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProduct, addToCart } from "@/lib/api"
import { showToast } from "@/components/toast-notification"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("reviews")
  const [addingToCart, setAddingToCart] = useState(false)

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true)
        const data = await getProduct(Number(params.id))
        setProduct(data)
      } catch (error) {
        console.error("Error loading product:", error)
        showToast("error", "Erreur", "Impossible de charger le produit")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadProduct()
    }
  }, [params.id])

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true)
      await addToCart(product.id, quantity)
      showToast("success", "Ajouté au panier", `${quantity}x ${product.name} ajouté au panier`)
    } catch (error) {
      console.error("Error adding to cart:", error)
      showToast("error", "Erreur", "Impossible d'ajouter au panier. Veuillez vous connecter.")
    } finally {
      setAddingToCart(false)
    }
  }

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    showToast("success", isFavorite ? "Retiré" : "Ajouté", isFavorite ? "Retiré de vos favoris" : "Ajouté à vos favoris")
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      showToast("success", "Copié", "Lien copié dans le presse-papiers")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Produit non trouvé</h2>
          <p className="text-muted-foreground mb-4">Le produit que vous recherchez n'existe pas.</p>
          <Link href="/products">
            <Button>Retour aux produits</Button>
          </Link>
        </div>
      </div>
    )
  }

  const primaryImage = product.images?.find((img: any) => img.is_primary)?.image || product.images?.[0]?.image

  return (
    <div className="min-h-screen bg-background">
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
              <Image
                src={primaryImage || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {product.stock > 0 && (
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  En stock
                </div>
              )}
            </div>

            {/* Image Gallery */}
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img: any, idx: number) => (
                  <div key={idx} className="relative h-20 bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition">
                    <Image src={img.image || "/placeholder.svg"} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            {/* Title and Rating */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{product.name}</h1>
                  <p className="text-sm text-muted-foreground">{product.category_name}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={handleFavorite} className={isFavorite ? "bg-primary/10 border-primary" : ""}>
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
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.average_rating || 0) ? "fill-accent text-accent" : "text-muted"}`} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-foreground">{product.average_rating?.toFixed(1) || "0.0"}</span>
                </div>
                <p className="text-sm text-muted-foreground">({product.review_count || 0} avis)</p>
              </div>
            </div>

            {/* Price and Seller */}
            <div className="border-t border-b border-border py-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Prix:</span>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
                  {product.old_price && Number(product.old_price) > Number(product.price) && (
                    <span className="text-xl text-muted-foreground line-through">${Number(product.old_price).toFixed(2)}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Vendeur:</span>
                <span className="text-primary font-medium">{product.owner_name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Stock:</span>
                <span className={`font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} disponibles` : "Rupture de stock"}
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{product.description || "Aucune description disponible."}</p>
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock > 0 && (
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
                      max={product.stock}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, Number.parseInt(e.target.value) || 1)))}
                      className="w-12 h-10 text-center bg-background border-0 outline-none text-foreground"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 flex items-center justify-center text-foreground hover:bg-muted transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <Button onClick={handleAddToCart} disabled={addingToCart} className="w-full bg-primary hover:bg-primary/90 h-12">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {addingToCart ? "Ajout en cours..." : "Ajouter au panier"}
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
            )}
          </div>
        </div>

        {/* Reviews Section */}
        {product.review_count > 0 && (
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Avis clients ({product.review_count})</h2>
            <p className="text-muted-foreground">Les avis seront affichés ici.</p>
          </div>
        )}
      </main>
    </div>
  )
}
