import { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

const KEY = "rv_products";
const MAX = 6;

export interface RVProduct {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  discountPercentage?: number;
}

export const addRecentlyViewed = (p: RVProduct) => {
  try {
    const prev: RVProduct[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const next = [p, ...prev.filter((x) => x.id !== p.id)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
};

export const getRecentlyViewed = (): RVProduct[] => {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
};

interface Props {
  excludeId?: number; 
}

const RecentlyViewed = ({ excludeId }: Props) => {
  const [items, setItems] = useState<RVProduct[]>([]);

  useEffect(() => {
    const list = getRecentlyViewed().filter((p) => p.id !== excludeId);
    setItems(list);
  }, [excludeId]);

  if (items.length === 0) return null;

  return (
    <div className="w-full py-16 md:py-20 animate-fadeIn">
      <div className="border-t border-gray-100 w-full mb-16" />

      <section className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-5xl font-black text-black text-center mb-10 md:mb-14 tracking-tighter uppercase leading-none">
          Recently Viewed
        </h2>

        <div className="flex overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 no-scrollbar snap-x snap-mandatory">
          {items.slice(0, 4).map((p) => (
            <div 
              key={p.id} 
              className="min-w-[220px] w-[220px] md:w-full snap-start"
            >
              <ProductCard
                id={p.id}
                title={p.title}
                price={p.price}
                thumbnail={p.thumbnail}
                rating={p.rating}
                originalPrice={
                  p.discountPercentage
                    ? Math.round(p.price / (1 - p.discountPercentage / 100))
                    : undefined
                }
                discountPercent={
                  p.discountPercentage
                    ? Math.round(p.discountPercentage)
                    : undefined
                }
              />
            </div>
          ))}
        </div>

        <div className="mt-10 border-b border-gray-50 md:hidden" />
      </section>
    </div>
  );
};

export default RecentlyViewed;