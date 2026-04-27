// ============================================================
// UMRAH TRAVEL — API SERVICE LAYER  (v2 — verified against Postman)
// Base URL from env variable; falls back to production URL.
// ============================================================

export const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? 'https://umrah-be.onrender.com/api/v1';

const HEALTH_URL = 'https://umrah-be.onrender.com/health';

// ---- Token management (localStorage, SSR-safe) ----
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('umrah_token');
  // Auto-seed from env if nothing stored yet (dev convenience)
  if (!stored && process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
    localStorage.setItem('umrah_token', process.env.NEXT_PUBLIC_ADMIN_TOKEN);
    return process.env.NEXT_PUBLIC_ADMIN_TOKEN;
  }
  return stored;
};
export const setToken = (token: string) => {
  if (typeof window !== 'undefined') localStorage.setItem('umrah_token', token);
};
export const clearToken = () => {
  if (typeof window !== 'undefined') localStorage.removeItem('umrah_token');
};

// ---- Toast (zero-dependency) ----
export const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (typeof window === 'undefined') return;
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = `
    position:fixed;bottom:24px;right:24px;z-index:9999;
    padding:12px 20px;border-radius:12px;font-size:14px;font-weight:500;
    color:#fff;max-width:360px;box-shadow:0 4px 24px rgba(0,0,0,.4);
    background:${type === 'success' ? '#1A6B3A' : type === 'error' ? '#7A1A1A' : '#1A3A28'};
    border:1px solid ${type === 'success' ? '#2DB966' : type === 'error' ? '#FF4444' : '#C9A84C'};
    transition:opacity .3s;
  `;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 300); }, 3500);
};

// ---- Central fetch wrapper ----
type FetchOptions = RequestInit & { isFormData?: boolean };

export const fetchApi = async (endpoint: string, options: FetchOptions = {}) => {
  const { isFormData, ...fetchOptions } = options;
  const token = getToken();

  const headers: Record<string, string> = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  Object.assign(headers, fetchOptions.headers ?? {});

  // Slow-server guard — Render.com free tier wakes up in ~30s
  let slowTimer: ReturnType<typeof setTimeout> | null = setTimeout(() => {
    showToast('Server is warming up, please wait…', 'info');
  }, 10_000);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { ...fetchOptions, headers });
    if (slowTimer) { clearTimeout(slowTimer); slowTimer = null; }

    if (res.status === 401) {
      clearToken();
      showToast('Session expired. Please log in again.', 'error');
      if (typeof window !== 'undefined') window.location.href = '/auth/signin';
      return { data: null, error: 'Unauthorized' };
    }
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      const msg: string = errBody?.message ?? `HTTP ${res.status}`;
      if (res.status === 403) showToast('Access denied — wrong role.', 'error');
      else if (res.status === 404) showToast('Resource not found.', 'error');
      else if (res.status >= 500) showToast('Server error, try again.', 'error');
      else showToast(msg, 'error');
      return { data: null, error: msg };
    }

    const text = await res.text();
    return text ? JSON.parse(text) : {};
  } catch (err: any) {
    if (slowTimer) { clearTimeout(slowTimer); slowTimer = null; }
    console.warn(`[API Network Error] ${endpoint}:`, err.message);
    showToast('Check your internet connection.', 'error');
    return { data: null, error: err.message };
  }
};

// ============================================================
// ENUM TYPES  (verified from Postman collection + user spec)
// ============================================================

export type BannerPlacement = 'home_top' | 'home_middle' | 'package_list' | 'saving_dashboard';

export type DiscountType = 'percentage' | 'fixed';

export type ConfigGroup = 'franchise' | 'general' | 'payment' | 'saving';

/** category field for POST /admin/notifications/push */
export type NotificationCategory = 'system' | 'promotion' | 'booking' | 'payment' | 'general';

/** event field for POST /admin/notifications/push */
export type NotificationEvent =
  | 'booking_created'
  | 'booking_cancelled'
  | 'payment_success'
  | 'payment_failed';

/** role field for PATCH /super-admin/users/:id/role */
export type UserRole = 'user' | 'franchise' | 'admin' | 'super_admin';

export type FranchiseStatus = 'active' | 'suspended';

// ============================================================
// ADMIN ENDPOINTS  (role: admin)
// ============================================================

