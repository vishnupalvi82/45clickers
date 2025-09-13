import { Suspense, lazy } from "react"
import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import { OptimizedBackgroundGradient } from "@/components/optimized-background-gradient"
import OptimizedFloatingElements from "@/components/optimized-floating-elements"
import OptimizedPageTransitions from "@/components/optimized-page-transitions"
import SectionDivider from "@/components/section-divider"
// import VerticalVideoGrid from "@/components/vertical-video-grid"
import PortfolioSection from "@/components/portfolio-section"
import TestimonialsSection from "@/components/testimonials-section"
import SocialSection from "@/components/social-section"
import Footer from "@/components/footer"

// Lazy load non-critical components
const AboutSection = lazy(() => import("@/components/about-section"))
const ServicesSection = lazy(() => import("@/components/services-section"))
const WorkShowcase = lazy(() => import("@/components/work-showcase"))

// Loading component
function SectionLoader() {
  return (
    <div className="py-20 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black">
      <OptimizedBackgroundGradient />
      <OptimizedPageTransitions />
      <OptimizedFloatingElements />

      {/* Above the fold content - loaded immediately */}
      <div className="above-fold">
        <Header />
        <HeroSection />
      </div>

      <SectionDivider variant="wave" color="purple" />

      {/* Below the fold content - lazy loaded */}
      <div className="offscreen">
        <Suspense fallback={<SectionLoader />}>
          <AboutSection />
        </Suspense>

        <SectionDivider variant="diagonal" color="blue" />

        <Suspense fallback={<SectionLoader />}>
          <ServicesSection />
        </Suspense>

        <SectionDivider variant="curve" color="cyan" />

        <Suspense fallback={<SectionLoader />}>
          <WorkShowcase />
        </Suspense>

        {/* <SectionDivider variant="wave" color="purple" /> */}

        {/* New Vertical Video Grid Section */}
        {/* <Suspense fallback={<SectionLoader />}>
          <VerticalVideoGrid />
        </Suspense>

        <SectionDivider variant="diagonal" color="blue" /> */}

        <Suspense fallback={<SectionLoader />}>
          <PortfolioSection />
        </Suspense>

        <SectionDivider variant="curve" color="cyan" />

        <Suspense fallback={<SectionLoader />}>
          <TestimonialsSection />
        </Suspense>

        <SectionDivider variant="wave" color="purple" />

        <Suspense fallback={<SectionLoader />}>
          <SocialSection />
        </Suspense>

        <Suspense fallback={<SectionLoader />}>
          <Footer />
        </Suspense>
      </div>
    </main>
  )
}
