import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import JurnalPage from '@/pages/JurnalPage'
import LoginPage from '@/pages/LoginPage'

const queryClient = new QueryClient()

function Placeholder({ label }: { label: string }) {
  return <p className="text-ink-muted py-12 text-sm">{label} — coming soon</p>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/"          element={<HomePage />} />
            <Route path="/now"       element={<Placeholder label="Now" />} />
            <Route path="/blog"      element={<JurnalPage />} />
            <Route path="/projects"  element={<Placeholder label="Projects" />} />
            <Route path="/about"     element={<Placeholder label="About" />} />
            <Route path="/resume"    element={<Placeholder label="Resume" />} />
            <Route path="/contact"   element={<Placeholder label="Contact" />} />
            <Route path="/dashboard" element={<Placeholder label="Dashboard" />} />
            <Route path="/login"     element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
