// API Service for POINT+

export interface Game {
  id: number;
  slug: string;
  name: string;
  description: string;
  logo: string;
  banner: string;
  active: number | boolean;
  has_server_id: number | boolean;
  player_label?: string;
  server_label?: string;
  product_count?: number;
  products?: Product[];
}

export interface Product {
  id: number;
  game_id: number;
  name: string;
  amount: string;
  price: number;
  active: number | boolean;
  game_name?: string;
  game_slug?: string;
}

export interface Order {
  id: number;
  order_id: string;
  user_id: number;
  game_id: number;
  product_id: number;
  player_id: string;
  server_id?: string | null;
  total_amount: number;
  payment_method: string;
  status: 'PENDING_PAYMENT' | 'WAITING_VERIFICATION' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'REJECTED' | 'EXPIRED' | 'CANCELLED';
  rejection_reason?: string | null;
  process_note?: string | null;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  game_name?: string;
  game_slug?: string;
  game_logo?: string;
  game_banner?: string;
  player_label?: string;
  server_label?: string;
  has_server_id?: number | boolean;
  product_name?: string;
  product_amount?: string;
  proof_path?: string | null;
  proof_filename?: string | null;
  proof_mime?: string | null;
  proof_size?: number | null;
  proof_uploaded_at?: string | null;
  proof_verified_at?: string | null;
  verified_by_name?: string | null;
}

// Configurable API Base URL for Netlify <-> Vercel separation
const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export function apiUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${API_BASE}${path}`;
}

async function apiFetch(inputPath: string, init: RequestInit = {}): Promise<Response> {
  const url = apiUrl(inputPath);
  const options: RequestInit = {
    ...init,
    credentials: 'include',
  };
  return fetch(url, options);
}

export const api = {
  // Games
  async getGames(): Promise<Game[]> {
    const res = await apiFetch('/api/games');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat game');
    return data.games;
  },

  async getGameBySlug(slug: string): Promise<Game> {
    const res = await apiFetch(`/api/games/${slug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Game tidak ditemukan');
    return data.game;
  },

  // Orders
  async createOrder(payload: {
    gameId: number;
    productId: number;
    playerId: string;
    serverId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    paymentMethod?: string;
  }): Promise<{ orderId: string; totalAmount: number; status: string }> {
    const res = await apiFetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal membuat pesanan');
    return data.order;
  },

  async getOrder(id: string): Promise<Order> {
    const res = await apiFetch(`/api/orders/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Pesanan tidak ditemukan');
    return data.order;
  },

  async uploadPaymentProof(orderId: string, file: File): Promise<{ proofPath: string; message: string }> {
    const formData = new FormData();
    formData.append('proof', file);

    const res = await apiFetch(`/api/orders/${orderId}/payment-proof`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal mengunggah bukti pembayaran');
    return data;
  },

  async checkOrder(orderId: string, identifier: string): Promise<Order> {
    const params = new URLSearchParams({ order_id: orderId, identifier });
    const res = await apiFetch(`/api/orders/check?${params.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Pesanan tidak ditemukan atau data tidak cocok');
    return data.order;
  },

  // Admin APIs
  async adminLogin(email: string, password: string) {
    const res = await apiFetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login gagal');
    return data;
  },

  async adminLogout() {
    const res = await apiFetch('/api/admin/logout', { method: 'POST' });
    return res.json();
  },

  async getAdminMe() {
    const res = await apiFetch('/api/admin/me');
    if (!res.ok) return null;
    const data = await res.json();
    return data.admin;
  },

  async getAdminStatistics() {
    const res = await apiFetch('/api/admin/statistics');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat statistik');
    return data.statistics;
  },

  async getAdminOrders(params: { status?: string; search?: string; page?: number; limit?: number }) {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    if (params.page) query.set('page', params.page.toString());
    if (params.limit) query.set('limit', params.limit.toString());

    const res = await apiFetch(`/api/admin/orders?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat pesanan');
    return data;
  },

  async getAdminOrderDetail(id: string) {
    const res = await apiFetch(`/api/admin/orders/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Pesanan tidak ditemukan');
    return data;
  },

  async approveOrder(id: string) {
    const res = await apiFetch(`/api/admin/orders/${id}/approve`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menyetujui pesanan');
    return data;
  },

  async rejectOrder(id: string, reason: string) {
    const res = await apiFetch(`/api/admin/orders/${id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menolak pesanan');
    return data;
  },

  async processOrder(id: string, note?: string) {
    const res = await apiFetch(`/api/admin/orders/${id}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memproses pesanan');
    return data;
  },

  async completeOrder(id: string, note?: string) {
    const res = await apiFetch(`/api/admin/orders/${id}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menyelesaikan pesanan');
    return data;
  },

  async getAdminUsers() {
    const res = await apiFetch('/api/admin/users');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat pengguna');
    return data.users;
  },

  async getAdminNotifications() {
    const res = await apiFetch('/api/admin/notifications');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat notifikasi');
    return data;
  },

  async markNotificationRead(id: number) {
    const res = await apiFetch(`/api/admin/notifications/${id}/read`, { method: 'POST' });
    return res.json();
  },

  async markAllNotificationsRead() {
    const res = await apiFetch('/api/admin/notifications/read-all', { method: 'POST' });
    return res.json();
  },

  async getAdminActivity() {
    const res = await apiFetch('/api/admin/activity');
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat aktivitas');
    return data.logs;
  },

  async getAdminProducts(gameId?: number) {
    const url = gameId ? `/api/admin/products?game_id=${gameId}` : '/api/admin/products';
    const res = await apiFetch(url);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memuat produk');
    return data;
  },

  async createAdminProduct(payload: { game_id: number; name: string; amount: string; price: number; active?: boolean }) {
    const res = await apiFetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menambah produk');
    return data;
  },

  async updateAdminProduct(id: number, payload: Partial<Product>) {
    const res = await apiFetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal memperbarui produk');
    return data;
  },

  async deleteAdminProduct(id: number) {
    const res = await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Gagal menghapus produk');
    return data;
  },
};
