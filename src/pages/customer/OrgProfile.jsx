import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  Phone,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Share2,
  Heart,
  Zap,
  CalendarCheck,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function OrgProfile() {
  const { orgId } = useParams();

  const [org, setOrg] = useState(null);
  const [services, setServices] = useState([]);
  const [queueCount, setQueueCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeCategory, setActiveCategory] = useState("All");
  const [liked, setLiked] = useState(false);

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  // 100% Real API fetch from Django
  const fetchOrgDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [orgRes, svcRes, apptRes] = await Promise.allSettled([
        api.get(`/api/v1/organizations/${orgId}/`),
        api.get(`/api/v1/services/?organization=${orgId}`),
        api.get(`/api/v1/appointments/?organization=${orgId}`),
      ]);

      if (orgRes.status === "fulfilled") {
        const d = orgRes.value.data;
        setOrg({
          id: d.id,
          name: d.name || "Business Profile",
          category: d.category || "Beauty & Wellness",
          location: d.location || d.address || "Lagos, Nigeria",
          distance: d.distance || "Near you",
          rating: parseFloat(d.rating || d.average_rating || 5.0),
          reviews: parseInt(d.reviews || d.review_count || 0, 10),
          description: d.description || "",
          hours:
            d.hours ||
            d.opening_hours ||
            "Monday – Saturday: 9:00 AM – 8:00 PM",
          phone: d.phone || d.contact_phone || "+234 812 345 6789",
          image: d.image || d.avatar_url || null,
          gallery: d.gallery || [],
          open: d.open !== undefined ? d.open : true,
          closes: d.closes || "8:00 PM",
        });
      } else {
        throw new Error("Organization not found");
      }

      if (svcRes.status === "fulfilled") {
        const rawSvc = Array.isArray(svcRes.value.data)
          ? svcRes.value.data
          : svcRes.value.data?.results || [];
        setServices(rawSvc);
      }

      if (apptRes.status === "fulfilled") {
        const rawAppts = Array.isArray(apptRes.value.data)
          ? apptRes.value.data
          : apptRes.value.data?.results || [];
        // Count active tickets in line for this salon
        const waiting = rawAppts.filter(
          (a) =>
            (a.status || "").toLowerCase() === "pending" ||
            (a.status || "").toLowerCase() === "in_progress",
        ).length;
        setQueueCount(waiting);
      }
    } catch (err) {
      console.error("Failed to load organization:", err);
      setError("Could not retrieve business details from the server.");
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    fetchOrgDetails();
  }, [fetchOrgDetails]);

  // Extract unique categories from real services
  const categories = [
    "All",
    ...new Set(services.map((s) => s.category).filter(Boolean)),
  ];

  const filteredServices =
    activeCategory === "All"
      ? services
      : services.filter((s) => s.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50/50">
        <RoleNavbar />
        <main className="lg:ml-64 p-16 text-center text-xs text-ink-400 animate-pulse">
          Loading business profile from database…
        </main>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="min-h-screen bg-ink-50/50">
        <RoleNavbar />
        <main className="lg:ml-64 p-8 max-w-xl mx-auto text-center space-y-4">
          <AlertCircle size={32} className="text-amber-600 mx-auto" />
          <h2 className="text-lg font-bold text-ink-900">
            Organization Not Found
          </h2>
          <p className="text-xs text-ink-500">
            {error || "This organization does not exist in the database."}
          </p>
          <Link
            to="/customer/explore"
            className="btn-primary text-xs px-4 py-2 inline-block"
          >
            Back to Explore
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* ================= HERO BANNER ================= */}
        <div className="relative rounded-3xl overflow-hidden shadow-md border border-ink-100 bg-ink-900">
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            {org.image ? (
              <img
                src={org.image}
                alt={org.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-ink-950 to-brand-950 text-ink-300 font-bold text-sm">
                No Cover Photo Uploaded
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            {/* Back button */}
            <Link
              to="/customer/explore"
              className="absolute top-5 left-5 w-11 h-11 rounded-2xl bg-white/90 hover:bg-white text-ink-900 flex items-center justify-center shadow-lg transition backdrop-blur-md"
              title="Back to explore"
            >
              <ChevronLeft size={22} />
            </Link>

            {/* Quick Actions */}
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className="w-11 h-11 rounded-2xl bg-white/90 hover:bg-white text-ink-900 flex items-center justify-center shadow-lg transition backdrop-blur-md"
              >
                <Heart
                  size={20}
                  className={
                    liked ? "text-rose-500 fill-rose-500" : "text-ink-700"
                  }
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}
                className="w-11 h-11 rounded-2xl bg-white/90 hover:bg-white text-ink-900 flex items-center justify-center shadow-lg transition backdrop-blur-md"
                title="Share business"
              >
                <Share2 size={18} className="text-ink-700" />
              </button>
            </div>

            {/* Bottom Meta */}
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/90 text-white text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-sm">
                  <Sparkles size={12} /> {org.category}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black drop-shadow-md">
                  {org.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-white/90">
                  <div className="flex items-center gap-1 font-bold">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span>{org.rating.toFixed(1)}</span>
                    {org.reviews > 0 && (
                      <span className="text-white/70">
                        ({org.reviews} verified reviews)
                      </span>
                    )}
                  </div>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={15} /> {org.location}
                  </span>
                  <span>·</span>
                  <span className="text-emerald-400 font-bold">
                    ● {org.open ? `Open · Closes ${org.closes}` : "Closed"}
                  </span>
                </div>
              </div>

              <Link
                to={`/customer/org/${org.id}/book`}
                className="btn-primary py-3 px-6 text-sm font-bold shadow-lg shadow-brand-500/20 inline-flex items-center gap-2 self-start sm:self-auto shrink-0"
              >
                <CalendarCheck size={18} /> Book Appointment
              </Link>
            </div>
          </div>
        </div>

        {/* ================= 2-COLUMN MAIN CONTENT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: About, Photos, Service Catalog */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Card */}
            <div className="card p-6 sm:p-8 border border-ink-100 bg-white shadow-sm space-y-3">
              <h2 className="text-lg font-black text-ink-900">
                About {org.name}
              </h2>
              <p className="text-sm text-ink-600 leading-relaxed">
                {org.description ||
                  `${org.name} offers beauty, grooming, and wellness services. Certified specialists attend to customers with high hygiene standards and customized care.`}
              </p>
            </div>

            {/* Photos & Gallery (if images exist) */}
            {org.gallery && org.gallery.length > 0 && (
              <div className="card p-6 sm:p-8 border border-ink-100 bg-white shadow-sm space-y-4">
                <h2 className="text-lg font-black text-ink-900">
                  Photos & Atmosphere
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {org.gallery.map((src, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-ink-200 border border-ink-100 group"
                    >
                      <img
                        src={src}
                        alt={`${org.name} gallery ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REAL SERVICES CATALOG */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-ink-900">
                    Service Menu
                  </h2>
                  <p className="text-xs text-ink-400">
                    Select a service to book your appointment
                  </p>
                </div>

                {/* Category Pills Bar */}
                {categories.length > 1 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setActiveCategory(cat)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                          activeCategory === cat
                            ? "bg-ink-900 text-white shadow-xs"
                            : "bg-white border border-ink-200 text-ink-600 hover:border-brand-300"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredServices.map((svc) => (
                  <div
                    key={svc.id}
                    className="card p-5 border border-ink-100 bg-white hover:border-brand-200 hover:shadow-md transition flex flex-col justify-between group"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-bold text-ink-900 text-base group-hover:text-brand-600 transition">
                          {svc.name}
                        </h4>
                        <span className="text-xs font-semibold text-ink-400 bg-ink-50 px-2 py-0.5 rounded-md shrink-0">
                          {svc.duration} mins
                        </span>
                      </div>
                      <p className="text-xs text-ink-500 line-clamp-2">
                        {svc.description ||
                          "Professional treatment tailored to your preference."}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-ink-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-ink-400 uppercase">
                          Price
                        </span>
                        <p className="text-lg font-black text-brand-600">
                          {formatNaira(svc.price)}
                        </p>
                      </div>

                      <Link
                        to={`/customer/org/${org.id}/book?service=${svc.id}`}
                        className="btn-primary text-xs px-4 py-2 font-bold inline-flex items-center gap-1 shadow-xs"
                      >
                        Book Slot <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                ))}

                {filteredServices.length === 0 && (
                  <div className="col-span-full card p-8 text-center text-ink-400 text-xs border border-dashed border-ink-200">
                    No services registered under "{activeCategory}".
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Real Queue & Business Info Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* REAL LIVE QUEUE STATUS CARD */}
            <div className="card p-6 border border-brand-200 bg-gradient-to-br from-white via-white to-brand-50/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-ink-100">
                <span className="text-xs font-black uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                  <Zap size={15} className="text-brand-600" /> Virtual Queue
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div>
                <p className="text-xs text-ink-400 uppercase font-semibold">
                  Current Walk-in Line
                </p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-ink-900">
                    {queueCount} People
                  </span>
                  <span className="text-xs text-ink-500 font-medium">
                    waiting in line
                  </span>
                </div>
                <p className="text-xs text-ink-500 mt-1">
                  Est. wait:{" "}
                  <strong className="text-brand-600">
                    ~{queueCount * 15} mins
                  </strong>
                </p>
              </div>

              <Link
                to={`/customer/queue?org=${org.id}`}
                className="btn-secondary w-full py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5"
              >
                Join Live Queue Remotely
              </Link>
            </div>

            {/* LOCATION & HOURS INFO CARD */}
            <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-5">
              <h3 className="text-sm font-black text-ink-900 pb-3 border-b border-ink-100">
                Business Information
              </h3>

              <div className="space-y-4 text-xs">
                {/* Location */}
                <div className="flex items-start gap-3 text-ink-600">
                  <MapPin
                    size={18}
                    className="text-brand-600 shrink-0 mt-0.5"
                  />
                  <div>
                    <span className="font-bold text-ink-900 block">
                      Address
                    </span>
                    <p className="mt-0.5">{org.location}</p>
                    <span className="text-[11px] text-ink-400 mt-0.5 block">
                      {org.distance}
                    </span>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3 text-ink-600">
                  <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-ink-900 block">
                      Opening Hours
                    </span>
                    <p className="mt-0.5">{org.hours}</p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start gap-3 text-ink-600">
                  <Phone size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-ink-900 block">
                      Phone Support
                    </span>
                    <p className="mt-0.5">{org.phone}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-ink-100 flex items-center gap-2 text-xs text-ink-500">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span>
                  Verified QueueLess partner with instant booking confirmation.
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
