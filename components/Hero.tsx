'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import Image from 'next/image'

/* ── Crossfading video background ─────────────────────────────────── */
const HERO_VIDEOS = ['/videos/thy1.mp4', '/videos/thy2.mp4', '/videos/thy3.mp4']

function HeroVideo() {
  const [activeIdx, setActiveIdx] = useState(0)
  const refs = useRef<(HTMLVideoElement | null)[]>([])
  const pauseTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // Cancel any pending pause from a previous cleanup (handles React Strict Mode double-invoke)
    if (pauseTimer.current) { clearTimeout(pauseTimer.current); pauseTimer.current = null }

    const vid = refs.current[activeIdx]
    if (!vid) return
    // Only reset to start if the video has already played through
    if (vid.ended) vid.currentTime = 0
    vid.play().catch(() => {})

    const onTimeUpdate = () => {
      if (!vid.duration) return
      if (vid.duration - vid.currentTime < 1.5) {
        const next = (activeIdx + 1) % HERO_VIDEOS.length
        refs.current[next]?.play().catch(() => {})
      }
    }
    const onEnded = () => setActiveIdx(prev => (prev + 1) % HERO_VIDEOS.length)

    vid.addEventListener('timeupdate', onTimeUpdate)
    vid.addEventListener('ended', onEnded)

    return () => {
      vid.removeEventListener('timeupdate', onTimeUpdate)
      vid.removeEventListener('ended', onEnded)
      const v = vid
      pauseTimer.current = setTimeout(() => { v.pause(); pauseTimer.current = null }, 1500)
    }
  }, [activeIdx])

  return (
    <>
      {HERO_VIDEOS.map((src, i) => (
        <video
          key={src}
          ref={el => { refs.current[i] = el }}
          muted
          playsInline
          // Only eagerly fetch the first video; others load on-demand when play() is called
          preload={i === 0 ? 'auto' : 'none'}
          poster={i === 0 ? '/images/hero-poster.jpg' : undefined}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: i === activeIdx ? 1 : 0,
            transition: 'opacity 1.2s ease',
          }}
        >
          <source src={src} type="video/mp4" />
        </video>
      ))}
    </>
  )
}

/* ── Honey Bottle Image ───────────────────────────────────────────── */
function HoneyJar() {
  return (
    <Image
      src="/images/hero-honey.png"
      alt="HONEY 56° bottle"
      fill
      sizes="(max-width: 768px) 34vw, 360px"
      quality={100}
      style={{ objectFit: 'contain', objectPosition: 'center', filter: 'drop-shadow(0 26px 52px rgba(140,85,8,0.55))' }}
      priority
    />
  )
}

/* ── Floating particles ───────────────────────────────────────────── */
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2.5 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 8 + 6,
    opacity: Math.random() * 0.35 + 0.08,
  }))

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, #F0C87A, #D4A843)',
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

/* ── Hero ─────────────────────────────────────────────────────────── */
import type { HeroDict } from '@/types/dict'

