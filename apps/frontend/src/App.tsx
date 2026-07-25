import { useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { WorkspacePage } from "./pages/WorkspacePage";

type ViewState = "landing" | "workspace";

function App() {
  const [view, setView] = useState<ViewState>("landing");

  return (
    <>
      {view === "landing" ? (
        <LandingPage onLaunchPlanner={() => setView("workspace")} />
      ) : (
        <WorkspacePage onBack={() => setView("landing")} />
      )}
    </>
  );
}

export default App;