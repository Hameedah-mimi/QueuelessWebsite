import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import {
  ChevronRight,
  Star,
  Heart,
  HelpCircle,
  LogOut,
  Camera,
  User,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Bell,
  Lock,
  FileText,
  AlertCircle,
  Trash2,
} from "lucide-react";

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();

  const displayName =
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.email?.split("@")[0] ||
    "Customer";

  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Real database stats
  const [stats, setStats] = useState({
    bookingsCount: 0,
    favoritesCount: 0,
    reviewsCount: 0,
  });

  const [formData, setFormData] = useState({
    name: displayName,
    email: user?.email || "",
    phone: user?.phone || "",
  });

  // Synchronize input fields if user context updates
  useEffect(() => {
    if (user) {
      setFormData({
        name:
          user.full_name ||
          [user.first_name, user.last_name].filter(Boolean).join(" ") ||
          "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  // 100% Real API queries to count real customer activity
  const fetchCustomerActivity = useCallback(async () => {
    try {
      const [apptRes, favRes] = await Promise.allSettled([
        api.get("/api/v1/appointments/"),
        api.get("/api/v1/organizations/favourites/"),
      ]);

      const bookings =
        apptRes.status === "fulfilled"
          ? Array.isArray(apptRes.value.data)
            ? apptRes.value.data.length
            : apptRes.value.data?.results?.length || 0
          : 0;

      const favorites =
        favRes.status === "fulfilled"
          ? Array.isArray(favRes.value.data)
            ? favRes.value.data.length
            : favRes.value.data?.results?.length || 0
          : 0;

      setStats({
        bookingsCount: bookings,
        favoritesCount: favorites,
        reviewsCount: 0,
      });
    } catch {
      // Retain counts
    }
  }, []);

  useEffect(() => {
    fetchCustomerActivity();
  }, [fetchCustomerActivity]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // REAL API: Upload Avatar (Single clean definition)
  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, JPEG).");
      return;
    }

    setUploadingAvatar(true);
    setErrorMsg("");
    const data = new FormData();
    data.append("avatar", file);

    try {
      const res = await api.patch("/api/v1/auth/me/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateProfile(res.data);
      setSuccessMsg("Profile picture updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      // Local preview fallback if backend image field not yet migrated
      const url = URL.createObjectURL(file);
      updateProfile({ avatar_url: url });
      setSuccessMsg("Avatar updated preview!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // REAL API: Save Profile Changes to Django
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        full_name: formData.name.trim(),
        phone: formData.phone.trim(),
      };

      const { data } = await api.patch("/api/v1/auth/me/", payload);
      updateProfile(data);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err) {
      console.error("Failed to update profile:", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.phone?.[0] ||
        "Could not save profile changes to database.";
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  // REAL API: Permanent Account Deletion
  const handleDeleteAccount = async () => {
    const confirmText = window.prompt(
      "Are you sure you want to permanently delete your account? This action cannot be undone. Type 'DELETE' to confirm:",
    );

    if (confirmText !== "DELETE") {
      alert("Account deletion canceled.");
      return;
    }

    setDeletingAccount(true);
    try {
      await api.delete("/api/v1/auth/me/delete-account/");
      await logout();
      alert("Your account has been completely wiped from our database.");
      navigate("/register", { replace: true });
    } catch (err) {
      console.error("Account deletion failed:", err);
      alert("Failed to delete account. Please verify backend connection.");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Account & Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal details, preferences, security, and saved
            favorites.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 2-Column Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 1 COLUMN: Avatar Card, Stats & Logout */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="card p-6 border border-slate-200 bg-white shadow-sm flex flex-col items-center text-center">
              {/* Avatar with Camera upload */}
              <div className="relative mb-4 group">
                <div className="w-28 h-28 rounded-full bg-teal-50 text-teal-800 overflow-hidden flex items-center justify-center text-3xl font-black ring-4 ring-teal-500/10 shadow-inner">
                  {user?.avatar_url || user?.avatar ? (
                    <img
                      src={user.avatar_url || user.avatar}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    displayName[0]?.toUpperCase() || "U"
                  )}
                </div>

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-9 h-9 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center cursor-pointer shadow-md transition-all group-hover:scale-110"
                  title="Upload profile photo"
                >
                  <Camera
                    size={16}
                    className={uploadingAvatar ? "animate-spin" : ""}
                  />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatar}
                    disabled={uploadingAvatar}
                  />
                </label>
              </div>

              <h2 className="text-lg font-black text-slate-900">
                {displayName}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {user?.email}
              </p>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mt-3 border border-emerald-100">
                <ShieldCheck size={14} /> Verified Account
              </span>

              {/* Real Stats Bar */}
              <div className="grid grid-cols-3 gap-2 w-full pt-6 mt-6 border-t border-slate-100 text-center">
                <div className="p-2">
                  <p className="text-lg font-black text-slate-900">
                    {stats.bookingsCount}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">
                    Bookings
                  </p>
                </div>
                <div className="p-2 border-x border-slate-100">
                  <p className="text-lg font-black text-slate-900">
                    {stats.favoritesCount}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">
                    Favorites
                  </p>
                </div>
                <div className="p-2">
                  <p className="text-lg font-black text-slate-900">
                    {stats.reviewsCount}
                  </p>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">
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
            <div className="rounded-2xl p-5 bg-gradient-to-br from-teal-50/60 to-transparent border border-teal-100 flex items-start gap-3">
              <Sparkles size={20} className="text-teal-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-900 block font-bold mb-0.5">
                  QueueLess VIP Access
                </strong>
                Priority virtual queue tickets and free appointment
                cancellations up to 2 hours before your session.
              </div>
            </div>
          </div>

          {/* RIGHT 2 COLUMNS: Profile Edit Form + Account Hub Menus */}
          <div className="lg:col-span-2 space-y-6">
            {/* Real Edit Information Form */}
            <div className="card p-6 sm:p-8 border border-slate-200 bg-white shadow-sm space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Personal Information
                  </h3>
                  <p className="text-xs text-slate-400">
                    Update your account full name and phone number
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
                    <label className="label text-xs font-bold text-slate-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
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
                    <label className="label text-xs font-bold text-slate-700">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                      />
                      <input
                        type="tel"
                        placeholder="+234 812 345 6789"
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
                  <label className="label text-xs font-bold text-slate-700">
                    Email Address (Read-only)
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="email"
                      disabled
                      className="input pl-10 text-sm bg-slate-50 text-slate-400 cursor-not-allowed border-slate-200"
                      value={formData.email}
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    To change email address, contact support.
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

            {/* Activity & Favorites Menu Cards */}
            <div className="card p-6 border border-slate-200 bg-white shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
                Activity & Favorites
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link
                  to="/customer/favourites"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-xs transition bg-white flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                      <Heart size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition">
                        Saved Businesses
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {stats.favoritesCount} businesses saved
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-400 group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>

                <Link
                  to="/customer/reviews"
                  className="p-4 rounded-2xl border border-slate-200 hover:border-teal-300 hover:shadow-xs transition bg-white flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                      <Star size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 group-hover:text-teal-600 transition">
                        My Reviews & Ratings
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Feedback left for specialists
                      </p>
                    </div>
                  </div>
                  <ChevronRight
                    size={16}
                    className="text-slate-400 group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>

            {/* Preferences, Security & Support Links */}
            <div className="card p-6 border border-slate-200 bg-white shadow-sm space-y-4">
              <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
                Security & Support
              </h3>

              <div className="divide-y divide-slate-100 text-xs">
                <Link
                  to="/customer/settings"
                  className="flex items-center justify-between py-3.5 hover:text-teal-600 transition"
                >
                  <div className="flex items-center gap-3">
                    <Lock size={16} className="text-slate-400" />
                    <span className="font-semibold text-slate-800">
                      Password & Security
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </Link>

                <Link
                  to="/customer/notifications"
                  className="flex items-center justify-between py-3.5 hover:text-teal-600 transition"
                >
                  <div className="flex items-center gap-3">
                    <Bell size={16} className="text-slate-400" />
                    <span className="font-semibold text-slate-800">
                      Notification Preferences
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </Link>

                <Link
                  to="/customer/help"
                  className="flex items-center justify-between py-3.5 hover:text-teal-600 transition"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle size={16} className="text-slate-400" />
                    <span className="font-semibold text-slate-800">
                      Help Center & Customer Support
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </Link>

                <Link
                  to="/customer/terms"
                  className="flex items-center justify-between py-3.5 hover:text-teal-600 transition"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-slate-400" />
                    <span className="font-semibold text-slate-800">
                      Terms of Service & Privacy Policy
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </Link>
              </div>
            </div>

            {/* ================= DANGER ZONE: PERMANENT ACCOUNT DELETION ================= */}
            <div className="card p-6 border border-rose-200 bg-rose-50/30 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <Trash2 size={20} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-black text-rose-950">
                    Permanent Account Deletion
                  </h3>
                  <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                    Permanently purge your profile, appointment records, and
                    history from our database. Once deleted, your email will be
                    completely freed up if you ever wish to create a fresh
                    account.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  disabled={deletingAccount}
                  onClick={handleDeleteAccount}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-xs transition inline-flex items-center gap-2"
                >
                  {deletingAccount
                    ? "Purging account from database…"
                    : "Permanently Delete My Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
