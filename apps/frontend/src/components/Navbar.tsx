import { MapPin, Zap } from "lucide-react";

export function Navbar() {
  return (
    <header
      role="banner"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        borderBottom: "1px solid var(--border)",
        background: "rgba(9,9,11,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div
        className="max-w-content"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: "64px",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          id="nav-logo"
          aria-label="Wayfarer home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "var(--text-primary)",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "10px",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(124,58,237,0.4)",
              flexShrink: 0,
            }}
          >
            <MapPin size={16} color="#fff" strokeWidth={2.5} />
          </div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "17px",
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            Wayfarer
          </span>
        </a>

        {/* Center nav */}
        <nav
          aria-label="Main navigation"
          style={{ display: "flex", alignItems: "center", gap: "4px" }}
        >
          {["Workspace", "History", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              id={`nav-${item.toLowerCase()}`}
              style={{
                padding: "6px 14px",
                borderRadius: "10px",
                fontSize: "13.5px",
                fontWeight: 500,
                color: "var(--text-muted)",
                textDecoration: "none",
                transition: "all var(--transition)",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLAnchorElement).style.color = "var(--text-primary)";
                (e.target as HTMLAnchorElement).style.background = "var(--surface-el)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLAnchorElement).style.color = "var(--text-muted)";
                (e.target as HTMLAnchorElement).style.background = "transparent";
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Status pill */}
          <div
            className="badge badge-done"
            style={{ gap: "6px", padding: "5px 12px" }}
            aria-label="System status: operational"
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--success)",
                animation: "pulse-dot 2s ease-in-out infinite",
              }}
            />
            <span style={{ fontSize: "12px", fontWeight: 500 }}>Operational</span>
          </div>

          {/* CTA */}
          <button
            id="nav-cta"
            className="btn btn-primary"
            style={{ padding: "8px 20px", fontSize: "13.5px", gap: "6px" }}
            aria-label="Get started with Wayfarer"
          >
            <Zap size={13} strokeWidth={2.5} />
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}
