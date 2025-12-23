"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Leaf, ShoppingBag, Mail, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthStatus from "@/components/auth-status"
import { getMessages, getNotifications } from "@/lib/api"
import { useAuth } from "@/hooks/use-auth"

export default function Navbar() {
    const { me } = useAuth()
    const [unreadCount, setUnreadCount] = useState(0)
    const [unreadNotifsCount, setUnreadNotifsCount] = useState(0)

    useEffect(() => {
        if (me) {
            loadUnreadCounts()
            // Refresh every 30 seconds
            const interval = setInterval(loadUnreadCounts, 30000)
            return () => clearInterval(interval)
        }
    }, [me])

    const loadUnreadCounts = async () => {
        try {
            // Load messages
            const msgData = await getMessages("received")
            const messages = Array.isArray(msgData) ? msgData : msgData.results || []
            const unreadMsg = messages.filter((msg: any) => !msg.is_read).length
            setUnreadCount(unreadMsg)

            // Load notifications
            const notifData = await getNotifications()
            const notifications = Array.isArray(notifData) ? notifData : notifData.results || []
            const unreadNotifs = notifications.filter((n: any) => !n.is_read).length
            setUnreadNotifsCount(unreadNotifs)
        } catch (error) {
            console.error("Error loading unread counts:", error)
        }
    }

    return (
        <header className="sticky top-0 z-50 glass">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Leaf className="w-6 h-6 text-primary" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-700">
                            D-AGRI MARKET
                        </span>
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/products" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Produits
                    </Link>
                    <Link href="/sellers" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Producteurs
                    </Link>
                    <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        À propos
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {me && (
                        <>
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

                            <Link href="/notifications">
                                <Button variant="ghost" size="icon" className="relative">
                                    <Bell className="w-5 h-5" />
                                    {unreadNotifsCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                            {unreadNotifsCount > 9 ? '9+' : unreadNotifsCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </>
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
