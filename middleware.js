// middleware.js
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

// Delegate to next-intl using the centralized routing map (pathnames + localePrefix)
export default createMiddleware(routing);

export const config = {
  matcher: [
    // exclude API, assets, and SEO endpoints from locale redirects
    '/((?!api|_next/static|_next/image|img|og|favicon|content|robots.txt|sitemap.xml|sitemap-\\d+\\.xml|server-sitemap\\.xml).*)'
  ],
};