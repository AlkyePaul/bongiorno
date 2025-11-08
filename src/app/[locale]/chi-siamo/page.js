import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import { getTranslations } from "next-intl/server";
import H2 from "@/components/common/H2";
import SediSection from "@/components/homepage/Sedi";
import CTABanner from "@/components/common/CTABanner";
import { buildMetadata } from "@/lib/seo";
import Counters from "@/components/about/Counters";

export async function generateMetadata(props) {
  const { locale } = await props.params;
  const seo = (await import(`@/locales/seo.${locale}.json`)).default;
  const title = seo?.about?.title || `Chi siamo | ${seo?.siteName || 'Bongiorno Trasporti'}`;
  const description = seo?.about?.description || seo?.defaults?.description || 'La storia e i valori di Bongiorno Trasporti.';
  return buildMetadata({
    locale,
    route: '/chi-siamo',
    title,
    description,
    image: seo?.about?.image || seo?.defaults?.images?.about || '/og/chi-siamo.jpg',
  });
}
import BongiornoMap from "@/components/maps/BongiornoMap";

export default async function ChiSiamoPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  const tCta = await getTranslations({ locale, namespace: 'ctaBanner' });
  const yearsActive = new Date().getFullYear() - 1985;

  return (
    <main className="text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* 🔹 Hero Section */}
      <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/img/hero-about.webp"
            alt={t("hero.alt")}
            fill
            priority
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-gray-950/95 via-gray-900/70 to-transparent" />
        </div>

        {/* Content Layer */}
        <div className="relative z-[2] w-full flex items-center">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: title + subtitle */}
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-md">
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-lg text-gray-100 max-w-lg">
                {t("hero.subtitle")}
              </p>
            </div>

            {/* Right: Counters (client) */}
            <Counters
              transportsTarget={12000}
              yearsTarget={yearsActive}
              employeesTarget={150}
              texts={{
                transports_prefix: t('counters.transports_prefix'),
                transports_label: t('counters.transports_label'),
                years_prefix: t('counters.years_prefix'),
                years_label: t('counters.years_label'),
                employees_prefix: t('counters.employees_prefix'),
                employees_label: t('counters.employees_label'),
              }}
            />
          </div>
        </div>
      </section>

      {/* 🔹 About Section */}
      <section className="relative mx-auto lg:bg-[linear-gradient(to_left,_white_45%,_#f3f4f6_45%)] py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6">
       

          {/* Right Text */}
          <div className="max-w-xl">
            <H2>{t("subtitle")}</H2>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="text-lg leading-relaxed mb-6">
                <ReactMarkdown>{t(`text${n}`)}</ReactMarkdown>
              </div>
            ))}
          </div>

         <div className="mx-auto flex flex-col gap-12">

  <div className="relative w-[400px] h-[300px] overflow-hidden rounded-2xl shadow-lg">
    <Image
      src="/img/sede.webp"
      alt={t("hero.alt")}
      fill
      className="object-cover"
    />
  </div>
<p className="text-center italic max-w-[300px] text-base">{t("sede")}</p>
  <div className="relative w-[400px] h-[400px] overflow-hidden rounded-2xl shadow-lg">
    <BongiornoMap />
  </div>
</div>


        </div>
      </section>

      {/* 🔹 CTA + Sedi */}
      <CTABanner t={(k)=>tCta(k)} />
      <SediSection />
    </main>
  );
}
