import React, { useState, MouseEvent } from "react";

interface Props {
  src: string;
  zoomLevel?: number;
  magnifierSize?: number;
}

const ImageMagnifier: React.FC<Props> = ({ src, zoomLevel = 2.5, magnifierSize = 250 }) => {
  const [[x, y], setXY] = useState([0, 0]);
  const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
  const [showMagnifier, setShowMagnifier] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { top, left, width, height } = e.currentTarget.getBoundingClientRect();
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;
    setXY([x, y]);
    setSize([width, height]);
  };

  return (
    <div
      className="relative w-full h-full cursor-none overflow-hidden rounded-3xl bg-[#F2F0F1]"
      onMouseEnter={() => setShowMagnifier(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowMagnifier(false)}
    >
      <img 
        src={src} 
        className="w-full h-full object-contain p-4 md:p-8 mix-blend-multiply" 
        alt="product" 
      />

      {showMagnifier && (
        <div
          className="pointer-events-none absolute border-4 border-white rounded-full shadow-2xl md:block hidden transition-opacity duration-200"
          style={{
            height: `${magnifierSize}px`,
            width: `${magnifierSize}px`,
            top: `${y - magnifierSize / 2}px`,
            left: `${x - magnifierSize / 2}px`,
            backgroundImage: `url('${src}')`,
            backgroundRepeat: "no-repeat",
            backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
            backgroundPosition: `${-x * zoomLevel + magnifierSize / 2}px ${-y * zoomLevel + magnifierSize / 2}px`,
          }}
        />
      )}
    </div>
  );
};

export default ImageMagnifier;