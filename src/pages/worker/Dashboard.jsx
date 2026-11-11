import { useState, useEffect, useCallback } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import {
  Calendar,
  Clock,
  CheckCircle2,
  PlayCircle,
  XCircle,
  TrendingUp,
  UserCheck,
  AlertCircle,
  RefreshCw,
  Phone,
  Sparkles,
  Banknote,
  Briefcase,
  ShieldCheck,
  User,
} from "lucide-react";

export default function WorkerDashboard() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [isAvailable, setIsAvailable] = useState(user?.is_available ?? true);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  // Real API call to Django
  const loadWorkerData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const res = await api.get("/api/v1/appointments/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];

      const parsed = raw.map((item) => ({
        id: item.id,
        customer_name:
          item.customer_name || item.customer?.full_name || "Client",
        customer_phone:
          item.customer_phone || item.customer?.phone || item.phone || "",
        service_name:
          item.service_name ||
          item.service?.name ||
          item.service ||
          "Service Session",
        duration: item.duration || item.service?.duration || 45,
        price: parseFloat(
          item.price || item.service?.price || item.total_amount || 0,
        ),
        status: (item.status || "pending").toLowerCase(),
        payment_status:
          item.payment_status ||
          (item.status === "completed" ? "paid" : "due_on_arrival"),
        time:
          item.time || item.scheduled_time || item.start_time || "Scheduled",
        date: item.date || item.scheduled_date || "Today",
      }));

      setAppointments(parsed);
    } catch (err) {
      console.error("Worker appointment fetch error:", err);
      setError("Unable to sync live appointments from Django server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadWorkerData();
    const timer = setInterval(() => loadWorkerData(true), 15000);
    return () => clearInterval(timer);
  }, [loadWorkerData]);

  // Status mutation with counter collection confirmation
  const handleUpdateStatus = async (appointmentId, newStatus) => {
    if (newStatus === "completed") {
      const confirmed = window.confirm(
        "Confirm that the client has completed payment at the counter / POS terminal?",
      );
      if (!confirmed) return;
    }

    setActionLoading(appointmentId);
    try {
      await api.patch(`/api/v1/appointments/${appointmentId}/`, {
        status: newStatus,
        payment_status: newStatus === "completed" ? "paid" : "due_on_arrival",
      });
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === appointmentId
            ? {
                ...apt,
                status: newStatus,
                payment_status:
                  newStatus === "completed" ? "paid" : "due_on_arrival",
              }
            : apt,
        ),
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      loadWorkerData(true);
    } finally {
      setActionLoading(null);
    }
  };

  // Toggle specialist shift status
  const toggleAvailability = async () => {
    const nextState = !isAvailable;
    setIsAvailable(nextState);
    try {
      await api.patch("/api/v1/auth/me/", { is_available: nextState });
    } catch {
      // Retain optimistic switch
    }
  };

  // Live KPI math derived strictly from Django records
  const totalAssigned = appointments.length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed",
  );
  const completedCount = completedAppointments.length;
  const totalEarned = completedAppointments.reduce(
    (sum, a) => sum + (a.price || 0),
    0,
  );

  // Active queue
  const activeQueue = appointments.filter(
    (a) => a.status !== "completed" && a.status !== "cancelled",
  );
  const nextAppointment = appointments.find(
    (a) =>
      a.status === "in_progress" ||
      a.status === "confirmed" ||
      a.status === "pending",
  );

  const displayName =
    user?.full_name ||
    user?.first_name ||
    user?.email?.split("@")[0] ||
    "Specialist";

  return (
    <div className="min-h-screen bg-slate-50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* Header & Controls (Clean SVG, No Emojis) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${isAvailable ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
              />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Specialist Console
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Hello, {displayName}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Live operational view of your assigned clients, queue, and
              completed intake.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => loadWorkerData(true)}
              disabled={refreshing}
              className="btn-secondary text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin text-teal-600" : ""}
              />
              <span>{refreshing ? "Syncing…" : "Sync"}</span>
            </button>

            <button
              type="button"
              onClick={toggleAvailability}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border shadow-xs ${
                isAvailable
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                  : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${isAvailable ? "bg-emerald-600" : "bg-slate-400"}`}
              />
              {isAvailable ? "Available for Clients" : "Marked On Break"}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 3 Real KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="card p-6 border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Clients
                </p>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {loading ? "…" : totalAssigned}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Total database records
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                <Calendar size={22} />
              </div>
            </div>
          </div>

          <div className="card p-6 border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Completed Sessions
                </p>
                <p className="text-3xl font-black text-emerald-600 mt-1">
                  {loading ? "…" : completedCount}
                </p>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  Finished services
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 size={22} />
              </div>
            </div>
          </div>

          <div className="card p-6 border border-slate-200 bg-white shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Intake Revenue
                </p>
                <p className="text-3xl font-black text-teal-600 mt-1">
                  {loading ? "…" : formatNaira(totalEarned)}
                </p>
                <p className="text-xs text-slate-400 mt-1">Paid at counter</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <TrendingUp size={22} />
              </div>
            </div>
          </div>
        </div>

        {/* 2-Column Split: Active Queue & Focus Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 sm:p-8 border border-slate-200 bg-white shadow-sm space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Active Queue Pipeline
                  </h2>
                  <p className="text-xs text-slate-400">
                    Clients currently waiting or in your chair
                  </p>
                </div>
                <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                  {activeQueue.length} Active
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
                  Querying live queue from database…
                </div>
              ) : (
                <div className="space-y-4">
                  {activeQueue.map((apt) => {
                    const isInChair = apt.status === "in_progress";

                    return (
                      <div
                        key={apt.id}
                        className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isInChair
                            ? "border-teal-500 bg-teal-50/20 ring-2 ring-teal-500/20 shadow-xs"
                            : "border-slate-200 bg-white hover:border-teal-300"
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-xs ${
                              isInChair
                                ? "bg-teal-600 text-white"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {(apt.customer_name || "C")[0].toUpperCase()}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-slate-900 text-base">
                                {apt.customer_name}
                              </h3>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isInChair
                                    ? "bg-teal-600 text-white animate-pulse"
                                    : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {isInChair ? "In Chair" : apt.status}
                              </span>
                            </div>

                            <p className="text-xs text-slate-600 font-semibold mt-0.5">
                              {apt.service_name} ·{" "}
                              <span className="text-teal-600">
                                {formatNaira(apt.price)}
                              </span>
                            </p>

                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock size={13} /> {apt.time} ({apt.duration}m)
                              </span>
                              {apt.customer_phone && (
                                <span className="flex items-center gap-1">
                                  <Phone size={13} /> {apt.customer_phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1 text-slate-500">
                                <Banknote size={13} /> Pay at venue
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {!isInChair ? (
                            <button
                              type="button"
                              disabled={actionLoading === apt.id}
                              onClick={() =>
                                handleUpdateStatus(apt.id, "in_progress")
                              }
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white inline-flex items-center gap-1.5 shadow-xs"
                            >
                              <PlayCircle size={15} /> Seat Client
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={actionLoading === apt.id}
                              onClick={() =>
                                handleUpdateStatus(apt.id, "completed")
                              }
                              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center gap-1.5 shadow-xs"
                            >
                              <CheckCircle2 size={15} /> Finish Service
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={actionLoading === apt.id}
                            onClick={() =>
                              handleUpdateStatus(apt.id, "cancelled")
                            }
                            className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Cancel / No-show"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {activeQueue.length === 0 && (
                    <div className="p-12 text-center text-xs text-slate-400">
                      No clients currently in your queue.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Next Up Focus Card */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="card p-6 border border-teal-200 bg-gradient-to-br from-white via-white to-teal-50/40 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-teal-600" /> Current Focus
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {nextAppointment ? (
                <div className="space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400 font-semibold uppercase">
                      Time
                    </span>
                    <span className="text-xl font-black text-slate-900">
                      {nextAppointment.time}
                    </span>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-teal-100 shadow-xs space-y-1">
                    <p className="text-xs text-teal-700 font-bold uppercase tracking-wider">
                      {nextAppointment.service_name}
                    </p>
                    <h4 className="text-base font-extrabold text-slate-900">
                      {nextAppointment.customer_name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      Duration: {nextAppointment.duration} mins ·{" "}
                      {formatNaira(nextAppointment.price)}
                    </p>
                  </div>

                  {nextAppointment.status !== "in_progress" ? (
                    <button
                      type="button"
                      disabled={actionLoading === nextAppointment.id}
                      onClick={() =>
                        handleUpdateStatus(nextAppointment.id, "in_progress")
                      }
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white inline-flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <PlayCircle size={15} /> Seat Client Now
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={actionLoading === nextAppointment.id}
                      onClick={() =>
                        handleUpdateStatus(nextAppointment.id, "completed")
                      }
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white inline-flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 size={15} /> Finish Service
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-xs font-bold text-slate-700">
                    All caught up!
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    No active clients assigned right now.
                  </p>
                </div>
              )}
            </div>

            {/* Counter Collection Reminder */}
            <div className="rounded-2xl p-4 bg-slate-900 text-white shadow-md text-xs space-y-1.5">
              <span className="text-teal-300 font-bold flex items-center gap-1.5">
                <Banknote size={14} /> Pay-at-Venue Accounting
              </span>
              <p className="text-slate-300 leading-relaxed">
                Remember to verify the customer's POS receipt or cash before
                tapping <strong>Finish Service</strong>.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
