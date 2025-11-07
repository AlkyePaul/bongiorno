"use client";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import {Link} from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function DestinationCards({ items }) {
  const locale = useLocale();
  return (
    <section className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-7xl mx-auto">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className="relative rounded-2xl overflow-hidden shadow-lg w-full sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-1.5rem)] lg:w-[220px] h-72 flex items-end hover:scale-105 transition-all duration-300"
            >
            {/* Background image */}
            <Image
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/50" />
            {/* Text content */}
            <div className="relative z-10 p-4 text-white">
              <h3 className="text-xl font-bold mb-2">{item.title}</h3>
              <div className="text-base"><ReactMarkdown>{item.text}</ReactMarkdown></div>
            </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
