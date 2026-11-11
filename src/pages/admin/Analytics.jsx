import { useState, useEffect, useCallback } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import { BarChart3, TrendingUp, RefreshCw, AlertCircle } from "lucide-react";

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState(null);

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/v1/appointments/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setAppointments(raw);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Unable to load revenue numbers from backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  // Real calculations
  const totalCompleted = appointments.filter(
    (a) => (a.status || "").toLowerCase() === "completed",
  );
  const grossVolume = totalCompleted.reduce(
    (sum, a) => sum + parseFloat(a.price || a.total_amount || 0),
    0,
  );
  const platformTakeRate = grossVolume * 0.05; // 5% platform fee
  const averagePrice =
    totalCompleted.length > 0 ? grossVolume / totalCompleted.length : 0;

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight flex items-center gap-2">
              <BarChart3 className="text-brand-600" /> Platform Analytics &
              Revenue
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              Calculated dynamically from real booking transactions in the
              database.
            </p>
          </div>

          <button
            onClick={fetchAnalytics}
            className="btn-secondary text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin text-brand-600" : ""}
            />
            <span>Recalculate</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 4 Real Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-6 border border-ink-100 bg-white shadow-xs">
            <p className="text-xs font-bold text-ink-400 uppercase">
              Gross Completed Volume
            </p>
            <p className="text-3xl font-black text-ink-900 mt-2">
              {loading ? "…" : formatNaira(grossVolume)}
            </p>
            <p className="text-xs text-ink-400 mt-1">From finished services</p>
          </div>

          <div className="card p-6 border border-ink-100 bg-white shadow-xs">
            <p className="text-xs font-bold text-ink-400 uppercase">
              Platform Commission (5%)
            </p>
            <p className="text-3xl font-black text-brand-600 mt-2">
              {loading ? "…" : formatNaira(platformTakeRate)}
            </p>
            <p className="text-xs text-emerald-600 font-bold mt-1">
              QueueLess Net Margin
            </p>
          </div>

          <div className="card p-6 border border-ink-100 bg-white shadow-xs">
            <p className="text-xs font-bold text-ink-400 uppercase">
              Finished Sessions
            </p>
            <p className="text-3xl font-black text-ink-900 mt-2">
              {loading ? "…" : totalCompleted.length}
            </p>
            <p className="text-xs text-ink-400 mt-1">
              Out of {appointments.length} total orders
            </p>
          </div>

          <div className="card p-6 border border-ink-100 bg-white shadow-xs">
            <p className="text-xs font-bold text-ink-400 uppercase">
              Average Order Value
            </p>
            <p className="text-3xl font-black text-ink-900 mt-2">
              {loading ? "…" : formatNaira(averagePrice)}
            </p>
            <p className="text-xs text-ink-400 mt-1">Per client transaction</p>
          </div>
        </div>
      </main>
    </div>
  );
}
