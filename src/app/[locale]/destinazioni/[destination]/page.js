  import Image from "next/image";
  import { notFound } from "next/navigation";
  import { useTranslations } from "next-intl";
  import DestinationMap from "@/components/common/DestinationMap";
  import { BriefcaseBusiness, MoveRight } from "lucide-react";
  import Link from "next/link";

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
    <main className="text-gray-800 dark:text-gray-200 mt-26">
      {/* 🔹 Hero */}
      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 mt-12">{data.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            {data.claim}
          </p>
          <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-200">
            {data.intro}
          </p>
        </div>

        <div className="relative h-[300px] w-full rounded-2xl overflow-hidden shadow-lg lg:col-span-1">
          <Image
            src={`/img/${destination}.webp`}
            alt={data.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* 🔹 Content with Map + Services */}
      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-3 gap-12 items-start">
        {/* LEFT — Map + paragraphs */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          <div className="rounded-2xl overflow-hidden shadow-lg h-[400px] ">
            {/* ✅ This component is client-side */}
            <DestinationMap coordinates={data.mapCoords} markers={data.mapMarkers} />
          </div>

          <div className="space-y-4">
            {data.paragraphs?.map((p, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-gray-700 dark:text-gray-300"
              >
                {p}
              </p>
            ))}
          </div>
        </div>

        {/* RIGHT — Services */}
        <aside className="bg-gray-50 dark:bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col gap-6">
          <div className="flex items-center gap-3">
          <BriefcaseBusiness className="w-8 h-8 text-brand-accent" />
            <h2 className="text-2xl font-semibold">{data.servicesTitle}</h2>
          </div>

          <ul className="space-y-3 text-gray-700 dark:text-gray-300">
            {data.services?.map((s, i) => (
              <li key={i} className="flex items-center gap-2">
                
                <MoveRight className="w-4 h-4 text-brand-accent flex-1" />
                <span className="flex-6">{s}</span>
              </li>
            ))}
          </ul>

          <Link
            href={`/${locale}/preventivi`}
            className="mt-6 inline-block px-6 py-3 bg-brand-accent text-white font-medium rounded-md hover:bg-brand-accent/90 transition text-center"
          >
            {t.preventivo}
          </Link>
        </aside>
      </section>
    </main>
  );
}
