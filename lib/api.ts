const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export async function getHealth(): Promise<{ status: string; service: string } | null> {
  try {
    const res = await fetch(`${baseUrl}/api/health/`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export { baseUrl };
