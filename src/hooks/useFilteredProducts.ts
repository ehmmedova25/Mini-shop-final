import { useMemo } from "react";
import { useAppSelector } from "./redux";

const PAGE_SIZE = 9;

const STYLE_KEYWORDS: Record<string, string[]> = {
  Casual: ["casual", "basic", "everyday", "relaxed", "t-shirt", "jeans", "hoodie", "comfort"],
  Formal: ["formal", "suit", "blazer", "dress", "classic", "elegant", "office", "shirt"],
  Party:  ["party", "evening", "floral", "sequin", "glamour", "chic", "bold", "cocktail"],
  Gym:    ["gym", "sport", "athletic", "running", "workout", "fitness", "active", "training"],
};

export const useFilteredProducts = () => {
  const { all, status, filters, sortBy, page } = useAppSelector((s) => s.products);

  const filtered = useMemo(() => {
    let list = [...all];

    list = list.filter(
      (p) => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );

    if (filters.minRating > 0) {
      list = list.filter((p) => p.rating >= filters.minRating);
    }

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    if (filters.selectedStyles?.length > 0) {
      list = list.filter((p) => {
        const t = p.title.toLowerCase();
        const d = (p.description ?? "").toLowerCase();
        return filters.selectedStyles.some((style) =>
          STYLE_KEYWORDS[style]?.some((kw) => t.includes(kw) || d.includes(kw))
        );
      });
    }

    switch (sortBy) {
      case "Price: Low to High":  list.sort((a, b) => a.price - b.price);   break;
      case "Price: High to Low":  list.sort((a, b) => b.price - a.price);   break;
      case "Top Rated":           list.sort((a, b) => b.rating - a.rating); break;
      case "Newest":              list.sort((a, b) => b.id - a.id);         break;
      case "Most Popular":
      default:                    list.sort((a, b) => (b.stock ?? 0) - (a.stock ?? 0)); break;
    }

    return list;
  }, [all, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(page, totalPages);
  const pageItems  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  return { filtered, pageItems, totalPages, status, page: safePage };
};

export const useTotalItems = () => {
  const items = useAppSelector((s) => s.cart.items);
  return items.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
};

export const useTotalPrice = () => {
  const items = useAppSelector((s) => s.cart.items);
  return items.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );
};