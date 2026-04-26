import type { MetadataRoute } from 'next'

const SITE_URL = 'https://honey56.com'
const locales = ['en', 'da', 'de'] as const

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map(locale => ({
    url: locale === 'en' ? SITE_URL : `${SITE_URL}/${locale}`,
    lastModified: new Date('2026-04-26'),
    changeFrequency: 'monthly' as const,
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map(l => [l, l === 'en' ? SITE_URL : `${SITE_URL}/${l}`])
      ),
    },
  }))
}
