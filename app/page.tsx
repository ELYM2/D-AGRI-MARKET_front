"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
    Leaf,
    ShoppingBag,
    Truck,
    Shield,
    ChevronRight,
    Star,
    ArrowRight,
    TrendingUp,
    Award,
    MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import { ProductCard } from "@/components/product-card"
import { getProducts, getCategories } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/map"), { ssr: false })

// Category Data
const CATEGORIES: { name: string; icon: any; color: string }[] = [
    { name: "Légumes", icon: Leaf, color: "bg-emerald-100 text-emerald-600" },
    { name: "Fruits", icon: Star, color: "bg-orange-100 text-orange-600" },
    { name: "Céréales", icon: TrendingUp, color: "bg-amber-100 text-amber-600" },
    { name: "Élevage", icon: Award, color: "bg-blue-100 text-blue-600" },
]

export default function Home() {
    const { me } = useAuth()
    const [featuredProducts, setFeaturedProducts] = useState<any[]>([])
    const [mapProducts, setMapProducts] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch active products and categories
                const [productsData, categoriesData] = await Promise.all([
                    getProducts({ is_active: true }),
                    getCategories()
                ])

                const products = Array.isArray(productsData?.results) ? productsData.results : productsData
                const resolvedCategories = Array.isArray(categoriesData?.results) ? categoriesData.results : categoriesData
                setCategories(resolvedCategories || [])

                // Featured: First 3
                setFeaturedProducts(products ? products.slice(0, 3) : [])

                // Map: All active products
                setMapProducts(products || [])
            } catch (error) {
                console.error("Error loading homepage data", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [])

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative pt-24 pb-32 overflow-hidden">
                    {/* Animated Background Elements */}
                    <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_50%,rgba(16,185,129,0.08)_0%,transparent_100%)]" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 bg-[url('/pattern.png')] opacity-[0.03]" />

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-12 items-center">
                            {/* Text Content - Left */}
                            <div className="max-w-2xl text-left">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                                    </span>
                                    Le Marché des Producteurs Locaux
                                </span>

                                <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-8 tracking-tight leading-[1.1]">
                                    Mangez Frais, <br />
                                    <span className="text-primary italic font-serif">Soutenez Local.</span>
                                </h1>

                                <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                                    D-Agri Market connecte directement les agriculteurs de votre région avec votre table.
                                    Une alimentation plus saine, un avenir plus durable.
                                </p>

                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <Link href="/products">
                                        <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-white font-bold text-lg rounded-full shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all">
                                            Commencer mes achats
                                            <ArrowRight className="ml-2 w-5 h-5" />
                                        </Button>
                                    </Link>
                                    <Link href="/become-seller">
                                        <Button size="lg" variant="outline" className="h-14 px-8 border-primary/20 text-primary hover:bg-primary/5 font-bold text-lg rounded-full">
                                            Je suis producteur
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Floating Hero Image - Right */}
                            <div className="relative w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/20 animate-float">
                                <img
                                    src="/fresh-vegetables-and-local-produce-market.jpg"
                                    alt="Marché D-Agri"
                                    className="w-full h-full object-cover scale-105 hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section className="py-20 bg-card/50 border-y border-border/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                            {categories.map((cat, idx) => (
                                <Link key={idx} href={`/products?category=${cat.id}`} className="group p-6 rounded-3xl bg-background border border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all text-center">
                                    <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                        <Leaf className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold text-base text-foreground line-clamp-1">{cat.name}</h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Featured Products */}
                <section className="py-24">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-bold text-foreground mb-4 tracking-tight">Ventes Vedettes</h2>
                                <div className="h-1.5 w-20 bg-primary/20 rounded-full" />
                            </div>
                            <Link href="/products" className="text-primary font-bold flex items-center hover:translate-x-1 transition-transform">
                                Voir tout <ChevronRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-96 rounded-3xl bg-muted animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {featuredProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onAddToCart={(e) => {
                                            e.preventDefault()
                                            showToast("success", "Ajouté", "Produit ajouté au panier")
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Producers Map Section */}
                <section className="py-20 bg-emerald-50/50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-foreground mb-4">Producteurs autour de vous</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto italic font-medium">Découvrez les fermes et vendeurs à proximité et consommez local.</p>
                        </div>

                        <Map products={mapProducts} />
                    </div>
                </section>

                {/* Features / Benefits */}
                <section className="py-24">
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
                </section>

                {/* Footer CTA */}
                {(!me || !me.is_seller) && (
                    <section className="py-20 px-4 mb-20">
                        <div className="max-w-6xl mx-auto relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary to-emerald-700 shadow-2xl shadow-primary/20">
                            {/* Decorative bubbles */}
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl text-white" />
                            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-400/20 rounded-full blur-2xl" />

                            <div className="relative px-6 py-16 md:py-24 text-center max-w-3xl mx-auto">
                                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                    Vous êtes producteur ?
                                </h2>
                                <p className="text-lg md:text-xl text-white/90 mb-10 leading-relaxed font-medium">
                                    Rejoignez plus de 500 agriculteurs qui développent leur activité avec D-Agri Market.
                                    <span className="block mt-2 text-white/80 text-base md:text-lg">Pas de frais cachés, juste de la croissance.</span>
                                </p>
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <Link href="/auth/seller-signup">
                                        <Button size="lg" className="h-14 px-10 bg-white text-primary hover:bg-white/90 font-bold text-lg rounded-full shadow-lg transition-all hover:scale-105 active:scale-95">
                                            Créer ma boutique gratuitement
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

            </main>
        </div>
    )
}
