import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '@/services/auth'
import Headline from '@/components/content/Headline'
import Button from '@/components/core/Button'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/dashboard')
    } catch {
      setError('Email atau password salah.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-sm py-2 pb-12">
      <span className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase text-ink-muted">
        Dashboard · Masuk
      </span>
      <Headline size="xl" as="h1" className="mt-[18px] mb-9">Masuk</Headline>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && <p className="text-[#b94040] text-sm">{error}</p>}

        <label className="flex flex-col gap-2 font-sans text-[11px] font-medium tracking-[0.1em] uppercase text-ink-muted">
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="border-0 border-b border-ink/14 bg-transparent py-2 font-sans text-base text-ink outline-none transition-colors duration-[120ms] focus:border-ink"
          />
        </label>

        <label className="flex flex-col gap-2 font-sans text-[11px] font-medium tracking-[0.1em] uppercase text-ink-muted">
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="border-0 border-b border-ink/14 bg-transparent py-2 font-sans text-base text-ink outline-none transition-colors duration-[120ms] focus:border-ink"
          />
        </label>

        <Button type="submit" disabled={loading} className="self-start mt-2">
          {loading ? 'Memproses...' : 'Masuk'}
        </Button>
      </form>
    </div>
  )
}
