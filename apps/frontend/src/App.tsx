import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { lazy, Suspense, useState, useEffect } from "react";
import { CommandPalette } from "./components/ui/CommandPalette";

const LandingPage = lazy(() => import("./pages/LandingPage").then(m => ({ default: m.LandingPage })));
const WorkspacePage = lazy(() => import("./pages/WorkspacePage").then(m => ({ default: m.WorkspacePage })));
const SignInPage = lazy(() => import("./pages/auth/SignInPage").then(m => ({ default: m.SignInPage })));
const CreateAccountPage = lazy(() => import("./pages/auth/CreateAccountPage").then(m => ({ default: m.CreateAccountPage })));
const HistoryPage = lazy(() => import("./pages/HistoryPage").then(m => ({ default: m.HistoryPage })));
const DocsPage = lazy(() => import("./pages/DocsPage").then(m => ({ default: m.DocsPage })));
const PricingPage = lazy(() => import("./pages/PricingPage").then(m => ({ default: m.PricingPage })));
const AboutPage = lazy(() => import("./pages/AboutPage").then(m => ({ default: m.AboutPage })));

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
      <Suspense fallback={
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '100vh',
          background: 'var(--bg)',
          color: 'var(--text-muted)'
        }}>
          Loading...
        </div>
      }>
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
      </Suspense>
      <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </BrowserRouter>
  );
}

export default App;