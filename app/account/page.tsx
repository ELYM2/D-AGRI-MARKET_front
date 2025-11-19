"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Heart, Settings, LogOut, MapPin, Phone, Mail, Edit2, Leaf, Bell, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"

type AccountTab = "profile" | "orders" | "favorites" | "preferences"

interface Order {
  id: string
  date: string
  items: string[]
  total: number
  status: "delivered" | "processing" | "pending"
}

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-2025-001",
    date: "2025-01-15",
    items: ["Tomates biologiques (x2)", "Carottes fraiches"],
    total: 19.7,
    status: "delivered",
  },
  {
    id: "ORD-2025-002",
    date: "2025-01-16",
    items: ["Fromage fermier", "Miel naturel"],
    total: 20.5,
    status: "processing",
  },
  {
    id: "ORD-2025-003",
    date: "2025-01-17",
    items: ["Pommes de saison", "Œufs fermiers"],
    total: 12.49,
    status: "pending",
  },
]

const MOCK_FAVORITES = [
  { id: 1, name: "Tomates biologiques", seller: "Ferme du soleil", price: 4.5 },
  { id: 2, name: "Fromage fermier", seller: "Laiterie locale", price: 12.0 },
  { id: 3, name: "Miel naturel", seller: "Ruches locales", price: 8.5 },
]

