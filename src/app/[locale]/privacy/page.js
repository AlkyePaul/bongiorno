"use client";

import { useTranslations } from "next-intl";
import {Link} from "@/i18n/navigation";
import H1  from "@/components/common/H1";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(props) {
  const { locale } = await props.params;
  const messages = (await import(`@/locales/${locale}.json`)).default;
  const title = messages?.privacy?.meta?.title || `${messages?.privacy?.title ?? 'Privacy'} | Bongiorno Trasporti`;
  const description = messages?.privacy?.meta?.description || messages?.privacy?.controller?.name || 'Informativa sulla privacy di Bongiorno Trasporti.';
  return buildMetadata({
    locale,
    route: '/privacy',
    title,
    description,
    image: '/og/privacy.jpg',
  });
}

export default function PrivacyPage() {
  const t = useTranslations("privacy");
  const sections = t.raw("sections") || [];

  return (
    <main className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 py-20 px-6">
      <section className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header>
          <H1 >{t("title")}</H1>
          <p className="text-base text-gray-500 dark:text-gray-400">
            {t("lastUpdated")}
          </p>

          <div className="mt-4 text-base">
            <p className="font-medium">{t("controller.name")}</p>
            <p>P.IVA: {t("controller.piva")}</p>
            <p>{t("controller.address")}</p>
            <p>
              Email:{" "}
              <a
                href={`mailto:${t("controller.email")}`}
                className="text-brand-accent underline"
              >
                {t("controller.email")}
              </a>
            </p>
          </div>
        </header>

        <hr className="border-gray-300 dark:border-gray-700 my-8" />

        {/* Sections */}
        <div className="space-y-12">
          {sections.map((section) => (
            <article key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-2xl font-semibold mb-3">
                {section.heading}
              </h2>
              {section.subtitle && (
                <p className="text-base text-gray-500 dark:text-gray-400 mb-3">
                  {section.subtitle}
                </p>
              )}

              {section.content &&
                section.content.map((p, i) => (
                  <p key={i} className="mb-3 leading-relaxed">
                    {p}
                  </p>
                ))}

              {section.list && (
                <ul className="list-disc list-inside space-y-1 mb-3">
                  {section.list.map((li, i) => (
                    <li key={i}>{li}</li>
                  ))}
                </ul>
              )}

              {section.links && (
                <div className="mt-2">
                  {section.links.map((link, i) => (
                    <Link
                      key={i}
                      href={link.url}
                      target="_blank"
                      className="text-brand-accent underline"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}

              <hr className="border-gray-200 dark:border-gray-700 mt-8" />
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
