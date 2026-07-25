import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const GitHub = ({ size = 24, color = "currentColor", ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Twitter = ({ size = 24, color = "currentColor", ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Linkedin = ({ size = 24, color = "currentColor", ...props }: any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function LandingFooter() {
  const columns = [
    {
      title: "Company",
      links: ["About", "Careers", "Contact"],
    },
    {
      title: "Developers",
      links: ["Documentation", "API Reference", "GitHub"],
    },
    {
      title: "Legal",
      links: ["Privacy", "Terms"],
    },
  ];

  return (
    <footer style={{ background: "var(--bg)", borderTop: "1px solid var(--border)", paddingTop: "80px", paddingBottom: "40px" }}>
      <div className="max-w-content px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

          {/* Brand Column */}
          <div>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", color: "var(--text-primary)", marginBottom: "20px" }}>
              <div style={{ width: "32px", height: "32px", borderRadius: "10px", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MapPin size={16} color="#fff" strokeWidth={2.5} />
              </div>
              <span style={{ fontWeight: 700, fontSize: "18px", letterSpacing: "-0.02em" }}>Agentic Travel</span>
            </Link>
            <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.6, maxWidth: "240px", marginBottom: "24px" }}>
              The autonomous AI travel planner capable of understanding natural language and coordinating multiple agents.
            </p>
            <div style={{ display: "flex", gap: "16px" }}>
              {[Twitter, GitHub, Linkedin].map((Icon, i) => (
                <a key={i} href="#" style={{ color: "var(--text-muted)", transition: "color var(--transition)" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--text-primary)")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-muted)")}>
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "20px" }}>{col.title}</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" style={{ fontSize: "14px", color: "var(--text-secondary)", textDecoration: "none", transition: "color var(--transition)" }} onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "var(--accent-hover)")} onMouseLeave={(e) => ((e.target as HTMLElement).style.color = "var(--text-secondary)")}>
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
          <div style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            &copy; {new Date().getFullYear()} Agentic Travel AI. All rights reserved.
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: "var(--text-muted)" }}>
            <span style={{ display: "inline-block", width: "8px", height: "8px", borderRadius: "50%", background: "var(--success)" }} />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
