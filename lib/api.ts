// API Configuration
const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

// Helper function for API calls with authentication
async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${baseUrl}${endpoint}`;

  const headers: HeadersInit = {
    ...options.headers,
  };

  // Only add Content-Type if body is not FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const defaultOptions: RequestInit = {
    headers,
    credentials: "include", // Important for JWT cookies
    ...options,
  };

  return fetch(url, defaultOptions);
}

// Health check
export async function getHealth(): Promise<{ status: string; service: string } | null> {
  try {
    const res = await apiCall("/api/health/", {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

// Products API
export async function getProducts(params?: {
  category?: number;
  search?: string;
  price_min?: number;
  price_max?: number;
  ordering?: string;
}) {
  const queryParams = new URLSearchParams();
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString());
      }
    });
  }

  const query = queryParams.toString();
  const res = await apiCall(`/api/products/${query ? `?${query}` : ""}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function getProduct(id: number) {
  const res = await apiCall(`/api/products/${id}/`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
}

export async function createProduct(formData: FormData) {
  const res = await apiCall("/api/products/", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(JSON.stringify(error));
  }
  return res.json();
}

// Categories API
export async function getCategories() {
  const res = await apiCall("/api/categories/", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

// Cart API
export async function getCart() {
  const res = await apiCall("/api/cart/", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}

export async function addToCart(productId: number, quantity: number = 1) {
  const res = await apiCall("/api/cart/add_item/", {
    method: "POST",
    body: JSON.stringify({ product_id: productId, quantity }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to add to cart");
  }
  return res.json();
}

export async function removeFromCart(itemId: number) {
  const res = await apiCall("/api/cart/remove_item/", {
    method: "POST",
    body: JSON.stringify({ item_id: itemId }),
  });

  if (!res.ok) throw new Error("Failed to remove from cart");
  return res.json();
}

export async function updateCartQuantity(itemId: number, quantity: number) {
  const res = await apiCall("/api/cart/update_quantity/", {
    method: "POST",
    body: JSON.stringify({ item_id: itemId, quantity }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to update quantity");
  }
  return res.json();
}

export async function clearCart() {
  const res = await apiCall("/api/cart/clear/", {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to clear cart");
  return res.json();
}

// Orders API
export async function getOrders() {
  const res = await apiCall("/api/orders/", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function createOrder(data: {
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
}) {
  const res = await apiCall("/api/orders/", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to create order");
  }
  return res.json();
}

// Seller API
export async function getSellerStats() {
  const res = await apiCall("/api/seller/stats/", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch seller stats");
  return res.json();
}

// Messages API
export async function getMessages(box: "inbox" | "sent" = "inbox") {
  const res = await apiCall(`/api/messages/?box=${box}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch messages");
  return res.json();
}

export async function sendMessage(data: { receiver: number; subject: string; body: string }) {
  const res = await apiCall("/api/messages/", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to send message");
  return res.json();
}

export async function markMessageAsRead(id: number) {
  const res = await apiCall(`/api/messages/${id}/mark_read/`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to mark message as read");
  return res.json();
}

// Notifications API
export async function getNotifications() {
  const res = await apiCall("/api/notifications/", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function markNotificationAsRead(id: number) {
  const res = await apiCall(`/api/notifications/${id}/mark_read/`, {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to mark notification as read");
  return res.json();
}

export async function markAllNotificationsAsRead() {
  const res = await apiCall("/api/notifications/mark_all_read/", {
    method: "POST",
  });

  if (!res.ok) throw new Error("Failed to mark all notifications as read");
  return res.json();
}
