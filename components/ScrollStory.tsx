'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Stagger text reveal ──────────────────────────────────────────── */
function RevealText({
  text,
  delay = 0,
  className = '',
  style = {},
  align = 'center',
}: {
  text: string
  delay?: number
  className?: string
  style?: React.CSSProperties
  align?: 'left' | 'center'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const words = text.split(' ')

  return (
    <div ref={ref} className={`overflow-hidden ${className}`} style={style}>
      <div className={`flex flex-wrap gap-x-[0.35em] ${align === 'center' ? 'justify-center' : 'justify-start'}`}>
        {words.map((word, i) => (
          <span key={i} className="overflow-hidden inline-block">
            <motion.span
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              animate={inView ? { y: 0, opacity: 1 } : {}}
              transition={{ delay: delay + i * 0.06, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {word}
            </motion.span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Image reveal with mask ───────────────────────────────────────── */
function ImageReveal({ children, delay = 0, direction = 'left' }: { children: React.ReactNode; delay?: number; direction?: 'left' | 'right' | 'up' }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-5% 0px' })

  const clipStart = { left: 'inset(0 100% 0 0)', right: 'inset(0 0 0 100%)', up: 'inset(100% 0 0 0)' }[direction]

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: clipStart, opacity: 0 }}
      animate={inView ? { clipPath: 'inset(0 0% 0 0)', opacity: 1 } : {}}
      transition={{ delay, duration: 1.1, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ── Story chapter ────────────────────────────────────────────────── */
function Chapter({ number, title, body, side, visual }: {
  number: string; title: string; body: string; side: 'left' | 'right'; visual: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15% 0px' })

  return (
    <div
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-2 items-center"
      style={{ gap: 'clamp(32px, 5vw, 80px)', padding: 'clamp(48px, 6vw, 96px) 0' }}
    >
      {/* Visual */}
      <div className={side === 'right' ? 'lg:order-last' : ''}>
        <ImageReveal delay={0.1} direction={side === 'left' ? 'left' : 'right'}>
          {visual}
        </ImageReveal>
      </div>

      {/* Text */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2vw, 28px)' }}>
        <motion.span
          className="uppercase block"
          style={{ color: 'var(--gold-50)', fontSize: 'clamp(9px, 0.9vw, 11px)', letterSpacing: '0.5em' }}
          initial={{ opacity: 0, x: side === 'left' ? -20 : 20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {number}
        </motion.span>

        <RevealText
          text={title}
          delay={0.2}
          align="left"
          className="font-serif leading-tight"
          style={{ fontSize: 'clamp(28px, 3.5vw, 52px)', color: 'var(--cream)' }}
        />

        <motion.div
          className="h-px w-10"
          style={{ background: 'linear-gradient(to right, var(--honey-gold), transparent)' }}
          initial={{ scaleX: 0, originX: 0 }}
          animate={inView ? { scaleX: 1 } : {}}
          transition={{ delay: 0.4, duration: 0.8 }}
        />

        <motion.p
          className="leading-relaxed"
          style={{
            color: 'var(--cream-55)',
            maxWidth: '38ch',
            fontWeight: 300,
            fontSize: 'clamp(14px, 1.1vw, 16px)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {body}
        </motion.p>
      </div>
    </div>
  )
}

/* ── Photo panel helper ───────────────────────────────────────────── */
function PhotoVisual({ src, alt, label, position = 'center' }: { src: string; alt: string; label: string; position?: string }) {
  return (
    <div
      className="relative rounded overflow-hidden"
      style={{ aspectRatio: '4/3', border: '1px solid var(--gold-08)' }}
    >
      <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover', objectPosition: position }} />
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(6,4,2,0.75) 0%, transparent 55%)' }} />
      <div className="absolute bottom-0 inset-x-0 pb-4 text-center">
        <p className="uppercase" style={{ color: 'var(--gold-40)', fontSize: '10px', letterSpacing: '0.25em' }}>{label}</p>
      </div>
    </div>
  )
}

/* ── Photo visuals (6 images — use freely) ────────────────────────── */
// Currently used: CoastalPhotoVisual (ch01), ThyLandscapeVisual (ch03)
export function CoastalPhotoVisual()     { return <PhotoVisual src="/images/daytime-picture-of-the-beach-ocean.jpg"               alt="Wild coastal beach, Thy, Denmark"            label="Wild coastal Denmark"    position="center 60%" /> }
export function ThyLandscapeVisual()     { return <PhotoVisual src="/images/nature-of-thy.jpg"                                      alt="Heathland and lake, Thy National Park"       label="Thy National Park"       position="center 40%" /> }
export function MoonVisual()             { return <PhotoVisual src="/images/big-orange-moon-over-trees-and-house-and-windmills.jpg" alt="Full orange moon rising over Danish farmland" label="Danish countryside"      position="center 60%" /> }
export function NorthernLightsVisual()   { return <PhotoVisual src="/images/northeren-lights-thy.jpg"                               alt="Northern lights over a fishing boat, Thy"     label="Northern lights, Thy"    position="center 40%" /> }
export function SealVisual()             { return <PhotoVisual src="/images/Smiling-seal.jpg"                                       alt="Harbour seal on the rocks, Danish coast"      label="Wild coastal life"       position="center 30%" /> }
export function SunsetMeadowVisual()     { return <PhotoVisual src="/images/very-nice-sunset-in-the-meadows.jpg"                    alt="Golden sunset over coastal wetlands, Thy"     label="Coastal wetlands, Thy"   position="center 50%" /> }

/* ── Hex cell visual ──────────────────────────────────────────────── */
function HoneycombVisual() {
  const hexes = [
    { x: 100, y: 80, filled: true, delay: 0.1 }, { x: 160, y: 80, filled: false, delay: 0.15 },
    { x: 220, y: 80, filled: true, delay: 0.2 }, { x: 70, y: 133, filled: false, delay: 0.25 },
    { x: 130, y: 133, filled: true, delay: 0.1 }, { x: 190, y: 133, filled: false, delay: 0.2 },
    { x: 250, y: 133, filled: true, delay: 0.3 }, { x: 100, y: 186, filled: true, delay: 0.2 },
    { x: 160, y: 186, filled: false, delay: 0.15 }, { x: 220, y: 186, filled: true, delay: 0.1 },
    { x: 70, y: 239, filled: false, delay: 0.25 }, { x: 130, y: 239, filled: true, delay: 0.3 },
    { x: 190, y: 239, filled: false, delay: 0.2 }, { x: 250, y: 239, filled: true, delay: 0.1 },
  ]

  const hexPoints = (cx: number, cy: number, r: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const a = (Math.PI / 3) * i - Math.PI / 6
      return `${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`
    }).join(' ')

  return (
    <div
      className="relative rounded overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, var(--charcoal-mid) 0%, var(--charcoal) 100%)',
        aspectRatio: '4/3',
        border: '1px solid var(--gold-10)',
      }}
    >
      <svg viewBox="0 0 320 320" className="w-full h-full" style={{ opacity: 0.9 }}>
        <defs>
          <linearGradient id="hexFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0C87A" />
            <stop offset="100%" stopColor="#8B5E2A" />
          </linearGradient>
        </defs>
        {hexes.map((h, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: h.delay + i * 0.03, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: `${h.x}px ${h.y}px` }}
          >
            <motion.polygon
              points={hexPoints(h.x, h.y, 28)}
              fill={h.filled ? 'url(#hexFill)' : 'none'}
              stroke="rgba(212,168,67,0.25)"
              strokeWidth="1"
              animate={h.filled ? { opacity: [1, 0.6, 1] } : undefined}
              transition={h.filled ? { duration: 3 + (i % 3), repeat: Infinity, ease: 'easeInOut', delay: (i % 2) } : undefined}
            />
          </motion.g>
        ))}
      </svg>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, var(--charcoal-70) 100%)' }} />
      <div className="absolute bottom-0 inset-x-0 pb-4 text-center">
        <p className="uppercase" style={{ color: 'var(--gold-40)', fontSize: '10px', letterSpacing: '0.25em' }}>Hexagonal perfection</p>
      </div>
    </div>
  )
}

/* ── Flower field visual ──────────────────────────────────────────── */
function FlowerVisual() {
  return (
    <div
      className="relative rounded overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #3D2B15 0%, var(--charcoal) 100%)',
        aspectRatio: '4/3',
        border: '1px solid var(--gold-08)',
      }}
    >
      <svg viewBox="0 0 400 300" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="flowerGlow" cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="rgba(212,168,67,0.25)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        <rect width="400" height="300" fill="url(#flowerGlow)" />
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ transformOrigin: '320px 60px' }}
        >
          <motion.circle
            cx="320" cy="60" fill="rgba(240,200,122,0.12)"
            animate={{ r: [40, 46, 40] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.circle
            cx="320" cy="60" fill="rgba(240,200,122,0.2)"
            animate={{ r: [24, 26, 24] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />
        </motion.g>
        {[60, 110, 160, 210, 260, 310, 360].map((x, i) => (
          <g key={x}>
            <motion.line x1={x} y1={300} x2={x + (i % 2 === 0 ? -10 : 10)} y2={180 + (i % 3) * 20} stroke="rgba(107,66,38,0.5)" strokeWidth="2"
              initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.8 }} />
            {[0, 60, 120, 180, 240, 300].map(deg => (
              <motion.ellipse key={deg}
                cx={x + (i % 2 === 0 ? -10 : 10) + 14 * Math.cos((deg * Math.PI) / 180)}
                cy={180 + (i % 3) * 20 + 14 * Math.sin((deg * Math.PI) / 180)}
                rx={7} ry={4}
                transform={`rotate(${deg} ${x + (i % 2 === 0 ? -10 : 10)} ${180 + (i % 3) * 20})`}
                fill={i % 2 === 0 ? 'rgba(212,168,67,0.5)' : 'rgba(240,200,122,0.4)'}
                initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                style={{ transformOrigin: `${x}px ${180 + (i % 3) * 20}px` }}
              />
            ))}
            <circle cx={x + (i % 2 === 0 ? -10 : 10)} cy={180 + (i % 3) * 20} r={6} fill="rgba(139,94,42,0.7)" />
          </g>
        ))}
        <ellipse cx="200" cy="300" rx="200" ry="30" fill="rgba(107,66,38,0.15)" />
      </svg>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, var(--charcoal-60) 0%, transparent 50%)' }} />
      <div className="absolute bottom-0 inset-x-0 pb-4 text-center">
        <p className="uppercase" style={{ color: 'var(--gold-40)', fontSize: '10px', letterSpacing: '0.25em' }}>Wildflower meadows</p>
      </div>
    </div>
  )
}

/* ── Drip visual ──────────────────────────────────────────────────── */
function DripVisual() {
  return (
    <div
      className="relative overflow-hidden rounded"
      style={{
        background: 'linear-gradient(135deg, var(--charcoal-mid) 0%, var(--charcoal) 100%)',
        aspectRatio: '4/3',
        border: '1px solid var(--gold-10)',
      }}
    >
      <svg viewBox="0 0 320 240" className="w-full h-full">
        <defs>
          <linearGradient id="dripGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F0C87A" />
            <stop offset="100%" stopColor="#8B5E2A" />
          </linearGradient>
          <filter id="dripGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <ellipse cx="160" cy="215" rx="80" ry="15" fill="rgba(212,168,67,0.3)" filter="url(#dripGlow)" />
        <motion.path d="M160 0 Q155 60 158 120 Q160 150 155 180 Q150 210 160 215"
          fill="none" stroke="url(#dripGrad)" strokeWidth="12" strokeLinecap="round"
          initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
          transition={{ duration: 1.5, ease: 'easeInOut' }} filter="url(#dripGlow)" />
          
        {/* Continuously flowing internal streaks to simulate thick liquid movement */}
        {[0, 1, 2].map((i) => (
          <motion.ellipse key={`flowstreak-${i}`}
            cx={160 + (i === 1 ? -1.5 : i === 2 ? 1.5 : 0)} cy={0} rx={1.5} ry={12} fill="rgba(255, 230, 150, 0.5)"
            initial={{ opacity: 0, cy: 0 }}
            animate={{ cy: [0, 110, 215], opacity: [0, 0.8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear", delay: i * 1.5 + 1.5 }}
            filter="url(#dripGlow)"
          />
        ))}
        
        {[{ cx: 157, cy: 195, r: 10 }, { cx: 153, cy: 205, r: 7 }, { cx: 160, cy: 213, r: 12 }].map((d, i) => (
          <motion.ellipse key={i} cx={d.cx} cy={d.cy} rx={d.r} ry={d.r * 1.3} fill="url(#dripGrad)"
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            animate={{ y: [0, i % 2 === 0 ? 3 : -2, 0], scaleX: [1, 1.15, 1], scaleY: [1, 0.9, 1] }}
            transition={{
              opacity: { delay: 1.2 + i * 0.15, duration: 0.4 },
              scale: { delay: 1.2 + i * 0.15, duration: 0.4 },
              y: { delay: 1.5 + i * 0.2, duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
              scaleX: { delay: 1.5 + i * 0.2, duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" },
              scaleY: { delay: 1.5 + i * 0.2, duration: 2 + i * 0.5, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ transformOrigin: `${d.cx}px ${d.cy}px` }}
          />
        ))}
        {[80, 240].map((x, i) => (
          <motion.path key={x}
            fill="none" stroke="rgba(212,168,67,0.3)" strokeWidth="5" strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            animate={{
              d: [
                `M${x} 30 Q${x - 5} 80 ${x + 3} 130 Q${x + 5} 155 ${x} 170`,
                `M${x} 30 Q${x + 4} 70 ${x - 2} 125 Q${x - 4} 160 ${x} 170`,
                `M${x} 30 Q${x - 5} 80 ${x + 3} 130 Q${x + 5} 155 ${x} 170`
              ]
            }}
            transition={{
              pathLength: { delay: 0.3 + i * 0.2, duration: 1.2 },
              d: { delay: 0.3 + i * 0.2, duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }
            }}
          />
        ))}
        <motion.ellipse cx="160" cy="213" rx="60" ry="10" fill="rgba(240,200,122,0.2)"
          animate={{ scaleX: [1, 1.17, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />
      </svg>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 100%, var(--gold-10) 0%, transparent 70%)' }} />
      <div className="absolute bottom-0 inset-x-0 pb-4 text-center">
        <p className="uppercase" style={{ color: 'var(--gold-40)', fontSize: '10px', letterSpacing: '0.25em' }}>Unfiltered. Unprocessed.</p>
      </div>
    </div>
  )
}

/* ── Main section ─────────────────────────────────────────────────── */
export default function ScrollStory() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.to(el, {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
    return () => ctx.revert()
  }, [])

  const chapters = [
    {
      number: '01 / Origin',
      title: 'Born on the wild coast.',
      body: 'Our single-origin honey is harvested from wild coastal landscapes along the Danish shoreline — untouched by pesticides, far from industry. Every jar carries the living character of the North Sea coast.',
      side: 'left' as const,
      visual: <SunsetMeadowVisual />,
    },
    {
      number: '02 / Craft',
      title: 'Architecture of flavour.',
      body: 'Bees engineer perfection — hexagonal chambers calibrated to the millimetre. We simply preserve what they create: nothing added, nothing removed.',
      side: 'right' as const,
      visual: <HoneycombVisual />,
    },
    {
      number: '03 / Purity',
      title: 'Raw. Unfiltered. Alive.',
      body: 'Aurum honey is cold-extracted to preserve every enzyme, pollen grain, and antioxidant. What reaches you is exactly what the hive intended.',
      side: 'left' as const,
      visual: <DripVisual />,
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="craft"
      style={{
        background: 'radial-gradient(ellipse 100% 80% at 50% 50%, var(--bg-mid) 0%, var(--bg-deep) 100%)',
        backgroundSize: '100% 120%',
        backgroundPosition: '0% 0%',
      }}
    >
      {/* Single centered container — everything aligns to the same max-width */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>

        {/* Section intro */}
        <div style={{
          paddingTop: 'clamp(64px, 8vw, 120px)',
          paddingBottom: 'clamp(24px, 3vw, 48px)',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <motion.span
            className="uppercase block"
            style={{ color: 'var(--gold-40)', fontSize: 'clamp(9px, 0.9vw, 11px)', letterSpacing: '0.6em', marginBottom: 'clamp(16px, 2vw, 28px)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            The Aurum Story
          </motion.span>

          <RevealText
            text="Three reasons this honey is different."
            delay={0.1}
            className="font-serif"
            style={{ fontSize: 'clamp(24px, 3.5vw, 48px)', color: 'var(--cream)', maxWidth: '18ch' }}
          />
        </div>

        {/* Separator */}
        <motion.div
          style={{ width: 1, height: 64, background: 'linear-gradient(to bottom, var(--gold-40), transparent)', margin: '0 auto' }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* Chapters */}
        <div style={{ borderTop: '1px solid var(--gold-07)' }}>
          {chapters.map((ch, i) => (
            <div key={ch.number} style={{ borderBottom: i < chapters.length - 1 ? '1px solid var(--gold-07)' : 'none' }}>
              <Chapter {...ch} />
            </div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          className="grid grid-cols-3"
          style={{
            gap: 'clamp(24px, 4vw, 48px)',
            padding: 'clamp(40px, 6vw, 80px) 0',
            marginTop: 'clamp(16px, 2vw, 32px)',
            borderTop: '1px solid var(--gold-08)',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {[
            { value: '100%', label: 'Pure honey' },
            { value: '0', label: 'Additives' },
            { value: '2026', label: 'Harvest batch' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="font-serif mb-2" style={{ fontSize: 'clamp(28px, 4vw, 48px)', color: 'var(--honey-gold)' }}>{stat.value}</p>
              <p className="uppercase" style={{ fontSize: 'clamp(8px, 0.85vw, 11px)', letterSpacing: '0.3em', color: 'var(--cream-35)' }}>{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
