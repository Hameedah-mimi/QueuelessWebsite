import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  Search,
  Star,
  MapPin,
  X,
  Clock,
  ArrowRight,
  SlidersHorizontal,
  RefreshCw,
  AlertCircle,
  Navigation,
  Stethoscope,
  Wrench,
  Scissors,
  Sparkles,
  Building2,
  ShieldCheck,
  Layers,
} from "lucide-react";

// Professional Multi-Industry Categories with SVG Icons (Zero Emojis)
const CATEGORIES = [
  { id: "all", label: "All Services", icon: Layers },
  { id: "clinic", label: "Medical & Clinics", icon: Stethoscope },
  { id: "auto", label: "Auto & Repairs", icon: Wrench },
  { id: "salon", label: "Salons & Grooming", icon: Scissors },
  { id: "spa", label: "Spas & Wellness", icon: Sparkles },
  { id: "consulting", label: "Legal & Consulting", icon: Building2 },
];

// Haversine formula to compute accurate distance in kilometers
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

export default function Explore() {
  const [params] = useSearchParams();
  const initialCategory = params.get("category") || "all";
  const initialQuery = params.get("q") || "";

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Geolocation state
  const [userCoords, setUserCoords] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locationDenied, setLocationDenied] = useState(false);

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [openOnly, setOpenOnly] = useState(false);
  const [sortByNearest, setSortByNearest] = useState(true);

  // 1. Fetch Organizations from Django
  const fetchOrganizations = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);
    setError(null);

    try {
      const res = await api.get("/api/v1/organizations/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];

      const parsed = raw.map((org) => ({
        id: org.id,
        name: org.name || "Service Venue",
        category: org.category || "Professional Service",
        location: org.location || org.address || "Victoria Island, Lagos",
        latitude: parseFloat(org.latitude || 6.4281), // Default Lagos coords if not set
        longitude: parseFloat(org.longitude || 3.4219),
        rating: parseFloat(org.rating || org.average_rating || 5.0),
        reviews: parseInt(org.reviews || org.review_count || 0, 10),
        image: org.image || org.avatar_url || null,
        open: org.open !== undefined ? org.open : true,
        closes: org.closes || "8:00 PM",
      }));

      setOrganizations(parsed);
    } catch (err) {
      console.error("Failed to load organizations:", err);
      setError("Could not retrieve service venues from server.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  // 2. Request User Browser Geolocation
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);
    setLocationDenied(false);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocating(false);
        setSortByNearest(true);
      },
      (err) => {
        console.warn("Geolocation denied or timed out:", err);
        setLocating(false);
        setLocationDenied(true);
      },
      { timeout: 10000, enableHighAccuracy: true },
    );
  };

  // Trigger location on mount
  useEffect(() => {
    requestUserLocation();
  }, []);

  // 3. Filter & Sort by Nearest Distance
  const results = useMemo(() => {
    let list = organizations.map((o) => {
      let distanceKm = null;
      if (userCoords) {
        distanceKm = calculateDistanceKm(
          userCoords.latitude,
          userCoords.longitude,
          o.latitude,
          o.longitude,
        );
      }
      return {
        ...o,
        distanceKm,
        distanceText:
          distanceKm !== null ? `${distanceKm} km away` : "Near you",
      };
    });

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.category.toLowerCase().includes(q) ||
          o.location.toLowerCase().includes(q),
      );
    }

    if (selectedCategory !== "all") {
      list = list.filter((o) =>
        o.category.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    }

    if (openOnly) {
      list = list.filter((o) => o.open);
    }

    // Sort by physical proximity if location is active
    if (sortByNearest && userCoords) {
      list.sort((a, b) => (a.distanceKm ?? 999) - (b.distanceKm ?? 999));
    }

    return list;
  }, [
    organizations,
    query,
    selectedCategory,
    openOnly,
    userCoords,
    sortByNearest,
  ]);

  return (
    <div className="min-h-screen bg-slate-50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        {/* ================= HEADER & LOCATION STATUS ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Explore Services Near You
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Find clinics, auto mechanics, salons, and consultancies with live
              queue tracking.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Geolocation Button */}
            <button
              onClick={requestUserLocation}
              disabled={locating}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition inline-flex items-center gap-1.5 border ${
                userCoords
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Navigation
                size={13}
                className={
                  locating ? "animate-spin text-teal-600" : "text-teal-600"
                }
              />
              <span>
                {userCoords
                  ? "Location Active"
                  : locating
                    ? "Locating…"
                    : "Detect My Location"}
              </span>
            </button>

            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">
              {loading ? "…" : `${results.length} venues found`}
            </span>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchOrganizations()}
              className="underline font-bold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="w-full pl-11 pr-10 py-3 text-sm bg-white border border-slate-200 rounded-2xl shadow-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
            placeholder="Search by service name, specialty, or area (e.g. Lekki, VI, Ikeja)…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Professional Category Chips (Zero Emojis) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isSelected
                    ? "bg-teal-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-slate-50"
                }`}
              >
                <Icon
                  size={14}
                  className={isSelected ? "text-white" : "text-slate-500"}
                />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
            Finding verified businesses and computing proximity…
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((org) => (
              <Link
                key={org.id}
                to={`/customer/org/${org.id}`}
                className="card border border-slate-200 bg-white overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-teal-300 transition duration-200 group"
              >
                {/* Photo Thumbnail */}
                <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                  {org.image ? (
                    <img
                      src={org.image}
                      alt={org.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-bold">
                      No Photo Available
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Open Status Badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
                        org.open
                          ? "bg-emerald-500/90 text-white"
                          : "bg-black/70 text-white/80"
                      }`}
                    >
                      {org.open ? `Open · Closes ${org.closes}` : "Closed"}
                    </span>
                  </div>

                  {/* Proximity / Distance Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-xs">
                    <Navigation size={11} className="text-teal-600" />
                    <span>{org.distanceText}</span>
                  </div>

                  {/* Bottom Header on Image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded text-white/90">
                      {org.category}
                    </span>
                    <h3 className="text-base font-extrabold truncate mt-1">
                      {org.name}
                    </h3>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5 text-xs text-slate-500">
                    <p className="flex items-center gap-1.5 truncate text-slate-700 font-medium">
                      <MapPin size={13} className="text-teal-600 shrink-0" />
                      <span className="truncate">{org.location}</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-slate-400">
                      <Star
                        size={13}
                        className="text-amber-400 fill-amber-400 shrink-0"
                      />
                      <span className="font-bold text-slate-700">
                        {org.rating.toFixed(1)}
                      </span>
                      <span>({org.reviews || 0} reviews)</span>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Virtual Queue Active
                    </span>
                    <span className="text-xs font-bold text-teal-600 group-hover:text-teal-700 inline-flex items-center gap-1">
                      View & Book <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center border border-dashed border-slate-200 bg-white/70">
            <h3 className="text-base font-bold text-slate-900">
              No businesses found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any service venues matching your filter. Try
              clearing filters or searching another keyword.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
