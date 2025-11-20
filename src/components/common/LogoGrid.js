import Image from "next/image";
import { PDF_RINA } from "@/constants/constants";
import Link from "next/link";
export default function LogoGrid(grayscale, scale) {

  const logos = [
    { src: "/img/logos/aeo.jpg", alt: "AEO" },
    { src: "/img/logos/wcafirst.jpg", alt: "WCA First" },
    { src: "/img/logos/wcainter.jpg", alt: "WCA InterGlobal" },
    { src: "/img/logos/fede.jpg", alt: "Fedespedi"},
    { src: "/img/logos/rina.jpg", alt: "ISO 9001:2015", href: PDF_RINA },
  ];
    return (
 
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center mb-12">
          {logos.map((logo) => (
            <div
              key={logo.src}
              className={`shadow relative w-32 h-20 md:w-40 md:h-25 transition ${scale ? "" : "hover:scale-115"} bg-white p-4 rounded-lg border border-gray-200` }
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="180px"
                className={`object-contain ${grayscale ? "" : "grayscale hover:grayscale-0"} ${scale ? "" : "hover:scale-115"}`}
              />
              {logo.href && <Link href={logo.href} target="_blank" className="absolute inset-0" />}
            </div>
          ))}
        </div>
    );}