'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current)
          setTimeout(() => {
            setDone(true)
            setTimeout(onComplete, 800)
          }, 300)
          return 100
        }
        const increment = p < 60 ? 3 : p < 85 ? 1.5 : 0.8
        return Math.min(p + increment, 100)
      })
    }, 30)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
          style={{ background: 'var(--charcoal)' }}
          exit={{
            opacity: 0,
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Honey drip container */}
          <div className="relative flex flex-col items-center">
            {/* Drip track */}
            <div className="relative" style={{ width: 2, height: 80 }}>
              <motion.div
                className="absolute top-0 left-0 w-full rounded-b-full"
                style={{
                  background: 'linear-gradient(to bottom, #D4A843, #F0C87A)',
                  transformOrigin: 'top center',
                }}
                animate={{
                  height: [0, 64, 72, 64],
                  borderRadius: ['0 0 4px 4px', '0 0 8px 8px', '0 0 12px 12px', '0 0 8px 8px'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              {/* Drip droplet */}
              <motion.div
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  width: 8,
                  height: 10,
                  background: 'linear-gradient(to bottom, #D4A843, #F0C87A)',
                  borderRadius: '50% 50% 70% 70% / 40% 40% 60% 60%',
                }}
                animate={{
                  top: [56, 64, 72, 56],
                  opacity: [1, 1, 0, 0],
                  scaleX: [1, 1.2, 0.8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Brand mark */}
            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <p
                className="font-serif text-4xl tracking-[0.3em] uppercase"
                style={{ color: 'var(--honey-gold)', letterSpacing: '0.4em' }}
              >
                Aurum
              </p>
              <p
                className="mt-1 text-xs tracking-[0.5em] uppercase"
                style={{ color: 'var(--gold-50)', fontSize: '9px' }}
              >
                Liquid Gold
              </p>
            </motion.div>

            {/* Progress bar */}
            <div
              className="mt-10 overflow-hidden"
              style={{ width: 120, height: 1, background: 'var(--gold-15)' }}
            >
              <motion.div
                className="h-full"
                style={{
                  background: 'linear-gradient(90deg, #8B5E2A, #D4A843, #F0C87A)',
                  width: `${progress}%`,
                  transition: 'width 0.1s linear',
                }}
              />
            </div>

            <motion.p
              className="mt-3 tabular-nums"
              style={{ color: 'var(--gold-40)', fontSize: '10px', letterSpacing: '0.2em' }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              {Math.round(progress).toString().padStart(3, '0')}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
