import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  fetchProducts,
  fetchByCategory,
  setFilters,
  resetFilters,
  setSortBy,
  setPage,
  type FilterState,
  type SortOption,
} from "../../store/slices/productsSlice";
import { useFilteredProducts } from "../../hooks/useFilteredProducts";
import FilterSidebar from "../../components/FilterSidebar";
import SortBar from "../../components/Sortbar";
import ProductGrid from "../../components/ProductGrid";
import Pagination from "../../components/Pagination";
import Breadcrumb from "../../components/Breadcrumb";

const CategoryPage = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.products.filters);
  const sortBy = useAppSelector((s) => s.products.sortBy);
  const { filtered, pageItems, totalPages, status, page } = useFilteredProducts();

  useEffect(() => {
    if (filters.selectedCategory) {
      dispatch(fetchByCategory(filters.selectedCategory));
    } else {
      dispatch(fetchProducts());
    }
  }, [filters.selectedCategory, dispatch]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  const handleFilterChange = (f: FilterState) => {
    dispatch(setFilters(f));
  };

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(fetchProducts());
  };

  const catLabel = filters.selectedCategory
    ? filters.selectedCategory
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
    : "All Products";

  return (
    <div className="max-w-[1240px] mx-auto px-6 py-6 md:py-10 mb-20">
      <div className="mb-6 md:mb-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: catLabel }]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[295px_1fr] gap-8 items-start">
        <div className="hidden lg:block">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        <div className="w-full">
          <SortBar
            title={catLabel}
            total={filtered.length}
            sortBy={sortBy}
            onSortChange={(s) => dispatch(setSortBy(s as SortOption))}
          />

          {status === "error" ? (
            <ErrorState
              onRetry={() =>
                filters.selectedCategory
                  ? dispatch(fetchByCategory(filters.selectedCategory))
                  : dispatch(fetchProducts())
              }
            />
          ) : (!status || status === "idle") && filtered.length === 0 ? (
            <EmptyState onReset={handleReset} />
          ) : (
            <div className="mt-4">
              <ProductGrid products={pageItems} loading={status === "loading"} />
            </div>
          )}

          {status !== "loading" && filtered.length > 9 && (
            <div className="mt-12 border-t border-gray-100 pt-6">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => dispatch(setPage(p))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-gray-50 rounded-[20px] border border-dashed border-gray-200 animate-fadeIn">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    </div>
    <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tight">No products found</h3>
    <p className="text-gray-500 max-w-xs mb-8 font-medium">
      We couldn't find anything matching your filters. Try adjusting them to see more results.
    </p>
    <button 
      onClick={onReset} 
      className="px-8 py-3.5 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-black/10"
    >
      Clear All Filters
    </button>
  </div>
);

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-red-50 rounded-[20px] border border-red-100 animate-fadeIn">
    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tight">Something went wrong</h3>
    <p className="text-gray-500 max-w-xs mb-8 font-medium">
      There was an error loading the products. Please check your connection and try again.
    </p>
    <button 
      onClick={onRetry} 
      className="px-8 py-3.5 bg-black text-white rounded-full font-bold text-sm hover:bg-gray-800 transition-all active:scale-95"
    >
      Try Again
    </button>
  </div>
);

export default CategoryPage;