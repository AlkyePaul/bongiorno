import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Image from "next/image";
import {Link} from "@/i18n/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import H2 from "@/components/common/H2";
import { Calendar, User, FolderOpen, ArrowLeft, AlertTriangle, Clock, Euro, Moon } from "lucide-react";
import matter from "gray-matter";
import { mdxComponents } from "@/components/news/MDXComp";
import PostMeta from "@/components/news/PostMeta";


export async function generateStaticParams() {
  const locales = ["it", "en", "es"];
  const allPosts = fs
    .readdirSync(path.join(process.cwd(), "content/news/it"))
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(".mdx", ""));

  return locales.flatMap((locale) =>
    allPosts.map((post) => ({ locale, post }))
  );
}

export default async function NewsPostPage({ params }) {
  const { locale, post } = params;
  const t = (await import(`@/locales/${locale}.json`)).default.common;

  const articlePath = path.join(process.cwd(), "content/news", locale, `${post}.mdx`);
  const fallbackPath = path.join(process.cwd(), "content/news", "it", `${post}.mdx`);

  const articleExists = fs.existsSync(articlePath);
  const fallbackExists = fs.existsSync(fallbackPath);
// Read file

// Parse front-matter


  // If not even the default version exists → 404
  if (!articleExists && !fallbackExists) notFound();

  // Select which MDX file to render
  const fileToRender = articleExists ? articlePath : fallbackPath;
  const isFallback = !articleExists && fallbackExists;
const fileContent = fs.readFileSync(fileToRender, "utf-8");

const { content, data } = matter(fileContent);


  // Metadata extraction (title, image, etc.) → optional frontmatter
  const title = data.title;
  const image = data.image;
  const intro = data.intro;

  return (
    <main className="text-gray-800 dark:text-gray-200">
      {/* 🔹 Hero */}
      <section className="relative w-full h-[60vh] flex items-center justify-center">
        <Image
          src={image}
          alt={title}
          fill
          priority
          className="object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/70 to-transparent z-10" />
        <div className="relative z-20 text-left container mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-md">
            {title}
          </h1>
          {isFallback && (
            <p className="text-sm mt-2 text-gray-300 italic">
              ⚠️ {t.fallback_notice}
            </p>
          )}
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
          {t?.back_news ?? "Torna alle notizie"}
        </Link>
      </div>
    </main>
  );
}
