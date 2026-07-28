import { Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/home'
import NowPage from '@/pages/now'
import { JurnalPage, PostPage } from '@/pages/blog'
import ProjectsPage from '@/pages/projects'
import AboutPage from '@/pages/about'
import ResumePage from '@/pages/resume'
import ContactPage from '@/pages/contact'
import DashboardPage from '@/pages/dashboard'
import LoginPage from '@/pages/auth'

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/"           element={<HomePage />} />
        <Route path="/now"        element={<NowPage />} />
        <Route path="/blog"       element={<JurnalPage />} />
        <Route path="/blog/:slug" element={<PostPage />} />
        <Route path="/projects"   element={<ProjectsPage />} />
        <Route path="/about"      element={<AboutPage />} />
        <Route path="/resume"     element={<ResumePage />} />
        <Route path="/contact"    element={<ContactPage />} />
        <Route path="/dashboard"  element={<DashboardPage />} />
        <Route path="/login"      element={<LoginPage />} />
      </Route>
    </Routes>
  )
}
