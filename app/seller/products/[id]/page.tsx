"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getProduct, getCategories, updateProductFields } from "@/lib/api"
import { showToast } from "@/components/toast-notification"
import { Leaf } from "lucide-react"

type FormState = {
  name: string
  description: string
  price: string
  old_price: string
  stock: string
  category: string
  is_active: boolean
}

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const productId = Number(params?.id)

  const [form, setForm] = useState<FormState>({
    name: "",
    description: "",
    price: "",
    old_price: "",
    stock: "",
    category: "",
    is_active: true,
  })
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!productId) return

    const loadData = async () => {
      try {
        setLoading(true)
        const [product, cats] = await Promise.all([getProduct(productId), getCategories()])
        setForm({
          name: product.name || "",
          description: product.description || "",
          price: product.price?.toString() || "",
          old_price: product.old_price?.toString() || "",
          stock: product.stock?.toString() || "",
          category: product.category?.toString() || "",
          is_active: product.is_active ?? true,
        })
        setCategories(cats || [])
      } catch (error: any) {
        console.error("Error loading product:", error)
        showToast("error", "Erreur", error?.message || "Impossible de charger le produit")
        router.push("/seller")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [productId, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    const { name, type, value } = target
    const fieldValue = type === "checkbox" ? (target as HTMLInputElement).checked : value
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId) return

    try {
      setSaving(true)
      await updateProductFields(productId, {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        old_price: form.old_price ? Number(form.old_price) : undefined,
        stock: Number(form.stock),
        category: form.category ? Number(form.category) : undefined,
        is_active: form.is_active,
      })
      showToast("success", "Produit mis à jour", "Les modifications ont été enregistrées")
      router.push("/seller")
    } catch (error: any) {
      showToast("error", "Erreur", error?.message || "Impossible de sauvegarder le produit")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement du produit...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">D-AGRI MARKET</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/seller">
              <Button variant="ghost">Retour tableau de bord</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Modifier le produit</h1>
          <p className="text-muted-foreground">Ajustez vos informations, prix et disponibilité.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Nom du produit</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Catégorie</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
              >
                <option value="">Sélectionner</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition resize-none"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Prix (FCFA)</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Prix avant promo (optionnel)</label>
              <input
                type="number"
                name="old_price"
                min="0"
                step="0.01"
                value={form.old_price}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                value={form.stock}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
              />
            </div>
            <div className="space-y-2 flex items-center gap-2">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="h-5 w-5 border border-border rounded"
              />
              <span className="text-sm text-foreground">Produit actif</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Link href="/seller">
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  )
}
