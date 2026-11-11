import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import {
  Search,
  Star,
  MapPin,
  ChevronRight,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  Zap,
  TrendingUp,
  ShieldCheck,
  Stethoscope,
  Wrench,
  Scissors,
  Building2,
  Sparkle,
  Layers,
  AlertCircle,
} from "lucide-react";

// Professional multi-industry categories with clean SVG icons (Zero Emojis)
const CATEGORIES = [
  {
    id: "salon",
    label: "Salons & Grooming",
    icon: Scissors,
    color: "text-teal-600 bg-teal-50 border-teal-100",
  },
  {
    id: "clinic",
    label: "Medical & Clinics",
    icon: Stethoscope,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  {
    id: "auto",
    label: "Auto & Repairs",
    icon: Wrench,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
  {
    id: "spa",
    label: "Spas & Wellness",
    icon: Sparkles,
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  {
    id: "consulting",
    label: "Legal & Consulting",
    icon: Building2,
    color: "text-blue-600 bg-blue-50 border-blue-100",
  },
  {
    id: "all",
    label: "All Services",
    icon: Layers,
    color: "text-slate-600 bg-slate-100 border-slate-200",
  },
];

export default function CustomerHome() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [organizations, setOrganizations] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // 100% Real API queries to Django
  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [aptRes, orgRes] = await Promise.allSettled([
        api.get("/api/v1/appointments/"),
        api.get("/api/v1/organizations/"),
      ]);

      if (aptRes.status === "fulfilled") {
        const rawApts = Array.isArray(aptRes.value.data)
          ? aptRes.value.data
          : aptRes.value.data?.results || [];

        const parsedApts = rawApts.map((item) => ({
          id: item.id,
          service:
            item.service_name ||
            item.service?.name ||
            item.service ||
            "Appointment",
          org:
            item.organization_name ||
            item.organization?.name ||
            item.org ||
            "Service Venue",
          worker: item.worker_name || item.worker?.full_name || "Specialist",
          date: item.date || item.scheduled_date || "Today",
          time: item.time || item.scheduled_time || "Scheduled Time",
          duration: item.duration || item.service?.duration || 45,
          status: (item.status || "pending").toLowerCase(),
        }));
        setAppointments(parsedApts);
      }

      if (orgRes.status === "fulfilled") {
        const rawOrgs = Array.isArray(orgRes.value.data)
          ? orgRes.value.data
          : orgRes.value.data?.results || [];

        const parsedOrgs = rawOrgs.map((org) => ({
          id: org.id,
          name: org.name || "Unnamed Venue",
          category: org.category || "Professional Service",
          location: org.location || org.address || "Victoria Island, Lagos",
          distance: org.distance || "Near you",
          rating: parseFloat(org.rating || org.average_rating || 5.0),
          reviews: parseInt(org.reviews || org.review_count || 0, 10),
          image: org.image || org.avatar_url || null,
          open: org.open !== undefined ? org.open : true,
        }));
        setOrganizations(parsedOrgs);
      }
    } catch (err) {
      console.error("Failed to load customer home data:", err);
      setError("Could not retrieve live data from the server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // Real upcoming appointment
  const upcoming = appointments.find(
    (a) => a.status !== "completed" && a.status !== "cancelled",
  );

  // Real active virtual queue ticket
  const activeQueueTicket = appointments.find(
    (a) => a.status === "in_progress" || a.status === "pending",
  );

  const featured = organizations.slice(0, 4);

  const displayName =
    user?.first_name ||
    user?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "Client";

  return (
    <div className="min-h-screen bg-slate-50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* ================= HERO BANNER (HIGH CONTRAST & READABLE) ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-slate-800">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-950/60 via-slate-950 to-slate-950" />
          <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-bold tracking-wider uppercase border border-teal-500/20">
              <Sparkles size={13} className="text-teal-400" /> Live Queue
              Technology
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              Hello, {displayName}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Book consultations, medical checkups, auto care, or styling
              sessions with live queue tracking.
            </p>

            {/* High-Contrast Search Bar */}
            <div className="pt-2">
              <div className="flex items-center bg-white rounded-2xl p-1.5 shadow-2xl max-w-xl border border-slate-100">
                <div className="flex items-center gap-3 flex-1 px-3">
                  <Search size={18} className="text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search clinics, mechanics, specialists, salons…"
                    className="w-full text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none bg-transparent"
                  />
                </div>
                <Link
                  to={`/customer/explore?q=${encodeURIComponent(searchQuery)}`}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition inline-flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchHomeData()}
              className="underline font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* ================= CATEGORIES WITH CLEAN SVG ICONS (NO EMOJIS) ================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">
                Service Sectors
              </h2>
              <p className="text-xs text-slate-500">
                Explore multi-industry services supported on QueueLess
              </p>
            </div>
            <Link
              to="/customer/explore"
              className="text-xs text-teal-600 hover:text-teal-700 font-bold inline-flex items-center gap-1"
            >
              All Categories <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.id}
                  to={`/customer/explore?category=${cat.id}`}
                  className="card p-4 flex flex-col items-center justify-center text-center gap-2.5 hover:border-teal-300 hover:shadow-md transition group bg-white border border-slate-200"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center transition group-hover:scale-110 border ${cat.color}`}
                  >
                    <Icon size={20} />
                  </div>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-teal-600 transition truncate w-full">
                    {cat.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ================= 2-COLUMN DESKTOP SPLIT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: Real Upcoming Booking & Featured Organizations */}
          <div className="lg:col-span-2 space-y-8">
            {/* UPCOMING APPOINTMENT CARD */}
            {upcoming ? (
              <div className="card p-6 border border-slate-200 bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Calendar size={14} className="text-teal-600" /> Confirmed
                    Reservation
                  </span>
                  <Link
                    to="/customer/appointments"
                    className="text-xs text-teal-600 hover:text-teal-700 font-bold inline-flex items-center gap-1"
                  >
                    View all ({appointments.length}) <ArrowRight size={12} />
                  </Link>
                </div>

                <Link
                  to={`/customer/appointments/${upcoming.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-teal-50/30 border border-teal-100 hover:border-teal-300 transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex flex-col items-center justify-center font-bold shadow-xs shrink-0">
                      <Calendar size={22} />
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-teal-600 transition">
                        {upcoming.service}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {upcoming.org} · With {upcoming.worker}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-600">
                        <Clock size={13} className="text-teal-600" />
                        <span>
                          {upcoming.date} at {upcoming.time} (
                          {upcoming.duration} mins)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-bold text-teal-700 bg-white px-3 py-1.5 rounded-xl border border-teal-200 shadow-xs inline-flex items-center gap-1">
                      Details <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              </div>
            ) : (
              <div className="card p-6 border border-slate-200 bg-white shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Calendar size={22} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      No upcoming appointments
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Need a checkup, service session, or styling? Book a slot
                      near you.
                    </p>
                  </div>
                </div>

                <Link
                  to="/customer/explore"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition shrink-0"
                >
                  Book Service
                </Link>
              </div>
            )}

            {/* REAL REGISTERED VENUES GRID */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">
                    Verified Service Venues
                  </h2>
                  <p className="text-xs text-slate-500">
                    Organizations registered on QueueLess with live queue
                    capabilities
                  </p>
                </div>
                <Link
                  to="/customer/explore"
                  className="text-xs text-teal-600 hover:text-teal-700 font-bold inline-flex items-center gap-1"
                >
                  See all ({organizations.length}) <ArrowRight size={13} />
                </Link>
              </div>

              {loading ? (
                <div className="p-12 text-center text-xs text-slate-400 animate-pulse">
                  Querying registered businesses from database…
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {featured.map((org) => (
                    <Link
                      key={org.id}
                      to={`/customer/org/${org.id}`}
                      className="card overflow-hidden border border-slate-200 bg-white hover:shadow-lg hover:border-teal-300 transition duration-200 group flex flex-col justify-between"
                    >
                      <div className="relative h-44 bg-slate-100 overflow-hidden">
                        {org.image ? (
                          <img
                            src={org.image}
                            alt={org.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-bold">
                            No Photo Available
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Top Rating Badge */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-xs">
                          <Star
                            size={12}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span>{org.rating.toFixed(1)}</span>
                          {org.reviews > 0 && (
                            <span className="text-slate-400 font-normal">
                              ({org.reviews})
                            </span>
                          )}
                        </div>

                        {/* Title overlay */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="font-extrabold text-base truncate">
                            {org.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="flex items-center gap-1 truncate text-slate-700 font-medium">
                            <MapPin
                              size={13}
                              className="text-teal-600 shrink-0"
                            />
                            <span className="truncate">{org.location}</span>
                          </span>
                          <span className="font-semibold text-slate-400">
                            {org.distance}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                            ● Open Now
                          </span>
                          <span className="text-xs font-bold text-teal-600 group-hover:text-teal-700 inline-flex items-center gap-1">
                            Book Slot <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}

                  {featured.length === 0 && (
                    <div className="col-span-full card p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200">
                      No organizations registered in database yet.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Real Queue Ticket & Search Tags */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* REAL LIVE QUEUE STATUS CARD */}
            <div className="card p-6 border border-slate-200 shadow-sm bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Zap size={15} className="text-teal-600" /> Virtual Queue
                  Status
                </span>
                <span
                  className={`w-2.5 h-2.5 rounded-full ${activeQueueTicket ? "bg-emerald-500 animate-pulse" : "bg-slate-300"}`}
                />
              </div>

              {activeQueueTicket ? (
                <div className="text-center py-4 bg-teal-50/40 rounded-2xl mb-4 border border-teal-100">
                  <p className="text-[11px] font-semibold text-teal-800 uppercase tracking-wider">
                    Active Ticket
                  </p>
                  <div className="text-4xl font-black text-slate-900 my-1">
                    #{String(activeQueueTicket.id).slice(0, 4)}
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    Status:{" "}
                    <strong className="uppercase text-teal-700">
                      {activeQueueTicket.status}
                    </strong>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    {activeQueueTicket.org}
                  </p>
                </div>
              ) : (
                <div className="text-center py-4 bg-slate-50 rounded-2xl mb-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-800">
                    You are not in any queue
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 max-w-[200px] mx-auto">
                    Take a ticket remotely to avoid sitting in physical waiting
                    rooms.
                  </p>
                </div>
              )}

              <Link
                to={activeQueueTicket ? "/customer/queue" : "/customer/explore"}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white inline-flex items-center justify-center gap-1.5 shadow-sm transition"
              >
                {activeQueueTicket
                  ? "Open Live Ticket"
                  : "Find a Queue to Join"}{" "}
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* POPULAR SEARCH PILLS */}
            <div className="card p-6 border border-slate-200 bg-white shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <TrendingUp size={16} className="text-teal-600" />
                <span>Trending Services</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Medical Checkup",
                  "Knotless Braids",
                  "Vehicle Diagnostics",
                  "Deep Tissue Spa",
                  "Dental Cleaning",
                  "Executive Grooming",
                ].map((s) => (
                  <Link
                    key={s}
                    to={`/customer/explore?q=${encodeURIComponent(s)}`}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 text-xs font-bold text-slate-700 hover:text-teal-700 transition"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>

            {/* TRUST BANNER */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-teal-50/60 to-transparent border border-teal-100 flex items-center gap-3">
              <ShieldCheck size={26} className="text-teal-600 shrink-0" />
              <div className="text-xs text-slate-600">
                <strong className="text-slate-900 block font-bold">
                  Verified Businesses Only
                </strong>
                All service venues undergo license & hygiene verification.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
