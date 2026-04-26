import 'server-only'

export type Locale = 'en' | 'da' | 'de'
export const locales: Locale[] = ['en', 'da', 'de']
export const defaultLocale: Locale = 'en'

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then(m => m.default),
  da: () => import('../../dictionaries/da.json').then(m => m.default),
  de: () => import('../../dictionaries/de.json').then(m => m.default),
}

export function hasLocale(locale: string): locale is Locale {
  return locale in dictionaries
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]()
}
