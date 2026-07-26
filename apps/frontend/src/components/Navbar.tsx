import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Clock,
  BookOpen,
  DollarSign,
  Info,
  LogIn,
  Menu,
  X,
  Command,
} from "lucide-react";
import { ThemeToggle } from "./ui/ThemeToggle";

// Eagle logo SVG
function EagleLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="var(--accent)" />
      <path
        d="M16 6C16 6 8.5 10.5 7 15C9.5 14 12.5 14 14.5 16L16 26L17.5 16C19.5 14 22.5 14 25 15C23.5 10.5 16 6 16 6Z"
        fill="white"
        fillOpacity="0.95"
      />
    </svg>
  );
}

const NAV_ITEMS = [
  { label: "Workspace", path: "/workspace", icon: Zap },
  { label: "History", path: "/history", icon: Clock },
  { label: "Docs", path: "/docs", icon: BookOpen },
  { label: "Pricing", path: "/pricing", icon: DollarSign },
  { label: "About", path: "/about", icon: Info },
];

interface AppNavbarProps {
  onOpenCommandPalette?: () => void;
}

export function Navbar({ onOpenCommandPalette }: AppNavbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onOpenCommandPalette?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onOpenCommandPalette]);

  return (
    <>
      <header
        role="banner"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border)",
          background: "rgba(9,9,11,0.88)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          transition: "background var(--transition-md)",
        }}
        className="light-header"
      >
        <div
          className="max-w-content"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            height: "60px",
          }}
        >
          {/* Logo */}
          <Link
            to="/"
            id="nav-logo"
            aria-label="Eagle Agentic AI home"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
              color: "var(--text-primary)",
              flexShrink: 0,
            }}
          >
            <EagleLogo size={28} />
            <span
              style={{
                fontWeight: 700,
                fontSize: "16px",
                letterSpacing: "-0.025em",
                color: "var(--text-primary)",
              }}
            >
              Eagle
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav
            aria-label="Main navigation"
            style={{ display: "flex", alignItems: "center", gap: "2px" }}
            className="desktop-nav"
          >
            {NAV_ITEMS.map(({ label, path }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  id={`nav-${label.toLowerCase()}`}
                  style={{
                    padding: "6px 13px",
                    borderRadius: "9px",
                    fontSize: "13.5px",
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                    textDecoration: "none",
                    background: isActive ? "var(--surface-el)" : "transparent",
                    transition: "all var(--transition)",
                    letterSpacing: "-0.01em",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--text-secondary)";
                      e.currentTarget.style.background = "var(--surface-2)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = "var(--text-muted)";
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                  aria-current={isActive ? "page" : undefined}
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      style={{
                        position: "absolute",
                        bottom: "2px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        background: "var(--accent)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Cmd palette trigger */}
            {onOpenCommandPalette && (
              <button
                onClick={onOpenCommandPalette}
                className="btn-icon"
                aria-label="Open command palette (Ctrl+K)"
                style={{ width: "36px", height: "36px" }}
              >
                <Command size={15} strokeWidth={1.75} />
              </button>
            )}

            <ThemeToggle variant="icon" />

            {/* Status */}
            <div
              className="badge badge-done"
              style={{ gap: "5px", padding: "4px 10px" }}
              aria-label="System status: all systems operational"
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "var(--success)",
                  animation: "pulse-dot 2.5s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: "11px", fontWeight: 600 }}>Live</span>
            </div>

            <Link
              to="/login"
              id="nav-signin"
              className="btn btn-ghost"
              style={{ padding: "7px 16px", fontSize: "13px", borderRadius: "10px" }}
            >
              <LogIn size={14} strokeWidth={1.75} />
              Sign in
            </Link>

            <Link
              to="/workspace"
              id="nav-cta"
              className="btn btn-primary"
              style={{ padding: "8px 18px", fontSize: "13px", borderRadius: "10px", gap: "6px" }}
              aria-label="Launch Eagle planner"
            >
              <Zap size={13} strokeWidth={2.5} />
              Launch
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="btn-icon mobile-menu-btn"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "fixed",
              top: "60px",
              left: 0,
              right: 0,
              zIndex: 49,
              background: "var(--surface-card)",
              borderBottom: "1px solid var(--border)",
              overflow: "hidden",
            }}
          >
            <nav style={{ padding: "12px 20px 20px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {NAV_ITEMS.map(({ label, path, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      textDecoration: "none",
                      background: isActive ? "var(--accent-subtle)" : "transparent",
                      color: isActive ? "var(--accent-hover)" : "var(--text-secondary)",
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "15px",
                      transition: "all var(--transition)",
                    }}
                  >
                    <Icon size={18} strokeWidth={1.75} />
                    {label}
                  </Link>
                );
              })}
              <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }} />
              <button
                onClick={() => { navigate("/login"); setMobileOpen(false); }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  borderRadius: "12px",
                  border: "none",
                  background: "transparent",
                  color: "var(--text-secondary)",
                  fontWeight: 500,
                  fontSize: "15px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  textAlign: "left",
                  width: "100%",
                }}
              >
                <LogIn size={18} strokeWidth={1.75} />
                Sign in
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .light-header {
          background: rgba(250,250,250,0.88) !important;
        }
        html.dark .light-header {
          background: rgba(9,9,11,0.88) !important;
        }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-menu-btn { display: none !important; }
        }
        .light #nav-logo span,
        .light .desktop-nav a {
          color: var(--text-primary);
        }
      `}</style>
    </>
  );
}
