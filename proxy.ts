import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'

const locales = ['en', 'da', 'de'] as const
type Locale = typeof locales[number]
const defaultLocale: Locale = 'en'
const LOCALE_COOKIE = 'honey56_locale'

function getLocaleFromAcceptLanguage(request: NextRequest): Locale {
  const acceptLang = request.headers.get('accept-language') ?? 'en'
  const headers = { 'accept-language': acceptLang }
  const languages = new Negotiator({ headers }).languages()
  try {
    return match(languages, [...locales], defaultLocale) as Locale
  } catch {
    return defaultLocale
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) return NextResponse.next()

  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined
  const locale: Locale =
    cookieLocale && (locales as readonly string[]).includes(cookieLocale)
      ? cookieLocale
      : getLocaleFromAcceptLanguage(request)

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`

  const response = NextResponse.redirect(redirectUrl, { status: 307 })

  if (!cookieLocale) {
    response.cookies.set(LOCALE_COOKIE, locale, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images|videos|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
}
