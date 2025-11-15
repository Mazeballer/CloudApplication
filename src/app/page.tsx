import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ValuePropsSection } from "@/components/value-props-section"
import { CloudFeaturesSection } from "@/components/cloud-features-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { WorkshopMapSection } from "@/components/workshop-map-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { MetricsSection } from "@/components/metrics-section"
import { FAQSection } from "@/components/faq-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HeroSection />
        <ValuePropsSection />
        <CloudFeaturesSection />
        <HowItWorksSection />
        <WorkshopMapSection />
        <TestimonialsSection />
        <MetricsSection />
        <FAQSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
