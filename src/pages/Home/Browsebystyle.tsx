import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface StyleItem {
  label: string;
  category: string;
  imageUrl: string;
}

const STYLES: StyleItem[] = [
  {
    label: "Casual",
    category: "mens-shirts",
    imageUrl: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
  },
  {
    label: "Formal",
    category: "mens-suits",
    imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80",
  },
  {
    label: "Party",
    category: "womens-dresses",
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
  },
  {
    label: "Gym",
    category: "sports-accessories",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80",
  },
];

export default function BrowseByStyle() {
  const navigate = useNavigate();

  return (
    <section className="w-full py-6">
      <h2 className="text-center text-xl sm:text-2xl font-black tracking-tight uppercase text-gray-900 mb-5">
        Browse by Dress Style
      </h2>

      <div className="bg-[#F0EFEF] rounded-2xl p-3 sm:p-4">

        <div className="flex gap-3 mb-3">
          <StyleCard
            card={STYLES[0]}
            onClick={() => navigate(`/category/${STYLES[0].category}`)}
            className="w-[38%] aspect-[3/1.8]"
          />
          <StyleCard
            card={STYLES[1]}
            onClick={() => navigate(`/category/${STYLES[1].category}`)}
            className="flex-1 aspect-[3/1.8]"
          />
        </div>

        <div className="flex gap-3">
          <StyleCard
            card={STYLES[2]}
            onClick={() => navigate(`/category/${STYLES[2].category}`)}
            className="flex-1 aspect-[3/1.8]"
          />
          <StyleCard
            card={STYLES[3]}
            onClick={() => navigate(`/category/${STYLES[3].category}`)}
            className="w-[38%] aspect-[3/1.8]"
          />
        </div>
      </div>
    </section>
  );
}

interface StyleCardProps {
  card: StyleItem;
  onClick: () => void;
  className?: string;
}

function StyleCard({ card, onClick, className = "" }: StyleCardProps) {
  const [imgErr, setImgErr] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      aria-label={`Browse ${card.label} style`}
      className={[
        "relative rounded-2xl overflow-hidden",
        "cursor-pointer border-0 p-0 text-left bg-gray-200",
        "transition-all duration-300 ease-out",
        hovered ? "-translate-y-0.5 shadow-lg" : "shadow-sm",
        className,
      ].join(" ")}
    >
      {/* Image — full card */}
      {!imgErr ? (
        <img
          src={card.imageUrl}
          alt={card.label}
          onError={() => setImgErr(true)}
          className={[
            "absolute inset-0 w-full h-full object-cover object-center",
            "transition-transform duration-500",
            hovered ? "scale-105" : "scale-100",
          ].join(" ")}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

      <span className="absolute top-4 left-4 font-bold text-sm sm:text-base text-white tracking-tight leading-none drop-shadow">
        {card.label}
      </span>
    </button>
  );
}