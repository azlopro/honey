import type { Metadata } from 'next'
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

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
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}>
      <head>
        <link rel="preload" as="image" href="/images/hero-poster.jpg" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
