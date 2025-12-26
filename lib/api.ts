// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

// Helper function for API calls with authentication
async function apiCall(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    ...options.headers,
  };

  // Only add Content-Type if body is not FormData
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const defaultOptions: RequestInit = {
    headers,
    credentials: "include", // Important for JWT cookies
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    return response;
  } catch (error) {
    // Handle network errors (API unavailable, CORS issues, etc.)
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Impossible de se connecter au serveur. Vérifiez que le backend est démarré.");
    }
    throw error;
  }
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
  owner?: number;
  is_active?: boolean;
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

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = "Échec du chargement des produits";
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      errorMessage = res.status === 404 ? "Produits non trouvés" : errorMessage;
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function getProduct(id: number) {
  const res = await apiCall(`/api/products/${id}/`, {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Produit non trouvé");
    }
    const errorText = await res.text();
    let errorMessage = "Échec du chargement du produit";
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Use default error message
    }
    throw new Error(errorMessage);
  }
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

  if (!res.ok) {
    const errorText = await res.text();
    let errorMessage = "Échec du chargement des catégories";
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Use default error message
    }
    throw new Error(errorMessage);
  }
  return res.json();
}

// Cart API
export async function getCart() {
  const res = await apiCall("/api/cart/", {
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("Vous devez être connecté pour voir votre panier");
    }
    const errorText = await res.text();
    let errorMessage = "Échec du chargement du panier";
    try {
      const errorData = JSON.parse(errorText);
      errorMessage = errorData.detail || errorData.message || errorMessage;
    } catch {
      // Use default error message
    }
    throw new Error(errorMessage);
  }
  const data = await res.json();
  return Array.isArray(data) ? data[0] : data;
}



export async function getFavorites() {
  const res = await apiCall("/api/favorites/", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch favorites");
  return res.json();
}

export async function toggleFavorite(productId: number) {
  const res = await apiCall("/api/favorites/toggle/", {
    method: "POST",
    body: JSON.stringify({ product_id: productId }),
  });

  if (!res.ok) {
    let message = "Failed to toggle favorite";
    try {
      const error = await res.json();
      message = error.error || error.detail || message;
    } catch {
      // keep default message
    }
    throw new Error(message);
  }
  return res.json();
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

export async function getOrder(id: number) {
  const res = await apiCall(`/api/orders/${id}/`, {
    cache: "no-store",
  })

  if (!res.ok) {
    const message = res.status === 404 ? "Commande introuvable" : "Failed to fetch order"
    throw new Error(message)
  }
  return res.json()
}

export async function updateOrderStatus(
  id: number,
  status: "pending" | "processing" | "delivered" | "cancelled",
  reason?: string
) {
  const res = await apiCall(`/api/orders/${id}/update_status/`, {
    method: "POST",
    body: JSON.stringify({ status, ...(reason ? { reason } : {}) }),
  })

  if (!res.ok) {
    let message = "Impossible de mettre à jour le statut"
    try {
      const error = await res.json()
      message = error.error || error.detail || message
    } catch {
      // keep default
    }
    throw new Error(message)
  }
  return res.json()
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

// Payments (simulated for MoMo / OM)
export async function initiateMobilePayment(payload: { method: "momo" | "om"; amount: number; phone: string }) {
  const res = await apiCall("/api/payments/mobile/", {
    method: "POST",
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    let message = "Échec du paiement mobile"
    try {
      const error = await res.json()
      message = error.detail || error.error || message
    } catch {
      // keep default
    }
    throw new Error(message)
  }
  return res.json()
}

// Seller product management
export async function updateProduct(
  id: number,
  data: Partial<{
    name: string
    description: string
    price: number
    old_price: number
    stock: number
    category: number
    is_active: boolean
  }>
) {
  const res = await apiCall(`/api/products/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    let message = "Failed to update product"
    try {
      const error = await res.json()
      message = error.detail || error.error || message
    } catch {
      // keep default message
    }
    throw new Error(message)
  }
  return res.json()
}

export async function deleteProduct(id: number) {
  const res = await apiCall(`/api/products/${id}/`, {
    method: "DELETE",
  })

  if (!res.ok) {
    let message = "Failed to delete product"
    try {
      const error = await res.json()
      message = error.detail || error.error || message
    } catch {
      // keep default message
    }
    throw new Error(message)
  }
  return true
}

// Seller API
export async function getSellerStats() {
  const res = await apiCall("/api/seller-stats/", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Échec du chargement des statistiques vendeur");
  return res.json();
}

export async function getSellers() {
  const res = await apiCall("/api/auth/sellers/", {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch sellers");
  return res.json();
}

export async function getSeller(id: number) {
  const res = await apiCall(`/api/auth/sellers/${id}/`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch seller");
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

// Cart & Delivery
export async function getDeliveryFee(latitude: number, longitude: number) {
  const res = await apiCall(`/api/cart/calculate_delivery_fee/?latitude=${latitude}&longitude=${longitude}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Impossible de calculer les frais de livraison");
  return res.json();
}
