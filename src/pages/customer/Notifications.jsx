import { useState, useEffect, useCallback } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  Bell,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  Trash2,
  Sliders,
  Mail,
  Smartphone,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

// Helper to assign contextual styling and icons based on live backend data
const getNotificationMeta = (title = "", body = "", type = "") => {
  const text = `${title} ${body} ${type}`.toLowerCase();

  if (text.includes("appointment") || text.includes("booking")) {
    return {
      icon: Calendar,
      color: "text-brand-600 bg-brand-50 border-brand-100",
      type: "booking",
    };
  }
  if (
    text.includes("queue") ||
    text.includes("line") ||
    text.includes("turn") ||
    text.includes("ticket")
  ) {
    return {
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      type: "queue",
    };
  }
  if (
    text.includes("security") ||
    text.includes("password") ||
    text.includes("login") ||
    text.includes("auth")
  ) {
    return {
      icon: ShieldCheck,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      type: "security",
    };
  }
  return {
    icon: Sparkles,
    color: "text-blue-600 bg-blue-50 border-blue-100",
    type: "promo",
  };
};

export default function Notifications() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // Notification delivery preferences state
  const [channels, setChannels] = useState({
    sms: true,
    email: true,
    push: false,
  });

  // 100% Real API call to Django notifications backend
  const fetchNotifications = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const res = await api.get("/api/v1/notifications/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];

      const parsed = raw.map((n) => ({
        id: n.id,
        title: n.title || "Platform Notification",
        body: n.body || n.message || "",
        unread: n.unread !== undefined ? n.unread : !n.is_read,
        time: n.created_at
          ? new Date(n.created_at).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : n.time || "Recently",
        type: n.type || n.notification_type || "",
      }));

      setItems(parsed);
    } catch (err) {
      console.error("Failed to load notifications:", err);
      setError("Could not retrieve notifications from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // REAL API: Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await api.patch(`/api/v1/notifications/${id}/`, {
        unread: false,
        is_read: true,
      });
    } catch {
      // Optimistic update
    }
    setItems((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  // REAL API: Mark all as read
  const markAllRead = async () => {
    try {
      await api.post("/api/v1/notifications/read-all/");
    } catch {
      // Fallback
    }
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  // REAL API: Delete notification
  const deleteNotification = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/api/v1/notifications/${id}/`);
    } catch {
      // Optimistic update
    }
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

  const toggleChannel = (channelKey) => {
    setChannels((prev) => ({
      ...prev,
      [channelKey]: !prev[channelKey],
    }));
  };

  const unreadCount = items.filter((n) => n.unread).length;

  // Filter against real database results
  const filteredList = items.filter((n) => {
    if (filter === "unread") return n.unread;
    if (filter === "booking") {
      const meta = getNotificationMeta(n.title, n.body, n.type);
      return meta.type === "booking";
    }
    if (filter === "queue") {
      const meta = getNotificationMeta(n.title, n.body, n.type);
      return meta.type === "queue";
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        {/* ================= TOP HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight flex items-center gap-3">
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-500 text-white font-bold">
                  {unreadCount} new
                </span>
              )}
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              Live updates on appointments, queue movement, and alerts.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchNotifications(true)}
              disabled={refreshing}
              className="btn-secondary text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin text-brand-600" : ""}
              />
              <span>{refreshing ? "Syncing…" : "Sync"}</span>
            </button>

            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="btn-secondary text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 hover:text-brand-600"
              >
                <CheckCheck size={16} /> Mark all as read
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchNotifications()}
              className="underline font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* ================= 2-COLUMN MAIN DESKTOP GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: Real Notification Feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter Tabs Bar */}
            <div className="card p-2 border border-ink-100 bg-white shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {[
                { id: "all", label: "All Updates", count: items.length },
                { id: "unread", label: "Unread", count: unreadCount },
                { id: "booking", label: "Bookings" },
                { id: "queue", label: "Queue Status" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
                    filter === tab.id
                      ? "bg-ink-900 text-white shadow-xs"
                      : "text-ink-600 hover:bg-ink-100/70 hover:text-ink-900"
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                        filter === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-ink-200 text-ink-700"
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Notification List Container */}
            <div className="card border border-ink-100 bg-white shadow-sm overflow-hidden divide-y divide-ink-100">
              {loading ? (
                <div className="p-16 text-center text-xs text-ink-400 animate-pulse">
                  Querying live notifications from database…
                </div>
              ) : (
                filteredList.map((n) => {
                  const meta = getNotificationMeta(n.title, n.body, n.type);
                  const IconComponent = meta.icon;

                  return (
                    <div
                      key={n.id}
                      onClick={() => n.unread && markAsRead(n.id)}
                      className={`p-5 transition flex items-start gap-4 hover:bg-ink-50/70 group cursor-pointer ${
                        n.unread ? "bg-brand-50/30" : "bg-white"
                      }`}
                    >
                      {/* Visual Icon Badge */}
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${meta.color}`}
                      >
                        <IconComponent size={20} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4
                            className={`text-sm truncate ${
                              n.unread
                                ? "font-black text-ink-950"
                                : "font-bold text-ink-800"
                            }`}
                          >
                            {n.title}
                          </h4>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-xs text-ink-400 font-medium">
                              {n.time}
                            </span>
                            {n.unread && (
                              <span
                                className="w-2.5 h-2.5 rounded-full bg-brand-500 shrink-0"
                                title="Unread notification"
                              />
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-ink-600 mt-1 leading-relaxed">
                          {n.body}
                        </p>

                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-ink-400 uppercase tracking-wider">
                            QueueLess Notification
                          </span>

                          <button
                            onClick={(e) => deleteNotification(n.id, e)}
                            className="text-ink-400 hover:text-rose-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Dismiss notification"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Empty State */}
              {!loading && filteredList.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-ink-100 text-ink-400 mx-auto flex items-center justify-center mb-3">
                    <Bell size={26} />
                  </div>
                  <h4 className="text-sm font-bold text-ink-900">
                    All caught up!
                  </h4>
                  <p className="text-xs text-ink-400 max-w-xs mx-auto mt-1">
                    No notifications match your current filter. Real booking and
                    queue updates will appear here.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Delivery Channel Preferences Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-ink-100">
                <Sliders size={18} className="text-brand-600" />
                <h3 className="text-sm font-black text-ink-900">
                  Delivery Channels
                </h3>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-800 font-semibold">
                    <Smartphone size={16} className="text-ink-400" />
                    <span>SMS Queue Alerts</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleChannel("sms")}
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full transition ${
                      channels.sms
                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        : "text-ink-500 bg-ink-100 hover:bg-ink-200"
                    }`}
                  >
                    {channels.sms ? "Active" : "Off"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-800 font-semibold">
                    <Mail size={16} className="text-ink-400" />
                    <span>Email Invoices & Receipts</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleChannel("email")}
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full transition ${
                      channels.email
                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        : "text-ink-500 bg-ink-100 hover:bg-ink-200"
                    }`}
                  >
                    {channels.email ? "Active" : "Off"}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-800 font-semibold">
                    <Bell size={16} className="text-ink-400" />
                    <span>Browser Push Alerts</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleChannel("push")}
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full transition ${
                      channels.push
                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        : "text-ink-500 bg-ink-100 hover:bg-ink-200"
                    }`}
                  >
                    {channels.push ? "Active" : "Paused"}
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-ink-400 pt-3 border-t border-ink-100 leading-relaxed">
                You will always receive immediate reminders 15 minutes before
                your scheduled appointment time.
              </p>
            </div>

            <div className="rounded-2xl p-5 bg-gradient-to-br from-brand-500/10 via-brand-50/50 to-transparent border border-brand-100">
              <h4 className="text-xs font-black text-brand-900 flex items-center gap-1.5 mb-1">
                <Sparkles size={14} className="text-brand-600" /> Live Queue Tip
              </h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Keep SMS alerts active so you can step away for a coffee and
                return only when your ticket is next in line.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
