import { buildMetadata } from "@/lib/seo";
import LavoraClient from "@/components/lavora/LavoraClient";

export async function generateMetadata(props) {
  const { locale } = await props.params;
  const seo = (await import(`@/locales/seo.${locale}.json`)).default;
  const title = seo?.lavora?.title || `Lavora con noi | ${seo?.siteName || 'Bongiorno Trasporti'}`;
  const description = seo?.lavora?.description || seo?.defaults?.description || 'Scopri le opportunità di lavoro presso Bongiorno Trasporti.';
  return buildMetadata({
    locale,
    route: '/lavora',
    title,
    description,
    image: seo?.lavora?.image || seo?.defaults?.images?.lavora || '/og/lavora.jpg',
  });
}

export default async function LavoraPage() {
  return <LavoraClient />;
}
