import React, { useState } from "react";
import { type Product } from "../api/productApi";

/* ─── FAQ Item Component ─── */
const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-none transition-colors duration-200">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex justify-between items-center py-5 text-left focus:outline-none group"
      >
        <span className="text-[15px] md:text-16 font-bold text-black group-hover:text-gray-600 transition-colors tracking-tight">
          {q}
        </span>
        <div className={`p-1.5 rounded-full transition-all duration-300 ${open ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      <div 
        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${
          open ? "grid-rows-[1fr] opacity-100 mb-5" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-[14px] text-gray-500 leading-relaxed font-medium">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ═══════ MAIN COMPONENT ═══════ */
interface Props {
  product: Product;
}

const FaqTab: React.FC<Props> = ({ product }) => {
  const items = [
    product.returnPolicy && { 
      q: "What is the return policy?", 
      a: product.returnPolicy 
    },
    product.shippingInformation && { 
      q: "How long does shipping take?", 
      a: product.shippingInformation 
    },
    product.warrantyInformation && { 
      q: "What warranty is included?", 
      a: product.warrantyInformation 
    },
    product.availabilityStatus && {
      q: "Is this item currently in stock?",
      a: `Current status is: ${product.availabilityStatus}. We usually ship within a few business days.`
    }
  ].filter(Boolean) as { q: string; a: string }[];

  return (
    <div className="max-w-2xl w-full animate-fadeIn">
      {items.length > 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 px-6 shadow-sm">
          {items.map(({ q, a }) => (
            <FaqItem key={q} q={q} a={a} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-sm text-gray-400 font-medium tracking-tight">
            No FAQ information available for this product at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default FaqTab;