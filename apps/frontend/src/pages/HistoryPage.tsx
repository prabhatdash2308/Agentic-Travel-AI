import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Search, Trash2, Copy } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { useToast } from "../context/ToastContext";
import { MOCK_TRIPS, type Trip } from "../data/mockTrips";

export function HistoryPage() {
  const [trips] = useState<Trip[]>(MOCK_TRIPS);
  const [searchQuery, setSearchQuery] = useState("");
  const { success, info } = useToast();

  const filteredTrips = trips.filter((trip) =>
    trip.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (trip: Trip) => {
    success("Copied", `Itinerary for ${trip.destination} copied to clipboard`);
  };

  const handleDelete = () => {
    info("Deleted", "Trip moved to trash");
  };

  return (
    <div style={{ background: "var(--bg)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <Navbar />
      
      <main className="max-w-content" style={{ padding: "120px 40px 80px" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ marginBottom: "40px" }}>
            <h1 className="text-display" style={{ marginBottom: "16px" }}>
              Trip History
            </h1>
            <p style={{ fontSize: "18px", color: "var(--text-secondary)", maxWidth: "600px" }}>
              View and manage your past travel plans. Continue editing, duplicate, or export your itineraries.
            </p>
          </div>

          {/* Search Bar */}
          <div style={{ marginBottom: "32px", position: "relative" }}>
            <Search
              size={18}
              color="var(--text-muted)"
              style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              placeholder="Search trips by destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "14px 16px 14px 48px",
                background: "var(--surface-card)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                color: "var(--text-primary)",
                fontSize: "15px",
                fontFamily: "inherit",
                outline: "none",
              }}
            />
          </div>

          {/* Trips Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
            {filteredTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "20px",
                  padding: "24px",
                  position: "relative",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "12px",
                        background: "var(--accent-subtle)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--accent-hover)",
                      }}
                    >
                      <Clock size={22} strokeWidth={1.75} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
                        {trip.destination}
                      </h3>
                      <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>{trip.date}</p>
                    </div>
                  </div>
                  <span
                    className={`badge ${trip.status === "completed" ? "badge-done" : "badge-pending"}`}
                    style={{ fontSize: "11px" }}
                  >
                    {trip.status}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: "14px", color: "var(--text-secondary)", fontWeight: 500 }}>
                    {trip.budget}
                  </span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleCopy(trip)}
                      className="btn-icon"
                      style={{ width: "36px", height: "36px", padding: "8px" }}
                      aria-label="Copy itinerary"
                    >
                      <Copy size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete()}
                      className="btn-icon"
                      style={{ width: "36px", height: "36px", padding: "8px", color: "var(--danger)" }}
                      aria-label="Delete trip"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTrips.length === 0 && (
            <div style={{ textAlign: "center", padding: "80px 32px", color: "var(--text-muted)" }}>
              <Clock size={48} style={{ marginBottom: "16px", opacity: 0.5 }} />
              <p style={{ fontSize: "16px" }}>No trips found matching "{searchQuery}"</p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
