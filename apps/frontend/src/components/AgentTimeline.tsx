import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  ListTodo,
  Wrench,
  FileText,
  Check,
  Loader2,
  Clock,
} from "lucide-react";

type Status = "pending" | "active" | "done";

interface Step {
  title: string;
  status: Status;
}

interface AgentTimelineProps {
  steps: Step[];
}

const STEP_CONFIG = [
  {
    icon: Brain,
    agentName: "Orchestrator Agent",
    description: "Parses natural language query and identifies travel intent",
    duration: "0.3s",
  },
  {
    icon: ListTodo,
    agentName: "Planning Agent",
    description: "Breaks down request into subtasks for specialized agents",
    duration: "0.8s",
  },
  {
    icon: Wrench,
    agentName: "Tool Executor",
    description: "Calls flights, hotels, weather, and maps APIs in parallel",
    duration: "4.2s",
  },
  {
    icon: FileText,
    agentName: "Synthesis Agent",
    description: "Compiles results into structured itinerary and budget plan",
    duration: "1.1s",
  },
];

function StepIcon({ status, Icon }: { status: Status; Icon: React.ElementType }) {
  if (status === "done") {
    return (
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "var(--success-subtle)",
          border: "1px solid rgba(34,197,94,0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "var(--success)",
          boxShadow: "0 0 16px rgba(34,197,94,0.3)",
        }}
      >
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check size={18} strokeWidth={2.5} />
        </motion.div>
      </motion.div>
    );
  }

  if (status === "active") {
    return (
      <motion.div
        animate={{
          boxShadow: [
            "0 0 12px rgba(124,58,237,0.2)",
            "0 0 20px rgba(124,58,237,0.4)",
            "0 0 12px rgba(124,58,237,0.2)",
          ],
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          background: "var(--accent-subtle)",
          border: "1px solid rgba(124,58,237,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          color: "var(--accent-hover)",
          position: "relative",
        }}
      >
        <Loader2 size={18} strokeWidth={2} style={{ animation: "spin 1s linear infinite" }} />
      </motion.div>
    );
  }

  return (
    <motion.div
      whileHover={{ scale: 1.05, borderColor: "var(--border-hover)" }}
      transition={{ duration: 0.2 }}
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "12px",
        background: "var(--surface-el)",
        border: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        color: "var(--text-muted)",
        cursor: "default",
      }}
    >
      <Icon size={18} strokeWidth={1.75} />
    </motion.div>
  );
}

export function AgentTimeline({ steps }: AgentTimelineProps) {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "0" }}
      aria-label="Agent workflow progress"
    >
      {steps.map((step, index) => {
        const config = STEP_CONFIG[index] || {
          icon: Brain,
          agentName: step.title,
          description: "",
          duration: "–",
        };
        const Icon = config.icon;
        const isLast = index === steps.length - 1;

        return (
          <div key={index} style={{ display: "flex", gap: "16px" }}>
            {/* Left column: icon + connector */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexShrink: 0,
              }}
            >
              <StepIcon status={step.status} Icon={Icon} />

              {!isLast && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "24px" }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  style={{
                    width: "1px",
                    flex: 1,
                    minHeight: "24px",
                    margin: "4px 0",
                    background:
                      step.status === "done"
                        ? "rgba(34,197,94,0.3)"
                        : step.status === "active"
                        ? "rgba(124,58,237,0.3)"
                        : "var(--border)",
                    transition: "background 0.6s ease",
                  }}
                />
              )}
            </div>

            {/* Right column: content card */}
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1] }}
              whileHover={{ scale: 1.01 }}
              style={{
                flex: 1,
                paddingBottom: isLast ? "0" : "16px",
              }}
            >
              <motion.div
                animate={{
                  borderColor:
                    step.status === "active"
                      ? "rgba(124,58,237,0.4)"
                      : step.status === "done"
                      ? "rgba(34,197,94,0.2)"
                      : "var(--border)",
                  boxShadow:
                    step.status === "active"
                      ? ["0 0 20px rgba(124,58,237,0.08)", "0 0 30px rgba(124,58,237,0.12)", "0 0 20px rgba(124,58,237,0.08)"]
                      : "none",
                }}
                transition={{ duration: step.status === "active" ? 2 : 0.3, repeat: step.status === "active" ? Infinity : 0 }}
                style={{
                  background:
                    step.status === "active"
                      ? "var(--surface-el)"
                      : "var(--surface-card)",
                  border: `1px solid ${
                    step.status === "active"
                      ? "rgba(124,58,237,0.25)"
                      : step.status === "done"
                      ? "rgba(34,197,94,0.12)"
                      : "var(--border)"
                  }`,
                  borderRadius: "16px",
                  padding: "16px 18px",
                  transition: "all var(--transition-md)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "4px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "13.5px",
                          fontWeight: 600,
                          color:
                            step.status === "pending"
                              ? "var(--text-muted)"
                              : "var(--text-primary)",
                          letterSpacing: "-0.01em",
                          transition: "color var(--transition-md)",
                        }}
                      >
                        {config.agentName}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "12.5px",
                        color: "var(--text-muted)",
                        lineHeight: 1.5,
                        margin: 0,
                      }}
                    >
                      {config.description}
                    </p>
                  </div>

                  {/* Status + duration */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "6px",
                      flexShrink: 0,
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {step.status === "active" && (
                        <motion.span
                          key="active"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="badge badge-active"
                          style={{ fontSize: "11px", padding: "3px 10px" }}
                        >
                          <Loader2
                            size={9}
                            style={{ animation: "spin 1.2s linear infinite" }}
                          />
                          Running
                        </motion.span>
                      )}
                      {step.status === "done" && (
                        <motion.span
                          key="done"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="badge badge-done"
                          style={{ fontSize: "11px", padding: "3px 10px" }}
                        >
                          <Check size={9} strokeWidth={3} />
                          Done
                        </motion.span>
                      )}
                      {step.status === "pending" && (
                        <motion.span
                          key="pending"
                          className="badge badge-pending"
                          style={{ fontSize: "11px", padding: "3px 10px" }}
                        >
                          <Clock size={9} />
                          Pending
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {step.status === "done" && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "var(--text-muted)",
                          fontWeight: 400,
                        }}
                      >
                        {config.duration}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
