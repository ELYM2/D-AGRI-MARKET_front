"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Leaf, ShoppingBag, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthStatus from "@/components/auth-status"
import { getMessages } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function Navbar() {
    const { me } = useAuth()
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        if (me) {
            loadUnreadCount()
            // Refresh every 30 seconds
            const interval = setInterval(loadUnreadCount, 30000)
            return () => clearInterval(interval)
        }
    }, [me])

    const loadUnreadCount = async () => {
        try {
            const data = await getMessages("received")
            const messages = Array.isArray(data) ? data : data.results || []
            const unread = messages.filter((msg: any) => !msg.is_read).length
            setUnreadCount(unread)
        } catch (error) {
            console.error("Error loading unread messages:", error)
        }
    }

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
                </div>

                <div className="flex items-center gap-4">
                    {me && (
                        <Link href="/messages">
                            <Button variant="ghost" size="icon" className="relative">
                                <Mail className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                    )}
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
