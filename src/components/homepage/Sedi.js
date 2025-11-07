"use client";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {Link} from "@/i18n/navigation";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";

export default function SediSection() {
  const t = useTranslations("home.sedi");
  const cta = useTranslations("ctaBanner");
  const locale = useLocale();

 const BongiornoMap = dynamic(() => import("../maps/BongiornoMap"), { ssr: false });

  // 🏢 Each office entry defined in translations
  const sedi = t.raw("locations");

  // Map office name to ISO 3166-1 alpha-2 for country-flag-icons
  const nameToCode = (name = "") => {
    const n = name.toLowerCase();
    if (n.includes("italia")) return "IT";
    if (n.includes("spagna")) return "ES";
    if (n.includes("francia")) return "FR";
    if (n.includes("tunisia")) return "TN";
    if (n.includes("algeria")) return "DZ";
    if (n.includes("marocco")) return "MA";
    if (n.includes("libia")) return "LY";
    if (n.includes("mauritania")) return "MR";
    return "IT"; // default fallback
  };

  return (
    <section className="bg-white dark:bg-gray-950 md:py-20 py-8 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 space-y-16">
        {/* 🏷️ Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("intro1")}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("intro2")}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {t("intro3")}
          </p>
               <div className="mb-6 flex flex-col items-center  justify-center w-full mx-auto">
                <Link
                  href="/contatti"
                  className="inline-block px-4 py-2 mb-6 text-base font-medium rounded-md bg-brand-accent text-white hover:bg-brand-accent/90 transition"
                >
                  {t("contactLabel")}
                </Link>

                <p className="text-lg text-gray-700 dark:text-gray-300">{cta("cta.contattaci")}</p>
                <p className="text-lg text-gray-700 dark:text-gray-300">{cta("cta.parliamo")}</p>
              </div>

        </div>
         

        <div className="w-full h-[480px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
          <BongiornoMap padding={80} />
        </div>

        {/* 🗺️ Locations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sedi.map((sede, i) => (
            <div
              key={i}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition flex flex-col"
            >
              {/* Flag + Name */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-5 rounded-sm overflow-hidden">
                  {(() => {
                    try {
                      const { IT, ES, FR, TN, DZ, MA, LY, MR } = require('country-flag-icons/react/3x2');
                      const map = { IT, ES, FR, TN, DZ, MA, LY, MR };
                      const code = nameToCode(sede.name);
                      const Flag = map[code] || IT;
                      return <Flag title={code} className="w-7 h-5" />;
                    } catch {
                      return (
                        <div className="w-7 h-5 bg-gray-300 rounded-sm" aria-hidden />
                      );
                    }
                  })()}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {sede.name}
                </h3>
              </div>

              {/* Description */}
              <div className="flex-1 space-y-3 text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                {sede.description.map((p, idx) => (
                  <p key={idx}>{p}</p>
                ))}
              </div>

              {/* Contact link 
              <div className="mt-6">
                <Link
                  href={sede.contactUrl || "#"}
                  className="inline-block px-4 py-2 text-base font-medium rounded-md bg-brand-accent text-white hover:bg-brand-accent/90 transition"
                >
                  {t("contactLabel")} {sede.name}
                </Link>
              </div>*/}
            </div>
          ))}
        </div>

     
      </div>
    </section>
  );
}
