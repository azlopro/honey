'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion'
import Image from 'next/image'
import type { ProductDict } from '@/types/dict'

const PRODUCTS_STATIC = [
  { id: 'thy-wildflower', price: 38, image: '/images/350g.jpg' as string | null },
  { id: 'creamy-thy-canola', price: 42, image: '/images/450g.jpg' as string | null },
]

type Product = {
  id: string
  price: number
  image: string | null
  name: string
  badge: string
  subtitle: string
  jarLabel: string
}

/* ── SVG jar placeholder ──────────────────────────────────────────── */
function JarSVG() {
  return (
    <svg viewBox="0 0 280 380" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: '60%', maxWidth: 200, filter: 'drop-shadow(0 20px 60px var(--gold-40))' }}>
      <defs>
        <linearGradient id="pjBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F0C87A" stopOpacity="0.92" />
          <stop offset="50%" stopColor="#D4A843" stopOpacity="0.97" />
          <stop offset="100%" stopColor="#7A4A1A" stopOpacity="0.85" />
        </linearGradient>
        <linearGradient id="pjShine" x1="0" y1="0" x2="0.25" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pjLid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5A3A18" />
          <stop offset="100%" stopColor="#2C1E12" />
        </linearGradient>
        <radialGradient id="pjGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(240,200,122,0.35)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <clipPath id="pjClip">
          <path d="M50 108 Q34 130 34 162 L34 314 Q34 346 70 346 L210 346 Q246 346 246 314 L246 162 Q246 130 230 108 Z" />
        </clipPath>
      </defs>
      <ellipse cx="140" cy="250" rx="120" ry="80" fill="url(#pjGlow)" opacity="0.5" />
      <path d="M50 108 Q34 130 34 162 L34 314 Q34 346 70 346 L210 346 Q246 346 246 314 L246 162 Q246 130 230 108 Z" fill="url(#pjBody)" />
      <g clipPath="url(#pjClip)" opacity="0.1">
        {[0, 1, 2, 3, 4, 5].map(row => [0, 1, 2, 3, 4].map(col => {
          const x = 40 + col * 44 + (row % 2 === 1 ? 22 : 0), y = 155 + row * 38, r = 20
          const pts = Array.from({ length: 6 }, (_, i) => { const a = (Math.PI / 3) * i - Math.PI / 6; return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}` }).join(' ')
          return <polygon key={`${row}-${col}`} points={pts} fill="none" stroke="#FAF6EF" strokeWidth="0.8" />
        }))}
      </g>
      <path d="M53 110 Q37 132 37 164 L37 265 Q52 252 68 198 L70 110 Z" fill="url(#pjShine)" opacity="0.55" />
      <path d="M50 108 Q34 130 34 162 L34 314 Q34 346 70 346 L210 346 Q246 346 246 314 L246 162 Q246 130 230 108 Z" fill="none" stroke="rgba(212,168,67,0.25)" strokeWidth="1" />
      <rect x="72" y="42" width="136" height="40" rx="6" fill="url(#pjLid)" />
      <rect x="72" y="42" width="136" height="19" rx="6" fill="rgba(255,255,255,0.05)" />
      <rect x="77" y="78" width="126" height="5" rx="2" fill="rgba(0,0,0,0.35)" />
      <rect x="56" y="198" width="168" height="108" rx="3" fill="rgba(26,20,16,0.28)" stroke="rgba(212,168,67,0.18)" strokeWidth="0.5" />
      <text x="140" y="237" textAnchor="middle" fontFamily="Georgia, serif" fontSize="12" letterSpacing="7" fill="rgba(212,168,67,0.9)">HONEY <tspan fontFamily="var(--font-cormorant), Cormorant Garamond, serif" fontWeight="300" style={{ fontVariantNumeric: 'lining-nums' }}>56°</tspan></text>
      <line x1="82" y1="246" x2="198" y2="246" stroke="rgba(212,168,67,0.25)" strokeWidth="0.5" />
      <text x="140" y="260" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="7.5" letterSpacing="4" fill="rgba(212,168,67,0.5)">RAW · HONEY</text>
    </svg>
  )
}

/* ── 3D product card ──────────────────────────────────────────────── */
function ProductCard({ product, active, total, onPrev, onNext }: {
  product: Product
  active: number
  total: number
  onPrev: () => void
  onNext: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const dragging = useRef(false)
  const dragStart = useRef(0)

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 120, damping: 20 })
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), { stiffness: 120, damping: 20 })
  const glowX = useSpring(useTransform(mouseX, [-0.5, 0.5], [20, 80]), { stiffness: 80, damping: 20 })
  const glowY = useSpring(useTransform(mouseY, [-0.5, 0.5], [20, 80]), { stiffness: 80, damping: 20 })

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5)
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const onMouseLeave = () => { mouseX.set(0); mouseY.set(0) }

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    dragging.current = true
    dragStart.current = 'touches' in e ? e.touches[0].clientX : e.clientX
  }
  const onDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging.current) return
    dragging.current = false
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
    const diff = dragStart.current - endX
    if (Math.abs(diff) > 50) diff > 0 ? onNext() : onPrev()
  }

  return (
    <div>
      <div style={{ perspective: 1000 }} className="relative"
        onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} ref={cardRef}
        onMouseDown={onDragStart} onMouseUp={onDragEnd}
        onTouchStart={onDragStart} onTouchEnd={onDragEnd}
      >
        <motion.div style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} className="relative">
          {/* Glow follow */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded"
            style={{
              background: useTransform([glowX, glowY], ([x, y]: number[]) =>
                `radial-gradient(circle at ${x}% ${y}%, var(--gold-18) 0%, transparent 60%)`),
              zIndex: 10,
            }}
          />

          {/* Card */}
          <div
            className="relative overflow-hidden"
            style={{
              border: '1px solid var(--gold-12)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 var(--gold-08)',
              height: 'clamp(320px, 45vw, 560px)',
            }}
          >
            {/* Corner marks */}
            {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
              <div key={i} className={`absolute ${pos} w-5 h-5 z-10`}>
                <div className={`absolute ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'} w-full h-px`} style={{ background: 'var(--gold-30)' }} />
                <div className={`absolute ${i < 2 ? 'top-0' : 'bottom-0'} ${i % 2 === 0 ? 'left-0' : 'right-0'} h-full w-px`} style={{ background: 'var(--gold-30)' }} />
              </div>
            ))}

            {/* Product visual */}
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
              >
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    priority
                  />
                ) : (
                  <JarSVG />
                )}
              </motion.div>
            </AnimatePresence>

          </div>
        </motion.div>
      </div>

    </div>
  )
}

