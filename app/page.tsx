import PageShell from '@/components/PageShell'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import ScrollStory from '@/components/ScrollStory'
import ProductSection from '@/components/ProductSection'
import Testimonials from '@/components/Testimonials'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <PageShell>
      <Navigation />
      <main>
        <Hero />
        <ScrollStory />
        <ProductSection />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </PageShell>
  )
}
