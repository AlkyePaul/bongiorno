"use client";
import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";

export default function DestinationCards({ items }) {
  const locale = useLocale();
  return (
    <section className="container mx-auto px-4 py-12 lg:w-[120%]  relative lg:left-[-10%]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mx-auto">
        {items.map((item, idx) => (
          <Link
            key={idx}
            href={locale +"/destinazioni" + item.href}
            className="container relative rounded-2xl overflow-hidden shadow-lg h-64 flex items-end hover:scale-105 transition-all duration-300"
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
              <p className="text-sm">{item.text}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