export default function AccountPage() {
  const router = useRouter()
  const { me, loading, logout, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<AccountTab>("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.dupont@email.com",
    phone: "+33 6 12 34 56 78",
    address: "123 Rue de la Paix",
    city: "Paris",
    postalCode: "75000",
  })
  const [logoutPending, setLogoutPending] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)

  useEffect(() => {
    if (me) {
      setProfileData((prev) => ({
        ...prev,
        firstName: me.first_name ?? prev.firstName,
        lastName: me.last_name ?? prev.lastName,
        email: me.email ?? prev.email,
        phone: me.profile?.phone ?? prev.phone,
        address: me.profile?.address ?? prev.address,
        city: me.profile?.city ?? prev.city,
        postalCode: me.profile?.postal_code ?? prev.postalCode,
      }))
    }
  }, [me])

  const handleSaveProfile = async () => {
    setSavingProfile(true)
    try {
      const payload = {
        first_name: profileData.firstName || undefined,
        last_name: profileData.lastName || undefined,
        email: profileData.email || undefined,
        phone: profileData.phone || "",
        address: profileData.address || "",
        city: profileData.city || "",
        postal_code: profileData.postalCode || "",
      }
      const updated = await updateProfile(payload)
      setIsEditing(false)
      setProfileData((prev) => ({
        ...prev,
        firstName: updated?.first_name ?? prev.firstName,
        lastName: updated?.last_name ?? prev.lastName,
        email: updated?.email ?? prev.email,
        phone: updated?.profile?.phone ?? prev.phone,
        address: updated?.profile?.address ?? prev.address,
        city: updated?.profile?.city ?? prev.city,
        postalCode: updated?.profile?.postal_code ?? prev.postalCode,
      }))
      showToast("success", "Profil mis a jour", "Vos modifications ont ete enregistre")
    } catch (err) {
      console.error(err)
      showToast("error", "Erreur", "Impossible de mettre a jour le profil")
    } finally {
      setSavingProfile(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLogoutPending(true)
      await logout()
      showToast("success", "Deconnecte", "A bientot")
      router.replace("/")
    } finally {
      setLogoutPending(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "delivered":
        return "Livré"
      case "processing":
        return "En cours"
      case "pending":
        return "En attente"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Chargement du profil...</p>
      </div>
    )
  }

  if (!me) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 text-center space-y-4">
        <h1 className="text-2xl font-bold">Connexion requise</h1>
        <p className="text-muted-foreground max-w-sm">
          Vous devez etre connecte pour acceder a votre espace client.
        </p>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/auth/login">Se connecter</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/signup">Creer un compte</Link>
          </Button>
        </div>
      </div>
    )
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

          <Link href="/products">
            <Button variant="outline" size="sm">
              Continuer les achats
            </Button>
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <div className="bg-card rounded-lg border border-border p-6 sticky top-24 space-y-4">
              <h3 className="font-semibold text-foreground mb-4">Mon compte</h3>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    activeTab === "profile" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm font-medium">Profil</span>
                </button>

                <button
                  onClick={() => setActiveTab("orders")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    activeTab === "orders" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="text-sm font-medium">Commandes</span>
                </button>

                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    activeTab === "favorites" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="text-sm font-medium">Favoris</span>
                </button>

                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition ${
                    activeTab === "preferences" ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="text-sm font-medium">Paramètres</span>
                </button>
              </nav>

              <div className="border-t border-border pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2 text-destructive hover:bg-destructive/10 rounded-lg transition disabled:opacity-60"
                  disabled={logoutPending}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="text-sm font-medium">{logoutPending ? "Deconnexion..." : "Se deconnecter"}</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-6">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Mon profil</h2>
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    {isEditing ? "Annuler" : "Modifier"}
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {!isEditing ? (
                    <>
                      <div>
                        <label className="text-sm text-muted-foreground">Prénom</label>
                        <p className="text-lg font-semibold text-foreground mt-1">{profileData.firstName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground">Nom</label>
                        <p className="text-lg font-semibold text-foreground mt-1">{profileData.lastName}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email
                        </label>
                        <p className="text-lg font-semibold text-foreground mt-1">{profileData.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Téléphone
                        </label>
                        <p className="text-lg font-semibold text-foreground mt-1">{profileData.phone}</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm text-muted-foreground flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Adresse
                        </label>
                        <p className="text-lg font-semibold text-foreground mt-1">
                          {profileData.address}, {profileData.postalCode} {profileData.city}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Prénom</label>
                        <input
                          type="text"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                        <input
                          type="text"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Adresse</label>
                        <input
                          type="text"
                          value={profileData.address}
                          onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Ville</label>
                        <input
                          type="text"
                          value={profileData.city}
                          onChange={(e) => setProfileData({ ...profileData, city: e.target.value })}
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">Code postal</label>
                        <input
                          type="text"
                          value={profileData.postalCode}
                          onChange={(e) => setProfileData({ ...profileData, postalCode: e.target.value })}
                          className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                        />
                      </div>
                      <div className="md:col-span-2 flex gap-4">
                        <Button
                          onClick={handleSaveProfile}
                          className="flex-1 bg-primary hover:bg-primary/90"
                          isLoading={savingProfile}
                          disabled={savingProfile}
                        >
                          Enregistrer les modifications
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Mes commandes</h2>

                <div className="space-y-4">
                  {MOCK_ORDERS.map((order) => (
                    <Link key={order.id} href={`/account/orders/${order.id}`}>
                      <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/20 transition cursor-pointer group">
                        <div className="flex-1">
                          <p className="font-semibold text-foreground group-hover:text-primary transition">
                            {order.id}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{order.date}</p>
                          <p className="text-sm text-foreground mt-2">{order.items.length} article(s)</p>
                        </div>

                        <div className="text-right">
                          <p className="text-lg font-bold text-primary">${order.total.toFixed(2)}</p>
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${getStatusColor(order.status)}`}
                          >
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Favorites Tab */}
            {activeTab === "favorites" && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Mes favoris</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {MOCK_FAVORITES.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg hover:border-primary/20 transition"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.seller}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-primary">${product.price.toFixed(2)}</p>
                        <Button size="sm" className="mt-2 bg-primary hover:bg-primary/90">
                          Ajouter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {MOCK_FAVORITES.length === 0 && (
                  <div className="text-center py-8">
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground">Aucun favori pour le moment</p>
                  </div>
                )}
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === "preferences" && (
              <div className="bg-card rounded-lg border border-border p-6 space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-6">Préférences</h2>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">Notifications par email</p>
                      <p className="text-sm text-muted-foreground mt-1">Recevez des mises à jour sur vos commandes</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-primary cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">Notifications de promotions</p>
                      <p className="text-sm text-muted-foreground mt-1">Soyez informé des offres spéciales</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-5 h-5 rounded accent-primary cursor-pointer" />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="font-semibold text-foreground">Partage de données</p>
                      <p className="text-sm text-muted-foreground mt-1">Permettre l'amélioration de nos services</p>
                    </div>
                    <input type="checkbox" className="w-5 h-5 rounded accent-primary cursor-pointer" />
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Sécurité
                  </h3>
                  <Link href="/account/change-password">
                    <Button variant="outline" className="w-full bg-transparent">
                      Modifier le mot de passe
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
