import { useState, useEffect, useCallback } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  Building2,
  CheckCircle2,
  XCircle,
  MapPin,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function AdminOrganizations() {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const fetchOrgs = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      // 100% Real API call to organizations app
      const res = await api.get("/api/v1/organizations/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setOrgs(raw);
    } catch (err) {
      console.error("Failed to load organizations:", err);
      setError("Could not fetch organizations list from Django.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrgs();
  }, [fetchOrgs]);

  const handleApprove = async (id) => {
    try {
      await api.post(`/api/v1/manage/organizations/${id}/publish/`);
      setOrgs((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, is_verified: true, status: "approved" } : o,
        ),
      );
    } catch {
      // Direct patch fallback
      await api.patch(`/api/v1/organizations/${id}/`, {
        is_verified: true,
        status: "approved",
      });
      setOrgs((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, is_verified: true, status: "approved" } : o,
        ),
      );
    }
  };

  const handleReject = async (id) => {
    try {
      await api.patch(`/api/v1/organizations/${id}/`, {
        is_verified: false,
        status: "rejected",
      });
      setOrgs((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, is_verified: false, status: "rejected" } : o,
        ),
      );
    } catch (err) {
      alert("Failed to update organization status.");
    }
  };

  const filteredOrgs = orgs.filter((o) => {
    const isApproved = o.status === "approved" || o.is_verified === true;
    const matchesTab =
      tab === "all" ||
      (tab === "approved" && isApproved) ||
      (tab === "pending" && !isApproved);
    const matchesSearch =
      (o.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.location || "").toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight flex items-center gap-2">
              <Building2 className="text-brand-600" /> Organization Management
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              Verify licenses and approve businesses onto QueueLess.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchOrgs(true)}
              disabled={refreshing}
              className="btn-secondary text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin text-brand-600" : ""}
              />
              <span>Refresh</span>
            </button>

            <div className="flex bg-ink-100 p-1 rounded-2xl">
              {["all", "pending", "approved"].map((t) => (
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
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="p-16 text-center text-xs text-ink-400 animate-pulse">
            Loading verified organizations from backend…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOrgs.map((org) => {
              const isApproved =
                org.status === "approved" || org.is_verified === true;

              return (
                <div
                  key={org.id}
                  className="card border border-ink-100 bg-white overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
                >
                  <div>
                    <div className="relative h-44 bg-ink-200">
                      {org.image ? (
                        <img
                          src={org.image}
                          alt={org.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-ink-100 text-ink-400 text-xs font-bold">
                          No Photo Uploaded
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-xs ${
                            isApproved
                              ? "bg-emerald-500 text-white"
                              : "bg-amber-500 text-white"
                          }`}
                        >
                          ● {isApproved ? "Approved" : "Pending Verification"}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-2">
                      <h3 className="font-bold text-ink-900 text-lg">
                        {org.name}
                      </h3>
                      <p className="text-xs text-ink-500 flex items-center gap-1.5">
                        <MapPin size={14} className="text-brand-600" />{" "}
                        {org.location || "Location Not Specified"}
                      </p>
                      <p className="text-xs text-ink-400">
                        Category: {org.category || "General Service"}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-ink-100 mt-4 flex items-center justify-between gap-2 pt-4">
                    {!isApproved ? (
                      <>
                        <button
                          onClick={() => handleApprove(org.id)}
                          className="btn-primary text-xs py-2 px-4 flex-1 font-bold inline-flex items-center justify-center gap-1"
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(org.id)}
                          className="btn-danger text-xs py-2 px-4 font-bold"
                        >
                          Reject
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleReject(org.id)}
                        className="text-xs font-bold text-rose-600 hover:underline"
                      >
                        Suspend Business
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredOrgs.length === 0 && (
              <div className="col-span-full card p-12 text-center text-ink-400 text-xs border border-dashed border-ink-200">
                No organizations found in the database.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
