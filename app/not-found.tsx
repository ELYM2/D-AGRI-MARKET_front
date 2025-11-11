"use client"

import Link from "next/link"
import { Leaf, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="text-6xl font-bold text-primary opacity-20">404</div>
        </div>

        <h1 className="text-4xl font-bold text-foreground">Page non trouvée</h1>

        <p className="text-lg text-muted-foreground">
          Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/">
            <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>

          <Link href="/products">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Search className="w-4 h-4 mr-2" />
              Parcourir les produits
            </Button>
          </Link>
        </div>

        <div className="pt-12">
          <div className="w-20 h-20 rounded-lg bg-primary flex items-center justify-center mx-auto opacity-50">
            <Leaf className="w-10 h-10 text-primary-foreground" />
          </div>
        </div>
      </div>
    </div>
  )
}
