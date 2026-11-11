import { useState, useEffect, useCallback } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  Users,
  PlayCircle,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Clock,
  AlertCircle,
} from "lucide-react";

export default function OrgQueueManager() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [walkinName, setWalkinName] = useState("");
  const [walkinService, setWalkinService] = useState("");
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const loadQueue = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      // 100% Real API call
      const res = await api.get("/api/v1/appointments/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];

      // Filter active in-queue tickets strictly from backend
      const active = raw
        .filter(
          (item) => item.status !== "completed" && item.status !== "cancelled",
        )
        .map((item, idx) => ({
          id: item.id,
          ticketNumber: `#00${idx + 1}`,
          customer_name:
            item.customer_name || item.customer?.full_name || "Walk-in Client",
          service_name:
            item.service_name || item.service?.name || "General Service",
          worker_name:
            item.worker_name ||
            item.worker?.full_name ||
            "Next Available Specialist",
          status: (item.status || "pending").toLowerCase(),
          time: item.time || item.scheduled_time || "Just now",
        }));

      setQueue(active);
    } catch (err) {
      console.error("Queue fetch error:", err);
      setError("Unable to load live queue from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadQueue();
    const timer = setInterval(() => loadQueue(true), 10000);
    return () => clearInterval(timer);
  }, [loadQueue]);

  const handleUpdate = async (id, status) => {
    setActionLoading(id);
    try {
      // Direct patch to Django backend
      await api.patch(`/api/v1/appointments/${id}/`, { status });
      setQueue((prev) =>
        status === "completed" || status === "cancelled"
          ? prev.filter((q) => q.id !== id)
          : prev.map((q) => (q.id === id ? { ...q, status } : q)),
      );
    } catch (err) {
      console.error("Failed to update status", err);
      loadQueue(true);
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddWalkin = async (e) => {
    e.preventDefault();
    if (!walkinName.trim()) return;

    try {
      await api.post("/api/v1/appointments/", {
        customer_name: walkinName.trim(),
        service_name: walkinService || "Walk-in Service",
        status: "pending",
      });
      setWalkinName("");
      setWalkinService("");
      loadQueue(true);
    } catch (err) {
      console.error("Failed to issue walk-in ticket", err);
      alert("Could not create walk-in ticket. Check backend connection.");
    }
  };

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight flex items-center gap-2">
              <Users className="text-brand-600" /> Live Queue Terminal
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              Call tickets, seat waiting customers, and issue in-person walk-in
              tickets.
            </p>
          </div>

          <button
            onClick={() => loadQueue(true)}
            className="btn-secondary text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin text-brand-600" : ""}
            />
            <span>Sync Queue</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Active Queue Feed */}
          <div className="lg:col-span-2 space-y-4">
            <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-ink-100">
                <h3 className="text-sm font-black text-ink-900 uppercase tracking-wider">
                  Active Waiting Line ({queue.length})
                </h3>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  ● Real-time Sync Active
                </span>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-ink-400 animate-pulse">
                  Querying live queue tickets from database…
                </div>
              ) : (
                <div className="space-y-3">
                  {queue.map((item, idx) => {
                    const isInChair = item.status === "in_progress";

                    return (
                      <div
                        key={item.id}
                        className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isInChair
                            ? "border-brand-500 bg-brand-50/20 ring-2 ring-brand-500/20 shadow-xs"
                            : "border-ink-100 bg-white hover:border-brand-200"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black shadow-xs shrink-0 ${
                              isInChair
                                ? "bg-brand-500 text-white"
                                : "bg-ink-100 text-ink-900"
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold opacity-70">
                              Pos
                            </span>
                            <span className="text-base">
                              {item.ticketNumber || `#00${idx + 1}`}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-ink-900 text-base">
                                {item.customer_name}
                              </h4>
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  isInChair
                                    ? "bg-brand-500 text-white animate-pulse"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {isInChair ? "In Chair" : "Waiting"}
                              </span>
                            </div>
                            <p className="text-xs text-ink-500 font-medium mt-0.5">
                              {item.service_name} · Specialist:{" "}
                              <strong>{item.worker_name}</strong>
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          {!isInChair ? (
                            <button
                              type="button"
                              disabled={actionLoading === item.id}
                              onClick={() =>
                                handleUpdate(item.id, "in_progress")
                              }
                              className="btn-primary text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 shadow-xs"
                            >
                              <PlayCircle size={15} /> Seat Client
                            </button>
                          ) : (
                            <button
                              type="button"
                              disabled={actionLoading === item.id}
                              onClick={() => handleUpdate(item.id, "completed")}
                              className="btn-primary bg-emerald-600 hover:bg-emerald-700 text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 shadow-xs"
                            >
                              <CheckCircle2 size={15} /> Finish Service
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={actionLoading === item.id}
                            onClick={() => handleUpdate(item.id, "cancelled")}
                            className="p-2 rounded-xl text-ink-400 hover:text-rose-600 hover:bg-rose-50 transition"
                            title="Cancel ticket"
                          >
                            <XCircle size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {queue.length === 0 && (
                    <div className="p-12 text-center text-ink-400 text-xs">
                      No clients currently in line. Walk-ins and reservations
                      will appear here automatically.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Issue In-Person Walk-In */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-4">
              <h3 className="text-sm font-black text-ink-900 pb-2 border-b border-ink-100">
                Issue In-Person Walk-In
              </h3>

              <form onSubmit={handleAddWalkin} className="space-y-3">
                <div>
                  <label className="label text-xs font-bold text-ink-700">
                    Client Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Adebayo Sodiq"
                    value={walkinName}
                    onChange={(e) => setWalkinName(e.target.value)}
                    className="input text-sm"
                  />
                </div>

                <div>
                  <label className="label text-xs font-bold text-ink-700">
                    Service Requested
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Haircut, Braids, Facial"
                    value={walkinService}
                    onChange={(e) => setWalkinService(e.target.value)}
                    className="input text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-xs mt-2"
                >
                  <Plus size={15} /> Issue Ticket into Line
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
