interface SkeletonProps {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}

function Skeleton({ width = "100%", height = "16px", borderRadius = "8px", className = "" }: SkeletonProps) {
  return (
    <div
      className={`skeleton ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function LoadingSkeleton() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
      aria-label="Loading response..."
      aria-busy="true"
    >
      {/* Header skeleton */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <Skeleton width="55%" height="22px" />
        <Skeleton width="80%" height="14px" />
        <Skeleton width="65%" height="14px" />
      </div>

      {/* Card skeletons */}
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            background: "var(--surface-card)",
            border: "1px solid var(--border)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Skeleton width="36px" height="36px" borderRadius="10px" />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px" }}>
              <Skeleton width="40%" height="14px" />
              <Skeleton width="25%" height="12px" />
            </div>
            <Skeleton width="70px" height="24px" borderRadius="999px" />
          </div>
          <Skeleton width="100%" height="1px" borderRadius="0" />
          <Skeleton width="90%" height="13px" />
          <Skeleton width="75%" height="13px" />
          <Skeleton width="85%" height="13px" />
        </div>
      ))}
    </div>
  );
}

export { Skeleton };
