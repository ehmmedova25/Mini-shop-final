import React, { useState } from "react";
import { type Product, type Review } from "../api/productApi";

/* ─── Stars Component ─── */
const Stars = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => {
      const full = rating >= s;
      const half = !full && rating >= s - 0.5;
      return (
        <svg key={s} width={size} height={size} viewBox="0 0 16 16" className="shrink-0">
          {half ? (
            <>
              <defs>
                <linearGradient id={`hg${s}${size}`}>
                  <stop offset="50%" stopColor="#FFC633" />
                  <stop offset="50%" stopColor="#E5E7EB" />
                </linearGradient>
              </defs>
              <path d="M8 1.5L9.854 5.756L14.5 6.382L11.25 9.494L12.118 14.118L8 11.885L3.882 14.118L4.75 9.494L1.5 6.382L6.146 5.756L8 1.5Z" fill={`url(#hg${s}${size})`} />
            </>
          ) : (
            <path d="M8 1.5L9.854 5.756L14.5 6.382L11.25 9.494L12.118 14.118L8 11.885L3.882 14.118L4.75 9.494L1.5 6.382L6.146 5.756L8 1.5Z" fill={full ? "#FFC633" : "#E5E7EB"} />
          )}
        </svg>
      );
    })}
  </div>
);

/* ─── Rating Bar Component ─── */
const RatingBar = ({ label, pct }: { label: string; pct: number }) => (
  <div className="flex items-center gap-3 w-full">
    <span className="text-[13px] text-gray-500 font-medium w-8 text-right shrink-0">
      {label}
    </span>
    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
      <div 
        className="h-full bg-[#FFC633] rounded-full transition-all duration-700 ease-out" 
        style={{ width: `${pct}%` }} 
      />
    </div>
    <span className="text-[13px] text-gray-500 font-medium w-9 shrink-0">
      {Math.round(pct)}%
    </span>
  </div>
);

/* ─── Review Card Component ─── */
const ReviewCard = ({ r }: { r: Review }) => {
  const date = new Date(r.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  return (
    <div className="border border-gray-100 rounded-2xl p-6 flex flex-col gap-3 bg-white hover:border-gray-300 transition-all duration-300 shadow-sm">
      <div className="flex justify-between items-start">
        <Stars rating={r.rating} size={18} />
        <button className="text-gray-400 hover:text-black transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="5" r="1" fill="currentColor" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
            <circle cx="12" cy="19" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[15px] font-bold text-black">{r.reviewerName}</span>
        <div className="bg-green-600 rounded-full p-0.5">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
        </div>
      </div>
      <p className="text-[14px] text-gray-500 leading-relaxed italic">
        "{r.comment}"
      </p>
      <p className="text-[12px] text-gray-400 font-medium">
        Posted on {date}
      </p>
    </div>
  );
};

interface Props {
  product: Product;
  reviews: Review[];
}

const ReviewsTab: React.FC<Props> = ({ product, reviews }) => {
  const [showAll, setShowAll] = useState(false);
  const [sortRev, setSortRev] = useState("Latest");

  const ratingDist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    pct: reviews.length
      ? (reviews.filter((r) => Math.round(r.rating) === star).length / reviews.length) * 100
      : 0,
  }));

  const sorted = [...reviews].sort((a, b) => {
    if (sortRev === "Top Rated") return b.rating - a.rating;
    if (sortRev === "Lowest Rated") return a.rating - b.rating;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
  
  const visible = showAll ? sorted : sorted.slice(0, 6);

  if (reviews.length === 0) {
    return (
      <div className="text-center py-20 px-6 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
        <p className="text-gray-400 font-medium">No reviews yet for this product. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 mb-12 items-center md:items-start bg-white p-6 md:p-0 rounded-2xl md:rounded-none">
        <div className="text-center shrink-0">
          <p className="text-6xl md:text-7xl font-black text-black leading-none mb-2">
            {product.rating.toFixed(1)}
          </p>
          <div className="flex justify-center mb-2">
            <Stars rating={product.rating} size={24} />
          </div>
          <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest">
            {reviews.length} reviews
          </p>
        </div>

        <div className="flex-1 w-full flex flex-col gap-2.5 max-w-md">
          {ratingDist.map(({ star, pct }) => (
            <RatingBar key={star} label={`${star}`} pct={pct} />
          ))}
        </div>

        <div className="flex flex-row md:flex-col lg:flex-row items-center gap-3 w-full md:w-auto md:ml-auto">
          <select
            value={sortRev}
            onChange={(e) => setSortRev(e.target.value)}
            className="flex-1 md:w-full lg:w-40 px-4 py-3 rounded-full border border-gray-200 text-sm font-bold bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
          >
            {["Latest", "Top Rated", "Lowest Rated"].map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
          <button className="flex-1 md:w-full lg:w-auto px-8 py-3 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-black/10 active:scale-95">
            Write a Review
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-10">
        {visible.map((r, i) => (
          <ReviewCard key={i} r={r} />
        ))}
      </div>

      {reviews.length > 6 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowAll((p) => !p)}
            className="px-12 py-4 rounded-full bg-white text-black border-2 border-gray-100 text-sm font-bold hover:bg-black hover:text-white hover:border-black transition-all duration-300 active:scale-95 shadow-sm"
          >
            {showAll ? "Show Less" : "Load More Reviews"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;