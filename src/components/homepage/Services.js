"use client"; 
import H2 from "../common/H2";
import { useMessages } from "next-intl";
import { Package, Truck, Landmark, ShieldCheck, Cog } from "lucide-react";
import {Link} from "@/i18n/navigation";
import { useLocale } from "next-intl";

export default function ServicesSection(props) {
  const messages = useMessages();
  const svc = messages?.home?.services || {};
  const locale = useLocale();

  const cta = messages?.ctaBanner.cta || {};

  const title = props?.title ?? svc?.title ?? "";
  const intro = props?.intro ?? (Array.isArray(svc?.intro) ? svc.intro : []);
  const items = props?.services ?? (Array.isArray(svc?.items) ? svc.items : []);


  const iconSet = [
    <Package key="i0" size={32} />,
    <Cog key="i1" size={32} />,
    <Truck key="i2" size={32} />,
    <ShieldCheck key="i3" size={32} />
  ];

  const services = items.map((s, i) => ({
    title: s?.title || "",
    text: s?.description || "",
    icon: iconSet[i % iconSet.length]
  }));

  return (
    <section className="container max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 ">
      {/* Left column */}
      <div>
        <H2>
          {title}
        </H2>
        <div className="text-gray-700 space-y-4 mb-6">
          {intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Link
          href="/servizi"
          className="inline-block bg-brand-navy text-white px-6 py-3 rounded-md font-semibold shadow hover:bg-brand-petrol"
        >
          {cta.ctaservizi}
        </Link>
      </div>

      {/* Right column: grid 2x2 */}
      <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, i) => (
          <div
            key={i}
            className="bg-white rounded-md shadow-md text-brand-dark p-6 hover:shadow-lg transition"
          >
            <div className="text-brand-accent mb-4">
              {service.icon}
            </div>
            <h3 className="font-bold text-lg  mb-2 ">
              {service.title}
            </h3>
            <p className=" text-sm leading-relaxed ">
              {service.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
