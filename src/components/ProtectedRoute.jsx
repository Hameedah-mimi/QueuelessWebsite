import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Protects routes by authentication and optional role.
 * Redirects unauthenticated users to /login and wrong-role users to their home.
 */
export default function ProtectedRoute({ children, roles = [] }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ink-50">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles.length > 0 && !roles.includes(user.role)) {
    // Send them to their own dashboard
    const home = {
      customer: '/customer',
      worker: '/worker',
      organization: '/organization',
      admin: '/admin',
    }[user.role] || '/'
    return <Navigate to={home} replace />
  }

  return children
}
