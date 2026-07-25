import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check } from "lucide-react";

const PLANS = [
  {
    name: "Hobby",
    price: "$0",
    desc: "Perfect for individuals planning occasional trips.",
    features: ["5 trips per month", "Standard AI Agents", "Community Support", "Basic Itinerary Export"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/mo",
    desc: "For frequent travelers who need maximum optimization.",
    features: ["Unlimited trips", "Advanced GPT-4 Agents", "Real-time API tools", "Priority Support", "Calendar Sync"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "For travel agencies and large teams.",
    features: ["Custom AI Agent training", "White-label reports", "API Access", "Dedicated Success Manager", "SSO"],
    highlight: false,
  },
];

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-pad bg-mid" style={{ background: "var(--bg-mid)" }}>
      <div className="max-w-content" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "60px", textAlign: "center" }}
        >
          <div className="text-label" style={{ color: "var(--accent-hover)", marginBottom: "16px" }}>
            Simple Pricing
          </div>
          <h2 className="text-display" style={{ marginBottom: "20px" }}>
            Pay for the value, <br />
            <span style={{ color: "var(--text-muted)" }}>not the hype.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-[1100px] mx-auto">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className={plan.highlight ? "glass-card" : "card"}
              style={{
                padding: "40px",
                position: "relative",
                height: plan.highlight ? "105%" : "100%",
                display: "flex",
                flexDirection: "column",
                borderColor: plan.highlight ? "var(--accent)" : "var(--border)",
                boxShadow: plan.highlight ? "var(--shadow-glow)" : "none",
                zIndex: plan.highlight ? 10 : 1,
              }}
            >
              {plan.highlight && (
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translate(-50%, -50%)", background: "var(--accent)", color: "#fff", padding: "4px 16px", borderRadius: "999px", fontSize: "12px", fontWeight: 600 }}>
                  Most Popular
                </div>
              )}
              
              <h3 style={{ fontSize: "20px", fontWeight: 600, color: plan.highlight ? "var(--accent-hover)" : "var(--text-primary)", marginBottom: "12px" }}>
                {plan.name}
              </h3>
              
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "16px" }}>
                <span style={{ fontSize: "48px", fontWeight: 700, letterSpacing: "-0.04em", color: "var(--text-primary)" }}>{plan.price}</span>
                {plan.period && <span style={{ fontSize: "16px", color: "var(--text-muted)" }}>{plan.period}</span>}
              </div>
              
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "32px" }}>
                {plan.desc}
              </p>
              
              <button className={`btn w-full mb-8 ${plan.highlight ? 'btn-primary' : 'btn-ghost'}`}>
                {plan.highlight ? 'Get Started' : 'Choose Plan'}
              </button>
              
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "32px", display: "flex", flexDirection: "column", gap: "16px", flex: 1 }}>
                {plan.features.map((feature) => (
                  <div key={feature} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "14px", color: "var(--text-secondary)" }}>
                    <Check size={16} color="var(--success)" />
                    {feature}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
