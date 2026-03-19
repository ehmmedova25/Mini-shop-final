import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/redux";
import { fetchBySearch } from "../store/slices/productsSlice";
import { searchProducts, type Product } from "../api/productApi";
import { useTotalItems } from "../hooks/useFilteredProducts";

const NAV = ["Shop", "Brands", "News", "onSale"];

export default function Navbar() {
  const navigate   = useNavigate();
  const dispatch   = useAppDispatch();
  const totalItems = useTotalItems();

  const [query,        setQuery]        = useState("");
  const [results,      setResults]      = useState<Product[]>([]);
  const [searching,    setSearching]    = useState(false);
  const [showDrop,     setShowDrop]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const searchRef       = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const timer           = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced search
  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!query.trim()) { setResults([]); setShowDrop(false); return; }
    timer.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await searchProducts(query);
        setResults(res.products.slice(0, 6));
        setShowDrop(true);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 350);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const outside =
        !searchRef.current?.contains(e.target as Node) &&
        !mobileSearchRef.current?.contains(e.target as Node);
      if (outside) setShowDrop(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const goProduct = (id: number) => {
    setQuery(""); setResults([]); setShowDrop(false); setMobileSearch(false);
    navigate(`/product/${id}`);
  };

  const goAllResults = () => {
    dispatch(fetchBySearch(query));
    setShowDrop(false); setMobileSearch(false);
    navigate("/category");
  };

  const clearSearch = () => { setQuery(""); setResults([]); setShowDrop(false); };

  // Shared dropdown list
  const Dropdown = () => (
    <div className="p-1.5">
      {results.map((p) => (
        <button
          key={p.id}
          onClick={() => goProduct(p.id)}
          className="flex items-center gap-2.5 w-full text-left px-3 py-2.5 rounded-xl border-none bg-transparent cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-[#F2F0F1] shrink-0">
            <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
          </div>
          <div className="min-w-0">
            <p className="m-0 text-[13px] font-semibold text-gray-900 truncate">{p.title}</p>
            <p className="m-0 text-xs text-gray-400">${p.price}</p>
          </div>
        </button>
      ))}
      <button
        onClick={goAllResults}
        className="w-full px-3 py-2.5 rounded-xl border-none bg-gray-100 text-gray-500 text-[13px] cursor-pointer mt-0.5 hover:bg-gray-200 transition-colors"
      >
        Bütün nəticələrə bax →
      </button>
    </div>
  );

  // Shared search input
  const SearchInput = ({ autoFocus = false }: { autoFocus?: boolean }) => (
    <div className="flex items-center w-full bg-gray-100 rounded-full px-4 py-2.5 gap-2">
      {/* Search icon */}
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setShowDrop(true)}
        placeholder="Search for products..."
        autoFocus={autoFocus}
        className="bg-transparent border-none outline-none text-sm text-gray-900 w-full placeholder-gray-400"
      />
      {searching && (
        <svg className="animate-spin shrink-0" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
          <path d="M21 12a9 9 0 11-6.22-8.56" />
        </svg>
      )}
      {query && !searching && (
        <button onClick={clearSearch} className="bg-transparent border-none cursor-pointer text-gray-400 p-0 flex hover:text-gray-600 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* ── Navbar ── */}
      <nav className="w-full bg-white border-b border-gray-100 sticky top-0 z-[100]">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4 sm:gap-6">

          {/* Hamburger – mobile only */}
          <button
            className="md:hidden p-1 hover:opacity-60 transition-opacity shrink-0 bg-transparent border-none cursor-pointer"
            onClick={() => setMobileOpen(true)}
            aria-label="Menyu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18" />
            </svg>
          </button>

          {/* Logo */}
          <a
            href="/"
            className="text-[22px] font-black text-gray-900 no-underline tracking-tight shrink-0"
            style={{ fontFamily: "'Integral CF','Satoshi',sans-serif" }}
          >
            SHOP.CO
          </a>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-5 shrink-0">
            {NAV.map((l) => (
              <button
                key={l}
                onClick={() => l === "Shop" && navigate("/category")}
                className="group relative text-[15px] font-medium text-gray-900 bg-transparent border-none cursor-pointer flex items-center gap-1 py-1 hover:opacity-70 transition-opacity"
              >
                {l}
                {l === "Shop" && (
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                )}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gray-900 transition-all duration-200 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Desktop search */}
          <div ref={searchRef} className="hidden md:flex flex-1 relative min-w-0">
            <SearchInput />
            {showDrop && results.length > 0 && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-gray-200 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-[200] overflow-hidden">
                <Dropdown />
              </div>
            )}
          </div>

          {/* Right icons */}
          <div className="flex items-center gap-1 shrink-0 ml-auto md:ml-0">

            {/* Search toggle – mobile only */}
            <button
              className="md:hidden p-1.5 bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
              onClick={() => setMobileSearch((p) => !p)}
              aria-label="Axtar"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8">
                <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
              </svg>
            </button>

            {/* Cart */}
            <a href="/cart" className="no-underline">
              <button className="relative p-1.5 bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity" aria-label="Səbət">
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-1 bg-red-500 text-white text-[10px] font-extrabold w-[17px] h-[17px] rounded-full flex items-center justify-center border-2 border-white leading-none">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>
            </a>

            {/* User – desktop only */}
            <button
              className="hidden md:flex p-1.5 bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
              aria-label="Hesab"
            >
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search bar – slides down */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileSearch ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div ref={mobileSearchRef} className="px-4 pb-3 relative">
            <SearchInput autoFocus={mobileSearch} />
            {showDrop && results.length > 0 && (
              <div className="absolute top-[calc(100%+2px)] left-4 right-4 bg-white border border-gray-200 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-[200] overflow-hidden">
                <Dropdown />
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[998] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-[280px] bg-white z-[999] flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <span className="text-[20px] font-black text-gray-900" style={{ fontFamily: "'Integral CF',sans-serif" }}>
            SHOP.CO
          </span>
          <button
            className="p-1.5 bg-transparent border-none cursor-pointer hover:opacity-60 transition-opacity"
            onClick={() => setMobileOpen(false)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Nav items */}
        <div className="flex flex-col px-2 py-3 flex-1 overflow-y-auto">
          {NAV.map((l) => (
            <button
              key={l}
              onClick={() => { setMobileOpen(false); navigate(l === "Shop" ? "/category" : "/"); }}
              className="flex items-center justify-between text-[15px] font-semibold text-gray-900 bg-transparent border-none px-4 py-3.5 cursor-pointer text-left w-full rounded-xl hover:bg-gray-50 transition-colors"
            >
              {l}
              {l === "Shop" && (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              )}
            </button>
          ))}
        </div>

        {/* Drawer footer – cart & account */}
        <div className="flex items-center gap-1 px-4 py-5 border-t border-gray-100">
          <a href="/cart" className="no-underline flex-1" onClick={() => setMobileOpen(false)}>
            <button className="relative flex items-center gap-2.5 w-full px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors bg-transparent border-none cursor-pointer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute top-2 left-10 bg-red-500 text-white text-[10px] font-extrabold w-[17px] h-[17px] rounded-full flex items-center justify-center border-2 border-white">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
              <span className="text-sm font-semibold text-gray-900">Səbət</span>
            </button>
          </a>
          <button className="flex items-center gap-2.5 flex-1 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors bg-transparent border-none cursor-pointer">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">Hesab</span>
          </button>
        </div>
      </div>
    </>
  );
}