import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ToastContainer } from "@/components/toast-notification"
import { AuthProvider } from "@/hooks/use-auth"
import "./globals.css"

const fontSans = Space_Grotesk({ subsets: ["latin"], variable: "--font-sans" })

export const metadata: Metadata = {
  title: "LocalMarket - Achetez local, soutenez les producteurs",
  description: "Plateforme de vente en ligne pour commerçants et producteurs de vivres",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr">
      <body className={`${fontSans.className} antialiased`}>
        <AuthProvider>
          {children}
          <Analytics />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  )
}
