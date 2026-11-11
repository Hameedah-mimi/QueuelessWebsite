import { useState, useEffect, useCallback } from "react";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  Scissors,
  Plus,
  Trash2,
  Clock,
  CheckCircle2,
  X,
  AlertCircle,
  RefreshCw,
  Image as ImageIcon,
  Upload,
} from "lucide-react";

export default function OrgServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Service Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Hair");
  const [duration, setDuration] = useState(45);
  const [price, setPrice] = useState(10000);
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const formatNaira = (amt) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(amt || 0);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/v1/services/");
      const raw = Array.isArray(res.data) ? res.data : res.data?.results || [];
      setServices(raw);
    } catch (err) {
      console.warn("Failed to load services from backend:", err);
      setError("Could not load service menu from server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please upload a valid image file.");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // REAL API: Save Service with REQUIRED Image
  const handleAdd = async (e) => {
    e.preventDefault();

    // 1. Strict validation: Image is required
    if (!imageFile) {
      alert(
        "Service photo is required! Please choose a high-quality picture representing this service.",
      );
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("category", category);
      formData.append("duration", parseInt(duration, 10));
      formData.append("price", parseFloat(price));
      formData.append("description", description.trim());
      formData.append("image", imageFile); // Required image file binary

      const { data } = await api.post("/api/v1/services/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setServices((prev) => [data, ...prev]);

      // Reset form
      setName("");
      setDescription("");
      setDuration(45);
      setPrice(10000);
      setImageFile(null);
      setImagePreview(null);
      setShowModal(false);
      alert("New service with required image added successfully!");
    } catch (err) {
      console.error("Failed to create service:", err);
      alert(
        "Could not save service. Please check fields or server connection.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;
    try {
      await api.delete(`/api/v1/services/${id}/`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Failed to delete service", err);
      alert("Failed to remove service from database.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Scissors className="text-teal-600" /> Services & Menu
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Every service requires an image, duration, and price in Naira (₦).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchServices}
              className="btn-secondary text-xs px-3.5 py-2.5 font-bold inline-flex items-center gap-1.5"
            >
              <RefreshCw
                size={14}
                className={loading ? "animate-spin text-teal-600" : ""}
              />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary text-xs px-4 py-2.5 font-bold inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={16} /> Add New Service
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertCircle size={16} className="text-amber-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal: Add Service with REQUIRED Image */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-xs">
            <div className="card p-6 border-2 border-teal-500 bg-white shadow-2xl space-y-4 max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Plus size={16} className="text-teal-600" /> Add New Service
                  to Catalog
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAdd} className="space-y-4">
                {/* REQUIRED IMAGE UPLOAD BOX */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Service Image{" "}
                    <span className="text-rose-500">* Required</span>
                  </label>

                  <div className="border-2 border-dashed border-slate-200 hover:border-teal-500 rounded-2xl p-4 text-center cursor-pointer relative bg-slate-50/50 transition">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />

                    {imagePreview ? (
                      <div className="relative h-36 w-full rounded-xl overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Change Photo
                        </span>
                      </div>
                    ) : (
                      <div className="py-4 space-y-1">
                        <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 mx-auto flex items-center justify-center">
                          <Upload size={18} />
                        </div>
                        <p className="text-xs font-bold text-slate-800">
                          Upload Service Photo
                        </p>
                        <p className="text-[11px] text-slate-400">
                          PNG, JPG or WEBP up to 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="label text-xs font-bold text-slate-700">
                    Service Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Knotless Braids, Diagnostic Scan, Fade & Sculpt"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input text-sm"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="label text-xs font-bold text-slate-700">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="input text-sm"
                    >
                      <option>Hair</option>
                      <option>Barber</option>
                      <option>Medical</option>
                      <option>Auto</option>
                      <option>Nails</option>
                      <option>Facials</option>
                      <option>Massage</option>
                      <option>Consulting</option>
                    </select>
                  </div>
                  <div>
                    <label className="label text-xs font-bold text-slate-700">
                      Duration (mins)
                    </label>
                    <input
                      type="number"
                      required
                      min={10}
                      step={5}
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="input text-sm"
                    />
                  </div>
                  <div>
                    <label className="label text-xs font-bold text-slate-700">
                      Fee (₦)
                    </label>
                    <input
                      type="number"
                      required
                      min={500}
                      step={500}
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="input text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="label text-xs font-bold text-slate-700">
                    Short Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="What can clients expect during this session?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="input text-sm py-2"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-secondary text-xs px-4 py-2 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary text-xs px-5 py-2 font-bold"
                  >
                    {submitting ? "Uploading & Saving…" : "Save Service"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Real Services Grid with Images */}
        {loading ? (
          <div className="p-16 text-center text-xs text-slate-400 animate-pulse">
            Fetching services and images from database…
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <div
                key={svc.id}
                className="card border border-slate-200 bg-white overflow-hidden hover:border-teal-300 hover:shadow-lg transition flex flex-col justify-between group"
              >
                <div>
                  {/* Service Photo Display */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    {svc.image ? (
                      <img
                        src={svc.image}
                        alt={svc.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-bold">
                        No Image
                      </div>
                    )}
                    <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                      {svc.category || "Service"}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h4 className="font-bold text-slate-900 text-base">
                      {svc.name}
                    </h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={13} /> {svc.duration} Minutes Duration
                    </p>
                    {svc.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 pt-1">
                        {svc.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between pt-4">
                  <span className="text-xl font-black text-teal-600">
                    {formatNaira(svc.price)}
                  </span>
                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete service"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            {services.length === 0 && (
              <div className="col-span-full card p-12 text-center text-slate-400 text-xs border border-dashed border-slate-200">
                No services added yet. Click <strong>"Add New Service"</strong>{" "}
                to upload your first treatment with its required photo.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
