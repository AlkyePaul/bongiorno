// /src/i18n/routing.ts
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['it', 'es', 'en', 'fr'],
  defaultLocale: 'it',
  localePrefix: 'always',            // ← important for foldered URLs
  pathnames: {
    '/': { it: '/', es: '/', en: '/', fr: '/' },
    '/chi-siamo': { it: '/chi-siamo', es: '/quienes-somos', en: '/about', fr: '/a-propos' },
    '/servizi':   { it: '/servizi',   es: '/servicios',     en: '/services', fr: '/services' },
    '/contatti':  { it: '/contatti',  es: '/contacto',      en: '/contact',  fr: '/contact' },
    '/preventivi':{ it: '/preventivi',es: '/presupuestos',  en: '/estimates',fr: '/devis' },
    '/privacy':   { it: '/privacy',   es: '/privacidad',    en: '/privacy',  fr: '/confidentialite' },
    '/news':      { it: '/news',      es: '/noticias',      en: '/news',     fr: '/actualites' },
    '/news/[post]': {
      it: '/news/[post]',
      es: '/noticias/[post]',
      en: '/news/[post]',
      fr: '/actualites/[post]'
    },
    '/destinazioni/[destination]': {
      it: '/destinazioni/[destination]',
      es: '/destinos/[destination]',
      en: '/destinations/[destination]',
      fr: '/destinations/[destination]'
    }
  }
});
