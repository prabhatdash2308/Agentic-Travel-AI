import { motion } from "framer-motion";
import { Target, Rocket, Users, Code2, Globe, Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";

const VALUES = [
  { icon: Target, title: "Mission", text: "Democratize intelligent travel planning with AI agents that understand context, preferences, and real-world constraints." },
  { icon: Rocket, title: "Vision", text: "Become the operating system for travel - where AI agents handle logistics so humans focus on experiences." },
  { icon: Users, title: "Team", text: "Built by engineers from top AI companies, passionate about transforming how the world travels." },
];

const TECH = [
  { name: "LangGraph", desc: "Agent orchestration framework" },
  { name: "FastAPI", desc: "High-performance async backend" },
  { name: "React + Framer Motion", desc: "Modern, animated frontend" },
  { name: "Groq Llama 3.3 70B", desc: "State-of-the-art LLM" },
  { name: "TypeScript", desc: "Type-safe development" },
  { name: "SQLite/PostgreSQL", desc: "Flexible data persistence" },
];

export function AboutPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <Navbar />
      
      <main className="max-w-content" style={{ padding: "120px 40px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ marginBottom: "80px", textAlign: "center" }}>
            <div className="text-label" style={{ color: "var(--accent-hover)", marginBottom: "16px" }}>
              About
            </div>
            <h1 className="text-display" style={{ marginBottom: "24px" }}>
              Building the future of travel
            </h1>
            <p style={{ fontSize: "20px", color: "var(--text-secondary)", maxWidth: "700px", margin: "0 auto", lineHeight: 1.7 }}>
              Eagle Agentic AI is on a mission to make travel planning effortless, intelligent, and personalized. 
              We believe everyone deserves access to world-class travel intelligence.
            </p>
          </div>

          {/* Values */}
          <div style={{ marginBottom: "80px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px" }}>
              {VALUES.map((value, index) => {
                const Icon = value.icon;
                return (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    style={{
                      background: "var(--surface-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "20px",
                      padding: "32px",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "var(--accent-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent-hover)",
                        marginBottom: "20px",
                      }}
                    >
                      <Icon size={24} strokeWidth={1.75} />
                    </div>
                    <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
                      {value.title}
                    </h3>
                    <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                      {value.text}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Technology */}
          <div style={{ marginBottom: "80px" }}>
            <h2 className="text-section" style={{ marginBottom: "32px", textAlign: "center" }}>
              Built with modern technology
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              {TECH.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                  }}
                >
                  <Code2 size={20} color="var(--accent-hover)" />
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)" }}>
                      {tech.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                      {tech.desc}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: "linear-gradient(135deg, var(--accent-subtle), var(--indigo-subtle))",
              border: "1px solid var(--accent)",
              borderRadius: "24px",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <Globe size={48} color="var(--accent-hover)" style={{ marginBottom: "20px" }} />
            <h2 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>
              Join our journey
            </h2>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "24px", maxWidth: "500px", margin: "0 auto 24px" }}>
              We're just getting started. Be part of the travel AI revolution.
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button className="btn btn-primary" style={{ padding: "12px 28px" }}>
                Start Planning Free
              </button>
              <button className="btn btn-secondary" style={{ padding: "12px 28px" }}>
                View Careers
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <footer style={{ marginTop: "80px", paddingTop: "40px", borderTop: "1px solid var(--border)", textAlign: "center" }}>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Made with <Heart size={14} color="var(--danger)" style={{ display: "inline" }} /> by the Eagle Agentic AI team
          </p>
        </footer>
      </main>
    </div>
  );
}
