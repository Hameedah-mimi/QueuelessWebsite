import RoleNavbar from '../../components/layout/RoleNavbar'
import { useAuth } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import {
  Calendar,
  Clock,
  Star,
  ArrowRight,
  Sparkles,
  MapPin,
  TrendingUp,
  UserCheck,
  Search,
  CheckCircle2,
  Bell
} from 'lucide-react'
import { APPOINTMENTS, ORGANIZATIONS, formatNaira } from '../../data/mock'

export default function CustomerDashboard() {
  const { user } = useAuth()

  // Extract first name cleanly whether stored as full_name or first_name
  const displayName =
    user?.first_name ||
    user?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'there'

  // Pick up to 2 upcoming appointments for preview
  const upcomingApts = APPOINTMENTS.slice(0, 2)

  // Featured venues to explore
  const featuredOrgs = (ORGANIZATIONS || []).slice(0, 3)

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* ================= HERO GREETING BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ink-900 via-ink-800 to-brand-900 text-white p-6 sm:p-10 shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-500/30">
              <Sparkles size={13} /> Customer Portal
            </span>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2">
              Welcome back, {displayName}! 👋
            </h1>
            <p className="text-ink-200 text-sm sm:text-base leading-relaxed">
              Book appointments, skip the physical wait with live virtual queues, and explore top salons & spas near you.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/customer/explore"
                className="btn-primary bg-brand-500 hover:bg-brand-400 text-ink-950 font-bold px-6 py-2.5 inline-flex items-center gap-2 shadow-md"
              >
                <Search size={16} /> Explore Businesses
              </Link>
              <Link
                to="/customer/appointments"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition inline-flex items-center gap-2 backdrop-blur-sm"
              >
                View Bookings <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Decorative Background Blob */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* ================= 3 QUICK ACCESS CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Link
            to="/customer/explore"
            className="card p-6 border border-ink-100 bg-white hover:border-brand-300 hover:shadow-lg transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Star size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-ink-900 group-hover:text-brand-600 transition">
                Find Services
              </h3>
              <p className="text-xs text-ink-500 mt-1 leading-relaxed">
                Browse verified barbers, beauty salons, medical clinics & spas.
              </p>
            </div>
          </Link>

          <Link
            to="/customer/appointments"
            className="card p-6 border border-ink-100 bg-white hover:border-brand-300 hover:shadow-lg transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Calendar size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-ink-900 group-hover:text-brand-600 transition">
                My Bookings
              </h3>
              <p className="text-xs text-ink-500 mt-1 leading-relaxed">
                Reschedule appointments, view invoices & cancel anytime.
              </p>
            </div>
          </Link>

          <Link
            to="/customer/queue"
            className="card p-6 border border-ink-100 bg-white hover:border-brand-300 hover:shadow-lg transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
            <div>
              <h3 className="font-extrabold text-ink-900 group-hover:text-brand-600 transition">
                Virtual Queue
              </h3>
              <p className="text-xs text-ink-500 mt-1 leading-relaxed">
                Monitor live wait times and check in without sitting in a lobby.
              </p>
            </div>
          </Link>
        </div>

        {/* ================= 2-COLUMN MAIN DESKTOP GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT 2 COLUMNS: Upcoming Bookings & Recommended Salons */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* UPCOMING APPOINTMENTS SECTION */}
            <div className="card p-6 border border-ink-100 shadow-sm bg-white">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-ink-100">
                <div>
                  <h2 className="text-lg font-black text-ink-900">Next Upcoming Appointment</h2>
                  <p className="text-xs text-ink-400">Your scheduled visits and calendar reservations</p>
                </div>
                <Link
                  to="/customer/appointments"
                  className="text-xs text-brand-600 hover:text-brand-700 font-bold inline-flex items-center gap-1"
                >
                  View all ({APPOINTMENTS.length}) <ArrowRight size={13} />
                </Link>
              </div>

              {upcomingApts.length > 0 ? (
                <div className="space-y-4">
                  {upcomingApts.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl border border-ink-100 hover:border-brand-200 transition bg-ink-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white font-black flex flex-col items-center justify-center shadow-xs">
                          <span className="text-[10px] uppercase tracking-wider opacity-80">Apr</span>
                          <span className="text-lg leading-tight">16</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-ink-900 text-base">{apt.service}</h4>
                          <p className="text-xs text-ink-500 font-medium">{apt.org} · With {apt.worker}</p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-ink-600 font-semibold">
                            <Clock size={13} className="text-brand-600" />
                            <span>{apt.time} ({apt.duration} mins)</span>
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                              ● {apt.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:self-center">
                        <Link
                          to={`/customer/appointments/${apt.id}`}
                          className="btn-primary text-xs px-4 py-2 font-bold inline-flex items-center gap-1"
                        >
                          Manage <ArrowRight size={12} />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-2xl bg-ink-100 text-ink-400 mx-auto flex items-center justify-center mb-3">
                    <Calendar size={26} />
                  </div>
                  <h4 className="text-sm font-bold text-ink-800">No upcoming appointments</h4>
                  <p className="text-xs text-ink-400 max-w-xs mx-auto mt-1 mb-4">
                    You have no active appointments booked. Discover salons near you and reserve your spot in minutes.
                  </p>
                  <Link to="/customer/explore" className="btn-secondary text-xs px-4 py-2 font-bold">
                    Explore Services
                  </Link>
                </div>
              )}
            </div>

            {/* RECOMMENDED VENUES SECTION */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-ink-900">Top-Rated Salons & Spas</h2>
                  <p className="text-xs text-ink-400">Popular verified businesses offering queue tracking</p>
                </div>
                <Link
                  to="/customer/explore"
                  className="text-xs text-brand-600 font-bold inline-flex items-center gap-1"
                >
                  Browse all <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {featuredOrgs.map((org, idx) => {
                  const fallbackImg =
                    idx === 0
                      ? 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80'
                      : idx === 1
                      ? 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80'
                      : 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80'

                  return (
                    <div
                      key={org.id || idx}
                      className="card border border-ink-100 overflow-hidden bg-white hover:shadow-md transition group flex flex-col justify-between"
                    >
                      <div className="relative h-36 w-full bg-ink-200">
                        <img
                          src={org.image || fallbackImg}
                          alt={org.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-ink-900 flex items-center gap-1 shadow-xs">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span>4.9</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-ink-900 text-sm group-hover:text-brand-600 transition truncate">
                          {org.name}
                        </h4>
                        <p className="text-xs text-ink-400 flex items-center gap-1 truncate">
                          <MapPin size={12} className="shrink-0" /> Victoria Island, Lagos
                        </p>

                        <div className="pt-3 border-t border-ink-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-600">Virtual Queue Active</span>
                          <Link
                            to={`/customer/org/${org.id || '1'}`}
                            className="btn-secondary text-xs px-3 py-1.5 font-bold"
                          >
                            Book Spot
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>

          {/* RIGHT 1 COLUMN: Live Queue Card & Profile Status */}
          <div className="space-y-6 lg:sticky lg:top-8">
            
            {/* LIVE QUEUE STATUS CARD */}
            <div className="card p-6 border border-ink-100 shadow-sm bg-gradient-to-br from-white via-white to-amber-50/40">
              <div className="flex items-center justify-between pb-3 border-b border-ink-100 mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <Clock size={15} /> Queue Monitor
                </span>
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="text-center py-4">
                <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1">
                  Active Place in Line
                </p>
                <div className="text-5xl font-black text-ink-900 mb-2">#3</div>
                <p className="text-xs text-ink-600 font-medium">
                  Estimated wait time: <strong className="text-brand-600 font-bold">~15 minutes</strong>
                </p>
                <p className="text-xs text-ink-400 mt-1">Glow Beauty Salon · Victoria Island</p>
              </div>

              <div className="mt-4 pt-4 border-t border-ink-100">
                <Link
                  to="/customer/queue"
                  className="btn-primary w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm"
                >
                  Open Live Ticket <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* QUICK PROFILE COMPLETION / NOTIFICATION */}
            <div className="card p-5 border border-ink-100 bg-white shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink-900">Verified Customer</h4>
                  <p className="text-[11px] text-ink-400 truncate">{user?.email}</p>
                </div>
              </div>

              <div className="bg-ink-50 p-3 rounded-xl text-xs text-ink-600 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-brand-600 shrink-0 mt-0.5" />
                <span>Instant notifications enabled for bookings & queue ticket alerts.</span>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}