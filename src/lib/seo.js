// /src/lib/seo.js (JS)
import {routing} from '@/i18n/routing';

// Use a single canonical host (with www) consistent with sitemap
const BASE_DOMAIN = 'https://www.bongiornotrasporti.it';

// Helper: for default locale (it) no prefix, for others use "/{locale}"
const { defaultLocale } = routing;

function getLocalePrefix(locale) {
  if (locale === defaultLocale) return '';
  return `/${locale}`;
}

function normalizePath(p = '') { return p && !p.startsWith('/') ? `/${p}` : (p || ''); }

// Fill [param] placeholders
function fillParams(pattern, params = {}) {
  return pattern.replace(/\[([^\]]+)\]/g, (_, key) => {
    const val = params[key];
    return val == null ? '' : encodeURIComponent(String(val));
  });
}

// Given a route key (e.g. '/servizi' or '/news/[post]'), get localized slug for a locale
function resolveLocalizedPath(routeKey, locale, params = {}) {
  const map = routing.pathnames?.[routeKey];
  const pattern = map ? map[locale] : routeKey;
  return fillParams(pattern, params);
}

// Build absolute URL: domain + /{locale} + localized slug
export function buildUrl(locale, pathOrRouteKey = '', params = undefined) {
  // Decide if this looks like a route key present in routing.pathnames
  const hasRouteMapping = routing.pathnames?.[pathOrRouteKey];

  let slug;
  if (hasRouteMapping) {
    // Use the centralized i18n routing map (works for static and dynamic routes)
    slug = resolveLocalizedPath(pathOrRouteKey, locale, params || {});
  } else {
    // Fallback: treat pathOrRouteKey as a raw path, optionally filling params
    slug = params ? fillParams(pathOrRouteKey, params) : pathOrRouteKey;
  }

  const prefix = getLocalePrefix(locale);
  const normalized = normalizePath(slug);
  return `${BASE_DOMAIN}${prefix}${normalized}`;
}

// hreflang map for all locales
export function languageAlternates(pathOrRouteKey = '', params = undefined) {
  const langs = {};
  for (const l of routing.locales) {
    langs[l] = buildUrl(l, pathOrRouteKey, params);
  }
  return langs;
}

export function canonicalUrl(locale, pathOrRouteKey = '', params = undefined) {
  return buildUrl(locale, pathOrRouteKey, params);
}

// A small convenience for pages
export function buildMetadata({locale, route, params, title, description, image = '/og/default.jpg'}) {
  const canonical = canonicalUrl(locale, route, params);
  return {
    metadataBase: new URL(BASE_DOMAIN),
    title,
    description,
    alternates: {
      canonical,
      languages: languageAlternates(route, params),
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: 'Bongiorno Trasporti SRL',
      images: [image],
      locale
    },
    twitter: {card: 'summary_large_image', title, description, images: [image]}
  };
}

