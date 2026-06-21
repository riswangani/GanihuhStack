import apiFetch, { authStore } from './api'

interface LoginResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  refreshToken: string
}

export async function login(email: string, password: string) {
  const data = await apiFetch<LoginResponse>('/api/Users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  authStore.setToken(data.accessToken)
  return data
}

export const logout = () => authStore.clear()
export const isLoggedIn = () => authStore.isLoggedIn()
