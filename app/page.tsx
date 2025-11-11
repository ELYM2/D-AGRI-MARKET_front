import Link from "next/link"
import { Search, MapPin, ShoppingBag, Users, Leaf, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LocalMarket</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm text-foreground hover:text-primary transition">
              Produits
            </Link>
            <Link href="/sellers" className="text-sm text-foreground hover:text-primary transition">
              Producteurs
            </Link>
            <Link href="/about" className="text-sm text-foreground hover:text-primary transition">
              À propos
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="text-foreground">
                Connexion
              </Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Inscription
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 md:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <Leaf className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-primary">Achat local & durable</span>
                </div>

                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                  Connectez-vous directement aux producteurs locaux
                </h1>

                <p className="text-lg text-muted-foreground max-w-md">
                  Découvrez les meilleurs produits frais de votre région. Supportez les producteurs locaux et recevez
                  des produits de qualité directement à votre porte.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link href="/products">
                    <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                      Explorer les produits
                    </Button>
                  </Link>
                  <Link href="/auth/seller-signup">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                      Devenir vendeur
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="relative h-96 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/10 flex items-center justify-center">
                <img
                  src="/fresh-vegetables-and-local-produce-market.jpg"
                  alt="Produits frais locaux"
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 md:py-16 border-b border-border">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Trouvez ce que vous cherchez</h2>

            <div className="flex flex-col md:flex-row gap-3 bg-card p-2 rounded-lg border border-border">
              <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-input rounded-md">
                <Search className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="flex items-center gap-2 px-4 py-2 bg-input rounded-md">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Votre localisation"
                  className="w-full bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <Button className="bg-primary hover:bg-primary/90 px-8">Chercher</Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Pourquoi LocalMarket ?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Une plateforme dédiée à la vente directe entre producteurs et consommateurs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Users,
                  title: "Connexion Directe",
                  description: "Achetez directement auprès des producteurs, sans intermédiaire",
                },
                {
                  icon: TrendingUp,
                  title: "Produits Frais",
                  description: "Des produits récoltés le jour même pour une qualité maximale",
                },
                {
                  icon: ShoppingBag,
                  title: "Commerce Simple",
                  description: "Commandez en ligne et recevez vos produits rapidement",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-card p-8 rounded-xl border border-border hover:border-primary/20 transition group"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary/5 border-t border-b border-border">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Prêt à démarrer ?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Que vous soyez acheteur ou vendeur, rejoignez notre communauté de commerce local durable.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Créer un compte acheteur
                </Button>
              </Link>
              <Link href="/auth/seller-signup">
                <Button size="lg" variant="outline">
                  Devenir producteur
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold text-foreground">LocalMarket</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Plateforme de commerce local pour producteurs et consommateurs.
              </p>
            </div>

            {[
              {
                title: "Produits",
                links: ["Catégories", "Recherche", "Promotions"],
              },
              {
                title: "Vendeurs",
                links: ["Devenir vendeur", "Documentation", "Support"],
              },
              {
                title: "Entreprise",
                links: ["À propos", "Blog", "Contact"],
              },
            ].map((column, index) => (
              <div key={index}>
                <h4 className="font-semibold text-foreground mb-4">{column.title}</h4>
                <ul className="space-y-2">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-sm text-muted-foreground hover:text-primary transition">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2025 LocalMarket. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition">
                Politique de confidentialité
              </a>
              <a href="#" className="hover:text-primary transition">
                Conditions d&apos;utilisation
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
