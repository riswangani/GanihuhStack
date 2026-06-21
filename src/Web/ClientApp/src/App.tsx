import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from './layouts/MainLayout'
import JurnalPage from './pages/JurnalPage'
import LoginPage from './pages/LoginPage'

const queryClient = new QueryClient()

function Placeholder({ label }: { label: string }) {
  return <p className="page-state">{label} — coming soon</p>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Placeholder label="Beranda" />} />
            <Route path="/sekarang" element={<Placeholder label="Sekarang" />} />
            <Route path="/jurnal" element={<JurnalPage />} />
            <Route path="/proyek" element={<Placeholder label="Proyek" />} />
            <Route path="/tentang" element={<Placeholder label="Tentang" />} />
            <Route path="/resume" element={<Placeholder label="Resume" />} />
            <Route path="/kontak" element={<Placeholder label="Kontak" />} />
            <Route path="/dashboard" element={<Placeholder label="Dashboard" />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
