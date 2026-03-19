const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
    <path d="M9 18l6-6-6-6"/>
  </svg>
);

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "'Satoshi', 'Inter', sans-serif",
      }}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {index > 0 && <ChevronRight />}
            {isLast ? (
              <span style={{ fontSize: "13px", color: "#111", fontWeight: "500" }}>
                {item.label}
              </span>
            ) : (
              <a
                href={item.href || "#"}
                style={{
                  fontSize: "13px",
                  color: "#9CA3AF",
                  textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#111"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#9CA3AF"; }}
              >
                {item.label}
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
