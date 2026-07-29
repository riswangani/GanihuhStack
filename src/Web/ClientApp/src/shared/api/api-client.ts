function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift()
    return cookieValue ? decodeURIComponent(cookieValue) : null
  }
  return null
}

export default async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getCookie('access_token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string>),
  }

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(path, {
    ...init,
    credentials: 'include', // Cookie diset & dikirim 100% otomatis oleh Backend (C#)
    headers,
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`)
  }

  if (res.status === 204) {
    return null as T
  }

  const text = await res.text()
  if (!text || !text.trim()) {
    return null as T
  }

  return JSON.parse(text) as T
}
