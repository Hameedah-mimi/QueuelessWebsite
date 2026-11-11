import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  ChevronLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  AlertCircle,
  XCircle,
  CheckCircle2,
  Banknote,
  X,
  Phone,
  Sparkles,
} from "lucide-react";

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apt, setApt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rescheduleError, setRescheduleError] = useState(null);

  // Reschedule Modal States
  const [showReschedule, setShowReschedule] = useState(false);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  // 100% Real API fetch
  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/v1/appointments/${id}/`);
      const d = res.data;
      setApt({
        id: d.id,
        service:
          d.service_name ||
          d.service?.name ||
          d.service ||
          "Specialized Service",
        org:
          d.organization_name ||
          d.organization?.name ||
          d.org ||
          "Service Center",
        orgId: d.organization?.id || d.org_id || null,
        worker: d.worker_name || d.worker?.full_name || "Assigned Specialist",
        workerId: d.worker?.id || d.worker || null,
        date: d.date || d.scheduled_date || "Today",
        time: d.time || d.scheduled_time || "10:00 AM",
        duration: d.duration || d.service?.duration || 45,
        price: parseFloat(d.price || d.service?.price || d.total_amount || 0),
        status: (d.status || "pending").toLowerCase(),
        payment_method: d.payment_method || "pay_at_venue",
        payment_status:
          d.payment_status ||
          (d.status === "completed" ? "paid" : "due_on_arrival"),
        location: d.organization?.location || "Lagos, Nigeria",
        phone: d.organization?.phone || "+234 812 345 6789",
        image: d.organization?.image || null,
      });
      setNewDate(d.date || d.scheduled_date || "");
      setNewTime(d.time || d.scheduled_time || "");
    } catch (err) {
      console.error("Failed to load appointment:", err);
      setError("Could not retrieve appointment details from server.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // REAL API: Cancel Appointment (Free Cancellation up to 2h)
  // In src/pages/customer/AppointmentDetail.jsx, replace handleCancel with:

  const isWithinTwoHours = () => {
    if (!apt?.date || !apt?.time) return false;

    try {
      // Construct appointment timestamp
      const apptDateTime = new Date(`${apt.date} ${apt.time}`);
      if (isNaN(apptDateTime.getTime())) return false;

      const now = new Date();
      const diffMs = apptDateTime.getTime() - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // Return true if appointment is in the past OR less than 2 hours away
      return diffHours < 2;
    } catch {
      return false;
    }
  };

  const handleCancel = async () => {
    // 1. Guard check: Must be at least 2 hours in advance
    if (isWithinTwoHours()) {
      alert(
        "Cancellation is not permitted within 2 hours of your scheduled appointment time. Please call the venue directly.",
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to cancel this reservation? Free cancellation is allowed since you are more than 2 hours in advance.",
    );
    if (!confirmed) return;

    setActionLoading(true);
    try {
      await api.patch(`/api/v1/appointments/${id}/`, { status: "cancelled" });
      setApt((prev) => ({ ...prev, status: "cancelled" }));
      alert("Your appointment has been cancelled.");
    } catch (err) {
      console.error("Cancel failed:", err);
      const msg =
        err.response?.data?.detail ||
        "Appointments cannot be cancelled within 2 hours of the scheduled start time.";
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  // REAL API: Reschedule with Double-Booking Prevention Guard
  const handleReschedule = async (e) => {
    e.preventDefault();
    if (!newDate || !newTime) return;

    setActionLoading(true);
    setRescheduleError(null);

    try {
      await api.patch(`/api/v1/appointments/${id}/`, {
        date: newDate,
        time: newTime,
        status: "confirmed",
      });
      setApt((prev) => ({
        ...prev,
        date: newDate,
        time: newTime,
        status: "confirmed",
      }));
      setShowReschedule(false);
      alert("Appointment rescheduled successfully!");
    } catch (err) {
      console.error("Reschedule failed:", err);
      // Check if backend rejected due to double booking conflict
      const conflictMsg =
        err.response?.data?.time?.[0] ||
        err.response?.data?.detail ||
        "This specialist is already booked for this slot. Please select another time.";
      setRescheduleError(conflictMsg);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-xs text-slate-400">
        Loading appointment details from database…
      </div>
    );
  }

  if (error || !apt) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center space-y-4">
        <AlertCircle size={32} className="text-amber-600" />
        <h2 className="text-lg font-bold text-slate-900">
          Appointment Not Found
        </h2>
        <p className="text-xs text-slate-500">
          {error || "This booking does not exist in the database."}
        </p>
        <button
          onClick={() => navigate("/customer/appointments")}
          className="btn-primary text-xs px-4 py-2"
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  const isCancelled = apt.status === "cancelled";
  const isCompleted = apt.status === "completed";

  return (
    <div className="min-h-screen bg-slate-50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        {/* Header Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => navigate("/customer/appointments")}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition"
          >
            <ChevronLeft size={18} /> Back to my appointments
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Booking Ref:
            </span>
            <span className="font-mono text-xs font-bold px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-800">
              #{String(apt.id).slice(0, 8)}
            </span>
          </div>
        </div>

        {/* Reschedule Modal with Conflict Prevention */}
        {showReschedule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <div className="card p-6 border-2 border-teal-500 bg-white shadow-2xl space-y-4 max-w-md w-full animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Calendar size={16} className="text-teal-600" /> Reschedule
                  Appointment
                </h3>
                <button
                  onClick={() => setShowReschedule(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              </div>

              {rescheduleError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold leading-relaxed flex items-start gap-2">
                  <AlertCircle
                    size={15}
                    className="text-rose-600 shrink-0 mt-0.5"
                  />
                  <span>{rescheduleError}</span>
                </div>
              )}

              <form onSubmit={handleReschedule} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select New Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Select New Time
                  </label>
                  <input
                    type="time"
                    required
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Our system verifies specialist availability instantly.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowReschedule(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-xs"
                  >
                    {actionLoading ? "Verifying…" : "Confirm New Time"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 2 COLUMNS: Visual Header & Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6 border border-slate-200 bg-white shadow-sm space-y-6">
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                    {apt.service}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                    {apt.org}
                  </h1>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1.5">
                    <MapPin size={14} className="text-teal-600" />{" "}
                    {apt.location}
                  </p>
                </div>

                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    isCancelled
                      ? "bg-rose-50 text-rose-700"
                      : isCompleted
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-teal-50 text-teal-700"
                  }`}
                >
                  ● {apt.status}
                </span>
              </div>

              {/* 3 Metric Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">
                    Assigned Specialist
                  </span>
                  <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <User size={14} className="text-teal-600" /> {apt.worker}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">
                    Scheduled Time
                  </span>
                  <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <Clock size={14} className="text-teal-600" /> {apt.date} ·{" "}
                    {apt.time}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 uppercase text-[10px] font-bold">
                    Estimated Session
                  </span>
                  <p className="font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-teal-600" />{" "}
                    {apt.duration} Minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Preparation & Policy Banner */}
            <div className="card p-5 border border-slate-200 bg-white shadow-xs flex items-start gap-3">
              <ShieldCheck
                size={20}
                className="text-teal-600 shrink-0 mt-0.5"
              />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 block font-bold mb-0.5">
                  Free Cancellation Policy
                </strong>
                You can reschedule or cancel this reservation without penalty up
                to 2 hours before your appointment. Please arrive 10 minutes
                prior to {apt.time}.
              </div>
            </div>
          </div>

          {/* RIGHT 1 COLUMN: Pay-at-Venue Summary & Controls */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="card p-6 border border-slate-200 bg-white shadow-sm space-y-5">
              <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
                Payment Details
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Payment Method</span>
                  <strong className="text-slate-900 flex items-center gap-1">
                    <Banknote size={14} className="text-emerald-600" /> Pay at
                    Venue
                  </strong>
                </div>

                <div className="flex justify-between text-slate-600">
                  <span>Payment Status</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${
                      isCompleted
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {isCompleted ? "Paid at Venue" : "Due Upon Arrival"}
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">
                    Total Fee
                  </span>
                  <span className="text-2xl font-black text-teal-600">
                    {formatNaira(apt.price)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              {!isCancelled && !isCompleted && (
                <div className="space-y-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowReschedule(true)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                  >
                    Reschedule Appointment
                  </button>
                  <button
                    type="button"
                    disabled={actionLoading || isWithinTwoHours()}
                    onClick={handleCancel}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition ${
                      isWithinTwoHours()
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                        : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                    }`}
                    title={
                      isWithinTwoHours()
                        ? "Cancellations locked within 2 hours of appointment"
                        : "Cancel Reservation"
                    }
                  >
                    {actionLoading
                      ? "Cancelling…"
                      : isWithinTwoHours()
                        ? "Cancellation Locked (< 2 Hours)"
                        : "Cancel Reservation (Free)"}
                  </button>
                </div>
              )}
            </div>

            {/* Direct Contact Venue */}
            <div className="card p-4 border border-slate-200 bg-white shadow-xs flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-slate-900">{apt.org}</p>
                <p className="text-slate-400">{apt.phone}</p>
              </div>
              <a
                href={`tel:${apt.phone}`}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
              >
                Call
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
