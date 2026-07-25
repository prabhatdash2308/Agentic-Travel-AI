import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export function DashboardSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-pad relative" style={{ background: "var(--bg-deep)", overflow: "hidden" }}>
      <div className="section-glow" style={{ top: "50%", transform: "translate(-50%, -50%)" }} />
      
      <div className="max-w-content text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "60px" }}
        >
          <div className="text-label" style={{ color: "var(--accent-hover)", marginBottom: "16px" }}>
            Production Dashboard
          </div>
          <h2 className="text-display">
            A workspace designed <br />
            <span style={{ color: "var(--text-muted)" }}>for serious planning.</span>
          </h2>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 100, scale: 0.9 }}
          transition={{ duration: 1, type: "spring", damping: 20 }}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            background: "var(--bg)",
            borderRadius: "24px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg), 0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px rgba(0,0,0,0.8)",
            padding: "20px",
            display: "grid",
            gridTemplateColumns: "240px 1fr",
            gap: "20px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Mock Sidebar */}
          <div style={{ background: "var(--surface-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ height: "24px", width: "100px", background: "var(--surface-el)", borderRadius: "6px" }} />
            <div style={{ height: "1px", background: "var(--border)", margin: "8px 0" }} />
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} style={{ height: "32px", width: "100%", background: i === 2 ? "var(--glass-bg-strong)" : "transparent", borderRadius: "8px", display: "flex", alignItems: "center", padding: "0 12px" }}>
                <div style={{ height: "12px", width: i === 2 ? "80%" : "60%", background: i === 2 ? "var(--accent-hover)" : "var(--surface-el)", borderRadius: "4px" }} />
              </div>
            ))}
          </div>

          {/* Mock Main Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Header */}
            <div style={{ height: "64px", background: "var(--surface-card)", borderRadius: "16px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
               <div style={{ height: "16px", width: "200px", background: "var(--surface-el)", borderRadius: "4px" }} />
               <div style={{ display: "flex", gap: "12px" }}>
                 <div style={{ height: "32px", width: "100px", background: "var(--surface-el)", borderRadius: "8px" }} />
                 <div style={{ height: "32px", width: "32px", background: "var(--accent)", borderRadius: "8px" }} />
               </div>
            </div>

            {/* Grid Area */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }}>
              {/* Main Content */}
              <div style={{ background: "var(--surface-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
                 <div style={{ height: "24px", width: "150px", background: "var(--surface-el)", borderRadius: "4px" }} />
                 <div style={{ flex: 1, background: "var(--surface-2)", borderRadius: "8px", border: "1px solid var(--border)" }} />
                 <div style={{ height: "60px", background: "var(--surface-2)", borderRadius: "8px", border: "1px solid var(--border)" }} />
                 <div style={{ height: "60px", background: "var(--surface-2)", borderRadius: "8px", border: "1px solid var(--border)" }} />
              </div>

              {/* Sidebar Content */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <div style={{ flex: 1, background: "var(--surface-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
                   <div style={{ height: "16px", width: "100px", background: "var(--surface-el)", borderRadius: "4px" }} />
                   <div style={{ flex: 1, background: "var(--accent-subtle)", borderRadius: "8px", border: "1px dashed var(--accent)" }} />
                </div>
                <div style={{ flex: 1, background: "var(--surface-card)", borderRadius: "16px", border: "1px solid var(--border)" }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
