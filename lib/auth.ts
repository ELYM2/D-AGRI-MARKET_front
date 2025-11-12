import { baseUrl } from "./api";

type Tokens = { access: string; refresh: string };

function dispatchAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:changed"));
  }
}

function saveTokens(tokens: Tokens) {
  if (typeof window === "undefined") return;
  localStorage.setItem("access", tokens.access);
  localStorage.setItem("refresh", tokens.refresh);
  dispatchAuthChange();
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access");
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("refresh");
}

export function clearTokens() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  dispatchAuthChange();
}

export function getAuthHeaders() {
  const token = getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function register(payload: { username: string; email?: string; password: string }) {
  const res = await fetch(`${baseUrl}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Registration failed");
  const data = await res.json();
  if (data?.access && data?.refresh) {
    saveTokens({ access: data.access, refresh: data.refresh });
  }
  return data;
}

export async function login(payload: { username: string; password: string }) {
  const res = await fetch(`${baseUrl}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Login failed");
  const data = (await res.json()) as Tokens;
  saveTokens(data);
  return data;
}

export async function refresh() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token");
  const res = await fetch(`${baseUrl}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });
  if (!res.ok) throw new Error("Refresh failed");
  const data = (await res.json()) as { access: string };
  if (typeof window !== "undefined") localStorage.setItem("access", data.access);
  dispatchAuthChange();
  return data;
}

export async function getMe() {
  // First attempt with current access token
  let res = await fetch(`${baseUrl}/api/auth/me/`, {
    headers: { ...getAuthHeaders() },
    cache: "no-store",
  });
  if (res.status === 401) {
    // Try to refresh access token once
    try {
      await refresh();
      res = await fetch(`${baseUrl}/api/auth/me/`, {
        headers: { ...getAuthHeaders() },
        cache: "no-store",
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
    headers: { "Content-Type": "application/json", ...getAuthHeaders() },
    body: JSON.stringify(payload),
  });
  if (res.status === 401) throw new Error("Unauthorized");
  if (!res.ok) throw new Error("Change password failed");
}

export async function logout() {
  const refresh = getRefreshToken();
  try {
    if (refresh) {
      await fetch(`${baseUrl}/api/auth/logout/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAuthHeaders() },
        body: JSON.stringify({ refresh }),
      });
    }
  } finally {
    clearTokens();
  }
}
