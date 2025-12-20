import Link from "next/link"
import { Star, MapPin, ShoppingBag, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { resolveMediaUrl } from "@/lib/media"

interface ProductCardProps {
  id: number
  name: string
  price: number
  old_price?: number
  image: string
  seller: string
  rating: number
  reviews: number
  distance: number
  fresh: boolean
}

export function ProductCard({ id, name, price, old_price, image, seller, rating, reviews, distance, fresh }: ProductCardProps) {
  const hasDiscount = Boolean(old_price && old_price > price)
  const discountPercent = hasDiscount ? Math.round(((old_price! - price) / old_price!) * 100) : null
  const imageUrl = resolveMediaUrl(image) || "/placeholder.svg"

  return (
    <Link href={`/products/${id}`}>
      <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition group cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden bg-muted h-48 flex items-center justify-center">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            {fresh && (
              <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Leaf className="w-3 h-3" />
                Frais
              </div>
            )}
            {hasDiscount && (
              <div className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-semibold">
                -{discountPercent}%
              </div>
            )}
          </div>
        </div>

        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-3 flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition line-clamp-2">{name}</h3>
            <p className="text-xs text-muted-foreground mt-1">{seller}</p>
          </div>

          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "fill-accent text-accent" : "text-muted"}`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviews})</span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-primary">{price.toFixed(0)} FCFA</p>
                {hasDiscount && (
                  <p className="text-sm text-muted-foreground line-through">{old_price?.toFixed(0)} FCFA</p>
                )}
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {distance}km
              </p>
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <ShoppingBag className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  )
}