export const adminApi = {
  // ── Auth (admin login — no auth header needed) ────────────
  login: (email: string, password: string) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // ── Banners ───────────────────────────────────────────────
  getBanners: () =>
    fetchApi('/admin/banners'),

  /**
   * POST /admin/banners — multipart/form-data
   * Pass a FormData instance; do NOT set Content-Type manually.
   * Required fields: title, link, placement, isActive, validFrom, validTo, image (File)
   */
  createBanner: (formData: FormData) =>
    fetchApi('/admin/banners', { method: 'POST', body: formData, isFormData: true }),

  // ── Offers / Coupons ──────────────────────────────────────
  getOffers: () =>
    fetchApi('/admin/offers'),

  createOffer: (data: {
    code: string;
    title: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    minPurchaseAmount: number;
    maxDiscountAmount: number;
    validFrom: string;          // ISO 8601
    validTo: string;            // ISO 8601
    usageLimit: number;
    perUserLimit: number;
    isActive: boolean;
    applicablePackages?: string[];
  }) => fetchApi('/admin/offers', { method: 'POST', body: JSON.stringify(data) }),

  // ── System Config ─────────────────────────────────────────
  getConfig: () =>
    fetchApi('/admin/config'),

  upsertConfig: (data: {
    key: string;
    value: unknown;
    description?: string;
    group: ConfigGroup;
  }) => fetchApi('/admin/config', { method: 'POST', body: JSON.stringify(data) }),

  // ── Push Notifications ────────────────────────────────────
  /**
   * POST /admin/notifications/push
   * Fields verified from Postman: userId, title, message, category, event, data{}
   * NOTE: the field is 'category' + 'event' — NOT 'type'
   */
  sendPushNotification: (data: {
    userId: string;
    title: string;
    message: string;
    category: NotificationCategory;
    event: NotificationEvent;
    data?: Record<string, unknown>;
  }) => fetchApi('/admin/notifications/push', { method: 'POST', body: JSON.stringify(data) }),
};

// ============================================================
// SUPER ADMIN ENDPOINTS  (role: super_admin)
// ============================================================

export const superAdminApi = {
  // ── Auth (super admin login) ──────────────────────────────
  login: (email: string, password: string) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // ── Admin accounts ────────────────────────────────────────
  createAdmin: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => fetchApi('/super-admin/admins', { method: 'POST', body: JSON.stringify(data) }),

  // ── User roles ────────────────────────────────────────────
  /**
   * PATCH /super-admin/users/:id/role
   * role enum: 'user' | 'franchise' | 'admin' | 'super_admin'
   *
   * Admin     = internal system operator (manages users, bookings, payments)
   * Franchise = external business partner (brings customers, earns commission)
   */
  updateUserRole: (id: string, role: UserRole) =>
    fetchApi(`/super-admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),

  // ── Franchise management ──────────────────────────────────
  getFranchises: () =>
    fetchApi('/super-admin/franchises'),

  approveFranchise: (id: string) =>
    fetchApi(`/super-admin/franchises/${id}/approve`, { method: 'PATCH' }),

  updateFranchiseStatus: (id: string, status: FranchiseStatus) =>
    fetchApi(`/super-admin/franchises/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),

  // ── Analytics ─────────────────────────────────────────────
  /**
   * GET /super-admin/analytics
   * Response: { status, data: { totalUsers, totalBookings, totalFranchises, totalRevenue } }
   */
  getAnalytics: () =>
    fetchApi('/super-admin/analytics'),
};

// ============================================================
// HEALTH CHECK  (no auth required)
// ============================================================

export const checkHealth = async (): Promise<'live' | 'issue'> => {
  try {
    const res = await fetch(HEALTH_URL, { cache: 'no-store' });
    const json = await res.json().catch(() => ({}));
    return json?.status === 'success' ? 'live' : 'issue';
  } catch {
    return 'issue';
  }
};

// ============================================================
// UTILITIES
// ============================================================

/** Format as Indian Rupee: 1250000 → ₹12,50,000 */
export const formatINR = (value: number): string =>
  `₹${value.toLocaleString('en-IN')}`;

/** Convert any date input to ISO 8601 string for API */
export const toISO = (date: string | Date): string =>
  new Date(date).toISOString();
