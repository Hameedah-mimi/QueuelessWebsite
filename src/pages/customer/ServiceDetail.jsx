import { useParams, Link, useNavigate } from 'react-router-dom'
import RoleNavbar from '../../components/layout/RoleNavbar'
import {
  ChevronLeft,
  Check,
  Clock,
  Sparkles,
  MapPin,
  Star,
  ShieldCheck,
  ArrowRight,
  CalendarCheck,
  Info
} from 'lucide-react'
import { SERVICES, ORGANIZATIONS, formatNaira } from '../../data/mock'

// High-resolution photography mapped to common salon services
const SERVICE_PHOTOS = {
  braid: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  haircut: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80',
  facial: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
  massage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
  manicure: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
  default: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80',
}

export default function ServiceDetail() {
  const { orgId, serviceId } = useParams()
  const navigate = useNavigate()

  const org = ORGANIZATIONS.find((o) => o.id === orgId) || ORGANIZATIONS[0]
  const svc = SERVICES.find((s) => s.id === serviceId) || SERVICES[1]

  // Pick corresponding photo based on name or category
  const lowerName = (svc.name + ' ' + (svc.category || '')).toLowerCase()
  const heroPhoto =
    svc.image ||
    (lowerName.includes('braid')
      ? SERVICE_PHOTOS.braid
      : lowerName.includes('hair') || lowerName.includes('fade')
      ? SERVICE_PHOTOS.haircut
      : lowerName.includes('facial') || lowerName.includes('skin')
      ? SERVICE_PHOTOS.facial
      : lowerName.includes('massage') || lowerName.includes('spa')
      ? SERVICE_PHOTOS.massage
      : lowerName.includes('mani') || lowerName.includes('pedi') || lowerName.includes('nail')
      ? SERVICE_PHOTOS.manicure
      : SERVICE_PHOTOS.default)

  // Default included items if mock doesn't specify
  const includesList = svc.includes?.length
    ? svc.includes
    : [
        'Initial 1-on-1 consultation with specialist',
        'Full premium styling & organic care products',
        'Post-treatment maintenance guidance & tips',
        'Complimentary beverage & relaxed lounge seating',
      ]

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* ================= NAVIGATION BACK ================= */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-500 hover:text-brand-600 transition"
          >
            <ChevronLeft size={16} /> Back to {org.name}
          </button>

          <span className="text-xs text-ink-400 font-bold uppercase tracking-wider">
            Service Specification
          </span>
        </div>

        {/* ================= 2-COLUMN MAIN DESKTOP GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* LEFT 2 COLUMNS: Hero Image, Description & Inclusions */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Visual Cover Header */}
            <div className="card overflow-hidden border border-ink-100 bg-white shadow-sm">
              <div className="relative h-64 sm:h-80 w-full bg-ink-200">
                <img
                  src={heroPhoto}
                  alt={svc.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-5 left-6 right-6 text-white">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/90 text-white text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-sm">
                    <Sparkles size={12} /> {svc.category || 'Specialty Service'}
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-black drop-shadow-md">
                    {svc.name}
                  </h1>
                  <p className="text-white/80 text-xs sm:text-sm mt-1 flex items-center gap-2">
                    Offered by <strong className="text-white underline">{org.name}</strong>
                  </p>
                </div>
              </div>

              {/* Service Quick Bar */}
              <div className="p-5 bg-white flex flex-wrap items-center justify-between gap-4 border-b border-ink-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center text-brand-600 font-bold">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-400 font-semibold uppercase">Session Duration</p>
                    <p className="text-sm font-bold text-ink-900">{svc.duration} Minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-400 font-semibold uppercase">Hygiene & Safety</p>
                    <p className="text-sm font-bold text-ink-900">100% Sanitized Tools</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 font-bold">
                    <Star size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] text-ink-400 font-semibold uppercase">Customer Rating</p>
                    <p className="text-sm font-bold text-ink-900">4.9 / 5.0 (90+ reviews)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Detailed Description */}
            <div className="card p-6 sm:p-8 border border-ink-100 bg-white shadow-sm space-y-4">
              <h2 className="text-lg font-black text-ink-900">About this treatment</h2>
              <p className="text-sm text-ink-600 leading-relaxed">
                {svc.description ||
                  `Experience a premium session of ${svc.name} provided by licensed professionals at ${org.name}. Tailored to your specific hair, skin, or wellness goals using professional-grade techniques to ensure enduring quality and comfort.`}
              </p>
            </div>

            {/* What's Included Section */}
            <div className="card p-6 sm:p-8 border border-ink-100 bg-white shadow-sm space-y-4">
              <h2 className="text-lg font-black text-ink-900">What is included in this session</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {includesList.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3.5 rounded-2xl bg-ink-50/60 border border-ink-100/60"
                  >
                    <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-semibold text-ink-800 leading-snug">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Preparation / Client Guidelines */}
            <div className="card p-6 border border-brand-200 bg-gradient-to-br from-brand-50/40 via-white to-transparent flex items-start gap-4">
              <Info size={22} className="text-brand-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-ink-900">Preparation & Cancellation Policy</h4>
                <p className="text-xs text-ink-600 leading-relaxed">
                  Please arrive 10 minutes prior to your selected start time. Rescheduling and cancellations are completely free up to 2 hours before the appointment.
                </p>
              </div>
            </div>

          </div>

          {/* RIGHT 1 COLUMN: Sticky Checkout & Venue Card */}
          <div className="space-y-6 lg:sticky lg:top-8">
            
            {/* Price & Booking Action Card */}
            <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  Total Service Price
                </span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-brand-600">
                    {formatNaira(svc.price)}
                  </span>
                  <span className="text-xs text-ink-400 font-medium">/ session</span>
                </div>
              </div>

              <div className="space-y-3 py-4 border-y border-ink-100 text-xs">
                <div className="flex justify-between text-ink-600">
                  <span>Duration</span>
                  <strong className="text-ink-900">{svc.duration} mins</strong>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Specialist Selection</span>
                  <strong className="text-brand-600">Choose on Next Step</strong>
                </div>
                <div className="flex justify-between text-ink-600">
                  <span>Online Booking Fee</span>
                  <strong className="text-emerald-600 uppercase font-mono">Free</strong>
                </div>
              </div>

              {/* Direct Booking Button */}
              <Link
                to={`/customer/org/${org.id}/book?service=${svc.id}`}
                className="btn-primary w-full py-3.5 text-sm font-bold shadow-md shadow-brand-500/15 inline-flex items-center justify-center gap-2"
              >
                Book This Service <ArrowRight size={16} />
              </Link>
            </div>

            {/* Business Snapshot Card */}
            <div className="card p-5 border border-ink-100 bg-white shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-ink-200 overflow-hidden shrink-0">
                  <img
                    src={org.image}
                    alt={org.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-ink-900 text-sm truncate">{org.name}</h4>
                  <p className="text-xs text-ink-400 flex items-center gap-1 truncate mt-0.5">
                    <MapPin size={12} className="shrink-0" /> {org.location || 'Victoria Island'}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-ink-100 flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600">● Open Now</span>
                <Link
                  to={`/customer/org/${org.id}`}
                  className="text-xs font-bold text-brand-600 hover:text-brand-700"
                >
                  View Profile
                </Link>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  )
}