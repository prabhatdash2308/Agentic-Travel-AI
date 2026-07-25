import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Bot, Activity, LineChart, FileText, CloudSun, RefreshCcw, Users, MessageSquare } from "lucide-react";

const FEATURES = [
  {
    title: "Autonomous Multi-Agent Planning",
    desc: "A swarm of specialized agents working in parallel to orchestrate every detail of your journey.",
    icon: Bot,
  },
  {
    title: "Live AI Execution Timeline",
    desc: "Watch the agents think, negotiate, and book in real-time through a transparent execution log.",
    icon: Activity,
  },
  {
    title: "Budget Optimization",
    desc: "Set your constraints. Our agents dynamically reallocate funds to maximize the value of your trip.",
    icon: LineChart,
  },
  {
    title: "Visa Intelligence",
    desc: "Automated passport and visa requirement checks based on your nationality and destination.",
    icon: FileText,
  },
  {
    title: "Weather-aware Planning",
    desc: "Itineraries dynamically adjust based on historical weather patterns and live forecasts.",
    icon: CloudSun,
  },
  {
    title: "Real-time Replanning",
    desc: "Flight delayed? The AI automatically reschedules your transfers and dinner reservations.",
    icon: RefreshCcw,
  },
  {
    title: "Collaborative Workspace",
    desc: "Invite friends and family to the canvas. Agents adapt to group preferences seamlessly.",
    icon: Users,
  },
  {
    title: "Natural Language Commands",
    desc: "Speak naturally. 'Find a boutique hotel near the Eiffel Tower under $300 a night.' Done.",
    icon: MessageSquare,
  },
];

export function FeaturesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-pad" style={{ background: "var(--bg-deep)", position: "relative" }}>
      <div className="max-w-content w-full px-6 md:px-12">
        
        <div style={{ textAlign: "center", marginBottom: "80px", maxWidth: "600px", margin: "0 auto 80px auto" }}>
          <h2 className="text-section" style={{ marginBottom: "24px" }}>
            Intelligence at every step.
          </h2>
          <p className="text-body-lg text-secondary">
            A comprehensive suite of autonomous capabilities designed to remove friction from travel.
          </p>
        </div>

        <div ref={ref} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {FEATURES.map((feat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card"
              style={{
                padding: "32px",
                background: "var(--surface-card)",
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                height: "100%",
              }}
            >
              <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <feat.icon size={20} color="var(--text-primary)" />
              </div>
              <div>
                <h3 className="text-card-title" style={{ marginBottom: "12px" }}>{feat.title}</h3>
                <p className="text-body text-secondary">{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
