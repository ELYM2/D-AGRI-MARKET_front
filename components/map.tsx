"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Link from "next/link"
import { resolveMediaUrl } from "@/lib/media"

// Fix for Leaflet marker icons in Next.js
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

interface MapProps {
    products: any[]
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
    const map = useMap()
    map.setView(center, zoom)
    return null
}

export default function Map({ products }: MapProps) {
    const [center, setCenter] = useState<[number, number]>([7.3697, 12.3547]) // Approx center of Cameroon/CI
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc: [number, number] = [position.coords.latitude, position.coords.longitude]
                    setUserLocation(loc)
                    setCenter(loc)
                },
                () => console.log("Geolocation denied or failed")
            )
        }
    }, [])

    // Filter products that have coordinates
    const markers = products.filter(p => p.seller_latitude && p.seller_longitude)

    return (
        <div className="h-[500px] w-full rounded-[2.5rem] overflow-hidden border border-border/50 shadow-2xl relative z-10">
            <MapContainer center={center} zoom={6} className="h-full w-full">
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {userLocation && (
                    <Marker position={userLocation}>
                        <Popup>
                            <div className="text-center font-bold">Votre position</div>
                        </Popup>
                    </Marker>
                )}

                {markers.map((product) => (
                    <Marker
                        key={product.id}
                        position={[product.seller_latitude, product.seller_longitude]}
                    >
                        <Popup>
                            <div className="p-1 max-w-[200px]">
                                <img
                                    src={resolveMediaUrl(product.images?.[0]?.image) || "/fresh-vegetables-and-local-produce-market.jpg"}
                                    alt={product.name}
                                    className="w-full h-24 object-cover rounded-xl mb-2"
                                />
                                <h3 className="font-bold text-sm mb-1">{product.name}</h3>
                                <p className="text-primary font-bold text-xs mb-2">{product.price} FCFA</p>
                                <Link href={`/products/${product.id}`}>
                                    <button className="w-full py-1.5 bg-primary text-white text-[10px] font-bold rounded-lg hover:bg-primary/90 transition-colors">
                                        Voir le produit
                                    </button>
                                </Link>
                                <p className="text-[10px] text-muted-foreground mt-2 italic text-center">
                                    Vendu par {product.seller_name || "Producteur local"}
                                </p>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                <ChangeView center={center} zoom={userLocation ? 10 : 6} />
            </MapContainer>
        </div>
    )
}
