"use client"

import Link from "next/link"
import { Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TermsPage() {
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

          <Link href="/">
            <Button variant="outline" size="sm">
              Retour
            </Button>
          </Link>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8 prose prose-invert max-w-none text-foreground">
          <h1 className="text-4xl font-bold">Conditions d'utilisation</h1>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">1. Acceptation des conditions</h2>
            <p className="text-muted-foreground leading-relaxed">
              En utilisant D-AGRI MARKET, vous acceptez ces conditions d'utilisation. Si vous n'acceptez pas ces termes,
              veuillez ne pas utiliser le service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">2. Utilisation du service</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vous acceptez d'utiliser D-AGRI MARKET uniquement à des fins légales et conformément aux lois applicables.
              Vous acceptez de ne pas utiliser le service pour :
            </p>
            <ul className="space-y-2 list-disc list-inside text-muted-foreground">
              <li>Transmettre du contenu nuisible ou illégal</li>
              <li>Déranger ou importuner d'autres utilisateurs</li>
              <li>Contourner les mesures de sécurité</li>
              <li>Effectuer des activités frauduleuses</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">3. Comptes utilisateur</h2>
            <p className="text-muted-foreground leading-relaxed">
              Vous êtes responsable de maintenir la confidentialité de vos identifiants de compte et de toutes les
              activités qui se produisent sous votre compte.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">4. Propriété intellectuelle</h2>
            <p className="text-muted-foreground leading-relaxed">
              Le contenu de D-AGRI MARKET, y compris les textes, images et logos, est la propriété de D-AGRI MARKET ou de
              ses fournisseurs de contenu.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">5. Limitation de responsabilité</h2>
            <p className="text-muted-foreground leading-relaxed">
              D-AGRI MARKET ne sera pas responsable des dommages indirects, accidentels ou consécutifs résultant de votre
              utilisation du service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">6. Modifications</h2>
            <p className="text-muted-foreground leading-relaxed">
              D-AGRI MARKET se réserve le droit de modifier ces conditions à tout moment. Les modifications prendront
              effet dès leur publication.
            </p>
          </section>

          <section className="bg-card border border-border rounded-lg p-6 mt-8">
            <p className="text-sm text-muted-foreground">Dernière mise à jour: Janvier 2025</p>
            <p className="text-sm text-muted-foreground mt-2">
              Pour toute question, veuillez nous contacter à{" "}
              <a href="mailto:contact@D-AGRI MARKET.fr" className="text-primary hover:underline">
                contact@D-AGRI MARKET.fr
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
