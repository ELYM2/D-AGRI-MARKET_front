import { API_BASE_URL } from "@/lib/api"

const MEDIA_PREFIX = (process.env.NEXT_PUBLIC_MEDIA_URL || "/media").replace(/\/$/, "")

export function resolveMediaUrl(path?: string | null): string | null {
  if (!path) {
    return null
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path
  }

  const normalized = path.startsWith("/") ? path : `/${path}`
  const mediaPath = normalized.startsWith("/media") ? normalized : `${MEDIA_PREFIX}${normalized}`
  return `${API_BASE_URL}${mediaPath}`
}
