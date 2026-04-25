import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AURUM — Liquid Gold, Redefined',
  description: 'Single-origin raw honey harvested from wild coastal landscapes in Denmark. Limited 2026 batch. Uncompromising quality.',
  openGraph: {
    title: 'AURUM — Liquid Gold, Redefined',
    description: 'Single-origin raw honey harvested from wild coastal landscapes in Denmark.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
