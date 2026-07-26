import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { ArrowRight } from "lucide-react";

function EagleLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#4F46E5"/>
      <path d="M16 6C16 6 8.5 10.5 7 15C9.5 14 12.5 14 14.5 16L16 26L17.5 16C19.5 14 22.5 14 25 15C23.5 10.5 16 6 16 6Z" fill="white" fillOpacity="0.95"/>
    </svg>
  );
}

interface GlassNavbarProps {
  onLaunchPlanner?: () => void;
}

export function GlassNavbar({ onLaunchPlanner }: GlassNavbarProps) {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLaunch = onLaunchPlanner ?? (() => navigate("/workspace"));

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        justifyContent: "center",
        padding: isScrolled ? "12px 24px" : "24px",
        transition: "padding var(--transition-md)",
      }}
    >
      <div
        className="max-w-content"
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: isScrolled ? "56px" : "64px",
          background: isScrolled ? "rgba(10, 10, 12, 0.75)" : "transparent",
          backdropFilter: isScrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(20px)" : "none",
          border: isScrolled ? "1px solid var(--glass-border)" : "1px solid transparent",
          borderRadius: "999px",
          transition: "all var(--transition-md)",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          aria-label="Eagle Agentic AI home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            color: "var(--text-primary)",
          }}
        >
          <EagleLogo size={30} />
          <span style={{ fontWeight: 700, fontSize: "16px", letterSpacing: "-0.025em" }}>
            Eagle
          </span>
        </a>

        {/* Center Nav */}
        <nav style={{ display: "none", gap: "4px" }} className="md:flex">
          {["Features", "How it Works", "Agents", "Pricing", "Docs"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "all var(--transition)",
              }}
              onMouseEnter={(e) => {
                const el = e.target as HTMLAnchorElement;
                el.style.color = "var(--text-primary)";
                el.style.background = "var(--glass-bg)";
              }}
              onMouseLeave={(e) => {
                const el = e.target as HTMLAnchorElement;
                el.style.color = "var(--text-secondary)";
                el.style.background = "transparent";
              }}
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right side actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a
            href="#signin"
            style={{
              fontSize: "14px",
              fontWeight: 500,
              color: "var(--text-secondary)",
              textDecoration: "none",
              padding: "8px 16px",
            }}
            onMouseEnter={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--text-primary)")}
            onMouseLeave={(e) => ((e.target as HTMLAnchorElement).style.color = "var(--text-secondary)")}
          >
            Sign In
          </a>
          <button
            onClick={handleLaunch}
            id="launch-planner-btn"
            className="btn btn-primary"
            style={{ borderRadius: "12px", padding: "10px 22px", fontSize: "14px", fontWeight: 600 }}
          >
            Launch Planner
            <ArrowRight size={15} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
