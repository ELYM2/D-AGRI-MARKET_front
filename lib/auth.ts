import { baseUrl } from "./api";

function dispatchAuthChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("auth:changed"));
  }
}

export async function register(payload: { username: string; email?: string; password: string }) {
  const res = await fetch(`${baseUrl}/api/auth/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Registration failed");
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
  if (!res.ok) throw new Error("Login failed");
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
  first_name?: string;
  last_name?: string;
  email?: string;
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
