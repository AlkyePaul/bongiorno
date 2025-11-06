import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }, { locale: 'it' }];
}
export default async function LocaleLayout({ children, params }) {
  const { locale } = params; // ✅ no await here
  let messages;
  try {
    messages = (await import(`@/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="max-w-screen overflow-y-hidden">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}