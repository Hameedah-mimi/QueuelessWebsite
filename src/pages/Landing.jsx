import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import PublicNavbar from '../components/layout/PublicNavbar'
import { FadeIn, Stagger, StaggerItem } from '../components/ui/Motion'
import { Clock, MapPin, Star, ArrowRight, CheckCircle, Sparkles, Zap, Shield } from 'lucide-react'

export default function Landing() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const requireAuth = (path) => (e) => {
    if (!isAuthenticated) {
      e.preventDefault()
      navigate('/login', { state: { from: { pathname: path } } })
    }
  }

  return (
    <div className="min-h-screen bg-ink-50 overflow-x-hidden">
      <PublicNavbar />

      {/* ─── HERO ─── */}
      <section className="relative overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-brand-200/40 rounded-full blur-3xl animate-blob animate-float-slow" />
          <div className="absolute top-40 -right-20 w-[360px] h-[360px] bg-teal-200/30 rounded-full blur-3xl animate-blob animate-float" style={{ animationDelay: '1.5s' }} />
          <div className="absolute bottom-0 left-1/3 w-[280px] h-[280px] bg-amber-100/40 rounded-full blur-3xl animate-pulse-soft" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 lg:pt-28 lg:pb-36">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Copy */}
            <div>
              <FadeIn>
                <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-brand-200 text-brand-700 text-sm font-semibold px-3.5 py-1.5 rounded-full mb-6 shadow-sm">
                  <Sparkles size={14} className="text-brand-500" />
                  Skip the queue, not the service
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-ink-900 leading-[1.1] tracking-tight">
                  Book your next
                  <br />
                  appointment in
                  <br />
                  <span className="gradient-text">seconds.</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="mt-6 text-lg text-ink-500 max-w-md leading-relaxed">
                  Discover trusted salons, clinics and spas near you, pick your preferred worker,
                  and track your place in the queue live.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link to="/register" className="btn-primary text-base px-7 py-3.5 shadow-lg shadow-brand-500/25">
                    Get started <ArrowRight size={18} />
                  </Link>
                  <Link
                    to="/explore"
                    onClick={requireAuth('/explore')}
                    className="btn-secondary text-base px-7 py-3.5"
                  >
                    Explore businesses
                  </Link>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="mt-12 flex gap-8 sm:gap-12">
                  {[
                    { n: '10k+', l: 'Bookings made' },
                    { n: '500+', l: 'Trusted businesses' },
                    { n: '4.8', l: 'Average rating' },
                  ].map((s) => (
                    <div key={s.l}>
                      <p className="text-2xl sm:text-3xl font-extrabold text-ink-900">{s.n}</p>
                      <p className="text-xs sm:text-sm text-ink-500 mt-0.5">{s.l}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Floating product card */}
            <FadeIn delay={0.25} y={30} className="relative hidden lg:block">
              <div className="absolute -top-8 -right-8 w-64 h-64 bg-brand-300/30 rounded-full blur-3xl animate-pulse-soft" />

              {/* Main card */}
              <motion.div
                className="relative glass rounded-3xl p-6 max-w-sm ml-auto"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <img
                    src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=100&q=80"
                    alt=""
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-200"
                  />
                  <div>
                    <p className="font-semibold text-ink-900">Glow Beauty Salon</p>
                    <p className="text-xs text-ink-500 flex items-center gap-1">
                      <MapPin size={11} /> Lekki · <Star size={11} className="text-amber-400 fill-amber-400" /> 4.9
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-brand-500 to-teal-600 rounded-2xl p-4 mb-4 text-white shadow-lg shadow-brand-500/20">
                  <p className="text-xs text-white/70 mb-0.5">Your queue number</p>
                  <p className="text-2xl font-extrabold">#004 · 10 mins</p>
                  <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: '40%' }}
                      animate={{ width: ['40%', '70%', '40%'] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  {[
                    { t: 'Braiding · Sarah', time: '11:00 AM', ok: true },
                    { t: 'Facial · Chioma', time: '12:30 PM', ok: false },
                  ].map((item) => (
                    <div key={item.t} className="flex items-center gap-2.5 text-sm text-ink-700">
                      <CheckCircle size={15} className={item.ok ? 'text-brand-500' : 'text-ink-300'} />
                      <span className="flex-1">{item.t}</span>
                      <span className="text-xs text-ink-400">{item.time}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Floating mini badge */}
              <motion.div
                className="absolute -left-6 bottom-16 glass rounded-2xl px-4 py-3 shadow-lg"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <p className="text-xs text-ink-500">Live queue</p>
                <p className="text-sm font-bold text-ink-900 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 6 waiting
                </p>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="relative py-20 bg-white border-y border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <h2 className="text-3xl font-extrabold text-center text-ink-900 mb-3">
              How QueueLess works
            </h2>
            <p className="text-center text-ink-500 mb-14 max-w-md mx-auto">
              Three simple steps from search to service — no waiting room required.
            </p>
          </FadeIn>

          <Stagger className="grid md:grid-cols-3 gap-6" stagger={0.12}>
            {[
              {
                icon: Zap,
                step: '01',
                title: 'Find a business',
                desc: 'Search salons, clinics and spas near you by service, rating or price.',
                color: 'from-brand-400 to-brand-600',
              },
              {
                icon: Clock,
                step: '02',
                title: 'Book or join the queue',
                desc: 'Pick a time or join the live digital queue for walk-in services.',
                color: 'from-teal-400 to-teal-600',
              },
              {
                icon: Shield,
                step: '03',
                title: 'Skip the wait',
                desc: 'Track your place in real time and arrive just in time for your turn.',
                color: 'from-amber-400 to-orange-500',
              },
            ].map((item) => (
              <StaggerItem key={item.step}>
                <div className="card-hover p-6 h-full group">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon size={22} />
                  </div>
                  <span className="text-xs font-bold text-ink-300 tracking-widest">{item.step}</span>
                  <h3 className="text-lg font-bold text-ink-900 mt-1 mb-2">{item.title}</h3>
                  <p className="text-sm text-ink-500 leading-relaxed">{item.desc}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-500 to-teal-500" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-20 w-56 h-56 bg-white rounded-full blur-3xl animate-float-slow" />
        </div>
        <div className="relative max-w-2xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to skip the queue?
            </h2>
            <p className="text-brand-100 mb-8 text-lg">
              Create a free account and book your first appointment in under a minute.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-200"
            >
              Create free account <ArrowRight size={18} />
            </Link>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink-900 text-ink-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span className="text-white font-extrabold text-lg">
            Queue<span className="text-brand-400">Less</span>
          </span>
          <p className="text-sm">© 2026 QueueLess · Lagos, Nigeria</p>
        </div>
      </footer>
    </div>
  )
}
