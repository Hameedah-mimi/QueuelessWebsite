import { useState, useEffect, useCallback } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Phone,
  AlertCircle,
} from "lucide-react";

export default function WorkerSchedule() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("upcoming");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const fetchSchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/v1/appointments/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setAppointments(raw);
    } catch (err) {
      console.error("Failed to load schedule:", err);
      setError("Could not retrieve schedule from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedule();
  }, [fetchSchedule]);

  const filtered = appointments.filter((item) => {
    const st = (item.status || "pending").toLowerCase();
    const matchesTab =
      tab === "upcoming"
        ? st !== "completed" && st !== "cancelled"
        : tab === "completed"
          ? st === "completed"
          : st === "cancelled";

    const customer = (
      item.customer_name ||
      item.customer?.full_name ||
      ""
    ).toLowerCase();
    const service = (
      item.service_name ||
      item.service?.name ||
      ""
    ).toLowerCase();
    const matchesSearch =
      customer.includes(search.toLowerCase()) ||
      service.includes(search.toLowerCase());

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight flex items-center gap-2">
              <Calendar className="text-brand-600" /> My Appointment Schedule
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              Complete calendar of clients booked specifically with you.
            </p>
          </div>

          <button
            onClick={fetchSchedule}
            className="btn-secondary text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw
              size={14}
              className={loading ? "animate-spin text-brand-600" : ""}
            />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search & Tabs */}
        <div className="card p-4 border border-ink-100 bg-white shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              type="text"
              placeholder="Search by customer name or service…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 py-2 text-sm w-full bg-white border-ink-200"
            />
          </div>

          <div className="flex bg-ink-100 p-1 rounded-2xl">
            {["upcoming", "completed", "cancelled"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition ${
                  tab === t
                    ? "bg-white text-ink-900 shadow-xs"
                    : "text-ink-600 hover:text-ink-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Schedule List */}
        <div className="card border border-ink-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-xs text-ink-400 animate-pulse">
              Querying schedule records from database…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink-600">
                <thead className="bg-ink-50 text-ink-400 text-xs uppercase font-bold tracking-wider border-b border-ink-100">
                  <tr>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Service</th>
                    <th className="py-4 px-6">Date & Slot</th>
                    <th className="py-4 px-6">Fee</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-ink-50/50 transition">
                      <td className="py-4 px-6">
                        <p className="font-bold text-ink-900">
                          {item.customer_name ||
                            item.customer?.full_name ||
                            "Client"}
                        </p>
                        {item.customer_phone && (
                          <p className="text-xs text-ink-400 flex items-center gap-1 mt-0.5">
                            <Phone size={12} /> {item.customer_phone}
                          </p>
                        )}
                      </td>
                      <td className="py-4 px-6 font-semibold text-ink-800">
                        {item.service_name || item.service?.name || "Service"}
                      </td>
                      <td className="py-4 px-6 text-xs text-ink-500">
                        {item.date || "Today"} ·{" "}
                        {item.time || item.scheduled_time || "Pending"}
                      </td>
                      <td className="py-4 px-6 font-bold text-brand-600">
                        {formatNaira(item.price || item.service?.price || 0)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full capitalize">
                          ● {item.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="p-12 text-center text-ink-400 text-xs">
                  No appointments found under "{tab}".
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
