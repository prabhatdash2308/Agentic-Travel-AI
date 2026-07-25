import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, LineChart, Globe2 } from "lucide-react";

const FEATURES = [
  {
    title: "Natural Language Planning",
    desc: "Speak naturally. Tell the AI your constraints, preferences, and dietary restrictions. The Orchestrator agent understands context and nuances that traditional search engines miss.",
    icon: Bot,
    visual: (
      <div style={{ position: "relative", width: "100%", height: "100%", background: "radial-gradient(circle at center, rgba(124,58,237,0.15) 0%, var(--surface-card) 70%)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <motion.div
          animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          style={{
            width: "60%", background: "var(--glass-bg-strong)", border: "1px solid var(--glass-border)", borderRadius: "16px", padding: "20px", backdropFilter: "blur(12px)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
          }}
        >
          <div style={{ width: "40%", height: "8px", background: "var(--border)", borderRadius: "4px", marginBottom: "16px" }} />
          <div style={{ width: "80%", height: "8px", background: "var(--border)", borderRadius: "4px", marginBottom: "12px" }} />
          <div style={{ width: "90%", height: "8px", background: "var(--accent)", borderRadius: "4px", marginBottom: "12px", opacity: 0.8 }} />
          <div style={{ width: "60%", height: "8px", background: "var(--border)", borderRadius: "4px" }} />
        </motion.div>
      </div>
    ),
  },
  {
    title: "Real-Time Tool Calling",
    desc: "Agentic Travel AI doesn't just hallucinate plans. It executes live API calls to airlines, hotel aggregators, and weather services to build deterministic, bookable itineraries.",
    icon: Globe2,
    visual: (
      <div style={{ position: "relative", width: "100%", height: "100%", background: "radial-gradient(circle at center, rgba(99,102,241,0.15) 0%, var(--surface-card) 70%)", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", width: "70%" }}>
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5], borderColor: ["var(--border)", "var(--indigo)", "var(--border)"] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
              style={{ background: "var(--surface-el)", border: "1px solid var(--border)", borderRadius: "12px", height: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <div style={{ width: "24px", height: "24px", borderRadius: "4px", background: "var(--glass-bg)" }} />
            </motion.div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Dynamic Budget Optimization",
    desc: "Set a hard cap and let the Budget Agent negotiate. It reallocates funds dynamically—if flights are expensive, it finds boutique hotels to ensure you never exceed your limit.",
    icon: LineChart,
    visual: (
      <div style={{ position: "relative", width: "100%", height: "100%", background: "radial-gradient(circle at center, rgba(34,197,94,0.15) 0%, var(--surface-card) 70%)", borderRadius: "24px", display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "hidden", padding: "40px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", height: "100%", width: "100%", justifyContent: "center" }}>
          {[40, 70, 45, 90, 60].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: "10%" }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.1, type: "spring" }}
              style={{
                width: "40px",
                background: i === 3 ? "var(--success)" : "var(--surface-el)",
                borderRadius: "8px 8px 0 0",
                border: "1px solid var(--border)",
                borderBottom: "none",
              }}
            />
          ))}
        </div>
      </div>
    ),
  },
];

function FeatureRow({ feature, index }: { feature: typeof FEATURES[0], index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "60px",
        alignItems: "center",
        marginBottom: index === FEATURES.length - 1 ? 0 : "120px",
      }}
      className="md:grid-cols-1"
    >
      {/* Visual Side */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -40 : 40 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? -40 : 40 }}
        transition={{ duration: 0.8 }}
        style={{
          height: "400px",
          order: isEven ? 1 : 2,
        }}
      >
        {feature.visual}
      </motion.div>

      {/* Text Side */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? 40 : -40 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 40 : -40 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        style={{
          order: isEven ? 2 : 1,
          padding: "0 20px",
        }}
      >
        <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "var(--accent-subtle)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "24px" }}>
          <feature.icon size={24} color="var(--accent-hover)" />
        </div>
        <h3 className="text-section" style={{ marginBottom: "20px" }}>{feature.title}</h3>
        <p className="text-body-lg text-secondary" style={{ marginBottom: "32px" }}>{feature.desc}</p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
          {[1, 2, 3].map((_, i) => (
            <li key={i} style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-primary)", fontSize: "15px", fontWeight: 500 }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent)" }} />
              Premium capability {i + 1}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}

export function FeaturesSection() {
  return (
    <section className="section-pad bg-mid" style={{ background: "var(--bg-mid)" }}>
      <div className="max-w-content">
        {FEATURES.map((feature, i) => (
          <FeatureRow key={i} feature={feature} index={i} />
        ))}
      </div>
    </section>
  );
}
