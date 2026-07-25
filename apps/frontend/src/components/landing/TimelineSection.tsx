import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const TIMELINE = [
  { title: "Understanding Request", desc: "Parsing natural language intent", status: "done", time: "0.2s" },
  { title: "Planning Strategy", desc: "Breaking down into 14 parallel subtasks", status: "done", time: "0.5s" },
  { title: "Searching Flights", desc: "Querying 3 major airline APIs", status: "done", time: "1.2s" },
  { title: "Comparing Hotels", desc: "Filtering by location and guest reviews", status: "done", time: "1.4s" },
  { title: "Budget Optimization", desc: "Re-allocating funds to activities", status: "active", time: "Running" },
  { title: "Weather Analysis", desc: "Checking historical patterns", status: "pending", time: "-" },
  { title: "Generating Itinerary", desc: "Drafting final day-by-day plan", status: "pending", time: "-" },
];

export function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-pad bg-mid" style={{ background: "var(--bg-mid)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-content" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-label" style={{ color: "var(--accent-hover)", marginBottom: "16px" }}>
              Live Execution
            </div>
            <h2 className="text-display" style={{ marginBottom: "24px" }}>
              Radical transparency <br />
              <span style={{ color: "var(--text-muted)" }}>in every step.</span>
            </h2>
            <p className="text-body-lg text-secondary" style={{ marginBottom: "32px" }}>
              Watch exactly how your trip is built. Our Linear-inspired timeline shows real-time progress, API latencies, and agent handoffs so you never have to guess what the AI is doing.
            </p>
            
            <ul style={{ display: "flex", flexDirection: "column", gap: "16px", listStyle: "none", padding: 0 }}>
              {["Full visibility into API calls", "Deterministic planning execution", "Sub-second state updates"].map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-primary)", fontWeight: 500 }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: "var(--success-subtle)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Check size={14} color="var(--success)" strokeWidth={3} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Right Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              background: "var(--surface-card)",
              borderRadius: "24px",
              border: "1px solid var(--border)",
              padding: "32px",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
              <div style={{ fontSize: "16px", fontWeight: 600 }}>Issue #4092: Japan Trip</div>
              <div className="badge badge-live" style={{ gap: "6px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-hover)", animation: "pulse-dot 1s infinite" }} />
                In Progress
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
              {TIMELINE.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: "20px" }}>
                  
                  {/* Timeline track */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ delay: 0.3 + i * 0.15, type: "spring" }}
                      style={{
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        background: step.status === "done" ? "var(--success-subtle)" : step.status === "active" ? "var(--accent-subtle)" : "var(--surface-el)",
                        border: `1px solid ${step.status === "done" ? "var(--success)" : step.status === "active" ? "var(--accent)" : "var(--border)"}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: step.status === "done" ? "var(--success)" : "var(--accent)",
                        zIndex: 2,
                      }}
                    >
                      {step.status === "done" ? <Check size={12} strokeWidth={3} /> : step.status === "active" ? <Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> : null}
                    </motion.div>
                    
                    {i !== TIMELINE.length - 1 && (
                      <div
                        style={{
                          width: "2px",
                          height: "32px",
                          background: step.status === "done" ? "var(--success)" : "var(--border)",
                          margin: "4px 0",
                          opacity: step.status === "done" ? 0.5 : 1,
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                    transition={{ delay: 0.4 + i * 0.15 }}
                    style={{ flex: 1, paddingBottom: "24px", opacity: step.status === "pending" ? 0.4 : 1 }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                      <span style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>{step.title}</span>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)", fontVariantNumeric: "tabular-nums" }}>{step.time}</span>
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>{step.desc}</div>
                  </motion.div>

                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
