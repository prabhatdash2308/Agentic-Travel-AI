import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Sparkles, Mic, Paperclip, MapPin } from "lucide-react";

const EXAMPLES = [
  "Plan a 7-day Japan trip under ₹1,50,000 with anime spots and vegetarian food.",
  "Weekend getaway to Goa for 4 friends, focusing on techno clubs and cheap stays.",
  "Honeymoon in Switzerland in December, luxury budget with ski resorts.",
  "Solo backpacking across Europe for 3 weeks, sticking to hostels and trains.",
];

export function CommandSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % EXAMPLES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="section-pad relative" style={{ background: "var(--bg-deep)" }}>
      <div className="section-glow" />
      
      <div className="max-w-content text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "60px" }}
        >
          <h2 className="text-display" style={{ marginBottom: "20px" }}>
            Just tell us what you want. <br />
            <span style={{ color: "var(--text-muted)" }}>We'll handle the rest.</span>
          </h2>
          <p className="text-body-lg text-secondary" style={{ maxWidth: "600px", margin: "0 auto" }}>
            Powered by a state-of-the-art NLP engine, Wayfarer understands complex constraints, preferences, and multi-destination requests.
          </p>
        </motion.div>

        {/* Command Box Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.95, y: 40 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring", damping: 25 }}
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            background: "var(--glass-bg)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid var(--glass-border)",
            borderRadius: "32px",
            padding: "8px",
            boxShadow: "var(--shadow-lg), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
        >
          <div
            style={{
              background: "rgba(10,10,12,0.8)",
              borderRadius: "24px",
              padding: "24px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            {/* Input area */}
            <div style={{ position: "relative", minHeight: "80px" }}>
              <p
                style={{
                  fontSize: "clamp(18px, 2.5vw, 24px)",
                  fontWeight: 400,
                  color: "var(--text-secondary)",
                  textAlign: "left",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                {EXAMPLES[placeholderIndex]}
                <span
                  style={{
                    display: "inline-block",
                    width: "3px",
                    height: "1em",
                    background: "var(--accent)",
                    marginLeft: "4px",
                    verticalAlign: "middle",
                    animation: "typing-blink 1s infinite",
                  }}
                />
              </p>
            </div>

            {/* Bottom Actions */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", borderTop: "1px solid var(--border)", paddingTop: "20px" }}>
              
              {/* Tools */}
              <div style={{ display: "flex", gap: "12px" }}>
                <button className="btn btn-ghost" style={{ padding: "8px", borderRadius: "12px", color: "var(--text-muted)" }}>
                  <Mic size={18} />
                </button>
                <button className="btn btn-ghost" style={{ padding: "8px 16px", borderRadius: "12px", fontSize: "14px", gap: "6px" }}>
                  <Paperclip size={16} />
                  Preferences
                </button>
                <button className="btn btn-ghost" style={{ padding: "8px 16px", borderRadius: "12px", fontSize: "14px", gap: "6px" }}>
                  <MapPin size={16} />
                  Location
                </button>
              </div>

              {/* Generate */}
              <button className="btn btn-primary" style={{ padding: "12px 28px", borderRadius: "14px", fontSize: "15px", boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}>
                <Sparkles size={16} />
                Generate
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
