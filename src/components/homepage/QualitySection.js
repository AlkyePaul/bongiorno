"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import LogoGrid from "../common/LogoGrid";

export default function QualitySection() {
  const t = useTranslations("home.quality");



  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-20 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 text-center">
        {/* 🏷️ Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12">
          {t("title")}
        </h2>

        {/* 🏢 Logos grid */}
        <LogoGrid />
        {/*

        {/* 📝 Text */}
        <div className="max-w-3xl mx-auto text-gray-600 dark:text-gray-300 leading-relaxed space-y-4">
          <p>{t("text1")}</p>
          <a className="text-brand-accent hover:underline" href="https://bongiornotrasporti.it/wp-content/uploads/2024/10/S258-Bongio22022216230.pdf" target="_blank">{t("text2")}</a>
        </div>
      </div>
    </section>
  );
}
