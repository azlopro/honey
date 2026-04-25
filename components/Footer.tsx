'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--bg-deep)',
        borderTop: '1px solid var(--gold-08)',
        padding: 'clamp(48px, 6vw, 96px) 0 clamp(32px, 4vw, 56px)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>
        {/* Top row */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          style={{
            gap: 'clamp(32px, 4vw, 48px)',
            paddingBottom: 'clamp(32px, 4vw, 56px)',
            borderBottom: '1px solid var(--gold-06)',
          }}
        >
          {/* Brand */}
          <div className="sm:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 1.5vw, 20px)' }}>
            <div>
              <p className="font-serif uppercase" style={{ fontSize: 'clamp(18px, 2vw, 24px)', letterSpacing: '0.35em', color: 'var(--honey-gold)' }}>
                Aurum
              </p>
              <p className="uppercase" style={{ fontSize: 'clamp(7px, 0.7vw, 9px)', letterSpacing: '0.5em', marginTop: 4, color: 'var(--gold-35)' }}>
                Honey
              </p>
            </div>
            <p style={{ fontSize: 'clamp(12px, 1vw, 14px)', lineHeight: 1.7, maxWidth: '32ch', color: 'var(--cream-35)', fontWeight: 300 }}>
              Liquid gold from ancient wildflower meadows. Single-origin. Raw. Uncompromising.
            </p>
            {/* Social */}
            <div className="flex gap-5">
              {['Instagram', 'Pinterest', 'X'].map(s => (
                <motion.a
                  key={s}
                  href="#"
                  className="uppercase transition-colors"
                  style={{ fontSize: 'clamp(9px, 0.85vw, 11px)', letterSpacing: '0.2em', color: 'var(--gold-35)' }}
                  whileHover={{ color: 'var(--honey-gold)' }}
                >
                  {s}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.2vw, 16px)' }}>
            <p className="uppercase" style={{ fontSize: 'clamp(8px, 0.8vw, 10px)', letterSpacing: '0.5em', color: 'var(--gold-40)', marginBottom: 4 }}>
              Pages
            </p>
            {['Our Story', 'The Craft', 'Product', 'Reviews', 'Press Kit'].map(link => (
              <motion.a
                key={link}
                href="#"
                className="block transition-colors"
                style={{ fontSize: 'clamp(12px, 1vw, 14px)', color: 'var(--cream-35)', fontWeight: 300 }}
                whileHover={{ color: 'var(--honey-gold)', x: 4 }}
              >
                {link}
              </motion.a>
            ))}
          </div>

          {/* Contact + Newsletter */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(10px, 1.2vw, 16px)' }}>
            <p className="uppercase" style={{ fontSize: 'clamp(8px, 0.8vw, 10px)', letterSpacing: '0.5em', color: 'var(--gold-40)', marginBottom: 4 }}>
              Contact
            </p>
            <p style={{ fontSize: 'clamp(12px, 1vw, 14px)', color: 'var(--cream-35)', fontWeight: 300 }}>
              hello@aurumhoney.com
            </p>
            <p style={{ fontSize: 'clamp(11px, 0.9vw, 12px)', lineHeight: 1.6, color: 'var(--cream-20)', fontWeight: 300 }}>
              Mon–Fri, 9am–5pm GMT
            </p>

            {/* Newsletter */}
            <div style={{ paddingTop: 'clamp(8px, 1vw, 16px)', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p className="uppercase" style={{ fontSize: 'clamp(8px, 0.8vw, 10px)', letterSpacing: '0.4em', color: 'var(--gold-30)' }}>
                Newsletter
              </p>
              <div className="flex" style={{ border: '1px solid var(--gold-20)' }}>
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-transparent outline-none"
                  style={{
                    padding: 'clamp(8px, 1vw, 10px) clamp(10px, 1.2vw, 14px)',
                    color: 'var(--cream)',
                    fontSize: 'clamp(10px, 0.9vw, 12px)',
                  }}
                />
                <motion.button
                  style={{
                    padding: '0 clamp(10px, 1.2vw, 14px)',
                    color: 'var(--honey-gold)',
                    background: 'none',
                    border: 'none',
                    fontSize: 16,
                    cursor: 'pointer',
                  }}
                  whileHover={{ backgroundColor: 'var(--gold-10)' }}
                >
                  →
                </motion.button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between"
          style={{ gap: 'clamp(12px, 1.5vw, 16px)', paddingTop: 'clamp(24px, 3vw, 40px)' }}
        >
          <p style={{ fontSize: 'clamp(11px, 0.9vw, 12px)', color: 'var(--cream-20)', fontWeight: 300 }}>
            © 2024 Aurum Honey Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms', 'Cookies'].map(link => (
              <motion.a
                key={link}
                href="#"
                className="transition-colors"
                style={{ fontSize: 'clamp(11px, 0.9vw, 12px)', color: 'var(--cream-20)', fontWeight: 300 }}
                whileHover={{ color: 'var(--gold-50)' }}
              >
                {link}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
