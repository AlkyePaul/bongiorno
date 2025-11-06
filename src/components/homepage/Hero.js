import Image from "next/image";


export default function Hero({ title, subtitle, ctas, claim }) {
  return (
    <section className="relative bg-brand-petrol text-white px-6 py-24">
      {/* Imagen de fondo */}
      <div className="absolute inset-0">
        <Image
          src="/img/hero-bg.webp"
          fill
          alt="Trasporti"
          className="w-full h-full object-cover"
          priority
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
            <a
              key={i}
              href={cta.href}
              className={
                i === 0
                  ? "px-6 py-3 rounded-md bg-white w-fit text-brand-dark font-semibold shadow hover:bg-gray-100"
                  : "px-6 py-3 rounded-md bg-brand-navy w-fit text-white font-semibold shadow hover:bg-brand-dark"
              }
            >
              {cta.label}
            </a>
          ))}
        </div>

        {/* Parrafo introductorio */}
        <p className="mt-6  mx-auto text-lg font-semibold leading-relaxed">
          {claim}
        </p>
   
      </div>
    
    </section>
  );
}