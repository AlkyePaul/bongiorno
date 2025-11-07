"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import H2 from "@/components/common/H2";
import SediSection from "@/components/homepage/Sedi";
import CTABanner from "@/components/common/CTABanner";

export default function ChiSiamoPage() {
  const t = useTranslations("about");
  const ctas = useTranslations("cta");
  const [years, setYears] = useState(0);
  const [transports, setTransports] = useState(0);
  const [employees, setEmployees] = useState(0);

  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const controls = useAnimation();

  const yearsActive = new Date().getFullYear() - 1985;

  useEffect(() => {
    if (inView) {
      controls.start({ opacity: 1, y: 0 });
      let t1 = 0,
        t2 = 0,
        t3 = 0;
      const interval = setInterval(() => {
        t1 += 300;
        t2 += 1;
        t3 += 2;
        setTransports(Math.min(t1, 12000));
        setYears(Math.min(t2, yearsActive));
        setEmployees(Math.min(t3, 150));
      }, 40);
      return () => clearInterval(interval);
    }
  }, [inView, controls, yearsActive]);

  return (
    <main className="text-gray-800 dark:text-gray-200 overflow-hidden">
      {/* 🔹 Hero Section */}
      <section
        ref={ref}
        className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden"
      >
        {/* Background Layer */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/img/hero-about.webp"
            alt={t("hero.alt")}
            fill
            priority
            className="object-cover brightness-75"
          />
          <div className="absolute inset-0 z-[1] bg-gradient-to-r from-gray-950/95 via-gray-900/70 to-transparent" />
        </div>

        {/* Content Layer */}
        <div className="relative z-[2] w-full flex items-center">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: title + subtitle */}
            <div className="text-white space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-md">
                {t("hero.title")}
              </h1>
              <p className="text-lg md:text-lg text-gray-100 max-w-lg">
                {t("hero.subtitle")}
              </p>
            </div>

            {/* Right: Counters */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={controls}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-center"
            >
              {[
                {
                  prefix: t("counters.transports_prefix"),
                  value: transports.toLocaleString(),
                  label: t("counters.transports_label"),
                },
                {
                  prefix: t("counters.years_prefix"),
                  value: years,
                  label: t("counters.years_label"),
                },
                {
                  prefix: t("counters.employees_prefix"),
                  value: employees,
                  label: t("counters.employees_label"),
                },
              ].map((c, i) => (
                <div
                  key={i}
                  className="bg-white/90 rounded-2xl shadow-md p-6 backdrop-blur-sm flex flex-col items-center justify-center min-h-[150px]"
                >
                  <span className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                    {c.prefix}
                  </span>
                  <h2 className="text-5xl font-bold text-brand-navy my-1 leading-none">
                    {c.value}
                  </h2>
                  <p className="text-xs text-gray-600 mt-1">{c.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 🔹 About Section */}
      <section className="relative mx-auto lg:bg-[linear-gradient(to_left,_white_45%,_#f3f4f6_45%)] py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-6">
       

          {/* Right Text */}
          <div className="max-w-xl">
            <H2>{t("subtitle")}</H2>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <p key={n} className="text-lg leading-relaxed mb-6">
                {t(`text${n}`)}
              </p>
            ))}
          </div>

         <div className="mx-auto flex flex-col gap-12">

  <div className="relative w-[400px] h-[300px] overflow-hidden rounded-2xl shadow-lg">
    <Image
      src="/img/sede.webp"
      alt={t("hero.alt")}
      fill
      className="object-cover"
    />
  </div>
<p className="text-center italic max-w-[300px] text-base">{t("sede")}</p>
  <div className="relative w-[400px] h-[400px] overflow-hidden rounded-2xl shadow-lg">
    <Image
      src="/img/truck.webp"
      alt={t("hero.alt")}
      fill
      className="object-cover"
    />
  </div>
</div>


        </div>
      </section>

      {/* 🔹 CTA + Sedi */}
      <CTABanner t={ctas} />
      <SediSection />
    </main>
  );
}
