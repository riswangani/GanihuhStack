import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cn } from '@/shared/lib/utils'
import { Masthead, TickerBar, Footer } from '@/shared/ui'
import { isLoggedIn, logout } from '@/features/auth'
import { getSkills } from '@/features/skills'

const NAV = [
  { to: '/',          label: 'FOR YOUR PAGE',  end: true },
  { to: '/now',       label: 'WHAT I\'M DOING'  },
  { to: '/blog',      label: 'YAPPING'   },
  { to: '/projects',  label: 'PROJECTS'    },
  { to: '/about',     label: 'ABOUT'   },
  { to: '/resume',    label: 'RESUME'    },
  { to: '/contact',   label: 'CONTACT'    },
]

const FALLBACK_TICKER = ['CLEAN ARCHITECTURE', '.NET','GO', 'REACT', 'SVELTE', 'VUE','POSTGRESQL', 'MS SQL SERVER','BACKEND', 'ARCHITECTURE']

function PageNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="relative flex items-center overflow-x-auto no-scrollbar whitespace-nowrap gap-x-5 sm:gap-x-[26px] gap-y-2 py-[14px] border-b border-ink/14 justify-start sm:justify-center px-1">
      {NAV.map(({ to, label, end }) => {
        const active = end ? pathname === to : pathname.startsWith(to)
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              'font-sans text-[12px] font-medium tracking-[0.08em] uppercase no-underline pb-[3px] border-b transition-colors duration-[120ms] shrink-0',
              active
                ? 'text-ink border-ink'
                : 'text-ink-muted border-transparent hover:text-ink'
            )}
          >
            {label}
          </Link>
        )
      })}
      {isLoggedIn() && (
        <div className="lg:absolute lg:right-0 flex items-center gap-4 shrink-0 pl-3 sm:pl-0">
          <Link to="/dashboard" className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase no-underline text-ink-muted hover:text-ink">
            DASHBOARD
          </Link>
          <button
            onClick={handleLogout}
            className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase bg-none border-none cursor-pointer text-ink-muted hover:text-ink p-0"
          >
            LOGOUT
          </button>
        </div>
      )}
    </nav>
  )
}

export default function MainLayout() {
  useLocation() // re-render on navigate so isLoggedIn() stays fresh
  const { data: skills = [] } = useQuery({ queryKey: ['skills'], queryFn: getSkills })
  const tickerItems = skills.length > 0 ? skills.map(s => s.name) : FALLBACK_TICKER

  return (
    <div className="min-h-screen bg-paper flex flex-col overflow-x-hidden">
      <div className="w-full max-w-[1040px] mx-auto px-4 sm:px-6 box-border flex-1 flex flex-col">
        <div className="pt-4 sm:pt-10">
          <Masthead />
        </div>
        <div className="border-b border-ink/14">
          <TickerBar items={tickerItems} />
        </div>
        <PageNav />
        <main className="py-11 pb-16 flex-1">
          <Outlet />
        </main>
        <div className="pb-9">
          <Footer />
        </div>
      </div>
    </div>
  )
}
