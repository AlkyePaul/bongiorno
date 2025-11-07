  import Image from "next/image";
  import { notFound } from "next/navigation";
  import { useTranslations } from "next-intl";
  import DestinationMap from "@/components/maps/DestinationMap";
  import { BriefcaseBusiness, MoveRight } from "lucide-react";
  import {Link} from "@/i18n/navigation";
  import H1 from "@/components/common/H1";

  export function generateStaticParams() {
    const destinations = ["tunisia", "algeria", "marocco", "libia", "mauritania"];
    return destinations.flatMap((dest) => [
      { locale: "it", destination: dest },
      { locale: "en", destination: dest },
      { locale: "es", destination: dest },
    ]);
  }

  export default async function DestinationPage({ params }) {
    const { locale, destination } = params;
    
    const messages = (await import(`@/locales/${locale}.json`)).default;
    const data = messages?.destinations?.[destination];


  const t = messages?.common; // instead of useTranslations("common")

    if (!data) notFound();

  return (
    <main className="text-gray-800 dark:text-gray-200 my-26">
      {/* 🔹 Hero */}
      <section className="container mx-auto px-6 md:py-20 py-12">
        <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-center max-w-6xl mx-auto">
          <div className="md:col-span-3 order-2 md:order-1">
            <H1>{data.title}</H1>
            <p className="text-lg md:text-lg text-gray-700 dark:text-gray-300 mb-4">
              {data.claim}
            </p>
            <p className="text-lg md:text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {data.intro}
            </p>
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

      {/* 🔹 Content with Map + Services */}
      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-3 gap-12 items-start">
        {/* LEFT — Map + paragraphs */}
        <div className="lg:col-span-2 flex flex-col gap-8 order-2 lg:order-1  ">
          <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] ">
            {/* ✅ This component is client-side */}
            <DestinationMap coordinates={data.mapCoords} markers={data.mapMarkers} />
          </div>

          <div className="space-y-4">
            {data.paragraphs?.map((p, i) => (
              <p
                key={i}
                className="text-lg leading-relaxed text-gray-700 dark:text-gray-300"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* RIGHT — Services */}
        <aside className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-2 md:p-6  flex flex-col gap-6 order-1 lg:order-2">
          <div className="flex items-center gap-4 m-2">
          <BriefcaseBusiness className="w-8 h-8 text-brand-accent" />
            <h2 className="text-2xl font-semibold">{data.servicesTitle}</h2>
          </div>

          <ul className="space-y-3 text-lg text-gray-700 dark:text-gray-300">
            {data.services?.map((s, i) => (
              <li key={i} className="flex items-center gap-2">
                
                <MoveRight className="w-4 h-4 text-brand-accent flex-1" />
                <span className="flex-8">{s}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/preventivi"
            className="mt-6 inline-block px-6 py-3 bg-brand-accent text-white font-medium rounded-md hover:bg-brand-accent/90 transition text-center"
          >
            {t.preventivo}
          </Link>
        </aside>
      </section>
    </main>
  );
}
