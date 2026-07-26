import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cpu,
  Wrench,
  Zap,
  Clock,
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import "../App.css";

import { FloatingBackground } from "../components/FloatingBackground";
import { Navbar } from "../components/Navbar";
import { PromptBox } from "../components/PromptBox";
import { AgentTimeline } from "../components/AgentTimeline";
import { MetricCard } from "../components/MetricCard";
import { OutputPanel } from "../components/OutputPanel";
import { useWorkflow } from "../hooks/useWorkflow";
import { useToast } from "../context/ToastContext";

interface WorkspacePageProps {
  onBack: () => void;
}

/** Map workflow steps to AgentTimeline format */
function buildTimelineSteps(
  estimatedSteps: string[],
  completedSteps: string[],
  isRunning: boolean
) {
  if (estimatedSteps.length === 0) {
    // Default steps when no workflow is running
    return [
      { title: "Parse travel intent", status: "pending" as const },
      { title: "Research destinations", status: "pending" as const },
      { title: "Draft itinerary", status: "pending" as const },
      { title: "Assemble final plan", status: "pending" as const },
    ];
  }

  const completedSet = new Set(completedSteps);

  return estimatedSteps.map((step, idx) => {
    if (completedSet.has(step)) {
      return { title: step, status: "done" as const };
    }
    // The first non-completed step is "active" if workflow is running
    const firstPending = estimatedSteps.findIndex((s) => !completedSet.has(s));
    if (isRunning && idx === firstPending) {
      return { title: step, status: "active" as const };
    }
    return { title: step, status: "pending" as const };
  });
}

export function WorkspacePage({ onBack }: WorkspacePageProps) {
  const [prompt, setPrompt] = useState("");
  const { state, run, reset } = useWorkflow();
  const { success, error: toastError } = useToast();

  const isLoading = state.isLoading;
  const hasResult = state.status === "completed" && !!state.finalPlan;
  const hasError = state.status === "failed";
  const isRunning = state.status === "running" || state.status === "pending";

  const timelineSteps = buildTimelineSteps(
    state.estimatedSteps,
    state.completedSteps,
    isRunning || isLoading
  );

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;
    if (prompt.trim().length < 10) {
      toastError("Input too short", "Please provide a more detailed travel request (at least 10 characters).");
      return;
    }
    await run({ query: prompt.trim() });
    success("Started", "AI agents are now planning your trip...");
  };

  const handleReset = () => {
    reset();
    setPrompt("");
    success("Reset", "Workspace cleared. Ready for a new trip.");
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
                <span className="gradient-text">with AI agents</span>
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
                Eagle orchestrates specialized AI agents to research destinations,
                plan itineraries, and estimate budgets — in seconds.
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
                value={7}
                label="Agent Nodes"
                delay={200}
              />
              <MetricCard
                icon={<Cpu size={16} strokeWidth={1.75} />}
                value={3}
                label="AI Agents"
                delay={300}
              />
              <MetricCard
                icon={<Clock size={16} strokeWidth={1.75} />}
                value={state.completedSteps.length || 0}
                suffix={`/${state.estimatedSteps.length || 8}`}
                label="Steps Done"
                delay={400}
              />
              <MetricCard
                icon={<Zap size={16} strokeWidth={1.75} />}
                value={hasResult ? 100 : isRunning ? Math.round((state.completedSteps.length / Math.max(state.estimatedSteps.length, 1)) * 100) : 0}
                suffix="%"
                label="Progress"
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
                loading={isLoading}
              />

              {/* Error banner */}
              <AnimatePresence>
                {hasError && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    style={{
                      marginTop: "16px",
                      padding: "14px 16px",
                      background: "rgba(239,68,68,0.08)",
                      border: "1px solid rgba(239,68,68,0.25)",
                      borderRadius: "12px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <AlertTriangle size={16} color="var(--danger)" style={{ flexShrink: 0, marginTop: "1px" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--danger)", marginBottom: "2px" }}>
                        Planning failed
                      </div>
                      <div style={{ fontSize: "12.5px", color: "var(--text-muted)", lineHeight: 1.5 }}>
                        {state.error}
                      </div>
                    </div>
                    <button
                      onClick={handleReset}
                      style={{
                        background: "none",
                        border: "none",
                        color: "var(--text-muted)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontSize: "12px",
                        fontFamily: "inherit",
                        padding: "2px 6px",
                        borderRadius: "6px",
                        flexShrink: 0,
                      }}
                    >
                      <RefreshCw size={12} />
                      Retry
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Output panel */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: [0.4, 0, 0.2, 1] }}
            >
              <OutputPanel
                loading={isLoading}
                hasResult={hasResult}
                finalPlan={state.finalPlan}
              />
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
                    {isLoading ? (
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
                        <CheckCircle2 size={10} />
                        Complete
                      </motion.span>
                    ) : hasError ? (
                      <motion.span
                        key="error"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={{
                          fontSize: "11px",
                          padding: "3px 8px",
                          borderRadius: "999px",
                          background: "rgba(239,68,68,0.1)",
                          color: "var(--danger)",
                          border: "1px solid rgba(239,68,68,0.2)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <AlertTriangle size={10} />
                        Failed
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
                  {isLoading
                    ? `Step ${state.completedSteps.length + 1} of ${state.estimatedSteps.length || "?"} running...`
                    : hasResult
                    ? `All ${state.completedSteps.length} steps completed`
                    : hasError
                    ? "Workflow encountered an error"
                    : "Ready to process your travel request"}
                </p>
              </div>

              <AgentTimeline steps={timelineSteps} />
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
                  {
                    label: "Agent Status",
                    value: isLoading ? "Running" : hasResult ? "Done" : "Ready",
                    positive: true,
                  },
                  {
                    label: "Workflow Mode",
                    value: "LangGraph",
                    positive: true,
                  },
                  {
                    label: "Model",
                    value: "Llama 3.3 70B",
                    positive: true,
                  },
                  {
                    label: "Backend",
                    value: "FastAPI + SQLite",
                    positive: true,
                  },
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
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      {isLoading && item.label === "Agent Status" && (
                        <Loader2 size={10} style={{ animation: "spin 1s linear infinite" }} />
                      )}
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Workflow ID display */}
              {state.workflowId && (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "8px 12px",
                    background: "var(--surface-2)",
                    borderRadius: "10px",
                  }}
                >
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "4px" }}>
                    Workflow ID
                  </div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontFamily: "monospace",
                      color: "var(--text-secondary)",
                      wordBreak: "break-all",
                    }}
                  >
                    {state.workflowId}
                  </div>
                </div>
              )}
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
            <span style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Eagle Agentic AI</span>
            <span>·</span>
            <span>Intelligent Planner</span>
          </div>
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            Powered by LangGraph + Groq Llama 3.3 70B
          </div>
        </footer>
      </div>
    </div>
  );
}
