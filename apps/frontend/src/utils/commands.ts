import type { CommandItem } from "../components/ui/CommandPalette";
import { Zap, Clock, BookOpen, DollarSign, Info, LogIn, Sun, Moon } from "lucide-react";

export function createCommands(go: (path: string) => void, resolvedTheme: "dark" | "light", toggleTheme: () => void, onClose: () => void): CommandItem[] {
  return [
    {
      id: "workspace",
      label: "Open Workspace",
      description: "Start planning a new trip",
      icon: Zap,
      action: () => go("/workspace"),
      group: "Navigation",
      shortcut: "W",
    },
    {
      id: "history",
      label: "View History",
      description: "Browse your past travel plans",
      icon: Clock,
      action: () => go("/history"),
      group: "Navigation",
      shortcut: "H",
    },
    {
      id: "home",
      label: "Go Home",
      description: "Return to landing page",
      icon: Clock,
      action: () => go("/"),
      group: "Navigation",
    },
    {
      id: "docs",
      label: "Documentation",
      description: "Architecture, agents, API reference",
      icon: BookOpen,
      action: () => go("/docs"),
      group: "Navigation",
    },
    {
      id: "pricing",
      label: "Pricing",
      description: "Plans and billing",
      icon: DollarSign,
      action: () => go("/pricing"),
      group: "Navigation",
    },
    {
      id: "about",
      label: "About Eagle",
      description: "Mission, team, roadmap",
      icon: Info,
      action: () => go("/about"),
      group: "Navigation",
    },
    {
      id: "signin",
      label: "Sign In",
      description: "Access your account",
      icon: LogIn,
      action: () => go("/login"),
      group: "Account",
    },
    {
      id: "theme",
      label: resolvedTheme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
      description: "Toggle color scheme",
      icon: resolvedTheme === "dark" ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose();
      },
      group: "Preferences",
      shortcut: "T",
    },
  ];
}
