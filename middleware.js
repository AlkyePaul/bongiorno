// middleware.js
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';

const locales = ['es', 'en', 'it', 'fr'];
const defaultLocale = 'it';

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed',
  localeDetection: true
});

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  // Skip for static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return;
  }

  // Let next-intl handle other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)'],
};