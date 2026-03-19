import { useState } from "react";

const ChevronDown = ({ isOpen }: { isOpen: boolean }) => (
  <svg 
    width="14" 
    height="14" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round"
    className={`transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`}
  >
    <path d="M6 9l6 6 6-6"/>
  </svg>
);

const SORT_OPTIONS = [
  "Most Popular",
  "Newest",
  "Top Rated",
  "Price: Low to High",
  "Price: High to Low",
];

interface SortBarProps {
  title: string;
  total: number;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const SortBar = ({ title, total, sortBy, onSortChange }: SortBarProps) => {
  const [showSort, setShowSort] = useState(false);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-black tracking-tighter uppercase leading-none">
          {title}
        </h1>
        <p className="mt-1.5 text-sm text-gray-400 font-medium">
          Showing <span className="text-black font-bold">{total}</span> Products
        </p>
      </div>

      <div className="relative flex items-center gap-2 self-end sm:self-auto">
        <span className="text-sm text-gray-400 font-medium hidden xs:inline">Sort by:</span>
        
        <button
          onClick={() => setShowSort((p) => !p)}
          className="flex items-center gap-2 py-2 px-1 text-sm font-bold text-black focus:outline-none group"
        >
          <span className="group-hover:text-gray-600 transition-colors">{sortBy}</span>
          <ChevronDown isOpen={showSort} />
        </button>

        {showSort && (
          <>
            <div 
              className="fixed inset-0 z-40 bg-black/5 sm:bg-transparent" 
              onClick={() => setShowSort(false)} 
            />
            
            <div className="absolute top-full right-0 mt-2 z-50 w-52 bg-white border border-gray-100 rounded-2xl p-2 shadow-xl shadow-black/5 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
              {SORT_OPTIONS.map((opt) => {
                const isActive = sortBy === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => {
                      onSortChange(opt);
                      setShowSort(false);
                    }}
                    className={`
                      flex items-center gap-3 w-full px-4 py-2.5 text-sm rounded-xl transition-all
                      ${isActive 
                        ? "bg-gray-50 text-black font-bold" 
                        : "text-gray-500 font-medium hover:bg-gray-50 hover:text-black"}
                    `}
                  >
                    {isActive && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                    <span className={isActive ? "ml-0" : "ml-6"}>{opt}</span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SortBar;