import { useRef } from "react";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, MapPin, CloudSun, Clock, IndianRupee } from "lucide-react";

const DESTINATIONS = [
  {
    name: "Kyoto, Japan",
    gradient: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), radial-gradient(circle at top right, #9d174d, #1f2937)",
    weather: "15°C Sunny",
    budget: "₹1,45k",
    duration: "7 Days",
    score: 98,
    size: "large",
  },
  {
    name: "Santorini, Greece",
    gradient: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), radial-gradient(circle at top left, #0ea5e9, #0f172a)",
    weather: "22°C Clear",
    budget: "₹2,10k",
    duration: "5 Days",
    score: 95,
    size: "large",
  },
  {
    name: "Ubud, Bali",
    gradient: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.9)), linear-gradient(135deg, #15803d, #064e3b)",
    weather: "28°C Humid",
    budget: "₹85k",
    duration: "6 Days",
    score: 96,
    size: "small",
  },
  {
    name: "Swiss Alps",
    gradient: "linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.9)), radial-gradient(circle at center, #94a3b8, #1e293b)",
    weather: "-2°C Snow",
    budget: "₹3,20k",
    duration: "8 Days",
    score: 92,
    size: "small",
  },
];

function DestinationCard({ dest, index }: { dest: typeof DESTINATIONS[0], index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for tilt
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  // Map mouse position to rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      style={{
        perspective: "1000px",
        gridColumn: dest.size === "large" ? "span 2" : "span 1",
        height: dest.size === "large" ? "480px" : "320px",
      }}
    >
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "24px",
          background: dest.gradient,
          position: "relative",
          overflow: "hidden",
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.1)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "32px",
          cursor: "pointer",
        }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Glow effect that follows mouse */}
        <motion.div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 60%)",
            top: useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]),
            left: useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]),
            x: "-50%",
            y: "-50%",
            pointerEvents: "none",
            filter: "blur(20px)",
            opacity: 0.5,
          }}
        />

        {/* Content with 3D pop */}
        <div style={{ transform: "translateZ(30px)", position: "relative", zIndex: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span className="badge" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
                  <CloudSun size={12} /> {dest.weather}
                </span>
                <span className="badge" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
                  <Clock size={12} /> {dest.duration}
                </span>
                <span className="badge" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)", color: "#fff" }}>
                  <IndianRupee size={12} /> {dest.budget}
                </span>
              </div>
              <h3 style={{ fontSize: dest.size === "large" ? "32px" : "24px", fontWeight: 700, color: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={dest.size === "large" ? 28 : 20} strokeWidth={2.5} />
                {dest.name}
              </h3>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
              <span style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.6)", textTransform: "uppercase", letterSpacing: "0.05em" }}>AI Match</span>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--success-subtle)", padding: "6px 12px", borderRadius: "12px", border: "1px solid rgba(34,197,94,0.3)" }}>
                <Sparkles size={14} color="var(--success)" />
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--success)" }}>{dest.score}%</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DestinationsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-pad" style={{ background: "var(--bg-deep)" }}>
      <div className="max-w-content" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "60px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}
        >
          <div>
            <div className="text-label" style={{ color: "var(--accent-hover)", marginBottom: "16px" }}>
              Curated by Intelligence
            </div>
            <h2 className="text-display">
              Where will you <br />
              <span style={{ color: "var(--text-muted)" }}>go next?</span>
            </h2>
          </div>
          <button className="btn btn-outline-violet" style={{ borderRadius: "999px" }}>
            Explore Destinations
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATIONS.map((dest, i) => (
            <DestinationCard key={dest.name} dest={dest} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
