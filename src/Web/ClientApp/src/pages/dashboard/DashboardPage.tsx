import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { isLoggedIn } from '@/features/auth'
import { getBlogPosts } from '@/features/blog'
import { getProjects } from '@/features/projects'
import { getCurrentNowStatus } from '@/features/now-status'
import { cn } from '@/lib/utils'
import { BlogManagementTab, ProjectsManagementTab, NowStatusManagementTab } from '@/features/dashboard'

export default function DashboardPage() {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [activeTab, setActiveTab] = useState<'blog' | 'projects' | 'now'>('blog')

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login', { replace: true })
    }
  }, [navigate])

  const { data: posts = [], isLoading: loadingPosts } = useQuery({ queryKey: ['blogPosts'], queryFn: getBlogPosts })
  const { data: projects = [], isLoading: loadingProjects } = useQuery({ queryKey: ['projects'], queryFn: getProjects })
  const { data: currentStatus, isLoading: loadingNow } = useQuery({ queryKey: ['nowStatus'], queryFn: getCurrentNowStatus })

  if (!isLoggedIn()) return null

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-serif text-[32px] font-bold text-ink leading-snug">Dashboard Admin</h1>
          <p className="font-sans text-sm text-ink-muted mt-1">Kelola seluruh data portfolio dan konten personal Anda.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-ink/14 gap-2">
          <button
            onClick={() => setActiveTab('blog')}
            className={cn(
              'font-sans text-[12px] font-semibold tracking-wider uppercase px-4 py-2 border-b-2 -mb-px transition-colors duration-75',
              activeTab === 'blog' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            )}
          >
            Blog
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={cn(
              'font-sans text-[12px] font-semibold tracking-wider uppercase px-4 py-2 border-b-2 -mb-px transition-colors duration-75',
              activeTab === 'projects' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            )}
          >
            Proyek
          </button>
          <button
            onClick={() => setActiveTab('now')}
            className={cn(
              'font-sans text-[12px] font-semibold tracking-wider uppercase px-4 py-2 border-b-2 -mb-px transition-colors duration-75',
              activeTab === 'now' ? 'border-ink text-ink' : 'border-transparent text-ink-muted hover:text-ink'
            )}
          >
            Status Sekarang
          </button>
        </div>

        {/* Tab Contents */}
        <div className="py-2">
          {activeTab === 'blog' && (
            <BlogManagementTab posts={posts} isLoading={loadingPosts} qc={qc} />
          )}

          {activeTab === 'projects' && (
            <ProjectsManagementTab projects={projects} isLoading={loadingProjects} qc={qc} />
          )}

          {activeTab === 'now' && (
            <NowStatusManagementTab currentStatus={currentStatus} isLoading={loadingNow} qc={qc} />
          )}
        </div>
      </div>
    </div>
  )
}
