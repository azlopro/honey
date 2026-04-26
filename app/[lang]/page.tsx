import { notFound } from 'next/navigation'
import { getDictionary, hasLocale } from './dictionaries'
import PageShell from '@/components/PageShell'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import ScrollStory from '@/components/ScrollStory'
import ProductSection from '@/components/ProductSection'
import Testimonials from '@/components/Testimonials'
import CTASection from '@/components/CTASection'
import Footer from '@/components/Footer'

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  if (!hasLocale(lang)) notFound()

  const dict = await getDictionary(lang)

  return (
    <PageShell>
      <Navigation dict={dict.nav} lang={lang} />
      <main>
        <Hero dict={dict.hero} />
        <ScrollStory dict={dict.story} />
        <ProductSection dict={dict.product} />
        <Testimonials dict={dict.testimonials} />
        <CTASection dict={dict.cta} />
      </main>
      <Footer dict={dict.footer} lang={lang} />
    </PageShell>
  )
}
