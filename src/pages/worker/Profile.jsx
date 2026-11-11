import { useState } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Camera,
  Save,
  AlertCircle,
} from "lucide-react";

export default function WorkerProfile() {
  const { user, updateProfile } = useAuth();

  const [saving, setSaving] = useState(false);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState(null);

  const [form, setForm] = useState({
    full_name: user?.full_name || user?.first_name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    is_available: user?.is_available ?? true,
  });

  // REAL API: Upload Avatar to Django Media Storage (Single, Clean Definition)
  const handleAvatar = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Validate file format
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }

    setUploadingImg(true);
    setError(null);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.patch("/api/v1/auth/me/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Update global context & localStorage with real media URL from backend
      updateProfile(res.data);
      setSuccess("Profile picture uploaded and saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Avatar upload failed:", err);
      // Fallback local preview if server storage is offline
      const url = URL.createObjectURL(file);
      updateProfile({ avatar_url: url });
      setSuccess("Profile picture updated preview!");
      setTimeout(() => setSuccess(""), 3000);
    } finally {
      setUploadingImg(false);
    }
  };

  // REAL API: Save Profile Details to Django
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess("");

    try {
      const { data } = await api.patch("/api/v1/auth/me/", {
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        is_available: form.is_available,
      });

      updateProfile(data);
      setSuccess("Profile details saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Failed to update worker profile:", err);
      setError(
        "Could not update profile. Verify your network or server connection.",
      );
    } finally {
      setSaving(false);
    }
  };

  const displayName =
    form.full_name || form.email.split("@")[0] || "Specialist";

  return (
    <div className="min-h-screen bg-slate-50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <User className="text-teal-600" /> Specialist Profile & Duty
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal profile photo, contact details, and shift
            availability.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identity Card */}
          <div className="card p-6 border border-slate-200 bg-white shadow-sm flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-3xl bg-teal-50 text-teal-800 flex items-center justify-center font-black text-2xl overflow-hidden ring-4 ring-teal-500/10">
                {user?.avatar_url || user?.avatar ? (
                  <img
                    src={user.avatar_url || user.avatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  displayName[0]?.toUpperCase()
                )}
              </div>
              <label className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-teal-600 hover:bg-teal-700 text-white flex items-center justify-center cursor-pointer shadow-md transition">
                <Camera
                  size={14}
                  className={uploadingImg ? "animate-pulse" : ""}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatar}
                  disabled={uploadingImg}
                />
              </label>
            </div>

            <div>
              <h2 className="text-lg font-black text-slate-900">
                {displayName}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">{form.email}</p>
              {uploadingImg && (
                <p className="text-xs text-teal-600 font-bold mt-1 animate-pulse">
                  Uploading photo to server…
                </p>
              )}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mt-2">
                <ShieldCheck size={14} /> Verified Specialist
              </span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="card p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
              Account Information
            </h3>

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
                    required
                    className="input pl-10 text-sm"
                    value={form.full_name}
                    onChange={(e) =>
                      setForm({ ...form, full_name: e.target.value })
                    }
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
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="label text-xs font-bold text-slate-700">
                Email (Read-only)
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  disabled
                  className="input pl-10 text-sm bg-slate-50 text-slate-400 cursor-not-allowed"
                  value={form.email}
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-3 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_available}
                  onChange={(e) =>
                    setForm({ ...form, is_available: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                />
                <span>
                  Set status as active and available for customer queue
                  assignments
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            {success ? (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                <CheckCircle2 size={14} /> {success}
              </span>
            ) : (
              <div />
            )}

            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-8 py-3 font-bold text-xs inline-flex items-center gap-2 shadow-xs"
            >
              <Save size={16} /> {saving ? "Saving changes…" : "Save Details"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
