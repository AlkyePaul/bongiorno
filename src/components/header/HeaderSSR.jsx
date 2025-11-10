import Image from 'next/image';
import {Link} from '@/i18n/navigation';
import {getTranslations, getLocale} from 'next-intl/server';
import LanguageSwitcher from './LanguageSwitcher';
import MobileMenu from './MobileMenu';
import Dropdowns from './Dropdowns';
import StickyOnScroll from './StickyOnScroll';

export default async function HeaderSSR() {
  const locale = await getLocale();
  const tNav = await getTranslations({locale, namespace: 'nav'});
  const tCommon = await getTranslations({locale, namespace: 'common'});

  const destinations = [
    { href: '/destinazioni/tunisia', label: tNav('tunisia') },
    { href: '/destinazioni/algeria', label: tNav('algeria') },
    { href: '/destinazioni/marocco', label: tNav('marocco') },
    { href: '/destinazioni/libia', label: tNav('libia') },
    { href: '/destinazioni/mauritania', label: tNav('mauritania') },
    { href: '/destinazioni/mondo', label: tNav('mondo') },
  ];
  const scopri = [
    { href: '/news', label: tNav('news') },
    { href: '/chi-siamo', label: tNav('about') },
    { href: '/contatti', label: tNav('contacts') },
  ];
  const navLinks = [
    { href: '/', label: tNav('home') },
    { href: '/servizi', label: tNav('services') },
    { key: 'destinazioni', label: tNav('destinations'), array: destinations },
    { key: 'scopri', label: tNav('scopri'), array: scopri },
  ];
  const quoteLabel = tCommon('preventivo');

  return (
    <StickyOnScroll>
      <nav className="w-full max-w-[100vw] mx-auto px-6 flex items-center justify-between relative">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image src="/img/logo.webp" alt="Logo" width={70} height={70} priority />
        </Link>

        {/* CENTER LINKS */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            if (link.key === 'destinazioni' || link.key === 'scopri') {
              return (
                <Dropdowns key={link.key} label={link.label} items={link.array} />
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className="transition text-lg font-medium hover:text-brand-accent"
              >
                {link.label}
              </Link>
            );
          })}

          {/* RIGHT → CTA + Lang */}
          <Link href="/preventivi" className="btn-sm">
            {quoteLabel}
          </Link>

          <LanguageSwitcher />
        </div>

        {/* Mobile: language switcher + hamburger */}
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <MobileMenu navLinks={navLinks} quoteLabel={quoteLabel} />
        </div>
      </nav>
    </StickyOnScroll>
  );
}
