import { useState, useEffect, useCallback } from "react";
import { getProducts, type Product } from "../api/productApi";

export const useProducts = (limit: number = 4) => {

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProducts();
      
      const slicedProducts = (data.products || []).slice(0, limit);
      setProducts(slicedProducts);
      
    } catch (err: any) {
      setError(err.message || "Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { products, loading, error, retry: loadData };
};