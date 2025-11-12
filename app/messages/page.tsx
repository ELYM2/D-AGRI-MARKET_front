"use client"

import { useState } from "react"
import Link from "next/link"
import { Send, Search, Leaf, Smile, Paperclip } from "lucide-react"
import { showToast } from "@/components/toast-notification"

interface Message {
  id: number
  sender: "user" | "other"
  text: string
  timestamp: string
  avatar?: string
}

interface Conversation {
  id: number
  name: string
  avatar: string
  lastMessage: string
  unread: boolean
  timestamp: string
}

const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    name: "Ferme du soleil",
    avatar: "/placeholder.svg?key=avatar1",
    lastMessage: "Les tomates sont disponibles demain",
    unread: true,
    timestamp: "14:30",
  },
  {
    id: 2,
    name: "Laiterie locale",
    avatar: "/placeholder.svg?key=avatar2",
    lastMessage: "Merci pour votre commande",
    unread: false,
    timestamp: "10:15",
  },
  {
    id: 3,
    name: "Potager bio",
    avatar: "/placeholder.svg?key=avatar3",
    lastMessage: "Nous avons une promotion cette semaine",
    unread: false,
    timestamp: "hier",
  },
]

const MOCK_MESSAGES: Message[] = [
  {
    id: 1,
    sender: "other",
    text: "Bonjour! Avez-vous des tomates disponibles?",
    timestamp: "09:00",
  },
  {
    id: 2,
    sender: "user",
    text: "Oui, nous avons de magnifiques tomates biologiques",
    timestamp: "09:15",
  },
  {
    id: 3,
    sender: "other",
    text: "Quel est le prix au kg?",
    timestamp: "09:30",
  },
  {
    id: 4,
    sender: "user",
    text: "Elles sont à 4.50€ le kg cette semaine",
    timestamp: "09:45",
  },
  {
    id: 5,
    sender: "other",
    text: "Les tomates sont disponibles demain",
    timestamp: "14:30",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<number>(1)
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        sender: "user",
        text: messageText,
        timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
      }
      setMessages((prev) => [...prev, newMessage])
      setMessageText("")
      showToast("success", "Message envoyé", "Votre message a été envoyé avec succès")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">D-AGRI MARKET</span>
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto h-[calc(100vh-80px)] flex">
        {/* Conversations List */}
        <aside className="w-full md:w-80 border-r border-border bg-card flex flex-col">
          {/* Search */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 px-3 py-2 bg-input rounded-lg">
              <Search className="w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm"
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto space-y-1 p-2">
            {MOCK_CONVERSATIONS.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => setSelectedConversation(conversation.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition ${
                  selectedConversation === conversation.id ? "bg-primary/10" : "hover:bg-muted"
                }`}
              >
                <img
                  src={conversation.avatar || "/placeholder.svg"}
                  alt={conversation.name}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p
                      className={`font-medium truncate ${conversation.unread ? "text-foreground font-semibold" : "text-foreground"}`}
                    >
                      {conversation.name}
                    </p>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{conversation.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{conversation.lastMessage}</p>
                </div>

                {conversation.unread && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
              </button>
            ))}
          </div>
        </aside>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col">
          {/* Chat Header */}
          <div className="border-b border-border p-4 bg-card">
            {MOCK_CONVERSATIONS.find((c) => c.id === selectedConversation) && (
              <div className="flex items-center gap-3">
                <img
                  src={MOCK_CONVERSATIONS.find((c) => c.id === selectedConversation)?.avatar || "/placeholder.svg"}
                  alt="Conversation"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h2 className="font-semibold text-foreground">
                    {MOCK_CONVERSATIONS.find((c) => c.id === selectedConversation)?.name}
                  </h2>
                  <p className="text-xs text-muted-foreground">En ligne</p>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}
                  >
                    {message.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="border-t border-border p-4 bg-card">
            <div className="flex items-end gap-3">
              <div className="flex gap-2">
                <button className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition text-muted-foreground hover:text-foreground">
                  <Smile className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 flex items-center gap-2 px-4 py-2 bg-input rounded-lg border border-border">
                <input
                  type="text"
                  placeholder="Écrivez votre message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <button
                onClick={handleSendMessage}
                className="p-2 bg-primary hover:bg-primary/90 rounded-lg transition text-primary-foreground flex-shrink-0"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile: No conversation selected message */}
        <div className="md:hidden flex-1 flex items-center justify-center bg-muted/30">
          <p className="text-muted-foreground">Sélectionnez une conversation</p>
        </div>
      </main>
    </div>
  )
}
