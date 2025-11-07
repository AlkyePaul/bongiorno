import fs from "fs";
import path from "path";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import matter from "gray-matter";
import H1 from "@/components/common/H1";
import H2 from "@/components/common/H2";
import { User, Calendar, FolderOpen } from "lucide-react";


export const dynamic = "force-static";

export async function generateStaticParams() {
  return [{ locale: "it" }, { locale: "en" }, { locale: "es" }];
}

export default async function NewsPage({ params }) {
  const { locale } = params;

  // 🧭 Folder for current language (fallback to Italian if missing)
  const newsDir = path.join(process.cwd(), "content/news", locale);
  const fallbackDir = path.join(process.cwd(), "content/news/it");
  const dirToUse = fs.existsSync(newsDir) ? newsDir : fallbackDir;

  // 📰 Read all localized MDX files
  const files = fs
    .readdirSync(dirToUse)
    .filter((file) => file.endsWith(".mdx"));

  // Parse front-matter metadata
  const articles = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const source = fs.readFileSync(path.join(dirToUse, file), "utf8");
    const { data } = matter(source);

    return {
      slug,
      title: data.title || slug,
      author: data.author || "Redazione",
      date: data.date || "—",
      category: data.category || "Articolo",
      image: data.image || "/img/news-placeholder.webp",
      excerpt: data.intro || "",
    };
  });

  // Sort by date descending
  articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
            Esplora le Ultime Novità nel Mondo delle Spedizioni
          </H1>
          <p className="text-lg md:text-xl text-gray-100 mt-4 max-w-2xl">
            Scopri approfondimenti esclusivi e aggiornamenti sulle spedizioni
            internazionali, con un focus su Europa e Nord Africa.
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
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" /> {featured.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" /> {featured.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <FolderOpen className="w-4 h-4" /> {featured.category}
                  </span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  {featured.excerpt}
                </p>
                <Link
                  href={`/${locale}/news/${featured.slug}`}
                  className="inline-block bg-brand-accent text-white px-6 py-2 rounded-md hover:bg-brand-accent/90 transition"
                >
                  Leggi di più
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
              <p className="text-sm text-gray-500 mb-2">
                {secondary.date} | {secondary.category}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">
                {secondary.excerpt}
              </p>
              <Link
                href={`/news/${secondary.slug}`}
                className="text-brand-accent hover:underline"
              >
                Leggi di più
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT — Sidebar “All News” */}
        <aside className="flex flex-col gap-4 bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-brand-navy">
            Articoli Recenti
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
