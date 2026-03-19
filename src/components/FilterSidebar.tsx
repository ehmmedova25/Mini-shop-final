import { useState, useEffect } from "react";
import { getCategories } from "../api/productApi";
import { type FilterState } from "../store/slices/productsSlice";

/* ── Icons ── */
const ChevRight = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>;
const ChevDown  = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 9l6 6 6-6"/></svg>;
const ChevUp    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 15l-6-6-6 6"/></svg>;
const FiltIco   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>;
const XIco      = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>;
const CheckIco   = () => <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;

/* ── Constants ── */
export const COLORS = [
  { name: "Green",  hex: "#4CAF50" }, { name: "Red",    hex: "#F44336" },
  { name: "Yellow", hex: "#FFC107" }, { name: "Orange", hex: "#FF9800" },
  { name: "Cyan",   hex: "#00BCD4" }, { name: "Blue",   hex: "#2196F3" },
  { name: "Purple", hex: "#9C27B0" }, { name: "Pink",   hex: "#E91E63" },
  { name: "White",  hex: "#FFFFFF" }, { name: "Black",  hex: "#111111" },
];
export const SIZES  = ["XX-Small","X-Small","Small","Medium","Large","X-Large","XX-Large","3X-Large","4X-Large"];
export const STYLES = ["Casual", "Formal", "Party", "Gym"];

/* ── Helpers ── */
const fmt = (s: string) =>
  s.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const activeCount = (f: FilterState) =>
  f.selectedColors.length +
  f.selectedSizes.length +
  f.selectedStyles.length +
  (f.selectedCategory ? 1 : 0) +
  (f.minRating > 0 ? 1 : 0) +
  (f.priceRange[0] > 0 || f.priceRange[1] < 1500 ? 1 : 0);

/* ── Props ── */
interface Props {
  filters: FilterState;
  onFilterChange: (f: FilterState) => void;
  onReset: () => void;
}

