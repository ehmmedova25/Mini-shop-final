import ProductCard from "../components/ProductCard";
import React from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  rating: number;
  discountPercentage?: number;
}

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
  limit?: number;
}

const ProductGrid = ({ products, loading = false, limit }: ProductGridProps) => {
  const displayProducts = limit ? products.slice(0, limit) : products;
  const skeletonCount = limit ?? 9;

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    width: "100%",
  };

  if (loading) {
    return (
      <>
        <style>{`
          @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }
          @media (max-width: 900px) { .pg-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 560px) { .pg-grid { grid-template-columns: 1fr !important; } }
        `}</style>
        <div className="pg-grid" style={gridStyle}>
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} style={{
              backgroundColor: "#F2F0F1",
              borderRadius: "20px",
              aspectRatio: "1/1.4",
              animation: "pulse 1.5s infinite",
            }} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @media (max-width: 900px) { .pg-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 560px) { .pg-grid { grid-template-columns: 1fr !important; } }
      `}</style>
      <div className="pg-grid" style={gridStyle}>
        {displayProducts.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            title={item.title}
            price={item.price}
            originalPrice={
              item.discountPercentage
                ? Math.round(item.price / (1 - item.discountPercentage / 100))
                : undefined
            }
            thumbnail={item.thumbnail}
            rating={item.rating}
            discountPercent={
              item.discountPercentage
                ? Math.round(item.discountPercentage)
                : undefined
            }
            onClick={() => console.log("clicked:", item.id)}
          />
        ))}
      </div>
    </>
  );
};

export default ProductGrid;
