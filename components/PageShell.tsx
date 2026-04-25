'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import NoiseOverlay from '@/components/NoiseOverlay'

const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false })
const CustomCursor = dynamic(() => import('@/components/CustomCursor'), { ssr: false })
const SmoothScroll = dynamic(() => import('@/components/SmoothScroll'), { ssr: false })

export default function PageShell({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false)
  const handleLoadComplete = useCallback(() => setLoaded(true), [])

  return (
    <>
      <NoiseOverlay />
      <CustomCursor />
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}
      <SmoothScroll>
        <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }}>
          {children}
        </div>
      </SmoothScroll>
    </>
  )
}
