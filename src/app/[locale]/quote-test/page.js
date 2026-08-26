import QuoteFormTest from '@/components/common/QuoteFormTest';
import H1 from '@/components/common/H1';

export const metadata = {
  title: 'Quote Form Test | Bongiorno Trasporti',
  robots: 'noindex, nofollow',
};

export default async function QuoteTestPage() {
  return (
    <main className="text-gray-800 bg-gray-50 py-20 px-6">
      <section className="mb-8 max-w-4xl mx-auto">
        <H1>Preventivo – Test</H1>
        <p className="text-sm text-gray-500 mb-6">
          Versione di test del form preventivo con selezione visuale tipo spedizione, valore merce e assicurazione.
        </p>
      </section>
      <section className="max-w-3xl mx-auto">
        <QuoteFormTest />
      </section>
    </main>
  );
}
