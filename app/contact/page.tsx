"use client"

import type React from "react"

import Link from "next/link"
import { Leaf, Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { showToast } from "@/components/toast-notification"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast("success", "Message envoyé", "Merci de nous avoir contactés. Nous répondrons bientôt.")
    setFormData({ name: "", email: "", subject: "", message: "" })
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">LocalMarket</span>
          </Link>

          <Link href="/">
            <Button variant="outline" size="sm">
              Retour
            </Button>
          </Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground">Nous contacter</h1>
              <p className="text-muted-foreground mt-2">
                Nous serions heureux de recevoir vos questions ou suggestions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                  placeholder="Votre nom"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Sujet</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                  placeholder="Sujet de votre message"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Message</label>
                <textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition resize-none"
                  placeholder="Votre message..."
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4 mr-2" />
                Envoyer le message
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="space-y-6">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "contact@localmarket.fr",
                  href: "mailto:contact@localmarket.fr",
                },
                {
                  icon: Phone,
                  label: "Téléphone",
                  value: "+33 1 23 45 67 89",
                  href: "tel:+33123456789",
                },
                {
                  icon: MapPin,
                  label: "Adresse",
                  value: "123 Rue de la Paix, 75000 Paris",
                },
              ].map((item) => {
                const Icon = item.icon
                return (
                  <div key={item.label} className="bg-card p-6 rounded-lg border border-border">
                    <div className="flex items-center gap-4">
                      <Icon className="w-8 h-8 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-foreground font-medium hover:text-primary transition">
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-foreground font-medium">{item.value}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-primary/10 p-8 rounded-lg border border-primary/20">
              <h3 className="text-lg font-bold text-foreground mb-3">Horaires de support</h3>
              <div className="space-y-2 text-sm text-foreground">
                <p>Lun-Ven: 9h - 18h</p>
                <p>Sam: 10h - 16h</p>
                <p>Dim: Fermé</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
