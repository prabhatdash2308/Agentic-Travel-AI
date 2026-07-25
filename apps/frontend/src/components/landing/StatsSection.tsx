import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

// Hook for counting animation
function useCountUp(target: number, inView: boolean, duration: number = 2000) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    if (!inView) return;
    
    let start = 0;
    let animationFrameId: number;
    
    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // easeOutCubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeProgress * target));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    
    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [target, inView, duration]);
  
  return count;
}

export function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const badges = [
    "AI Powered",
    "Real-time",
    "Multi-Agent",
    "Production Ready",
    "Open Source",
  ];

  const stats = [
    { value: 50, suffix: "k+", label: "Trips Planned" },
    { value: 1, suffix: ".8s", label: "Execution Speed", isFloat: true },
    { value: 99, suffix: ".2%", label: "Agent Success Rate" },
    { value: 12, suffix: "", label: "Autonomous Agents" },
  ];

  return (
    <section className="section-pad-sm" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-mid)" }}>
      <div className="max-w-content" ref={ref}>
        {/* Trust Badges */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "12px", marginBottom: "60px" }}>
          {badges.map((badge, i) => (
            <motion.div
              key={badge}
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "999px",
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--text-secondary)",
              }}
            >
              <CheckCircle2 size={14} color="var(--success)" />
              {badge}
            </motion.div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center">
          {stats.map((stat, i) => {
            const count = useCountUp(stat.value, isInView);
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.6 }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(36px, 5vw, 56px)",
                    fontWeight: 700,
                    letterSpacing: "-0.03em",
                    color: "var(--text-primary)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {count}{stat.suffix}
                </div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
