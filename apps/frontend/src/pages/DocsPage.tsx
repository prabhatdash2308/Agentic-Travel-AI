import { motion } from "framer-motion";
import { Code, Zap, Database, Layers, GitBranch } from "lucide-react";
import { Navbar } from "../components/Navbar";

const SECTIONS = [
  {
    icon: Zap,
    title: "Getting Started",
    description: "Quick start guide to using Eagle Agentic AI",
    items: ["Installation", "Authentication", "First Trip", "API Keys"],
  },
  {
    icon: Layers,
    title: "Architecture",
    description: "Understanding the multi-agent system",
    items: ["Agent Graph", "State Management", "Workflow Pipeline", "Node Execution"],
  },
  {
    icon: Code,
    title: "API Reference",
    description: "Complete API documentation",
    items: ["POST /api/workflow/run", "GET /api/workflow/{id}", "Schemas", "Error Handling"],
  },
  {
    icon: Database,
    title: "Database",
    description: "Data models and persistence",
    items: ["Workflow Model", "Repository Pattern", "Migrations", "SQLite vs PostgreSQL"],
  },
  {
    icon: GitBranch,
    title: "LangGraph",
    description: "Agent orchestration framework",
    items: ["Graph Definition", "State Graph", "Async Execution", "Error Recovery"],
  },
];

export function DocsPage() {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <Navbar />
      
      <main className="max-w-content" style={{ padding: "120px 40px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ marginBottom: "48px" }}>
            <div className="text-label" style={{ color: "var(--accent-hover)", marginBottom: "16px" }}>
              Documentation
            </div>
            <h1 className="text-display" style={{ marginBottom: "16px" }}>
              Developer Docs
            </h1>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)", maxWidth: "600px" }}>
              Complete documentation for Eagle Agentic AI's architecture, API, and agent system.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }}>
            {SECTIONS.map((section, index) => {
              const Icon = section.icon;
              return (
                <motion.div
                  key={section.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  style={{
                    background: "var(--surface-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "20px",
                    padding: "28px",
                    cursor: "pointer",
                    transition: "all var(--transition-md)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: "var(--accent-subtle)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--accent-hover)",
                      marginBottom: "16px",
                    }}
                  >
                    <Icon size={22} strokeWidth={1.75} />
                  </div>
                  <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
                    {section.title}
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "20px", lineHeight: 1.6 }}>
                    {section.description}
                  </p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {section.items.map((item) => (
                      <li
                        key={item}
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          padding: "6px 0",
                          borderBottom: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--accent)" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
