import React from 'react';
import heroImg from '../../assets/hero.jpg';

const HeroBanner: React.FC = () => {
  return (
    <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <section className="w-full bg-[#F2F0F1] overflow-hidden">
        <div className="flex flex-col md:flex-row items-stretch w-full">

          <div className="flex-1 flex flex-col justify-center px-6 py-10 md:pl-20 lg:pl-32 md:py-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tighter text-black uppercase">
              Find clothes <br /> that matches <br /> your style
            </h1>
            <p className="text-gray-600 text-sm md:text-base mt-4 mb-8 max-w-md">
              Browse through our diverse range of meticulously crafted garments, designed
              to bring out your individuality and cater to your sense of style.
            </p>

            <button className="w-full md:w-48 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-all mb-10">
              Shop Now
            </button>

            <div className="flex flex-wrap gap-6 md:gap-10">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-black">200+</h3>
                <p className="text-gray-500 text-xs">International Brands</p>
              </div>
              <div className="h-10 border-l border-gray-300 self-center hidden md:block" />
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-black">2,000+</h3>
                <p className="text-gray-500 text-xs">High-Quality Products</p>
              </div>
            </div>
          </div>

        
<div className="flex-1 relative min-h-[350px] md:h-[500px] lg:h-[600px] flex items-end justify-center md:justify-end overflow-hidden bg-[#F2F0F1]">
  <div className="absolute top-[10%] right-[12%] w-10 md:w-16 animate-pulse z-10">
    <svg viewBox="0 0 100 100" fill="black">
      <path d="M50 0L54 46L100 50L54 54L50 100L46 54L0 50L46 46L50 0Z" />
    </svg>
  </div>
  <div className="absolute top-[45%] left-[5%] w-7 md:w-10 z-10">
    <svg viewBox="0 0 100 100" fill="black">
      <path d="M50 0L54 46L100 50L54 54L50 100L46 54L0 50L46 46L50 0Z" />
    </svg>
  </div>

  <img
    src={heroImg}
    alt="Hero"
    className="w-full h-full object-contain object-bottom" 
  />
</div>
        </div>

        <div className="bg-black py-6 w-full">
          <div className="flex flex-wrap justify-center md:justify-around items-center gap-6 px-4">
            {["VERSACE", "ZARA", "GUCCI", "PRADA", "Calvin Klein"].map((brand) => (
              <span key={brand} className="text-white font-bold text-2xl md:text-3xl tracking-tight">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroBanner;