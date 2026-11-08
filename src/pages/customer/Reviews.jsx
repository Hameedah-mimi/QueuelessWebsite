import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import RoleNavbar from "../../components/layout/RoleNavbar";
import {
  Star,
  ChevronLeft,
  ThumbsUp,
  ShieldCheck,
  MapPin,
  Sparkles,
  PenSquare,
  Search,
  Filter,
  CheckCircle2,
  X,
} from "lucide-react";
import { REVIEWS, ORGANIZATIONS } from "../../data/mock";

export default function Reviews() {
  const { orgId } = useParams();
  const org = ORGANIZATIONS.find((o) => o.id === orgId) || ORGANIZATIONS[0];

  const [reviewList, setReviewList] = useState(REVIEWS);
  const [selectedStar, setSelectedStar] = useState("all");
  const [showWriteModal, setShowWriteModal] = useState(false);
  const [search, setSearch] = useState("");

  // New review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const bars = [
    { stars: 5, pct: 89, count: 142 },
    { stars: 4, pct: 8, count: 12 },
    { stars: 3, pct: 2, count: 3 },
    { stars: 2, pct: 1, count: 1 },
    { stars: 1, pct: 0, count: 0 },
  ];

  // Filter reviews
  const filteredReviews = reviewList.filter((r) => {
    const matchesStar =
      selectedStar === "all" || r.rating === parseInt(selectedStar, 10);
    const matchesSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.text.toLowerCase().includes(search.toLowerCase());
    return matchesStar && matchesSearch;
  });

  const handlePostReview = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    setTimeout(() => {
      const created = {
        id: `rev-${Date.now()}`,
        name: "You (Verified Customer)",
        date: "Just now",
        rating: newRating,
        text: newComment.trim(),
        helpful: 0,
      };
      setReviewList([created, ...reviewList]);
      setNewComment("");
      setShowWriteModal(false);
      setSubmitting(false);
    }, 400);
  };

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
              Verified feedback from real customers who booked through
              QueueLess.
            </p>
          </div>

          <button
            onClick={() => setShowWriteModal(true)}
            className="btn-primary px-5 py-2.5 font-bold text-xs inline-flex items-center gap-2 shadow-xs self-start sm:self-auto"
          >
            <PenSquare size={15} /> Write a Review
          </button>
        </div>

        {/* ================= 2-COLUMN DESKTOP GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT 1 COLUMN: Venue Snapshot, Score & Star Distribution */}
          <div className="space-y-6 lg:sticky lg:top-8">
            {/* Business Preview Card */}
            <div className="card overflow-hidden border border-ink-100 bg-white shadow-sm">
              <div className="relative h-32 w-full bg-ink-200">
                <img
                  src={org.image}
                  alt={org.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <h3 className="font-extrabold text-base truncate">
                    {org.name}
                  </h3>
                  <p className="text-xs text-white/80 flex items-center gap-1 mt-0.5">
                    <MapPin size={12} />{" "}
                    {org.location || "Victoria Island, Lagos"}
                  </p>
                </div>
              </div>

              {/* Rating Summary Breakdown */}
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-5">
                  <div className="text-center p-3 rounded-2xl bg-amber-50/60 border border-amber-100/60 shrink-0">
                    <p className="text-4xl font-black text-ink-950">
                      {org.rating}
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
                  <span>Total Verified Reviews</span>
                  <strong className="text-ink-900 font-bold">
                    {org.reviews}
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
                Only customers who joined the queue or completed a booking at{" "}
                {org.name} can submit ratings.
              </div>
            </div>
          </div>

          {/* RIGHT 2 COLUMNS: Filter Bar & Customer Review Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter & Search Bar */}
            <div className="card p-3 border border-ink-100 bg-white shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Star Rating Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {["all", "5", "4", "3"].map((star) => (
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

              {/* Search input */}
              <div className="relative sm:w-60">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  type="text"
                  placeholder="Filter reviews…"
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

            {/* REVIEWS LIST */}
            <div className="space-y-4">
              {filteredReviews.map((r) => (
                <div
                  key={r.id}
                  className="card p-6 border border-ink-100 bg-white shadow-sm hover:border-brand-200 transition space-y-3"
                >
                  {/* Review Header: User Avatar + Name + Rating */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-sm ring-2 ring-brand-100">
                        {r.name[0]?.toUpperCase() || "U"}
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

                    {/* Star Rating Badge */}
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

                  {/* Review Text */}
                  <p className="text-xs sm:text-sm text-ink-700 leading-relaxed">
                    {r.text}
                  </p>

                  {/* Footer / Helpful Counter */}
                  <div className="pt-3 border-t border-ink-100 flex items-center justify-between text-xs text-ink-400">
                    <span>
                      Specialist: <strong>Sarah Johnson</strong>
                    </span>

                    <button
                      type="button"
                      className="hover:text-ink-700 inline-flex items-center gap-1.5 transition"
                    >
                      <ThumbsUp size={13} />
                      <span>Helpful ({r.helpful || 2})</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Empty state */}
              {filteredReviews.length === 0 && (
                <div className="card p-12 text-center border border-dashed border-ink-200 bg-white/70">
                  <Star size={32} className="text-ink-300 mx-auto mb-3" />
                  <h4 className="text-sm font-bold text-ink-900">
                    No reviews found
                  </h4>
                  <p className="text-xs text-ink-400 max-w-xs mx-auto mt-1 mb-4">
                    There are no reviews matching your current star filter or
                    search keyword.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedStar("all");
                      setSearch("");
                    }}
                    className="btn-secondary text-xs px-4 py-2 font-bold"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
