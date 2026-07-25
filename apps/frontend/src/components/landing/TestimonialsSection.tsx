import { useRef, useEffect, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote: "Agentic Travel completely reimagined our corporate retreat planning. What used to take our HR team 3 weeks was fully orchestrated in under a minute with zero budget overruns.",
    name: "Sarah Jenkins",
    role: "VP of People",
    company: "Acme Corp",
    initials: "SJ",
    color: "linear-gradient(135deg, #f43f5e, #be123c)"
  },
  {
    quote: "I've tried every AI travel tool. Most just spit out generic ChatGPT lists. Wayfarer is the only one that actually checks live APIs for flights and builds a bookable, cohesive itinerary.",
    name: "David Chen",
    role: "Frequent Flyer",
    company: "Nomad Life",
    initials: "DC",
    color: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
  },
  {
    quote: "The multi-agent approach is revolutionary. Watching the Budget Agent negotiate constraints with the Flight Agent in real-time on the timeline is like having a team of concierges.",
    name: "Elena Rodriguez",
    role: "Founder",
    company: "Stellar Agency",
    initials: "ER",
    color: "linear-gradient(135deg, #10b981, #047857)"
  },
];

export function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section-pad" style={{ background: "var(--bg-deep)" }}>
      <div className="max-w-content text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "60px" }}
        >
          <div className="text-label" style={{ color: "var(--accent-hover)", marginBottom: "16px" }}>
            Wall of Love
          </div>
          <h2 className="text-display">
            Trusted by the <br />
            <span style={{ color: "var(--text-muted)" }}>world's best travelers.</span>
          </h2>
        </motion.div>

        <div style={{ position: "relative", height: "350px", maxWidth: "800px", margin: "0 auto" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: 0, left: 0, right: 0,
                background: "var(--glass-bg)",
                border: "1px solid var(--glass-border)",
                borderRadius: "32px",
                padding: "48px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backdropFilter: "blur(12px)"
              }}
            >
              <div style={{ display: "flex", gap: "4px", marginBottom: "24px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={20} fill="var(--warning)" color="var(--warning)" />
                ))}
              </div>
              
              <p style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 500, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: "40px", fontStyle: "italic" }}>
                "{TESTIMONIALS[index].quote}"
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: TESTIMONIALS[index].color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "16px" }}>
                  {TESTIMONIALS[index].initials}
                </div>
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "16px" }}>{TESTIMONIALS[index].name}</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "14px" }}>{TESTIMONIALS[index].role}, {TESTIMONIALS[index].company}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div style={{ position: "absolute", bottom: "-40px", left: 0, right: 0, display: "flex", justifyContent: "center", gap: "8px" }}>
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                style={{
                  width: i === index ? "24px" : "8px",
                  height: "8px",
                  borderRadius: "4px",
                  background: i === index ? "var(--accent)" : "var(--surface-el)",
                  border: "none",
                  cursor: "pointer",
                  transition: "all var(--transition-md)"
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
