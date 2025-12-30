const isBrowser = typeof window !== "undefined";
// Use relative URL in browser to leverage Next.js rewrites, absolute in server
const baseUrl = isBrowser ? "" : (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000");

function dispatchAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:changed"));
  }
}

export interface RegisterData {
  username: string
  email?: string
  password: string
  first_name?: string
  last_name?: string
  is_seller?: boolean
  business_name?: string
  business_description?: string
  business_address?: string
  business_city?: string
  business_postal_code?: string
  business_country?: string
  phone?: string
  address?: string
  city?: string
  postal_code?: string
}

export async function register(payload: RegisterData) {
  const res = await fetch(`${baseUrl}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) {
    let errorMessage = "Registration failed";
    try {
      const errorData = await res.json();
      // Handle Django REST Framework validation errors
      if (errorData && typeof errorData === "object") {
        const errors = Object.entries(errorData)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(", ")}`;
          })
          .join("; ");
        errorMessage = errors || errorMessage;
      }
    } catch {
      // If JSON parsing fails, use status text
      errorMessage = `Registration failed: ${res.status} ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }
  const data = await res.json();
  dispatchAuthChange();
  return data;
}

export async function login(payload: { username: string; password: string }) {
  const res = await fetch(`${baseUrl}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) {
    let errorMessage = "Login failed";
    try {
      const errorData = await res.json();
      if (errorData && typeof errorData === "object") {
        const errors = Object.entries(errorData)
          .map(([field, messages]) => {
            const msgArray = Array.isArray(messages) ? messages : [messages];
            return `${field}: ${msgArray.join(", ")}`;
          })
          .join("; ");
        errorMessage = errors || errorMessage;
      }
    } catch {
      errorMessage = `Login failed: ${res.status} ${res.statusText}`;
    }
    throw new Error(errorMessage);
  }
  const data = await res.json();
  dispatchAuthChange();
  return data;
}

export async function refresh() {
  const res = await fetch(`${baseUrl}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json();
  dispatchAuthChange();
  return data;
}

export async function getMe() {
  // First attempt with current access token
  let res = await fetch(`${baseUrl}/api/auth/me/`, {
    cache: "no-store",
    credentials: "include",
  });
  if (res.status === 401) {
    // Try to refresh access token once
    try {
      await refresh();
      res = await fetch(`${baseUrl}/api/auth/me/`, {
        cache: "no-store",
        credentials: "include",
      });
    } catch {
      return null;
    }
  }
  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function changePassword(payload: { current_password: string; new_password: string }) {
  const res = await fetch(`${baseUrl}/api/auth/password/change/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Change password failed");
}

export async function logout() {
  await fetch(`${baseUrl}/api/auth/logout/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
    credentials: "include",
  });
  dispatchAuthChange();
}

export type UpdateProfilePayload = {
  is_seller?: boolean;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  business_name?: string;
  business_description?: string;
  business_address?: string;
  business_city?: string;
  business_postal_code?: string;
  business_country?: string;
  min_order_amount?: number;
  delivery_time?: string;
  terms_of_sale?: string;
  mon_open?: string | null;
  mon_close?: string | null;
  sat_open?: string | null;
  sat_close?: string | null;
  sun_open?: string | null;
  sun_close?: string | null;
};

export async function updateProfile(payload: UpdateProfilePayload) {
  const res = await fetch(`${baseUrl}/api/auth/me/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Profile update failed");
  return res.json();
}
