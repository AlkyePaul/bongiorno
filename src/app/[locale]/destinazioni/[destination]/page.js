import Image from "next/image";
import { notFound } from "next/navigation";
import ReactMarkdown from 'react-markdown';
import { useTranslations } from "next-intl";
import DestinationMap from "@/components/maps/DestinationMap";
import { BriefcaseBusiness, MoveRight } from "lucide-react";
import {Link} from "@/i18n/navigation";
import H1 from "@/components/common/H1";
import { buildMetadata } from "@/lib/seo";
import geo from "@/data/geo.json";

export function generateStaticParams() {
  const destinations = ["tunisia", "algeria", "marocco", "libia", "mauritania"];
  return destinations.flatMap((dest) => [
    { locale: "it", destination: dest },
    { locale: "en", destination: dest },
    { locale: "es", destination: dest },
  ]);
}

export async function generateMetadata(props) {
  const { locale, destination } = await props.params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const seo = (await import(`@/locales/seo.${locale}.json`)).default;
  const data = messages?.destinations?.[destination] || {};
  const name = (data?.title || destination).replace(/^Trasporti\s+/i, '');
  const title = (seo?.destinations?.titleTemplate || '{name} | Bongiorno Trasporti')
    .replace('{name}', name);
  const descSource = data?.intro || data?.claim || seo?.defaults?.description || '';
  const description = (seo?.destinations?.descriptionTemplate || '{introOrClaim}')
    .replace('{introOrClaim}', descSource);
  const image = (seo?.destinations?.imageBase ? `${seo.destinations.imageBase}${destination}.jpg` : `/og/destinations/${destination}.jpg`);

  return buildMetadata({
    locale,
    route: "/destinazioni/[destination]",
    params: { destination },
    title,
    description,
    image,
  });
}

export default async function DestinationPage({ params }) {
  const { locale, destination } = params;
    
    const messages = (await import(`@/locales/${locale}.json`)).default;
    const data = messages?.destinations?.[destination];


  const t = messages?.common; // instead of useTranslations("common")

    if (!data) notFound();

  // Geo lookup by route param
  const geoEntry = geo?.[destination] || null;
  const coordinates = Array.isArray(geoEntry?.center) ? geoEntry.center : [10.18, 36.8];
  const markers = Array.isArray(geoEntry?.markers) ? geoEntry.markers : [];

  return (
    <main className="text-gray-800 dark:text-gray-200 my-26">
      {/* 🔹 Hero */}
      <section className="container mx-auto px-6 md:py-20 py-12">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          <div className="md:col-span-3 order-2 md:order-1">
            <H1>{data.title}</H1>
            <div className="text-lg md:text-lg text-gray-700 dark:text-gray-300 mb-4">
              <ReactMarkdown>{data.claim}</ReactMarkdown>
            </div>
            <div className="text-lg md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              <ReactMarkdown>{data.intro}</ReactMarkdown>
            </div>
          </div>

          <div className="md:col-span-2 order-1 md:order-2">
            <div className="relative h-[250px] md:h-[300px] lg:h-[350px] w-full rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={`/img/${destination}.webp`}
                alt={data.title}
                fill
                className="object-cover object-top md:object-center"
                priority
              />
            </div>
          </div>
        </div>
      </section>

<section className="container mx-auto px-6 py-20 grid lg:grid-cols-2 gap-12 items-stretch">
  {/* LEFT — Map + paragraphs */}
  <div className="flex flex-col gap-8 order-2 lg:order-1">
    <div className="relative w-full">
      {/* ✅ Maintain height ratio with aspect-ratio for smaller screens */}
      <div className="relative lg:aspect-auto lg:h-full min-h-[350px] lg:min-h-[500px] rounded-2xl overflow-hidden shadow-lg">
        <DestinationMap coordinates={coordinates} markers={markers} />
      </div>
    </div>
  </div>

  {/* RIGHT — Services */}
  <aside className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-4 md:p-6 flex flex-col gap-6 order-1 lg:order-2 lg:h-full">
    <div className="flex items-center gap-4 m-2">
      <BriefcaseBusiness className="w-8 h-8 text-brand-accent shrink-0" />
      <h2 className="text-2xl font-semibold">{data.servicesTitle}</h2>
    </div>

    <ul className="space-y-3 text-lg text-gray-700 dark:text-gray-300 flex-1">
      {data.services?.map((s, i) => (
        <li key={i} className="flex items-center gap-2">
          <MoveRight className="w-4 h-4 text-brand-accent shrink-0" />
          <span className="flex-1">{s}</span>
        </li>
      ))}
    </ul>

    <Link
      href="/preventivi"
      className="mt-auto inline-block px-6 py-3 bg-brand-accent text-white font-medium rounded-md hover:bg-brand-accent/90 transition text-center"
    >
      {t.preventivo}
    </Link>
  </aside>
</section>

<section className="max-w-4xl mx-auto md:py-20 py-12 ">
        <div className="space-y-4">
            {data.paragraphs?.map((p, i) => (
              <div
                key={i}
                className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
              >
                <ReactMarkdown>{p}</ReactMarkdown>
              </div>
            ))}
          </div>
          </section>
    </main>
  );
}
