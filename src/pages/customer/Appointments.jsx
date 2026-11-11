import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  Calendar,
  Clock,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  Search,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState("Upcoming");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const fetchAppointments = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const res = await api.get("/api/v1/appointments/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];

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
          "Salon / Clinic",
        worker:
          item.worker_name || item.worker?.full_name || "Assigned Specialist",
        date: item.date || item.scheduled_date || "Scheduled Date",
        time: item.time || item.scheduled_time || "Scheduled Time",
        duration: item.duration || item.service?.duration || 45,
        price: parseFloat(
          item.price || item.service?.price || item.total_amount || 0,
        ),
        status: (item.status || "pending").toLowerCase(),
        image: item.organization?.image || item.image || null,
      }));

      setAppointments(parsed);
    } catch (err) {
      console.error("Failed to load customer appointments:", err);
      setError("Could not retrieve appointments from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Real tab categorization
  const upcomingList = appointments.filter(
    (a) => a.status !== "completed" && a.status !== "cancelled",
  );
  const completedList = appointments.filter((a) => a.status === "completed");
  const cancelledList = appointments.filter((a) => a.status === "cancelled");

  const tabList =
    tab === "Upcoming"
      ? upcomingList
      : tab === "Past"
        ? completedList
        : cancelledList;

  const filteredList = tabList.filter(
    (apt) =>
      apt.service.toLowerCase().includes(search.toLowerCase()) ||
      apt.org.toLowerCase().includes(search.toLowerCase()),
  );

  const tabs = [
    { id: "Upcoming", label: "Upcoming", count: upcomingList.length },
    { id: "Past", label: "Completed", count: completedList.length },
    { id: "Cancelled", label: "Cancelled", count: cancelledList.length },
  ];

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
              My Appointments
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              View your live bookings, reschedule times, or cancel sessions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchAppointments(true)}
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
              to="/customer/explore"
              className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 font-bold text-xs shadow-xs"
            >
              <Plus size={16} /> Book New Appointment
            </Link>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 3 Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="card p-5 border border-ink-100 flex items-center gap-4 bg-white shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <CalendarCheck size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Total Bookings
              </p>
              <p className="text-2xl font-black text-ink-900">
                {loading ? "…" : appointments.length}
              </p>
            </div>
          </div>

          <div className="card p-5 border border-ink-100 flex items-center gap-4 bg-white shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Active Upcoming
              </p>
              <p className="text-2xl font-black text-ink-900">
                {loading ? "…" : upcomingList.length}
              </p>
            </div>
          </div>

          <div className="card p-5 border border-ink-100 flex items-center gap-4 bg-white shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">
                Cancelled
              </p>
              <p className="text-2xl font-black text-ink-900">
                {loading ? "…" : cancelledList.length}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="card p-3 border border-ink-100 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white">
          <div className="flex bg-ink-100/70 p-1 rounded-xl">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  tab === t.id
                    ? "bg-white text-ink-900 shadow-xs"
                    : "text-ink-500 hover:text-ink-800"
                }`}
              >
                <span>{t.label}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    tab === t.id
                      ? "bg-brand-50 text-brand-700 font-bold"
                      : "bg-ink-200/60 text-ink-600"
                  }`}
                >
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative sm:w-72">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              type="text"
              placeholder="Search appointments…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 py-2 text-sm w-full bg-white border-ink-200"
            />
          </div>
        </div>

        {/* Real Appointments Grid */}
        {loading ? (
          <div className="p-16 text-center text-xs text-ink-400 animate-pulse">
            Querying your bookings from database…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((apt) => (
              <div
                key={apt.id}
                className="card border border-ink-100 overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-brand-200 transition bg-white group"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                        {apt.service}
                      </span>
                      <h3 className="text-lg font-bold text-ink-900 mt-1">
                        {apt.org}
                      </h3>
                    </div>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize ${
                        apt.status === "completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : apt.status === "cancelled"
                            ? "bg-rose-50 text-rose-700"
                            : "bg-brand-50 text-brand-700"
                      }`}
                    >
                      ● {apt.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-ink-500">
                    <p className="flex items-center gap-1.5 font-semibold text-ink-800">
                      <Calendar size={14} className="text-brand-600" />{" "}
                      {apt.date} · {apt.time}
                    </p>
                    <p className="text-ink-400">Specialist: {apt.worker}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-ink-100 mt-2 flex items-center justify-between pt-4">
                  <div>
                    <p className="text-[10px] font-semibold text-ink-400 uppercase">
                      Fee
                    </p>
                    <p className="text-base font-black text-brand-600">
                      {formatNaira(apt.price)}
                    </p>
                  </div>

                  <Link
                    to={`/customer/appointments/${apt.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-ink-900 hover:bg-brand-600 text-white text-xs font-bold transition shadow-xs"
                  >
                    Manage <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}

            {filteredList.length === 0 && (
              <div className="col-span-full card p-12 text-center text-ink-400 text-xs border border-dashed border-ink-200">
                No appointments found under "{tab}".{" "}
                <Link
                  to="/customer/explore"
                  className="text-brand-600 font-bold hover:underline"
                >
                  Explore businesses
                </Link>{" "}
                to schedule a service.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
