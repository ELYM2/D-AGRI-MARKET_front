"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const CATEGORIES = ["Légumes", "Fruits", "Produits laitiers", "Œufs & Volaille", "Produits apicoles", "Autres"]

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    images: [] as string[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }))
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.name) newErrors.name = "Le nom du produit est requis"
    if (!formData.category) newErrors.category = "La catégorie est requise"
    if (!formData.price) newErrors.price = "Le prix est requis"
    if (!formData.stock) newErrors.stock = "Le stock est requis"
    if (formData.images.length === 0) newErrors.images = "Au moins une image est requise"

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      alert("Produit créé avec succès!")
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
              {formData.images.map((image, index) => (
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

              <label className="border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center h-24 cursor-pointer hover:border-primary/50 transition group">
                <Upload className="w-6 h-6 text-muted-foreground group-hover:text-primary transition" />
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
                className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
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
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
                />
                {errors.price && <p className="text-sm text-destructive mt-1">{errors.price}</p>}
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
                className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground placeholder:text-muted-foreground focus:border-primary transition"
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
            <Button type="submit" className="bg-primary hover:bg-primary/90">
              Créer le produit
            </Button>
          </div>
        </form>
      </main>
    </div>
  )
}
