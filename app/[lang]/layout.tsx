import type { Metadata } from 'next'
import { Playfair_Display, Inter, Cormorant_Garamond } from 'next/font/google'
import { notFound } from 'next/navigation'
import { hasLocale, locales, getDictionary } from './dictionaries'
import '../globals.css'

const SITE_URL = 'https://honey56.com'

const playfair = Playfair_Display({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export async function generateStaticParams() {
  return locales.map(lang => ({ lang }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  if (!hasLocale(lang)) return {}

  const dict = await getDictionary(lang)
  const m = dict.meta

  const languages: Record<string, string> = {}
  for (const locale of locales) {
    languages[locale] = locale === 'en' ? SITE_URL : `${SITE_URL}/${locale}`
  }
  languages['x-default'] = SITE_URL

  const ogLocale =
    lang === 'da' ? 'da_DK' : lang === 'de' ? 'de_DE' : 'en_US'
  const ogAlternates = locales
    .filter(l => l !== lang)
    .map(l => (l === 'da' ? 'da_DK' : l === 'de' ? 'de_DE' : 'en_US'))

  return {
    metadataBase: new URL(SITE_URL),
    title: m.title,
    description: m.description,
    alternates: {
      canonical: lang === 'en' ? '/' : `/${lang}`,
      languages,
    },
    openGraph: {
      title: m.ogTitle,
      description: m.ogDescription,
      type: 'website',
      locale: ogLocale,
      alternateLocale: ogAlternates,
      url: lang === 'en' ? SITE_URL : `${SITE_URL}/${lang}`,
    },
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  return (
    <html
      lang={lang}
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <head>
        <link rel="preload" as="image" href="/images/hero-poster.jpg" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
