"use client"

import Link from "next/link"
import { Leaf, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthStatus from "@/components/auth-status"
import { useAuth } from "@/hooks/use-auth"

export default function Navbar() {
    const { me } = useAuth()

    return (
        <header className="sticky top-0 z-50 bg-card border-b border-border">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                            <Leaf className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="text-xl font-bold text-foreground">D-AGRI MARKET</span>
                    </Link>
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
                    {me && (
                        <Link href="/favorites" className="text-sm text-foreground hover:text-primary transition">
                            Favoris
                        </Link>
                    )}
                    {me && !me.is_seller && (
                        <Link href="/auth/seller-signup" className="text-sm font-medium text-primary hover:text-primary/80 transition">
                            Devenir Vendeur
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/cart">
                        <Button variant="ghost" size="icon" className="relative">
                            <ShoppingBag className="w-5 h-5" />
                            {/* Note: Cart badge logic would go here if we had a global cart context */}
                        </Button>
                    </Link>
                    <AuthStatus />
                </div>
            </nav>
        </header>
    )
}
