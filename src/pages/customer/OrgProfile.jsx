import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import RoleNavbar from '../../components/layout/RoleNavbar'
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
  CalendarCheck
} from 'lucide-react'
import { ORGANIZATIONS, SERVICES, formatNaira } from '../../data/mock'

export default function OrgProfile() {
  const { orgId } = useParams()
  const org = ORGANIZATIONS.find((o) => o.id === orgId) || ORGANIZATIONS[0]
  const services = SERVICES.filter((s) => s.orgId === org.id)
  const categories = ['All', ...new Set(services.map((s) => s.category))]

  const [activeCategory, setActiveCategory] = useState('All')
  const [liked, setLiked] = useState(false)

  const filteredServices =
    activeCategory === 'All'
      ? services
      : services.filter((s) => s.category === activeCategory)

  // Default gallery photos if none exist on mock
  const galleryPhotos = org.gallery?.length
    ? org.gallery
    : [
        org.image,
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&w=600&q=80'
      ]

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        
        {/* ================= HERO BANNER ================= */}
        <div className="relative rounded-3xl overflow-hidden shadow-md border border-ink-100 bg-ink-900">
          <div className="relative h-64 sm:h-80 md:h-96 w-full">
            <img
              src={org.image}
              alt={org.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

            {/* Navigation back button */}
            <Link
              to="/customer/explore"
              className="absolute top-5 left-5 w-11 h-11 rounded-2xl bg-white/90 hover:bg-white text-ink-900 flex items-center justify-center shadow-lg transition backdrop-blur-md"
              title="Back to explore"
            >
              <ChevronLeft size={22} />
            </Link>

            {/* Top Right Quick Actions */}
            <div className="absolute top-5 right-5 flex items-center gap-2">
              <button
                type="button"
                onClick={() => setLiked(!liked)}
                className="w-11 h-11 rounded-2xl bg-white/90 hover:bg-white text-ink-900 flex items-center justify-center shadow-lg transition backdrop-blur-md"
              >
                <Heart
                  size={20}
                  className={liked ? 'text-rose-500 fill-rose-500' : 'text-ink-700'}
                />
              </button>
              <button
                type="button"
                className="w-11 h-11 rounded-2xl bg-white/90 hover:bg-white text-ink-900 flex items-center justify-center shadow-lg transition backdrop-blur-md"
              >
                <Share2 size={18} className="text-ink-700" />
              </button>
            </div>

            {/* Bottom Venue Meta on Banner */}
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/90 text-white text-xs font-bold uppercase tracking-wider mb-2 backdrop-blur-sm">
                  <Sparkles size={12} /> {org.category || 'Beauty & Wellness'}
                </span>
                <h1 className="text-2xl sm:text-4xl font-black drop-shadow-md">
                  {org.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs sm:text-sm text-white/90">
                  <div className="flex items-center gap-1 font-bold">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span>{org.rating}</span>
                    <span className="text-white/70">({org.reviews} verified reviews)</span>
                  </div>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={15} /> {org.location}
                  </span>
                  <span>·</span>
                  <span className="text-emerald-400 font-bold">
                    ● {org.open ? `Open · Closes ${org.closes || '8:00 PM'}` : 'Closed'}
                  </span>
                </div>
              </div>

              {/* Direct Booking CTA Header */}
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
          
          {/* LEFT 2 COLUMNS: About, Gallery, Service Catalog */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* About / Description Card */}
            <div className="card p-6 sm:p-8 border border-ink-100 bg-white shadow-sm space-y-3">
              <h2 className="text-lg font-black text-ink-900">About {org.name}</h2>
              <p className="text-sm text-ink-600 leading-relaxed">
                {org.description ||
                  `${org.name} offers premium beauty, grooming, and wellness services. Certified professionals provide individualized care using high-grade organic products in a relaxed, hygienic setting.`}
              </p>
            </div>

            {/* Photo Gallery Grid */}
            <div className="card p-6 sm:p-8 border border-ink-100 bg-white shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-ink-900">Photos & Atmosphere</h2>
                  <p className="text-xs text-ink-400">Take a look inside the salon before your visit</p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {galleryPhotos.slice(0, 4).map((src, i) => (
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

            {/* SERVICES CATALOG */}
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-ink-900">Service Menu</h2>
                  <p className="text-xs text-ink-400">Select a service to book your preferred specialist</p>
                </div>

                {/* Category Pills Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setActiveCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                        activeCategory === cat
                          ? 'bg-ink-900 text-white shadow-xs'
                          : 'bg-white border border-ink-200 text-ink-600 hover:border-brand-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
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
                        {svc.description || 'Professional styling, care and treatment tailored to your preference.'}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-ink-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-semibold text-ink-400 uppercase">Price</span>
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
                  <div className="col-span-full card p-8 text-center text-ink-400 text-sm">
                    No services found under "{activeCategory}".
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT 1 COLUMN: Sticky Information, Hours & Virtual Queue Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-8">
            
            {/* LIVE QUEUE TICKET CARD */}
            <div className="card p-6 border border-brand-200 bg-gradient-to-br from-white via-white to-brand-50/30 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-ink-100">
                <span className="text-xs font-black uppercase tracking-wider text-brand-700 flex items-center gap-1.5">
                  <Zap size={15} className="text-brand-600" /> Virtual Queue Active
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div>
                <p className="text-xs text-ink-400 uppercase font-semibold">Walk-in Line Status</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-ink-900">4 People</span>
                  <span className="text-xs text-ink-500 font-medium">waiting right now</span>
                </div>
                <p className="text-xs text-ink-500 mt-1">
                  Est. wait: <strong className="text-brand-600">~15-20 mins</strong>
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
                  <MapPin size={18} className="text-brand-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-ink-900 block">Address</span>
                    <p className="mt-0.5">{org.location || 'Victoria Island, Lagos, Nigeria'}</p>
                    <span className="text-[11px] text-ink-400 mt-0.5 block">{org.distance || '1.2 km from your location'}</span>
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-start gap-3 text-ink-600">
                  <Clock size={18} className="text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-ink-900 block">Opening Hours</span>
                    <p className="mt-0.5">{org.hours || 'Monday – Saturday: 9:00 AM – 8:00 PM'}</p>
                    <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Sundays: 12:00 PM – 6:00 PM</p>
                  </div>
                </div>

                {/* Direct Contact */}
                <div className="flex items-start gap-3 text-ink-600">
                  <Phone size={18} className="text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-ink-900 block">Phone Support</span>
                    <p className="mt-0.5">+234 812 345 6789</p>
                  </div>
                </div>
              </div>

              {/* Verified Partner Badge */}
              <div className="pt-4 border-t border-ink-100 flex items-center gap-2 text-xs text-ink-500">
                <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
                <span>Verified QueueLess partner with instant booking confirmation.</span>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  )
}