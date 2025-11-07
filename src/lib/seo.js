// /src/lib/seo.js (JS)
import {routing} from '@/i18n/routing';

const BASE_DOMAIN = 'https://bongiornotrasporti.it';

// locale → "/it", "/es", ...
const PATH_PREFIX = routing.locales.reduce((acc, l) => ({...acc, [l]: `/${l}`}), {});

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
  // if caller passed a route key, resolve; if passed a raw path, use as-is
  const slug = params
    ? resolveLocalizedPath(pathOrRouteKey, locale, params)
    : pathOrRouteKey;

  const prefix = PATH_PREFIX[locale] || '';
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

module.exports = {
  BASE_DOMAIN,
  PATH_PREFIX,
  buildUrl,
  languageAlternates,
  canonicalUrl,
  buildMetadata,
};
