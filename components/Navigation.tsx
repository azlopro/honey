'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = ['Story', 'Craft', 'Product', 'Reviews']

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const lastScroll = useRef(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 60)
      setHidden(y > lastScroll.current && y > 200)
      lastScroll.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    const el = document.getElementById(id.toLowerCase())
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-[999] flex items-center justify-between"
        style={{
          padding: 'clamp(16px, 2.5vw, 28px) clamp(24px, 6vw, 80px)',
          background: scrolled ? 'var(--charcoal-85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? '1px solid var(--gold-08)' : 'none',
          transition: 'background 0.5s ease, backdrop-filter 0.5s ease',
        }}
        animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="flex items-baseline gap-2 cursor-pointer group shrink-0"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span
            className="font-serif tracking-[0.25em] uppercase group-hover:opacity-80 transition-opacity duration-300"
            style={{ fontSize: 'clamp(16px, 2vw, 22px)', color: 'var(--honey-gold)' }}
          >
            HONEY <span className="font-cormorant font-light lining-nums">56°</span>
          </span>
          <span
            className="tracking-[0.5em] uppercase"
            style={{ fontSize: 'clamp(7px, 0.8vw, 10px)', color: 'var(--gold-40)' }}
          >
            Thy
          </span>
        </motion.div>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12">
          {navLinks.map((link, i) => (
            <motion.button
              key={link}
              onClick={() => scrollTo(link)}
              className="relative group"
              style={{
                fontSize: 'clamp(9px, 0.9vw, 11px)',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                color: 'var(--cream-60)',
                background: 'none',
                border: 'none',
              }}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2 + i * 0.1, duration: 0.6 }}
              whileHover={{ color: '#D4A843' }}
            >
              {link}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-500"
                style={{ background: 'var(--honey-gold)' }}
              />
            </motion.button>
          ))}
        </nav>

        {/* CTA */}
        <motion.a
          href="#product"
          className="hidden md:inline-flex items-center justify-center tracking-[0.2em] uppercase transition-all duration-300 hover:scale-105 shrink-0"
          style={{
            border: '1px solid var(--gold-40)',
            color: 'var(--honey-gold)',
            borderRadius: '2px',
            backgroundColor: 'rgba(26, 20, 16, 0.4)',
            fontSize: 'clamp(9px, 0.9vw, 11px)',
            padding: 'clamp(8px, 1vw, 12px) clamp(16px, 2vw, 28px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          whileHover={{
            borderColor: 'var(--gold-90)',
            boxShadow: '0 0 20px var(--gold-15)',
          }}
        >
          Order Now
        </motion.a>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          style={{ background: 'none', border: 'none' }}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Menu"
        >
          {[0, 1, 2].map(i => (
            <motion.span
              key={i}
              className="block h-px"
              style={{ background: 'var(--honey-gold)', width: i === 1 ? 20 : 28 }}
              animate={menuOpen ? {
                rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
                y: i === 0 ? 8 : i === 2 ? -8 : 0,
                opacity: i === 1 ? 0 : 1,
                width: 28,
              } : { rotate: 0, y: 0, opacity: 1, width: i === 1 ? 20 : 28 }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </button>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[998] flex flex-col items-center justify-center"
            style={{ background: 'var(--charcoal-97)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            {navLinks.map((link, i) => (
              <motion.button
                key={link}
                onClick={() => scrollTo(link)}
                className="block py-5 font-serif tracking-widest uppercase"
                style={{
                  fontSize: 'clamp(28px, 8vw, 48px)',
                  color: 'var(--cream)',
                  background: 'none',
                  border: 'none'
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ color: 'var(--honey-gold)', x: 8 }}
              >
                {link}
              </motion.button>
            ))}
            <motion.a
              href="#product"
              onClick={() => setMenuOpen(false)}
              className="mt-10 text-sm tracking-[0.3em] uppercase"
              style={{
                border: '1px solid var(--honey-gold)',
                color: 'var(--honey-gold)',
                padding: '16px 40px',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Order Now
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
