import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { SignInPage } from "./pages/auth/SignInPage";
import { CreateAccountPage } from "./pages/auth/CreateAccountPage";
import { HistoryPage } from "./pages/HistoryPage";
import { DocsPage } from "./pages/DocsPage";
import { PricingPage } from "./pages/PricingPage";
import { AboutPage } from "./pages/AboutPage";
import { CommandPalette } from "./components/ui/CommandPalette";
import { useState, useEffect } from "react";

// Wrapper to provide useNavigate to WorkspacePage
function WorkspacePageWrapper() {
  const navigate = useNavigate();
  return <WorkspacePage onBack={() => navigate("/")} />;
}

function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === "Escape" && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [commandPaletteOpen]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<CreateAccountPage />} />
        <Route path="/workspace" element={<WorkspacePageWrapper />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </BrowserRouter>
  );
}

export default App;