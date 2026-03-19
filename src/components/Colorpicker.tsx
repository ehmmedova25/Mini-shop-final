import React, { useState } from "react";

const genColors = (id: number): string[] => {
  const palettes = [
    ["#2C2C2C", "#F5F0EB", "#8B6F47", "#1A3A5C"],
    ["#111827", "#DC2626", "#059669", "#7C3AED"],
    ["#0F172A", "#F97316", "#0EA5E9", "#EC4899"],
    ["#1C1C1C", "#D4AF37", "#4A5568", "#E8E8E8"],
    ["#18181B", "#22C55E", "#3B82F6", "#F43F5E"],
  ];
  return palettes[id % palettes.length];
};

const COLOR_NAMES: Record<string, string> = {
  "#2C2C2C": "Charcoal", "#F5F0EB": "Cream",   "#8B6F47": "Camel",   "#1A3A5C": "Navy",
  "#111827": "Black",    "#DC2626": "Red",      "#059669": "Green",   "#7C3AED": "Purple",
  "#0F172A": "Midnight", "#F97316": "Orange",   "#0EA5E9": "Sky",     "#EC4899": "Pink",
  "#1C1C1C": "Onyx",     "#D4AF37": "Gold",     "#4A5568": "Slate",   "#E8E8E8": "White",
  "#18181B": "Jet",      "#22C55E": "Lime",     "#3B82F6": "Blue",    "#F43F5E": "Rose",
};

interface Props {
  productId: number;
  onChange?: (color: string) => void;
}

const ColorPicker: React.FC<Props> = ({ productId, onChange }) => {
  const colors = genColors(productId);
  const [selected, setSelected] = useState<string>(colors[0]);

  const handlePick = (color: string) => {
    setSelected(color);
    onChange?.(color);
  };

  return (
    <div className="mb-6 animate-fadeIn">
      <p className="text-sm font-bold text-black mb-3 tracking-tight">
        Select Color —{" "}
        <span className="font-medium text-gray-500 italic">
          {COLOR_NAMES[selected] ?? selected}
        </span>
      </p>

      <div className="flex items-center gap-3.5">
        {colors.map((color) => {
          const isSelected = selected === color;
          const isLightColor = color === "#E8E8E8" || color === "#F5F0EB";

          return (
            <button
              key={color}
              onClick={() => handlePick(color)}
              title={COLOR_NAMES[color] ?? color}
              className={`
                relative w-9 h-9 rounded-full transition-all duration-200 ease-in-out
                hover:scale-110 active:scale-90 shrink-0
                ${isSelected ? "ring-2 ring-black ring-offset-2" : "ring-1 ring-transparent hover:ring-gray-300"}
                ${isLightColor ? "border border-gray-200" : "border-none"}
              `}
              style={{ backgroundColor: color }}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <svg 
                    width="14" 
                    height="14" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke={isLightColor ? "black" : "white"} 
                    strokeWidth="3.5" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ColorPicker;