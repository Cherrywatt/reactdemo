export type UserRole = 'USER' | 'ADMIN_OWNER' | 'ADMIN_DEVELOPER';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export async function registerUser(params: { name: string; email: string; password: string }): Promise<AuthUser> {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Error de registro');
  return res.json();
}

export async function loginUser(params: { email: string; password: string }): Promise<AuthUser> {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Credenciales inválidas');
  return res.json();
}

export async function getMe(): Promise<AuthUser | null> {
  const res = await fetch('/api/auth/me', { credentials: 'include' });
  if (res.status === 401) return null;
  if (!res.ok) throw new Error('Error obteniendo sesión');
  return res.json();
}

export async function logout(): Promise<void> {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
}

export async function requestPasswordReset(email: string): Promise<{ ok: boolean; token?: string }> {
  const res = await fetch('/api/auth/request-reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) throw new Error('No se pudo solicitar el reseteo');
  return res.json();
}

export async function resetPassword(token: string, newPassword: string): Promise<AuthUser> {
  const res = await fetch('/api/auth/reset', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ token, newPassword }),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'No se pudo resetear');
  return res.json();
}


