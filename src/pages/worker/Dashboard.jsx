import RoleNavbar from '../../components/layout/RoleNavbar'
import { useAuth } from '../../context/AuthContext'

export default function WorkerDashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-ink-50">
      <RoleNavbar />
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-extrabold text-ink-900 mb-1">
          Hello, {user?.first_name || 'Worker'}
        </h1>
        <p className="text-ink-500 text-sm mb-8">Your schedule and queue at a glance</p>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Clients today', value: '5' },
            { label: 'Completed', value: '1' },
            { label: 'Earned today', value: '₦15,000' },
          ].map((k) => (
            <div key={k.label} className="card p-5">
              <p className="text-sm text-ink-500">{k.label}</p>
              <p className="text-2xl font-extrabold text-ink-900 mt-1">{k.value}</p>
            </div>
          ))}
        </div>

        <div className="card p-6 border-brand-200 bg-brand-50/50">
          <p className="text-xs font-medium text-ink-500 mb-1">Next appointment</p>
          <p className="text-2xl font-extrabold text-ink-900">11:00 AM</p>
          <p className="text-sm text-ink-600 mt-2">Tomi Adeyemi · Braiding · 90 mins · ₦20,000</p>
          <p className="text-xs text-brand-600 font-semibold mt-2">In 25 mins</p>
        </div>
      </main>
    </div>
  )
}
