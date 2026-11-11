import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

export default function Queue() {
  const [activeTicket, setActiveTicket] = useState(null);
  const [ahead, setAhead] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState(null);

  // 100% Real API: Check user's active in-progress or pending appointments
  const fetchMyQueue = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const res = await api.get("/api/v1/appointments/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];

      // Find user's active ticket
      const myTicket = raw.find(
        (a) =>
          (a.status || "").toLowerCase() === "in_progress" ||
          (a.status || "").toLowerCase() === "pending",
      );

      if (myTicket) {
        setActiveTicket(myTicket);
        // Find how many other pending tickets were created before this one
        const othersAhead = raw.filter(
          (a) =>
            a.id !== myTicket.id &&
            (a.status || "").toLowerCase() === "pending",
        ).length;
        setAhead(othersAhead);
      } else {
        setActiveTicket(null);
      }
    } catch (err) {
      console.error("Queue sync error:", err);
      setError("Could not connect to live queue.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMyQueue();
    const t = setInterval(() => fetchMyQueue(true), 12000);
    return () => clearInterval(t);
  }, [fetchMyQueue]);

  // REAL API: Leave / Cancel ticket
  const handleLeaveQueue = async () => {
    if (!activeTicket) return;
    if (
      !window.confirm("Are you sure you want to surrender your spot in line?")
    )
      return;

    setLeaving(true);
    try {
      await api.patch(`/api/v1/appointments/${activeTicket.id}/`, {
        status: "cancelled",
      });
      setActiveTicket(null);
      alert("You have surrendered your spot.");
    } catch (err) {
      console.error("Failed to leave queue:", err);
      alert("Could not cancel ticket.");
    } finally {
      setLeaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
              Virtual Queue Terminal
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              Live line tracking powered directly by your salon's database.
            </p>
          </div>

          <button
            onClick={() => fetchMyQueue(true)}
            className="btn-secondary text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin text-brand-600" : ""}
            />
            <span>Sync</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center text-xs text-ink-400 animate-pulse">
            Checking live tickets in database…
          </div>
        ) : activeTicket ? (
          <div className="max-w-xl mx-auto space-y-6">
            <div className="card p-8 border border-ink-100 bg-white shadow-sm text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
                {activeTicket.status === "in_progress"
                  ? "Currently In Chair"
                  : "In Line"}
              </span>

              <div className="text-6xl font-black text-ink-900">
                #{String(activeTicket.id).slice(0, 4)}
              </div>

              <p className="text-sm font-bold text-ink-800">
                {activeTicket.service_name ||
                  activeTicket.service?.name ||
                  "Service"}
              </p>
              <p className="text-xs text-ink-400">
                {activeTicket.org || activeTicket.organization?.name || "Salon"}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-ink-100">
                <div>
                  <p className="text-2xl font-black text-ink-900">{ahead}</p>
                  <p className="text-[11px] text-ink-400 uppercase font-semibold">
                    Ahead of you
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-black text-brand-600">
                    ~{ahead * 15}m
                  </p>
                  <p className="text-[11px] text-ink-400 uppercase font-semibold">
                    Est. Wait
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLeaveQueue}
              disabled={leaving}
              className="btn-danger w-full py-3 text-xs font-bold"
            >
              {leaving ? "Cancelling…" : "Surrender Spot & Leave Queue"}
            </button>
          </div>
        ) : (
          <div className="card p-12 text-center border border-dashed border-ink-200 bg-white space-y-3">
            <Clock size={32} className="text-ink-300 mx-auto" />
            <h3 className="text-base font-bold text-ink-900">
              You are not in any queue
            </h3>
            <p className="text-xs text-ink-400 max-w-sm mx-auto">
              Book a service or walk into any participating salon to receive a
              live digital ticket.
            </p>
            <Link
              to="/customer/explore"
              className="btn-primary text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5"
            >
              Explore Salons <ArrowRight size={13} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
