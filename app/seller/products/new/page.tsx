"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createProduct, getCategories } from "@/lib/api"
import { showToast } from "@/components/toast-notification"

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    old_price: "",
    stock: "",
    images: [] as File[],
  })
  const [previewImages, setPreviewImages] = useState<string[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data.results || [])
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newFiles = Array.from(files)
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file))

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newFiles],
      }))
      setPreviewImages((prev) => [...prev, ...newPreviews])

      if (errors.images) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.images
          return newErrors
        })
      }
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = "Le nom du produit est requis"
    if (!formData.category) newErrors.category = "La catégorie est requise"
    if (!formData.price) newErrors.price = "Le prix est requis"
    if (!formData.stock) newErrors.stock = "Le stock est requis"
    if (formData.images.length === 0) newErrors.images = "Au moins une image est requise"

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true)
        const data = new FormData()
        data.append("name", formData.name)
        data.append("category", formData.category) // Assuming category ID is sent
        data.append("description", formData.description)
        data.append("price", formData.price)
        if (formData.old_price) {
          data.append("old_price", formData.old_price)
        }
        data.append("stock", formData.stock)

        // Append images
        formData.images.forEach((file) => {
          data.append("uploaded_images", file)
        })

        await createProduct(data)
        showToast("success", "Succès", "Produit créé avec succès")
        router.push("/seller")
      } catch (err: any) {
        console.error("Error creating product:", err)
        try {
          const errorData = JSON.parse(err.message)
          const apiErrors: Record<string, string> = {}
          Object.keys(errorData).forEach(key => {
            apiErrors[key] = Array.isArray(errorData[key]) ? errorData[key][0] : errorData[key]
          })
          setErrors(apiErrors)
          showToast("error", "Erreur", "Veuillez corriger les erreurs indiquées")
        } catch {
          showToast("error", "Erreur", "Impossible de créer le produit")
        }
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4">
        <Link href="/seller" className="flex items-center gap-2 text-primary hover:text-primary/80 transition mb-4">
          <ArrowLeft className="w-5 h-5" />
          Retour
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Ajouter un nouveau produit</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Images Section */}
          <section className="bg-card p-6 rounded-lg border border-border">
            <h2 className="text-lg font-semibold text-foreground mb-4">Images du produit</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {previewImages.map((image, index) => (
                <div key={index} className="relative group">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`Product ${index}`}
                    width={200}
                    height={96}
                    className="h-24 w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground p-1 rounded opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              <label className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center h-24 cursor-pointer hover:border-primary/50 transition group ${errors.images ? "border-red-500 bg-red-50" : "border-border"
                }`}>
                <Upload className={`w-6 h-6 transition ${errors.images ? "text-red-500" : "text-muted-foreground group-hover:text-primary"}`} />
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            </div>

            {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}
          </section>

          {/* Product Details */}
          <section className="bg-card p-6 rounded-lg border border-border space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Informations du produit</h2>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Nom du produit *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Tomates biologiques"
                className={`w-full px-4 py-2 bg-input border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition ${errors.name ? "border-red-500" : "border-border"
                  }`}
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Catégorie *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 bg-input border rounded-lg outline-none text-foreground focus:border-primary transition ${errors.category ? "border-red-500" : "border-border"
                    }`}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-sm text-destructive mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prix (€) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  className={`w-full px-4 py-2 bg-input border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition ${errors.price ? "border-red-500" : "border-border"
                    }`}
                />
                {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Prix d'origine (€) <span className="text-muted-foreground text-xs">(optionnel, pour promotions)</span>
                </label>
                <input
                  type="number"
                  name="old_price"
                  value={formData.old_price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                />
                <p className="text-xs text-muted-foreground mt-1">Laissez vide si pas de promotion</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Stock disponible *</label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                className={`w-full px-4 py-2 bg-input border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition ${errors.stock ? "border-red-500" : "border-border"
                  }`}
              />
              {errors.stock && <p className="text-sm text-destructive mt-1">{errors.stock}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Décrivez votre produit..."
                rows={4}
                className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition resize-none"
              />
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex gap-4 justify-end">
            <Link href="/seller">
              <Button type="button" variant="outline">
                Annuler
              </Button>
            </Link>
            <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Création en cours..." : "Créer le produit"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
