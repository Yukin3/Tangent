import { HeroSection } from "./hero-section";
import { FeaturesSection } from "./features-section";
import { IntegrationSection } from "./integrations-section";
import { PartnersSection } from "./partners-section";


export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <IntegrationSection />
      <PartnersSection />
    </div>
  )
}

