'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const cursorRef = useRef({ x: 0, y: 0 })
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const rafRef = useRef<number | null>(null)
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursorRef.current = { x: e.clientX, y: e.clientY }
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`
      }
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, cursorRef.current.x, 0.12)
      ringPos.current.y = lerp(ringPos.current.y, cursorRef.current.y, 0.12)
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    const onMouseDown = () => setClicked(true)
    const onMouseUp = () => setClicked(false)

    const addHover = () => {
      const interactives = document.querySelectorAll('a, button, [data-cursor-hover]')
      interactives.forEach(el => {
        el.addEventListener('mouseenter', () => setHovered(true))
        el.addEventListener('mouseleave', () => setHovered(false))
      })
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    rafRef.current = requestAnimationFrame(animate)

    const timer = setTimeout(addHover, 500)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      clearTimeout(timer)
    }
  }, [])

  return (
    <>
      {/* Dot — snappy */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: clicked ? 6 : hovered ? 0 : 5,
          height: clicked ? 6 : hovered ? 0 : 5,
          borderRadius: '50%',
          background: hovered ? 'transparent' : 'var(--honey-gold)',
          marginLeft: clicked ? -3 : hovered ? 0 : -2.5,
          marginTop: clicked ? -3 : hovered ? 0 : -2.5,
          transition: 'width 0.2s, height 0.2s, background 0.2s',
          willChange: 'transform',
        }}
      />

      {/* Ring — lagging */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[9997]"
        style={{
          width: hovered ? 48 : clicked ? 20 : 32,
          height: hovered ? 48 : clicked ? 20 : 32,
          borderRadius: '50%',
          border: `1px solid ${hovered ? 'var(--gold-80)' : 'var(--gold-40)'}`,
          marginLeft: hovered ? -24 : clicked ? -10 : -16,
          marginTop: hovered ? -24 : clicked ? -10 : -16,
          transition: 'width 0.3s ease, height 0.3s ease, border-color 0.3s ease, margin 0.3s ease',
          willChange: 'transform',
          boxShadow: hovered ? '0 0 12px var(--gold-20)' : 'none',
        }}
      />
    </>
  )
}
