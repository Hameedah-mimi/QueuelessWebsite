import { Link, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

export default function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-ink-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-full border-[3px] border-ink-900 flex items-center justify-center">
              <div className="w-3 h-3 bg-brand-500 rounded-sm rotate-45 -translate-y-0.5" />
            </div>
            <span className="text-xl font-extrabold text-ink-900">
              Queue<span className="text-brand-500">Less</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink-700">
            <Link to="/" className="hover:text-brand-600 transition">Home</Link>
            <Link to="/explore" className="hover:text-brand-600 transition">Explore</Link>
            <a href="#how" className="hover:text-brand-600 transition">How it works</a>
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to={`/${user.role === 'organization' ? 'organization' : user.role}`}
                  className="text-sm font-semibold text-ink-700 hover:text-brand-600"
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-ghost text-sm">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm px-4 py-2">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm px-4 py-2">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden p-2" onClick={() => setOpen(!open)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-ink-200 bg-white px-4 py-4 space-y-3">
          <Link to="/" className="block py-2 text-ink-700" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/explore" className="block py-2 text-ink-700" onClick={() => setOpen(false)}>Explore</Link>
          {isAuthenticated ? (
            <>
              <Link to={`/${user.role}`} className="block py-2 text-ink-700" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="block py-2 text-red-600">Log out</button>
            </>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="btn-secondary flex-1 text-center" onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link to="/register" className="btn-primary flex-1 text-center" onClick={() => setOpen(false)}>
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  )
}
