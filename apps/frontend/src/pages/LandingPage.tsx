import { GlassNavbar } from "../components/landing/GlassNavbar";
import { HeroSection } from "../components/landing/HeroSection";
import { StatsSection } from "../components/landing/StatsSection";
import { CommandSection } from "../components/landing/CommandSection";
import { WorkflowSection } from "../components/landing/WorkflowSection";
import { TimelineSection } from "../components/landing/TimelineSection";
import { DestinationsSection } from "../components/landing/DestinationsSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { DashboardSection } from "../components/landing/DashboardSection";
import { PricingSection } from "../components/landing/PricingSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";
import { LandingFooter } from "../components/landing/LandingFooter";

interface LandingPageProps {
  onLaunchPlanner: () => void;
}

export function LandingPage({ onLaunchPlanner }: LandingPageProps) {
  return (
    <div style={{ background: "var(--bg)", color: "var(--text-primary)", minHeight: "100vh" }}>
      <GlassNavbar onLaunchPlanner={onLaunchPlanner} />

      <main>
        <HeroSection onLaunchPlanner={onLaunchPlanner} />
        <StatsSection />

        {/* We use an anchor for 'How it Works' */}
        <div id="how-it-works">
          <CommandSection />
        </div>

        <WorkflowSection />
        <TimelineSection />

        <div id="features">
          <DestinationsSection />
          <FeaturesSection />
          <DashboardSection />
        </div>

        <div id="pricing">
          <PricingSection />
        </div>

        <TestimonialsSection />
      </main>

      <LandingFooter />
    </div>
  );
}
