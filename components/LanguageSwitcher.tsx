'use client'

import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

const LOCALES = [
  { code: 'en', label: 'EN' },
  { code: 'da', label: 'DA' },
  { code: 'de', label: 'DE' },
]

const LOCALE_COOKIE = 'honey56_locale'

export default function LanguageSwitcher({ lang }: { lang: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const switchTo = (targetLang: string) => {
    document.cookie = `${LOCALE_COOKIE}=${targetLang}; max-age=${60 * 60 * 24 * 365}; path=/; samesite=lax`

    const segments = pathname.split('/').filter(Boolean)
    if (LOCALES.some(l => l.code === segments[0])) segments.shift()

    const newPath =
      targetLang === 'en'
        ? `/${segments.join('/')}` || '/'
        : `/${targetLang}/${segments.join('/')}`.replace(/\/$/, '') || `/${targetLang}`

    router.push(newPath)
  }

  return (
    <div
      className="flex items-center"
      style={{ border: '1px solid var(--gold-15)', padding: '4px 10px' }}
      aria-label="Language selector"
    >
      {LOCALES.map((locale, i) => (
        <span key={locale.code} className="flex items-center">
          <motion.button
            onClick={() => switchTo(locale.code)}
            className="uppercase"
            style={{
              background: 'none',
              border: 'none',
              cursor: locale.code === lang ? 'default' : 'pointer',
              fontSize: 'clamp(8px, 0.75vw, 10px)',
              letterSpacing: '0.2em',
              color: locale.code === lang ? 'var(--honey-gold)' : 'var(--cream-35)',
              padding: '0 6px',
            }}
            whileHover={locale.code !== lang ? { color: 'var(--cream-60)' } : {}}
            aria-current={locale.code === lang ? 'true' : undefined}
          >
            {locale.label}
          </motion.button>
          {i < LOCALES.length - 1 && (
            <span
              style={{
                width: 1,
                height: 10,
                background: 'var(--gold-15)',
                flexShrink: 0,
                display: 'inline-block',
              }}
            />
          )}
        </span>
      ))}
    </div>
  )
}
