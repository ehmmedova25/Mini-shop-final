import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { addToCart } from "../store/slices/cartSlice";

interface Props {
  id: number;
  title: string;
  price: number;
  originalPrice?: number;
  thumbnail: string;
  rating: number;
  discountPercent?: number;
}

const Stars = ({ rating }: { rating: number }) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((s) => {
      const full = rating >= s;
      const half = !full && rating >= s - 0.5;

      return (
        <svg key={s} className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 16 16">
          {half ? (
            <>
              <defs>
                <linearGradient id={`hg${s}`}>
                  <stop offset="50%" stopColor="#FFC633" />
                  <stop offset="50%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
              <path
                d="M8 1.5L9.854 5.756L14.5 6.382L11.25 9.494L12.118 14.118L8 11.885L3.882 14.118L4.75 9.494L1.5 6.382L6.146 5.756L8 1.5Z"
                fill={`url(#hg${s})`}
              />
            </>
          ) : (
            <path
              d="M8 1.5L9.854 5.756L14.5 6.382L11.25 9.494L12.118 14.118L8 11.885L3.882 14.118L4.75 9.494L1.5 6.382L6.146 5.756L8 1.5Z"
              fill={full ? "#FFC633" : "#E5E7EB"}
            />
          )}
        </svg>
      );
    })}

    <span className="text-[11px] sm:text-xs text-gray-400 ml-1">
      {rating.toFixed(1)}
    </span>
  </div>
);

const ProductCard = ({
  id,
  title,
  price,
  originalPrice,
  thumbnail,
  rating,
  discountPercent,
}: Props) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [added, setAdded] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(addToCart({ id, title, price, thumbnail }));

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="group bg-[#F2F0F1] rounded-2xl overflow-hidden cursor-pointer transition hover:-translate-y-1 hover:shadow-xl relative"
    >
      {/* Image */}
      <div className="aspect-square bg-gray-200 overflow-hidden">
        <img
          src={
            imgErr
              ? `https://dummyjson.com/image/400x400?text=${encodeURIComponent(
                  title.slice(0, 10)
                )}`
              : thumbnail
          }
          alt={title}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>

      {/* Quick Add */}
      <button
        onClick={handleQuickAdd}
        className={`absolute bottom-3 left-3 right-3 py-2 rounded-full text-xs sm:text-sm font-bold transition-all
          ${
            added
              ? "bg-green-600 text-white"
              : "bg-black text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          }
        `}
      >
        {added ? "✓ Əlavə edildi" : "+ Səbətə əlavə et"}
      </button>

      {/* Content */}
      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-[15px] font-bold text-gray-900 truncate">
          {title}
        </h3>

        <div className="mt-1">
          <Stars rating={rating} />
        </div>

        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <span className="text-base sm:text-lg font-extrabold text-gray-900">
            ${price}
          </span>

          {originalPrice && (
            <span className="text-xs sm:text-sm text-gray-400 line-through">
              ${originalPrice}
            </span>
          )}

          {discountPercent && (
            <span className="text-[10px] sm:text-xs font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
