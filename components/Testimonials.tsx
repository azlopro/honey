'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const reviews = [
  {
    quote: 'The most extraordinary honey I have ever tasted. The floral complexity is unlike anything from a supermarket shelf — this is genuinely special.',
    author: 'Isabelle M.',
    location: 'Paris, France',
    rating: 5,
    verified: true,
  },
  {
    quote: "I buy this for my restaurant's cheese board. Guests consistently ask about it. The terroir comes through — you can taste the meadow.",
    author: 'Marco F.',
    location: 'London, UK',
    rating: 5,
    verified: true,
  },
  {
    quote: "We've been gifting Aurum at Christmas for three years running. The presentation alone justifies the price — but the taste is what makes customers return.",
    author: 'Charlotte R.',
    location: 'Zürich, Switzerland',
    rating: 5,
    verified: true,
  },
  {
    quote: 'As a holistic nutritionist, I recommend this to all my clients. Raw, unfiltered, and the enzyme profile is exceptional. This is honey the way it should be.',
    author: 'Dr. Priya N.',
    location: 'Amsterdam, NL',
    rating: 5,
    verified: true,
  },
  {
    quote: 'Silky, warm, with notes of lavender and something almost caramel. Spread on sourdough in the morning this is my favourite ritual.',
    author: 'Thomas B.',
    location: 'Berlin, Germany',
    rating: 5,
    verified: true,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: count }, (_, i) => (
        <svg key={i} viewBox="0 0 12 12" className="w-3 h-3" fill="#D4A843">
          <polygon points="6,0.5 7.5,4.5 11.5,4.5 8.5,7 9.5,11 6,8.5 2.5,11 3.5,7 0.5,4.5 4.5,4.5" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(0)

  const prev = () => setActive(a => (a - 1 + reviews.length) % reviews.length)
  const next = () => setActive(a => (a + 1) % reviews.length)

  const onDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setDragging(true)
    dragStart.current = 'touches' in e ? e.touches[0].clientX : e.clientX
  }

  const onDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!dragging) return
    setDragging(false)
    const endX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
    const diff = dragStart.current - endX
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
  }

  const review = reviews[active]

  return (
    <section
      id="reviews"
      style={{
        background: 'linear-gradient(180deg, var(--bg-deep) 0%, var(--charcoal) 50%, var(--bg-deep) 100%)',
        padding: 'clamp(64px, 8vw, 128px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 pointer-events-none"
        style={{
          width: 800, height: 400,
          marginLeft: -400, marginTop: -200,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, var(--gold-06) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)', position: 'relative' }}>

      {/* Header */}
      <div className="text-center relative" style={{ marginBottom: 'clamp(40px, 6vw, 80px)' }}>
        <motion.span
          className="uppercase block"
          style={{ color: 'var(--gold-40)', fontSize: 'clamp(9px, 0.9vw, 11px)', letterSpacing: '0.6em', marginBottom: 'clamp(12px, 1.5vw, 20px)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          What they say
        </motion.span>

        <motion.h2
          className="font-serif"
          style={{ fontSize: 'clamp(28px, 5vw, 60px)', color: 'var(--cream)', lineHeight: 1.1 }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.9 }}
        >
          Tasted by those who<br />
          <em style={{ color: 'var(--honey-gold)' }}>know the difference.</em>
        </motion.h2>

        <motion.div
          className="flex items-center justify-center gap-3"
          style={{ marginTop: 'clamp(12px, 1.5vw, 20px)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <Stars count={5} />
          <span style={{ fontSize: 'clamp(12px, 1vw, 14px)', color: 'var(--cream-45)' }}>4.98 · 312 reviews</span>
        </motion.div>
      </div>

      {/* Single card carousel */}
      <div style={{ width: '100%', maxWidth: 800, margin: '0 auto', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <motion.div
          style={{ width: '100%' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <div
            style={{ minHeight: 'clamp(280px, 35vw, 420px)', position: 'relative', cursor: 'grab', width: '100%' }}
            onMouseDown={onDragStart}
            onMouseUp={onDragEnd}
            onTouchStart={onDragStart}
            onTouchEnd={onDragEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
                className="rounded relative overflow-hidden w-full"
                style={{
                  background: 'linear-gradient(145deg, var(--charcoal-mid) 0%, var(--bg-mid) 100%)',
                  border: '1px solid var(--gold-20)',
                  padding: 'clamp(24px, 4vw, 48px)',
                  boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
                }}
              >
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-32 h-32 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, var(--gold-10) 0%, transparent 70%)' }} />

                {/* Quote mark */}
                <div className="font-serif select-none" style={{ color: 'var(--gold-15)', fontSize: 'clamp(48px, 8vw, 80px)', lineHeight: 0.7, marginBottom: 'clamp(12px, 2vw, 24px)' }} aria-hidden>&ldquo;</div>

                <Stars count={review.rating} />

                <p className="font-cormorant italic" style={{
                  color: 'var(--cream-85)', fontWeight: 300,
                  fontSize: 'clamp(16px, 1.8vw, 22px)', lineHeight: 1.6,
                  margin: 'clamp(12px, 2vw, 20px) 0',
                }}>
                  {review.quote}
                </p>

                <div className="flex items-center justify-between" style={{ borderTop: '1px solid var(--gold-10)', paddingTop: 'clamp(12px, 1.5vw, 20px)' }}>
                  <div>
                    <p style={{ fontSize: 'clamp(13px, 1.1vw, 15px)', fontWeight: 500, color: 'var(--cream)' }}>{review.author}</p>
                    <p style={{ fontSize: 'clamp(11px, 0.9vw, 13px)', marginTop: 2, color: 'var(--gold-45)' }}>{review.location}</p>
                  </div>
                  {review.verified && (
                    <span className="uppercase" style={{
                      fontSize: 'clamp(8px, 0.75vw, 10px)', letterSpacing: '0.25em',
                      border: '1px solid var(--gold-20)', color: 'var(--gold-50)',
                      padding: '4px 10px',
                    }}>
                      Verified Purchase
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-8" style={{ marginTop: 'clamp(24px, 3vw, 40px)' }}>
            <button
              onClick={prev}
              className="flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--gold-25)', color: 'var(--honey-gold)', background: 'none' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="flex gap-2">
              {reviews.map((_, i) => (
                <button key={i} onClick={() => setActive(i)} style={{ background: 'none', border: 'none', padding: 4 }}>
                  <motion.div
                    animate={{ width: i === active ? 24 : 6, background: i === active ? 'var(--honey-gold)' : 'var(--gold-25)' }}
                    transition={{ duration: 0.3 }}
                    style={{ height: 2, borderRadius: 1 }}
                  />
                </button>
              ))}
            </div>

            <button
              onClick={next}
              className="flex items-center justify-center transition-all duration-300 hover:scale-110"
              style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--gold-25)', color: 'var(--honey-gold)', background: 'none' }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Press mentions */}
      <motion.div
        className="text-center"
        style={{ borderTop: '1px solid var(--gold-08)', marginTop: 'clamp(48px, 6vw, 96px)', paddingTop: 'clamp(32px, 4vw, 56px)' }}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <p className="uppercase" style={{ fontSize: 'clamp(8px, 0.85vw, 11px)', letterSpacing: '0.5em', color: 'var(--gold-30)', marginBottom: 'clamp(20px, 3vw, 40px)' }}>
          As featured in
        </p>
        <div className="flex flex-wrap items-center justify-center" style={{ gap: 'clamp(20px, 4vw, 64px)' }}>
          {['Condé Nast', 'The Times', 'Wallpaper*', 'Monocle', 'Bon Appétit'].map(pub => (
            <span key={pub} className="font-cormorant italic" style={{ fontSize: 'clamp(16px, 2vw, 22px)', color: 'var(--cream-20)' }}>
              {pub}
            </span>
          ))}
        </div>
      </motion.div>
      </div>
    </section>
  )
}
