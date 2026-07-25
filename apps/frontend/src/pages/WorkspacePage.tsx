import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Wrench,
  Zap,
  Clock,
  ArrowLeft,
} from "lucide-react";
import "../App.css";

import { FloatingBackground } from "../components/FloatingBackground";
import { Navbar } from "../components/Navbar";
import { PromptBox } from "../components/PromptBox";
import { AgentTimeline } from "../components/AgentTimeline";
import { MetricCard } from "../components/MetricCard";
import { OutputPanel } from "../components/OutputPanel";

type Step = {
  title: string;
  status: "pending" | "active" | "done";
};

const INITIAL_STEPS: Step[] = [
  { title: "Understand request", status: "done" },
  { title: "Plan tasks", status: "active" },
  { title: "Call travel tools", status: "pending" },
  { title: "Generate itinerary", status: "pending" },
];

const AFTER_STEPS: Step[] = [
  { title: "Understand request", status: "done" },
  { title: "Plan tasks", status: "done" },
  { title: "Call travel tools", status: "active" },
  { title: "Generate itinerary", status: "pending" },
];

const DONE_STEPS: Step[] = [
  { title: "Understand request", status: "done" },
  { title: "Plan tasks", status: "done" },
  { title: "Call travel tools", status: "done" },
  { title: "Generate itinerary", status: "done" },
];

interface WorkspacePageProps {
  onBack: () => void;
}

export function WorkspacePage({ onBack }: WorkspacePageProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setHasResult(false);
    setSteps(INITIAL_STEPS);

    // Simulate agent pipeline
    setTimeout(() => {
      setSteps(AFTER_STEPS);
    }, 1500);

    setTimeout(() => {
      setSteps(DONE_STEPS);
      setLoading(false);
      setHasResult(true);
    }, 3800);
  };

  return (
    <div className="app-layout">
      <FloatingBackground />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />

        {/* Hero Section */}
        <section
          id="hero"
          style={{
            paddingTop: "40px",
            paddingBottom: "40px",
            paddingLeft: "40px",
            paddingRight: "40px",
            textAlign: "center",
          }}
        >
          <div className="max-w-content" style={{ marginBottom: "0", position: "relative" }}>
            <button
              onClick={onBack}
              className="btn btn-ghost"
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "999px",
              }}
            >
              <ArrowLeft size={16} />
              Back to site
            </button>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              {/* Eyebrow */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 16px",
                  borderRadius: "999px",
                  background: "var(--accent-subtle)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  marginBottom: "28px",
                }}
              >
                <Zap size={12} color="var(--accent-hover)" strokeWidth={2.5} />
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--accent-hover)",
                    letterSpacing: "0.04em",
                  }}
                >
                  AI-Powered Travel Intelligence
                </span>
              </div>

              {/* Hero heading */}
              <h1
                className="text-display"
                style={{
                  maxWidth: "720px",
                  margin: "0 auto 20px",
                  color: "var(--text-primary)",
                }}
              >
                Plan extraordinary trips{" "}
                <span className="gradient-text">
                  with AI agents
                </span>
              </h1>

              {/* Subtext */}
              <p
                style={{
                  fontSize: "18px",
                  color: "var(--text-secondary)",
                  maxWidth: "540px",
                  margin: "0 auto 60px",
                  lineHeight: 1.65,
                  fontWeight: 400,
                }}
              >
                Wayfarer orchestrates specialized AI agents to find flights, hotels,
                itineraries, and budgets — in seconds.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Main workspace */}
        <main
          id="workspace"
          className="max-w-content"
          style={{
            flex: 1,
            padding: "0 40px 80px",
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Metrics row */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
              }}
            >
              <MetricCard
                icon={<Wrench size={16} strokeWidth={1.75} />}
                value={12}
                label="Tools Connected"
                delay={200}
              />
              <MetricCard
                icon={<Cpu size={16} strokeWidth={1.75} />}
                value={7}
                label="AI Agents"
                delay={300}
              />
              <MetricCard
                icon={<Clock size={16} strokeWidth={1.75} />}
                value={18}
                suffix="s"
                label="Avg. Response"
                delay={400}
              />
              <MetricCard
                icon={<Zap size={16} strokeWidth={1.75} />}
                value={92}
                suffix="%"
                label="Confidence"
                delay={500}
              />
            </motion.div>

            {/* Prompt section */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.4, 0, 0.2, 1] }}
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-card)",
                padding: "28px",
              }}
            >
              <div style={{ marginBottom: "24px" }}>
                <h2
                  style={{
                    fontSize: "18px",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.025em",
                    marginBottom: "6px",
                  }}
                >
                  Describe your trip
                </h2>
                <p style={{ fontSize: "13.5px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  Tell the agents where you want to go, your budget, dates, and preferences.
                </p>
              </div>

              <PromptBox
                prompt={prompt}
                onPromptChange={setPrompt}
                onGenerate={handleGenerate}
                loading={loading}
              />
            </motion.div>

            {/* Output panel */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <OutputPanel loading={loading} hasResult={hasResult} />
            </motion.div>
          </div>

          {/* Right column — Agent Timeline */}
          <motion.aside
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "80px" }}
          >
            {/* Agent workflow card */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-card)",
                padding: "24px",
              }}
            >
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Agent Workflow
                  </h3>
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.span
                        key="live"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="badge badge-live"
                        style={{ fontSize: "11px" }}
                      >
                        <div
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "50%",
                            background: "var(--accent-hover)",
                            animation: "pulse-dot 1s ease-in-out infinite",
                          }}
                        />
                        Live
                      </motion.span>
                    ) : hasResult ? (
                      <motion.span
                        key="complete"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="badge badge-done"
                        style={{ fontSize: "11px" }}
                      >
                        Complete
                      </motion.span>
                    ) : (
                      <motion.span
                        key="idle"
                        className="badge badge-pending"
                        style={{ fontSize: "11px" }}
                      >
                        Idle
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                  {loading
                    ? "Agents are executing your request..."
                    : hasResult
                    ? "All agents completed successfully"
                    : "Ready to process your travel request"}
                </p>
              </div>

              <AgentTimeline steps={steps} />
            </div>

            {/* System info card */}
            <div
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-card)",
                padding: "20px",
              }}
            >
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}
              >
                System Status
              </h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { label: "Agent Status", value: loading ? "Running" : "Ready", positive: true },
                  { label: "Tools Connected", value: "12 / 12", positive: true },
                  { label: "Workflow Mode", value: "Agentic AI", positive: true },
                  { label: "Model", value: "GPT-4o + Gemini", positive: true },
                ].map((item) => (
                  <div
                    key={item.label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "var(--surface-2)",
                      borderRadius: "10px",
                    }}
                  >
                    <span style={{ fontSize: "12.5px", color: "var(--text-muted)" }}>{item.label}</span>
                    <span
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: item.positive ? "var(--accent-hover)" : "var(--text-muted)",
                      }}
                    >
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>
        </main>

        {/* Footer */}
        <footer
          style={{
            borderTop: "1px solid var(--border)",
            padding: "24px 40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              color: "var(--text-muted)",
              fontSize: "13px",
            }}
          >
            <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Agentic Travel AI</span>
            <span>·</span>
            <span>Intelligent Planner</span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Powered by multi-agent orchestration
          </div>
        </footer>
      </div>
    </div>
  );
}
