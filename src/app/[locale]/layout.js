import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import CookieConsent from "@/components/common/CookieConsent";
import { generateLocaleParams } from '@/lib/locales';


export function generateStaticParams() {
  const params = generateLocaleParams();
  console.log('[layout] generateStaticParams ->', params);
  return params;
}
export default async function LocaleLayout({ children, params }) {
  const { locale } = params; 
  let messages;
  try {
    messages = (await import(`@/locales/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }

  return (
  
        <NextIntlClientProvider locale={locale} messages={messages}>
        
          <Header />
          {children}
          <Footer />
           <CookieConsent />
        </NextIntlClientProvider>
        
  
   
  );
}