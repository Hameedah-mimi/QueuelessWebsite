import RoleNavbar from '../../components/layout/RoleNavbar'
import { useAuth } from '../../context/AuthContext'

export default function OrgDashboard() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-ink-50">
      <RoleNavbar />
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-extrabold text-ink-900 mb-1">
          {user?.organization_name || 'Business'} Dashboard
        </h1>
        <p className="text-ink-500 text-sm mb-8">Today's overview</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Today's bookings", value: '18', sub: '+12% vs yesterday' },
            { label: 'In queue now', value: '6', sub: 'Avg wait 12 mins' },
            { label: 'Revenue today', value: '₦245,000', sub: '+8% vs yesterday' },
            { label: 'Average rating', value: '4.8', sub: '124 reviews' },
          ].map((k) => (
            <div key={k.label} className="card p-5">
              <p className="text-sm text-ink-500">{k.label}</p>
              <p className="text-2xl font-extrabold text-ink-900 mt-1">{k.value}</p>
              <p className="text-xs text-ink-400 mt-1">{k.sub}</p>
            </div>
          ))}
        </div>

        <div className="card p-6">
          <h2 className="font-bold text-ink-900 mb-4">Quick actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="btn-primary">View live queue</button>
            <button className="btn-secondary">Add booking</button>
            <button className="btn-secondary">Invite worker</button>
          </div>
        </div>
      </main>
    </div>
  )
}
