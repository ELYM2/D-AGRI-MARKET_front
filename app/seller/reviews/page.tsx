"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, MessageCircle, Star, Reply, CheckCircle2, User, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSellerReviews, replyToReview } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"

export default function SellerReviewsPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [reviews, setReviews] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [replyingTo, setReplyingTo] = useState<number | null>(null)
    const [replyText, setReplyText] = useState("")
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {
        loadReviews()
    }, [])

    const loadReviews = async () => {
        try {
            setLoading(true)
            const data = await getSellerReviews()
            setReviews(Array.isArray(data) ? data : data.results || [])
        } catch (error) {
            console.error("Error loading reviews:", error)
            showToast("error", "Erreur", "Impossible de charger les avis")
        } finally {
            setLoading(false)
        }
    }

    const handleReplySubmit = async (reviewId: number) => {
        if (!replyText.trim()) return

        try {
            setSubmitting(true)
            const updatedReview = await replyToReview(reviewId, replyText)

            setReviews(prev => prev.map(r => r.id === reviewId ? updatedReview : r))
            showToast("success", "Réponse envoyée", "Votre réponse a été publiée")
            setReplyingTo(null)
            setReplyText("")
        } catch (error: any) {
            showToast("error", "Erreur", error.message || "Echec de l'envoi")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? "block" : "hidden"} md:block w-64 bg-card border-r border-border`}>
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <span className="font-bold text-foreground">D-AGRI MARKET</span>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    <Link href="/seller" className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg">
                        Dashboard
                    </Link>
                    <Link href="/seller/messages" className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg">
                        <Inbox className="w-5 h-5" />
                        Messages
                    </Link>
                    <Link href="/seller/reviews" className="flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">
                        <MessageCircle className="w-5 h-5" />
                        Avis Clients
                    </Link>
                    <Link href="/seller/orders" className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg">
                        Commandes
                    </Link>
                    <Link href="/seller/settings" className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg">
                        Paramètres
                    </Link>
                </nav>
            </aside>

            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="md:hidden">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h1 className="text-2xl font-bold text-foreground">Avis Clients</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="bg-accent/10 px-3 py-1 rounded-full text-accent text-sm font-medium flex items-center gap-1">
                            <Star className="w-4 h-4 fill-current" />
                            {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : "0.0"} / 5.0
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-6 space-y-6">
                    {loading ? (
                        <div className="text-center py-10">Chargement...</div>
                    ) : reviews.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Aucun avis reçu pour le moment</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 max-w-4xl mx-auto">
                            {reviews.map((review) => (
                                <div key={review.id} className="bg-card border border-border rounded-lg p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                                                <User className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-foreground">{review.user_name || "Client"}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Sur <span className="font-medium text-foreground">{review.product_name}</span> • {new Date(review.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-accent text-accent" : "text-muted"}`} />
                                            ))}
                                        </div>
                                    </div>

                                    <p className="text-foreground mb-6 bg-muted/30 p-4 rounded-md italic">"{review.comment}"</p>

                                    {review.response ? (
                                        <div className="ml-4 pl-4 border-l-2 border-primary">
                                            <p className="text-xs font-bold text-primary mb-1 flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Votre réponse
                                            </p>
                                            <p className="text-sm text-foreground">{review.response}</p>
                                            <p className="text-xs text-muted-foreground mt-1">{new Date(review.response_at).toLocaleDateString()}</p>
                                        </div>
                                    ) : (
                                        <div>
                                            {replyingTo === review.id ? (
                                                <div className="space-y-3 animation-in fade-in slide-in-from-top-2 duration-200">
                                                    <textarea
                                                        className="w-full p-3 bg-background border border-border rounded-md outline-none focus:border-primary min-h-[80px]"
                                                        placeholder="Remerciez le client ou répondez à ses questions..."
                                                        value={replyText}
                                                        onChange={e => setReplyText(e.target.value)}
                                                        autoFocus
                                                    />
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>Annuler</Button>
                                                        <Button size="sm" onClick={() => handleReplySubmit(review.id)} disabled={submitting}>
                                                            Publier
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <Button variant="outline" size="sm" onClick={() => { setReplyingTo(review.id); setReplyText("") }}>
                                                    <Reply className="w-4 h-4 mr-2" />
                                                    Répondre
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
