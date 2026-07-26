import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

function EagleLogo() {
  return (
    <svg width="44" height="44" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="9" fill="#4F46E5"/>
      <path d="M16 6C16 6 8.5 10.5 7 15C9.5 14 12.5 14 14.5 16L16 26L17.5 16C19.5 14 22.5 14 25 15C23.5 10.5 16 6 16 6Z" fill="white" fillOpacity="0.95"/>
    </svg>
  );
}

export function SignInPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const { success } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800)); // Simulate auth
    signIn(email);
    success("Welcome back!", "You have been signed in successfully.");
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
          <EagleLogo />
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "var(--text-primary)",
              letterSpacing: "-0.03em",
              marginBottom: "6px",
              marginTop: "12px",
            }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>
            Sign in to your Eagle account
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
                htmlFor="email"
                style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <div style={{ position: "relative" }}>
              <input
                id="password"
                type={showPw ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 40px 10px 14px",
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
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--text-muted)",
                  display: "flex",
                }}
                aria-label={showPw ? "Hide password" : "Show password"}
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            </div>

            <button
              id="sign-in-btn"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "100%", padding: "12px", fontSize: "14px", marginTop: "4px", borderRadius: "10px" }}
            >
              {loading ? "Signing in…" : (
                <span style={{ display: "flex", alignItems: "center", gap: "6px", justifyContent: "center" }}>
                  Sign in <ArrowRight size={15} />
                </span>
              )}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "var(--text-muted)", marginTop: "20px" }}>
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
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
              Create one
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
