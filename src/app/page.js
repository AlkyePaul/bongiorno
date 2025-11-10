import { NextIntlClientProvider } from 'next-intl';
import { routing } from '@/i18n/routing';
import HeaderSSR from '@/components/header/HeaderSSR';
import Footer from '@/components/footer/Footer';
import CookieConsent from '@/components/common/CookieConsent';
import HomePage from '@/app/[locale]/page';

export default async function RootHome() {
  const locale = routing.defaultLocale || 'it';
  const messages = (await import(`@/locales/${locale}.json`)).default;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <HeaderSSR />
      <HomePage />
      <Footer />
      <CookieConsent />
    </NextIntlClientProvider>
  );
}
