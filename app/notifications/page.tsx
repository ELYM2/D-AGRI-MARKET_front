"use client"

import { useState } from "react"
import Link from "next/link"
import { Leaf, Bell, Trash2, Archive, AlertCircle, Info, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Notification {
  id: number
  type: "order" | "promo" | "message" | "system"
  title: string
  message: string
  timestamp: string
  read: boolean
  icon: typeof AlertCircle
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "order",
    title: "Commande livrée",
    message: "Votre commande #ORD-2025-001 a été livrée avec succès",
    timestamp: "Il y a 2 heures",
    read: false,
    icon: CheckCircle2,
  },
  {
    id: 2,
    type: "promo",
    title: "Offre spéciale",
    message: "Les tomates biologiques de la Ferme du soleil sont en promotion -20%",
    timestamp: "Il y a 5 heures",
    read: false,
    icon: AlertCircle,
  },
  {
    id: 3,
    type: "message",
    title: "Nouveau message",
    message: "Vous avez reçu un message de Laiterie locale",
    timestamp: "Hier",
    read: true,
    icon: Bell,
  },
  {
    id: 4,
    type: "system",
    title: "Mise à jour de compte",
    message: "Votre profil a été modifié avec succès",
    timestamp: "Il y a 2 jours",
    read: true,
    icon: Info,
  },
  {
    id: 5,
    type: "order",
    title: "Commande en cours",
    message: "Votre commande #ORD-2025-002 est en cours de préparation",
    timestamp: "Il y a 3 jours",
    read: true,
    icon: CheckCircle2,
  },
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "order":
        return "border-blue-200 bg-blue-50"
      case "promo":
        return "border-orange-200 bg-orange-50"
      case "message":
        return "border-green-200 bg-green-50"
      case "system":
        return "border-gray-200 bg-gray-50"
      default:
        return "border-border"
    }
  }

  const getIconColor = (type: string) => {
    switch (type) {
      case "order":
        return "text-blue-600"
      case "promo":
        return "text-orange-600"
      case "message":
        return "text-green-600"
      case "system":
        return "text-gray-600"
      default:
        return "text-muted-foreground"
    }
  }

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const archiveNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
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
            <span className="text-xl font-bold text-foreground">LocalMarket</span>
          </Link>
          <Link href="/account">
            <Button variant="outline" size="sm">
              Mon compte
            </Button>
          </Link>
        </nav>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
          <p className="text-muted-foreground">
            Vous avez {notifications.filter((n) => !n.read).length} notification(s) non lue(s)
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 border-b border-border">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              filter === "all"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Toutes ({notifications.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 font-medium transition border-b-2 ${
              filter === "unread"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Non lues ({notifications.filter((n) => !n.read).length})
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon
              return (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition ${getNotificationColor(
                    notification.type,
                  )} ${!notification.read ? "ring-1 ring-primary/20" : ""}`}
                >
                  <div className="flex items-start gap-4">
                    <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getIconColor(notification.type)}`} />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="font-semibold text-foreground">{notification.title}</h3>
                          <p className="text-sm text-foreground/80 mt-1">{notification.message}</p>
                        </div>
                        {!notification.read && <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{notification.timestamp}</p>
                    </div>

                    <div className="flex gap-2 flex-shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 hover:bg-white/50 rounded-lg transition"
                          title="Marquer comme lu"
                        >
                          <Bell className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                        </button>
                      )}
                      <button
                        onClick={() => archiveNotification(notification.id)}
                        className="p-2 hover:bg-white/50 rounded-lg transition"
                        title="Archiver"
                      >
                        <Archive className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 hover:bg-white/50 rounded-lg transition"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                {filter === "unread" ? "Aucune notification non lue" : "Aucune notification"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
