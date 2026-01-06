"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, MapPin, Clock, FileText, Save, Inbox, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"

export default function SettingsPage() {
  const { me, updateProfile } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const [settings, setSettings] = useState({
    shopName: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    monOpen: "",
    monClose: "",
    satOpen: "",
    satClose: "",
    sunOpen: "",
    sunClose: "",
    minOrder: "",
    deliveryTime: "",
    terms: "",
    country: "",
  })

  useEffect(() => {
    if (me) {
      setSettings({
        shopName: me.profile?.business_name || "",
        description: me.profile?.business_description || "",
        address: me.profile?.business_address || "",
        phone: me.profile?.phone || "",
        email: me.email || "",
        monOpen: me.profile?.mon_open ? me.profile.mon_open.substring(0, 5) : "",
        monClose: me.profile?.mon_close ? me.profile.mon_close.substring(0, 5) : "",
        satOpen: me.profile?.sat_open ? me.profile.sat_open.substring(0, 5) : "",
        satClose: me.profile?.sat_close ? me.profile.sat_close.substring(0, 5) : "",
        sunOpen: me.profile?.sun_open ? me.profile.sun_open.substring(0, 5) : "",
        sunClose: me.profile?.sun_close ? me.profile.sun_close.substring(0, 5) : "",
        minOrder: me.profile?.min_order_amount?.toString() || "0",
        deliveryTime: me.profile?.delivery_time || "",
        terms: me.profile?.terms_of_sale || "",
        country: me.profile?.business_country || "",
      })
    }
  }, [me])

  const handleSave = async () => {
    try {
      setSaving(true)
      await updateProfile({
        email: settings.email,
        phone: settings.phone,
        business_name: settings.shopName,
        business_description: settings.description,
        business_address: settings.address,
        min_order_amount: parseFloat(settings.minOrder) || 0,
        delivery_time: settings.deliveryTime,
        terms_of_sale: settings.terms,
        mon_open: settings.monOpen || undefined,
        mon_close: settings.monClose || undefined,
        sat_open: settings.satOpen || undefined,
        sat_close: settings.satClose || undefined,
        sun_open: settings.sunOpen || undefined,
        sun_close: settings.sunClose || undefined,
        business_country: settings.country,
      })
      showToast("success", "Paramètres sauvegardés", "Vos paramètres ont été mis à jour")
    } catch (error: any) {
      showToast("error", "Erreur", error.message || "Impossible de sauvegarder les paramètres")
    } finally {
      setSaving(false)
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
            href="/seller/messages"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg"
          >
            <Inbox className="w-5 h-5" />
            Messages
          </Link>
          <Link
            href="/seller/reviews"
            className="flex items-center gap-3 px-4 py-2 text-foreground hover:bg-muted rounded-lg"
          >
            <MessageCircle className="w-5 h-5" />
            Avis
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

          <Button className="bg-primary hover:bg-primary/90" onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Chargement..." : "Enregistrer"}
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
              <div className="md:col-span-2 grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Ville</label>
                  <input
                    type="text"
                    value={me?.profile?.business_city || ""}
                    disabled
                    className="w-full px-4 py-2 bg-muted border border-border rounded-lg outline-none text-muted-foreground cursor-not-allowed"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">Ville non modifiable ici</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Pays</label>
                  <select
                    value={settings.country}
                    onChange={(e) => setSettings({ ...settings, country: e.target.value })}
                    className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                  >
                    <option value="">Sélectionner</option>
                    <optgroup label="Afrique de l'Ouest (FCFA - UEMOA)">
                      <option value="BJ">Bénin</option>
                      <option value="BF">Burkina Faso</option>
                      <option value="CI">Côte d'Ivoire</option>
                      <option value="GW">Guinée-Bissau</option>
                      <option value="ML">Mali</option>
                      <option value="NE">Niger</option>
                      <option value="SN">Sénégal</option>
                      <option value="TG">Togo</option>
                    </optgroup>
                    <optgroup label="Afrique Centrale (FCFA - CEMAC)">
                      <option value="CM">Cameroun</option>
                      <option value="CF">Centrafrique</option>
                      <option value="TD">Tchad</option>
                      <option value="CG">Congo-Brazzaville</option>
                      <option value="GQ">Guinée Équatoriale</option>
                      <option value="GA">Gabon</option>
                    </optgroup>
                    <optgroup label="Autres pays d'Afrique">
                      <option value="CD">Congo-Kinshasa (RDC)</option>
                      <option value="GN">Guinée</option>
                      <option value="MA">Maroc</option>
                      <option value="DZ">Algérie</option>
                      <option value="TN">Tunisie</option>
                      <option value="NG">Nigeria</option>
                      <option value="GH">Ghana</option>
                    </optgroup>
                    <optgroup label="Europe">
                      <option value="FR">France</option>
                      <option value="BE">Belgique</option>
                      <option value="CH">Suisse</option>
                      <option value="LU">Luxembourg</option>
                    </optgroup>
                  </select>
                </div>
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
                <label className="block text-sm font-medium text-foreground mb-2">Commande minimale (FCFA)</label>
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
