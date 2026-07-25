import { useRef, useState, useCallback } from "react";
import { ArrowRight, Loader2, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromptBoxProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  onGenerate: () => void;
  loading: boolean;
}

const EXAMPLE_PROMPTS = [
  "3-day Goa trip under ₹20,000 for 2 people",
  "Solo backpacking Europe for 2 weeks in September",
  "Honeymoon in Bali with flights from Mumbai",
  "Weekend getaway near Bangalore with hotels",
  "Family trip to Rajasthan, 5 days budget ₹80,000",
];

export function PromptBox({ prompt, onPromptChange, onGenerate, loading }: PromptBoxProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState(false);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        onGenerate();
      }
    },
    [onGenerate]
  );

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onPromptChange(e.target.value);
    // Auto-grow
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(120, el.scrollHeight)}px`;
    }
  };

  const handleChipClick = (chip: string) => {
    onPromptChange(chip);
    textareaRef.current?.focus();
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.max(120, el.scrollHeight)}px`;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Main input container */}
      <motion.div
        animate={{
          boxShadow: focused
            ? "0 0 0 2px var(--accent), 0 0 32px rgba(124,58,237,0.12)"
            : "0 0 0 1px var(--border)",
        }}
        transition={{ duration: 0.2 }}
        style={{
          borderRadius: "20px",
          background: "var(--surface-2)",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <textarea
          ref={textareaRef}
          id="prompt-input"
          aria-label="Describe your travel request"
          value={prompt}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Where do you want to go? Tell me your dream trip..."
          disabled={loading}
          style={{
            width: "100%",
            minHeight: "120px",
            background: "transparent",
            border: "none",
            outline: "none",
            color: "var(--text-primary)",
            fontFamily: "inherit",
            fontSize: "15px",
            lineHeight: 1.7,
            padding: "20px 24px 16px",
            resize: "none",
            caretColor: "var(--accent)",
          }}
        />

        {/* Bottom toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px 16px",
            borderTop: "1px solid var(--border)",
          }}
        >
          {/* Keyboard hint */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-muted)",
              fontSize: "12px",
              fontWeight: 400,
            }}
          >
            <Command size={11} />
            <span>+ Enter to generate</span>
          </div>

          {/* Char counter */}
          <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>
            {prompt.length > 0 && `${prompt.length} chars`}
          </div>
        </div>
      </motion.div>

      {/* CTA Button */}
      <button
        id="generate-btn"
        onClick={onGenerate}
        disabled={loading || !prompt.trim()}
        className="btn btn-primary"
        aria-label={loading ? "Generating your travel plan..." : "Generate travel plan"}
        style={{ width: "100%", padding: "16px 28px", fontSize: "15px", letterSpacing: "-0.01em" }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <Loader2
                size={16}
                strokeWidth={2}
                style={{ animation: "spin 1s linear infinite" }}
              />
              Planning your trip...
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              Generate Travel Plan
              <ArrowRight size={16} strokeWidth={2} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Example prompts */}
      <div>
        <p
          style={{
            fontSize: "11px",
            fontWeight: 500,
            color: "var(--text-muted)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Try an example
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {EXAMPLE_PROMPTS.map((chip) => (
            <button
              key={chip}
              id={`chip-${chip.slice(0, 20).replace(/\s+/g, "-").toLowerCase()}`}
              onClick={() => handleChipClick(chip)}
              disabled={loading}
              style={{
                background: "var(--surface-card)",
                border: "1px solid var(--border)",
                borderRadius: "999px",
                color: "var(--text-secondary)",
                fontSize: "12.5px",
                fontWeight: 400,
                padding: "6px 14px",
                cursor: "pointer",
                transition: "all var(--transition)",
                fontFamily: "inherit",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "rgba(124,58,237,0.4)";
                el.style.color = "var(--text-primary)";
                el.style.background = "var(--surface-el)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.borderColor = "var(--border)";
                el.style.color = "var(--text-secondary)";
                el.style.background = "var(--surface-card)";
              }}
              aria-label={`Use example prompt: ${chip}`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
