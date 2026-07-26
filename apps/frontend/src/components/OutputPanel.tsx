import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Sparkles, Download, Copy, CheckCheck } from "lucide-react";
import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface OutputPanelProps {
  loading: boolean;
  hasResult: boolean;
  finalPlan: string | null;
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 32px",
        textAlign: "center",
        gap: "16px",
      }}
      aria-label="Output panel — waiting for prompt"
    >
      {/* Icon cluster */}
      <div
        style={{
          position: "relative",
          width: "72px",
          height: "72px",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "20px",
            background: "var(--surface-el)",
            border: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-muted)",
          }}
        >
          <MapPin size={28} strokeWidth={1.5} />
        </div>
        {/* Sparkle decoration */}
        <div
          style={{
            position: "absolute",
            top: "-8px",
            right: "-8px",
            width: "24px",
            height: "24px",
            borderRadius: "8px",
            background: "var(--accent-subtle)",
            border: "1px solid rgba(124,58,237,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-hover)",
          }}
        >
          <Sparkles size={12} />
        </div>
      </div>

      <div>
        <h3
          style={{
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "6px",
          }}
        >
          Your AI-generated itinerary will appear here
        </h3>
        <p
          style={{
            fontSize: "13.5px",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            maxWidth: "280px",
          }}
        >
          Describe your trip above and click generate. The AI agents will research
          destinations, plan your days, and estimate costs.
        </p>
      </div>

      {/* Feature pills */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "8px" }}
      >
        {["Itinerary", "Budget", "Activities", "Tips", "Logistics"].map((f) => (
          <span
            key={f}
            style={{
              padding: "4px 12px",
              borderRadius: "999px",
              background: "var(--surface-el)",
              border: "1px solid var(--border)",
              fontSize: "12px",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            {f}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ─── Markdown Renderer ────────────────────────────────────────────────────────

function MarkdownContent({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [content]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "travel-plan.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      aria-label="AI-generated travel plan"
    >
      {/* Action bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        <button
          onClick={handleCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 12px",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-secondary)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
          aria-label="Copy itinerary to clipboard"
        >
          {copied ? (
            <>
              <CheckCheck size={13} color="var(--success)" />
              Copied!
            </>
          ) : (
            <>
              <Copy size={13} />
              Copy
            </>
          )}
        </button>
        <button
          onClick={handleDownload}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
            padding: "6px 12px",
            background: "var(--surface-2)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            color: "var(--text-secondary)",
            fontSize: "12px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
          aria-label="Download itinerary as Markdown"
        >
          <Download size={13} />
          Download
        </button>
      </div>

      {/* Markdown output */}
      <div
        className="markdown-output"
        style={{
          color: "var(--text-primary)",
          lineHeight: 1.75,
          fontSize: "14.5px",
        }}
      >
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1
                style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                  color: "var(--text-primary)",
                  borderBottom: "1px solid var(--border)",
                  paddingBottom: "12px",
                  marginBottom: "20px",
                  marginTop: "0",
                }}
              >
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2
                style={{
                  fontSize: "17px",
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  color: "var(--text-primary)",
                  marginTop: "28px",
                  marginBottom: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "3px",
                    height: "16px",
                    background: "var(--accent)",
                    borderRadius: "2px",
                    flexShrink: 0,
                  }}
                />
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                style={{
                  fontSize: "14.5px",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "var(--text-primary)",
                  marginTop: "20px",
                  marginBottom: "8px",
                }}
              >
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p
                style={{
                  color: "var(--text-secondary)",
                  lineHeight: 1.8,
                  marginBottom: "12px",
                  fontSize: "14px",
                }}
              >
                {children}
              </p>
            ),
            ul: ({ children }) => (
              <ul
                style={{
                  paddingLeft: "0",
                  listStyle: "none",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginBottom: "14px",
                }}
              >
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol
                style={{
                  paddingLeft: "20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  marginBottom: "14px",
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                }}
              >
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  fontSize: "14px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "5px",
                    height: "5px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    flexShrink: 0,
                    marginTop: "9px",
                  }}
                />
                <span>{children}</span>
              </li>
            ),
            strong: ({ children }) => (
              <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>
                {children}
              </strong>
            ),
            em: ({ children }) => (
              <em style={{ color: "var(--text-secondary)", fontStyle: "italic" }}>
                {children}
              </em>
            ),
            blockquote: ({ children }) => (
              <blockquote
                style={{
                  borderLeft: "3px solid var(--accent)",
                  paddingLeft: "16px",
                  marginLeft: 0,
                  marginRight: 0,
                  marginBottom: "14px",
                  color: "var(--text-secondary)",
                  fontSize: "13.5px",
                  fontStyle: "italic",
                  background: "var(--accent-subtle)",
                  padding: "12px 16px",
                  borderRadius: "0 10px 10px 0",
                }}
              >
                {children}
              </blockquote>
            ),
            code: ({ children, className }) => {
              const isBlock = className?.startsWith("language-");
              return isBlock ? (
                <pre
                  style={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border)",
                    borderRadius: "10px",
                    padding: "14px 16px",
                    overflow: "auto",
                    marginBottom: "14px",
                    fontSize: "13px",
                  }}
                >
                  <code style={{ color: "var(--text-primary)", fontFamily: "monospace" }}>
                    {children}
                  </code>
                </pre>
              ) : (
                <code
                  style={{
                    background: "var(--surface-el)",
                    border: "1px solid var(--border)",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "13px",
                    fontFamily: "monospace",
                    color: "var(--accent-hover)",
                  }}
                >
                  {children}
                </code>
              );
            },
            hr: () => (
              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--border)",
                  margin: "24px 0",
                }}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </motion.div>
  );
}

// ─── Main OutputPanel ─────────────────────────────────────────────────────────

export function OutputPanel({ loading, hasResult, finalPlan }: OutputPanelProps) {
  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-card)",
        padding: "24px",
        minHeight: "400px",
      }}
    >
      {/* Panel header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
          paddingBottom: "16px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div>
          <h3
            style={{
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Travel Plan
          </h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
            {loading ? "AI agents are working..." : hasResult ? "Plan ready · AI-generated" : "Awaiting prompt"}
          </p>
        </div>
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading-badge"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="badge badge-active"
              style={{ fontSize: "11px" }}
            >
              <div
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--warning)",
                  animation: "pulse-dot 1s ease-in-out infinite",
                }}
              />
              Generating
            </motion.div>
          )}
          {hasResult && !loading && (
            <motion.span
              key="done-badge"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="badge badge-done"
              style={{ fontSize: "11px" }}
            >
              Complete
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <LoadingSkeleton />
          </motion.div>
        ) : hasResult && finalPlan ? (
          <MarkdownContent key="result" content={finalPlan} />
        ) : (
          <EmptyState key="empty" />
        )}
      </AnimatePresence>
    </div>
  );
}
