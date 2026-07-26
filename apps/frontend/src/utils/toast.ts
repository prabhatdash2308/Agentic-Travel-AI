import type { ToastType } from "../context/ToastContext.types";
import { CheckCircle2, XCircle, Info, AlertTriangle } from "lucide-react";

export const ICON_MAP: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

export const COLOR_MAP: Record<ToastType, string> = {
  success: "var(--success)",
  error: "var(--danger)",
  info: "var(--info)",
  warning: "var(--warning)",
};

let counter = 0;

export function generateToastId(): string {
  return `toast-${++counter}`;
}
