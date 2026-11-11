import { useState, useEffect, useCallback } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import { CalendarCheck, Search, RefreshCw, AlertCircle } from "lucide-react";

export default function AdminBookings() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const fetchBookings = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const res = await api.get("/api/v1/appointments/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setList(raw);
    } catch (err) {
      console.error("Failed to load appointments:", err);
      setError("Could not query appointments from Django backend.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const filtered = list.filter((b) => {
    const bStatus = (b.status || "").toLowerCase();
    const matchesStatus = statusFilter === "all" || bStatus === statusFilter;
    const serviceName = (b.service_name || b.service?.name || "").toLowerCase();
    const orgName = (b.org || b.organization?.name || "").toLowerCase();
    const customerName = (
      b.customer_name ||
      b.customer?.full_name ||
      ""
    ).toLowerCase();

    const matchesSearch =
      serviceName.includes(search.toLowerCase()) ||
      orgName.includes(search.toLowerCase()) ||
      customerName.includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight flex items-center gap-2">
              <CalendarCheck className="text-brand-600" /> Platform Bookings
              Audit
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              Live audit trail of appointments across all registered businesses
              ({list.length} total).
            </p>
          </div>

          <button
            onClick={() => fetchBookings(true)}
            disabled={refreshing}
            className="btn-secondary text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin text-brand-600" : ""}
            />
            <span>Sync Bookings</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="card p-4 border border-ink-100 bg-white shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
            />
            <input
              type="text"
              placeholder="Search by client, service or salon name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-10 py-2 text-sm w-full bg-white border-ink-200"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {[
              "all",
              "confirmed",
              "pending",
              "in_progress",
              "completed",
              "cancelled",
            ].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition capitalize ${
                  statusFilter === st
                    ? "bg-ink-900 text-white shadow-xs"
                    : "bg-ink-50 text-ink-600 hover:bg-ink-100"
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card border border-ink-100 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-xs text-ink-400 animate-pulse">
              Querying live bookings from server…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink-600">
                <thead className="bg-ink-50 text-ink-400 text-xs uppercase font-bold tracking-wider border-b border-ink-100">
                  <tr>
                    <th className="py-4 px-6">ID Ref</th>
                    <th className="py-4 px-6">Customer & Service</th>
                    <th className="py-4 px-6">Salon / Specialist</th>
                    <th className="py-4 px-6">Scheduled Time</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {filtered.map((b) => (
                    <tr key={b.id} className="hover:bg-ink-50/50 transition">
                      <td className="py-4 px-6 font-mono font-bold text-ink-800 text-xs">
                        #{String(b.id).slice(0, 8)}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-bold text-ink-900">
                          {b.service_name || b.service?.name || "Service"}
                        </p>
                        <p className="text-xs text-ink-400">
                          {b.customer_name || b.customer?.full_name || "Client"}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-xs text-ink-700">
                        <p className="font-semibold">
                          {b.org || b.organization?.name || "Salon"}
                        </p>
                        <p className="text-ink-400">
                          {b.worker_name || b.worker?.full_name || "Assigned"}
                        </p>
                      </td>
                      <td className="py-4 px-6 text-xs text-ink-500">
                        {b.time || b.scheduled_time || "Pending"}
                      </td>
                      <td className="py-4 px-6 font-bold text-brand-600">
                        {formatNaira(b.price || b.total_amount || 0)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full capitalize">
                          ● {b.status || "Active"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filtered.length === 0 && (
                <div className="p-12 text-center text-ink-400 text-xs">
                  No appointments registered in the database matching this
                  filter.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
