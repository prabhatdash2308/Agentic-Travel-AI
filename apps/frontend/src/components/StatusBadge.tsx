import { Check, Loader2, Clock } from "lucide-react";

type Status = "pending" | "active" | "done";

interface StatusBadgeProps {
  status: Status;
  showIcon?: boolean;
}

export function StatusBadge({ status, showIcon = true }: StatusBadgeProps) {
  const configs = {
    active: {
      className: "badge badge-active",
      icon: (
        <Loader2
          size={11}
          style={{ animation: "spin 1.2s linear infinite" }}
        />
      ),
      label: "Running",
    },
    done: {
      className: "badge badge-done",
      icon: <Check size={11} strokeWidth={2.5} />,
      label: "Done",
    },
    pending: {
      className: "badge badge-pending",
      icon: <Clock size={11} />,
      label: "Pending",
    },
  };

  const { className, icon, label } = configs[status];

  return (
    <span className={className} aria-label={`Status: ${label}`}>
      {showIcon && icon}
      {label}
    </span>
  );
}
