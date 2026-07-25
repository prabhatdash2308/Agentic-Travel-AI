import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { WorkspacePage } from "./pages/WorkspacePage";
import { SignInPage } from "./pages/auth/SignInPage";
import { CreateAccountPage } from "./pages/auth/CreateAccountPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<SignInPage />} />
        <Route path="/register" element={<CreateAccountPage />} />
        <Route path="/workspace" element={<WorkspacePage onBack={() => window.location.href = '/'} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;