"use client"

import Link from "next/link"
import { MapPin, Phone, Mail, Globe, Star, Package, Users, Clock, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

const SELLER_DETAILS = {
  id: 1,
  name: "Ferme du soleil",
  category: "Légumes biologiques",
  rating: 4.8,
  reviews: 245,
  distance: 2.3,
  image: "/organic-farm-hero.jpg",
  logo: "/farm-logo.jpg",
  description: "Ferme bio certifiée depuis 2010, produisant des légumes frais de saison en agriculture durable.",
  products: 18,
  customers: 1250,
  joinedDate: "2010",
  phone: "+33 6 12 34 56 78",
  email: "contact@fermedusoleil.fr",
  website: "www.fermedusoleil.fr",
  address: "123 Chemin de la Ferme, 75000 Paris",
  hours: "Lun-Sam: 8h-19h, Dim: 9h-13h",
  certifications: ["Agriculture biologique", "Certification bio européenne", "Commerce équitable"],
  highlights: [
    { icon: Package, label: "Produits frais", value: "18 produits" },
    { icon: Users, label: "Clients satisfaits", value: "1250+" },
    { icon: Star, label: "Évaluation", value: "4.8/5" },
    { icon: Clock, label: "Livraison", value: "24-48h" },
  ],
}

const FEATURED_PRODUCTS = [
  { id: 1, name: "Tomates biologiques", price: 4.5, image: "/ripe-tomatoes.png" },
  { id: 2, name: "Laitue biologique", price: 2.8, image: "/fresh-lettuce.png" },
  { id: 3, name: "Carottes fraiches", price: 3.2, image: "/bunch-of-carrots.png" },
]

const REVIEWS = [
  {
    author: "Marie L.",
    rating: 5,
    text: "Produits très frais et de bonne qualité. Excellent service.",
    date: "2025-01-15",
  },
  { author: "Jean P.", rating: 4, text: "Très satisfait, livraison rapide", date: "2025-01-14" },
  { author: "Sophie M.", rating: 5, text: "Meilleur goût que les supermarchés. À recommander !", date: "2025-01-13" },
]

export default function SellerProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LocalMarket</span>
          </Link>

          <Link href="/sellers">
            <Button variant="outline" size="sm">
              Tous les producteurs
            </Button>
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        <div className="relative -mx-4 sm:mx-0">
          <img
            src={SELLER_DETAILS.image || "/placeholder.svg"}
            alt={SELLER_DETAILS.name}
            className="w-full h-64 object-cover rounded-lg"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background to-transparent h-32 rounded-lg" />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 rounded-lg bg-card border-4 border-background -mt-16 overflow-hidden flex-shrink-0">
                <img
                  src={SELLER_DETAILS.logo || "/placeholder.svg"}
                  alt={SELLER_DETAILS.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-foreground">{SELLER_DETAILS.name}</h1>
                <p className="text-muted-foreground">{SELLER_DETAILS.category}</p>

                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-accent text-accent" />
                    <span className="font-bold text-foreground">{SELLER_DETAILS.rating}</span>
                    <span className="text-sm text-muted-foreground">({SELLER_DETAILS.reviews} avis)</span>
                  </div>

                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {SELLER_DETAILS.distance} km
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">À propos</h2>
              <p className="text-foreground leading-relaxed">{SELLER_DETAILS.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {SELLER_DETAILS.highlights.map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.label} className="bg-card p-4 rounded-lg border border-border text-center">
                      <Icon className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                      <p className="font-bold text-foreground mt-1">{item.value}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Produits vedettes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {FEATURED_PRODUCTS.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition"
                  >
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground">{product.name}</h3>
                      <p className="text-lg font-bold text-primary mt-2">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href={`/products?seller=${SELLER_DETAILS.id}`}>
                <Button className="w-full mt-4 bg-primary hover:bg-primary/90">Voir tous les produits</Button>
              </Link>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Avis des clients</h2>
              <div className="space-y-4">
                {REVIEWS.map((review, idx) => (
                  <div key={idx} className="bg-card p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">{review.author}</p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground">{review.text}</p>
                    <p className="text-xs text-muted-foreground mt-2">{review.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24 space-y-6">
              <h3 className="text-lg font-bold text-foreground">Informations</h3>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Adresse</p>
                    <p className="text-sm font-medium text-foreground">{SELLER_DETAILS.address}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Clock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Horaires</p>
                    <p className="text-sm font-medium text-foreground">{SELLER_DETAILS.hours}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Téléphone</p>
                    <a
                      href={`tel:${SELLER_DETAILS.phone}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {SELLER_DETAILS.phone}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${SELLER_DETAILS.email}`}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {SELLER_DETAILS.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-xs text-muted-foreground">Site web</p>
                    <a
                      href={`https://${SELLER_DETAILS.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {SELLER_DETAILS.website}
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6 space-y-3">
                <h4 className="font-semibold text-foreground text-sm">Certifications</h4>
                {SELLER_DETAILS.certifications.map((cert) => (
                  <div key={cert} className="flex items-center gap-2 text-sm text-foreground">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    {cert}
                  </div>
                ))}
              </div>

              <Link href="/messages">
                <Button className="w-full bg-primary hover:bg-primary/90">Contacter le producteur</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
