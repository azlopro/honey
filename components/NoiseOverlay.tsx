'use client'

export default function NoiseOverlay() {
  return (
    <div
      className="grain"
      aria-hidden="true"
      style={{ mixBlendMode: 'overlay' }}
    />
  )
}
