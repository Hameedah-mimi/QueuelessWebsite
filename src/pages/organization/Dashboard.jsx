import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import {
  Users,
  Calendar,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Scissors,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function OrgDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    queueCount: 0,
    totalBookings: 0,
    completed: 0,
    revenue: 0,
  });
  const [error, setError] = useState(null);

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const loadOrgData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      // 100% Real API call to your Django appointments backend
      const res = await api.get("/api/v1/appointments/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];

      const parsed = raw.map((item) => ({
        id: item.id,
        customer_name:
          item.customer_name || item.customer?.full_name || "Walk-in Client",
        service_name:
          item.service_name || item.service?.name || "General Service",
        worker_name:
          item.worker_name || item.worker?.full_name || "Assigned Specialist",
        duration: item.duration || item.service?.duration || 0,
        price: parseFloat(
          item.price || item.service?.price || item.total_amount || 0,
        ),
        status: (item.status || "pending").toLowerCase(),
        time: item.time || item.scheduled_time || "Scheduled",
      }));

      setAppointments(parsed);

      // Live metrics calculated strictly from Django records
      const completedList = parsed.filter((a) => a.status === "completed");
      const inQueueList = parsed.filter(
        (a) => a.status === "pending" || a.status === "in_progress",
      );
      const totalRev = completedList.reduce(
        (sum, a) => sum + (a.price || 0),
        0,
      );

      setStats({
        queueCount: inQueueList.length,
        totalBookings: parsed.length,
        completed: completedList.length,
        revenue: totalRev,
      });
    } catch (err) {
      console.error("Org dashboard fetch error:", err);
      setError(
        "Unable to load live dashboard statistics. Please verify backend connection.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrgData();
    const timer = setInterval(() => loadOrgData(true), 15000);
    return () => clearInterval(timer);
  }, [loadOrgData]);

  const displayName =
    user?.organization_name ||
    user?.full_name ||
    user?.first_name ||
    "Organization Manager";

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-ink-500">
                Business Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight mt-1">
              {displayName}
            </h1>
            <p className="text-sm text-ink-500">
              Live operational view of client appointments, walk-ins, and
              intake.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadOrgData(true)}
              disabled={refreshing}
              className="btn-secondary text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin text-brand-600" : ""}
              />
              <span>{refreshing ? "Syncing…" : "Sync"}</span>
            </button>

            <Link
              to="/organization/queue"
              className="btn-primary text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 shadow-sm"
            >
              <Users size={14} /> Open Live Queue
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => loadOrgData()}
              className="underline hover:text-amber-950"
            >
              Retry
            </button>
          </div>
        )}

        {/* 4 Real Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/organization/queue"
            className="card p-5 border border-ink-100 bg-white hover:border-brand-300 hover:shadow-md transition group"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Waiting in Line
                </p>
                <p className="text-3xl font-black text-ink-900 mt-1 group-hover:text-brand-600 transition">
                  {stats.queueCount}
                </p>
                <p className="text-xs text-brand-600 font-semibold mt-1">
                  Active tickets
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
            </div>
          </Link>

          <div className="card p-5 border border-ink-100 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Total Bookings
                </p>
                <p className="text-3xl font-black text-ink-900 mt-1">
                  {stats.totalBookings}
                </p>
                <p className="text-xs text-ink-400 mt-1">Booked in database</p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Calendar size={20} />
              </div>
            </div>
          </div>

          <div className="card p-5 border border-ink-100 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Completed Sessions
                </p>
                <p className="text-3xl font-black text-emerald-600 mt-1">
                  {stats.completed}
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  Served clients
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

          <div className="card p-5 border border-ink-100 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Revenue (Recorded)
                </p>
                <p className="text-2xl sm:text-3xl font-black text-brand-600 mt-1">
                  {formatNaira(stats.revenue)}
                </p>
                <p className="text-xs text-ink-400 mt-1">
                  From completed orders
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <TrendingUp size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Active Schedule & Shortcuts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-ink-100">
                <div>
                  <h2 className="text-base font-black text-ink-900">
                    Today's Appointment Schedule
                  </h2>
                  <p className="text-xs text-ink-400">
                    Real-time bookings fetched directly from backend
                  </p>
                </div>
                <Link
                  to="/organization/queue"
                  className="text-xs text-brand-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  Manage Terminal <ArrowRight size={13} />
                </Link>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-ink-400 animate-pulse">
                  Loading live appointments from database…
                </div>
              ) : (
                <div className="space-y-3">
                  {appointments.slice(0, 5).map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl border border-ink-100 bg-ink-50/40 hover:border-brand-200 transition flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center shrink-0">
                          {apt.customer_name[0]?.toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-ink-900 text-sm">
                            {apt.customer_name}
                          </h4>
                          <p className="text-xs text-ink-500">
                            {apt.service_name} · Staff:{" "}
                            <strong>{apt.worker_name}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-ink-900">
                          {apt.time}
                        </p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}

                  {appointments.length === 0 && (
                    <div className="p-10 text-center text-ink-400 text-xs">
                      No customer appointments found in your database yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Shortcuts */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-4">
              <h3 className="text-sm font-black text-ink-900 pb-2 border-b border-ink-100">
                Salon Management Shortcuts
              </h3>

              <div className="space-y-3 text-xs">
                <Link
                  to="/organization/services"
                  className="p-3.5 rounded-xl border border-ink-100 hover:border-brand-300 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                      <Scissors size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-ink-900 group-hover:text-brand-600 transition">
                        Services & Menu
                      </p>
                      <p className="text-[11px] text-ink-400">
                        Add & edit service prices
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-ink-400 group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>

                <Link
                  to="/organization/staff"
                  className="p-3.5 rounded-xl border border-ink-100 hover:border-brand-300 transition flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                      <Users size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-ink-900 group-hover:text-brand-600 transition">
                        Stylists & Specialists
                      </p>
                      <p className="text-[11px] text-ink-400">
                        Manage team & active shifts
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-ink-400 group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>

            <div className="rounded-2xl p-5 bg-gradient-to-br from-brand-50/60 to-transparent border border-brand-100 flex items-start gap-3">
              <Sparkles size={20} className="text-brand-600 shrink-0 mt-0.5" />
              <div className="text-xs text-ink-600 leading-relaxed">
                <strong className="text-ink-900 block font-bold mb-0.5">
                  Live Queue Integration
                </strong>
                Customers booking through the app receive real-time ticket
                updates as your specialists advance the queue.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
