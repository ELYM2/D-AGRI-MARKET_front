"use client"

import Link from "next/link"
import { ShoppingBag, Heart, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { resolveMediaUrl } from "@/lib/media"

type Product = {
  id: number
  name: string
  price: number
  old_price?: number
  unit?: string
  image: string
  category: string
  seller: string
  isFavorite?: boolean
  fresh?: boolean
  stock?: number // Added stock property
}

const UNIT_LABELS: Record<string, string> = {
  kg: "kg",
  g: "g",
  piece: "pièce",
  liter: "L",
  bunch: "botte",
  bag: "sac",
  box: "boîte",
}

interface ProductCardProps {
  product: Product
  onToggleFavorite: (e: React.MouseEvent) => void
  onAddToCart: (e: React.MouseEvent) => void
  isAddingToCart?: boolean
}

export function ProductCard({ product, onToggleFavorite, onAddToCart, isAddingToCart }: ProductCardProps) {
  const discount = product.old_price
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0

  return (
    <div
      className="group relative bg-card rounded-2xl border border-border overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="aspect-[4/3] overflow-hidden relative bg-muted/30">
        <Link href={`/products/${product.id}`} className="block h-full cursor-pointer">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {product.fresh && (
            <span className="bg-emerald-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm shadow-sm tracking-wider uppercase">
              <Leaf className="w-3 h-3" />
              Frais
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-500/90 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm shadow-sm tracking-wider">
              -{discount}%
            </span>
          )}
        </div>

        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 z-10 ${product.isFavorite
            ? "bg-white/90 text-red-500 shadow-sm scale-110"
            : "bg-black/20 text-white hover:bg-white/90 hover:text-red-500 hover:scale-110 opacity-0 group-hover:opacity-100"
            }`}
        >
          <Heart className={`w-4 h-4 ${product.isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Quick Add Overlay on Desktop */}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 md:flex hidden justify-end">
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="mb-2">
          <span className="text-[10px] font-bold tracking-wider text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-2 py-1 rounded-full uppercase">
            {product.category}
          </span>
        </div>

        <Link href={`/products/${product.id}`} className="block group-hover:text-primary transition-colors mb-1">
          <h3 className="font-bold text-foreground text-lg line-clamp-1 leading-tight" title={product.name}>
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground mb-4 flex items-center gap-1">
          Par <span className="font-medium text-foreground underline decoration-emerald-500/30 underline-offset-2 hover:decoration-emerald-500 transition-all">{product.seller}</span>
        </p>

        <div className="flex items-end justify-between mt-auto pt-2 border-t border-border/50">
          <div className="flex flex-col">
            {product.old_price && (
              <span className="text-xs text-muted-foreground line-through mb-0.5">
                {product.old_price.toLocaleString()} FCFA
              </span>
            )}
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold text-xl text-emerald-600">
                {product.price.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-muted-foreground">FCFA</span>
            </div>
            {product.unit && (
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide">
                / {UNIT_LABELS[product.unit] || product.unit}
              </span>
            )}
          </div>

          <Button
            size="sm"
            onClick={onAddToCart}
            disabled={isAddingToCart || (product.stock === 0)}
            className={`rounded-full w-10 h-10 p-0 shadow-lg shadow-emerald-500/20 transition-all duration-300 ${isAddingToCart
              ? "bg-emerald-600/80 cursor-wait"
              : "bg-primary hover:bg-emerald-600 hover:scale-110 active:scale-95"
              }`}
          >
            {isAddingToCart ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <ShoppingBag className="w-5 h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
