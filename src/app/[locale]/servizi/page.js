"use client";
import { useTranslations } from "next-intl";
import React from "react";

import H1 from "@/components/common/H1";
import H2 from "@/components/common/H2";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as LucideIcons from "lucide-react";
import CTABanner from "@/components/common/CTABanner";
import Image from "next/image";

export default function ServiziPage() {
  const t = useTranslations("services");
  const t2 = useTranslations("cta");

  // combine all libraries into one object
  const icons = { ...FaIcons, ...MdIcons, ...RiIcons, ...LucideIcons };

  return (
    <main className="bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-200 py-20 px-6">
      {/* 🔹 Hero / Intro */}
      <section className="container mx-auto px-6 py-20 max-w-5xl">
        <div className="flex items-center gap-12">
          <div>
        <H1>{t("title")}</H1>
        <p className="text-lg leading-relaxed mb-8">{t("intro")}</p>
          </div>
          <div className="w-full h-full rounded-lg overflow-hidden">
            <Image src="/img/sede.webp" alt="" width={500} height={500} />
          </div>
        </div>
      </section>

      {/* 🔹 Overview Grid */}
      <section className="mx-auto px-6 grid md:grid-cols-2 my-20 gap-10 max-w-5xl">
        {t.raw("cards").map((card, i) => {
          const IconComponent = icons[card.icon] || FaIcons.FaBox; // fallback icon
          return (
           <a href={card.href} key={i} className="border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition bg-white dark:hover:bg-gray-800 cursor-pointer hover:scale-105">
          
              <H2  >
                <IconComponent className="text-brand-accent text-3xl" />
                {card.title}
              </H2>
              <p className="leading-relaxed mb-6">{card.text}</p>
            </a>
          );
        })}
      </section>
  {/* 🔹 CTA */}

<CTABanner t={t2} />


          {/* 🔹 Detailed Sections (anchor-linked) */}
      <section className=" px-4 lg:px-0 mx-auto py-20 max-w-3xl space-y-20">
        {t.raw("details").map((item, i) => (
          <article key={i} id={item.id} className="scroll-mt-24">
            
            <div className="flex gap-12">
                  <span className="text-brand-accent text-3xl mt-1">
                  {icons[item.icon] ? React.createElement(icons[item.icon]) : "•"}
                </span>
            <H2>
           
              
              {item.title}   
              
              
            </H2>
            </div>
            {item.paragraphs.map((p, j) => (
              <>
              <p key={j} className="text-lg leading-relaxed mb-4 text-gray-700 dark:text-gray-300">
                {p}
              </p>
             
              </>
            ))}
            <hr className=" h-[2px] my-4 bg-gray-200 border-0 md:my-10 dark:bg-gray-700" />
          </article>
        ))}
      </section>

    </main>
  );
}
