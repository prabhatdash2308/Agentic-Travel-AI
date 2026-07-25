import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface MetricCardProps {
  icon: ReactNode;
  value: number | string;
  label: string;
  suffix?: string;
  delay?: number;
}

function useCountUp(target: number, duration: number = 1200, delay: number = 0) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setCount(Math.round(eased * target));
        if (progress < 1) {
          rafRef.current = requestAnimationFrame(step);
        }
      };
      rafRef.current = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration, delay]);

  return count;
}

export function MetricCard({ icon, value, label, suffix = "", delay = 0 }: MetricCardProps) {
  const isNumeric = typeof value === "number";
  const displayCount = useCountUp(isNumeric ? (value as number) : 0, 1000, delay);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      role="article"
      aria-label={`${label}: ${value}${suffix}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "var(--surface-card)",
        border: `1px solid ${hovered ? "rgba(124,58,237,0.3)" : "var(--border)"}`,
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "all var(--transition-md)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        boxShadow: hovered
          ? "0 8px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(124,58,237,0.15)"
          : "var(--shadow-sm)",
        cursor: "default",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: "var(--accent-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-hover)",
          transition: "background var(--transition-md)",
        }}
      >
        {icon}
      </div>

      <div>
        <div
          style={{
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
            lineHeight: 1,
          }}
        >
          {isNumeric ? displayCount : value}
          {suffix && (
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted)", marginLeft: "2px" }}>
              {suffix}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--text-muted)",
            marginTop: "4px",
            letterSpacing: "0.01em",
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}
