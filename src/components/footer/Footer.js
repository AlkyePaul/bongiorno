"use client";
import { Mail, Phone, MapPin, Link as LinkIcon } from "lucide-react";
import {Link} from "@/i18n/navigation";
import { useTranslations } from "next-intl";


export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="bg-gray-950 text-white pt-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* 🔹 1. Legale */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t("legal.title")}</h3>
          <p className="text-gray-400 text-base leading-relaxed">
            © {new Date().getFullYear()} {t("legal.company")}<br />
            {t("legal.details")}
          </p>
        </div>

        {/* 🔹 2. Link utili */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <LinkIcon size={18} /> {t("links.title")}
          </h3>
          <ul className="space-y-2 text-gray-400 text-base">
            <li>
              <Link href="/destinazioni" className="hover:text-white transition">
                {t("links.destinations")}
              </Link>
            </li>
            <li>
              <Link href="/lavora-con-noi" className="hover:text-white transition">
                {t("links.workwithus")}
              </Link>
            </li>
            <li>
              <Link href="/chi-siamo" className="hover:text-white transition">
                {t("links.about")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white transition">
                {t("links.privacy")}
              </Link>
            </li>
            <li>
              <Link href="/contatti" className="hover:text-white transition">
                {t("links.contacts")}
              </Link>
            </li>
          </ul>
        </div>

        {/* 🔹 3. Contatti */}
        <div>
          <h3 className="text-xl font-semibold mb-4">{t("contact.title")}</h3>
          <ul className="space-y-4 text-gray-400 text-base">
            <li className="flex items-start gap-3">
              <Mail size={18} className="text-brand-accent mt-1" />
              <Link
                href="mailto:bongiorno@bongiornosrl.com"
                className="hover:text-white transition"
              >
                {t("contact.email")}
              </Link>
            </li>
            <li className="flex items-start gap-3">
              <Phone size={18} className="text-brand-accent mt-1" />
              <Link
                href="tel:+390331776334"
                className="hover:text-white transition"
              >
                {t("contact.phone")}
              </Link>
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={18} className="text-brand-accent mt-1" />
              <span>{t("contact.address")}</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 🔻 Bottom bar */}
      <div className="border-t border-white/10 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Bongiorno SRL — {t("rights")}
      </div>
      <div className=" pt-3 pb-6 text-center text-xs text-gray-500">
        Made by <a href="https://www.linkedin.com/in/paolo-confalonieri-digital" target="_blank" className="font-semibold" rel="noopener noreferrer">Paolo Confalonieri</a>
      </div>
    </footer>
  );
}
