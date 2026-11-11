import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import api from "../../api/client";
import {
  Star,
  ChevronLeft,
  ThumbsUp,
  ShieldCheck,
  MapPin,
  PenSquare,
  Search,
  CheckCircle2,
  X,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function Reviews() {
  const { orgId } = useParams();

  const [org, setOrg] = useState(null);
  const [reviewList, setReviewList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const [selectedStar, setSelectedStar] = useState("all");
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [search, setSearch] = useState("");

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 100% Real API call to Django
  const fetchReviewsData = useCallback(
    async (isSilent = false) => {
      if (!isSilent) setLoading(true);
      else setRefreshing(true);
      setError(null);

      try {
        const [orgRes, revRes] = await Promise.allSettled([
          api.get(`/api/v1/organizations/${orgId}/`),
          api.get(`/api/v1/reviews/?organization=${orgId}`),
        ]);

        if (orgRes.status === "fulfilled") {
          const d = orgRes.value.data;
          setOrg({
            id: d.id,
            name: d.name || "Salon & Spa",
            location: d.location || d.address || "Lagos, Nigeria",
            rating: parseFloat(d.rating || d.average_rating || 5.0),
            reviewsCount: parseInt(d.reviews || d.review_count || 0, 10),
            image: d.image || d.avatar_url || null,
          });
        } else {
          throw new Error("Organization not found");
        }

        if (revRes.status === "fulfilled") {
          const raw = Array.isArray(revRes.value.data)
            ? revRes.value.data
            : revRes.value.data?.results || [];
          const parsed = raw.map((r) => ({
            id: r.id,
            name:
              r.user_name ||
              r.customer_name ||
              r.user?.full_name ||
              "Verified Customer",
            date: r.created_at
              ? new Date(r.created_at).toLocaleDateString()
              : r.date || "Recently",
            rating: parseInt(r.rating || 5, 10),
            text: r.comment || r.text || "",
            helpful: parseInt(r.helpful_count || 0, 10),
          }));
          setReviewList(parsed);
        }
      } catch (err) {
        console.error("Failed to load reviews:", err);
        setError("Could not retrieve reviews from server.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [orgId],
  );

  useEffect(() => {
    fetchReviewsData();
  }, [fetchReviewsData]);

  // REAL API: Submit review to Django
  const handlePostReview = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      const payload = {
        organization: orgId,
        rating: newRating,
        comment: newComment.trim(),
      };

      const res = await api.post("/api/v1/reviews/", payload);
      const created = {
        id: res.data?.id || `rev-${Date.now()}`,
        name: res.data?.user_name || "You (Verified Customer)",
        date: "Just now",
        rating: newRating,
        text: newComment.trim(),
        helpful: 0,
      };

      setReviewList((prev) => [created, ...prev]);
      setNewComment("");
      setShowWriteModal(false);
      alert("Review published successfully!");
    } catch (err) {
      console.error("Failed to post review:", err);
      alert("Could not submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Calculate real rating distribution bars from actual database records
  const bars = useMemo(() => {
    const total = reviewList.length;
    return [5, 4, 3, 2, 1].map((stars) => {
      const count = reviewList.filter((r) => r.rating === stars).length;
      const pct = total > 0 ? Math.round((count / total) * 100) : 0;
      return { stars, count, pct };
    });
  }, [reviewList]);

  // Filter reviews
  const filteredReviews = reviewList.filter((r) => {
    const matchesStar =
      selectedStar === "all" || r.rating === parseInt(selectedStar, 10);
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase());
    return matchesStar && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-ink-50/50">
        <RoleNavbar />
        <main className="lg:ml-64 p-16 text-center text-xs text-ink-400 animate-pulse">
          Loading reviews from database…
        </main>
      </div>
    );
  }

  if (error || !org) {
    return (
      <div className="min-h-screen bg-ink-50/50">
        <RoleNavbar />
        <main className="lg:ml-64 p-8 max-w-xl mx-auto text-center space-y-4">
          <AlertCircle size={32} className="text-amber-600 mx-auto" />
          <h2 className="text-lg font-bold text-ink-900">
            Organization Not Found
          </h2>
          <p className="text-xs text-ink-500">
            {error || "This organization does not exist."}
          </p>
          <Link
            to="/customer/explore"
            className="btn-primary text-xs px-4 py-2 inline-block"
          >
            Back to Explore
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50/50">
      <RoleNavbar />

      <main className="lg:ml-64 p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto space-y-8">
        {/* ================= NAVIGATION & HEADER ================= */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              to={`/customer/org/${org.id}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-500 hover:text-brand-600 transition mb-2"
            >
              <ChevronLeft size={16} /> Back to {org.name}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black text-ink-900 tracking-tight">
              Customer Reviews & Ratings
            </h1>
            <p className="text-sm text-ink-500 mt-0.5">
              Verified feedback from real customers for {org.name}.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchReviewsData(true)}
              disabled={refreshing}
              className="btn-secondary text-xs px-3.5 py-2 font-bold inline-flex items-center gap-1.5"
            >
              <RefreshCw
                size={14}
                className={refreshing ? "animate-spin text-brand-600" : ""}
              />
              <span>{refreshing ? "Syncing…" : "Sync"}</span>
            </button>

            <button
              onClick={() => setShowWriteModal(true)}
              className="btn-primary px-5 py-2.5 font-bold text-xs inline-flex items-center gap-2 shadow-xs"
            >
              <PenSquare size={15} /> Write a Review
            </button>
          </div>
        </div>

        {/* ================= 2-COLUMN DESKTOP GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 1 COLUMN: Venue Snapshot, Score & Real Star Distribution */}
          <div className="space-y-6 lg:sticky lg:top-8">
            <div className="card overflow-hidden border border-ink-100 bg-white shadow-sm">
              <div className="relative h-32 w-full bg-ink-200">
                {org.image ? (
                  <img
                    src={org.image}
                    alt={org.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-ink-100 text-ink-400 text-xs font-bold">
                    No Photo Uploaded
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-extrabold text-base truncate">
                    {org.name}
                  </h3>
                  <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} /> {org.location}
                  </p>
                </div>
              </div>

              {/* Real Rating Breakdown */}
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="text-center p-3 rounded-2xl bg-amber-50/60 border border-amber-100/60 shrink-0">
                    <p className="text-4xl font-black text-ink-950">
                      {org.rating.toFixed(1)}
                    </p>
                    <div className="flex gap-0.5 justify-center mt-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={
                            i < Math.round(org.rating)
                              ? "text-amber-400 fill-amber-400"
                              : "text-ink-200"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-ink-400 block mt-1 uppercase">
                      Out of 5
                    </span>
                  </div>

                  {/* Real Computed Distribution Bars */}
                  <div className="flex-1 space-y-1.5">
                    {bars.map((b) => (
                      <button
                        key={b.stars}
                        type="button"
                        onClick={() =>
                          setSelectedStar(
                            selectedStar === String(b.stars)
                              ? "all"
                              : String(b.stars),
                          )
                        }
                        className={`w-full flex items-center gap-2 text-xs py-0.5 rounded-lg transition ${
                          selectedStar === String(b.stars)
                            ? "font-bold text-brand-700 bg-brand-50 px-1"
                            : "text-ink-600 hover:text-ink-900"
                        }`}
                      >
                        <span className="w-3 text-right font-semibold">
                          {b.stars}★
                        </span>
                        <div className="flex-1 h-2 bg-ink-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${b.pct}%` }}
                          />
                        </div>
                        <span className="w-7 text-ink-400 text-right text-[11px]">
                          {b.pct}%
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-ink-100 flex items-center justify-between text-xs text-ink-500">
                  <span>Total Reviews in Database</span>
                  <strong className="text-ink-900 font-bold">
                    {reviewList.length}
                  </strong>
                </div>
              </div>
            </div>

            {/* Verified Review Assurance */}
            <div className="rounded-2xl p-5 bg-emerald-50/50 border border-emerald-100 flex items-start gap-3">
              <ShieldCheck
                size={20}
                className="text-emerald-600 shrink-0 mt-0.5"
              />
              <div className="text-xs text-ink-600 leading-relaxed">
                <strong className="text-ink-900 block font-bold mb-0.5">
                  100% Genuine Reviews
                </strong>
                Reviews are posted by registered platform customers with
                verified appointments.
              </div>
            </div>
          </div>

          {/* RIGHT 2 COLUMNS: Filter Bar & Real Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter & Search Bar */}
            <div className="card p-3 border border-ink-100 bg-white shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {["all", "5", "4", "3", "2", "1"].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setSelectedStar(star)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      selectedStar === star
                        ? "bg-ink-900 text-white shadow-xs"
                        : "bg-ink-50 text-ink-600 hover:bg-ink-100"
                    }`}
                  >
                    {star === "all" ? "All Reviews" : `${star} Stars`}
                  </button>
                ))}
              </div>

              <div className="relative sm:w-60">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  type="text"
                  placeholder="Filter by comment…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input pl-9 py-1.5 text-xs w-full bg-white border-ink-200"
                />
              </div>
            </div>

            {/* WRITE A REVIEW MODAL / INLINE CARD */}
            {showWriteModal && (
              <div className="card p-6 border-2 border-brand-500 bg-white shadow-md animate-fade-in space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-ink-100">
                  <h3 className="font-bold text-ink-900 text-sm flex items-center gap-2">
                    <PenSquare size={16} className="text-brand-600" /> Share
                    your experience at {org.name}
                  </h3>
                  <button
                    onClick={() => setShowWriteModal(false)}
                    className="text-ink-400 hover:text-ink-700"
                  >
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handlePostReview} className="space-y-4">
                  <div>
                    <label className="label text-xs font-bold text-ink-700">
                      Rating
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNewRating(num)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star
                            size={24}
                            className={
                              num <= newRating
                                ? "text-amber-400 fill-amber-400"
                                : "text-ink-200"
                            }
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-ink-700 ml-2">
                        {newRating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="label text-xs font-bold text-ink-700">
                      Your Feedback
                    </label>
                    <textarea
                      rows={3}
                      className="input py-2 text-sm w-full"
                      placeholder="Tell other customers about the staff, wait time, and quality of service…"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowWriteModal(false)}
                      className="btn-secondary text-xs px-4 py-2 font-bold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary text-xs px-5 py-2 font-bold shadow-xs"
                    >
                      {submitting ? "Publishing…" : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* REAL REVIEWS FEED */}
            <div className="space-y-4">
              {filteredReviews.map((r) => (
                <div
                  key={r.id}
                  className="card p-6 border border-ink-100 bg-white shadow-sm hover:border-brand-200 transition space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm ring-2 ring-brand-100">
                        {(r.name || "U")[0].toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-ink-900 text-sm">
                            {r.name}
                          </h4>
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 size={10} /> Verified
                          </span>
                        </div>
                        <p className="text-[11px] text-ink-400 mt-0.5">
                          {r.date}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-0.5 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100/60">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={
                            i < r.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-ink-200"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                    {r.text}
                  </p>

                  <div className="pt-3 border-t border-ink-100 flex items-center justify-between text-xs text-ink-400">
                    <span>Verified Customer Visit</span>

                    <button
                      type="button"
                      className="hover:text-ink-700 inline-flex items-center gap-1.5 transition"
                    >
                      <ThumbsUp size={13} />
                      <span>Helpful ({r.helpful || 0})</span>
                    </button>
                  </div>
                </div>
              ))}

              {filteredReviews.length === 0 && (
                <div className="card p-12 text-center border border-dashed border-ink-200 bg-white/70">
                  <Star size={32} className="text-ink-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-ink-900">
                    No reviews found
                  </h4>
                  <p className="text-xs text-ink-400 max-w-xs mx-auto mt-1 mb-4">
                    {search || selectedStar !== "all"
                      ? "No reviews match your filter. Try resetting search."
                      : "No customer reviews have been posted for this business yet. Be the first to write one!"}
                  </p>
                  {(search || selectedStar !== "all") && (
                    <button
                      onClick={() => {
                        setSelectedStar("all");
                        setSearch("");
                      }}
                      className="btn-secondary text-xs px-4 py-2 font-bold"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
