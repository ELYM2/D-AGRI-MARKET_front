"use client"

import Link from "next/link"
import { ShoppingCart, Heart, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { resolveMediaUrl } from "@/lib/media"

interface ProductCardProps {
    product: any
    onAddToCart?: (e: React.MouseEvent) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
    const imageUrl = product.images && product.images.length > 0
        ? resolveMediaUrl(product.images[0].image) || "/fresh-vegetables-and-local-produce-market.jpg"
        : "/fresh-vegetables-and-local-produce-market.jpg"

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="group relative bg-card rounded-[2.5rem] border border-border/50 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
        >
            <Link href={`/products/${product.id}`} className="block">
                <div className="relative aspect-square overflow-hidden">
                    <motion.img
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                        src={imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Discount Badge */}
                    {product.old_price && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                            -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-12 group-hover:translate-x-0 transition-transform duration-500 delay-75">
                        <Button size="icon" variant="secondary" className="rounded-full shadow-lg hover:scale-110 transition-transform">
                            <Heart className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-1 text-amber-500 mb-3">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= 4 ? "fill-current" : ""}`} />
                        ))}
                        <span className="text-xs text-muted-foreground ml-1">(12)</span>
                    </div>

                    <h3 className="font-bold text-lg text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
                        {product.name}
                    </h3>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="line-clamp-1">{product.seller_city || "Producteur local"}</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <div className="flex flex-col">
                            <p className="text-2xl font-black text-primary">
                                {product.price.toLocaleString()} <span className="text-sm font-bold">FCFA{product.unit && product.unit !== 'piece' ? ` / ${product.unit}` : ""}</span>
                            </p>
                            {product.old_price && (
                                <p className="text-sm text-muted-foreground line-through">
                                    {product.old_price.toLocaleString()} FCFA
                                </p>
                            )}
                        </div>

                        <Button
                            onClick={(e) => {
                                e.preventDefault()
                                onAddToCart?.(e)
                            }}
                            className="rounded-2xl h-12 w-12 p-0 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:scale-110 transition-all"
                        >
                            <ShoppingCart className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
