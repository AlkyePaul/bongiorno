import { notFound } from "next/navigation";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import H2 from "@/components/common/H2";
import { ArrowLeft } from "lucide-react";
import { mdxComponents } from "@/components/news/MDXComp";
import PostMeta from "@/components/news/PostMeta";
import { getArticleWithLocales, getArticleLocales } from "@/lib/news-utils";
import LanguageBadges from "@/components/news/LanguageBadges";
import { getTranslations } from "next-intl/server";
import { generateLocaleParams } from '@/lib/locales';
import { buildMetadata } from '@/lib/seo';
import PostIndex from '@/components/news/PostIndex';


export async function generateStaticParams() {
  const fs = await import('fs');
  const path = await import('path');
  
  const locales = generateLocaleParams().map(p => p.locale);
  const allPosts = fs.default
    .readdirSync(path.default.join(process.cwd(), "content/news/it"))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));

  return locales.flatMap((locale) =>
    allPosts.map((post) => ({ locale, post }))
  );
}


export async function generateMetadata({ params }) {
  const { locale, post } = await params;
  const article = getArticleWithLocales(post, locale);
  const data = article?.data || {};
  const title = data.title ? `${data.title} | Bongiorno` : 'News | Bongiorno';
  const description = data.excerpt || data.description || 'Approfondimenti su trasporto e logistica.';
  const image = data.image || `/og/news/${post}.jpg`;
  return buildMetadata({
    locale,
    route: '/news/[post]',
    params: { post },
    title,
    description,
    image,
  });
}

export default async function NewsPostPage({ params }) {
  const { locale, post } = await params;
  const t = await getTranslations({ locale, namespace: 'news' });
  const tCommon = await getTranslations({ locale, namespace: 'common' });
  const index = tCommon('index');

  // Get article with locale information
  const article = getArticleWithLocales(post, locale);
  
  // If article doesn't exist at all → 404
  if (!article) notFound();
  
  const { content, data, availableLocales, isFallback } = article;
  const title = data.title;
  const image = data.image;

  return (
    <main className="text-gray-800 dark:text-gray-200">
      {/* 🔹 Hero */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center">
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/70 to-transparent z-10" />
        <div className="relative z-20 text-left mx-auto px-6 py-10  ">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md">
            {title}
          </h1>
          {isFallback && (
            <p className="text-base mt-3 text-yellow-300 bg-yellow-900/40 px-4 py-2 rounded-md inline-block">
              ⚠️ {t('fallbackNotice')}
            </p>
          )}
          <div className="mt-4">
            <LanguageBadges 
              availableLocales={availableLocales}
              currentLocale={locale}
              variant="compact"
            />
          </div>
         {data.indice && <PostIndex indice={data.indice} index={index} />}
        </div>
      </section>
    

      {/* 🔹 Content */}
      <section className="max-w-5xl mx-auto px-6 py-10 max-w-4xl space-y-5 prose dark:prose-invert post-content">
          <PostMeta {...data} />
          
        <MDXRemote
          source={content}
          components={{
            ...mdxComponents,
            Image: (props) => (
              <Image
                {...props}
                alt={props.alt ?? ""}
                width={800}
                height={500}
                className="rounded-xl shadow-lg mx-auto my-8"
                 
              />
            ),
            H2,
          }}
        />
      </section>

      <div className="text-center mb-20">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-accent text-white rounded-md hover:bg-brand-accent/90 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          {tCommon('back_news')}
        </Link>
      </div>
    </main>
  );
}
