import { useState } from "react";

/* ── Icons ── */
const TwitterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);
const GithubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);
const EmailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

/* ── Data ── */
const FOOTER_LINKS: Record<string, string[]> = {
  COMPANY:   ["About", "Features", "Works", "Career"],
  HELP:      ["Customer Support", "Delivery Details", "Terms & Conditions", "Privacy Policy"],
  FAQ:       ["Account", "Manage Deliveries", "Orders", "Payments"],
  RESOURCES: ["Free eBooks", "Development Tutorial", "How to - Blog", "Youtube Playlist"],
};

const SOCIALS = [
  { label: "Twitter",   icon: <TwitterIcon />,   dark: false },
  { label: "Facebook",  icon: <FacebookIcon />,  dark: true  },
  { label: "Instagram", icon: <InstagramIcon />, dark: false },
  { label: "Github",    icon: <GithubIcon />,    dark: false },
];

/* ════════════════════════════════════════
   Footer
════════════════════════════════════════ */
export default function Footer() {
  const [email, setEmail] = useState("");

  return (
    <footer className="bg-[#F0F0F0] font-sans">

      {/* ── Newsletter banner ── */}
      <div className="max-w-[1200px] mx-auto px-6 pt-12">
        <div className="bg-gray-900 rounded-2xl px-8 py-9 sm:px-12 flex flex-col sm:flex-row items-center justify-between gap-8">
          <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight uppercase leading-tight max-w-sm text-center sm:text-left">
            Stay Upto Date About Our Latest Offers
          </h2>

          <div className="flex flex-col gap-3 w-full sm:w-auto sm:min-w-[300px] sm:max-w-[380px]">
            {/* Email input */}
            <div className="bg-white rounded-full flex items-center gap-2.5 px-5 py-3">
              <EmailIcon />
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border-none outline-none text-sm text-gray-900 bg-transparent placeholder-gray-400"
              />
            </div>
            {/* Subscribe button */}
            <button className="bg-white text-gray-900 rounded-full py-3.5 text-[15px] font-semibold hover:bg-gray-100 transition-colors duration-200 tracking-wide">
              Subscribe to Newsletter
            </button>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr] gap-10">

        {/* Brand column — full width on mobile */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="text-[22px] font-black text-gray-900 tracking-tight mb-4">
            SHOP.CO
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mb-6 max-w-[200px]">
            We have clothes that suits your style and which you're proud to wear. From women to men.
          </p>

          {/* Social icons */}
          <div className="flex gap-2.5 items-center">
            {SOCIALS.map(({ label, icon, dark }) => (
              <button
                key={label}
                aria-label={label}
                className={[
                  "w-[34px] h-[34px] rounded-full border border-gray-300",
                  "flex items-center justify-center cursor-pointer",
                  "transition-colors duration-200",
                  dark
                    ? "bg-gray-900 text-white hover:bg-gray-700"
                    : "bg-white text-gray-900 hover:bg-gray-900 hover:text-white",
                ].join(" ")}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(FOOTER_LINKS).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-[13px] font-bold tracking-[2px] text-gray-900 uppercase mb-5">
              {title}
            </h4>
            <ul className="list-none m-0 p-0 flex flex-col gap-3">
              {links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-gray-500 no-underline hover:text-gray-900 transition-colors duration-150"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-gray-300">
        <div className="max-w-[1200px] mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 flex-wrap">
          <p className="text-[13px] text-gray-500 m-0">
            Shop.co © 2000-2023, All Rights Reserved
          </p>

          {/* Payment badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <PayBadge>
              <svg width="38" height="14" viewBox="0 0 38 14">
                <text x="0" y="12" fontFamily="sans-serif" fontWeight="900" fontSize="13" fill="#1A1F71">VISA</text>
              </svg>
            </PayBadge>

            <PayBadge>
              <svg width="32" height="20" viewBox="0 0 32 20">
                <circle cx="12" cy="10" r="10" fill="#EB001B"/>
                <circle cx="20" cy="10" r="10" fill="#F79E1B"/>
                <path d="M16 3.8a10 10 0 010 12.4A10 10 0 0116 3.8z" fill="#FF5F00"/>
              </svg>
            </PayBadge>

            <PayBadge>
              <svg width="50" height="14" viewBox="0 0 50 14">
                <text x="0" y="12" fontFamily="sans-serif" fontWeight="700" fontSize="12" fill="#003087">Pay</text>
                <text x="22" y="12" fontFamily="sans-serif" fontWeight="700" fontSize="12" fill="#009CDE">Pal</text>
              </svg>
            </PayBadge>

            <PayBadge>
              <svg width="44" height="16" viewBox="0 0 44 16">
                <text x="0" y="13" fontFamily="sans-serif" fontWeight="600" fontSize="12" fill="#111"> Pay</text>
              </svg>
            </PayBadge>

            <PayBadge>
              <svg width="60" height="16" viewBox="0 0 60 16">
                <text x="0" y="13" fontFamily="sans-serif" fontWeight="500" fontSize="12">
                  <tspan fill="#4285F4">G</tspan>
                  <tspan fill="#EA4335">o</tspan>
                  <tspan fill="#FBBC05">o</tspan>
                  <tspan fill="#4285F4">g</tspan>
                  <tspan fill="#34A853">le</tspan>
                  <tspan fill="#111"> Pay</tspan>
                </text>
              </svg>
            </PayBadge>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Payment badge wrapper ── */
function PayBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-md px-2 py-1 h-8 flex items-center justify-center">
      {children}
    </div>
  );
}