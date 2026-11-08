import { useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import {
  Search,
  Star,
  MapPin,
  Filter,
  X,
  Clock,
  Sparkles,
  ArrowRight,
  SlidersHorizontal,
  Check,
} from "lucide-react";
import { ORGANIZATIONS } from "../../data/mock";

const CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "hair", label: "Hair Salons" },
  { id: "barber", label: "Barbershops" },
  { id: "spa", label: "Spas & Massage" },
  { id: "nails", label: "Nail Bars" },
  { id: "clinic", label: "Skin & Clinics" },
];

export default function Explore() {
  const [params] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openOnly, setOpenOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);

  const results = useMemo(() => {
    let list = [...ORGANIZATIONS];

    // Text search query
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          (o.category && o.category.toLowerCase().includes(q)) ||
          (o.location && o.location.toLowerCase().includes(q)),
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      list = list.filter((o) =>
        o.category?.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    }

    // Open only toggle
    if (openOnly) {
      list = list.filter((o) => o.open);
    }

    // Rating filter
    if (minRating > 0) {
      list = list.filter((o) => (o.rating || 0) >= minRating);
    }

    return list;
  }, [query, selectedCategory, openOnly, minRating]);

  const clearAllFilters = () => {
    setQuery("");
    setSelectedCategory("all");
    setOpenOnly(false);
    setMinRating(0);
  };

  const hasActiveFilters =
    query || selectedCategory !== "all" || openOnly || minRating > 0;

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        {/* ================= HEADER & SEARCH BANNER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
              Explore Businesses
            </h1>
            <p className="text-sm text-ink-500 mt-1">
              Find top-rated salons, barbers & wellness spots with live queue
              tracking.
            </p>
          </div>

          <div className="text-xs text-ink-400 font-semibold uppercase tracking-wider">
            {results.length} {results.length === 1 ? "place" : "places"}{" "}
            available
          </div>
        </div>

        {/* Search Bar + Quick Category Pills */}
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
              />
              <input
                className="input pl-11 py-3 text-sm w-full bg-white border-ink-200 shadow-xs"
                placeholder="Search salons, barbers, or location (e.g. Lekki, VI)…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-brand-500 text-white shadow-xs"
                    : "bg-white border border-ink-100 text-ink-600 hover:border-brand-200 hover:text-ink-900"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* ================= 2-COLUMN MAIN LAYOUT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* LEFT COLUMN: Sticky Filters Sidebar */}
          <div className="card p-5 border border-ink-100 bg-white shadow-xs space-y-6 lg:sticky lg:top-8">
            <div className="flex items-center justify-between pb-3 border-b border-ink-100">
              <span className="text-sm font-bold text-ink-900 flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-brand-600" />{" "}
                Filters
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-brand-600 hover:text-brand-700 font-semibold"
                >
                  Reset all
                </button>
              )}
            </div>

            {/* Open Now Toggle */}
            <div>
              <label className="flex items-center justify-between text-xs font-bold text-ink-800 cursor-pointer">
                <span>Open Right Now</span>
                <input
                  type="checkbox"
                  checked={openOnly}
                  onChange={(e) => setOpenOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-ink-300 text-brand-500 focus:ring-brand-500 cursor-pointer"
                />
              </label>
              <p className="text-[11px] text-ink-400 mt-1">
                Only show spots currently serving customers.
              </p>
            </div>

            {/* Minimum Rating */}
            <div className="border-t border-ink-100 pt-4">
              <label className="block text-xs font-bold text-ink-800 mb-2">
                Customer Rating
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[0, 4.0, 4.5].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setMinRating(rate)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 border ${
                      minRating === rate
                        ? "bg-brand-50 border-brand-500 text-brand-700"
                        : "border-ink-200 text-ink-600 hover:border-ink-300"
                    }`}
                  >
                    <Star
                      size={12}
                      className={
                        rate > 0
                          ? "text-amber-400 fill-amber-400"
                          : "text-ink-400"
                      }
                    />
                    {rate === 0 ? "Any" : `${rate}+`}
                  </button>
                ))}
              </div>
            </div>

            {/* Virtual Queue Feature Highlight */}
            <div className="rounded-xl p-3.5 bg-brand-50/60 border border-brand-100 text-xs text-ink-700 space-y-1">
              <p className="font-bold text-brand-800 flex items-center gap-1.5">
                <Sparkles size={14} className="text-brand-600" /> Live Queue
                Guarantee
              </p>
              <p className="text-[11px] text-ink-500 leading-relaxed">
                All listed salons allow you to take a ticket remotely and arrive
                when it’s your turn.
              </p>
            </div>
          </div>

          {/* RIGHT 3 COLUMNS: Results Grid */}
          <div className="lg:col-span-3">
            {results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {results.map((org) => {
                  const cover =
                    org.image ||
                    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80";

                  return (
                    <Link
                      key={org.id}
                      to={`/customer/org/${org.id}`}
                      className="card border border-ink-100 bg-white overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-brand-200 transition-all duration-200 group"
                    >
                      {/* Thumbnail Container */}
                      <div className="relative h-44 w-full bg-ink-200 overflow-hidden">
                        <img
                          src={cover}
                          alt={org.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Open/Closed Badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
                              org.open
                                ? "bg-emerald-500/90 text-white"
                                : "bg-black/70 text-white/80"
                            }`}
                          >
                            {org.open
                              ? `● Open · Closes ${org.closes || "8 PM"}`
                              : "Closed"}
                          </span>
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-ink-900 flex items-center gap-1 shadow-xs">
                          <Star
                            size={12}
                            className="text-amber-400 fill-amber-400"
                          />
                          <span>{org.rating || "4.8"}</span>
                          <span className="text-ink-400 font-normal">
                            ({org.reviews || "45"})
                          </span>
                        </div>

                        {/* Bottom Venue Name on Image */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-white/90">
                            {org.category || "Beauty & Wellness"}
                          </span>
                          <h3 className="text-base font-extrabold truncate drop-shadow-sm mt-1">
                            {org.name}
                          </h3>
                        </div>
                      </div>

                      {/* Card Content Details */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div className="space-y-1.5 text-xs text-ink-500">
                          <p className="flex items-center gap-1.5 truncate text-ink-700 font-medium">
                            <MapPin
                              size={13}
                              className="text-brand-600 shrink-0"
                            />
                            <span className="truncate">
                              {org.location || "Victoria Island, Lagos"}
                            </span>
                          </p>
                          <p className="flex items-center gap-1.5 text-ink-400">
                            <Clock size={13} className="shrink-0" />
                            <span>{org.distance || "1.2 km away"}</span>
                          </p>
                        </div>

                        <div className="pt-3 border-t border-ink-100 flex items-center justify-between">
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            Live Queue Enabled
                          </span>
                          <span className="text-xs font-bold text-brand-600 group-hover:text-brand-700 inline-flex items-center gap-1">
                            View & Book <ArrowRight size={13} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="card p-12 text-center border border-dashed border-ink-200 bg-white/70">
                <div className="w-16 h-16 rounded-3xl bg-brand-50 text-brand-500 mx-auto flex items-center justify-center mb-4">
                  <Search size={30} />
                </div>
                <h3 className="text-lg font-bold text-ink-900 mb-1">
                  No businesses matched your search
                </h3>
                <p className="text-sm text-ink-500 max-w-sm mx-auto mb-6">
                  We couldn't find any results matching your filters. Try
                  clearing filters or searching another keyword.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <X size={16} /> Reset All Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
