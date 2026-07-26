import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Brain, Plane, Building2, IndianRupee, CloudSun, Briefcase, Map, CreditCard } from "lucide-react";

const AGENTS = [
  { name: "Planner", icon: Brain, status: "done", time: "120ms", calls: 1 },
  { name: "Flight", icon: Plane, status: "done", time: "450ms", calls: 3 },
  { name: "Hotel", icon: Building2, status: "done", time: "380ms", calls: 2 },
  { name: "Budget", icon: IndianRupee, status: "done", time: "150ms", calls: 1 },
  { name: "Weather", icon: CloudSun, status: "done", time: "90ms", calls: 1 },
  { name: "Visa", icon: Briefcase, status: "done", time: "110ms", calls: 1 },
  { name: "Itinerary", icon: Map, status: "active", time: "Running", calls: 4 },
  { name: "Payment", icon: CreditCard, status: "pending", time: "Waiting", calls: 0 },
];

export function WorkflowSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="agents" className="section-pad relative" style={{ overflow: "hidden" }}>
      <div className="max-w-content" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "80px", textAlign: "center" }}
        >
          <div className="text-label" style={{ color: "var(--accent-hover)", marginBottom: "16px" }}>
            Multi-Agent Architecture
          </div>
          <h2 className="text-display" style={{ marginBottom: "20px" }}>
            A team of AI specialists <br />
            <span style={{ color: "var(--text-muted)" }}>working in parallel.</span>
          </h2>
          <p className="text-body-lg text-secondary" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Instead of a single slow model, Eagle Agentic AI deploys micro-agents that simultaneously query APIs, compare prices, and optimize routes.
          </p>
        </motion.div>

        {/* Horizontal Workflow Scroll Container */}
        <div style={{ position: "relative", width: "100%", paddingBottom: "40px" }}>
          
          {/* Animated Connecting Line */}
          <div style={{ position: "absolute", top: "80px", left: "0", right: "0", height: "2px", background: "var(--border)", zIndex: 0 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={isInView ? { width: "75%" } : { width: 0 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              style={{
                height: "100%",
                background: "linear-gradient(90deg, var(--accent) 0%, var(--indigo) 100%)",
                position: "relative",
              }}
            >
              {/* Traveling dot */}
              <div
                style={{
                  position: "absolute",
                  right: "-4px",
                  top: "-3px",
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 0 10px 2px var(--accent-hover)",
                }}
              />
            </motion.div>
          </div>

          {/* Cards Grid */}
          <div
            className="hide-scrollbar"
            style={{
              display: "flex",
              gap: "24px",
              overflowX: "auto",
              padding: "20px 24px",
              margin: "0 -24px",
              position: "relative",
              zIndex: 1,
              scrollSnapType: "x mandatory",
            }}
          >
            {AGENTS.map((agent, i) => (
              <motion.div
                key={agent.name}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                style={{
                  minWidth: "220px",
                  scrollSnapAlign: "center",
                }}
              >
                {/* Node connector dot */}
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    borderRadius: "50%",
                    background: agent.status === "pending" ? "var(--surface-card)" : "var(--accent-hover)",
                    border: "3px solid var(--bg)",
                    margin: "0 auto 32px",
                    position: "relative",
                    animation: agent.status === "active" ? "node-pulse 2s infinite" : "none",
                  }}
                />

                {/* Card */}
                <div
                  className="glass-card"
                  style={{
                    padding: "20px",
                    background: agent.status === "active" ? "rgba(124,58,237,0.05)" : "var(--glass-bg)",
                    borderColor: agent.status === "active" ? "rgba(124,58,237,0.3)" : "var(--glass-border)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                    <div
                      style={{
                        width: "36px", height: "36px", borderRadius: "10px",
                        background: agent.status === "active" ? "var(--accent)" : "var(--surface-el)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        color: agent.status === "active" ? "#fff" : "var(--text-secondary)",
                      }}
                    >
                      <agent.icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: "15px", fontWeight: 600 }}>{agent.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Agent</div>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Status</span>
                      <span className={`badge ${
                        agent.status === 'done' ? 'badge-done' :
                        agent.status === 'active' ? 'badge-live' : 'badge-pending'
                      }`} style={{ fontSize: "10px", padding: "2px 8px" }}>
                        {agent.status}
                      </span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Latency</span>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{agent.time}</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>Tool Calls</span>
                      <span style={{ fontSize: "12px", fontWeight: 500, color: "var(--text-primary)" }}>{agent.calls}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
