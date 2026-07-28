export default async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    ...init,
    credentials: 'include', // Cookie diset & dikirim 100% otomatis oleh Backend (C#)
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })

  if (!res.ok) {
    throw new Error(`${res.status} ${res.statusText}`)
  }

  if (res.status === 204) {
    return null as T
  }

  return res.json() as Promise<T>
}
