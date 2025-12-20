"use client"
import Link from "next/link"
import { useState } from "react"
import { User, LogOut, Store, MessageSquare } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/toast-notification"
import { useAuth } from "@/hooks/use-auth"

export default function AuthStatus() {
  const { me, loading, logout } = useAuth()
  const [pending, setPending] = useState(false)

  const onLogout = async () => {
    try {
      setPending(true)
      await logout()
      showToast("success", "Déconnecté", "À bientôt")
    } finally {
      setPending(false)
    }
  }

  if (loading) {
    return <span className="text-sm text-muted-foreground">Chargement...</span>
  }

  if (!me) {
    return (
      <nav className="flex items-center gap-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/auth/login">Se connecter</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth/signup">S'inscrire</Link>
        </Button>
      </nav>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{me.username.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{me.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {me.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Mon compte</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/messages" className="cursor-pointer">
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Messages</span>
          </Link>
        </DropdownMenuItem>
        {me.is_seller && (
          <DropdownMenuItem asChild>
            <Link href="/seller" className="cursor-pointer">
              <Store className="mr-2 h-4 w-4" />
              <span>Espace Vendeur</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout} disabled={pending} className="cursor-pointer text-red-600 focus:text-red-600">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Se déconnecter</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
