import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, CheckCircle2, MapPin, Plane, CloudSun, Calendar } from "lucide-react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        paddingTop: "120px",
        paddingBottom: "80px",
        overflow: "hidden",
        background: "var(--bg)",
      }}
    >
      {/* Background glow */}
      <div className="section-glow" />

      <div className="max-w-content w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center z-10">
        
        {/* Left Column: Content */}
        <motion.div style={{ y: yContent, opacity: opacityContent }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "999px",
                background: "var(--glass-bg-strong)",
                border: "1px solid var(--glass-border)",
                marginBottom: "32px",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }} />
              <span className="text-label" style={{ color: "var(--text-primary)" }}>
                Agentic Travel AI
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-hero" style={{ marginBottom: "24px" }}>
              The AI Operating System for <span className="gradient-text">Travel.</span>
            </h1>

            {/* Subtext */}
            <p className="text-body-lg" style={{ color: "var(--text-secondary)", maxWidth: "540px", marginBottom: "48px" }}>
              Experience luxury travel planning through autonomous AI. Let intelligent agents orchestrate your flights, curate accommodations, and design perfect itineraries with absolute precision.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center", marginBottom: "48px" }}>
              <Link to="/workspace" className="btn btn-primary btn-primary-lg" style={{ padding: "16px 32px" }}>
                Start Planning
                <ArrowRight size={18} />
              </Link>
              <a href="#how-it-works" className="btn btn-ghost" style={{ padding: "16px 32px", fontSize: "16px", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px", borderRadius: "16px" }}>
                <Play size={18} />
                Watch Demo
              </a>
            </div>

            {/* Trust Indicators */}
            <div style={{ display: "flex", gap: "24px", alignItems: "center", flexWrap: "wrap" }}>
              {[
                "SOC2 Type II Certified",
                "99.9% Uptime SLA",
                "Trusted by 10k+ Travelers"
              ].map((text, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <CheckCircle2 size={16} color="var(--text-muted)" />
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{text}</span>
                </div>
              ))}
            </div>

          </motion.div>
        </motion.div>

        {/* Right Column: Realistic Product Preview */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
          style={{ position: "relative", height: "640px", width: "100%", perspective: "1000px" }}
        >
          <div 
            style={{
              position: "absolute",
              top: 0,
              right: "-10%",
              width: "110%",
              height: "100%",
              background: "var(--surface-card)",
              border: "1px solid var(--border)",
              borderRadius: "24px",
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column"
            }}
          >
            {/* Fake App Header */}
            <div style={{ height: "64px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", padding: "0 24px", justifyContent: "space-between", background: "var(--surface-el)" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <MapPin size={16} color="#fff" />
                </div>
                <span style={{ fontWeight: 600, fontSize: "15px" }}>Kyoto Autumn Tour</span>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-2)" }} />
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--surface-2)" }} />
              </div>
            </div>

            {/* App Content Area */}
            <div style={{ flex: 1, padding: "24px", display: "grid", gridTemplateColumns: "1fr 300px", gap: "24px", background: "var(--surface-2)" }}>
              
              {/* Left Canvas: Itinerary / Map */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Weather & Flight Widget */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div className="card" style={{ padding: "16px", background: "var(--surface-card)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span className="text-xs text-muted">WEATHER</span>
                      <CloudSun size={16} className="text-muted" />
                    </div>
                    <div style={{ fontSize: "24px", fontWeight: 600 }}>18°C</div>
                    <div className="text-xs text-muted">Partly cloudy in Kyoto</div>
                  </div>
                  <div className="card" style={{ padding: "16px", background: "var(--surface-card)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                      <span className="text-xs text-muted">NEXT FLIGHT</span>
                      <Plane size={16} className="text-muted" />
                    </div>
                    <div style={{ fontSize: "16px", fontWeight: 600 }}>JAL 045</div>
                    <div className="text-xs text-muted">SFO ➝ KIX • 11h 20m</div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="card" style={{ flex: 1, padding: "24px", background: "var(--surface-card)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "24px" }}>
                    <Calendar size={18} className="text-muted" />
                    <span style={{ fontWeight: 600 }}>Day 1: Arrival & Exploration</span>
                  </div>
                  
                  {[
                    { time: "14:00", title: "Check-in at Ritz Carlton", type: "hotel" },
                    { time: "16:30", title: "Nishiki Market Tour", type: "activity" },
                    { time: "19:00", title: "Dinner at Kikunoi", type: "dining" },
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: "16px", marginBottom: i === 2 ? 0 : "24px" }}>
                      <div style={{ width: "48px", fontSize: "13px", color: "var(--text-muted)", paddingTop: "2px" }}>{item.time}</div>
                      <div style={{ position: "relative", paddingLeft: "16px", borderLeft: "1px solid var(--border)" }}>
                        <div style={{ position: "absolute", left: "-4px", top: "6px", width: "8px", height: "8px", borderRadius: "50%", background: "var(--accent)" }} />
                        <div style={{ fontWeight: 500, fontSize: "14px", marginBottom: "4px" }}>{item.title}</div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>Agent verified & booked</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Sidebar: Agent Activity */}
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="text-label" style={{ marginBottom: "8px" }}>Agent Execution</div>
                {[
                  { name: "Flight Agent", status: "Done", color: "var(--success)" },
                  { name: "Hotel Agent", status: "Done", color: "var(--success)" },
                  { name: "Dining Agent", status: "Working...", color: "var(--accent)" },
                  { name: "Logistics Agent", status: "Queued", color: "var(--text-muted)" }
                ].map((agent, i) => (
                  <div key={i} className="card" style={{ padding: "16px", background: "var(--surface-card)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600 }}>{agent.name}</span>
                      <span style={{ fontSize: "11px", color: agent.color }}>{agent.status}</span>
                    </div>
                    <div style={{ height: "4px", background: "var(--surface-el)", borderRadius: "2px", overflow: "hidden" }}>
                      <motion.div 
                        initial={{ width: "0%" }}
                        animate={{ width: agent.status === "Done" ? "100%" : agent.status === "Working..." ? "65%" : "0%" }}
                        transition={{ duration: 1.5, delay: 0.5 + (i * 0.2) }}
                        style={{ height: "100%", background: agent.color }} 
                      />
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
