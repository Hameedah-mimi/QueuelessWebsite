import { useState, useEffect, useCallback } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  ChevronLeft,
  Calendar,
  Clock,
  Sparkles,
  MapPin,
  CheckCircle2,
  Check,
  ArrowRight,
  AlertCircle,
  Banknote,
  ShieldCheck,
} from "lucide-react";

// Standard working hours schedule
const ALL_TIME_SLOTS = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export default function BookFlow() {
  const { orgId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const serviceIdParam = params.get("service");

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Real database states
  const [org, setOrg] = useState(null);
  const [services, setServices] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [existingBookings, setExistingBookings] = useState([]);

  // User Selections
  const [selectedServiceId, setSelectedServiceId] = useState(
    serviceIdParam || null,
  );
  const [selectedWorkerId, setSelectedWorkerId] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("");

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  // Fetch Organization, Services, and Workers
  useEffect(() => {
    async function initBooking() {
      setLoading(true);
      try {
        const [orgRes, svcRes, wrkRes] = await Promise.allSettled([
          api.get(`/api/v1/organizations/${orgId}/`),
          api.get("/api/v1/services/"),
          api.get("/api/v1/auth/users/?role=worker"),
        ]);

        if (orgRes.status === "fulfilled") setOrg(orgRes.value.data);
        if (svcRes.status === "fulfilled") {
          const list = Array.isArray(svcRes.value.data)
            ? svcRes.value.data
            : svcRes.value.data?.results || [];
          setServices(list);
          if (!selectedServiceId && list.length > 0)
            setSelectedServiceId(list[0].id);
        }
        if (wrkRes.status === "fulfilled") {
          const wrkList = Array.isArray(wrkRes.value.data)
            ? wrkRes.value.data
            : wrkRes.value.data?.results || [];
          setWorkers(wrkList);
          if (wrkList.length > 0) setSelectedWorkerId(wrkList[0].id);
        }
      } catch (err) {
        console.error("Error loading booking data:", err);
        setError("Could not load booking choices from server.");
      } finally {
        setLoading(false);
      }
    }
    initBooking();
  }, [orgId]);

  // REAL API: Check existing bookings for selected worker and date to PREVENT OVERLAPPING
  const checkWorkerAvailability = useCallback(async () => {
    if (!selectedWorkerId || !date) return;

    try {
      const res = await api.get("/api/v1/appointments/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];

      // Identify active bookings for this specialist on the selected date
      const bookedTimes = raw
        .filter((b) => {
          const isSameWorker =
            String(b.worker?.id || b.worker) === String(selectedWorkerId);
          const isSameDate =
            String(b.date || b.scheduled_date) === String(date);
          const isActive = b.status !== "cancelled";
          return isSameWorker && isSameDate && isActive;
        })
        .map((b) => (b.time || b.scheduled_time || "").trim());

      setExistingBookings(bookedTimes);
    } catch {
      setExistingBookings([]);
    }
  }, [selectedWorkerId, date]);

  useEffect(() => {
    checkWorkerAvailability();
  }, [checkWorkerAvailability]);

  const selectedService =
    services.find((s) => s.id === selectedServiceId) || services[0];
  const selectedWorker =
    workers.find((w) => w.id === selectedWorkerId) || workers[0];

  // REAL API: Submit Booking with conflict protection
  const handleConfirmBooking = async () => {
    if (!time) {
      alert("Please select an available time slot.");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        organization: orgId,
        service: selectedService?.id,
        service_name: selectedService?.name,
        worker: selectedWorker?.id,
        worker_name: selectedWorker?.full_name || selectedWorker?.email,
        date: date,
        time: time,
        price: selectedService?.price || 0,
        status: "confirmed",
        payment_method: "pay_at_venue",
        payment_status: "pending",
      };

      await api.post("/api/v1/appointments/", payload);
      setStep(3);
    } catch (err) {
      console.error("Booking post failed:", err);
      const detail =
        err.response?.data?.time?.[0] ||
        err.response?.data?.detail ||
        "This slot was just taken by another client. Please pick another available time.";
      setError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  const next = () => setStep((s) => s + 1);
  const back = () => {
    if (step === 0) navigate(-1);
    else setStep((s) => s - 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-12 text-xs text-slate-400">
        Loading booking calendar from server…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={back}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition"
          >
            <ChevronLeft size={16} /> Back
          </button>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* STEP 3: BOOKING CONFIRMED SCREEN */}
        {step === 3 ? (
          <div className="max-w-xl mx-auto text-center py-10 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 size={36} />
            </div>
            <h1 className="text-3xl font-black text-slate-900">
              Booking Confirmed!
            </h1>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your appointment is locked in with zero overlapping. You pay
              in-person upon arrival.
            </p>

            <div className="card p-6 border border-slate-200 bg-white shadow-sm text-left text-xs space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <p className="font-bold text-slate-900 text-sm">
                    {selectedService?.name}
                  </p>
                  <p className="text-slate-500">
                    Specialist: {selectedWorker?.full_name || "Assigned Staff"}
                  </p>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700">
                  Confirmed
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] font-bold">
                    Scheduled Slot
                  </span>
                  <p className="font-bold text-slate-900">
                    {date} at {time}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] font-bold">
                    Payment Method
                  </span>
                  <p className="font-bold text-emerald-700 flex items-center gap-1">
                    <Banknote size={14} /> Pay at Venue
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-slate-500">Amount Due Upon Arrival</span>
                <span className="text-xl font-black text-teal-600">
                  {formatNaira(selectedService?.price)}
                </span>
              </div>
            </div>

            <div className="flex gap-2 justify-center pt-2">
              <Link
                to="/customer/appointments"
                className="btn-primary text-xs px-5 py-2.5 font-bold"
              >
                My Appointments
              </Link>
              <Link
                to="/customer"
                className="btn-secondary text-xs px-5 py-2.5 font-bold"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          /* STEPS 0, 1, 2 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              {/* Step 0: Choose Specialist */}
              {step === 0 && (
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-900">
                      Choose Specialist
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select your preferred professional.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {workers.map((w) => (
                      <div
                        key={w.id}
                        onClick={() => setSelectedWorkerId(w.id)}
                        className={`card p-5 border cursor-pointer transition ${
                          selectedWorkerId === w.id
                            ? "border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20"
                            : "border-slate-200 bg-white hover:border-teal-300"
                        }`}
                      >
                        <p className="font-bold text-slate-900 text-sm">
                          {w.full_name || w.email}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Specialist · Available for Bookings
                        </p>
                      </div>
                    ))}
                    {workers.length === 0 && (
                      <div className="col-span-full card p-8 text-center text-xs text-slate-400">
                        Any available specialist will attend to you upon
                        arrival.
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      onClick={next}
                      className="btn-primary text-xs px-6 py-2.5 font-bold"
                    >
                      Next: Choose Available Slot{" "}
                      <ArrowRight size={14} className="inline ml-1" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 1: Only Available Slots (Prevents Overlapping) */}
              {step === 1 && (
                <div className="card p-6 border border-slate-200 bg-white shadow-sm space-y-5">
                  <div>
                    <h2 className="text-lg font-black text-slate-900">
                      Select Date & Available Time
                    </h2>
                    <p className="text-xs text-slate-500">
                      Conflicting slots are automatically locked out to prevent
                      double booking.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Appointment Date
                    </label>
                    <input
                      type="date"
                      required
                      min={new Date().toISOString().split("T")[0]}
                      value={date}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setTime(""); // reset time selection when date changes
                      }}
                      className="w-full sm:w-64 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                    />
                  </div>

                  {/* Dynamic Time Slot Grid */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">
                      Available Time Slots on {date}
                    </label>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      {ALL_TIME_SLOTS.map((slot) => {
                        const isBooked = existingBookings.includes(slot);
                        const isSelected = time === slot;

                        return (
                          <button
                            key={slot}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setTime(slot)}
                            className={`p-3 rounded-xl text-xs font-bold transition flex flex-col items-center justify-center border ${
                              isBooked
                                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60"
                                : isSelected
                                  ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                                  : "bg-white border-slate-200 text-slate-800 hover:border-teal-400 hover:bg-slate-50"
                            }`}
                          >
                            <span>{slot}</span>
                            <span className="text-[10px] mt-0.5 font-normal">
                              {isBooked
                                ? "Booked"
                                : isSelected
                                  ? "Selected"
                                  : "Free"}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      onClick={back}
                      className="text-xs font-bold text-slate-500"
                    >
                      Back
                    </button>
                    <button
                      onClick={next}
                      disabled={!date || !time}
                      className="btn-primary text-xs px-6 py-2.5 font-bold"
                    >
                      Next: Review
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Final Review */}
              {step === 2 && (
                <div className="card p-6 border border-slate-200 bg-white shadow-sm space-y-5">
                  <h2 className="text-lg font-black text-slate-900">
                    Review Booking Details
                  </h2>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Service</span>
                      <strong className="text-slate-900">
                        {selectedService?.name}
                      </strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Specialist</span>
                      <strong className="text-slate-900">
                        {selectedWorker?.full_name || "Assigned Staff"}
                      </strong>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-100">
                      <span className="text-slate-500">Reserved Slot</span>
                      <strong className="text-slate-900">
                        {date} at {time}
                      </strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                    <Banknote
                      size={20}
                      className="text-emerald-600 shrink-0 mt-0.5"
                    />
                    <div className="text-xs text-emerald-900 leading-relaxed">
                      <strong className="block font-bold">
                        Pay At The Venue
                      </strong>
                      Payment will be collected directly upon your arrival via
                      POS, Cash, or Transfer.
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <button
                      onClick={back}
                      className="text-xs font-bold text-slate-500"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      disabled={submitting}
                      className="btn-primary text-xs px-6 py-2.5 font-bold"
                    >
                      {submitting ? "Locking in slot…" : "Confirm Reservation"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar Sticky Summary */}
            <div className="card p-6 border border-slate-200 bg-white shadow-sm space-y-4 lg:sticky lg:top-8">
              <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
                Summary
              </h3>

              <div>
                <p className="text-base font-bold text-slate-900">
                  {selectedService?.name || "Service"}
                </p>
                <p className="text-xs text-slate-400">
                  Duration: {selectedService?.duration || 45} mins
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Service Total</span>
                  <span className="font-bold text-slate-900">
                    {formatNaira(selectedService?.price)}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Online Fee</span>
                  <span className="font-bold text-emerald-600 font-mono">
                    ₦0.00
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900">Due at Venue</span>
                  <span className="text-xl font-black text-teal-600">
                    {formatNaira(selectedService?.price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
