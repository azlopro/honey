'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'

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

/* ── Honey Jar SVG ────────────────────────────────────────────────── */
function HoneyJar() {
  return (
    <svg
      viewBox="0 0 280 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      style={{ filter: 'drop-shadow(0 40px 80px var(--gold-35))' }}
    >
      <defs>
        <linearGradient id="jarBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0C87A" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#D4A843" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#8B5E2A" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="jarShine" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="lidGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#4A3010" />
          <stop offset="100%" stopColor="#2C1E12" />
        </linearGradient>
        <linearGradient id="lidShine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8B6A3A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#8B6A3A" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="honeyFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F0C87A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#B8860B" stopOpacity="0.9" />
        </linearGradient>
        <radialGradient id="glowCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F0C87A" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#D4A843" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <clipPath id="jarClip">
          <path d="M55 110 Q40 130 40 160 L40 310 Q40 340 70 340 L210 340 Q240 340 240 310 L240 160 Q240 130 225 110 Z" />
        </clipPath>
      </defs>

      <path
        d="M57 115 Q42 134 42 162 L42 308 Q42 338 70 338 L210 338 Q238 338 238 308 L238 162 Q238 134 223 115 Z"
        fill="url(#jarBody)"
        opacity="0.95"
      />
      <ellipse cx="140" cy="175" rx="92" ry="14" fill="#F0C87A" opacity="0.5" />
      <ellipse cx="140" cy="173" rx="88" ry="11" fill="#FAE8B4" opacity="0.25" />

      <g clipPath="url(#jarClip)" opacity="0.12">
        {[0, 1, 2, 3, 4].map(row =>
          [0, 1, 2, 3].map(col => {
            const x = 50 + col * 48 + (row % 2 === 1 ? 24 : 0)
            const y = 160 + row * 42
            const r = 22
            const pts = Array.from({ length: 6 }, (_, i) => {
              const a = (Math.PI / 3) * i - Math.PI / 6
              return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`
            }).join(' ')
            return (
              <polygon key={`${row}-${col}`} points={pts} fill="none" stroke="#FAF6EF" strokeWidth="1" />
            )
          })
        )}
      </g>

      <path d="M57 115 Q42 135 42 163 L42 260 Q55 250 70 200 L72 115 Z" fill="url(#jarShine)" opacity="0.5" />
      <path d="M223 115 Q238 135 238 163 L238 260 Q225 250 215 200 L213 115 Z" fill="url(#jarShine)" opacity="0.18" />
      <path d="M55 110 Q40 130 40 160 L40 310 Q40 340 70 340 L210 340 Q240 340 240 310 L240 160 Q240 130 225 110 Z" fill="none" stroke="rgba(212,168,67,0.3)" strokeWidth="1" />

      <rect x="90" y="80" width="100" height="35" rx="4" fill="url(#jarBody)" opacity="0.7" stroke="rgba(212,168,67,0.2)" strokeWidth="1" />
      <rect x="95" y="82" width="40" height="31" rx="2" fill="url(#jarShine)" opacity="0.4" />

      <rect x="75" y="48" width="130" height="38" rx="6" fill="url(#lidGrad)" />
      <rect x="75" y="48" width="130" height="18" rx="6" fill="url(#lidShine)" />
      <rect x="80" y="82" width="120" height="5" rx="2" fill="#1A1410" opacity="0.5" />
      <rect x="78" y="60" width="124" height="2" rx="1" fill="rgba(212,168,67,0.3)" />
      <rect x="78" y="70" width="124" height="1" rx="0.5" fill="rgba(212,168,67,0.15)" />

      <rect x="60" y="195" width="160" height="100" rx="3" fill="rgba(26,20,16,0.25)" stroke="rgba(212,168,67,0.2)" strokeWidth="0.5" />
      <text x="140" y="232" textAnchor="middle" fontFamily="Georgia, serif" fontSize="11" letterSpacing="6" fill="rgba(212,168,67,0.85)" style={{ textTransform: 'uppercase' }}>HONEY <tspan fontFamily="var(--font-cormorant), Cormorant Garamond, serif" fontWeight="300" style={{ fontVariantNumeric: 'lining-nums' }}>56°</tspan></text>
      <line x1="85" y1="240" x2="195" y2="240" stroke="rgba(212,168,67,0.3)" strokeWidth="0.5" />
      <text x="140" y="254" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7" letterSpacing="4" fill="rgba(212,168,67,0.5)">RAW · HONEY</text>
      <text x="140" y="272" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" fill="rgba(212,168,67,0.35)" letterSpacing="2">SINGLE ORIGIN</text>
      <text x="140" y="285" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="6" fill="rgba(212,168,67,0.25)">350g</text>

      <path d="M148 86 Q148 100 144 108 Q141 114 144 120 Q147 114 148 108 Q150 100 152 86" fill="#D4A843" opacity="0.7" />
      <ellipse cx="144" cy="122" rx="5" ry="6" fill="#D4A843" opacity="0.6" />
    </svg>
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
export default function Hero() {
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

  const headline = ['Liquid', 'Gold,', 'Perfected.']

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
        <div style={{ width: 'clamp(160px, 26vw, 280px)', height: 'clamp(220px, 35vw, 380px)', flexShrink: 0 }}>
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
            Single-Origin · Raw · Limited Harvest
          </motion.p>
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
          Batch 2026 — Wild Coastal
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
          350g · €38
        </span>
        <div className="h-14 w-px" style={{ background: 'linear-gradient(to top, transparent, var(--gold-40))' }} />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <span className="uppercase" style={{ color: 'var(--gold-40)', fontSize: '8px', letterSpacing: '0.4em' }}>
          Scroll
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
    </section>
  )
}
