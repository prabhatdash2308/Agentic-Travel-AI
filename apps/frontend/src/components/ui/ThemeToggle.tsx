import { motion } from "framer-motion";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

interface ThemeToggleProps {
  variant?: "icon" | "full";
}

export function ThemeToggle({ variant = "icon" }: ThemeToggleProps) {
  const { resolvedTheme, theme, setTheme, toggleTheme } = useTheme();

  if (variant === "full") {
    const options: { value: "dark" | "light" | "system"; icon: React.ElementType; label: string }[] = [
      { value: "light", icon: Sun, label: "Light" },
      { value: "dark", icon: Moon, label: "Dark" },
      { value: "system", icon: Monitor, label: "System" },
    ];
    return (
      <div
        role="group"
        aria-label="Theme selection"
        style={{
          display: "inline-flex",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          padding: "3px",
          gap: "2px",
        }}
      >
        {options.map(({ value, icon: Icon, label }) => {
          const isActive = theme === value;
          return (
            <button
              key={value}
              onClick={() => setTheme(value)}
              aria-label={`${label} mode`}
              aria-pressed={isActive}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: "5px 10px",
                borderRadius: "7px",
                border: "none",
                background: isActive ? "var(--surface-card)" : "transparent",
                color: isActive ? "var(--text-primary)" : "var(--text-muted)",
                fontSize: "12px",
                fontWeight: isActive ? 600 : 400,
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "all var(--transition-md)",
                boxShadow: isActive ? "var(--shadow-xs)" : "none",
              }}
            >
              <Icon size={13} strokeWidth={isActive ? 2.5 : 1.75} />
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  // Icon-only toggle
  return (
    <motion.button
      onClick={toggleTheme}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      className="btn-icon"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        width: "36px",
        height: "36px",
        borderRadius: "10px",
      }}
    >
      <motion.div
        key={resolvedTheme}
        initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
        transition={{ duration: 0.2 }}
      >
        {resolvedTheme === "dark" ? (
          <Sun size={16} strokeWidth={1.75} />
        ) : (
          <Moon size={16} strokeWidth={1.75} />
        )}
      </motion.div>
    </motion.button>
  );
}