/* ════════════════════════════════════════
    FilterSidebar
════════════════════════════════════════ */
export default function FilterSidebar({ filters, onFilterChange, onReset }: Props) {
  const [categories, setCategories] = useState<string[]>([]);
  const [open, setOpen] = useState({ price: true, rating: true, colors: true, size: true, style: true });

  useEffect(() => { getCategories().then(setCategories).catch(() => {}); }, []);

  const tog = (k: keyof typeof open) => setOpen((p) => ({ ...p, [k]: !p[k] }));
  const set = (patch: Partial<FilterState>) => onFilterChange({ ...filters, ...patch });

  const toggleArr = (key: "selectedColors" | "selectedSizes" | "selectedStyles", val: string) => {
    const arr = filters[key] as string[];
    set({ [key]: arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val] });
  };

  const count = activeCount(filters);

  return (
    <aside className="border border-gray-200 rounded-2xl p-5 bg-white">

      {/* ── Header ── */}
      <div className="flex justify-between items-center mb-3.5 border-b border-gray-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-black text-black tracking-tight uppercase">Filters</span>
          {count > 0 && (
            <span className="bg-black text-white text-[11px] font-bold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        <FiltIco />
      </div>

      {/* ── Active tags ── */}
      {count > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {filters.selectedCategory && (
            <ActiveTag label={fmt(filters.selectedCategory)} onRemove={() => set({ selectedCategory: "" })} />
          )}
          {filters.selectedStyles.map((s) => (
            <ActiveTag key={s} label={s} onRemove={() => toggleArr("selectedStyles", s)} />
          ))}
          {filters.selectedColors.map((c) => (
            <ActiveTag
              key={c}
              label={c}
              dot={COLORS.find((x) => x.name === c)?.hex}
              onRemove={() => toggleArr("selectedColors", c)}
            />
          ))}
          {filters.selectedSizes.map((s) => (
            <ActiveTag key={s} label={s} onRemove={() => toggleArr("selectedSizes", s)} />
          ))}
          {filters.minRating > 0 && (
            <ActiveTag label={`${filters.minRating}+ Stars`} onRemove={() => set({ minRating: 0 })} />
          )}
          {(filters.priceRange[0] > 0 || filters.priceRange[1] < 1500) && (
            <ActiveTag
              label={`$${filters.priceRange[0]}–$${filters.priceRange[1]}`}
              onRemove={() => set({ priceRange: [0, 1500] })}
            />
          )}
        </div>
      )}

      {/* ── Category ── */}
      <div className="border-b border-gray-100 pb-2 mb-2">
        <p className="text-[11px] font-bold text-gray-400 tracking-wider uppercase mb-1.5">Category</p>
        <CategoryBtn active={!filters.selectedCategory} onClick={() => set({ selectedCategory: "" })} label="All Products" />
        {categories.map((cat) => (
          <CategoryBtn
            key={cat}
            active={filters.selectedCategory === cat}
            onClick={() => set({ selectedCategory: cat })}
            label={fmt(cat)}
          />
        ))}
      </div>

      {/* ── Price ── */}
      <Section title="Price Range" open={open.price} onToggle={() => tog("price")}>
        <div className="py-2 pb-3">
          <DualRange
            min={0} max={1500}
            lo={filters.priceRange[0]} hi={filters.priceRange[1]}
            onChange={(lo, hi) => set({ priceRange: [lo, hi] })}
          />
          <div className="flex justify-between mt-1 px-1">
            <span className="text-[13px] font-bold text-black">${filters.priceRange[0]}</span>
            <span className="text-[13px] font-bold text-black">${filters.priceRange[1]}</span>
          </div>
        </div>
      </Section>

      {/* ── Rating ── */}
      <Section title="Min Rating" open={open.rating} onToggle={() => tog("rating")}>
        <div className="py-1.5 pb-3 flex flex-col gap-0.5">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              onClick={() => set({ minRating: filters.minRating === r ? 0 : r })}
              className="flex items-center gap-2 py-2 w-full border-none bg-transparent cursor-pointer group transition-all"
            >
              <MiniStars n={r} active={filters.minRating >= r} />
              <span className={`text-[13px] transition-colors ${filters.minRating === r ? "font-bold text-black" : "text-gray-500 group-hover:text-black"}`}>
                {r}+ Stars
              </span>
              {filters.minRating === r && (
                <span className="ml-auto w-4 h-4 rounded-full bg-black flex items-center justify-center">
                  <CheckIco />
                </span>
              )}
            </button>
          ))}
        </div>
      </Section>

      {/* ── Colors ── */}
      <Section title="Color" open={open.colors} onToggle={() => tog("colors")}>
        <div className="flex flex-wrap gap-2.5 py-2.5 pb-4">
          {COLORS.map(({ name, hex }) => {
            const sel = filters.selectedColors.includes(name);
            return (
              <button
                key={name}
                title={name}
                onClick={() => toggleArr("selectedColors", name)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all duration-150 border-0"
                style={{
                  background: hex,
                  border: sel ? "3.5px solid #111" : "2px solid #E5E7EB",
                  boxShadow: sel ? "0 0 0 2px #fff inset" : "none",
                }}
              >
                {sel && (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                    stroke={name === "White" ? "#111" : "#fff"} strokeWidth="4" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Size ── */}
      <Section title="Size" open={open.size} onToggle={() => tog("size")}>
        <div className="flex flex-wrap gap-1.5 py-2.5 pb-4">
          {SIZES.map((s) => {
            const sel = filters.selectedSizes.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleArr("selectedSizes", s)}
                className={[
                  "px-3.5 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all duration-150",
                  sel
                    ? "bg-black text-white border border-black"
                    : "bg-gray-100 text-gray-500 border border-transparent hover:bg-gray-200 hover:text-black",
                ].join(" ")}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Dress Style ── */}
      <Section title="Dress Style" open={open.style} onToggle={() => tog("style")}>
        <div className="flex flex-wrap gap-2 py-2.5 pb-4">
          {STYLES.map((s) => {
            const sel = filters.selectedStyles.includes(s);
            return (
              <button
                key={s}
                onClick={() => toggleArr("selectedStyles", s)}
                className={[
                  "px-4 py-2 rounded-full text-[13px] font-bold cursor-pointer transition-all duration-150 w-full text-left flex justify-between items-center group",
                  sel
                    ? "bg-gray-50 text-black font-bold"
                    : "bg-transparent text-gray-500 hover:text-black",
                ].join(" ")}
              >
                <span>{s}</span>
                {sel ? <CheckIco /> : <ChevRight />}
              </button>
            );
          })}
        </div>
      </Section>

      {/* ── Reset ── */}
      {count > 0 && (
        <button
          onClick={onReset}
          className="w-full mt-4 py-3 rounded-full bg-black text-white text-[13px] font-bold border border-black cursor-pointer hover:bg-white hover:text-black transition-all duration-200 shadow-lg shadow-black/5 active:scale-[0.98]"
        >
          Reset Filters ({count})
        </button>
      )}
    </aside>
  );
}

/* ════════════════════════════════════════
    Sub-components
════════════════════════════════════════ */

function Section({
  title, open, onToggle, children,
}: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100 last:border-none">
      <button
        onClick={onToggle}
        className="flex justify-between items-center w-full py-4 bg-transparent cursor-pointer text-black hover:opacity-70 transition-opacity"
      >
        <span className="text-[16px] font-black uppercase tracking-tight">{title}</span>
        {open ? <ChevUp /> : <ChevDown />}
      </button>
      {open && <div className="animate-fadeIn">{children}</div>}
    </div>
  );
}

function CategoryBtn({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex justify-between items-center w-full py-2.5 border-none bg-transparent text-[14px] cursor-pointer text-left transition-all duration-150 group",
        active ? "font-bold text-black" : "text-gray-500 hover:text-black hover:pl-1",
      ].join(" ")}
    >
      <span>{label}</span>
      {active ? <CheckIco /> : <ChevRight />}
    </button>
  );
}

function ActiveTag({
  label, dot, onRemove,
}: {
  label: string; dot?: string; onRemove: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-gray-100 rounded-full text-[11px] font-bold text-black border border-gray-200">
      {dot && (
        <span
          className="w-2 h-2 rounded-full border border-gray-300 inline-block"
          style={{ background: dot }}
        />
      )}
      {label}
      <button
        onClick={onRemove}
        className="flex items-center bg-gray-200 hover:bg-black hover:text-white rounded-full p-0.5 cursor-pointer text-gray-500 transition-all"
      >
        <XIco />
      </button>
    </span>
  );
}

function MiniStars({ n, active }: { n: number; active: boolean }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 16 16">
          <path
            d="M8 1.5L9.854 5.756L14.5 6.382L11.25 9.494L12.118 14.118L8 11.885L3.882 14.118L4.75 9.494L1.5 6.382L6.146 5.756L8 1.5Z"
            fill={i <= n && active ? "#FFC633" : i <= n ? "#FFC63355" : "#E5E7EB"}
          />
        </svg>
      ))}
    </div>
  );
}

function DualRange({
  min, max, lo, hi, onChange,
}: {
  min: number; max: number; lo: number; hi: number;
  onChange: (lo: number, hi: number) => void;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  return (
    <div className="relative h-8 my-2">
      <div className="absolute top-1/2 left-0 right-0 h-[4px] bg-gray-100 rounded-full -translate-y-1/2" />
      <div
        className="absolute top-1/2 h-[4px] bg-black rounded-full -translate-y-1/2"
        style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
      />
      <input
        type="range" min={min} max={max} value={lo} step="1"
        onChange={(e) => onChange(Math.min(+e.target.value, hi - 10), hi)}
        className="absolute w-full h-[4px] bg-transparent pointer-events-none top-1/2 -translate-y-1/2 m-0 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
      />
      <input
        type="range" min={min} max={max} value={hi} step="1"
        onChange={(e) => onChange(lo, Math.max(+e.target.value, lo + 10))}
        className="absolute w-full h-[4px] bg-transparent pointer-events-none top-1/2 -translate-y-1/2 m-0 appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-[18px] [&::-webkit-slider-thumb]:h-[18px] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:border-[3px] [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md"
      />
    </div>
  );
}