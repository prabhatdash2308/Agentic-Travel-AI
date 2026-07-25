import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Plane,
  Building2,
  Sun,
  IndianRupee,
  Calendar,
  Utensils,
  Star,
  Clock,
  Sparkles,
} from "lucide-react";
import { LoadingSkeleton } from "./LoadingSkeleton";

interface OutputPanelProps {
  loading: boolean;
  hasResult: boolean;
}

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
          Your itinerary will appear here
        </h3>
        <p
          style={{
            fontSize: "13.5px",
            color: "var(--text-muted)",
            lineHeight: 1.6,
            maxWidth: "280px",
          }}
        >
          Describe your trip above and click generate. Wayfarer will orchestrate flights, hotels, and activities instantly.
        </p>
      </div>

      {/* Feature pills */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center", marginTop: "8px" }}
      >
        {["Flights", "Hotels", "Itinerary", "Budget", "Weather"].map((f) => (
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

function TravelResult() {
  const days = [
    {
      day: 1,
      title: "Arrival & North Goa",
      activities: ["Calangute Beach", "Sunset at Anjuna", "Dinner at Infantaria"],
    },
    {
      day: 2,
      title: "Old Goa & Culture",
      activities: ["Basilica of Bom Jesus", "Panaji city walk", "Spice plantation tour"],
    },
    {
      day: 3,
      title: "South Goa & Departure",
      activities: ["Palolem Beach morning", "Dudhsagar Falls", "Airport transfer"],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      style={{ display: "flex", flexDirection: "column", gap: "20px" }}
      aria-label="Travel plan results"
    >
      {/* Header */}
      <div
        style={{
          padding: "20px 24px",
          background: "var(--surface-el)",
          borderRadius: "16px",
          border: "1px solid var(--border)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
          <div>
            <div
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--accent-hover)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Generated Itinerary
            </div>
            <h3
              style={{
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                color: "var(--text-primary)",
                lineHeight: 1.2,
                marginBottom: "8px",
              }}
            >
              3 Days in Goa
            </h3>
            <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
              {[
                { icon: Calendar, text: "Next weekend" },
                { icon: Clock, text: "3 nights" },
                { icon: IndianRupee, text: "₹18,400 total" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    fontSize: "12.5px",
                    color: "var(--text-secondary)",
                  }}
                >
                  <Icon size={12} strokeWidth={2} />
                  {text}
                </div>
              ))}
            </div>
          </div>
          <span
            className="badge badge-done"
            style={{ flexShrink: 0, fontSize: "11px" }}
          >
            <Star size={9} strokeWidth={2.5} />
            92% match
          </span>
        </div>
      </div>

      {/* Flight card */}
      <div
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              background: "rgba(99,102,241,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#818CF8",
            }}
          >
            <Plane size={15} strokeWidth={1.75} />
          </div>
          <span
            style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}
          >
            Flights
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { from: "BOM", to: "GOI", time: "06:20 → 07:50", airline: "IndiGo", price: "₹3,200" },
            { from: "GOI", to: "BOM", time: "19:15 → 20:45", airline: "Air India", price: "₹2,900" },
          ].map((flight, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 14px",
                background: "var(--surface-2)",
                borderRadius: "12px",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div>
                  <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                    {flight.from}
                  </span>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)", margin: "0 6px" }}>→</span>
                  <span style={{ fontSize: "14px", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--text-primary)" }}>
                    {flight.to}
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{flight.time}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{flight.price}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{flight.airline}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hotel card */}
      <div
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "14px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              background: "rgba(245,158,11,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--warning)",
            }}
          >
            <Building2 size={15} strokeWidth={1.75} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Accommodation
          </span>
        </div>

        <div
          style={{
            background: "var(--surface-2)",
            borderRadius: "12px",
            padding: "14px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "12px",
          }}
        >
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
              Nerul Beach Resort
            </div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", marginBottom: "8px" }}>
              North Goa · Beach access · Pool · Breakfast included
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={11}
                  fill={s <= 4 ? "var(--warning)" : "transparent"}
                  color="var(--warning)"
                  strokeWidth={2}
                />
              ))}
              <span style={{ fontSize: "11px", color: "var(--text-muted)", marginLeft: "4px" }}>4.3 · 312 reviews</span>
            </div>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>₹6,800</div>
            <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>2 nights</div>
          </div>
        </div>
      </div>

      {/* Itinerary timeline */}
      <div
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              background: "var(--accent-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--accent-hover)",
            }}
          >
            <Calendar size={15} strokeWidth={1.75} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Day-by-Day Itinerary
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {days.map((day, i) => (
            <div
              key={i}
              style={{ display: "flex", gap: "14px" }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "8px",
                  background: "var(--accent-subtle)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--accent-hover)",
                  flexShrink: 0,
                }}
              >
                {day.day}
              </div>
              <div style={{ flex: 1, paddingBottom: i < days.length - 1 ? "12px" : "0", borderBottom: i < days.length - 1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "6px" }}>
                  {day.title}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {day.activities.map((act) => (
                    <div
                      key={act}
                      style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12.5px", color: "var(--text-muted)" }}
                    >
                      <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "var(--text-muted)", flexShrink: 0 }} />
                      {act}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Budget breakdown */}
      <div
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px 20px",
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}
        >
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              background: "var(--success-subtle)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--success)",
            }}
          >
            <IndianRupee size={15} strokeWidth={1.75} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Budget Breakdown
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { label: "Flights (return)", amount: "₹6,100", pct: 33 },
            { label: "Accommodation", amount: "₹6,800", pct: 37 },
            { label: "Food & Dining", amount: "₹2,400", pct: 13 },
            { label: "Activities & Tours", amount: "₹1,800", pct: 10 },
            { label: "Transport (local)", amount: "₹1,300", pct: 7 },
          ].map((item) => (
            <div key={item.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <span style={{ fontSize: "12.5px", color: "var(--text-secondary)" }}>{item.label}</span>
                <span style={{ fontSize: "12.5px", fontWeight: 600, color: "var(--text-primary)" }}>{item.amount}</span>
              </div>
              <div style={{ height: "4px", borderRadius: "999px", background: "var(--surface-el)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.pct}%` }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  style={{
                    height: "100%",
                    borderRadius: "999px",
                    background: "var(--accent)",
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 0 0",
              borderTop: "1px solid var(--border)",
              marginTop: "4px",
            }}
          >
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Total Estimate</span>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--success)", letterSpacing: "-0.02em" }}>
              ₹18,400
            </span>
          </div>
          <p style={{ fontSize: "11px", color: "var(--text-muted)", textAlign: "right" }}>
            Under ₹20,000 budget · ₹1,600 saved
          </p>
        </div>
      </div>

      {/* Weather */}
      <div
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              background: "rgba(251,191,36,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FBBF24",
            }}
          >
            <Sun size={15} strokeWidth={1.75} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Weather Forecast
          </span>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {["Fri", "Sat", "Sun"].map((day, i) => (
            <div
              key={day}
              style={{
                flex: "1 1 80px",
                background: "var(--surface-2)",
                borderRadius: "12px",
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-muted)", marginBottom: "6px" }}>{day}</div>
              <Sun size={18} color="#FBBF24" strokeWidth={1.5} style={{ margin: "0 auto 6px" }} />
              <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>
                {30 + i}°C
              </div>
              <div style={{ fontSize: "10.5px", color: "var(--text-muted)", marginTop: "2px" }}>Sunny</div>
            </div>
          ))}
        </div>
      </div>

      {/* Restaurants */}
      <div
        style={{
          background: "var(--surface-card)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          padding: "18px 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "9px",
              background: "rgba(239,68,68,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--danger)",
            }}
          >
            <Utensils size={15} strokeWidth={1.75} />
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
            Top Restaurants
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { name: "Thalassa", cuisine: "Greek · Vagator", rating: "4.6", price: "₹₹₹" },
            { name: "Infantaria", cuisine: "Continental · Calangute", rating: "4.4", price: "₹₹" },
            { name: "Fisherman's Wharf", cuisine: "Seafood · Cavelossim", rating: "4.5", price: "₹₹" },
          ].map((r) => (
            <div
              key={r.name}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 12px",
                background: "var(--surface-2)",
                borderRadius: "10px",
                gap: "12px",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{r.name}</div>
                <div style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{r.cuisine}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--warning)" }}>★ {r.rating}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{r.price}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function OutputPanel({ loading, hasResult }: OutputPanelProps) {
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
            {loading ? "AI agents are working..." : hasResult ? "Plan ready" : "Awaiting prompt"}
          </p>
        </div>
        {loading && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
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
          <span className="badge badge-done" style={{ fontSize: "11px" }}>
            Complete
          </span>
        )}
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
        ) : hasResult ? (
          <TravelResult key="result" />
        ) : (
          <EmptyState key="empty" />
        )}
      </AnimatePresence>
    </div>
  );
}