/* ── Benefit item ─────────────────────────────────────────────────── */
function Benefit({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: number }) {
  return (
    <motion.div
      className="flex gap-4 items-start group"
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <div
        className="shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110"
        style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--gold-25)', background: 'var(--gold-05)', color: 'var(--honey-gold)' }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: 'clamp(13px, 1.1vw, 15px)', fontWeight: 500, color: 'var(--cream)', marginBottom: 4 }}>{title}</p>
        <p style={{ fontSize: 'clamp(12px, 0.9vw, 13px)', lineHeight: 1.6, color: 'var(--cream-45)', fontWeight: 300 }}>{desc}</p>
      </div>
    </motion.div>
  )
}

/* ── Main section ─────────────────────────────────────────────────── */
export default function ProductSection({ dict }: { dict: ProductDict }) {
  const [activeProduct, setActiveProduct] = useState(0)
  const [quantity, setQuantity] = useState(1)

  const PRODUCTS: Product[] = PRODUCTS_STATIC.map((p, i) => ({
    ...p,
    name: dict.products[i]?.name ?? p.id,
    badge: dict.badge,
    subtitle: dict.products[i]?.subtitle ?? '',
    jarLabel: dict.products[i]?.jarLabel ?? '',
  }))

  const prev = () => setActiveProduct(a => (a - 1 + PRODUCTS.length) % PRODUCTS.length)
  const next = () => setActiveProduct(a => (a + 1) % PRODUCTS.length)

  useEffect(() => { setQuantity(1) }, [activeProduct])

  const product = PRODUCTS[activeProduct] || PRODUCTS[0]

  const benefitIcons = [
    (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" /></svg>),
    (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>),
    (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>),
    (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" /></svg>),
  ]

  const benefits = dict.benefits.map((b, i) => ({ ...b, icon: benefitIcons[i] }))

  return (
    <section
      id="product"
      style={{
        background: 'linear-gradient(180deg, var(--bg-deep) 0%, var(--charcoal) 40%, var(--bg-deep) 100%)',
        padding: 'clamp(64px, 8vw, 128px) 0',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 6vw, 80px)' }}>
          <motion.span
            className="uppercase block"
            style={{ color: 'var(--gold-40)', fontSize: 'clamp(9px, 0.9vw, 11px)', letterSpacing: '0.6em', marginBottom: 'clamp(12px, 1.5vw, 20px)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {dict.sectionLabel}
          </motion.span>
          <motion.h2
            className="font-serif"
            style={{ fontSize: 'clamp(32px, 5vw, 64px)', color: 'var(--cream)', lineHeight: 1.1, textAlign: 'center' }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            {dict.sectionHeadlineStart} <em style={{ color: 'var(--honey-gold)' }}>{dict.sectionHeadlineEm}</em>
          </motion.h2>
        </div>

        {/* Main grid with flanking arrows */}
        <div className="flex items-center" style={{ gap: 'clamp(12px, 2vw, 24px)' }}>

          {/* Left arrow */}
          <button
            onClick={prev}
            className="hidden lg:flex shrink-0 items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--gold-25)', color: 'var(--honey-gold)', background: 'none' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>

        <div
          className="grid grid-cols-1 lg:grid-cols-2 items-center flex-1"
          style={{ gap: 'clamp(32px, 5vw, 80px)' }}
        >
          {/* Product card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            <ProductCard
              product={product}
              active={activeProduct}
              total={PRODUCTS.length}
              onPrev={prev}
              onNext={next}
            />
            <div style={{ marginTop: 20, paddingTop: 14, borderTop: '1px solid var(--gold-10)' }}>
              <p className="uppercase" style={{ fontSize: '9px', lineHeight: 1.8, color: 'var(--gold-40)', letterSpacing: '0.18em' }}>
                {dict.bottleNote}
              </p>
            </div>
          </motion.div>

          {/* Info panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeProduct}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.45, ease: [0.76, 0, 0.24, 1] }}
              style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(24px, 3vw, 40px)' }}
            >
              {/* Product title */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <p className="uppercase" style={{ color: 'var(--gold-40)', fontSize: 'clamp(8px, 0.85vw, 11px)', letterSpacing: '0.5em' }}>{product.badge}</p>
                <h3 className="font-serif" style={{ fontSize: 'clamp(24px, 3vw, 36px)', color: 'var(--cream)' }}>{product.name}</h3>
                <p style={{ fontSize: 'clamp(12px, 1vw, 14px)', color: 'var(--cream-45)' }}>{product.subtitle}</p>
              </div>

              {/* Price + qty */}
              <div
                className="flex items-end justify-between"
                style={{ borderBottom: '1px solid var(--gold-10)', paddingBottom: 'clamp(20px, 3vw, 32px)' }}
              >
                <div>
                  <p className="uppercase" style={{ color: 'var(--gold-40)', fontSize: 'clamp(8px, 0.85vw, 11px)', letterSpacing: '0.4em', marginBottom: 8 }}>
                    {product.jarLabel}
                  </p>
                  <p className="font-serif" style={{ fontSize: 'clamp(36px, 5vw, 56px)', color: 'var(--cream)' }}>€{product.price}</p>
                  <p style={{ fontSize: 'clamp(11px, 0.9vw, 13px)', marginTop: 4, color: 'var(--cream-35)' }}>
                    {dict.freeShipping}
                  </p>
                </div>

                {/* Qty selector */}
                <div className="flex items-center gap-4" style={{ border: '1px solid var(--gold-20)', padding: '8px 16px' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="transition-colors hover:text-[#D4A843]" style={{ fontSize: 16, color: 'var(--cream-50)', background: 'none', border: 'none' }}>−</button>
                  <span className="tabular-nums" style={{ fontSize: 14, color: 'var(--cream)', minWidth: 16, textAlign: 'center' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => Math.min(12, q + 1))} className="transition-colors hover:text-[#D4A843]" style={{ fontSize: 16, color: 'var(--cream-50)', background: 'none', border: 'none' }}>+</button>
                </div>
              </div>

              {/* Benefits */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2vw, 28px)' }}>
                {benefits.map((b, i) => <Benefit key={b.title} {...b} delay={0.1 + i * 0.1} />)}
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
                <motion.a
                  href="https://buy.stripe.com/placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full relative overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, var(--honey-gold) 0%, var(--honey-dark) 100%)',
                    color: 'var(--charcoal)', fontWeight: 500,
                    fontSize: 'clamp(11px, 1vw, 13px)', letterSpacing: '0.25em', textTransform: 'uppercase',
                    padding: 'clamp(14px, 1.5vw, 18px) 24px',
                  }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="relative z-10">{dict.addToCart} · €{(product.price * quantity).toLocaleString()}</span>
                  <motion.div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, var(--honey-light) 0%, var(--honey-gold) 100%)', opacity: 0 }} whileHover={{ opacity: 1 }} transition={{ duration: 0.3 }} />
                </motion.a>

                <motion.a
                  href="https://buy.stripe.com/placeholder"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-full transition-all duration-300"
                  style={{
                    border: '1px solid var(--gold-30)', color: 'var(--honey-gold)',
                    fontSize: 'clamp(11px, 1vw, 13px)', letterSpacing: '0.25em', textTransform: 'uppercase',
                    padding: 'clamp(14px, 1.5vw, 18px) 24px',
                  }}
                  whileHover={{ borderColor: 'var(--gold-70)', boxShadow: '0 0 24px var(--gold-12)' }}
                >
                  {dict.buyNow}
                </motion.a>

                <p className="text-center" style={{ fontSize: 'clamp(11px, 0.9vw, 12px)', color: 'var(--cream-25)' }}>
                  {dict.limitedNote}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

          {/* Right arrow */}
          <button
            onClick={next}
            className="hidden lg:flex shrink-0 items-center justify-center transition-all duration-300 hover:scale-110"
            style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--gold-25)', color: 'var(--honey-gold)', background: 'none' }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>

        </div>

        {/* Dot indicators — centered below the full layout */}
        <div className="flex items-center justify-center gap-2" style={{ marginTop: 40 }}>
          {PRODUCTS.map((_, i) => (
            <motion.div
              key={i}
              animate={{ width: i === activeProduct ? 24 : 6, background: i === activeProduct ? 'var(--honey-gold)' : 'var(--gold-25)' }}
              transition={{ duration: 0.3 }}
              style={{ height: 2, borderRadius: 1 }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
