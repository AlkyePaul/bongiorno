import { buildMetadata } from "@/lib/seo";
import ContattiClient from "@/components/contact/ContattiClient";

export async function generateMetadata(props) {
  const { locale } = await props.params;
  const seo = (await import(`@/locales/seo.${locale}.json`)).default;
  const title = seo?.contact?.title || `Contatti | ${seo?.siteName || 'Bongiorno Trasporti'}`;
  const description = seo?.contact?.description || seo?.defaults?.description || 'Contatta Bongiorno Trasporti per informazioni e preventivi.';
  return buildMetadata({
    locale,
    route: '/contatti',
    title,
    description,
    image: seo?.contact?.image || seo?.defaults?.images?.contatti || '/og/contatti.jpg',
  });
}

export default async function ContattiPage() {
  return <ContattiClient />;
}
