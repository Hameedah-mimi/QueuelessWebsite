import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building2,
  Stethoscope,
  Wrench,
  Scissors,
} from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";

export default function Login() {
  const { loginWithEmail, loginWithGoogle, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const resolveDashboard = (role) => {
    if (from) return from;
    switch (role) {
      case "admin":
        return "/admin";
      case "org_manager":
      case "organization":
        return "/organization";
      case "worker":
        return "/worker";
      default:
        return "/customer";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const loggedInUser = await loginWithEmail(email.trim(), password);
      const destination = resolveDashboard(loggedInUser.role);
      navigate(destination, { replace: true });
    } catch {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const loggedInUser = await loginWithGoogle();
      const destination = resolveDashboard(loggedInUser.role);
      navigate(destination, { replace: true });
    } catch {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-slate-950">
      {/* Background Architectural/Service Imagery with Atmospheric Gradients */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=2000&q=80"
          alt="Modern workspace background"
          className="w-full h-full object-cover opacity-20 filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-teal-950/80" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10">
        <PublicNavbar />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Split-Screen Glassmorphic Card */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/95 backdrop-blur-xl min-h-[640px]">
          {/* ================= LEFT COLUMN: UNIVERSAL LOGIN ================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-100">
                  <Sparkles size={13} className="text-teal-600" /> Universal
                  Access
                </span>
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  Sign in to QueueLess
                </h1>
                <p className="text-sm text-slate-500 mt-2">
                  Access client visits, staff terminals, or administrative
                  consoles.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold leading-relaxed animate-fade-in flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type="email"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
                      placeholder="e.g. name@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      className="w-full pl-11 pr-11 py-3 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      aria-label={showPw ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      onClick={() => setShowPw(!showPw)}
                    >
                      {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 inline-flex items-center justify-center gap-2 mt-2 transition duration-200"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Authenticating…
                    </span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-3 text-slate-400 font-medium">
                    or continue with
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 inline-flex items-center justify-center gap-2.5 transition shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="mt-8 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500">
                  New to QueueLess?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-teal-600 hover:underline"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: EDITORIAL HERO ================= */}
          <div className="hidden lg:flex lg:col-span-5 relative bg-slate-950 overflow-hidden flex-col justify-between p-10 text-white">
            <img
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80"
              alt="Professional services and consulting workspace"
              className="absolute inset-0 w-full h-full object-cover opacity-25 filter brightness-75 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-teal-950/80" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-300 text-xs font-bold tracking-wide border border-white/15">
                <Clock size={13} className="text-teal-400" /> Live Queue
                Technology
              </span>
              <span className="text-xs font-semibold text-slate-400">
                QueueLess 1.0
              </span>
            </div>

            <div className="relative z-10 space-y-6 my-auto">
              <div className="space-y-3">
                <h2 className="text-3xl font-black leading-tight text-white drop-shadow-md">
                  One platform for every service requiring an appointment or
                  line.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  Book clinics, mechanics, legal sessions, spas, and salons
                  without ever sitting in a crowded waiting lobby.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
                <div className="p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center gap-2.5 text-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <Stethoscope size={14} />
                  </div>
                  <span>Medical & Clinics</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center gap-2.5 text-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <Wrench size={14} />
                  </div>
                  <span>Auto Care & Repair</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center gap-2.5 text-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                    <Scissors size={14} />
                  </div>
                  <span>Salons & Grooming</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-white/10 flex items-center gap-2.5 text-slate-200">
                  <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                    <Building2 size={14} />
                  </div>
                  <span>Agencies & Legal</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/15 space-y-2 shadow-2xl">
                <p className="text-xs text-slate-200 font-medium italic leading-relaxed">
                  "QueueLess eliminated our physical waiting room crowd. Clients
                  arrive right as their service begins."
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[11px] text-slate-400">
                  <span>Victoria Island & Lekki Phase 1</span>
                  <span className="text-teal-400 font-bold flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Network
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-teal-400" /> Encrypted
                Role-Based Security
              </span>
              <span>All Industries</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-xs text-slate-400 border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
        © 2026 QueueLess Inc. Universal Queue & Appointment Management.
      </footer>
    </div>
  );
}
