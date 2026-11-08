import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import { useAuth } from "../../context/AuthContext";
import {
  ChevronRight,
  Star,
  Heart,
  Settings,
  HelpCircle,
  LogOut,
  Camera,
  User,
  Mail,
  Phone,
  ShieldCheck,
  CalendarCheck,
  Sparkles,
  Bell,
  Lock,
  FileText,
} from "lucide-react";

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Extract display name cleanly whether stored as full_name or first/last
  const displayName =
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "Customer";

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({
    name: displayName,
    email: user?.email || "",
    phone: user?.phone || "+234 812 345 6789",
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateProfile({ avatar_url: url });
  };

  const handleSaveDetails = (e) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateProfile({ full_name: formData.name, phone: formData.phone });
      setSaving(false);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* ================= PAGE HEADER ================= */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
            Account & Profile
          </h1>
          <p className="text-sm text-ink-500 mt-1">
            Manage your personal details, preferences, security and saved
            favorites.
          </p>
        </div>

        {/* ================= 2-COLUMN DESKTOP GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 1 COLUMN: Avatar Card, Stats & Logout */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* Identity Card */}
            <div className="card p-6 border border-ink-100 bg-white shadow-sm flex flex-col items-center text-center">
              {/* Avatar with Camera upload */}
              <div className="relative mb-4 group">
                <div className="w-28 h-28 rounded-full bg-brand-100 overflow-hidden flex items-center justify-center text-3xl font-black text-brand-700 ring-4 ring-brand-500/10 shadow-inner">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    displayName[0]?.toUpperCase() || "U"
                  )}
                </div>

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center cursor-pointer shadow-md transition-all group-hover:scale-110"
                  title="Upload profile photo"
                >
                  <Camera size={16} />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatar}
                  />
                </label>
              </div>

              <h2 className="text-lg font-black text-ink-900">{displayName}</h2>
              <p className="text-xs text-ink-400 font-medium mt-0.5">
                {user?.email}
              </p>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mt-3 border border-emerald-100">
                <ShieldCheck size={14} /> Verified Customer
              </span>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 w-full pt-6 mt-6 border-t border-ink-100 text-center">
                <div className="p-2">
                  <p className="text-lg font-black text-ink-900">4</p>
                  <p className="text-[11px] font-semibold text-ink-400 uppercase">
                    Bookings
                  </p>
                </div>
                <div className="p-2 border-x border-ink-100">
                  <p className="text-lg font-black text-ink-900">2</p>
                  <p className="text-[11px] font-semibold text-ink-400 uppercase">
                    Favorites
                  </p>
                </div>
                <div className="p-2">
                  <p className="text-lg font-black text-ink-900">3</p>
                  <p className="text-[11px] font-semibold text-ink-400 uppercase">
                    Reviews
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="btn-danger w-full mt-6 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-2"
              >
                <LogOut size={15} /> Log out of QueueLess
              </button>
            </div>

            {/* QueueLess Member Badge */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-brand-50/60 to-transparent border border-brand-100 flex items-start gap-3">
              <Sparkles size={20} className="text-brand-600 shrink-0 mt-0.5" />
              <div className="text-xs text-ink-600 leading-relaxed">
                <strong className="text-ink-900 block font-bold mb-0.5">
                  QueueLess VIP Member
                </strong>
                You have access to priority virtual queue ticketing and free
                appointment cancellations up to 2 hours before schedule.
              </div>
            </div>
          </div>

          {/* RIGHT 2 COLUMNS: Profile Edit Form + Account Hub Menus */}
          <div className="lg:col-span-2 space-y-6">
            {/* EDIT BASIC INFORMATION FORM */}
            <div className="card p-6 sm:p-8 border border-ink-100 bg-white shadow-sm space-y-5">
              <div className="pb-3 border-b border-ink-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-ink-900">
                    Personal Information
                  </h3>
                  <p className="text-xs text-ink-400">
                    Update your account name and contact number
                  </p>
                </div>
                {successMsg && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-fade-in">
                    {successMsg}
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveDetails} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label text-xs font-bold text-ink-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                      />
                      <input
                        type="text"
                        className="input pl-10 text-sm"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-ink-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                      />
                      <input
                        type="tel"
                        className="input pl-10 text-sm"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label text-xs font-bold text-ink-700">
                    Email Address (Read-only)
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400"
                    />
                    <input
                      type="email"
                      disabled
                      className="input pl-10 text-sm bg-ink-50 text-ink-500 cursor-not-allowed border-ink-200"
                      value={formData.email}
                    />
                  </div>
                  <p className="text-[11px] text-ink-400 mt-1">
                    To change email, contact security support.
                  </p>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="btn-primary text-xs px-6 py-2.5 font-bold shadow-xs"
                  >
                    {saving ? "Saving changes…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* ACTIVITY & ENGAGEMENT MENU CARDS */}
            <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-4">
              <h3 className="text-sm font-black text-ink-900 pb-2 border-b border-ink-100">
                Activity & Favorites
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/customer/favourites"
                  className="p-4 rounded-2xl border border-ink-100 hover:border-brand-200 hover:shadow-xs transition bg-white flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <Heart size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink-900 group-hover:text-brand-600 transition">
                        Saved Salons & Spas
                      </p>
                      <p className="text-[11px] text-ink-400">
                        View favorite businesses
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-ink-400 group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>

                <Link
                  to="/customer/reviews"
                  className="p-4 rounded-2xl border border-ink-100 hover:border-brand-200 hover:shadow-xs transition bg-white flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Star size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-ink-900 group-hover:text-brand-600 transition">
                        My Reviews & Ratings
                      </p>
                      <p className="text-[11px] text-ink-400">
                        Feedback left for specialists
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-ink-400 group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {/* PREFERENCES, SECURITY & SUPPORT */}
            <div className="card p-6 border border-ink-100 bg-white shadow-sm space-y-4">
              <h3 className="text-sm font-black text-ink-900 pb-2 border-b border-ink-100">
                Security & Support
              </h3>

              <div className="divide-y divide-ink-100 text-xs">
                <Link
                  to="/customer/settings"
                  className="flex items-center justify-between py-3.5 hover:text-brand-600 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Lock
                      size={16}
                      className="text-ink-400 group-hover:text-brand-600"
                    />
                    <span className="font-semibold text-ink-800 group-hover:text-brand-600">
                      Password & Security
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-ink-300" />
                </Link>

                <Link
                  to="/customer/notifications"
                  className="flex items-center justify-between py-3.5 hover:text-brand-600 transition group"
                >
                  <div className="flex items-center gap-3">
                    <Bell
                      size={16}
                      className="text-ink-400 group-hover:text-brand-600"
                    />
                    <span className="font-semibold text-ink-800 group-hover:text-brand-600">
                      Notification Preferences
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-ink-300" />
                </Link>

                <Link
                  to="/customer/help"
                  className="flex items-center justify-between py-3.5 hover:text-brand-600 transition group"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle
                      size={16}
                      className="text-ink-400 group-hover:text-brand-600"
                    />
                    <span className="font-semibold text-ink-800 group-hover:text-brand-600">
                      Help Center & Customer Support
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-ink-300" />
                </Link>

                <Link
                  to="/customer/terms"
                  className="flex items-center justify-between py-3.5 hover:text-brand-600 transition group"
                >
                  <div className="flex items-center gap-3">
                    <FileText
                      size={16}
                      className="text-ink-400 group-hover:text-brand-600"
                    />
                    <span className="font-semibold text-ink-800 group-hover:text-brand-600">
                      Terms of Service & Privacy Policy
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-ink-300" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
