import { useState } from 'react'
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom'
import RoleNavbar from '../../components/layout/RoleNavbar'
import {
  ChevronLeft,
  Star,
  Check,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  User,
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'
import { WORKERS, TIME_SLOTS, SERVICES, ORGANIZATIONS, formatNaira } from '../../data/mock'

const STEPS = [
  { id: 'worker', label: '1. Select Specialist' },
  { id: 'datetime', label: '2. Date & Time' },
  { id: 'summary', label: '3. Review & Pay' },
  { id: 'done', label: '4. Confirmed' },
]

export default function BookFlow() {
  const { orgId } = useParams()
  const [params] = useSearchParams()
  const navigate = useNavigate()

  const org = ORGANIZATIONS.find((o) => o.id === orgId) || ORGANIZATIONS[0]
  const serviceId = params.get('service') || 'svc-2'
  const svc = SERVICES.find((s) => s.id === serviceId) || SERVICES[1]
  const workers = WORKERS.filter((w) => w.orgId === org.id)

  const [step, setStep] = useState(0)
  const [workerId, setWorkerId] = useState(workers[0]?.id || null)
  const [date, setDate] = useState(16)
  const [time, setTime] = useState(TIME_SLOTS[1] || '10:00 AM')

  const worker = workers.find((w) => w.id === workerId) || workers[0]

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1))
  const back = () => {
    if (step === 0) navigate(-1)
    else setStep((s) => s - 1)
  }

  // Calendar days demo
  const days = Array.from({ length: 21 }, (_, i) => i + 10)

  // Fallback image for organization
  const coverImage =
    org.image ||
    'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80'

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto">
        {/* Navigation & Stepper Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <button
            onClick={back}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-600 hover:text-brand-600 transition"
          >
            <ChevronLeft size={20} /> Back
          </button>

          {/* Stepper Indicator */}
          {step < 3 && (
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-1">
              {STEPS.slice(0, 3).map((st, i) => (
                <div key={st.id} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                      i === step
                        ? 'bg-brand-500 text-white shadow-sm'
                        : i < step
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-ink-100 text-ink-400'
                    }`}
                  >
                    {i < step ? <Check size={12} strokeWidth={3} /> : null}
                    <span>{st.label}</span>
                  </div>
                  {i < 2 && <span className="text-ink-300 text-xs hidden sm:inline">→</span>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= STEP 3: CONFIRMATION SCREEN ================= */}
        {step === 3 ? (
          <div className="max-w-xl mx-auto text-center py-10">
            <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-6 shadow-xs ring-8 ring-emerald-50/50">
              <CheckCircle2 size={42} />
            </div>
            <h1 className="text-3xl font-black text-ink-900 mb-2">Booking Confirmed!</h1>
            <p className="text-sm text-ink-500 mb-8 max-w-sm mx-auto">
              You are all set! We have sent a confirmation email with appointment details and venue directions.
            </p>

            {/* Receipt Card */}
            <div className="card p-6 border border-ink-100 shadow-sm text-left mb-6 space-y-4 bg-white">
              <div className="flex items-center gap-3 pb-4 border-b border-ink-100">
                <img
                  src={worker?.avatar}
                  alt={worker?.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-ink-900 text-base">{svc.name}</h4>
                  <p className="text-xs text-ink-500">{org.name} · With {worker?.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-ink-400 uppercase font-semibold">Date & Time</span>
                  <p className="font-bold text-ink-900 text-sm mt-0.5">Wed, Apr {date}, 2025 at {time}</p>
                </div>
                <div>
                  <span className="text-ink-400 uppercase font-semibold">Duration</span>
                  <p className="font-bold text-ink-900 text-sm mt-0.5">{svc.duration} mins</p>
                </div>
              </div>

              <div className="border-t border-ink-100 pt-3 flex justify-between items-baseline">
                <span className="text-xs font-semibold text-ink-500">Amount Paid</span>
                <span className="text-xl font-black text-brand-600">{formatNaira(svc.price)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/customer/appointments" className="btn-primary flex-1 py-3 font-bold">
                View My Appointments
              </Link>
              <Link to="/customer" className="btn-secondary flex-1 py-3 font-bold">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          /* ================= TWO COLUMN WORKFLOW (STEPS 0, 1, 2) ================= */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* LEFT 2 COLUMNS: Step Contents */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* STEP 0: Select Worker */}
              {step === 0 && (
                <div className="space-y-5">
                  <div>
                    <h1 className="text-2xl font-black text-ink-900">Choose a Specialist</h1>
                    <p className="text-sm text-ink-500 mt-1">
                      Pick your preferred stylist or professional at {org.name}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {workers.map((w) => {
                      const isSelected = workerId === w.id
                      return (
                        <div
                          key={w.id}
                          onClick={() => w.available && setWorkerId(w.id)}
                          className={`card p-5 border cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/20 shadow-md'
                              : w.available
                              ? 'border-ink-100 hover:border-brand-200 hover:shadow-md bg-white'
                              : 'border-ink-100 opacity-50 cursor-not-allowed bg-ink-50'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <img
                              src={w.avatar}
                              alt={w.name}
                              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-ink-100"
                            />
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-ink-900 text-base truncate">{w.name}</h3>
                              <p className="text-xs text-ink-500 font-medium">{w.title}</p>
                              
                              <div className="flex items-center gap-1.5 mt-2 text-xs">
                                <Star size={13} className="text-amber-400 fill-amber-400" />
                                <span className="font-bold text-ink-800">{w.rating}</span>
                                <span className="text-ink-400">({w.reviews} reviews)</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-ink-100 flex items-center justify-between text-xs">
                            {w.available ? (
                              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                ● Available today
                              </span>
                            ) : (
                              <span className="text-ink-400">Unavailable</span>
                            )}
                            <span className="text-brand-600 font-bold">
                              {isSelected ? 'Selected' : 'Select'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      className="btn-primary px-8 py-3 font-bold inline-flex items-center gap-2 shadow-md shadow-brand-500/10"
                      disabled={!workerId}
                      onClick={next}
                    >
                      Next: Choose Date & Time <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 1: Select Date & Time */}
              {step === 1 && (
                <div className="card p-6 sm:p-8 border border-ink-100 shadow-sm space-y-8 bg-white">
                  <div>
                    <h1 className="text-2xl font-black text-ink-900">Select Date & Time</h1>
                    <p className="text-sm text-ink-500 mt-1">
                      Choose when you would like your appointment with {worker?.name}.
                    </p>
                  </div>

                  {/* Calendar Widget */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-bold text-ink-900 uppercase tracking-wider flex items-center gap-2">
                        <Calendar size={18} className="text-brand-600" /> April 2025
                      </span>
                      <span className="text-xs text-ink-400">Timezone: West Africa Time (WAT)</span>
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                        <div key={d} className="text-center text-xs font-bold text-ink-400 py-2">
                          {d}
                        </div>
                      ))}

                      {/* Spacer alignment */}
                      <div /><div /><div />

                      {days.map((d) => {
                        const isSelected = date === d
                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setDate(d)}
                            className={`aspect-square rounded-2xl text-sm font-bold transition flex flex-col items-center justify-center ${
                              isSelected
                                ? 'bg-brand-500 text-white shadow-md shadow-brand-500/20'
                                : 'bg-ink-50 hover:bg-brand-50 hover:text-brand-600 text-ink-800'
                            }`}
                          >
                            <span>{d}</span>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Time Slots Widget */}
                  <div className="border-t border-ink-100 pt-6">
                    <p className="text-sm font-bold text-ink-900 mb-3 flex items-center gap-2">
                      <Clock size={18} className="text-brand-600" /> Available Time Slots
                    </p>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {TIME_SLOTS.map((t) => {
                        const isSelected = time === t
                        return (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setTime(t)}
                            className={`py-3 rounded-xl text-xs font-bold transition border ${
                              isSelected
                                ? 'bg-brand-500 text-white border-brand-500 shadow-md shadow-brand-500/10'
                                : 'bg-white border-ink-200 text-ink-800 hover:border-brand-300 hover:bg-brand-50/30'
                            }`}
                          >
                            {t}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center border-t border-ink-100">
                    <button onClick={back} className="text-sm font-bold text-ink-500 hover:text-ink-800">
                      ← Change Specialist
                    </button>
                    <button
                      className="btn-primary px-8 py-3 font-bold inline-flex items-center gap-2"
                      disabled={!date || !time}
                      onClick={next}
                    >
                      Next: Review Summary <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Review & Summary */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl font-black text-ink-900">Review Your Booking</h1>
                    <p className="text-sm text-ink-500 mt-1">
                      Double check your appointment details before confirming.
                    </p>
                  </div>

                  <div className="card p-6 border border-ink-100 shadow-sm bg-white space-y-4">
                    <h3 className="font-bold text-ink-900 text-base pb-3 border-b border-ink-100">
                      Appointment Specifications
                    </h3>

                    <Row label="Service" value={`${svc.name} (${svc.duration} mins)`} />
                    <Row label="Organization" value={org.name} />
                    <Row label="Specialist" value={worker?.name || 'Any Available'} />
                    <Row label="Scheduled Time" value={`Wed, Apr ${date}, 2025 at ${time}`} />
                    <Row
                      label="Cancellation Policy"
                      value={<span className="text-emerald-700 font-semibold">Free cancellation up to 2h before</span>}
                    />
                  </div>

                  {/* Safety / Arrive on time box */}
                  <div className="card p-5 border border-brand-200 bg-brand-50/40 flex items-start gap-3">
                    <ShieldCheck size={20} className="text-brand-600 shrink-0 mt-0.5" />
                    <div className="text-xs text-ink-600 leading-relaxed">
                      <strong className="text-ink-900 block font-bold mb-0.5">QueueLess Arrival Guarantee</strong>
                      Please arrive 10 minutes prior to {time}. Show your booking reference upon arrival for instant check-in.
                    </div>
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button onClick={back} className="text-sm font-bold text-ink-500 hover:text-ink-800">
                      ← Change Date or Time
                    </button>
                    <button
                      className="btn-primary px-10 py-3.5 font-bold inline-flex items-center gap-2 shadow-lg shadow-brand-500/20 text-base"
                      onClick={next}
                    >
                      Confirm Booking <Check size={18} />
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* RIGHT COLUMN: Live Sticky Booking Summary */}
            <div className="space-y-6 lg:sticky lg:top-8">
              <div className="card overflow-hidden border border-ink-100 shadow-sm bg-white">
                {/* Visual Cover Thumbnail */}
                <div className="relative h-32 w-full bg-ink-200">
                  <img
                    src={coverImage}
                    alt={org.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-brand-500/90 backdrop-blur-sm px-2 py-0.5 rounded mb-1">
                      <Sparkles size={10} /> Selected Service
                    </span>
                    <h4 className="font-extrabold text-sm truncate">{org.name}</h4>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Service Info */}
                  <div>
                    <h3 className="font-extrabold text-ink-900 text-lg">{svc.name}</h3>
                    <p className="text-xs text-ink-500 flex items-center gap-1 mt-0.5">
                      <MapPin size={13} /> Victoria Island, Lagos
                    </p>
                  </div>

                  <div className="space-y-2.5 py-3 border-y border-ink-100 text-xs">
                    <div className="flex items-center justify-between text-ink-600">
                      <span className="flex items-center gap-1.5"><User size={14} className="text-ink-400" /> Specialist</span>
                      <strong className="text-ink-900">{worker?.name || 'Not selected'}</strong>
                    </div>

                    <div className="flex items-center justify-between text-ink-600">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="text-ink-400" /> Date</span>
                      <strong className="text-ink-900">Apr {date}, 2025</strong>
                    </div>

                    <div className="flex items-center justify-between text-ink-600">
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-ink-400" /> Time</span>
                      <strong className="text-ink-900">{time || 'Not selected'}</strong>
                    </div>
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-ink-500">
                      <span>Service fee</span>
                      <span className="font-semibold text-ink-800">{formatNaira(svc.price)}</span>
                    </div>
                    <div className="flex justify-between text-ink-500">
                      <span>QueueLess fee</span>
                      <span className="font-semibold text-emerald-600 uppercase font-mono">Free</span>
                    </div>
                    <div className="pt-2 border-t border-ink-100 flex justify-between items-baseline">
                      <span className="font-bold text-ink-900 text-sm">Total Due</span>
                      <span className="text-xl font-black text-brand-600">
                        {formatNaira(svc.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Secure Booking Badge */}
              <div className="flex items-center justify-center gap-2 text-xs text-ink-400 font-medium">
                <ShieldCheck size={16} className="text-emerald-600" /> 100% Secure Appointment Booking
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between items-center gap-4 text-sm">
      <span className="text-ink-500">{label}</span>
      <span className="font-bold text-ink-900 text-right">{value}</span>
    </div>
  )
}