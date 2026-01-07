import { API_BASE_URL, setTokens, clearTokens, getRefreshToken } from "./api";
const baseUrl = API_BASE_URL;

function dispatchAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:changed"));
  }
}

export type RegisterPayload = {
  username: string;
  email?: string;
  password: string;
  first_name?: string;
  last_name?: string;
  is_seller?: boolean;
  business_name?: string;
  business_description?: string;
  business_address?: string;
  business_city?: string;
  business_postal_code?: string;
  business_country?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
};

export async function register(payload: RegisterPayload) {
  const res = await fetch(`${baseUrl}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    // credentials: "include", // Not needed for header auth
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
  if (data.access && data.refresh) {
    setTokens(data.access, data.refresh);
  }
  dispatchAuthChange();
  return data;
}

export async function login(payload: { username: string; password: string }) {
  const res = await fetch(`${baseUrl}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
    // credentials: "include",
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

  if (data.access && data.refresh) {
    setTokens(data.access, data.refresh);
  }

  // No wait needed for localStorage!
  dispatchAuthChange();
  return data;
}

export async function refresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  const res = await fetch(`${baseUrl}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
    // credentials: "include",
  });
  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json();
  if (data.access) {
    // Refresh endpoint might only return access token
    setTokens(data.access, data.refresh || refreshToken);
  }
  dispatchAuthChange();
  return data;
}

export async function getMe() {
  // First attempt with current access token
  // apiCall handles headers automatically now
  const { getSeller } = await import('./api');
  // Need to import apiCall or use fetch with manual headers if circular dependency issues
  // But getMe is used in useAuth, so we can just use the exported apiCall from api.ts via a small refactor or direct fetch. 

  // To avoid circular dependency, we used a direct fetch with helpers imported from api.ts
  const { getAccessToken } = await import('./api');
  const token = getAccessToken();

  let res = await fetch(`${baseUrl}/api/auth/me/`, {
    cache: "no-store",
    headers: token ? { "Authorization": `Bearer ${token}` } : {},
    // credentials: "include",
  });

  if (res.status === 401) {
    // Try to refresh access token once (without dispatching auth:changed to avoid loops)
    try {
      const refreshData = await refresh(); // This calls the export refresh function which updates tokens

      // Retry me/ with new token
      if (refreshData && refreshData.access) {
        res = await fetch(`${baseUrl}/api/auth/me/`, {
          cache: "no-store",
          headers: { "Authorization": `Bearer ${refreshData.access}` },
        });
      } else {
        return null;
      }
    } catch {
      // En cas d'erreur réseau ou autre, retourner null
      return null;
    }
  }

  if (res.status === 401) return null;
  if (!res.ok) throw new Error("Failed to fetch profile");
  return res.json();
}

export async function changePassword(payload: { current_password: string; new_password: string }) {
  const { getAccessToken } = await import('./api');
  const token = getAccessToken();

  const res = await fetch(`${baseUrl}/api/auth/password/change/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: JSON.stringify(payload),
    // credentials: "include",
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Change password failed");
}

export async function logout() {
  // We can try to notify server, but clear locally primarily
  try {
    const { getAccessToken } = await import('./api');
    const token = getAccessToken();
    if (token) {
      await fetch(`${baseUrl}/api/auth/logout/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({}),
      });
    }
  } catch (e) {
    // Ignore logout errors
  }

  clearTokens();
  dispatchAuthChange();
}

export type UpdateProfilePayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  is_seller?: boolean;
  business_name?: string;
  business_description?: string;
  business_address?: string;
  business_city?: string;
  business_postal_code?: string;
  business_country?: string;
  min_order_amount?: number;
  delivery_time?: string;
  terms_of_sale?: string;
  mon_open?: string;
  mon_close?: string;
  sat_open?: string;
  sat_close?: string;
  sun_open?: string;
  sun_close?: string;
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
