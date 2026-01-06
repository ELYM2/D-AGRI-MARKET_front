"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Inbox, Send, RefreshCw, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMessages, sendMessage, markMessageAsRead } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"

export default function SellerMessagesPage() {
    const { me } = useAuth()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<"inbox" | "sent">("inbox")
    const [messages, setMessages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [replyBody, setReplyBody] = useState("")
    const [sendingReply, setSendingReply] = useState(false)
    const [selectedMessage, setSelectedMessage] = useState<any | null>(null)

    useEffect(() => {
        loadMessages()
    }, [activeTab])

    const loadMessages = async () => {
        try {
            setLoading(true)
            // activeTab maps to 'received' (inbox) or 'sent'
            const data = await getMessages(activeTab)
            setMessages(Array.isArray(data) ? data : data.results || [])
            setSelectedMessage(null) // Close selection on tab switch
        } catch (error) {
            console.error("Error loading messages:", error)
            showToast("error", "Erreur", "Impossible de charger les messages")
        } finally {
            setLoading(false)
        }
    }

    const handleSelectMessage = async (msg: any) => {
        if (selectedMessage?.id === msg.id) {
            setSelectedMessage(null)
            return
        }

        setSelectedMessage(msg)
        // Mark as read if it's in inbox and not read
        if (activeTab === "inbox" && !msg.is_read) {
            try {
                await markMessageAsRead(msg.id)
                // Update local state to reflect read status
                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
            } catch (e) {
                console.error(e)
            }
        }
    }

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!replyBody.trim() || !selectedMessage) return

        try {
            setSendingReply(true)
            // Receiver is the SENDER of the original message
            await sendMessage({
                receiver: selectedMessage.sender,
                subject: `Re: ${selectedMessage.subject}`,
                body: replyBody
            })
            showToast("success", "Message envoyé", "Votre réponse a été envoyée")
            setReplyBody("")
            // Optionally switch to sent items or just close
            setSelectedMessage(null)
        } catch (error: any) {
            showToast("error", "Erreur", error.message || "Echec de l'envoi")
        } finally {
            setSendingReply(false)
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
                    <Link href="/seller/messages" className="flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">
                        <Inbox className="w-5 h-5" />
                        Messages
                    </Link>
                    <Link href="/seller/reviews" className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg">
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
                        <h1 className="text-2xl font-bold text-foreground">Messagerie</h1>
                    </div>
                    <Button variant="ghost" size="icon" onClick={loadMessages}>
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                </header>

                <main className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* List */}
                    <div className={`flex-1 overflow-y-auto p-4 border-r border-border ${selectedMessage ? 'hidden md:block' : 'block'}`}>
                        <div className="flex gap-2 mb-4">
                            <Button
                                variant={activeTab === "inbox" ? "default" : "outline"}
                                onClick={() => setActiveTab("inbox")}
                                className="flex-1"
                            >
                                <Inbox className="w-4 h-4 mr-2" />
                                Reçus
                            </Button>
                            <Button
                                variant={activeTab === "sent" ? "default" : "outline"}
                                onClick={() => setActiveTab("sent")}
                                className="flex-1"
                            >
                                <Send className="w-4 h-4 mr-2" />
                                Envoyés
                            </Button>
                        </div>

                        {loading && messages.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">Chargement...</div>
                        ) : messages.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">Aucun message</div>
                        ) : (
                            <div className="space-y-2">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => handleSelectMessage(msg)}
                                        className={`p-4 rounded-lg border cursor-pointer transition hover:bg-muted/50 ${selectedMessage?.id === msg.id ? "bg-muted border-primary" : "bg-card border-border"} ${!msg.is_read && activeTab === 'inbox' ? "border-l-4 border-l-primary" : ""}`}
                                    >
                                        <div className="flex justify-between mb-1">
                                            <span className="font-bold text-foreground truncate">
                                                {activeTab === 'inbox' ? (msg.sender_name || 'Utilisateur') : (msg.receiver_name || 'Destinataire')}
                                            </span>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                {new Date(msg.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h4 className="text-sm font-medium text-foreground mb-1 truncate">{msg.subject}</h4>
                                        <p className="text-xs text-muted-foreground truncate">{msg.body}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detail */}
                    <div className={`flex-[2] bg-muted/10 flex flex-col ${selectedMessage ? 'block fixed inset-0 z-50 bg-background md:static md:block' : 'hidden md:flex items-center justify-center'}`}>
                        {selectedMessage ? (
                            <>
                                <div className="p-4 border-b border-border flex items-center gap-3 bg-card">
                                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSelectedMessage(null)}>
                                        <X className="w-5 h-5" />
                                    </Button>
                                    <div>
                                        <h2 className="font-bold text-lg">{selectedMessage.subject}</h2>
                                        <p className="text-sm text-muted-foreground">
                                            {activeTab === 'inbox' ? `De: ${selectedMessage.sender_name}` : `À: ${selectedMessage.receiver_name}`} • {new Date(selectedMessage.created_at).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-6 text-foreground space-y-4">
                                    <div className="bg-card p-6 rounded-lg border border-border whitespace-pre-wrap">
                                        {selectedMessage.body}
                                    </div>

                                    {activeTab === 'inbox' && (
                                        <div className="bg-card p-4 rounded-lg border border-border mt-4">
                                            <h3 className="font-medium mb-2">Répondre</h3>
                                            <form onSubmit={handleReply}>
                                                <textarea
                                                    className="w-full p-3 bg-muted rounded-md border border-border outline-none focus:border-primary min-h-[100px]"
                                                    placeholder="Écrivez votre réponse..."
                                                    value={replyBody}
                                                    onChange={e => setReplyBody(e.target.value)}
                                                />
                                                <div className="flex justify-end mt-2">
                                                    <Button type="submit" disabled={sendingReply || !replyBody.trim()}>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Envoyer
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center text-muted-foreground p-6">
                                <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-20" />
                                <p>Sélectionnez un message pour le lire</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    )
}
