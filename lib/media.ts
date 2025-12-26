import { API_BASE_URL } from "@/lib/api"

const MEDIA_PREFIX = (process.env.NEXT_PUBLIC_MEDIA_URL || "/media").replace(/\/$/, "")

export function resolveMediaUrl(path?: string | null): string | null {
  if (!path) {
    return null
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  // Remove duplicate media prefix if present
  let cleanPath = path.startsWith("/") ? path.substring(1) : path
  if (cleanPath.startsWith("media/")) {
    cleanPath = cleanPath.substring(6)
  }

  const result = `${API_BASE_URL}/media/${cleanPath}`
  return result.replace(/\/+/g, "/").replace(":/", "://")
}
