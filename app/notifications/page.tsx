"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Check, CheckCheck, Leaf, ArrowLeft, Package, ShoppingCart, Star, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api"
import { showToast } from "@/components/toast-notification"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const data = await getNotifications()
      setNotifications(Array.isArray(data) ? data : data.results || [])
    } catch (error) {
      console.error("Error loading notifications:", error)
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id)
      await loadNotifications()
      showToast("success", "Notification", "Marquée comme lue")
    } catch (error) {
      console.error("Error marking notification as read:", error)
      showToast("error", "Erreur", "Impossible de marquer comme lue")
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      await loadNotifications()
      showToast("success", "Notifications", "Toutes marquées comme lues")
    } catch (error) {
      console.error("Error marking all as read:", error)
      showToast("error", "Erreur", "Impossible de marquer toutes comme lues")
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return ShoppingCart
      case "review":
        return Star
      case "message":
        return Mail
      case "product":
        return Package
      default:
        return Bell
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} non lue{unreadCount > 1 ? "s" : ""}</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" onClick={handleMarkAllAsRead}>
              <CheckCheck className="w-4 h-4 mr-2" />
              Tout marquer comme lu
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des notifications...</p>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="bg-card rounded-lg border border-border p-12 text-center">
            <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h2 className="text-xl font-semibold text-foreground mb-2">Aucune notification</h2>
            <p className="text-muted-foreground">Vous n'avez pas encore de notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.notification_type)
              return (
                <div
                  key={notification.id}
                  className={`bg-card rounded-lg border border-border p-4 ${!notification.is_read ? "border-l-4 border-l-primary" : ""
                    }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${!notification.is_read ? "bg-primary/10" : "bg-muted"
                      }`}>
                      <Icon className={`w-5 h-5 ${!notification.is_read ? "text-primary" : "text-muted-foreground"}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-1">
                        <h3 className={`font-semibold text-foreground ${!notification.is_read ? "font-bold" : ""}`}>
                          {notification.title}
                        </h3>
                        {!notification.is_read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="flex-shrink-0"
                          >
                            <Check className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                        {notification.link && (
                          <Link href={notification.link}>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                              Voir détails →
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
