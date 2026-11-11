import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
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
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function CustomerDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [error, setError] = useState(null);

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  // 100% Real API queries to Django
  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const [aptRes, orgRes] = await Promise.allSettled([
        api.get("/api/v1/appointments/"),
        api.get("/api/v1/organizations/"),
      ]);

      if (aptRes.status === "fulfilled") {
        const raw = Array.isArray(aptRes.value.data)
          ? aptRes.value.data
          : aptRes.value.data?.results || [];
        const parsed = raw.map((item) => ({
          id: item.id,
          service:
            item.service_name ||
            item.service?.name ||
            item.service ||
            "Appointment",
          org:
            item.organization_name ||
            item.organization?.name ||
            item.org ||
            "Salon / Business",
          worker: item.worker_name || item.worker?.full_name || "Specialist",
          date: item.date || item.scheduled_date || "Scheduled Date",
          time: item.time || item.scheduled_time || "Scheduled Time",
          duration: item.duration || item.service?.duration || 45,
          price: parseFloat(
            item.price || item.service?.price || item.total_amount || 0,
          ),
          status: (item.status || "pending").toLowerCase(),
        }));
        setAppointments(parsed);
      }

      if (orgRes.status === "fulfilled") {
        const orgList = Array.isArray(orgRes.value.data)
          ? orgRes.value.data
          : orgRes.value.data?.results || [];
        setOrganizations(orgList);
      }
    } catch (err) {
      console.error("Failed to load customer dashboard data:", err);
      setError("Could not sync live data from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Real upcoming bookings (not completed and not cancelled)
  const upcomingApts = appointments
    .filter((a) => a.status !== "completed" && a.status !== "cancelled")
    .slice(0, 2);

  // Real active ticket in queue
  const activeTicket = appointments.find(
    (a) => a.status === "in_progress" || a.status === "pending",
  );

  const featuredOrgs = organizations.slice(0, 4);

  const displayName =
    user?.first_name ||
    user?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* ================= HERO GREETING BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ink-950 via-ink-900 to-brand-950 text-black p-6 sm:p-10 shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-black font-bold uppercase tracking-wider mb-4 border border-brand-500/30">
              <Sparkles size={13} /> Customer Portal
            </span>
            <h1 className="text-black sm:text-4xl font-black tracking-tight mb-2">
              Welcome back, {displayName}!
            </h1>
            <p className="text-ink-200 text-sm sm:text-base leading-relaxed">
              Book appointments, skip the physical wait with live virtual
              queues, and explore top salons & spas near you.
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

          <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchDashboardData()}
              className="underline font-bold"
            >
              Retry
            </button>
          </div>
        )}

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
                Browse verified barbers, beauty salons, clinics & spas.
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
          {/* LEFT 2 COLUMNS: Real Upcoming Bookings & Verified Salons */}
          <div className="lg:col-span-2 space-y-8">
            {/* REAL UPCOMING APPOINTMENTS SECTION */}
            <div className="card p-6 border border-ink-100 shadow-sm bg-white">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-ink-100">
                <div>
                  <h2 className="text-lg font-black text-ink-900">
                    Next Upcoming Appointment
                  </h2>
                  <p className="text-xs text-ink-400">
                    Your scheduled visits and calendar reservations
                  </p>
                </div>
                <Link
                  to="/customer/appointments"
                  className="text-xs text-brand-600 hover:text-brand-700 font-bold inline-flex items-center gap-1"
                >
                  View all ({appointments.length}) <ArrowRight size={13} />
                </Link>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-ink-400 animate-pulse">
                  Loading your scheduled appointments from database…
                </div>
              ) : upcomingApts.length > 0 ? (
                <div className="space-y-4">
                  {upcomingApts.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl border border-ink-100 hover:border-brand-200 transition bg-ink-50/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white font-black flex flex-col items-center justify-center shadow-xs shrink-0">
                          <Calendar size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-ink-900 text-base">
                            {apt.service}
                          </h4>
                          <p className="text-xs text-ink-500 font-medium">
                            {apt.org} · With {apt.worker}
                          </p>
                          <div className="flex items-center gap-2 mt-1 text-xs text-ink-600 font-semibold">
                            <Clock size={13} className="text-brand-600" />
                            <span>
                              {apt.date} at {apt.time} ({apt.duration} mins)
                            </span>
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
                  <h4 className="text-sm font-bold text-ink-800">
                    No upcoming appointments
                  </h4>
                  <p className="text-xs text-ink-400 max-w-xs mx-auto mt-1 mb-4">
                    You have no active appointments booked in the database.
                    Discover salons near you and reserve your spot.
                  </p>
                  <Link
                    to="/customer/explore"
                    className="btn-secondary text-xs px-4 py-2 font-bold"
                  >
                    Explore Services
                  </Link>
                </div>
              )}
            </div>

            {/* REAL REGISTERED ORGANIZATIONS SECTION */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-ink-900">
                    Verified Salons & Spas
                  </h2>
                  <p className="text-xs text-ink-400">
                    Businesses registered in your platform database
                  </p>
                </div>
                <Link
                  to="/customer/explore"
                  className="text-xs text-brand-600 font-bold inline-flex items-center gap-1"
                >
                  Browse all ({organizations.length}) <ArrowRight size={13} />
                </Link>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-ink-400 animate-pulse">
                  Querying registered businesses from database…
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {featuredOrgs.map((org) => (
                    <div
                      key={org.id}
                      className="card border border-ink-100 overflow-hidden bg-white hover:shadow-md transition group flex flex-col justify-between"
                    >
                      <div className="relative h-36 w-full bg-ink-200">
                        {org.image ? (
                          <img
                            src={org.image}
                            alt={org.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-ink-100 text-ink-400 text-xs font-bold">
                            No Photo Uploaded
                          </div>
                        )}
                        <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-full text-xs font-bold text-ink-900 flex items-center gap-1 shadow-xs">
                          <Star
                            size={12}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span>{org.rating || "5.0"}</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h4 className="font-bold text-ink-900 text-sm group-hover:text-brand-600 transition truncate">
                          {org.name}
                        </h4>
                        <p className="text-xs text-ink-400 flex items-center gap-1 truncate">
                          <MapPin size={12} className="shrink-0" />{" "}
                          {org.location || "Location Not Specified"}
                        </p>

                        <div className="pt-3 border-t border-ink-100 flex items-center justify-between">
                          <span className="text-xs font-bold text-emerald-600">
                            ● Open for Bookings
                          </span>
                          <Link
                            to={`/customer/org/${org.id}`}
                            className="btn-secondary text-xs px-3 py-1.5 font-bold"
                          >
                            Book Spot
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}

                  {featuredOrgs.length === 0 && (
                    <div className="col-span-full card p-8 text-center text-xs text-ink-400 border border-dashed border-ink-200">
                      No businesses registered yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Real Live Queue Ticket & Account Verification */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* REAL QUEUE MONITOR CARD */}
            <div className="card p-6 border border-ink-100 shadow-sm bg-gradient-to-br from-white via-white to-amber-50/40">
              <div className="flex items-center justify-between pb-3 border-b border-ink-100 mb-4">
                <span className="text-xs font-black uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                  <Clock size={15} /> Queue Monitor
                </span>
                <span
                  className={`inline-block w-2.5 h-2.5 rounded-full ${activeTicket ? "bg-emerald-500 animate-pulse" : "bg-ink-300"}`}
                />
              </div>

              {activeTicket ? (
                <div className="text-center py-4">
                  <p className="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-1">
                    Your Assigned Ticket
                  </p>
                  <div className="text-4xl font-black text-ink-900 mb-2">
                    #{String(activeTicket.id).slice(0, 4)}
                  </div>
                  <p className="text-xs text-ink-600 font-medium">
                    Status:{" "}
                    <strong className="text-brand-600 font-bold uppercase">
                      {activeTicket.status}
                    </strong>
                  </p>
                  <p className="text-xs text-ink-400 mt-1">
                    {activeTicket.org}
                  </p>

                  <div className="mt-4 pt-4 border-t border-ink-100">
                    <Link
                      to="/customer/queue"
                      className="btn-primary w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      Open Live Ticket <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-xs font-bold text-ink-800">
                    You are not in any queue
                  </p>
                  <p className="text-[11px] text-ink-400 mt-1 max-w-[200px] mx-auto">
                    Book a service or join a virtual queue to skip waiting at
                    the lobby.
                  </p>
                  <div className="mt-4 pt-4 border-t border-ink-100">
                    <Link
                      to="/customer/explore"
                      className="btn-secondary w-full py-2 text-xs font-bold inline-flex items-center justify-center gap-1"
                    >
                      Explore Salons <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* VERIFIED CUSTOMER PROFILE CARD */}
            <div className="card p-5 border border-ink-100 bg-white shadow-xs space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                  <UserCheck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-ink-900">
                    Verified Customer
                  </h4>
                  <p className="text-[11px] text-ink-400 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="bg-ink-50 p-3 rounded-xl text-xs text-ink-600 flex items-start gap-2">
                <CheckCircle2
                  size={16}
                  className="text-brand-600 shrink-0 mt-0.5"
                />
                <span>
                  Instant notifications enabled for bookings & queue ticket
                  alerts.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
