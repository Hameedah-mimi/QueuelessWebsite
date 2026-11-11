import { useState, useEffect, useCallback } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  TrendingUp,
  DollarSign,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Calendar,
} from "lucide-react";

export default function WorkerEarnings() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const fetchEarnings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/v1/appointments/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];
      // Isolate strictly completed appointments
      setAppointments(
        raw.filter((a) => (a.status || "").toLowerCase() === "completed"),
      );
    } catch (err) {
      console.error("Failed to load earnings:", err);
      setError("Could not calculate earnings from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEarnings();
  }, [fetchEarnings]);

  const totalGross = appointments.reduce(
    (sum, a) => sum + parseFloat(a.price || a.service?.price || 0),
    0,
  );
  const netSpecialistShare = totalGross * 0.7; // 70% specialist commission model
  const platformFee = totalGross * 0.3;

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight flex items-center gap-2">
              <TrendingUp className="text-brand-600" /> Specialist Earnings
              Ledger
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              Calculated dynamically from your completed appointments in the
              database.
            </p>
          </div>

          <button
            onClick={fetchEarnings}
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

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="card p-6 border border-ink-100 bg-white shadow-xs">
            <p className="text-xs font-bold text-ink-400 uppercase">
              Gross Volume Handled
            </p>
            <p className="text-3xl font-black text-ink-900 mt-2">
              {loading ? "…" : formatNaira(totalGross)}
            </p>
            <p className="text-xs text-ink-400 mt-1">
              From {appointments.length} completed sessions
            </p>
          </div>

          <div className="card p-6 border border-ink-100 bg-white shadow-xs">
            <p className="text-xs font-bold text-ink-400 uppercase">
              Net Take-Home (70%)
            </p>
            <p className="text-3xl font-black text-brand-600 mt-2">
              {loading ? "…" : formatNaira(netSpecialistShare)}
            </p>
            <p className="text-xs text-emerald-600 font-bold mt-1">
              Direct specialist payout
            </p>
          </div>

          <div className="card p-6 border border-ink-100 bg-white shadow-xs">
            <p className="text-xs font-bold text-ink-400 uppercase">
              Salon Split (30%)
            </p>
            <p className="text-3xl font-black text-ink-900 mt-2">
              {loading ? "…" : formatNaira(platformFee)}
            </p>
            <p className="text-xs text-ink-400 mt-1">Overhead & venue share</p>
          </div>
        </div>

        {/* Completed Transactions Table */}
        <div className="card border border-ink-100 bg-white shadow-sm overflow-hidden">
          <div className="p-5 border-b border-ink-100">
            <h3 className="font-bold text-ink-900 text-sm">
              Completed Transactions Audit
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-ink-600">
              <thead className="bg-ink-50 text-ink-400 text-xs uppercase font-bold tracking-wider border-b border-ink-100">
                <tr>
                  <th className="py-4 px-6">ID Ref</th>
                  <th className="py-4 px-6">Service</th>
                  <th className="py-4 px-6">Client</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6 text-right">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {appointments.map((a) => (
                  <tr key={a.id} className="hover:bg-ink-50/50 transition">
                    <td className="py-4 px-6 font-mono text-xs font-bold text-ink-800">
                      #{String(a.id).slice(0, 8)}
                    </td>
                    <td className="py-4 px-6 font-semibold text-ink-900">
                      {a.service_name || a.service?.name || "Service"}
                    </td>
                    <td className="py-4 px-6 text-xs text-ink-600">
                      {a.customer_name || a.customer?.full_name || "Client"}
                    </td>
                    <td className="py-4 px-6 text-xs text-ink-400">
                      {a.date || "Recorded"}
                    </td>
                    <td className="py-4 px-6 text-right font-black text-brand-600">
                      {formatNaira(a.price || a.service?.price || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {appointments.length === 0 && (
              <div className="p-12 text-center text-ink-400 text-xs">
                No completed service transactions found in the database.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
