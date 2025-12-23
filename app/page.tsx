"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Search, MapPin, ShoppingBag, Users, Leaf, TrendingUp, ArrowRight, Star, Shield, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { getProducts } from "@/lib/api"
import { showToast } from "@/components/toast-notification"

// Category Data with proper typing
const CATEGORIES: { name: string; icon: any; color: string }[] = [
  { name: "Légumes", icon: Leaf, color: "text-green-600 bg-green-100" },
  { name: "Fruits", icon: Leaf, color: "text-orange-500 bg-orange-100" },
  { name: "Produits laitiers", icon: Leaf, color: "text-blue-500 bg-blue-100" },
  { name: "Œufs & Volaille", icon: Leaf, color: "text-yellow-600 bg-yellow-100" },
  { name: "Miel & Apiculture", icon: Leaf, color: "text-amber-500 bg-amber-100" },
  { name: "Céréales", icon: Leaf, color: "text-amber-700 bg-amber-100" },
]

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeatured() {
      try {
        // Fetch active products for the homepage
        const data = await getProducts({ is_active: true })
        const products = Array.isArray(data?.results) ? data.results : data
        // Take first 3 products
        setFeaturedProducts(products ? products.slice(0, 3) : [])
      } catch (error) {
        console.error("Error loading featured products", error)
      } finally {
        setLoading(false)
      }
    }
    loadFeatured()
  }, [])

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
      <Navbar />

      <main>
        {/* Hero Section with Glassmorphism */}
        {/* Hero Section with Glassmorphism & Animations */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Detailed Background decoration */}
          <div className="absolute top-0 inset-x-0 h-[600px] bg-linear-to-b from-emerald-50/80 to-transparent -z-20" />

          {/* Animated Blobs */}
          <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute top-48 -left-20 w-[500px] h-[500px] bg-emerald-300/10 rounded-full blur-[80px] -z-10 animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />

          {/* Floating Leaves Effect (CSS only for perf) */}
          <div className="absolute top-20 right-[10%] opacity-20 hidden lg:block animate-bounce" style={{ animationDuration: '3s' }}>
            <Leaf className="w-12 h-12 text-emerald-600 rotate-12" />
          </div>
          <div className="absolute bottom-20 left-[5%] opacity-10 hidden lg:block animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
            <Leaf className="w-16 h-16 text-emerald-800 -rotate-12" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-in slide-in-from-left duration-1000 fill-mode-both">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-emerald-100 shadow-sm backdrop-blur-md">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-bold text-emerald-800 tracking-wide uppercase">Marché 100% Local & Bio</span>
                </div>

                <h1 className="text-5xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight">
                  Du producteur <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-600 via-primary to-emerald-400">
                    directement
                  </span>{" "}
                  à votre assiette.
                </h1>

                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium">
                  Soutenez l'agriculture locale. Commandez des produits frais, de saison, cultivés avec passion par vos voisins.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Link href="/products">
                    <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-primary hover:bg-emerald-600 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all hover:-translate-y-1 hover:scale-105 active:scale-95 duration-300 w-full sm:w-auto">
                      Commencer mes courses
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/sellers">
                    <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-2 border-primary/10 text-foreground hover:bg-white hover:border-primary/30 transition-all w-full sm:w-auto">
                      Voir les producteurs
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center gap-6 pt-6 text-sm text-foreground/80 font-medium border-t border-emerald-100/50">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 bg-linear-to-br from-gray-100 to-gray-200 shadow-sm">
                        <Users className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                  <p>Rejoignez <span className="font-bold text-emerald-700">2,000+</span> acheteurs heureux</p>
                </div>
              </div>

              {/* Stats / Visual Right Side (Abstract composition) */}
              {/* Stats / Visual Right Side (Image Only + Dance Animation) */}
              <div className="relative hidden lg:block animate-in slide-in-from-right duration-1000 delay-200 fill-mode-both">
                <div className="relative z-10">
                  {/* Floating Main Image */}
                  <div className="relative w-full aspect-[4/5] max-w-[500px] mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl ring-1 ring-gray-900/5 group animate-float">
                    <img
                      src="/fresh-vegetables-and-local-produce-market.jpg"
                      alt="Marché local produits frais"
                      className="object-cover w-full h-full transform scale-105 group-hover:scale-110 transition duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>


        {/* Categories Section */}
        < section className="py-20 bg-background/50" >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-3">Parcourir par catégories</h2>
              <p className="text-muted-foreground">Trouvez exactement ce dont vous avez besoin</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {CATEGORIES.map((cat, idx) => (
                <Link key={idx} href={`/products?category=${cat.name}`} className="group">
                  <div className="flex flex-col items-center p-6 bg-card hover:bg-white rounded-2xl border border-border/50 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 transform hover:-translate-y-1 h-full">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${cat.color} bg-opacity-20 group-hover:bg-opacity-30 transition`}>
                      <cat.icon className="w-7 h-7" />
                    </div>
                    <span className="font-semibold text-foreground group-hover:text-primary transition">{cat.name}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section >

        {/* Featured Products Section */}
        < section className="py-24 bg-gradient-to-b from-white to-emerald-50/50" >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Produits de saison</h2>
                <p className="text-muted-foreground text-sm">Les meilleures offres du moment</p>
              </div>
              <Link href="/products">
                <Button variant="ghost" className="hidden md:flex text-primary hover:text-primary/80 hover:bg-primary/5">
                  Tout voir <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-96 bg-gray-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      old_price: product.old_price,
                      unit: product.unit,
                      image: product.image,
                      category: product.category,
                      seller: product.owner_name || "Vendeur",
                      isFavorite: product.is_favorite,
                      fresh: true,
                      stock: product.stock
                    }}
                    onToggleFavorite={(e) => {
                      e.preventDefault()
                      /* Add toggle logic if needed or just redirect */
                    }}
                    onAddToCart={(e) => {
                      e.preventDefault()
                      showToast("success", "Ajouté", "Produit ajouté au panier")
                    }}
                  />
                ))}
              </div>
            )}

            <div className="mt-12 text-center md:hidden">
              <Link href="/products">
                <Button variant="outline" className="w-full border-primary/20 text-primary">
                  Voir tous les produits
                </Button>
              </Link>
            </div>
          </div>
        </section >

        {/* Features / Benefits */}
        < section className="py-24" >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: Leaf, title: "100% Bio & Frais", desc: "Produits cultivés sans pesticides, récoltés le matin même." },
                { icon: Truck, title: "Livraison Locale", desc: "Directement du champ à votre porte en moins de 24h." },
                { icon: Shield, title: "Paiement Sécurisé", desc: "Transactions protégées et support client 7j/7." }
              ].map((feature, idx) => (
                <div key={idx} className="p-8 rounded-3xl bg-card border border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section >

        {/* Footer CTA */}
        < section className="py-24 relative overflow-hidden" >
          <div className="absolute inset-0 bg-primary/90 -z-10" />
          <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 -z-10" />

          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Vous êtes producteur ?</h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Rejoignez plus de 500 agriculteurs qui développent leur activité avec D-Agri Market. Pas de frais cachés, juste de la croissance.
            </p>
            <Link href="/auth/seller-signup">
              <Button size="lg" className="h-14 px-8 bg-white text-primary hover:bg-gray-100 font-bold text-lg rounded-full shadow-2xl transition hover:-translate-y-1">
                Créer ma boutique gratuitement
              </Button>
            </Link>
          </div>
        </section >

      </main >
    </div >
  )
}
