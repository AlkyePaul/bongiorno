import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import StickyOnScroll from "./StickyOnScroll";
import Dropdowns from "./Dropdowns";
import LanguageSwitcher from "./LanguageSwitcher";
import MobileMenu from "./MobileMenu";

/**
 * HeaderSSR
 * ----------
 * Server-rendered navigation header with client dropdowns and language switcher.
 * Translations and locale data resolved server-side for better SEO and hydration.
 */
export default async function HeaderSSR() {
  const locale = await getLocale();
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  // Define navigation structure
  const destinations = [
    { href: "/destinazioni/tunisia", label: tNav("tunisia") },
    { href: "/destinazioni/algeria", label: tNav("algeria") },
    { href: "/destinazioni/marocco", label: tNav("marocco") },
    { href: "/destinazioni/libia", label: tNav("libia") },
    { href: "/destinazioni/mauritania", label: tNav("mauritania") },
    { href: "/destinazioni/mondo", label: tNav("mondo") },
  ];

  const scopri = [
    { href: "/news", label: tNav("news") },
    { href: "/chi-siamo", label: tNav("about") },
    { href: "/contatti", label: tNav("contacts") },
  ];

  const navLinks = [
    { href: "/", label: tNav("home") },
    { href: "/servizi", label: tNav("services") },
    { key: "destinazioni", label: tNav("destinations"), array: destinations },
    { key: "scopri", label: tNav("scopri"), array: scopri },
  ];

  const quoteLabel = tCommon("preventivo");

  return (
    <>
      {/* Spacer to prevent content from sliding under fixed header */}
      <div className="h-[80px] md:h-[83px]" />

      <StickyOnScroll>
        <nav className="max-w-[100vw] mx-auto px-6 flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 md:max-w-[100px] max-h-[80px]">
            <Image
              src="/img/cut-logo-named.webp"
              alt="Logo Bongiorno"
              width={100}
              height={80}
              className="logo"
              priority
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) =>
              link.key ? (
                <Dropdowns
                  key={link.key}
                  label={link.label}
                  items={link.array}
                />
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="transition text-lg font-medium hover:text-brand-accent"
                >
                  {link.label}
                </Link>
              )
            )}

            {/* CTA + Language Switcher */}
            <Link href="/preventivi" className="btn-sm">
              {quoteLabel}
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Mobile section */}
          <div className="lg:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <MobileMenu navLinks={navLinks} quoteLabel={quoteLabel} />
          </div>
        </nav>
      </StickyOnScroll>
    </>
  );
}