export default function Hero({ dict }: { dict: HeroDict }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const jarRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  // Mouse parallax — only on the inner jarRef, never touches centering
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!jarRef.current || !glowRef.current) return
      const xPct = (e.clientX / window.innerWidth - 0.5) * 2
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(jarRef.current, { x: xPct * 16, y: yPct * 10, rotateY: xPct * 8, rotateX: -yPct * 5, duration: 1.2, ease: 'power2.out' })
      gsap.to(glowRef.current, { x: xPct * 28, y: yPct * 18, duration: 1.8, ease: 'power2.out' })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Scroll — fade opacity only, no transform so centering stays intact
  useEffect(() => {
    const onScroll = () => {
      if (!containerRef.current) return
      const scrolled = window.scrollY
      gsap.to(containerRef.current, { opacity: Math.max(0, 1 - scrolled / 550), duration: 0 })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const headline = dict.headline

  return (
    <section
      ref={containerRef}
      id="story"
      className="relative w-full overflow-hidden"
      style={{
        height: '100svh',
        minHeight: 600,
        background: 'var(--bg-deep)',
      }}
    >
      {/* Crossfading video background */}
      <HeroVideo />
      {/* Dark overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(6,4,2,0.62) 0%, rgba(6,4,2,0.38) 40%, rgba(6,4,2,0.72) 100%)' }} />

      {/* Ambient glow rings */}
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
          style={{
            width: `${200 + i * 140}px`,
            height: `${200 + i * 140}px`,
            borderColor: `rgba(212,168,67,${0.06 - i * 0.015})`,
            animation: `ringPulse ${4 + i * 2}s linear ${i * 1.5}s infinite`,
          }}
        />
      ))}

      {/* Background glow blob */}
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 pointer-events-none"
        style={{
          width: 500,
          height: 500,
          marginLeft: -250,
          marginTop: -250,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--gold-18) 0%, rgba(184,134,11,0.08) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <Particles />

      {/* Jar + headline as one centered column — no guesswork on offsets */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
        style={{ zIndex: 2, paddingTop: '15px' }}
      >
        {/* Jar — 3-layer stack preserved (float + GSAP parallax) */}
        <div style={{ width: 'clamp(200px, 34vw, 360px)', height: 'clamp(280px, 46vw, 490px)', flexShrink: 0 }}>
          <div style={{ width: '100%', height: '100%', animation: 'float 7s ease-in-out infinite' }}>
            <div
              ref={jarRef}
              style={{ width: '100%', height: '100%', transformStyle: 'preserve-3d', perspective: 800 }}
            >
              <HoneyJar />
            </div>
          </div>
        </div>

        {/* Headline — sits naturally below jar with a fixed gap */}
        <div className="text-center" style={{ padding: '0 clamp(16px, 5vw, 60px)', marginTop: 'clamp(8px, 1.5vh, 20px)' }}>
          {headline.map((word, i) => (
            <motion.div
              key={word}
              initial={{ opacity: 0, y: 40, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: 1.8 + i * 0.18, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="font-serif block"
                style={{
                  fontSize: 'clamp(40px, 8vw, 108px)',
                  lineHeight: 0.95,
                  color: i === 2 ? 'transparent' : 'var(--cream)',
                  background: i === 2 ? 'linear-gradient(135deg, #F0C87A 0%, #D4A843 40%, #B8860B 100%)' : undefined,
                  WebkitBackgroundClip: i === 2 ? 'text' : undefined,
                  backgroundClip: i === 2 ? 'text' : undefined,
                  fontStyle: i === 2 ? 'italic' : 'normal',
                  fontWeight: i === 2 ? 700 : 400,
                  textShadow: i !== 2 ? '0 2px 40px rgba(0,0,0,0.5)' : undefined,
                }}
              >
                {word}
              </span>
            </motion.div>
          ))}

          <motion.p
            className="tracking-[0.3em] uppercase"
            style={{ color: 'var(--gold-55)', marginTop: 'clamp(12px, 2vw, 24px)', fontSize: 'clamp(9px, 1.1vw, 13px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
          >
            {dict.tagline}
          </motion.p>
          
          {/* Scroll indicator moved here so it's vertically flowing under the text and never overlaps */}
          <motion.div
            className="flex flex-col items-center gap-2"
            style={{ zIndex: 5, marginTop: 'clamp(32px, 6vh, 60px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
          >
            <span className="uppercase" style={{ color: 'var(--gold-40)', fontSize: '8px', letterSpacing: '0.4em' }}>
              {dict.scrollLabel}
            </span>
            <div className="relative" style={{ width: 1, height: 40, background: 'var(--gold-15)' }}>
              <motion.div
                className="absolute top-0 left-0 w-full"
                style={{ background: 'var(--honey-gold)', height: '40%' }}
                animate={{ y: [0, 24, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              />
            </div>
          </motion.div>

        </div>
      </div>

      {/* Left caption — desktop only */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3"
        style={{ left: 'clamp(24px, 4vw, 56px)', zIndex: 4 }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.6, duration: 0.8 }}
      >
        <div className="h-14 w-px" style={{ background: 'linear-gradient(to bottom, transparent, var(--gold-40))' }} />
        <span
          className="uppercase"
          style={{ color: 'var(--gold-40)', writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontSize: '8px', letterSpacing: '0.4em' }}
        >
          {dict.sideLeft}
        </span>
      </motion.div>

      {/* Right caption — desktop only */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-3"
        style={{ right: 'clamp(24px, 4vw, 56px)', zIndex: 4 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 2.6, duration: 0.8 }}
      >
        <span
          className="uppercase"
          style={{ color: 'var(--gold-40)', writingMode: 'vertical-rl', fontSize: '8px', letterSpacing: '0.4em' }}
        >
          {dict.sideRight}
        </span>
        <div className="h-14 w-px" style={{ background: 'linear-gradient(to top, transparent, var(--gold-40))' }} />
      </motion.div>
    </section>
  )
}
