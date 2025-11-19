"use client"
import Link from "next/link"
import { Menu, X, MapPin, Clock, FileText, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { showToast } from "@/components/toast-notification"

export default function SettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState({
    shopName: "Ferme du soleil",
    description: "Ferme bio certifiée depuis 2010",
    address: "123 Chemin de la Ferme, Paris",
    phone: "+33 6 12 34 56 78",
    email: "contact@fermedusoleil.fr",
    monOpen: "08:00",
    monClose: "19:00",
    satOpen: "08:00",
    satClose: "19:00",
    sunOpen: "09:00",
    sunClose: "13:00",
    minOrder: "15",
    deliveryTime: "24-48",
    terms: "",
  })

  const handleSave = () => {
    showToast("success", "Paramètres sauvegardés", "Vos paramètres ont été mis à jour")
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
          <Link
            href="/seller/analytics"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg"
          >
            Statistiques
          </Link>
          <Link
            href="/seller/orders"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg"
          >
            Commandes
          </Link>
          <Link
            href="/seller/settings"
            className="flex items-center gap-3 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
          >
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
            <h1 className="text-2xl font-bold text-foreground">Paramètres du magasin</h1>
          </div>

          <Button className="bg-primary hover:bg-primary/90" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </Button>
        </header>

        <main className="flex-1 overflow-auto p-6 space-y-8">
          {/* Shop Info */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-6">
            <h2 className="text-xl font-bold text-foreground">Informations du magasin</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom du magasin</label>
                <input
                  type="text"
                  value={settings.shopName}
                  onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition resize-none"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Adresse
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Adresse complète</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                />
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Horaires d'ouverture
            </h2>

            <div className="space-y-4">
              {["Lundi", "Samedi", "Dimanche"].map((day) => (
                <div key={day} className="flex items-center gap-4">
                  <span className="w-24 font-medium text-foreground">{day}</span>
                  <input
                    type="time"
                    value={settings[`${day.toLowerCase()}Open` as keyof typeof settings] || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        [`${day.toLowerCase()}Open`]: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-input border border-border rounded-lg outline-none text-foreground"
                  />
                  <span className="text-foreground">à</span>
                  <input
                    type="time"
                    value={settings[`${day.toLowerCase()}Close` as keyof typeof settings] || ""}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        [`${day.toLowerCase()}Close`]: e.target.value,
                      })
                    }
                    className="px-3 py-2 bg-input border border-border rounded-lg outline-none text-foreground"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-6">
            <h2 className="text-xl font-bold text-foreground">Livraison</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Commande minimale ($)</label>
                <input
                  type="number"
                  value={settings.minOrder}
                  onChange={(e) => setSettings({ ...settings, minOrder: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Délai de livraison</label>
                <input
                  type="text"
                  value={settings.deliveryTime}
                  onChange={(e) => setSettings({ ...settings, deliveryTime: e.target.value })}
                  placeholder="ex: 24-48 heures"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                />
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="bg-card p-6 rounded-lg border border-border space-y-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Conditions de vente
            </h2>

            <textarea
              value={settings.terms}
              onChange={(e) => setSettings({ ...settings, terms: e.target.value })}
              rows={6}
              placeholder="Entrez vos conditions de vente..."
              className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition resize-none"
            />
          </div>
        </main>
      </div>
    </div>
  )
}
