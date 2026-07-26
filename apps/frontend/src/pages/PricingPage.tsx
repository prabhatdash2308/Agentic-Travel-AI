import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, ArrowRight } from "lucide-react";
import { Navbar } from "../components/Navbar";

const PLANS = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for casual travelers",
    features: [
      "5 trips per month",
      "Basic itinerary planning",
      "Standard AI model",
      "Email support",
      "Community access",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For frequent explorers",
    features: [
      "Unlimited trips",
      "Advanced AI agents",
      "Real-time flight data",
      "Priority support",
      "Export to PDF/Markdown",
      "Trip sharing",
      "Custom preferences",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "API access",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "Team collaboration",
      "White-label options",
      "Advanced analytics",
    ],
    popular: false,
  },
];

export function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <Navbar />
      
      <main className="max-w-content" style={{ padding: "120px 40px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ textAlign: "center", marginBottom: "60px" }}
        >
          <div className="text-label" style={{ color: "var(--accent-hover)", marginBottom: "16px" }}>
            Pricing
          </div>
          <h1 className="text-display" style={{ marginBottom: "16px" }}>
            Simple, transparent pricing
          </h1>
          <p style={{ fontSize: "18px", color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto 32px" }}>
            Start free, upgrade when you need more power. No hidden fees.
          </p>

          {/* Toggle */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "6px",
              background: "var(--surface-card)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
            }}
          >
            <button
              onClick={() => setAnnual(false)}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                background: !annual ? "var(--accent)" : "transparent",
                color: !annual ? "#fff" : "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "none",
                background: annual ? "var(--accent)" : "transparent",
                color: annual ? "#fff" : "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: 500,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Annual <span style={{ fontSize: "11px", marginLeft: "4px", opacity: 0.8 }}>-20%</span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "24px", alignItems: "start" }}>
          {PLANS.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                position: "relative",
                background: plan.popular ? "var(--surface-card)" : "var(--surface-card)",
                border: plan.popular ? "2px solid var(--accent)" : "1px solid var(--border)",
                borderRadius: "24px",
                padding: "32px",
                ...(plan.popular && {
                  boxShadow: "0 0 40px rgba(79,70,229,0.15)",
                }),
              }}
            >
              {plan.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: "-12px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--accent)",
                    color: "#fff",
                    padding: "4px 16px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Zap size={12} />
                  Most Popular
                </div>
              )}

              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "12px",
                      background: plan.popular ? "var(--accent)" : "var(--surface-el)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: plan.popular ? "#fff" : "var(--text-secondary)",
                    }}
                  >
                    {plan.name === "Enterprise" ? <Crown size={20} /> : <Zap size={20} />}
                  </div>
                  <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)" }}>
                    {plan.name}
                  </h3>
                </div>
                <p style={{ fontSize: "14px", color: "var(--text-muted)", marginBottom: "16px" }}>
                  {plan.description}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "42px", fontWeight: 800, color: "var(--text-primary)" }}>
                    {plan.price}
                  </span>
                  {plan.period && <span style={{ fontSize: "16px", color: "var(--text-muted)" }}>{plan.period}</span>}
                </div>
              </div>

              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
                {plan.features.map((feature) => (
                  <li key={feature} style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "var(--text-secondary)" }}>
                    <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "var(--success-subtle)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Check size={10} color="var(--success)" strokeWidth={3} />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                className={`btn ${plan.popular ? "btn-primary" : "btn-secondary"}`}
                style={{ width: "100%", padding: "14px", fontSize: "15px", fontWeight: 600 }}
              >
                {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                <ArrowRight size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
