import Image from "next/image";
import {Link} from "@/i18n/navigation";
import H1 from "@/components/common/H1";
import H2 from "@/components/common/H2";
import { User, Calendar, FolderOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getAllArticlesWithLocales } from "@/lib/news-utils";
import LanguageBadges from "@/components/news/LanguageBadges";


export const dynamic = "force-static";

import { generateLocaleParams } from '@/lib/locales';

export const generateStaticParams = generateLocaleParams;

// 🔹 SEO metadata
export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'news' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
  };
}

export default async function NewsPage({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'news' });

  // 📰 Get all articles with locale availability info
  const articles = getAllArticlesWithLocales(locale);

  const featured = articles[0];
  const secondary = articles[1];
  const others = articles.slice(2);

  return (
    <main className="text-gray-800 dark:text-gray-200">
      {/* 🔹 HERO SECTION */}
      <section className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/img/port.webp"
          alt="Panorama porto e argani"
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/70 to-transparent z-10" />
        <div className="relative z-20 container mx-auto px-6 text-left max-w-4xl">
          <H1 white={true}>
            {t('hero.title')}
          </H1>
          <p className="text-lg md:text-xl text-gray-100 mt-4 max-w-2xl">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* 🔹 MAIN SECTION */}
      <section className="container mx-auto px-6 py-20 grid lg:grid-cols-3 gap-12">
        {/* LEFT — Featured + secondary */}
        <div className="lg:col-span-2 space-y-10">
          {/* Featured article */}
          {featured && (
            <div className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-gray-900">
              <Image
                src={featured.image}
                alt={featured.title}
                width={1200}
                height={700}
                className="object-cover w-full h-[300px]"
              />
              <div className="p-6">
                <H2 className="mb-2">{featured.title}</H2>
                <div className="flex items-center gap-4 text-base text-gray-500 mb-3 flex-wrap">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {featured.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {featured.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderOpen className="w-4 h-4" /> {featured.category}
                  </span>
                  <LanguageBadges 
                    availableLocales={featured.availableLocales} 
                    currentLocale={locale}
                    variant="compact"
                  />
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {featured.excerpt}
                </p>
                <Link
                  href={`/news/${featured.slug}`}
                  className="inline-block bg-brand-accent text-white px-6 py-2 rounded-md hover:bg-brand-accent/90 transition"
                >
                  {t('featured.readMore')}
                </Link>
              </div>
            </div>
          )}

          {/* Secondary article preview */}
          {secondary && (
            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm p-6">
              <h3 className="text-2xl font-semibold mb-3 text-brand-navy">
                {secondary.title}
              </h3>
              <div className="flex items-center gap-3 text-base text-gray-500 mb-2 flex-wrap">
                <span>{secondary.date} | {secondary.category}</span>
                <LanguageBadges 
                  availableLocales={secondary.availableLocales} 
                  currentLocale={locale}
                  variant="compact"
                />
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {secondary.excerpt}
              </p>
              <Link
                href={`/news/${secondary.slug}`}
                className="text-brand-accent hover:underline"
              >
                {t('featured.readMore')}
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT — Sidebar “All News” */}
        <aside className="flex flex-col gap-4 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-brand-navy">
            {t('sidebar.title')}
          </h3>
          <ul className="space-y-3">
            {articles.map((a) => (
              <li key={a.slug} className="border-b border-gray-200/30 pb-3">
                <Link
                  href={`/news/${a.slug}`}
                  className="block hover:text-brand-accent transition"
                >
                  {a.title}
                </Link>
                <p className="text-xs text-gray-500">
                  {a.date} • {a.category}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </section>
    </main>
  );
}
