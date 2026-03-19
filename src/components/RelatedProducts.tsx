import React from "react";
import { type Product } from "../api/productApi";
import ProductCard from "../components/ProductCard";

interface Props {
  products: Product[];
}

const RelatedProducts: React.FC<Props> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="w-full mt-16 md:mt-24 mb-12 animate-fadeIn">
      <div className="border-t border-gray-100 w-full mb-14 md:mb-16" />

      <section className="container mx-auto px-4 md:px-0">
        <h2 className="text-3xl md:text-5xl font-black text-black text-center mb-10 md:mb-14 tracking-tighter uppercase leading-none">
          You Might Also Like
        </h2>

        <div className="flex overflow-x-auto pb-6 md:pb-0 md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6 no-scrollbar snap-x snap-mandatory">
          {products.map((p) => (
            <div 
              key={p.id} 
              className="min-w-[200px] w-[200px] md:w-full snap-start"
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
      </section>
    </div>
  );
};

export default RelatedProducts;