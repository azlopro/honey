'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'

import NoiseOverlay from '@/components/NoiseOverlay'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import ScrollStory from '@/components/ScrollStory'
import ProductSection from '@/components/ProductSection'
import Testimonials from '@/components/Testimonials'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

/* Heavy components lazy-loaded */
const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false })
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false })
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false })

export default function Home() {
  const [loaded, setLoaded] = useState(false)

  const handleLoadComplete = useCallback(() => {
    setLoaded(true)
  }, [])

  return (
    <>
      {/* Grain texture overlay — always on top */}
      <NoiseOverlay />

      {/* Custom cursor */}
      <CustomCursor />

      {/* Loading screen */}
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}

      {/* Main experience */}
      <SmoothScroll>
        <div
          style={{
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        >
          <Navigation />

          <main>
            <Hero />
            <ScrollStory />
            <ProductSection />
            <Testimonials />
            <CTASection />
          </main>

          <Footer />
        </div>
      </SmoothScroll>
    </>
  )
}
