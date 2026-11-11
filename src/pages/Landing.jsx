import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import PublicNavbar from "../components/layout/PublicNavbar";
import { FadeIn, Stagger, StaggerItem } from "../components/ui/Motion";
import {
  Clock,
  MapPin,
  Star,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Zap,
  ShieldCheck,
  Stethoscope,
  Wrench,
  Scissors,
  Building2,
  Users,
  CalendarCheck,
  Navigation,
  Check,
  X,
} from "lucide-react";

// Multi-service industries
const SECTORS = [
  {
    title: "Medical & Dental",
    desc: "Consultations, cleanings & diagnostic scans without lobby exposure.",
    icon: Stethoscope,
    badge: "Zero Waiting Room",
    color: "from-emerald-500 to-teal-600",
    bg: "bg-emerald-50 text-emerald-800 border-emerald-100",
  },
  {
    title: "Auto Care & Repair",
    desc: "Brake checks, wheel alignments & diagnostics on reserved bays.",
    icon: Wrench,
    badge: "Live Bay Tracking",
    color: "from-amber-500 to-orange-600",
    bg: "bg-amber-50 text-amber-800 border-amber-100",
  },
  {
    title: "Salons & Grooming",
    desc: "Executive cuts, knotless braids & nail artistry on demand.",
    icon: Scissors,
    badge: "Specialist Choice",
    color: "from-teal-500 to-cyan-600",
    bg: "bg-teal-50 text-teal-800 border-teal-100",
  },
  {
    title: "Legal & Consulting",
    desc: "Private notary sessions, corporate advice & financial check-ins.",
    icon: Building2,
    badge: "Strict Appointments",
    color: "from-blue-500 to-indigo-600",
    bg: "bg-blue-50 text-blue-800 border-blue-100",
  },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const requireAuth = (path) => (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate("/login", { state: { from: { pathname: path } } });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden selection:bg-teal-500 selection:text-white">
      <PublicNavbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-36 bg-radial-mesh">
        {/* Animated Background Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-teal-400/15 rounded-full blur-3xl animate-float-slow" />
          <div
            className="absolute top-60 -right-20 w-[450px] h-[450px] bg-emerald-400/15 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          />
          <div className="absolute -bottom-20 left-1/3 w-[350px] h-[350px] bg-cyan-300/10 rounded-full blur-3xl animate-pulse-soft" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Proposition & CTAs (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <FadeIn>
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md border border-teal-200 text-teal-800 text-xs font-bold px-4 py-1.5 rounded-full shadow-xs">
                  <Sparkles size={13} className="text-teal-600 animate-pulse" />
                  <span>The Universal Wait-Free Service Engine</span>
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-6xl lg:text-[4rem] font-black text-slate-950 leading-[1.08] tracking-tight">
                  Stop sitting in
                  <br />
                  waiting lobbies.
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-teal-500 to-emerald-600">
                    Get served on time.
                  </span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  QueueLess lets you reserve specialists, join live virtual
                  queues from home, and walk in right as your chair, bay, or
                  clinic room is ready.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
                  <Link
                    to="/register"
                    className="px-7 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xl shadow-teal-600/25 inline-flex items-center gap-2 hover:-translate-y-0.5 transition duration-200"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Link
                    to="/explore"
                    onClick={requireAuth("/explore")}
                    className="px-7 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-sm shadow-xs transition hover:border-teal-300 inline-flex items-center gap-2"
                  >
                    <Navigation size={15} className="text-teal-600" />
                    <span>Explore Services Near You</span>
                  </Link>
                </div>
              </FadeIn>

              {/* Live Trust Metrics */}
              <FadeIn delay={0.4}>
                <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      10k+
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Hours Saved
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                      500+
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Verified Venues
                    </p>
                  </div>
                  <div>
                    <p className="text-2xl sm:text-3xl font-black text-teal-600 tracking-tight">
                      ₦0.00
                    </p>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Online Booking Fee
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Animated Live Product Simulation (5 Cols) */}
            <div className="lg:col-span-5 relative hidden lg:block">
              {/* Backglow Orb */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-400/20 rounded-full blur-3xl pointer-events-none" />

              {/* Main Simulated Live Ticket Card */}
              <motion.div
                className="relative bg-white/95 backdrop-blur-xl border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5"
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                {/* Venue Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-lg border border-teal-100">
                      Q
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">
                        Victoria Care Specialists
                      </h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin size={12} className="text-teal-600" /> Victoria
                        Island ·{" "}
                        <Star
                          size={12}
                          className="text-amber-400 fill-amber-400"
                        />{" "}
                        4.9
                      </p>
                    </div>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                {/* Digital Ticket Widget */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 text-white shadow-lg space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-teal-300 uppercase tracking-wider font-bold">
                      Live Virtual Queue
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full text-[10px] border border-emerald-500/30">
                      Moving Fast
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between pt-1">
                    <div>
                      <p className="text-4xl font-black tracking-tight text-white">
                        #004
                      </p>
                      <p className="text-xs text-slate-300 mt-0.5">
                        Est. wait: ~12 minutes
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-teal-300">
                        Next in line
                      </span>
                      <p className="text-[11px] text-slate-400">
                        1 ahead of you
                      </p>
                    </div>
                  </div>

                  {/* Animated Progress Track */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mt-3">
                    <motion.div
                      className="h-full bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full"
                      initial={{ width: "45%" }}
                      animate={{ width: ["45%", "85%", "45%"] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>

                {/* Real-time Session Checkpoints */}
                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <CheckCircle2
                        size={16}
                        className="text-teal-600 shrink-0"
                      />
                      <span>Diagnostics Check · Dr. Adeleke</span>
                    </div>
                    <span className="text-slate-400">10:30 AM</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700 font-semibold">
                      <Clock size={16} className="text-amber-500 shrink-0" />
                      <span>Dental Cleaning Session</span>
                    </div>
                    <span className="text-slate-400">11:15 AM</span>
                  </div>
                </div>
              </motion.div>

              {/* Floating Live Badge Overlay */}
              <motion.div
                className="absolute -left-6 bottom-12 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-4 shadow-xl flex items-center gap-3.5"
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    SMS Alert Sent
                  </p>
                  <p className="text-xs font-bold text-slate-900 mt-0.5">
                    Please head to Station 2
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── MULTI-INDUSTRY SECTOR SHOWCASE (NO EMOJIS) ─── */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                Universal Infrastructure
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Built for every business with a line
              </h2>
              <p className="text-sm text-slate-500">
                QueueLess streamlines customer flow across high-demand service
                industries across Nigeria.
              </p>
            </div>
          </FadeIn>

          <Stagger
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            stagger={0.1}
          >
            {SECTORS.map((s) => {
              const Icon = s.icon;
              return (
                <StaggerItem key={s.title}>
                  <div className="card p-6 border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-teal-300 hover:shadow-xl transition-all duration-300 rounded-3xl h-full flex flex-col justify-between group">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon size={22} />
                        </div>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${s.bg}`}
                        >
                          {s.badge}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700 transition">
                        {s.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">
                        {s.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-teal-600 group-hover:text-teal-700">
                      <span>Explore Venues</span>
                      <ArrowRight
                        size={14}
                        className="group-hover:translate-x-1 transition-transform"
                      />
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ─── SIDE-BY-SIDE: THE OLD WAY VS QUEUELESS ─── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <FadeIn>
            <div className="text-center max-w-xl mx-auto mb-16 space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                The difference is your time
              </h2>
              <p className="text-sm text-slate-500">
                See why thousands of clients and businesses have left physical
                waiting rooms behind.
              </p>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* The Old Way */}
            <div className="card p-8 border border-rose-200 bg-white shadow-sm rounded-3xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-rose-100">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-3 py-1 rounded-full">
                  The Old Way
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  Physical Lobby
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600">
                {[
                  "Sitting 45 to 90 minutes in a crowded, noisy waiting room",
                  "Zero transparency on how many people are ahead of you",
                  "Forced to stay physically in the lobby or lose your spot in line",
                  "Overbooked specialists rushing through appointments behind schedule",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                      <X size={12} strokeWidth={3} />
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* The QueueLess Way */}
            <div className="card p-8 border-2 border-teal-500 bg-teal-50/20 shadow-xl rounded-3xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-teal-100">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-100 px-3 py-1 rounded-full">
                  The QueueLess Experience
                </span>
                <span className="text-xs text-teal-700 font-bold">
                  Virtual Line Automation
                </span>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-slate-800">
                {[
                  "Join line from home, coffee shop, or desk with a digital ticket",
                  "Live real-time progress bar showing your exact wait time and position",
                  "Automated SMS alert when you are 1 person away from being seated",
                  "No online credit card fees: simply pay in-person at the venue on arrival",
                ].map((text, idx) => (
                  <div key={idx} className="flex items-start gap-3 font-medium">
                    <div className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (3 SIMPLE STEPS) ─── */}
      <section
        id="how-it-works"
        className="py-24 bg-white border-y border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <FadeIn>
            <div className="text-center max-w-md mx-auto mb-16 space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Three simple steps
              </h2>
              <p className="text-sm text-slate-500">
                From search to service with zero friction.
              </p>
            </div>
          </FadeIn>

          <Stagger
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            stagger={0.12}
          >
            {[
              {
                step: "01",
                title: "Find Services Near You",
                desc: "Use geolocation to explore top-rated verified clinics, auto shops, consultancies, or salons.",
                icon: Navigation,
              },
              {
                step: "02",
                title: "Select Free Slot or Line",
                desc: "Our dynamic engine blocks double-bookings so you only see genuinely free specialist slots.",
                icon: Clock,
              },
              {
                step: "03",
                title: "Arrive & Pay at Counter",
                desc: "Walk in directly as your specialist is ready. Pay at the front desk via Cash, POS, or Transfer.",
                icon: ShieldCheck,
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <StaggerItem key={item.step}>
                  <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 hover:border-teal-300 hover:bg-white hover:shadow-xl transition duration-300 h-full flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md shadow-teal-600/20">
                          <Icon size={22} />
                        </div>
                        <span className="text-xl font-black text-slate-300 font-mono">
                          {item.step}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      {/* ─── CALL TO ACTION (DEEP TEAL GRADIENT) ─── */}
      <section className="relative py-28 overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-950 via-slate-950 to-slate-950 opacity-90" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 text-center space-y-6">
          <FadeIn>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 text-xs font-bold uppercase tracking-wider border border-teal-500/20">
              <Sparkles size={12} /> Instant Access
            </span>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to eliminate waiting rooms forever?
            </h2>

            <p className="text-slate-300 text-base sm:text-lg font-normal max-w-xl mx-auto leading-relaxed">
              Create a free account in 30 seconds. No credit card required.
            </p>

            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-xl shadow-teal-600/25 inline-flex items-center gap-2 hover:-translate-y-0.5 transition duration-200"
              >
                <span>Create Free Account</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/login"
                className="px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/15 backdrop-blur-md transition inline-flex items-center gap-2"
              >
                Sign In to Account
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-medium">
          <span className="text-white font-black text-base tracking-tight">
            Queue<span className="text-teal-500">Less</span>
          </span>
          <p>
            © 2026 QueueLess Inc. Universal Queue & Appointment Management.
            Lagos, Nigeria.
          </p>
        </div>
      </footer>
    </div>
  );
}
