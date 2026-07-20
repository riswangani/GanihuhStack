import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import JurnalPage from '@/pages/JurnalPage'
import PostPage from '@/pages/PostPage'
import LoginPage from '@/pages/LoginPage'
import DashboardPage from '@/pages/DashboardPage'
import NowPage from '@/pages/NowPage'
import ProjectsPage from '@/pages/ProjectsPage'
import AboutPage from '@/pages/AboutPage'
import ResumePage from '@/pages/ResumePage'
import ContactPage from '@/pages/ContactPage'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/"          element={<HomePage />} />
            <Route path="/now"       element={<NowPage />} />
            <Route path="/blog"      element={<JurnalPage />} />
            <Route path="/blog/:slug" element={<PostPage />} />
            <Route path="/projects"  element={<ProjectsPage />} />
            <Route path="/about"     element={<AboutPage />} />
            <Route path="/resume"    element={<ResumePage />} />
            <Route path="/contact"   element={<ContactPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/login"     element={<LoginPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

