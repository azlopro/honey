'use client'

import { useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-glow',
        { scale: 0.8, opacity: 0.3 },
        {
          scale: 1.2,
          opacity: 0.7,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top bottom',
            end: 'center center',
            scrub: true,
          },
        },
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      style={{
        background: 'var(--bg-deep)',
        padding: 'clamp(80px, 10vw, 160px) 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background photo — northern lights */}
      <Image
        src="/images/northeren-lights-thy.jpg"
        alt=""
        fill
        sizes="100vw"
        style={{ objectFit: 'cover', objectPosition: 'center 30%', opacity: 0.35 }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(4,3,2,0.6) 0%, rgba(4,3,2,0.4) 50%, rgba(4,3,2,0.7) 100%)' }} />

      {/* Animated glow blob */}
      <div
        className="cta-glow absolute top-1/2 left-1/2 pointer-events-none"
        style={{
          width: 'min(700px, 100vw)',
          height: 'min(500px, 70vw)',
          marginLeft: '-50%',
          marginTop: '-25%',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, var(--gold-20) 0%, rgba(184,134,11,0.08) 50%, transparent 75%)',
          filter: 'blur(60px)',
        }}
      />

      {/* Centered content wrapper */}
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)', position: 'relative' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 'clamp(16px, 2.5vw, 32px)', alignItems: 'center' }}>

          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-3"
            style={{ border: '1px solid var(--gold-20)', padding: 'clamp(6px, 1vw, 10px) clamp(12px, 2vw, 20px)' }}
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--honey-gold)', flexShrink: 0 }} />
            <span className="uppercase" style={{ color: 'var(--gold-70)', fontSize: 'clamp(9px, 0.9vw, 11px)', letterSpacing: '0.4em' }}>
              Limited harvest · Batch 2026
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            className="font-serif"
            style={{ fontSize: 'clamp(36px, 6.5vw, 88px)', color: 'var(--cream)', lineHeight: 1.0 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            Taste the <em style={{ color: 'var(--honey-gold)' }}>difference</em><br />
            before it&apos;s gone.
          </motion.h2>

          {/* Subtext */}
          <motion.p
            style={{ color: 'var(--cream-45)', fontWeight: 300, fontSize: 'clamp(14px, 1.2vw, 17px)', maxWidth: '48ch', lineHeight: 1.7 }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25, duration: 0.8 }}
          >
            Each harvest is finite. When the 2026 batch sells out, the next won&apos;t arrive until the following season.
            Reserve yours now.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center"
            style={{ gap: 'clamp(12px, 1.5vw, 16px)', paddingTop: 'clamp(8px, 1vw, 16px)', width: '100%' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.8 }}
          >
            {/* Primary */}
            <motion.a
              href="https://buy.stripe.com/placeholder"
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden inline-flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, var(--honey-gold) 0%, var(--honey-dark) 100%)',
                color: 'var(--charcoal)',
                fontWeight: 500,
                fontSize: 'clamp(11px, 1vw, 13px)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                padding: 'clamp(14px, 1.5vw, 18px) clamp(28px, 3vw, 48px)',
                justifyContent: 'center',
                minWidth: 'clamp(200px, 20vw, 260px)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
            >
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.3) 50%, transparent 65%)', x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.5 }}
              />
              <span className="relative z-10">Order Now — €38</span>
              <motion.svg
                className="relative z-10 w-4 h-4 shrink-0"
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}
                animate={{ x: [0, 3, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </motion.svg>
            </motion.a>

            {/* Secondary */}
            <motion.a
              href="#product"
              className="inline-flex items-center justify-center transition-all duration-300"
              style={{
                border: '1px solid var(--gold-25)',
                color: 'var(--gold-70)',
                fontSize: 'clamp(11px, 1vw, 13px)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                padding: 'clamp(14px, 1.5vw, 18px) clamp(20px, 2.5vw, 36px)',
                minWidth: 'clamp(160px, 16vw, 210px)',
              }}
              whileHover={{ borderColor: 'var(--gold-60)', color: 'var(--honey-gold)' }}
            >
              Learn More
            </motion.a>
          </motion.div>

          {/* Trust marks */}
          <motion.div
            className="flex flex-wrap items-center justify-center"
            style={{ gap: 'clamp(16px, 3vw, 32px)', paddingTop: 'clamp(8px, 1vw, 16px)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            {[
              { icon: '🔒', label: 'Secure payment' },
              { icon: '🚚', label: 'Free shipping' },
              { icon: '✦', label: 'Sealed & intact' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-2">
                <span style={{ fontSize: 13 }}>{item.icon}</span>
                <span className="uppercase" style={{ fontSize: 'clamp(9px, 0.85vw, 11px)', letterSpacing: '0.15em', color: 'var(--cream-30)' }}>
                  {item.label}
                </span>
              </div>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  )
}
