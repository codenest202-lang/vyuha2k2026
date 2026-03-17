const API_URL = import.meta.env.VITE_API_URL || '/api';

interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: { message: string };
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = localStorage.getItem('vyuha-token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.error?.message || 'Something went wrong');
  }

  return json;
}

// Auth APIs
export const authApi = {
  sendOtp: (email: string, name: string) =>
    request('/auth/email/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, name }),
    }),

  verifyOtp: (email: string, otp: string) =>
    request<{ token: string; user: User }>('/auth/email/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    }),

  googleLogin: (googleId: string, email: string, name: string) =>
    request<{ token: string; user: User }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ googleId, email, name }),
    }),

  getMe: () => request<{ user: User }>('/auth/me'),
};

// Booking APIs
export const bookingApi = {
  create: (participants: Participant[]) =>
    request<{
      bookingId: string;
      transactionId: string;
      totalAmount: number;
      participantCount: number;
      razorpayOrderId?: string;
    }>('/bookings/create', {
      method: 'POST',
      body: JSON.stringify({ participants }),
    }),

  verifyPayment: (data: {
    bookingId: string;
    razorpayPaymentId: string;
    razorpayOrderId: string;
    razorpaySignature: string;
  }) =>
    request<{ message: string; booking: Booking }>('/bookings/verify-payment', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  getMyBookings: () =>
    request<{ bookings: Booking[] }>('/bookings/my-bookings'),

  getBooking: (id: string) =>
    request<{ booking: Booking }>(`/bookings/${id}`),
};

// Admin APIs
export const adminApi = {
  getDashboard: () =>
    request<{
      stats: DashboardStats;
      recentBookings: Booking[];
    }>('/admin/dashboard'),

  getBookings: (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.set('status', status);
    return request<{
      bookings: Booking[];
      pagination: { page: number; limit: number; total: number; pages: number };
    }>(`/admin/bookings?${params}`);
  },

  verifyQr: (transactionId: string) =>
    request<{
      message: string;
      alreadyCheckedIn: boolean;
      booking: { transactionId: string; participants: Participant[]; checkedInAt?: string };
    }>('/admin/verify-qr', {
      method: 'POST',
      body: JSON.stringify({ transactionId }),
    }),

  manualVerify: (identifier: string) =>
    request<{ booking: Booking }>('/admin/manual-verify', {
      method: 'POST',
      body: JSON.stringify({ identifier }),
    }),
};

// Chatbot API
export const chatbotApi = {
  sendMessage: (message: string) =>
    request<{ response: string }>('/chatbot/message', {
      method: 'POST',
      body: JSON.stringify({ message }),
    }),
};

// Health API
export const healthApi = {
  check: () => request<{ status: string; timestamp: string; database: string }>('/health'),
};

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  phone?: string;
  college?: string;
  year?: string;
  department?: string;
}

export interface Participant {
  name: string;
  mobile: string;
  college: string;
  year: string;
  department: string;
}

export interface Booking {
  _id: string;
  userId: string | { name: string; email: string };
  transactionId: string;
  participants: Participant[];
  totalAmount: number;
  pricePerPerson: number;
  status: 'pending' | 'confirmed' | 'failed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  qrCode: string;
  attendanceStatus: 'not-arrived' | 'attended';
  checkedInAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalBookings: number;
  confirmedBookings: number;
  totalUsers: number;
  totalRevenue: number;
  totalParticipants: number;
  attendedCount: number;
}
