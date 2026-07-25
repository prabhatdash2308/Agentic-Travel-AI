import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "framer-motion";
import { Sparkles, Brain, Code, Network, Globe, Plane, Coffee, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  onLaunchPlanner: () => void;
}

export function HeroSection({ onLaunchPlanner }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax for hero content
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacityContent = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Mouse tracking for right-side visualizer
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x * 20); // max 20px movement
      mouseY.set(y * 20);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <section
      ref={containerRef}
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        paddingTop: "80px", // account for navbar
        overflow: "hidden",
        background: "var(--bg-deep)",
      }}
    >
      {/* Background radial gradient */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "1200px",
          height: "800px",
          background: "radial-gradient(circle at center, rgba(124,58,237,0.12) 0%, rgba(10,10,12,0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="noise-overlay" />

      <div className="max-w-content w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center z-10">
        
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
              <Sparkles size={14} className="text-violet-400" />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
                Agentic Travel AI v2.0
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-hero" style={{ marginBottom: "24px" }}>
              Travel Planning, <br />
              <span className="gradient-text">Reimagined by Autonomous AI.</span>
            </h1>

            {/* Subtext */}
            <p className="text-body-lg" style={{ color: "var(--text-secondary)", maxWidth: "540px", marginBottom: "48px" }}>
              The world’s first multi-agent travel orchestration platform. Let specialized AI agents research flights, curate hotels, build itineraries, and optimize budgets — in seconds.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
              <button onClick={onLaunchPlanner} className="btn btn-primary btn-primary-lg">
                Launch Planner
                <ArrowRight size={18} />
              </button>
              <a href="#workflow" className="btn btn-ghost" style={{ padding: "16px 28px", fontSize: "16px", fontWeight: 600 }}>
                Watch Workflow
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: AI Visualizer */}
        <div style={{ position: "relative", height: "600px", perspective: "1000px" }}>
          <motion.div
            style={{
              width: "100%",
              height: "100%",
              position: "relative",
              x: smoothX,
              y: smoothY,
            }}
          >
            {/* Central Hub */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 20 }}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "120px",
                height: "120px",
                background: "var(--glass-bg-strong)",
                backdropFilter: "blur(24px)",
                border: "1px solid var(--accent)",
                borderRadius: "32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-glow)",
                zIndex: 10,
              }}
            >
              <Brain size={36} color="var(--accent-hover)" />
              <span style={{ marginTop: "12px", fontSize: "12px", fontWeight: 600, color: "var(--text-primary)" }}>Orchestrator</span>
            </motion.div>

            {/* Floating Nodes */}
            {[
              { icon: Globe, label: "Destinations", top: "10%", left: "20%", delay: 0.4 },
              { icon: Plane, label: "Flights", top: "20%", left: "80%", delay: 0.5 },
              { icon: Coffee, label: "Restaurants", top: "80%", left: "75%", delay: 0.6 },
              { icon: Network, label: "Itinerary", top: "75%", left: "15%", delay: 0.7 },
              { icon: Code, label: "APIs", top: "45%", left: "5%", delay: 0.8 },
            ].map((node, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: node.delay, duration: 0.8 }}
                style={{
                  position: "absolute",
                  top: node.top,
                  left: node.left,
                  padding: "16px",
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "20px",
                  backdropFilter: "blur(12px)",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  animation: `float-slow ${6 + i}s ease-in-out infinite alternate`,
                }}
              >
                <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <node.icon size={18} color="var(--text-secondary)" />
                </div>
                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>{node.label}</span>
              </motion.div>
            ))}

            {/* Connecting SVG Lines */}
            <svg
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
            >
              <motion.path
                d="M 120 280 C 180 280, 250 300, 300 300"
                stroke="var(--accent-subtle)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 6"
                style={{ animation: "dash-flow 2s linear infinite" }}
              />
              <motion.path
                d="M 400 300 C 450 300, 480 200, 500 150"
                stroke="var(--accent-subtle)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 6"
                style={{ animation: "dash-flow 2s linear infinite reverse" }}
              />
              <motion.path
                d="M 350 400 C 350 450, 450 480, 480 500"
                stroke="var(--accent-subtle)"
                strokeWidth="2"
                fill="none"
                strokeDasharray="6 6"
                style={{ animation: "dash-flow 2s linear infinite" }}
              />
            </svg>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
