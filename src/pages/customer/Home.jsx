import { Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import { useAuth } from "../../context/AuthContext";
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
} from "lucide-react";
import { CATEGORIES, ORGANIZATIONS, APPOINTMENTS } from "../../data/mock";

export default function CustomerHome() {
  const { user } = useAuth();
  const upcoming = APPOINTMENTS[0];
  const featured = ORGANIZATIONS.slice(0, 4);

  // Clean name fallback for customer
  const displayName =
    user?.first_name ||
    user?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "there";

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* ================= HERO SEARCH & GREETING BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-ink-950 via-ink-900 to-brand-950 text-white p-6 sm:p-10 shadow-lg">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider mb-4 border border-brand-500/30">
              <Sparkles size={13} /> Skip The Wait
            </span>

            <h1 className="text-black sm:text-4xl font-black tracking-tight mb-2">
              Hello, {displayName}!
            </h1>
            <p className="text-ink-600  text-sm sm:text-base leading-relaxed mb-6">
              Book your next salon, barber or spa session with live queue
              tracking.
            </p>

            {/* Interactive Search Bar */}
            <Link
              to="/customer/explore"
              className="flex items-center justify-between gap-3 bg-white text-ink-900 rounded-2xl px-5 py-3.5 shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all max-w-xl group"
            >
              <div className="flex items-center gap-3">
                <Search
                  size={20}
                  className="text-brand-600 group-hover:scale-110 transition-transform"
                />
                <span className="text-sm text-ink-400 font-medium">
                  Search salons, barbers, braids, facials…
                </span>
              </div>
              <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl hidden sm:inline-block">
                Search
              </span>
            </Link>
          </div>

          {/* Decorative glowing gradient */}
          <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-brand-500/15 blur-3xl pointer-events-none" />
        </div>

        {/* ================= CATEGORY CAROUSEL ================= */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-ink-900">
              Explore by Category
            </h2>
            <Link
              to="/customer/explore"
              className="text-xs text-brand-600 font-bold hover:underline inline-flex items-center gap-1"
            >
              All Categories <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                to={`/customer/explore?category=${c.id}`}
                className="card p-3.5 flex flex-col items-center justify-center text-center gap-2 hover:border-brand-300 hover:shadow-md transition-all group bg-white border border-ink-100"
              >
                <div className="w-14 h-14 rounded-2xl bg-ink-50 group-hover:bg-brand-50 flex items-center justify-center text-2xl transition shadow-xs group-hover:scale-110">
                  {c.emoji}
                </div>
                <span className="text-xs font-bold text-ink-800 group-hover:text-brand-600 transition truncate w-full">
                  {c.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* ================= 2-COLUMN DESKTOP SPLIT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: Upcoming Booking + Featured Organizations */}
          <div className="lg:col-span-2 space-y-8">
            {/* UPCOMING APPOINTMENT HIGHLIGHT CARD */}
            {upcoming && (
              <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-ink-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink-400 flex items-center gap-1.5">
                    <Calendar size={14} className="text-brand-600" /> Confirmed
                    Reservation
                  </span>
                  <Link
                    to="/customer/appointments"
                    className="text-xs text-brand-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    View all bookings <ArrowRight size={12} />
                  </Link>
                </div>

                <Link
                  to={`/customer/appointments/${upcoming.id}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-brand-50/40 border border-brand-100 hover:border-brand-300 transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white flex flex-col items-center justify-center font-bold shadow-xs shrink-0">
                      <span className="text-[10px] uppercase opacity-80">
                        Apr
                      </span>
                      <span className="text-lg leading-tight">16</span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-ink-900 text-base group-hover:text-brand-600 transition">
                        {upcoming.service}
                      </h3>
                      <p className="text-xs text-ink-500 font-medium">
                        {upcoming.org} · With {upcoming.worker}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-ink-600">
                        <Clock size={13} className="text-brand-600" />
                        <span>
                          {upcoming.time} ({upcoming.duration} mins)
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="text-xs font-bold text-brand-700 bg-white px-3 py-1.5 rounded-xl border border-brand-200 shadow-xs inline-flex items-center gap-1">
                      Details <ChevronRight size={14} />
                    </span>
                  </div>
                </Link>
              </div>
            )}

            {/* FEATURED BUSINESSES GRID */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-black text-ink-900">
                    Featured Businesses
                  </h2>
                  <p className="text-xs text-ink-400">
                    Top salons & spas with active live queues
                  </p>
                </div>
                <Link
                  to="/customer/explore"
                  className="text-xs text-brand-600 font-bold hover:underline inline-flex items-center gap-1"
                >
                  See all <ArrowRight size={13} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {featured.map((org) => {
                  const cover =
                    org.image ||
                    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80";

                  return (
                    <Link
                      key={org.id}
                      to={`/customer/org/${org.id}`}
                      className="card overflow-hidden border border-ink-100 bg-white hover:shadow-lg hover:border-brand-200 transition-all duration-200 group flex flex-col justify-between"
                    >
                      <div className="relative h-44 bg-ink-200 overflow-hidden">
                        <img
                          src={cover}
                          alt={org.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Top Rating Badge */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-ink-900 flex items-center gap-1 shadow-xs">
                          <Star
                            size={12}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span>{org.rating || "4.9"}</span>
                          <span className="text-ink-400 font-normal">
                            ({org.reviews || "80"})
                          </span>
                        </div>

                        {/* Title overlay */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h3 className="font-extrabold text-base truncate drop-shadow-sm">
                            {org.name}
                          </h3>
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs text-ink-500">
                          <span className="flex items-center gap-1 truncate text-ink-600 font-medium">
                            <MapPin
                              size={13}
                              className="text-brand-600 shrink-0"
                            />
                            <span className="truncate">
                              {org.location || "Victoria Island"}
                            </span>
                          </span>
                          <span className="font-semibold text-ink-400">
                            {org.distance || "1.2 km"}
                          </span>
                        </div>

                        <div className="pt-3 border-t border-ink-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            ● Open Now
                          </span>
                          <span className="text-xs font-bold text-brand-600 group-hover:text-brand-700 inline-flex items-center gap-1">
                            Book Slot <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Live Queue Ticket & Quick Search Tags */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* LIVE QUEUE STATUS PREVIEW */}
            <div className="card p-6 border border-ink-100 shadow-sm bg-white">
              <div className="flex items-center justify-between pb-3 border-b border-ink-100 mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-ink-900 flex items-center gap-1.5">
                  <Zap size={15} className="text-brand-600" /> Live Queue Status
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="text-center py-4 bg-ink-50 rounded-2xl mb-4 border border-ink-100">
                <p className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">
                  Current Wait Estimate
                </p>
                <div className="text-4xl font-black text-ink-900 my-1">
                  15 mins
                </div>
                <p className="text-xs text-ink-600 font-medium">
                  Average line velocity: <strong>Fast</strong>
                </p>
              </div>

              <Link
                to="/customer/queue"
                className="btn-primary w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                Join or Track Queue <ArrowRight size={14} />
              </Link>
            </div>

            {/* POPULAR SEARCH PILLS */}
            <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-ink-900 font-bold text-sm">
                <TrendingUp size={16} className="text-brand-600" />
                <span>Trending Services</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  "Knotless Braids",
                  "Fade & Beard Trim",
                  "Deep Tissue Massage",
                  "Gel Manicure",
                  "Hydra Facial",
                  "Teeth Whitening",
                ].map((s) => (
                  <Link
                    key={s}
                    to={`/customer/explore?q=${s}`}
                    className="px-3 py-1.5 rounded-xl bg-ink-50 hover:bg-brand-50 border border-ink-100 hover:border-brand-300 text-xs font-bold text-ink-700 hover:text-brand-600 transition"
                  >
                    {s}
                  </Link>
                ))}
              </div>
            </div>

            {/* TRUST BANNER */}
            <div className="rounded-2xl p-4 bg-gradient-to-br from-brand-50/60 to-transparent border border-brand-100 flex items-center gap-3">
              <ShieldCheck size={28} className="text-brand-600 shrink-0" />
              <div className="text-xs text-ink-600">
                <strong className="text-ink-900 block font-bold">
                  Verified Businesses Only
                </strong>
                All listed salons undergo strict service & hygiene verification.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
