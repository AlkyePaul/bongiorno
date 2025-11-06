"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
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
        <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
          <p className="text-lg">{t("intro1")}</p>
          <p>{t("intro2")}</p>
          <p>{t("intro3")}</p>
          <p>{t("intro4")}</p>
          <p>{t("intro5")}</p>
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
          <div className="space-y-4 text-gray-600 dark:text-gray-400 text-md leading-relaxed max-w-prose">
            <H2>
              {t("blocks.0.title")}
            </H2>
            <p>{t("blocks.0.text1")}</p>
            <p>{t("blocks.0.text2")}</p>
            <p>{t("blocks.0.text3")}</p>
            <p>{t("blocks.0.text4")}</p>
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
