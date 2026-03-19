import React from "react";
import { type Product } from "../api/productApi";

interface Props {
  product: Product;
}

const ProductDetailsTab: React.FC<Props> = ({ product }) => {
  const rows = [
    { label: "Brand", value: product.brand || "—" },
    { label: "Category", value: product.category },
    { label: "Stock", value: `${product.stock} units` },
    { label: "Min Order", value: product.minimumOrderQuantity ? `${product.minimumOrderQuantity} units` : "1 unit" },
    { label: "Discount", value: product.discountPercentage ? `${Math.round(product.discountPercentage)}% off` : "No discount" },
    { label: "Warranty", value: product.warrantyInformation || "—" },
    { label: "Shipping", value: product.shippingInformation || "—" },
    { label: "Returns", value: product.returnPolicy || "—" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      
      <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm h-fit">
        {rows.map(({ label, value }, i) => (
          <div
            key={label}
            className={`flex items-center px-5 py-4 ${
              i < rows.length - 1 ? "border-b border-gray-50" : ""
            } hover:bg-gray-50/50 transition-colors`}
          >
            <span className="text-[13px] text-gray-400 font-semibold w-32 shrink-0 tracking-tight uppercase">
              {label}
            </span>
            <span className="text-[14px] text-black font-medium capitalize">
              {value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6">
        
        {product.dimensions && (
          <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
            <p className="mb-4 text-xs font-bold text-black uppercase tracking-[0.7px]">
              Dimensions
            </p>
            <div className="flex gap-3">
              {[
                ["Width", product.dimensions.width],
                ["Height", product.dimensions.height],
                ["Depth", product.dimensions.depth],
              ].map(([l, v]) => (
                <div 
                  key={l as string} 
                  className="flex-1 bg-gray-50 rounded-xl p-3 text-center border border-transparent hover:border-gray-200 transition-all"
                >
                  <p className="text-xl font-black text-black">
                    {v}<span className="text-[10px] ml-0.5 font-bold uppercase">cm</span>
                  </p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
                    {l as string}
                  </p>
                </div>
              ))}
            </div>
            {product.weight && (
              <p className="mt-4 text-sm text-gray-500">
                Weight: <span className="text-black font-bold ml-1">{product.weight} kg</span>
              </p>
            )}
          </div>
        )}

        {product.meta && (
          <div className="border border-gray-100 rounded-2xl p-6 shadow-sm">
            <p className="mb-4 text-xs font-bold text-black uppercase tracking-[0.7px]">
              Product Info
            </p>
            <div className="space-y-2">
              {product.meta.barcode && (
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-400 font-medium">Barcode:</span>
                  <span className="text-black font-semibold font-mono tracking-tighter">
                    {product.meta.barcode}
                  </span>
                </div>
              )}
              {product.meta.createdAt && (
                <div className="flex justify-between items-center text-[13px]">
                  <span className="text-gray-400 font-medium">Added on:</span>
                  <span className="text-black font-semibold">
                    {new Date(product.meta.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailsTab;