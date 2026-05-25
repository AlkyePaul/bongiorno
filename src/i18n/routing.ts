// /src/i18n/routing.ts
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['it', 'es', 'en', 'fr', 'ca'],
  defaultLocale: 'it',
  localePrefix: 'as-needed',            // Serve default locale at '/' without redirect
  pathnames: {
    '/': { it: '/', es: '/', en: '/', fr: '/', ca: '/' },
    '/chi-siamo': { it: '/chi-siamo', es: '/quienes-somos', en: '/about', fr: '/a-propos', ca: '/qui-som' },
    '/servizi':   { it: '/servizi',   es: '/servicios',     en: '/services', fr: '/services', ca: '/serveis' },
    '/contatti':  { it: '/contatti',  es: '/contacto',      en: '/contact',  fr: '/contact', ca: '/contactes' },
    '/preventivi':{ it: '/preventivi',es: '/presupuestos',  en: '/estimates',fr: '/devis', ca: '/pressupostos' },
    '/privacy':   { it: '/privacy',   es: '/privacidad',    en: '/privacy',  fr: '/confidentialite', ca: '/privadesa' },
    '/news':      { it: '/news',      es: '/noticias',      en: '/news',     fr: '/actualites', ca: '/noticies' },
        '/lavora':      { it: '/lavora',      es: '/trabajos',      en: '/jobs',     fr: '/travailler-avec-nous', ca: '/treballa-amb-nosaltres' },

    '/news/[post]': {
      it: '/news/[post]',
      es: '/noticias/[post]',
      en: '/news/[post]',
      fr: '/actualites/[post]',
      ca: '/noticies/[post]'
    },
    '/destinazioni/[destination]': {
      it: '/destinazioni/[destination]',
      es: '/destinos/[destination]',
      en: '/destinations/[destination]',
      fr: '/destinations/[destination]',
      ca: '/destinacions/[destination]'
    }
  }
});
