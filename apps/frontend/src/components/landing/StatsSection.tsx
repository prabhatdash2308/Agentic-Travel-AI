import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { AnimatedStat } from "./AnimatedStat";

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
          {stats.map((stat, i) => (
            <AnimatedStat
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
