"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, Send, Inbox, Trash2, Leaf, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMessages, sendMessage, markMessageAsRead } from "@/lib/api"
import { showToast } from "@/components/toast-notification"

export default function MessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<any>(null)
  const [inbox, setInbox] = useState<"inbox" | "sent">("inbox")
  const [replySubject, setReplySubject] = useState("")
  const [replyBody, setReplyBody] = useState("")
  const [sending, setSending] = useState(false)

  useEffect(() => {
    loadMessages()
    // reset selection when switching boxes
    setSelectedMessage(null)
    setReplySubject("")
    setReplyBody("")
  }, [inbox])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await getMessages(inbox)
      setMessages(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      console.error("Error loading messages:", error)
      setMessages([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectMessage = async (message: any) => {
    setSelectedMessage(message)
    setReplySubject(message.subject?.startsWith("Re:") ? message.subject : `Re: ${message.subject || ""}`)
    setReplyBody("")
    if (!message.is_read && inbox === "inbox") {
      try {
        await markMessageAsRead(message.id)
        await loadMessages()
      } catch (error) {
        console.error("Error marking message as read:", error)
      }
    }
  }

  const handleSendReply = async () => {
    if (!selectedMessage) return
    if (!replySubject.trim() || !replyBody.trim()) {
      showToast("error", "Champs requis", "Sujet et message sont nécessaires")
      return
    }

    try {
      setSending(true)
      await sendMessage({
        receiver: inbox === "inbox" ? selectedMessage.sender : selectedMessage.receiver,
        subject: replySubject.trim(),
        body: replyBody.trim(),
      })
      showToast("success", "Message envoyé", "Votre réponse a été envoyée")
      setReplyBody("")
      loadMessages()
    } catch (error: any) {
      console.error("Error sending message:", error)
      showToast("error", "Erreur", error?.message || "Impossible d'envoyer le message")
    } finally {
      setSending(false)
    }
  }

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
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Messages</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Messages List */}
          <div className="lg:col-span-1 bg-card rounded-lg border border-border">
            <div className="p-4 border-b border-border">
              <div className="flex gap-2">
                <Button
                  variant={inbox === "inbox" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setInbox("inbox")}
                  className="flex-1"
                >
                  <Inbox className="w-4 h-4 mr-2" />
                  Reçus
                </Button>
                <Button
                  variant={inbox === "sent" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setInbox("sent")}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Envoyés
                </Button>
              </div>
            </div>

            <div className="divide-y divide-border max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="p-8 text-center">
                  <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-muted-foreground">Aucun message</p>
                </div>
              ) : (
                messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => handleSelectMessage(message)}
                    className={`w-full p-4 text-left hover:bg-muted/50 transition ${selectedMessage?.id === message.id ? "bg-muted" : ""
                      } ${!message.is_read && inbox === "inbox" ? "font-semibold" : ""}`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {inbox === "inbox" ? message.sender_name : message.receiver_name}
                      </p>
                      {!message.is_read && inbox === "inbox" && (
                        <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1"></div>
                      )}
                    </div>
                    <p className="text-sm text-foreground truncate mb-1">{message.subject}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleDateString()}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="lg:col-span-2 bg-card rounded-lg border border-border p-6 space-y-6">
            {selectedMessage ? (
              <div className="space-y-6">
                <div className="mb-6 pb-6 border-b border-border">
                  <h2 className="text-xl font-bold text-foreground mb-2">{selectedMessage.subject}</h2>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <p>
                      De: <span className="font-medium text-foreground">{selectedMessage.sender_name}</span>
                    </p>
                    <p>{new Date(selectedMessage.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="text-foreground whitespace-pre-wrap">{selectedMessage.body}</p>
                </div>
                <div className="border-t border-border pt-6 space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Répondre</h3>
                  <input
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md outline-none text-foreground"
                    placeholder="Sujet"
                  />
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-input border border-border rounded-md outline-none text-foreground resize-none"
                    placeholder="Votre réponse..."
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleSendReply} disabled={sending}>
                      <Send className="w-4 h-4 mr-2" />
                      {sending ? "Envoi..." : "Envoyer"}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full min-h-[400px]">
                <div className="text-center">
                  <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">Sélectionnez un message pour le lire</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
