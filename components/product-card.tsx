import Link from "next/link"
import Image from "next/image"
import { Star, MapPin, ShoppingBag, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"

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
  return (
    <Link href={`/products/${id}`}>
      <div className="bg-card rounded-lg border border-border overflow-hidden hover:border-primary/20 transition group cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden bg-muted h-48 flex items-center justify-center">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
            sizes="(max-width: 1024px) 50vw, 33vw"
          />
          {fresh && (
            <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Frais
            </div>
          )}
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
                <p className="text-lg font-bold text-primary">${price.toFixed(2)}</p>
                {old_price && old_price > price && (
                  <p className="text-sm text-muted-foreground line-through">${old_price.toFixed(2)}</p>
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
