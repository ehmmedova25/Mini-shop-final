import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/redux";
import { addToCart } from "../../store/slices/cartSlice";
import { getProductById, getRelatedProducts, type Product } from "../../api/productApi";
import Breadcrumb from "../../components/Breadcrumb";
import RelatedProducts from "../../components/RelatedProducts";
import ProductDetailsTab from "../../components/ProductDetailsTab";
import ReviewsTab from "../../components/ReviewsTab";
import FaqTab from "../../components/FaqTabs";
import ColorPicker from "../../components/Colorpicker";
import { addRecentlyViewed } from "../../components/RecentlyViewed";
import ImageMagnifier from "../../components/ImageMagnifier"; // Zoom importu

/* ── Stars ── */
const Stars = ({ rating, size = 18 }: { rating: number; size?: number }) => (
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

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState<"details" | "reviews" | "faq">("reviews");

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductById(Number(id))
      .then(async (p) => {
        setProduct(p);
        addRecentlyViewed({
          id: p.id, title: p.title, price: p.price,
          thumbnail: p.thumbnail, rating: p.rating,
          discountPercentage: p.discountPercentage,
        });
        const rel = await getRelatedProducts(p.category, p.id, 4);
        setRelated(rel);
      })
      .catch(() => navigate("/"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return <Skeleton />;
  if (!product) return null;

  const images = product.images?.length ? product.images : [product.thumbnail];
  const reviews = product.reviews || [];
  const discountPercent = product.discountPercentage || 0;
  const origPrice = discountPercent > 0
    ? Math.round(product.price / (1 - discountPercent / 100))
    : null;

  const handleAdd = () => {
    dispatch(addToCart({ 
      id: product.id, 
      title: product.title, 
      price: product.price, 
      thumbnail: product.thumbnail,
      quantity: qty 
    }));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-[1240px] mx-auto px-4 md:px-6 py-6 pb-20 font-sans">
      
      <div className="mb-6 overflow-x-auto">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/category" },
          { label: product.category, href: `/category/${product.category}` },
          { label: product.title },
        ]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start mb-16">
        
        {/* Gallery Section */}
        <div className="flex flex-col-reverse md:flex-row gap-4">
          <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar shrink-0">
            {images.slice(0, 4).map((img, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`w-20 h-20 md:w-[100px] md:h-[100px] rounded-2xl overflow-hidden shrink-0 border-2 transition-all
                  ${imgIdx === i ? "border-black" : "border-transparent bg-[#F2F0F1]"}`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          
          <div className="flex-1 aspect-square">
            <ImageMagnifier src={images[imgIdx]} />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex flex-col">
          <h1 className="text-3xl md:text-5xl font-black text-black uppercase tracking-tighter leading-[1.1] mb-3">
            {product.title}
          </h1>

          <div className="flex items-center gap-3 mb-5">
            <Stars rating={product.rating} />
            <span className="text-sm font-medium">
              {product.rating} <span className="text-gray-400">/ 5</span>
            </span>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-3xl font-bold text-black">${product.price}</span>
            {origPrice && (
              <>
                <span className="text-2xl text-gray-300 line-through">${origPrice}</span>
                <span className="bg-red-100 text-red-500 text-sm font-bold px-3 py-1 rounded-full">
                  -{Math.round(discountPercent)}%
                </span>
              </>
            )}
          </div>

          <p className="text-gray-500 leading-relaxed mb-8 border-b border-gray-100 pb-8">
            {product.description}
          </p>

          <ColorPicker productId={product.id} />

          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-8 border-t border-gray-100">
            <div className="flex items-center justify-between bg-[#F0F0F0] rounded-full px-6 py-3 sm:w-32">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="text-2xl hover:text-gray-600">−</button>
              <span className="font-bold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="text-2xl hover:text-gray-600">+</button>
            </div>
            
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`flex-1 py-4 rounded-full font-bold text-white transition-all
                ${added ? "bg-green-500" : "bg-black hover:bg-gray-800"} 
                ${product.stock === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {added ? "Added Successfully!" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="flex border-b border-gray-200 mb-10 overflow-x-auto no-scrollbar">
          {["details", "reviews", "faq"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t as any)}
              className={`flex-1 pb-4 text-center font-medium capitalize transition-all border-b-2 
                ${tab === t ? "border-black text-black" : "border-transparent text-gray-400 hover:text-gray-600"}`}
            >
              {t === "reviews" ? `Reviews (${reviews.length})` : t}
            </button>
          ))}
        </div>
        
        <div className="min-h-[300px]">
          {tab === "details" && <ProductDetailsTab product={product} />}
          {tab === "reviews" && <ReviewsTab product={product} reviews={reviews} />}
          {tab === "faq" && <FaqTab product={product} />}
        </div>
      </div>

      <div className="mt-20">
        <RelatedProducts products={related} />
      </div>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="max-w-[1240px] mx-auto px-4 py-10 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="aspect-square bg-gray-100 rounded-3xl" />
        <div className="space-y-6">
          <div className="h-12 bg-gray-100 rounded-lg w-3/4" />
          <div className="h-6 bg-gray-100 rounded-lg w-1/4" />
          <div className="h-40 bg-gray-100 rounded-lg" />
          <div className="h-14 bg-gray-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}
