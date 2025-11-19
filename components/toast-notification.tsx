"use client"

import { useState, useEffect, useCallback } from "react"
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react"

export type ToastType = "success" | "error" | "info" | "warning"

interface Toast {
  id: string
  type: ToastType
  title: string
  message: string
  duration?: number
}

type ToastPayload = Omit<Toast, "id">

declare global {
  interface WindowEventMap {
    toast: CustomEvent<ToastPayload>
  }
}

const toastIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
}

const toastColors = {
  success: "bg-green-50 border-green-200 text-green-900",
  error: "bg-red-50 border-red-200 text-red-900",
  info: "bg-blue-50 border-blue-200 text-blue-900",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  useEffect(() => {
    const handleToast = (event: Event) => {
      const toastEvent = event as CustomEvent<ToastPayload>
      const toast = toastEvent.detail
      if (!toast) return
      const id = Math.random().toString(36).slice(2, 11)
      const newToast: Toast = { ...toast, id, duration: toast.duration || 3000 }

      setToasts((prev) => [...prev, newToast])

      if (newToast.duration) {
        setTimeout(() => {
          removeToast(id)
        }, newToast.duration)
      }
    }

    window.addEventListener("toast", handleToast)
    return () => window.removeEventListener("toast", handleToast)
  }, [removeToast])

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const Icon = toastIcons[toast.type]
        return (
          <div
            key={toast.id}
            className={`max-w-sm border rounded-lg p-4 flex gap-3 pointer-events-auto ${toastColors[toast.type]} animate-in fade-in slide-in-from-bottom-4 duration-300`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{toast.title}</p>
              <p className="text-sm opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

// CHANGE: Utility function to trigger toasts
export function showToast(type: ToastType, title: string, message: string, duration?: number) {
  if (typeof window === "undefined") return
  window.dispatchEvent(
    new CustomEvent<ToastPayload>("toast", {
      detail: { type, title, message, duration },
    }),
  )
}
