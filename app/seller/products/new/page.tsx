"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, Loader2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/toast-notification"
import { createProduct, getCategories, createCategory } from "@/lib/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function CreateProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Modal state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [creatingCategory, setCreatingCategory] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    old_price: "",
    stock: "",
    category: "",
    fresh: true,
    image: null as File | null
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data.results || data)
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return

    setCreatingCategory(true)
    try {
      const newCategory = await createCategory(newCategoryName)
      setCategories(prev => [...prev, newCategory])
      setFormData(prev => ({ ...prev, category: newCategory.id }))
      showToast("success", "Catégorie créée", `La catégorie "${newCategoryName}" a été ajoutée`)
      setNewCategoryName("")
      setIsCategoryModalOpen(false)
    } catch (error) {
      console.error("Error creating category:", error)
      showToast("error", "Erreur", "Impossible de créer la catégorie")
    } finally {
      setCreatingCategory(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData(prev => ({ ...prev, image: file }))

      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = new FormData()
      data.append("name", formData.name)
      data.append("description", formData.description)
      data.append("price", formData.price)
      if (formData.old_price) data.append("old_price", formData.old_price)
      data.append("stock", formData.stock)
      if (formData.category) data.append("category", formData.category)
      data.append("fresh", formData.fresh.toString())
      data.append("is_active", "true")

      if (formData.image) {
        data.append("uploaded_images", formData.image)
      }

      await createProduct(data)
      showToast("success", "Produit créé", "Votre produit a été ajouté avec succès")
      router.push("/seller")
    } catch (error: any) {
      console.error("Error creating product:", error)
      showToast("error", "Erreur", "Impossible de créer le produit")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/seller" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour au tableau de bord
        </Link>

        <div className="bg-card rounded-lg border border-border p-6 md:p-8">
          <h1 className="text-2xl font-bold text-foreground mb-6">Ajouter un nouveau produit</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Photo du produit</label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-border px-6 py-10 hover:bg-muted/50 transition">
                {imagePreview ? (
                  <div className="relative w-full aspect-video max-w-sm mx-auto">
                    <img src={imagePreview} alt="Preview" className="rounded-lg object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setFormData(prev => ({ ...prev, image: null }))
                      }}
                      className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full hover:bg-destructive/90"
                    >
                      <span className="sr-only">Supprimer</span>
                      ×
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
                    <div className="mt-4 flex text-sm leading-6 text-muted-foreground justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-background font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                      >
                        <span>Télécharger un fichier</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF jusqu'à 10MB</p>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Nom du produit *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                  placeholder="Ex: Tomates Bio"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition resize-none"
                  placeholder="Décrivez votre produit..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prix (FCFA) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Prix avant promo (optionnel)</label>
                <input
                  type="number"
                  name="old_price"
                  value={formData.old_price}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                  placeholder="Ancien prix"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Stock *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Catégorie *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 bg-input border border-border rounded-lg outline-none text-foreground focus:border-primary transition"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>

                <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="mt-2 text-sm text-primary hover:text-primary/80 font-medium flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Créer une catégorie
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-card text-foreground border-border">
                    <DialogHeader>
                      <DialogTitle>Nouvelle catégorie</DialogTitle>
                      <DialogDescription>
                        Ajoutez une nouvelle catégorie pour classer vos produits.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="category-name" className="text-right">
                          Nom
                        </Label>
                        <Input
                          id="category-name"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="col-span-3"
                          placeholder="Ex: Miel local"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setIsCategoryModalOpen(false)} disabled={creatingCategory}>
                        Annuler
                      </Button>
                      <Button onClick={handleCreateCategory} disabled={!newCategoryName.trim() || creatingCategory}>
                        {creatingCategory && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Créer
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="flex items-center space-x-2 pt-8">
                <input
                  type="checkbox"
                  id="fresh"
                  name="fresh"
                  checked={formData.fresh}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <label htmlFor="fresh" className="text-sm font-medium text-foreground">
                  Produit frais (récolté récemment)
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-border flex justify-end gap-4">
              <Link href="/seller">
                <Button type="button" variant="outline">Annuler</Button>
              </Link>
              <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Créer le produit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
