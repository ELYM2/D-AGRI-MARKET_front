"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function SellerCTA() {
    const { me: user } = useAuth()

    if (user?.is_seller) {
        return (
            <Link href="/seller">
                <Button size="lg" variant="outline">
                    Accéder au tableau de bord
                </Button>
            </Link>
        )
    }

    return (
        <Link href="/auth/seller-signup">
            <Button size="lg" variant="outline">
                Devenir producteur
            </Button>
        </Link>
    )
}
