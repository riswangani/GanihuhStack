import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import Masthead from '@/components/brand/Masthead'
import TickerBar from '@/components/brand/TickerBar'
import Footer from '@/components/brand/Footer'
import { isLoggedIn, logout } from '@/services/auth'

const NAV = [
  { to: '/',          label: 'BERANDA',  end: true },
  { to: '/sekarang',  label: 'SEKARANG'            },
  { to: '/jurnal',    label: 'JURNAL'               },
  { to: '/proyek',    label: 'PROYEK'               },
  { to: '/tentang',   label: 'TENTANG'              },
  { to: '/resume',    label: 'RESUME'               },
  { to: '/kontak',    label: 'KONTAK'               },
]

const TICKER = ['CLEAN ARCHITECTURE', '.NET', 'REACT', 'POSTGRESQL', 'BACKEND', 'ARSITEKTUR']

function PageNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="flex flex-wrap items-center gap-[26px] py-[14px] border-b border-ink/14">
      {NAV.map(({ to, label, end }) => {
        const active = end ? pathname === to : pathname.startsWith(to)
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              'font-sans text-[12px] font-medium tracking-[0.08em] uppercase no-underline pb-[3px] border-b transition-colors duration-[120ms]',
              active
                ? 'text-ink border-ink'
                : 'text-ink-muted border-transparent hover:text-ink'
            )}
          >
            {label}
          </Link>
        )
      })}
      <span className="flex-1" />
      {isLoggedIn() ? (
        <>
          <Link to="/dashboard" className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase no-underline text-ink-muted hover:text-ink">
            DASHBOARD
          </Link>
          <button
            onClick={handleLogout}
            className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase bg-none border-none cursor-pointer text-ink-muted hover:text-ink p-0"
          >
            KELUAR
          </button>
        </>
      ) : (
        <Link to="/login" className="font-sans text-[12px] font-medium tracking-[0.08em] uppercase no-underline text-ink-muted hover:text-ink">
          MASUK
        </Link>
      )}
    </nav>
  )
}

export default function MainLayout() {
  useLocation() // re-render on navigate so isLoggedIn() stays fresh
  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <div className="w-full max-w-[1040px] mx-auto px-6 box-border flex-1 flex flex-col">
        <div className="pt-10">
          <Masthead />
        </div>
        <div className="border-b border-ink/14">
          <TickerBar items={TICKER} />
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
