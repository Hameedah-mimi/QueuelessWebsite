import { useState, useEffect } from 'react'
import RoleNavbar from '../../components/layout/RoleNavbar'
import { useAuth } from '../../context/AuthContext'
import {
  Users, Building2, Calendar, TrendingUp, Activity, AlertCircle
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

// Demo data – replace with live API calls later
const BOOKINGS_TREND = [
  { day: 'Mon', bookings: 42, revenue: 320000 },
  { day: 'Tue', bookings: 58, revenue: 410000 },
  { day: 'Wed', bookings: 51, revenue: 380000 },
  { day: 'Thu', bookings: 67, revenue: 490000 },
  { day: 'Fri', bookings: 89, revenue: 620000 },
  { day: 'Sat', bookings: 112, revenue: 780000 },
  { day: 'Sun', bookings: 74, revenue: 510000 },
]

const ROLE_SPLIT = [
  { name: 'Customers', value: 1240, color: '#16A6A1' },
  { name: 'Workers', value: 186, color: '#102A43' },
  { name: 'Organizations', value: 94, color: '#F59E0B' },
]

const RECENT_ACTIVITY = [
  { id: 1, type: 'booking', text: 'New booking at Glow Beauty Salon', time: '2 min ago', user: 'Adeyemi H.' },
  { id: 2, type: 'signup', text: 'New organization registered: Luxe Spa', time: '12 min ago', user: 'System' },
  { id: 3, type: 'worker', text: 'Worker Sarah J. completed a service', time: '18 min ago', user: 'Sarah J.' },
  { id: 4, type: 'alert', text: 'Organization pending verification', time: '25 min ago', user: 'Admin' },
  { id: 5, type: 'booking', text: 'Booking cancelled by customer', time: '34 min ago', user: 'Chioma O.' },
  { id: 6, type: 'signup', text: 'New customer: Tunde Adebayo', time: '1 hr ago', user: 'System' },
]

export default function AdminDashboard() {
  const { user } = useAuth()
  const [live, setLive] = useState(true)

  // Simulate live updates
  useEffect(() => {
    if (!live) return
    const t = setInterval(() => {
      // In production: poll /api/v1/admin/analytics/ or use WebSocket
    }, 15000)
    return () => clearInterval(t)
  }, [live])

  const kpis = [
    { label: 'Total Users', value: '1,520', change: '+48 this week', icon: Users, color: 'text-brand-600 bg-brand-50' },
    { label: 'Organizations', value: '94', change: '+6 pending', icon: Building2, color: 'text-amber-600 bg-amber-50' },
    { label: 'Bookings today', value: '186', change: '+12% vs yesterday', icon: Calendar, color: 'text-blue-600 bg-blue-50' },
    { label: 'Revenue (week)', value: '₦3.5M', change: '+9%', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-50' },
  ]

  return (
    <div className="min-h-screen bg-ink-50">
      <RoleNavbar />
      <main className="lg:ml-64 p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-ink-900">Admin Dashboard</h1>
            <p className="text-ink-500 text-sm mt-1">
              Welcome back, {user?.first_name || 'Admin'} · Live platform overview
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLive(!live)}
              className={`flex items-center gap-2 text-sm font-medium px-3 py-1.5 rounded-full ${
                live ? 'bg-emerald-50 text-emerald-700' : 'bg-ink-100 text-ink-500'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${live ? 'bg-emerald-500 animate-pulse' : 'bg-ink-400'}`} />
              {live ? 'Live' : 'Paused'}
            </button>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {kpis.map((k) => (
            <div key={k.label} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-ink-500">{k.label}</p>
                  <p className="text-2xl font-extrabold text-ink-900 mt-1">{k.value}</p>
                  <p className="text-xs text-ink-400 mt-1">{k.change}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${k.color}`}>
                  <k.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Bookings trend */}
          <div className="card p-5 lg:col-span-2">
            <h2 className="text-base font-bold text-ink-900 mb-4">Bookings this week</h2>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={BOOKINGS_TREND}>
                <defs>
                  <linearGradient id="gBook" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16A6A1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#16A6A1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke="#16A6A1"
                  strokeWidth={2}
                  fill="url(#gBook)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Role split */}
          <div className="card p-5">
            <h2 className="text-base font-bold text-ink-900 mb-4">User mix</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={ROLE_SPLIT}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                >
                  {ROLE_SPLIT.map((e) => (
                    <Cell key={e.name} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {ROLE_SPLIT.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                    {r.name}
                  </div>
                  <span className="font-semibold text-ink-900">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Revenue bar + Live activity */}
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card p-5">
            <h2 className="text-base font-bold text-ink-900 mb-4">Revenue by day (₦)</h2>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={BOOKINGS_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v) => [`₦${v.toLocaleString()}`, 'Revenue']}
                  contentStyle={{ borderRadius: 12, border: '1px solid #E2E8F0' }}
                />
                <Bar dataKey="revenue" fill="#16A6A1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Live activity feed */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-ink-900 flex items-center gap-2">
                <Activity size={18} className="text-brand-500" /> Live activity
              </h2>
              <span className="text-xs text-ink-400">Auto-refresh</span>
            </div>
            <div className="space-y-3 max-h-[260px] overflow-y-auto">
              {RECENT_ACTIVITY.map((a) => (
                <div key={a.id} className="flex gap-3 text-sm">
                  <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                    a.type === 'alert' ? 'bg-amber-500' :
                    a.type === 'booking' ? 'bg-brand-500' :
                    a.type === 'signup' ? 'bg-blue-500' : 'bg-ink-400'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-ink-800">{a.text}</p>
                    <p className="text-xs text-ink-400">{a.user} · {a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending approvals notice */}
        <div className="mt-6 card p-4 flex items-start gap-3 border-amber-200 bg-amber-50">
          <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-900">6 organizations awaiting verification</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Review and approve them from the Organizations page so they can start accepting bookings.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
