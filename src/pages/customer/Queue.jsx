import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import {
  Users,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Bell,
  ArrowRight,
  ShieldCheck,
  Phone,
  RefreshCw,
} from "lucide-react";

export default function Queue() {
  const [ahead, setAhead] = useState(2);
  const [wait, setWait] = useState(10);
  const [leftQueue, setLeftQueue] = useState(false);

  // Simulate queue progress
  useEffect(() => {
    const t = setInterval(() => {
      setAhead((a) => Math.max(0, a - (Math.random() > 0.7 ? 1 : 0)));
      setWait((w) => Math.max(0, w - 1));
    }, 8000);
    return () => clearInterval(t);
  }, []);

  const isYourTurn = ahead === 0;
  const isNext = ahead === 1;

  const statusText = isYourTurn
    ? "It’s your turn! Please proceed to the service counter."
    : isNext
      ? "You are next in line! Get ready to be called."
      : `${ahead} people ahead of you`;

  if (leftQueue) {
    return (
      <div className="min-h-screen bg-ink-50/50">
        <RoleNavbar />
        <main className="lg:ml-64 p-6 sm:p-12 max-w-xl mx-auto text-center py-20">
          <div className="w-16 h-16 rounded-3xl bg-ink-100 text-ink-500 mx-auto flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-black text-ink-900 mb-2">
            You Left the Queue
          </h2>
          <p className="text-sm text-ink-500 mb-6">
            Your ticket #004 has been canceled and your spot has been given to
            the next customer.
          </p>
          <Link
            to="/customer/explore"
            className="btn-primary inline-flex items-center gap-2"
          >
            Explore Other Businesses
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* ================= HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Live Virtual Queue
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight mt-1">
              Your Queue Status
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-ink-400 font-medium hidden sm:inline">
              Auto-updating every few seconds
            </span>
            <div className="p-2 rounded-xl bg-white border border-ink-100 shadow-xs text-ink-600">
              <RefreshCw
                size={16}
                className="animate-spin text-brand-600"
                style={{ animationDuration: "6s" }}
              />
            </div>
          </div>
        </div>

        {/* ================= TURN ALERT BANNER (WHEN AHEAD === 0) ================= */}
        {isYourTurn && (
          <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg animate-bounce-short">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <span className="text-xs font-black uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                  Ready For Service
                </span>
                <h2 className="text-2xl sm:text-3xl font-black mt-2">
                  Ticket #004 is Called! 🎉
                </h2>
                <p className="text-emerald-100 text-sm mt-1">
                  Please proceed to Station 2 at Glow Beauty Salon. Stylist
                  Sarah Johnson is waiting for you.
                </p>
              </div>
              <button
                onClick={() => setLeftQueue(true)}
                className="bg-white text-emerald-800 font-bold px-6 py-3 rounded-2xl text-sm shadow-md hover:bg-emerald-50 shrink-0"
              >
                I Am Here / Check In
              </button>
            </div>
          </div>
        )}

        {/* ================= 2-COLUMN MAIN DESKTOP GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: Digital Ticket, Progress & Venue */}
          <div className="lg:col-span-2 space-y-6">
            {/* DIGITAL QUEUE TICKET CARD */}
            <div className="card p-6 sm:p-10 border border-ink-100 bg-white shadow-sm flex flex-col items-center text-center relative overflow-hidden">
              <span className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                Your Assigned Ticket
              </span>

              {/* Big Ticket Number */}
              <div className="text-6xl sm:text-8xl font-black text-ink-950 tracking-tight my-2">
                #004
              </div>

              {/* Dynamic Status Pill */}
              <div
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold mt-2 shadow-xs transition-colors ${
                  isYourTurn
                    ? "bg-emerald-500 text-white"
                    : isNext
                      ? "bg-amber-500 text-white"
                      : "bg-brand-50 text-brand-700 border border-brand-100"
                }`}
              >
                {statusText}
              </div>

              {/* Milestone Progress Tracker */}
              <div className="w-full mt-10 pt-8 border-t border-ink-100">
                <p className="text-xs font-bold text-ink-400 uppercase tracking-wider mb-6 text-left">
                  Queue Journey
                </p>

                <div className="grid grid-cols-4 gap-2 relative">
                  {[
                    { label: "Joined Queue", done: true },
                    { label: "Moving Up", done: ahead <= 2 },
                    { label: "You are Next", done: ahead <= 1 },
                    { label: "Your Turn", done: ahead === 0 },
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center"
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                          step.done
                            ? "bg-brand-500 text-white shadow-xs scale-105"
                            : "bg-ink-100 text-ink-400"
                        }`}
                      >
                        {step.done ? <CheckCircle2 size={16} /> : idx + 1}
                      </div>
                      <span
                        className={`text-xs font-semibold ${
                          step.done ? "text-ink-900" : "text-ink-400"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* VENUE LOCATION & SUMMARY CARD */}
            <div className="card overflow-hidden border border-ink-100 bg-white shadow-sm flex flex-col sm:flex-row items-stretch">
              <div className="relative sm:w-48 h-36 sm:h-auto bg-ink-200 shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=600&q=80"
                  alt="Glow Beauty Salon"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-600">
                    <Sparkles size={13} /> Active Service Location
                  </div>
                  <h3 className="text-lg font-black text-ink-900 mt-1">
                    Glow Beauty Salon
                  </h3>
                  <p className="text-xs text-ink-500 flex items-center gap-1.5 mt-1">
                    <MapPin size={13} className="text-ink-400" /> 12 Adeola
                    Odeku St, Victoria Island, Lagos
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-ink-100 flex items-center justify-between text-xs">
                  <span className="text-ink-500 font-medium">
                    Service: <strong>Braiding & Care</strong>
                  </span>
                  <Link
                    to="/customer/org/org-1"
                    className="font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1"
                  >
                    View Salon <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Real-Time Stats & Action Controls */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* STATS OVERVIEW */}
            <div className="grid grid-cols-2 gap-4">
              <div className="card p-5 border border-ink-100 bg-white shadow-xs text-center">
                <div className="w-10 h-10 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center mb-2">
                  <Users size={20} />
                </div>
                <p className="text-3xl font-black text-ink-900">{ahead}</p>
                <p className="text-xs font-semibold text-ink-400 uppercase mt-0.5">
                  Ahead in Line
                </p>
              </div>

              <div className="card p-5 border border-ink-100 bg-white shadow-xs text-center">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center mb-2">
                  <Clock size={20} />
                </div>
                <p className="text-3xl font-black text-ink-900">{wait}m</p>
                <p className="text-xs font-semibold text-ink-400 uppercase mt-0.5">
                  Est. Wait Time
                </p>
              </div>
            </div>

            {/* CURRENTLY SERVING STATUS CARD */}
            <div className="card p-5 border border-ink-100 bg-white shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-ink-100">
                <span className="text-xs font-bold text-ink-400 uppercase tracking-wider">
                  Currently at Counter
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xl font-black text-ink-900">#003</h4>
                  <p className="text-xs text-ink-500">
                    In service with Sarah J.
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  In Progress
                </span>
              </div>
            </div>

            {/* SMS NOTIFICATION REMINDER */}
            <div className="rounded-2xl p-4 bg-brand-50/60 border border-brand-100 flex items-start gap-3">
              <Bell size={18} className="text-brand-600 shrink-0 mt-0.5" />
              <div className="text-xs text-ink-600 leading-relaxed">
                <strong className="text-ink-900 block font-bold mb-0.5">
                  Feel free to step out
                </strong>
                We will send you an automated text message when you are 1 person
                away from being called.
              </div>
            </div>

            {/* LEAVE QUEUE BUTTON */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setLeftQueue(true)}
                className="btn-danger w-full py-3 text-xs font-bold shadow-xs hover:bg-rose-700 transition"
              >
                Leave Queue & Cancel Ticket
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
