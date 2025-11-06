"use client";
import { useTranslations } from "next-intl";
import FromPreventivi from '@/components/common/QuoteForm';
import H1 from '@/components/common/H1';
export default function Preventivi() {
   const t = useTranslations("quote");

    return (
    <>
    <main className="text-gray-800 bg-gray-50 dark:bg-gray-900 dark:text-gray-200 py-20 px-6">
        <section className="mb-12 max-w-4xl mx-auto">
        <H1 className="">
            {t("title")}
          </H1> 

          <p className="text-lg leading-relaxed mb-8">{t("intro")}</p>

          <ul>{features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
           
          </ul>
          </section>
          <section className="max-w-3xl mx-auto">
    <FromPreventivi />
    </section>
    </main>

</>
    );
}