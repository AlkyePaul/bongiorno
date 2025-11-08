"use client";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import { useLocale } from "next-intl";

export default function Hero({ title, subtitle, ctas, claim }) {

  const href =  ["#quote", "/contatti"]

  const locale = useLocale();
  return (
    <section className="relative bg-brand-petrol text-white px-6 py-24">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src="/img/hero-bg.webp"
          fill
          alt="Trasporti"
          className="w-full h-full object-cover object-center"
          priority
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-brand-petrol/70" /> {/* overlay */}
      </div>

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-6 py-22 text-left max-w-4xl">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight uppercase">
          {title}
        </h1>
        <h2 className="mt-4 text-2xl md:text-3xl font-medium">{subtitle}</h2>

        {/* Botones CTA */}
        <div className="mt-8 flex flex-col  sm:flex-row justify-start gap-4">
          {ctas.map((cta, i) => (
            <Link
              key={i}
              href={href[i]}
                className={
                i === 0
                  ? "btn-white"
                  : "btn"
              }
            >
              {cta.label}
            </Link>
          ))}
        </div>

        {/* Parrafo introductorio */}
        <div className="mt-6  mx-auto text-xl font-semibold leading-relaxed text-shadow-lg text-shadow-strong">
          <ReactMarkdown>{claim}</ReactMarkdown>
        </div>
   
      </div>
    
    </section>
  );
}