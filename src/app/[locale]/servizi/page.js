// app/[locale]/servizi/page.jsx
import React from "react";
import Image from "next/image";
import {useTranslations} from "next-intl";
import {Link, getPathname} from "@/i18n/navigation";
import {Package, Truck, ShieldCheck, Cog} from "lucide-react";
import ReactMarkdown from 'react-markdown';

import H1 from "@/components/common/H1";
import H2 from "@/components/common/H2";
import CTABanner from "@/components/common/CTABanner";

import {buildMetadata} from "@/lib/seo";
import {generateLocaleParams} from "@/lib/locales";   // centralized locale generator

// 🔹 Pre-generate pages for all locales (so /es/servicios, /en/services, etc. exist)
export function generateStaticParams() {
  const params = generateLocaleParams();
  console.log('[servizi] generateStaticParams ->', params);
  return params;
}

// 🔹 SEO metadata (await params per Next 15)
export async function generateMetadata(props) {
  const params = await props.params;
  // Resolve the translated pathname for debugging
  try {
    const localizedPath = getPathname({href: '/servizi', locale: params.locale});
    console.log('[servizi] generateMetadata locale=', params.locale, 'translatedPath=', localizedPath);
  } catch (e) {
    console.log('[servizi] getPathname error', e);
  }

  return buildMetadata({
    locale: params.locale,
    route: "/servizi", // route key (same for all locales; next-intl translates it)
    title: "Servizi di trasporto internazionale | Bongiorno",
    description:
      "Soluzioni logistiche affidabili in tutta Europa e Nord Africa.",
    image: "/og/servizi.jpg"
  });
}

// 🔹 Page component
export default function ServiziPage() {
  const t = useTranslations("services");
  const t2 = useTranslations("ctaBanner");
  const icons = {Package, Truck, ShieldCheck, Cog};

  return (
    <main className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 py-20 px-6 antialiased">
      {/* 🔹 Hero */}
      <section className="mx-auto max-w-5xl">
        <div className="flex items-center flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <H1>{t("title")}</H1>
            <p className="text-lg leading-relaxed lg:mb-8">{t("intro")}</p>
          </div>
          <div className="relative w-full md:w-[350px] lg:w-[400px] h-[300px] rounded-lg overflow-hidden hidden md:block flex-shrink-0">
            <Image
              src="/img/sede.webp"
              alt="Sede Bongiorno Trasporti"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 🔹 Overview Grid */}
      <section className="mx-auto px-4 grid md:grid-cols-2 md:my-20 my-8 gap-10 max-w-5xl">
        {(() => {
          const cards = t.raw("cards");
          const details = t.raw("details");
          return cards.map((card, i) => {
            const IconComponent = icons[card.icon] || Package;
            const sectionId = details?.[i]?.id;
            const href = sectionId ? `#${sectionId}` : "#";
            return (
              <Link
                key={i}
                href={href}
                className=" p-6 rounded-md shadow-sm hover:shadow-md transition bg-white dark:hover:bg-gray-800 cursor-pointer hover:scale-105"
              >
                <H2>
                  <IconComponent className="text-brand-accent text-3xl" />
                  {card.title}
                </H2>
                <p className="leading-relaxed mb-6">{card.text}</p>
              </Link>
            );
          });
        })()}
      </section>

      {/* 🔹 CTA */}
      <CTABanner t={t2} />

      {/* 🔹 Detailed Sections */}
      <section className="px-4 lg:px-0 mx-auto py-20 max-w-3xl space-y-20">
        {t.raw("details").map((item, i) => (
          <article key={i} id={item.id} className="scroll-mt-24">
            <div className="flex md:flex-row flex-col md:gap-4 gap-1">
              <span className="text-brand-accent text-3xl mt-1">
                {icons[item.icon]
                  ? React.createElement(icons[item.icon])
                  : "•"}
              </span>
              <H2>{item.title}</H2>
            </div>
            {item.paragraphs.map((p, j) => (
              <div
                key={j}
                className="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300"
              >
                <ReactMarkdown>{p}</ReactMarkdown>
              </div>
            ))}
            <hr className="h-[2px] my-4 bg-gray-200 border-0 md:my-10 dark:bg-gray-700" />
          </article>
        ))}
      </section>
    </main>
  );
}
