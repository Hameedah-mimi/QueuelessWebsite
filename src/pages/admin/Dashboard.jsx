import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import {
  Users,
  Building2,
  Calendar,
  TrendingUp,
  Activity,
  AlertCircle,
  ArrowRight,
  RefreshCw,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Live state computed strictly from backend data
  const [usersList, setUsersList] = useState([]);
  const [orgsList, setOrgsList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const fetchDashboardData = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const [usersRes, orgsRes, bookingsRes] = await Promise.allSettled([
        api.get("/api/v1/auth/users/"),
        api.get("/api/v1/organizations/"),
        api.get("/api/v1/appointments/"),
      ]);

      const unwrap = (res) => {
        if (res.status !== "fulfilled") return [];
        const d = res.value.data;
        return Array.isArray(d) ? d : d?.results || [];
      };

      setUsersList(unwrap(usersRes));
      setOrgsList(unwrap(orgsRes));
      setBookingsList(unwrap(bookingsRes));
    } catch (err) {
      console.error("Admin live fetch error:", err);
      setError("Unable to synchronize live platform data from Django server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
    const t = setInterval(() => fetchDashboardData(true), 15000);
    return () => clearInterval(t);
  }, [fetchDashboardData]);

  // --- Real Dynamic Calculations ---
  const totalUsersCount = usersList.length;
  const pendingOrgs = orgsList.filter(
    (o) => o.status === "pending" || o.is_verified === false,
  );
  const totalBookingsCount = bookingsList.length;
  const totalRevenue = bookingsList
    .filter((b) => (b.status || "").toLowerCase() === "completed")
    .reduce(
      (acc, curr) => acc + parseFloat(curr.price || curr.total_amount || 0),
      0,
    );

  // Real user mix split
  const customersCount = usersList.filter((u) => u.role === "customer").length;
  const workersCount = usersList.filter((u) => u.role === "worker").length;
  const managersCount = usersList.filter(
    (u) => u.role === "org_manager" || u.role === "organization",
  ).length;

  const roleSplitData = [
    { name: "Customers", value: customersCount, color: "#16A6A1" },
    { name: "Workers", value: workersCount, color: "#102A43" },
    { name: "Organizations", value: managersCount, color: "#F59E0B" },
  ].filter((item) => item.value > 0);

  const displayName =
    user?.first_name ||
    user?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Admin";

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
              Admin Dashboard
            </h1>
            <p className="text-ink-500 text-sm mt-1">
              Welcome back, {displayName} · Live platform statistics from
              database
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchDashboardData(true)}
              disabled={refreshing}
              className="btn-secondary text-xs px-3.5 py-1.5 font-bold inline-flex items-center gap-1.5 shadow-xs"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin text-brand-600" : ""}
              />
              <span>{refreshing ? "Syncing…" : "Sync Live Data"}</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => fetchDashboardData()}
              className="underline hover:text-amber-950 font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* 4 Clickable KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/admin/users"
            className="card p-5 border border-ink-100 bg-white hover:border-brand-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                  Total Users
                </p>
                <p className="text-3xl font-black text-ink-900 mt-1 group-hover:text-brand-600 transition">
                  {loading ? "…" : totalUsersCount}
                </p>
                <p className="text-xs font-semibold text-brand-600 mt-1">
                  Live in database
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <Users size={22} />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/organizations"
            className="card p-5 border border-ink-100 bg-white hover:border-brand-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                  Organizations
                </p>
                <p className="text-3xl font-black text-ink-900 mt-1 group-hover:text-brand-600 transition">
                  {loading ? "…" : orgsList.length}
                </p>
                <p className="text-xs font-semibold text-amber-600 mt-1">
                  {pendingOrgs.length} awaiting approval
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Building2 size={22} />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/bookings"
            className="card p-5 border border-ink-100 bg-white hover:border-brand-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                  Total Bookings
                </p>
                <p className="text-3xl font-black text-ink-900 mt-1 group-hover:text-brand-600 transition">
                  {loading ? "…" : totalBookingsCount}
                </p>
                <p className="text-xs font-semibold text-blue-600 mt-1">
                  All schedules
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Calendar size={22} />
              </div>
            </div>
          </Link>

          <Link
            to="/admin/analytics"
            className="card p-5 border border-ink-100 bg-white hover:border-brand-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                  Completed Volume
                </p>
                <p className="text-2xl sm:text-3xl font-black text-brand-600 mt-1">
                  {loading ? "…" : formatNaira(totalRevenue)}
                </p>
                <p className="text-xs font-semibold text-emerald-600 mt-1">
                  Recorded revenue
                </p>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <TrendingUp size={22} />
              </div>
            </div>
          </Link>
        </div>

        {/* User Distribution & Live Activity Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* User Mix Chart (1 Col) */}
          <div className="card p-6 border border-ink-100 bg-white shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-ink-100">
                <h2 className="text-sm font-black text-ink-900 uppercase tracking-wider">
                  Live User Mix
                </h2>
                <Link
                  to="/admin/users"
                  className="text-xs text-brand-600 font-bold hover:underline"
                >
                  Manage
                </Link>
              </div>

              {roleSplitData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie
                        data={roleSplitData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={48}
                        outerRadius={70}
                        paddingAngle={4}
                      >
                        {roleSplitData.map((e) => (
                          <Cell key={e.name} fill={e.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="space-y-2 pt-3 border-t border-ink-100">
                    {roleSplitData.map((r) => (
                      <div
                        key={r.name}
                        className="flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2 text-ink-600 font-medium">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{ background: r.color }}
                          />
                          {r.name}
                        </div>
                        <span className="font-bold text-ink-900">
                          {r.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="py-12 text-center text-xs text-ink-400">
                  No registered users in the database yet.
                </div>
              )}
            </div>
          </div>

          {/* Real Live Activity Feed (2 Cols) */}
          <div className="card p-6 border border-ink-100 bg-white shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-ink-100">
              <h2 className="text-sm font-black text-ink-900 uppercase tracking-wider flex items-center gap-2">
                <Activity size={16} className="text-brand-600" /> Recent
                Platform Activity
              </h2>
              <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                ● Live Database Feed
              </span>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {bookingsList.slice(0, 6).map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-xl border border-ink-100 bg-ink-50/50 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-ink-900">
                      {b.service_name || b.service?.name || "Appointment"} ·{" "}
                      <span className="text-brand-600">{b.org || "Salon"}</span>
                    </p>
                    <p className="text-[11px] text-ink-400 mt-0.5">
                      Client:{" "}
                      {b.customer_name || b.customer?.full_name || "Client"} ·{" "}
                      {b.time || "Scheduled"}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white border border-ink-200">
                    {b.status || "Active"}
                  </span>
                </div>
              ))}

              {bookingsList.length === 0 && (
                <div className="py-16 text-center text-xs text-ink-400">
                  No appointments or activity logged in the database yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pending Approvals Callout */}
        {pendingOrgs.length > 0 && (
          <Link
            to="/admin/organizations"
            className="card p-5 flex items-center justify-between gap-4 border border-amber-200 bg-gradient-to-r from-amber-50 to-amber-100/30 hover:border-amber-400 hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              <AlertCircle
                size={22}
                className="text-amber-600 shrink-0 mt-0.5"
              />
              <div>
                <p className="text-sm font-bold text-amber-950">
                  {pendingOrgs.length} organization
                  {pendingOrgs.length > 1 ? "s" : ""} awaiting verification
                </p>
                <p className="text-xs text-amber-800 mt-0.5">
                  Review licenses and verify their profiles to allow them to
                  onboard specialists and accept queue bookings.
                </p>
              </div>
            </div>

            <span className="btn-primary bg-amber-600 hover:bg-amber-700 text-white text-xs px-4 py-2 font-bold shrink-0 inline-flex items-center gap-1 shadow-sm">
              Review Now <ArrowRight size={13} />
            </span>
          </Link>
        )}
      </main>
    </div>
  );
}
