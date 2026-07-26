import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  Zap,
  Clock,
  BookOpen,
  DollarSign,
  Info,
  LogIn,
  Moon,
  Sun,
  Home,
  ArrowRight,
  Command,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  group: string;
  shortcut?: string;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate();
  const { toggleTheme, resolvedTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const go = useCallback(
    (path: string) => {
      navigate(path);
      onClose();
    },
    [navigate, onClose]
  );

  const ALL_COMMANDS: CommandItem[] = [
    {
      id: "workspace",
      label: "Open Workspace",
      description: "Start planning a new trip",
      icon: Zap,
      action: () => go("/workspace"),
      group: "Navigation",
      shortcut: "W",
    },
    {
      id: "history",
      label: "View History",
      description: "Browse your past travel plans",
      icon: Clock,
      action: () => go("/history"),
      group: "Navigation",
      shortcut: "H",
    },
    {
      id: "home",
      label: "Go Home",
      description: "Return to landing page",
      icon: Home,
      action: () => go("/"),
      group: "Navigation",
    },
    {
      id: "docs",
      label: "Documentation",
      description: "Architecture, agents, API reference",
      icon: BookOpen,
      action: () => go("/docs"),
      group: "Navigation",
    },
    {
      id: "pricing",
      label: "Pricing",
      description: "Plans and billing",
      icon: DollarSign,
      action: () => go("/pricing"),
      group: "Navigation",
    },
    {
      id: "about",
      label: "About Eagle",
      description: "Mission, team, roadmap",
      icon: Info,
      action: () => go("/about"),
      group: "Navigation",
    },
    {
      id: "signin",
      label: "Sign In",
      description: "Access your account",
      icon: LogIn,
      action: () => go("/login"),
      group: "Account",
    },
    {
      id: "theme",
      label: resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      description: "Toggle color scheme",
      icon: resolvedTheme === "dark" ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      },
      group: "Preferences",
      shortcut: "T",
    },
  ];

  const filtered = query.trim()
    ? ALL_COMMANDS.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.description?.toLowerCase().includes(query.toLowerCase())
      )
    : ALL_COMMANDS;

  // Group items
  const groups = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    (acc[item.group] ??= []).push(item);
    return acc;
  }, {});

  // Flat list for keyboard navigation
  const flatItems = Object.values(groups).flat();

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        flatItems[activeIdx]?.action();
      }
    },
    [open, flatItems, activeIdx, onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmd-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          onClick={onClose}
        >
          <motion.div
            className="cmd-palette"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
              <Search
                size={16}
                color="var(--text-muted)"
                style={{ position: "absolute", left: "18px", flexShrink: 0 }}
              />
              <input
                ref={inputRef}
                className="cmd-input"
                placeholder="Search commands…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ paddingLeft: "46px" }}
                aria-label="Command palette search"
              />
              <kbd
                style={{
                  position: "absolute",
                  right: "16px",
                  padding: "3px 8px",
                  background: "var(--surface-el)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  fontSize: "11px",
                  color: "var(--text-muted)",
                  fontFamily: "var(--font-mono)",
                }}
              >
                ESC
              </kbd>
            </div>

            {/* Results */}
            <div style={{ maxHeight: "360px", overflowY: "auto", padding: "8px" }}>
              {flatItems.length === 0 ? (
                <div
                  style={{
                    textAlign: "center",
                    padding: "32px 16px",
                    color: "var(--text-muted)",
                    fontSize: "13.5px",
                  }}
                >
                  No commands match "{query}"
                </div>
              ) : (
                Object.entries(groups).map(([group, items]) => {
                  const groupStart = flatItems.findIndex((f) => f.id === items[0].id);
                  return (
                    <div key={group} style={{ marginBottom: "4px" }}>
                      <div
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--text-muted)",
                          padding: "8px 12px 4px",
                        }}
                      >
                        {group}
                      </div>
                      {items.map((item, i) => {
                        const globalIdx = groupStart + i;
                        const isActive = activeIdx === globalIdx;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.id}
                            className={`cmd-item ${isActive ? "active" : ""}`}
                            style={{
                              width: "100%",
                              borderRadius: "10px",
                              border: "none",
                              fontFamily: "inherit",
                              textAlign: "left",
                              background: isActive ? "var(--surface-el)" : "transparent",
                              cursor: "pointer",
                            }}
                            onClick={item.action}
                            onMouseEnter={() => setActiveIdx(globalIdx)}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "9px",
                                background: isActive ? "var(--accent-subtle)" : "var(--surface-2)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                flexShrink: 0,
                                transition: "all var(--transition)",
                              }}
                            >
                              <Icon
                                size={15}
                                color={isActive ? "var(--accent-hover)" : "var(--text-muted)"}
                                strokeWidth={1.75}
                              />
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div
                                style={{
                                  fontSize: "13.5px",
                                  fontWeight: 500,
                                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                                  lineHeight: 1.3,
                                }}
                              >
                                {item.label}
                              </div>
                              {item.description && (
                                <div
                                  style={{
                                    fontSize: "11.5px",
                                    color: "var(--text-muted)",
                                    marginTop: "1px",
                                  }}
                                >
                                  {item.description}
                                </div>
                              )}
                            </div>
                            {isActive && (
                              <ArrowRight size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer hint */}
            <div
              style={{
                borderTop: "1px solid var(--border)",
                padding: "10px 16px",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              {[
                { key: "↑↓", label: "Navigate" },
                { key: "↵", label: "Select" },
                { key: "Esc", label: "Close" },
              ].map(({ key, label }) => (
                <div
                  key={label}
                  style={{ display: "flex", alignItems: "center", gap: "5px" }}
                >
                  <kbd
                    style={{
                      padding: "2px 7px",
                      background: "var(--surface-el)",
                      border: "1px solid var(--border)",
                      borderRadius: "5px",
                      fontSize: "11px",
                      fontFamily: "var(--font-mono)",
                      color: "var(--text-muted)",
                    }}
                  >
                    {key}
                  </kbd>
                  <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{label}</span>
                </div>
              ))}
              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "5px" }}>
                <Command size={11} color="var(--text-muted)" />
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>K</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
