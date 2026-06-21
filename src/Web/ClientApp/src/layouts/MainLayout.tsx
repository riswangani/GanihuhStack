import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { isLoggedIn, logout } from '../services/auth'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
  { to: '/', label: 'BERANDA', end: true },
  { to: '/sekarang', label: 'SEKARANG' },
  { to: '/jurnal', label: 'JURNAL' },
  { to: '/proyek', label: 'PROYEK' },
  { to: '/tentang', label: 'TENTANG' },
  { to: '/resume', label: 'RESUME' },
  { to: '/kontak', label: 'KONTAK' },
]

export default function MainLayout() {
  useLocation() // re-render on navigate so isLoggedIn() reflects current state
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="site-wrapper">
      <header className="masthead">
        <div className="masthead-grid">
          <span>GANI</span>
          <span>DEV</span>
          <span className="masthead-title">GANIHUHSTACK</span>
          <span>EST. 2024</span>
          <span>NO. 001</span>
        </div>
        <nav className="main-nav">
          {NAV_LINKS.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end}>{label}</NavLink>
          ))}
          <span className="nav-spacer" />
          {isLoggedIn() ? (
            <button onClick={handleLogout} className="nav-auth">KELUAR</button>
          ) : (
            <Link to="/login" className="nav-auth">MASUK</Link>
          )}
        </nav>
        <hr className="masthead-rule" />
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <span>VOL. 1 — NO. 001</span>
        <span>GANIHUHSTACK.DEV</span>
      </footer>
    </div>
  )
}
