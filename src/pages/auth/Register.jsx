import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Mail,
  Lock,
  Building2,
  User,
  Briefcase,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Star,
} from "lucide-react";
import PublicNavbar from "../../components/layout/PublicNavbar";

const ROLES = [
  {
    id: "customer",
    label: "Customer",
    desc: "Book visits & join live queues",
    icon: User,
  },
  {
    id: "worker",
    label: "Specialist",
    desc: "Offer styling, clinic or repair services",
    icon: Briefcase,
  },
  {
    id: "organization",
    label: "Organization",
    desc: "Manage a venue, salon or clinic",
    icon: Building2,
  },
];

export default function Register() {
  const { registerWithEmail, loginWithGoogle, error, setError } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("customer");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    organization_name: "",
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (form.password.length < 10) {
      setError("Password must contain at least 10 characters.");
      setLoading(false);
      return;
    }

    const roleMapping = {
      customer: "customer",
      worker: "worker",
      organization: "org_manager",
    };

    try {
      const payload = {
        email: form.email.trim(),
        password: form.password,
        full_name: `${form.first_name.trim()} ${form.last_name.trim()}`.trim(),
        role: roleMapping[role] || role,
      };

      if (role === "organization") {
        payload.organization_name = form.organization_name.trim();
      }

      await registerWithEmail(payload);

      const dest = {
        customer: "/customer",
        worker: "/worker",
        organization: "/organization",
      }[role];

      navigate(dest, { replace: true });
    } catch {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    setError(null);

    const roleMapping = {
      customer: "customer",
      worker: "worker",
      organization: "org_manager",
    };

    try {
      await loginWithGoogle(roleMapping[role] || role);
      navigate(`/${role}`, { replace: true });
    } catch {
      // Handled in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col justify-between overflow-hidden bg-slate-950">
      {/* Elevated Background with Photography & Glowing Orbs */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=2000&q=80"
          alt="Modern service environment"
          className="w-full h-full object-cover opacity-20 filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-950/90 to-teal-950/80" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10">
        <PublicNavbar />
      </div>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
        {/* Split-Screen Glassmorphic Card */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-white/95 backdrop-blur-xl min-h-[680px]">
          {/* ================= LEFT COLUMN: REGISTRATION FORM ================= */}
          <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between bg-white">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-bold uppercase tracking-wider mb-3 border border-teal-100">
                  <Sparkles size={12} className="text-teal-600" /> Instant Sign
                  Up
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  Create your account
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Join QueueLess to book visits across all industries or run
                  your operations.
                </p>
              </div>

              {/* Role Selector Tabs */}
              <div className="grid grid-cols-3 gap-2.5 mb-6">
                {ROLES.map((r) => {
                  const Icon = r.icon;
                  const isSelected = role === r.id;

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => {
                        setRole(r.id);
                        setError(null);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-24 ${
                        isSelected
                          ? "border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20 shadow-xs"
                          : "border-slate-200 bg-white hover:border-teal-200 hover:bg-slate-50/50"
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs ${
                          isSelected
                            ? "bg-teal-600 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Icon size={15} />
                      </div>

                      <div>
                        <p
                          className={`text-xs font-bold truncate ${isSelected ? "text-teal-900" : "text-slate-900"}`}
                        >
                          {r.label}
                        </p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {r.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {error && (
                <div className="mb-5 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold leading-relaxed animate-fade-in flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label text-xs font-bold text-slate-700">
                      First Name
                    </label>
                    <input
                      className="input text-sm bg-white"
                      placeholder="e.g. Azeez"
                      value={form.first_name}
                      onChange={set("first_name")}
                      required
                    />
                  </div>
                  <div>
                    <label className="label text-xs font-bold text-slate-700">
                      Last Name
                    </label>
                    <input
                      className="input text-sm bg-white"
                      placeholder="e.g. Sodiq"
                      value={form.last_name}
                      onChange={set("last_name")}
                      required
                    />
                  </div>
                </div>

                {role === "organization" && (
                  <div>
                    <label className="label text-xs font-bold text-slate-700">
                      Business / Clinic / Venue Name
                    </label>
                    <div className="relative">
                      <Building2
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                      />
                      <input
                        className="input pl-11 text-sm bg-white"
                        placeholder="e.g. Apex Health Clinic"
                        value={form.organization_name}
                        onChange={set("organization_name")}
                        required
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="label text-xs font-bold text-slate-700">
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
                      className="input pl-11 text-sm bg-white"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={set("email")}
                    />
                  </div>
                </div>

                <div>
                  <label className="label text-xs font-bold text-slate-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      minLength={10}
                      className="input pl-11 pr-11 text-sm bg-white"
                      placeholder="At least 10 characters"
                      value={form.password}
                      onChange={set("password")}
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
                  <p className="text-[11px] text-slate-400 mt-1">
                    Must be at least 10 characters long.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20 inline-flex items-center justify-center gap-2 mt-2 transition duration-200"
                >
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    <>
                      <span>Create Account</span>
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
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-teal-600 hover:underline"
                  >
                    Log in
                  </Link>
                </p>
                <p className="mt-2 text-[11px] text-slate-400">
                  Admin accounts are invite-only and cannot be created here.
                </p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: EDITORIAL SHOWCASE ================= */}
          <div className="hidden lg:flex lg:col-span-5 relative bg-slate-950 overflow-hidden flex-col justify-between p-10 text-white">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
              alt="Multi-service professional care"
              className="absolute inset-0 w-full h-full object-cover opacity-25 filter brightness-75 scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-teal-950/80" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-teal-300 text-xs font-bold tracking-wide border border-white/15">
                <Clock size={13} className="text-teal-400" /> Virtual Queue
                Platform
              </span>
              <span className="text-xs font-semibold text-slate-400">
                Join 10k+ users
              </span>
            </div>

            <div className="relative z-10 space-y-6 my-auto">
              <div className="space-y-3">
                <h2 className="text-3xl font-black leading-tight text-white drop-shadow-md">
                  Experience appointment booking without the waiting room.
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed font-normal">
                  QueueLess lets you join virtual queues from home, book top
                  specialists across all industries, and manage customer flow
                  effortlessly.
                </p>
              </div>

              <div className="space-y-2.5 text-xs text-slate-200">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-400 shrink-0"
                  />
                  <span>Real-time SMS alerts when your ticket is next</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-400 shrink-0"
                  />
                  <span>
                    Free cancellation up to 2 hours before your session
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-emerald-400 shrink-0"
                  />
                  <span>
                    Verified clinics, auto shops & salons across Nigeria
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/15 space-y-2 shadow-2xl">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-white ml-1.5">
                    5.0 Customer Rating
                  </span>
                </div>
                <p className="text-xs text-slate-200 italic leading-snug">
                  "I took a queue ticket from home, grabbed breakfast down the
                  street, and walked into my appointment right on time!"
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] text-slate-400">
                  <span>Chidinma O., Victoria Island</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified Customer
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-teal-400" /> 100% Data
                Protection
              </span>
              <span>Lagos · Abuja · PH</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-4 text-center text-xs text-slate-400 border-t border-white/10 bg-slate-950/80 backdrop-blur-md">
        © 2026 QueueLess Inc. All rights reserved. Secure 256-bit SSL
        encryption.
      </footer>
    </div>
  );
}
