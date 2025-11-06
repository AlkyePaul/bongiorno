import Image from "next/image";
export default function LogoGrid(grayscale, scale) {

  const logos = [
    { src: "/img/logos/aeo.webp", alt: "AEO" },
    { src: "/img/logos/wca.webp", alt: "WCA" },
    { src: "/img/logos/fedespedi.webp", alt: "Fedespedi" },
    { src: "/img/logos/iso9001.webp", alt: "ISO 9001:2015" },
    { src: "/img/logos/igln.webp", alt: "IGLN" }
  ];
    return (
 
 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 items-center justify-items-center mb-12">
          {logos.map((logo) => (
            <div
              key={logo.src}
              className={`relative w-32 h-16 md:w-40 md:h-20 transition ${scale ? "hover:scale-125" : ""}`}
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes="160px"
                className={`object-contain ${grayscale ? "grayscale hover:grayscale-0" : ""} ${scale ? "hover:scale-125" : ""}`}
              />
            </div>
          ))}
        </div>
    );}