import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Check } from "lucide-react";
import { useToast } from "../../context/ToastContext";

function EagleLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#4F46E5"/>
      <path d="M16 6C16 6 8.5 10.5 7 15C9.5 14 12.5 14 14.5 16L16 26L17.5 16C19.5 14 22.5 14 25 15C23.5 10.5 16 6 16 6Z" fill="white" fillOpacity="0.95"/>
    </svg>
  );
}

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { success } = useToast();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    success("Email Sent", "Check your inbox for password reset instructions");
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "440px" }}
      >
        <button
          onClick={() => navigate("/login")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            fontSize: "14px",
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            marginBottom: "24px",
          }}
        >
          <ArrowLeft size={16} />
          Back to Sign In
        </button>

        <div
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border)",
            borderRadius: "24px",
            padding: "48px 40px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
            <EagleLogo size={48} />
          </div>

          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "var(--text-primary)", textAlign: "center", marginBottom: "12px" }}>
            Reset your password
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)", textAlign: "center", marginBottom: "32px", lineHeight: 1.6 }}>
            {submitted 
              ? "We've sent a password reset link to your email. Please check your inbox."
              : "Enter your email address and we'll send you a link to reset your password."
            }
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "24px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
                  Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={18}
                    color="var(--text-muted)"
                    style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    style={{
                      width: "100%",
                      padding: "12px 14px 12px 44px",
                      background: "var(--surface-2)",
                      border: "1px solid var(--border)",
                      borderRadius: "12px",
                      color: "var(--text-primary)",
                      fontSize: "15px",
                      fontFamily: "inherit",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={!email.trim()}
                className="btn btn-primary"
                style={{ width: "100%", padding: "14px", fontSize: "15px", fontWeight: 600 }}
              >
                Send Reset Link
              </button>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "32px 0",
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "var(--success-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--success)",
                }}
              >
                <Check size={32} strokeWidth={2.5} />
              </div>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-secondary"
                style={{ padding: "12px 24px", fontSize: "14px", fontWeight: 600 }}
              >
                Return to Sign In
              </button>
            </motion.div>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
          Remember your password?{" "}
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "none",
              border: "none",
              color: "var(--accent)",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Sign in
          </button>
        </p>
      </motion.div>
    </div>
  );
}
