import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plane, ArrowRight, ArrowLeft } from "lucide-react";

export function CreateAccountPage() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Auth not yet implemented — redirect to workspace
    navigate("/workspace");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: "24px",
          left: "24px",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "var(--surface-card)",
          border: "1px solid var(--border)",
          borderRadius: "999px",
          color: "var(--text-secondary)",
          fontSize: "13px",
          fontWeight: 500,
          padding: "8px 16px",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        <ArrowLeft size={14} />
        Back
      </button>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{
          width: "100%",
          maxWidth: "420px",
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              background: "var(--accent)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Plane size={24} color="#fff" strokeWidth={1.75} />
          </div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "6px",
            }}
          >
            Create account
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Start planning extraordinary trips with AI
          </p>
        </div>

        {/* Form card */}
        <div
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-card)",
            padding: "32px",
          }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label
                htmlFor="name"
                style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}
              >
                Full name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Jane Smith"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="email"
                style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Min. 8 characters"
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  background: "var(--surface-2)",
                  border: "1px solid var(--border)",
                  borderRadius: "10px",
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  fontFamily: "inherit",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
            </div>

            <button
              id="create-account-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", padding: "12px", fontSize: "14px", marginTop: "4px" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
                Create account
                <ArrowRight size={15} />
              </span>
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "20px" }}>
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent-hover)",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "13px",
                fontFamily: "inherit",
                padding: 0,
              }}
            >
              Sign in
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
