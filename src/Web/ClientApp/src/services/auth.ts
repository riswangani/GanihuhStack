import apiFetch from './api'

export interface UserDto {
  id: string
  email: string
  userName: string | null
}

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  return null
}

export async function login(email: string, password: string) {
  return await apiFetch('/api/Auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function logout() {
  return await apiFetch('/api/Auth/logout', {
    method: 'POST',
  })
}

export async function getCurrentUser(): Promise<UserDto | null> {
  try {
    return await apiFetch<UserDto>('/api/Auth/me')
  } catch {
    return null
  }
}

export function isLoggedIn(): boolean {
  return !!getCookie('access_token')
}
