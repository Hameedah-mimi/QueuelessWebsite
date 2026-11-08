import { useState } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import {
  Bell,
  Calendar,
  Clock,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  Trash2,
  Sliders,
  Settings,
  Mail,
  Smartphone,
} from "lucide-react";
import { NOTIFICATIONS } from "../../data/mock";

// Helper to assign icons & styles based on notification content
const getNotificationMeta = (title = "", body = "") => {
  const text = (title + " " + body).toLowerCase();
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
    text.includes("turn")
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
    text.includes("login")
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
  const [items, setItems] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  // Filter logic
  const filteredList = items.filter((n) => {
    if (filter === "unread") return n.unread;
    if (filter === "booking") {
      const meta = getNotificationMeta(n.title, n.body);
      return meta.type === "booking";
    }
    if (filter === "queue") {
      const meta = getNotificationMeta(n.title, n.body);
      return meta.type === "queue";
    }
    return true;
  });

  const unreadCount = items.filter((n) => n.unread).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id, e) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((n) => n.id !== id));
  };

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
              Stay updated on booking schedules, queue movements, and special
              offers.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="btn-secondary text-xs px-4 py-2 font-bold inline-flex items-center gap-1.5 self-start sm:self-auto hover:text-brand-600"
            >
              <CheckCheck size={16} /> Mark all as read
            </button>
          )}
        </div>

        {/* ================= 2-COLUMN MAIN DESKTOP GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: Notification Feed */}
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
              {filteredList.map((n) => {
                const meta = getNotificationMeta(n.title, n.body);
                const IconComponent = meta.icon;

                return (
                  <div
                    key={n.id}
                    className={`p-5 transition flex items-start gap-4 hover:bg-ink-50/70 group ${
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
                          QueueLess System
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
              })}

              {/* Empty State */}
              {filteredList.length === 0 && (
                <div className="p-12 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-ink-100 text-ink-400 mx-auto flex items-center justify-center mb-3">
                    <Bell size={26} />
                  </div>
                  <h4 className="text-sm font-bold text-ink-900">
                    All caught up!
                  </h4>
                  <p className="text-xs text-ink-400 max-w-xs mx-auto mt-1">
                    No notifications match your current filter. You're
                    completely up to date.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Notification Preferences Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* Quick Preferences Card */}
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
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-800 font-semibold">
                    <Mail size={16} className="text-ink-400" />
                    <span>Email Invoices & Receipts</span>
                  </div>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-ink-800 font-semibold">
                    <Bell size={16} className="text-ink-400" />
                    <span>Browser Push Alerts</span>
                  </div>
                  <span className="text-xs font-bold text-ink-500 bg-ink-100 px-2 py-0.5 rounded-full">
                    Paused
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-ink-400 pt-3 border-t border-ink-100 leading-relaxed">
                You will always receive immediate text reminders 15 minutes
                before your scheduled appointment time.
              </p>
            </div>

            {/* Quick Tip Banner */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-brand-500/10 via-brand-50/50 to-transparent border border-brand-100">
              <h4 className="text-xs font-black text-brand-900 flex items-center gap-1.5 mb-1">
                <Sparkles size={14} className="text-brand-600" /> Live Queue Tip
              </h4>
              <p className="text-xs text-ink-600 leading-relaxed">
                Keep SMS alerts active so you can step away for lunch or coffee
                and only return when you're 2nd in line.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
