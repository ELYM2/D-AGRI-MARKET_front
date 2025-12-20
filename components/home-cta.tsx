"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import SellerCTA from "@/components/seller-cta"
import { useAuth } from "@/hooks/use-auth"

export default function HomeCTA() {
  const { me } = useAuth()
  const title = me ? "Bienvenue de retour !" : "Pret a demarrer ?"
  const description = me
    ? "Continuez vos achats, suivez vos commandes et retrouvez vos favoris depuis votre espace personnel."
    : "Que vous soyez acheteur ou vendeur, rejoignez notre communaute de commerce local durable."

  return (
    <>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">{title}</h2>
      <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto text-center">{description}</p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-center">
        {me ? (
          <>
            <Link href="/account">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
                Acceder a mon espace
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Explorer les produits
              </Button>
            </Link>
          </>
        ) : (
          <Link href="/auth/signup">
            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90">
              Creer un compte acheteur
            </Button>
          </Link>
        )}
      </div>

      <div className="flex justify-center pt-6">
        <SellerCTA />
      </div>
    </>
  )
}
