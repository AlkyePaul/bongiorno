import {Link} from "@/i18n/navigation";

export default function CTABanner({ t }) {
    return (
        <section className=" md:mx-20  rounded-lg lg:px-6 px-1 py-10 text-white bg-brand-navy">
            <div className="container mx-auto max-w-5xl flex flex-col lg:flex-row items-center justify-between gap-8">
                
                {/* Left side – text block */}
                <div className="flex-1 lg:basis-2/3 space-y-4">
                  <p className="text-xl font-semibold leading-relaxed">{t("cta_main")}</p>
                  <hr className="w-1/2 border-white/40" />  
                  <p className="text-md leading-relaxed">{t("claim")}</p>
                </div>
    
                {/* Right side – buttons */}
                <div className="flex-1 lg:basis-1/3 flex flex-col lg:flex-row items-center lg:items-end lg:justify-end gap-4 mt-8 lg:mt-0">
                  <Link
                    href="/contatti"
                    className="px-6 py-3 w-fit h-full rounded-md bg-brand-accent text-white font-medium hover:bg-brand-accent/90 transition"
                  >
                    {t("cta.ctacontatti")}
                  </Link>
                  <Link
                    href="/preventivi"

                    className="px-6 py-3 rounded-md bg-white w-fit h-full  text-brand-navy font-medium hover:bg-gray-200  transition"
                  >
                    {t("cta.quote")}
                  </Link>
                </div>
    
              </div>
            </section>
    )
}