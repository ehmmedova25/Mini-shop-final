import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { removeFromCart, updateQuantity, clearCart, type CartItem } from "../../store/slices/cartSlice";
import { useTotalPrice } from "../../hooks/useFilteredProducts";
import Breadcrumb from "../../components/Breadcrumb";

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14H6L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4h6v2"/>
  </svg>
);

const CartEmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <path d="M16 10a4 4 0 01-8 0"/>
  </svg>
);

export default function CartPage() {
  const dispatch   = useAppDispatch();
  const items      = useAppSelector((s) => s.cart.items);
  const totalItems = useAppSelector((s) => s.cart.items.reduce((sum, i) => sum + i.quantity, 0));
  const totalPrice = useTotalPrice();

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
        </div>
        <div className="flex flex-col items-center justify-center py-28 px-6 text-center">
          <div className="mb-6"><CartEmptyIcon /></div>
          <h2 className="text-2xl font-black text-gray-900 m-0 mb-2.5">Your cart is empty</h2>
          <p className="text-[15px] text-gray-400 m-0 mb-8">You haven't added anything yet.</p>
          <a
            href="/category"
            className="px-10 py-4 rounded-full bg-gray-900 text-white no-underline text-[15px] font-bold hover:bg-gray-700 transition-colors duration-150"
          >
            Start Shopping
          </a>
        </div>
      </div>
    );
  }

  const shipping   = totalPrice >= 100 ? 0 : 9.99;
  const tax        = totalPrice * 0.1;
  const orderTotal = totalPrice + shipping + tax;

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6 pb-20">

      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Cart" }]} />
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-7">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight m-0">
          Your Cart{" "}
          <span className="text-base font-normal text-gray-400">({totalItems} items)</span>
        </h1>
        <button
          onClick={() => dispatch(clearCart())}
          className="text-[13px] text-gray-400 bg-transparent border border-gray-200 cursor-pointer px-4 py-2 rounded-full hover:text-red-500 hover:border-red-400 transition-all duration-150"
        >
          Clear all
        </button>
      </div>

      {/* Grid: items + summary */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">

        {/* ── Cart items ── */}
        <div className="border border-gray-200 rounded-2xl px-4 sm:px-6 py-1">
          {items.map((item: CartItem) => {
            const key = `${item.id}-${item.selectedSize}-${item.selectedColor}`;
            return (
              <div key={key} className="flex gap-4 py-5 border-b border-gray-100 last:border-b-0 items-start">

                <a href={`/product/${item.id}`} className="shrink-0 no-underline">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-[#F2F0F1]">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </a>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <a href={`/product/${item.id}`} className="no-underline">
                      <h3 className="text-[15px] font-bold text-gray-900 m-0 leading-snug hover:text-gray-600 transition-colors">
                        {item.title}
                      </h3>
                    </a>
                    <span className="text-[17px] font-black text-gray-900 shrink-0">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  {(item.selectedSize || item.selectedColor) && (
                    <div className="flex gap-3 mb-1.5">
                      {item.selectedSize && (
                        <span className="text-xs text-gray-400">
                          Size: <b className="text-gray-900">{item.selectedSize}</b>
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="text-xs text-gray-400">
                          Color: <b className="text-gray-900">{item.selectedColor}</b>
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-xs text-gray-400 m-0 mb-3">
                    ${item.price.toFixed(2)} / each
                  </p>

                  {/* Qty + Remove */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5 border border-gray-200 rounded-full px-2.5 py-1">
                      <button
                        onClick={() => dispatch(updateQuantity({
                          id: item.id, quantity: item.quantity - 1,
                          selectedSize: item.selectedSize, selectedColor: item.selectedColor,
                        }))}
                        className="w-7 h-7 rounded-full border border-gray-200 bg-transparent cursor-pointer text-lg flex items-center justify-center text-gray-900 hover:bg-gray-100 hover:border-gray-900 transition-all duration-150"
                      >
                        −
                      </button>
                      <span className="text-[15px] font-bold text-gray-900 min-w-[18px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => dispatch(updateQuantity({
                          id: item.id, quantity: item.quantity + 1,
                          selectedSize: item.selectedSize, selectedColor: item.selectedColor,
                        }))}
                        className="w-7 h-7 rounded-full border border-gray-200 bg-transparent cursor-pointer text-lg flex items-center justify-center text-gray-900 hover:bg-gray-100 hover:border-gray-900 transition-all duration-150"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => dispatch(removeFromCart({
                        id: item.id,
                        selectedSize: item.selectedSize,
                        selectedColor: item.selectedColor,
                      }))}
                      className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-gray-400 text-[13px] p-0 hover:text-red-500 transition-colors duration-150"
                    >
                      <TrashIcon /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Order summary ── */}
        <div className="border border-gray-200 rounded-2xl p-5 sm:p-6 lg:sticky lg:top-[88px]">
          <h2 className="text-lg font-black text-gray-900 m-0 mb-5">Order Summary</h2>

          <SummaryRow label={`Subtotal (${totalItems})`} value={`$${totalPrice.toFixed(2)}`} />
          <SummaryRow
            label="Shipping"
            value={shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
            valueClass={shipping === 0 ? "text-green-600" : "text-gray-900"}
          />

          {shipping === 0 ? (
            <p className="text-xs text-green-600 -mt-1 mb-2">✓ You qualify for free shipping!</p>
          ) : (
            <p className="text-xs text-gray-400 -mt-1 mb-2">
              Add ${(100 - totalPrice).toFixed(2)} more for free shipping!
            </p>
          )}

          <SummaryRow label="Tax (10%)" value={`$${tax.toFixed(2)}`} />

          <div className="border-t border-gray-200 pt-4 mt-2 mb-5">
            <div className="flex justify-between items-center">
              <span className="text-[17px] font-black text-gray-900">Total</span>
              <span className="text-[22px] font-black text-gray-900">${orderTotal.toFixed(2)}</span>
            </div>
          </div>

          <button className="w-full py-4 rounded-full bg-gray-900 text-white border-none text-[15px] font-bold cursor-pointer hover:opacity-85 transition-opacity duration-150">
            Checkout →
          </button>

         
        </div>
      </div>
    </div>
  );
}

interface SummaryRowProps {
  label: string;
  value: string;
  valueClass?: string;
}

function SummaryRow({ label, value, valueClass = "text-gray-900" }: SummaryRowProps) {
  return (
    <div className="flex justify-between items-center py-2.5">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-bold ${valueClass}`}>{value}</span>
    </div>
  );
}