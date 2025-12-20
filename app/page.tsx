import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { AnalyticsPreview } from "@/components/sections/analytics-preview";
import { Trust } from "@/components/sections/trust";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/sections/footer";
import { AnimatedBackground } from "@/components/sections/animated-background";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#010203]">
      <AnimatedBackground />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <AnalyticsPreview />
        <Trust />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
