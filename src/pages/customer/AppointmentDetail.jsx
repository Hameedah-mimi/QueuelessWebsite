import { useParams, useNavigate, Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Phone,
  Sparkles,
  ExternalLink,
  AlertCircle,
} from "lucide-react";
import { APPOINTMENTS, formatNaira } from "../../data/mock";

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const apt = APPOINTMENTS.find((a) => a.id === id) || APPOINTMENTS[0];

  // Fallback high-res business cover image if not provided in mock
  const coverImage =
    apt.image ||
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80";

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Navigation & Status Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-brand-600 transition"
          >
            <ChevronLeft size={20} /> Back to appointments
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-ink-400 font-bold">
              Booking Ref:
            </span>
            <span className="font-mono text-xs font-semibold px-2.5 py-1 bg-ink-100 rounded-md text-ink-700">
              #{apt.id || "APT-001"}
            </span>
          </div>
        </div>

        {/* Desktop 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: Visual Hero + Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Cover & Header Card */}
            <div className="card overflow-hidden border border-ink-100 shadow-sm">
              <div className="relative h-56 sm:h-72 w-full bg-ink-200">
                <img
                  src={coverImage}
                  alt={apt.org}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider bg-brand-500/90 backdrop-blur-sm px-2.5 py-1 rounded-md mb-2">
                    <Sparkles size={12} /> {apt.service}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black">{apt.org}</h1>
                  <p className="text-white/80 text-sm flex items-center gap-1.5 mt-1">
                    <MapPin size={15} /> 12 Adeola Odeku St, Victoria Island,
                    Lagos
                  </p>
                </div>
              </div>

              {/* Quick Info Bar */}
              <div className="p-5 bg-white flex flex-wrap items-center justify-between gap-4 border-b border-ink-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-ink-400 font-semibold uppercase">
                      Date
                    </p>
                    <p className="text-sm font-bold text-ink-900">{apt.date}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-ink-400 font-semibold uppercase">
                      Time & Duration
                    </p>
                    <p className="text-sm font-bold text-ink-900">
                      {apt.time} ({apt.duration} mins)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-ink-400 font-semibold uppercase">
                      Status
                    </p>
                    <span className="inline-flex items-center text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize">
                      ● {apt.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specialist Profile Card */}
            <div className="card p-6 border border-ink-100 shadow-sm">
              <h2 className="text-base font-bold text-ink-900 mb-4">
                Assigned Specialist
              </h2>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xl ring-2 ring-brand-500/20">
                    {apt.worker ? (
                      <img
                        src={`https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80`}
                        alt={apt.worker}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-900 text-lg">
                      {apt.worker || "Any Specialist"}
                    </h3>
                    <p className="text-xs text-ink-500 font-medium">
                      Senior Stylist & Care Specialist
                    </p>
                    <p className="text-xs text-emerald-600 font-semibold mt-0.5">
                      ★ 4.9 Rating (120+ reviews)
                    </p>
                  </div>
                </div>

                <Link
                  to={`/customer/org/${apt.orgId || "1"}`}
                  className="btn-secondary text-xs px-3.5 py-2 inline-flex items-center gap-1.5"
                >
                  <ExternalLink size={14} /> View Business Page
                </Link>
              </div>
            </div>

            {/* Preparation / Instructions */}
            <div className="card p-6 border border-ink-100 shadow-sm bg-gradient-to-br from-brand-50/40 via-white to-transparent">
              <div className="flex items-start gap-3">
                <AlertCircle
                  className="text-brand-600 shrink-0 mt-0.5"
                  size={20}
                />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-ink-900">
                    Important Instructions
                  </h4>
                  <ul className="text-xs text-ink-600 space-y-1 list-disc list-inside">
                    <li>
                      Please arrive 10 minutes prior to your scheduled slot.
                    </li>
                    <li>
                      Free cancellation and rescheduling are permitted up to 2
                      hours before start time.
                    </li>
                    <li>
                      Notify the venue staff upon arrival to check in seamlessly
                      via QueueLess.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Sticky Payment & Actions Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* Price & Summary Card */}
            <div className="card p-6 border border-ink-100 shadow-sm">
              <h3 className="text-base font-extrabold text-ink-900 mb-4 pb-3 border-b border-ink-100">
                Payment Summary
              </h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-500">Service Fee</span>
                  <span className="font-medium text-ink-900">
                    {formatNaira(apt.price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-500">Platform Booking Fee</span>
                  <span className="font-medium text-emerald-600">FREE</span>
                </div>
                <div className="border-t border-ink-100 pt-3 flex justify-between items-baseline">
                  <span className="text-base font-bold text-ink-900">
                    Total
                  </span>
                  <span className="text-2xl font-black text-brand-600">
                    {formatNaira(apt.price)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  type="button"
                  className="btn-primary w-full py-2.5 font-bold shadow-md shadow-brand-500/10"
                >
                  Reschedule Appointment
                </button>
                <button
                  type="button"
                  className="btn-danger w-full py-2.5 font-bold"
                >
                  Cancel Appointment
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-ink-100 text-center">
                <Link
                  to={`/customer/org/${apt.orgId || "1"}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  <MapPin size={14} /> Get venue directions
                </Link>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="card p-5 border border-ink-100 bg-ink-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-ink-900">
                  Questions or delays?
                </p>
                <p className="text-xs text-ink-500">
                  Reach out to the salon directly
                </p>
              </div>
              <button className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1">
                <Phone size={13} /> Call
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
