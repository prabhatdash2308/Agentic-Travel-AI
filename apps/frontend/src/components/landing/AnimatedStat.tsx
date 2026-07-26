import { motion } from "framer-motion";
import { useCountUp } from "../../hooks/useCountUp";

interface AnimatedStatProps {
  value: number;
  suffix: string;
  label: string;
  delay: number;
  isInView: boolean;
}

export function AnimatedStat({ value, suffix, label, delay, isInView }: AnimatedStatProps) {
  const count = useCountUp(value, isInView);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ delay: 0.3 + delay * 0.1, duration: 0.6 }}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div
        style={{
          fontSize: "clamp(36px, 5vw, 56px)",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          color: "var(--text-primary)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {count}{suffix}
      </div>
      <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {label}
      </div>
    </motion.div>
  );
}
