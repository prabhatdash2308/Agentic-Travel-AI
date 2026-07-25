import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Map, Calendar, Plane, Hotel, CheckCircle2, Activity, Wallet, CloudRain, Bell, Search, Settings } from "lucide-react";

export function DashboardSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="section-pad relative" style={{ background: "var(--bg-deep)", overflow: "hidden" }}>
      <div className="section-glow" style={{ top: "50%", transform: "translate(-50%, -50%)" }} />
      
      <div className="max-w-content text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: "60px" }}
        >
          <div className="text-label" style={{ color: "var(--accent-hover)", marginBottom: "16px" }}>
            Production Dashboard
          </div>
          <h2 className="text-display">
            A workspace designed <br />
            <span style={{ color: "var(--text-muted)" }}>for serious planning.</span>
          </h2>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 1, type: "spring", damping: 20 }}
          style={{
            width: "100%",
            background: "var(--bg)",
            borderRadius: "24px",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow-lg), 0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px rgba(0,0,0,0.8)",
            padding: "24px",
            display: "grid",
            gridTemplateColumns: "260px 1fr",
            gap: "24px",
            position: "relative",
            zIndex: 10,
            textAlign: "left",
          }}
        >
          {/* Sidebar */}
          <div style={{ background: "var(--surface-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Activity size={16} color="#fff" />
              </div>
              <span style={{ fontWeight: 600 }}>Trip Workspace</span>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div className="text-label" style={{ marginBottom: "8px" }}>Itineraries</div>
              {["Tokyo Spring 2027", "Paris Anniversary", "Swiss Alps Ski"].map((item, i) => (
                <div key={i} style={{ padding: "10px 12px", borderRadius: "8px", background: i === 0 ? "var(--surface-el)" : "transparent", color: i === 0 ? "var(--text-primary)" : "var(--text-secondary)", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
                  <Map size={16} color={i === 0 ? "var(--accent)" : "currentColor"} />
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
              <div style={{ padding: "10px 12px", borderRadius: "8px", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "12px" }}>
                <Settings size={16} />
                <span style={{ fontSize: "14px", fontWeight: 500 }}>Settings</span>
              </div>
            </div>
          </div>

          {/* Main Area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {/* Header */}
            <div style={{ height: "64px", background: "var(--surface-card)", borderRadius: "16px", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px" }}>
               <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                 <h3 style={{ fontSize: "18px", fontWeight: 600 }}>Tokyo Spring 2027</h3>
                 <span className="badge badge-active">In Progress</span>
               </div>
               <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                 <Search size={18} color="var(--text-muted)" />
                 <Bell size={18} color="var(--text-muted)" />
                 <div style={{ height: "32px", width: "32px", background: "var(--surface-el)", borderRadius: "50%", border: "1px solid var(--border)" }} />
               </div>
            </div>

            {/* Grid Area */}
            <div style={{ flex: 1, display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
              
              {/* Center Content: Map & Itinerary */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                 {/* Map Placeholder */}
                 <div style={{ height: "240px", background: "var(--surface-card)", borderRadius: "16px", border: "1px solid var(--border)", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   <div style={{ position: "absolute", inset: 0, opacity: 0.1, backgroundImage: "radial-gradient(var(--accent) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                   <div style={{ display: "flex", gap: "8px", alignItems: "center", padding: "12px 24px", background: "var(--glass-bg-strong)", borderRadius: "999px", border: "1px solid var(--border)", backdropFilter: "blur(10px)" }}>
                     <Map size={16} color="var(--accent-hover)" />
                     <span style={{ fontSize: "14px", fontWeight: 500 }}>Interactive Map Active</span>
                   </div>
                 </div>

                 {/* Timeline */}
                 <div style={{ flex: 1, background: "var(--surface-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "24px" }}>
                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                     <span style={{ fontWeight: 600 }}>April 12th Schedule</span>
                     <span style={{ fontSize: "13px", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}><CloudRain size={14}/> 16°C Light Rain</span>
                   </div>
                   
                   <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                     {[
                       { time: "09:00", title: "Flight JL001 Lands", icon: Plane, color: "var(--indigo)" },
                       { time: "11:30", title: "Check-in at Aman Tokyo", icon: Hotel, color: "var(--accent)" },
                       { time: "13:00", title: "Lunch Reservation", icon: Activity, color: "var(--success)" },
                     ].map((item, i) => (
                       <div key={i} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                         <div style={{ width: "45px", fontSize: "13px", color: "var(--text-muted)" }}>{item.time}</div>
                         <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--surface-el)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                           <item.icon size={14} color={item.color} />
                         </div>
                         <div style={{ flex: 1, fontSize: "14px", fontWeight: 500 }}>{item.title}</div>
                         <CheckCircle2 size={16} color="var(--success)" />
                       </div>
                     ))}
                   </div>
                 </div>
              </div>

              {/* Right Sidebar: Agents & Budget */}
              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* Budget */}
                <div style={{ background: "var(--surface-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "24px" }}>
                   <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                     <Wallet size={16} color="var(--text-muted)" />
                     <span style={{ fontWeight: 600 }}>Budget Tracker</span>
                   </div>
                   <div style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px" }}>$4,250 <span style={{ fontSize: "16px", color: "var(--text-muted)", fontWeight: 500 }}>/ $5,000</span></div>
                   <div style={{ height: "6px", background: "var(--surface-el)", borderRadius: "3px", overflow: "hidden" }}>
                     <div style={{ height: "100%", width: "85%", background: "var(--accent)" }} />
                   </div>
                </div>

                {/* Agents Status */}
                <div style={{ flex: 1, background: "var(--surface-card)", borderRadius: "16px", border: "1px solid var(--border)", padding: "24px" }}>
                   <div style={{ fontWeight: 600, marginBottom: "20px" }}>Active Agents</div>
                   <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                     {[
                       { name: "Flights", status: "Booked", progress: 100, color: "var(--success)" },
                       { name: "Hotels", status: "Booked", progress: 100, color: "var(--success)" },
                       { name: "Activities", status: "Optimizing...", progress: 60, color: "var(--warning)" },
                     ].map((agent, i) => (
                       <div key={i}>
                         <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                           <span style={{ fontWeight: 500 }}>{agent.name}</span>
                           <span style={{ color: agent.color }}>{agent.status}</span>
                         </div>
                         <div style={{ height: "4px", background: "var(--surface-el)", borderRadius: "2px" }}>
                           <div style={{ height: "100%", width: `${agent.progress}%`, background: agent.color, borderRadius: "2px" }} />
                         </div>
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
