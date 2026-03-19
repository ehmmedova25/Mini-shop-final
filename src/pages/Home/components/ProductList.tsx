import { useProducts } from "../../../hooks/useProducts";
import ProductCard from "../../../components/ProductCard";

export default function NewArrivals() {
  const { products, loading, error, retry } = useProducts(4);

  return (
    <section className="w-full py-16 px-4">
      <h2 className="text-4xl font-black text-center mb-12 uppercase">New Arrivals</h2>

      {error && (
        <div className="bg-red-50 p-10 rounded-3xl text-center border border-red-100">
          <p className="text-red-600 font-bold mb-4">{error}</p>
          <button onClick={retry} className="px-6 py-2 bg-black text-white rounded-full">
            Try Again
          </button>
        </div>
      )}

      {!error && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : products.map((item: any) => (
                <ProductCard key={item.id} {...item} />
              ))}
        </div>
      )}
    </section>
  );
}

const SkeletonCard = () => (
  <div className="rounded-2xl bg-gray-50 p-4 animate-pulse">
    <div className="bg-gray-200 aspect-square rounded-xl mb-4" />
    <div className="h-5 bg-gray-200 w-full rounded mb-2" />
    <div className="h-5 bg-gray-200 w-1/2 rounded" />
  </div>
);

