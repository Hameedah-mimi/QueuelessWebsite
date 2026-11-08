import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Mail, Lock, Building2 } from 'lucide-react'
import PublicNavbar from '../../components/layout/PublicNavbar'

const ROLES = [
  { id: 'customer', label: 'Customer', desc: 'Book appointments & join queues' },
  { id: 'worker', label: 'Worker', desc: 'Offer services at a business' },
  { id: 'organization', label: 'Organization', desc: 'Manage a salon, clinic or spa' },
]

export default function Register() {
  const { registerWithEmail, loginWithGoogle, error, setError } = useAuth()
  const navigate = useNavigate()

  const [role, setRole] = useState('customer')
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    organization_name: '',
  })
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Ensure password matches backend requirements (minimum 10 characters)
    if (form.password.length < 10) {
      setError('Password must be at least 10 characters long.')
      setLoading(false)
      return
    }

    // Map frontend roles to Django model choices (User.Role)
    const roleMapping = {
      customer: 'customer',
      worker: 'worker',
      organization: 'org_manager',
    }

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
        // Django serializer requires full_name
        full_name: `${form.first_name.trim()} ${form.last_name.trim()}`.trim(),
        role: roleMapping[role] || role,
      }

      if (role === 'organization') {
        payload.organization_name = form.organization_name.trim()
      }

      await registerWithEmail(payload)

      const dest = {
        customer: '/customer',
        worker: '/worker',
        organization: '/organization',
      }[role]

      navigate(dest, { replace: true })
    } catch {
      // The error state is updated inside AuthContext
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError(null)

    const roleMapping = {
      customer: 'customer',
      worker: 'worker',
      organization: 'org_manager',
    }

    try {
      await loginWithGoogle(roleMapping[role] || role)
      navigate(`/${role}`, { replace: true })
    } catch {
      // Handled in AuthContext
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <PublicNavbar />
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="card p-8">
          <h1 className="text-2xl font-extrabold text-ink-900 mb-1">Create account</h1>
          <p className="text-ink-500 text-sm mb-6">Join QueueLess in seconds</p>

          <div className="space-y-2 mb-6">
            {ROLES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                className={`w-full text-left p-3 rounded-xl border transition flex items-center gap-3 ${
                  role === r.id
                    ? 'border-brand-500 bg-brand-50 ring-1 ring-brand-500'
                    : 'border-ink-200 hover:border-ink-300'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    role === r.id ? 'border-brand-500 bg-brand-500' : 'border-ink-300'
                  }`}
                />
                <div>
                  <p className="text-sm font-semibold text-ink-900">{r.label}</p>
                  <p className="text-xs text-ink-500">{r.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-700 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First name</label>
                <input
                  className="input"
                  value={form.first_name}
                  onChange={set('first_name')}
                  required
                />
              </div>
              <div>
                <label className="label">Last name</label>
                <input
                  className="input"
                  value={form.last_name}
                  onChange={set('last_name')}
                  required
                />
              </div>
            </div>

            {role === 'organization' && (
              <div>
                <label className="label">Business name</label>
                <div className="relative">
                  <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  <input
                    className="input pl-10"
                    placeholder="Glow Beauty Salon"
                    value={form.organization_name}
                    onChange={set('organization_name')}
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="email"
                  className="input pl-10"
                  value={form.email}
                  onChange={set('email')}
                  required
                />
              </div>
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input
                  type="password"
                  className="input pl-10"
                  placeholder="Min 10 characters"
                  value={form.password}
                  onChange={set('password')}
                  minLength={10}
                  required
                />
              </div>
              <p className="text-xs text-ink-400 mt-1">Must be at least 10 characters.</p>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-ink-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-ink-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={loading}
            className="btn-secondary w-full"
          >
            Continue with Google
          </button>

          <p className="mt-6 text-center text-sm text-ink-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand-600 hover:underline">
              Log in
            </Link>
          </p>
          <p className="mt-2 text-center text-xs text-ink-400">
            Admin accounts are invite-only and cannot be created here.
          </p>
        </div>
      </div>
    </div>
  )
}