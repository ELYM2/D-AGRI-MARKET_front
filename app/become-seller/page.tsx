"use client"

export default function BecomeSellerPage() {
  // Redirect to seller signup
  if (typeof window !== "undefined") {
    window.location.href = "/auth/seller-signup"
  }

  return null
}
