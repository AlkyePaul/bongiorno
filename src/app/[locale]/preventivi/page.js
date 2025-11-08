import { getTranslations } from "next-intl/server";
import FromPreventivi from '@/components/common/QuoteForm';
import H1 from '@/components/common/H1';
import { buildMetadata } from '@/lib/seo';

export async function generateMetadata(props) {
  const { locale } = await props.params;
  const seo = (await import(`@/locales/seo.${locale}.json`)).default;
  const title = seo?.quote?.title || `Richiedi preventivo | ${seo?.siteName || 'Bongiorno Trasporti'}`;
  const description = seo?.quote?.description || seo?.defaults?.description || 'Richiedi un preventivo per i tuoi trasporti internazionali.';
  return buildMetadata({
    locale,
    route: '/preventivi',
    title,
    description,
    image: seo?.quote?.image || seo?.defaults?.images?.preventivi || '/og/preventivi.jpg',
  });
}
export default async function Preventivi({ params }) {
   const { locale } = await params;
   const t = await getTranslations({ locale, namespace: 'quote' });
   const messages = (await import(`@/locales/${locale}.json`)).default;
   const features = Array.isArray(messages?.quote?.features) ? messages.quote.features : [];

    return (
    <>
    <main className="text-gray-800 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 py-20 px-6">
        <section className="mb-12 max-w-4xl mx-auto">
        <H1 className="">
            {t("title")}
          </H1> 

          <p className="text-lg leading-relaxed mb-8">{t("intro")}</p>

          <ul className="list-disc list-inside space-y-1">
            {features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          </section>
          <section className="max-w-3xl mx-auto">
    <FromPreventivi />
    </section>
    </main>

</>
    );
}