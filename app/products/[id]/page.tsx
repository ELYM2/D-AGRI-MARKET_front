"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Star, MapPin, ShoppingBag, Leaf, Heart, Share2, ArrowLeft, Truck, Shield, Clock, MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getProduct, addToCart, sendMessage } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { resolveMediaUrl } from "@/lib/media"

const UNIT_LABELS: Record<string, string> = {
  kg: "kg",
  g: "g",
  piece: "pièce",
  liter: "L",
  bunch: "botte",
  bag: "sac",
  box: "boîte",
}
import { useAuth } from "@/hooks/use-auth"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { me } = useAuth()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [activeTab, setActiveTab] = useState("reviews")
  const [addingToCart, setAddingToCart] = useState(false)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [messageSubject, setMessageSubject] = useState("")
  const [messageBody, setMessageBody] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)

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

  const handleContactSeller = () => {
    if (!me) {
      showToast("error", "Connexion requise", "Veuillez vous connecter pour contacter le vendeur")
      router.push("/auth/login")
      return
    }
    setMessageSubject(`Question concernant: ${product.name}`)
    setMessageBody("")
    setShowContactDialog(true)
  }

  const handleSendMessage = async () => {
    if (!messageSubject.trim() || !messageBody.trim()) {
      showToast("error", "Champs requis", "Veuillez remplir le sujet et le message")
      return
    }

    try {
      setSendingMessage(true)
      await sendMessage({
        receiver: product.owner,
        subject: messageSubject.trim(),
        body: messageBody.trim(),
      })
      showToast("success", "Message envoyé", "Votre message a été envoyé au vendeur")
      setShowContactDialog(false)
      setMessageSubject("")
      setMessageBody("")
    } catch (error: any) {
      console.error("Error sending message:", error)
      showToast("error", "Erreur", error?.message || "Impossible d'envoyer le message")
    } finally {
      setSendingMessage(false)
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

  const primaryImage =
    resolveMediaUrl(product.images?.find((img: any) => img.is_primary)?.image) ||
    resolveMediaUrl(product.images?.[0]?.image) ||
    "/placeholder.svg"

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header / Navbar Placeholder (if not global) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/products"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6 group"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center mr-2 group-hover:border-primary/50 group-hover:shadow-sm transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Retour aux produits
        </Link>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        ) : !product ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-foreground">Produit non trouvé</h2>
            <p className="text-muted-foreground mt-2">Ce produit n'existe pas ou a été supprimé.</p>
            <Button className="mt-6" onClick={() => router.push("/products")}>
              Voir les autres produits
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column: Images */}
            <div className="space-y-4">
              <div className="relative aspect-[4/3] bg-white rounded-2xl border border-border overflow-hidden shadow-sm group">
                <img
                  src={primaryImage}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="eager"
                />
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.stock > 0 ? (
                    <span className="bg-emerald-500/90 text-white text-sm font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md shadow-sm">
                      <Leaf className="w-3.5 h-3.5" />
                      En stock
                    </span>
                  ) : (
                    <span className="bg-red-500/90 text-white text-sm font-bold px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                      Rupture de stock
                    </span>
                  )}
                </div>
                <button
                  onClick={handleFavorite}
                  className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-sm ${isFavorite
                    ? "bg-white text-red-500 shadow-red-500/10"
                    : "bg-black/20 text-white hover:bg-white hover:text-red-500"
                    }`}
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images && product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                  {product.images.slice(0, 4).map((img: any, idx: number) => (
                    <button
                      key={idx}
                      className="relative aspect-square bg-white rounded-xl border border-border overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
                    >
                      <img
                        src={resolveMediaUrl(img.image) || "/placeholder.svg"}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Info & Actions */}
            <div className="flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm font-semibold text-primary/80 bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide">
                    {product.category_name || "Catégorie"}
                  </span>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium ml-1 text-foreground">4.8</span>
                    <span className="text-sm text-muted-foreground ml-1">(24 avis)</span>
                  </div>
                </div>

                <h1 className="text-3xl font-bold text-foreground mb-3 tracking-tight">
                  {product.name}
                </h1>

                <div className="flex items-baseline gap-3 mb-6">
                  <span className="text-3xl font-bold text-primary">
                    {Number(product.price).toLocaleString()} <span className="text-xl">FCFA</span>
                  </span>
                  {product.unit && (
                    <span className="text-xl text-muted-foreground font-medium">
                      / {UNIT_LABELS[product.unit] || product.unit}
                    </span>
                  )}
                  {product.old_price && Number(product.old_price) > Number(product.price) && (
                    <span className="text-xl text-muted-foreground line-through ml-2">
                      {Number(product.old_price).toLocaleString()} FCFA
                    </span>
                  )}
                </div>

                <p className="text-base text-muted-foreground leading-relaxed mb-8">
                  {product.description || "Aucune description disponible pour ce produit."}
                </p>
              </div>

              {/* Action Card */}
              <div className="glass-card rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground border border-border">
                      {quantity}
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider">Quantité</span>
                      <div className="flex items-center bg-white rounded-lg border border-border p-1 shadow-sm">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted text-foreground transition"
                        >
                          -
                        </button>
                        <span className="w-8 text-center font-semibold text-foreground">{quantity}</span>
                        <button
                          onClick={() => setQuantity(quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-muted text-foreground transition"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold uppercase text-muted-foreground tracking-wider block mb-1">Total</span>
                    <span className="text-2xl font-bold text-foreground">
                      {(Number(product.price) * quantity).toLocaleString()} FCFA
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-emerald-600 text-white font-bold text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all transform hover:-translate-y-0.5"
                    onClick={handleAddToCart}
                    disabled={addingToCart || product.stock <= 0}
                  >
                    {addingToCart ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Ajout...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5" />
                        Ajouter au panier
                      </span>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/20 text-primary hover:bg-primary/5 font-bold text-base"
                    onClick={handleContactSeller}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Contacter
                  </Button>
                </div>
              </div>

              {/* Seller Info */}
              <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary">{product.owner_name ? product.owner_name.charAt(0).toUpperCase() : "V"}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Vendu par</p>
                  <h4 className="font-bold text-foreground">{product.owner_name || "Vendeur"}</h4>
                </div>
                <Button variant="ghost" size="sm" className="ml-auto text-xs" onClick={() => router.push(product.owner ? `/seller-profile/${product.owner}` : "/sellers")}>
                  Voir le profil
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Contact Seller Dialog */}
      {showContactDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Contacter le vendeur</h2>
              <button
                onClick={() => setShowContactDialog(false)}
                className="text-muted-foreground hover:text-foreground transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Envoyez un message à <span className="font-medium text-foreground">{product.owner_name}</span> concernant ce produit.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sujet *</label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Sujet du message"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message *</label>
                <textarea
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  rows={5}
                  placeholder="Votre message..."
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactDialog(false)}
                  disabled={sendingMessage}
                >
                  Annuler
                </Button>
                <Button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={sendingMessage || !messageSubject.trim() || !messageBody.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {sendingMessage ? "Envoi..." : "Envoyer le message"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
