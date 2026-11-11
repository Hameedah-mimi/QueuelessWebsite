import { useState, useEffect, useCallback } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  Users as UsersIcon,
  Search,
  RefreshCw,
  Mail,
  AlertCircle,
  Trash2,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [error, setError] = useState(null);

  // 100% Real API call to Django User directory
  const fetchUsers = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const res = await api.get("/api/v1/auth/users/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setUsers(raw);
    } catch (err) {
      console.error("Failed to fetch real users:", err);
      setError("Could not retrieve user directory from backend.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // REAL API: Toggle Active / Suspended status
  const toggleStatus = async (id, currentStatus) => {
    try {
      await api.patch(`/api/v1/auth/users/${id}/`, {
        is_active: !currentStatus,
      });
      setUsers((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, is_active: !currentStatus } : u,
        ),
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Could not update user status on server.");
    }
  };

  // REAL API: Permanently Delete User from Django Database
  const handleDeleteUser = async (userObj) => {
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete user "${userObj.full_name || userObj.email}"? This action cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await api.delete(`/api/v1/auth/users/${userObj.id}/`);
      setUsers((prev) => prev.filter((u) => u.id !== userObj.id));
      alert(`User "${userObj.email}" was permanently deleted.`);
    } catch (err) {
      console.error("Failed to delete user:", err);
      const msg =
        err.response?.data?.detail ||
        "Could not delete user. Check backend permissions.";
      alert(msg);
    }
  };

  // Filter against real database results
  const filteredUsers = users.filter((u) => {
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    const matchesSearch =
      (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchesRole && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <UsersIcon className="text-teal-600" /> Platform User Directory
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Live accounts registered in the database ({users.length} total
              users).
            </p>
          </div>

          <button
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="btn-secondary text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <RefreshCw
              size={14}
              className={refreshing ? "animate-spin text-teal-600" : ""}
            />
            <span>Sync Directory</span>
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Search & Filter Bar */}
        <div className="card p-4 border border-slate-200 bg-white shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Search by full name or email address…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {["all", "customer", "worker", "org_manager", "admin"].map(
              (role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap capitalize ${
                    roleFilter === role
                      ? "bg-slate-900 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {role === "all" ? "All Roles" : role.replace("_", " ")}
                </button>
              ),
            )}
          </div>
        </div>

        {/* Real Table */}
        <div className="card border border-slate-200 bg-white shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
              Querying registered users from PostgreSQL database…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="py-4 px-6">User Profile</th>
                    <th className="py-4 px-6">Assigned Role</th>
                    <th className="py-4 px-6">Account Status</th>
                    <th className="py-4 px-6">Created On</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => {
                    const isActive = u.is_active !== false;

                    return (
                      <tr
                        key={u.id}
                        className="hover:bg-slate-50/60 transition"
                      >
                        <td className="py-4 px-6 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-800 font-bold flex items-center justify-center shrink-0">
                            {(u.full_name || u.email || "U")[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">
                              {u.full_name || "Anonymous User"}
                            </p>
                            <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                              <Mail size={12} /> {u.email}
                            </p>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                              u.role === "admin"
                                ? "bg-purple-50 text-purple-700 border border-purple-100"
                                : u.role === "org_manager" ||
                                    u.role === "organization"
                                  ? "bg-blue-50 text-blue-700 border border-blue-100"
                                  : u.role === "worker"
                                    ? "bg-amber-50 text-amber-700 border border-amber-100"
                                    : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            }`}
                          >
                            {u.role?.replace("_", " ") || "Customer"}
                          </span>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                              isActive
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-rose-500"}`}
                            />
                            {isActive ? "Active" : "Suspended"}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-xs text-slate-500">
                          {u.created_at
                            ? new Date(u.created_at).toLocaleDateString()
                            : "Active"}
                        </td>

                        {/* Clean Single Actions Column */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => toggleStatus(u.id, isActive)}
                              className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                                isActive
                                  ? "border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-700"
                                  : "border-emerald-500 text-emerald-700 bg-emerald-50"
                              }`}
                            >
                              {isActive ? "Suspend" : "Activate"}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteUser(u)}
                              className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition"
                              title="Permanently Delete User"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="p-12 text-center text-slate-400 text-xs">
                  No users found in database matching your filter.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
