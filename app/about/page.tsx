"use client"

import Link from "next/link"
import { Leaf, Users, Globe, TrendingUp, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

import Navbar from "@/components/navbar"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Hero */}
        <section className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-foreground">À propos de D-AGRI MARKET</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Nous connectons les producteurs locaux avec les consommateurs pour créer une économie plus juste et durable.
          </p>
        </section>

        {/* Mission */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">Notre mission</h2>
            <p className="text-foreground leading-relaxed">
              D-AGRI MARKET facilite le commerce direct entre les producteurs locaux et les consommateurs. Nous croyons
              que chacun devrait avoir accès à des produits frais, de qualité, en soutenant directement les agriculteurs
              de sa région.
            </p>

            <ul className="space-y-3 mt-6">
              {[
                "Produits frais directement du producteur",
                "Prix justes pour les agriculteurs",
                "Livraison rapide et écologique",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-foreground">
                  <Check className="w-5 h-5 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-lg border border-border p-8">
            <div className="space-y-4">
              {[
                { icon: Globe, label: "Portée", value: "50+ producteurs" },
                { icon: Users, label: "Communauté", value: "5000+ clients" },
                { icon: TrendingUp, label: "Croissance", value: "+40% / an" },
              ].map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.label} className="flex items-center gap-4 p-4 rounded-lg bg-muted">
                    <Icon className="w-8 h-8 text-primary flex-shrink-0" />
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-lg font-bold text-foreground">{stat.value}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-foreground text-center">Nos valeurs</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Qualité",
                description: "Des produits frais et de haute qualité, directement des producteurs locaux",
              },
              {
                title: "Durabilité",
                description: "Soutien de pratiques agricoles écologiques et durables",
              },
              {
                title: "Équité",
                description: "Prix justes pour les producteurs et tarifs accessibles pour les consommateurs",
              },
            ].map((value) => (
              <div key={value.title} className="bg-card p-8 rounded-lg border border-border">
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-foreground text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-12 space-y-6">
          <h2 className="text-3xl font-bold text-foreground">Prêt à découvrir ?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Rejoignez notre communauté de consommateurs et producteurs engagés.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/products">
              <Button className="bg-primary hover:bg-primary/90">Parcourir les produits</Button>
            </Link>
            <Link href="/become-seller">
              <Button variant="outline">Devenir producteur</Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
