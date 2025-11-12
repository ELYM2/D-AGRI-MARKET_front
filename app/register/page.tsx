"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { register, getMe } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { showToast } from "@/components/toast-notification"

export default function RegisterPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [pending, setPending] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setPending(true)
      await register({ username, email, password })
      const me = await getMe()
      showToast("success", "Inscription réussie", `Bienvenue ${me?.username ?? ""}`)
      router.push("/")
    } catch (err: any) {
      showToast("error", "Échec de l’inscription", "Vérifiez les champs saisis")
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-semibold mb-4">Créer un compte</h1>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Nom d’utilisateur</label>
          <input
            className="w-full border rounded-md px-3 py-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Email (facultatif)</label>
          <input
            type="email"
            className="w-full border rounded-md px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Mot de passe</label>
          <input
            type="password"
            className="w-full border rounded-md px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" isLoading={pending} disabled={pending}>S’inscrire</Button>
      </form>
    </div>
  )
}
