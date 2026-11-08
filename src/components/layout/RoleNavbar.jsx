import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home, Calendar, List, Clock, CreditCard, Settings, Users,
  Scissors, BarChart3, Bell, LogOut, Menu, X, Search
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import clsx from 'clsx'

const NAV = {
  customer: [
    { to: '/customer', label: 'Home', icon: Home },
    { to: '/customer/explore', label: 'Explore', icon: Search },
    { to: '/customer/appointments', label: 'Appointments', icon: Calendar },
    { to: '/customer/queue', label: 'Queue', icon: List },
    { to: '/customer/profile', label: 'Profile', icon: Settings },
  ],
  worker: [
    { to: '/worker', label: 'Dashboard', icon: Home },
    { to: '/worker/schedule', label: 'Schedule', icon: Calendar },
    { to: '/worker/queue', label: 'My Queue', icon: List },
    { to: '/worker/availability', label: 'Availability', icon: Clock },
    { to: '/worker/earnings', label: 'Earnings', icon: CreditCard },
    { to: '/worker/settings', label: 'Settings', icon: Settings },
  ],
  organization: [
    { to: '/organization', label: 'Dashboard', icon: Home },
    { to: '/organization/queue', label: 'Live Queue', icon: List },
    { to: '/organization/bookings', label: 'Bookings', icon: Calendar },
    { to: '/organization/services', label: 'Services', icon: Scissors },
    { to: '/organization/team', label: 'Team', icon: Users },
    { to: '/organization/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/organization/settings', label: 'Settings', icon: Settings },
  ],
  admin: [
    { to: '/admin', label: 'Dashboard', icon: Home },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/organizations', label: 'Organizations', icon: Scissors },
    { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/admin/settings', label: 'Settings', icon: Settings },
  ],
}

export default function RoleNavbar() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const items = NAV[user?.role] || []
  const roleLabel = {
    customer: 'Customer',
    worker: 'Worker',
    organization: 'Organization',
    admin: 'Admin',
  }[user?.role] || ''

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-ink-200 min-h-screen fixed left-0 top-0 z-40">
        <div className="p-5 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border-[3px] border-ink-900 flex items-center justify-center">
            <div className="w-3 h-3 bg-brand-500 rounded-sm rotate-45 -translate-y-0.5" />
          </div>
          <span className="text-lg font-extrabold text-ink-900">
            Queue<span className="text-brand-500">Less</span>
          </span>
        </div>
        <div className="px-5 mb-4">
          <span className="inline-block text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-full">
            {roleLabel}
          </span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {items.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to || (to !== `/${user.role}` && location.pathname.startsWith(to))
            return (
              <Link
                key={to}
                to={to}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition',
                  active
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-ink-700 hover:bg-ink-50'
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>
        <div className="p-4 border-t border-ink-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm overflow-hidden">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                (user?.first_name?.[0] || user?.email?.[0] || '?').toUpperCase()
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink-900 truncate">
                {user?.first_name || user?.email}
              </p>
              <p className="text-xs text-ink-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-ink-500 hover:text-red-600 transition w-full"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-50 bg-white border-b border-ink-200 px-4 h-14 flex items-center justify-between">
        <button onClick={() => setMobileOpen(true)}>
          <Menu size={22} />
        </button>
        <span className="font-extrabold text-ink-900">
          Queue<span className="text-brand-500">Less</span>
        </span>
        <Link to={`/${user.role}/notifications`}>
          <Bell size={20} />
        </Link>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="font-extrabold text-lg">
                Queue<span className="text-brand-500">Less</span>
              </span>
              <button onClick={() => setMobileOpen(false)}><X size={22} /></button>
            </div>
            <nav className="flex-1 space-y-1">
              {items.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-ink-700 hover:bg-ink-50"
                >
                  <Icon size={18} /> {label}
                </Link>
              ))}
            </nav>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-red-600 mt-4">
              <LogOut size={16} /> Log out
            </button>
          </div>
        </div>
      )}
    </>
  )
}
