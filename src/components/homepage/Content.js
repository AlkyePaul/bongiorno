"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import ReactMarkdown from 'react-markdown';
import H2 from "../common/H2";

export default function HomepageContent() {
  const t = useTranslations("home.content"); // expects translations under "home.content"

  return (
    <section className="container mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-[30%_50%] gap-12 items-start justify-between">
      {/* 🧭 Left column — title + intro text */}
      <div className="flex flex-col justify-center space-y-8">
        <H2>
          {t("title")}
        </H2>
        <div className="space-y-4  text-lg  text-gray-700 dark:text-gray-300 leading-relaxed">
          <ReactMarkdown>{t("intro1")}</ReactMarkdown>
          <ReactMarkdown>{t("intro2")}</ReactMarkdown>
          <ReactMarkdown>{t("intro3")}</ReactMarkdown>
          <ReactMarkdown>{t("intro4")}</ReactMarkdown>
          <ReactMarkdown>{t("intro5")}</ReactMarkdown>
        </div>
      </div>

      {/* 🖼️ Right column — image + text + image */}
      <div className="flex flex-col space-y-10">
        <div className="flex flex-col items-center gap-8">
          {/* Top image */}
          <div className="relative md:bottom-10 w-[90%] h-90 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/img/sede.webp"
              alt={t("blocks.0.alt")}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Text section */}
          <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-prose">
            <H2>
              {t("blocks.0.title")}
            </H2>
            <ReactMarkdown>{t("blocks.0.text1")}</ReactMarkdown>
            <ReactMarkdown>{t("blocks.0.text2")}</ReactMarkdown>
            <ReactMarkdown>{t("blocks.0.text3")}</ReactMarkdown>
            <ReactMarkdown>{t("blocks.0.text4")}</ReactMarkdown>
          </div>

          {/* Bottom image 
          <div className="relative w-[90%] h-90 rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/img/sede.webp"
              alt={t("blocks.0.alt")}
              fill
              className="object-cover"
            />
          </div>*/}
        </div>
      </div>
    </section>
  );
}
