// ── Chirpy API client ──
// Typed fetch wrappers for all backend endpoints

const BASE = '/api';

// ── Types ──

export interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  isChirpyRed: boolean;
}

export interface AuthResponse extends User {
  token: string;
  refreshToken: string;
}

export interface Chirp {
  id: string;
  body: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// ── Error class ──

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// ── Helpers ──

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new ApiError(res.status, text);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json();
}

function authHeaders(token: string): HeadersInit {
  return { Authorization: `Bearer ${token}` };
}

// ── Auth ──

export async function login(email: string, password: string): Promise<AuthResponse> {
  return request<AuthResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string): Promise<User> {
  return request<User>('/users', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function refreshToken(token: string): Promise<{ token: string }> {
  return request<{ token: string }>('/refresh', {
    method: 'POST',
    headers: authHeaders(token),
  });
}

export async function revokeToken(token: string): Promise<void> {
  return request<void>('/revoke', {
    method: 'POST',
    headers: authHeaders(token),
  });
}

// ── Chirps ──

export async function getChirps(
  sort: 'asc' | 'desc' = 'desc',
  authorId?: string,
): Promise<Chirp[]> {
  const params = new URLSearchParams({ sort });
  if (authorId) params.set('authorId', authorId);
  return request<Chirp[]>(`/chirps?${params}`);
}

export async function createChirp(body: string, token: string): Promise<Chirp> {
  return request<Chirp>('/chirps', {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify({ body }),
  });
}

export async function deleteChirp(chirpId: string, token: string): Promise<void> {
  return request<void>(`/chirps/${chirpId}`, {
    method: 'DELETE',
    headers: authHeaders(token),
  });
}
