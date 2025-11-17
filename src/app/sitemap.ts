
import { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";

// If you have dynamic posts/destinations from DB or FS:
// Fill these arrays dynamically later
const newsPosts: string[] = []; // e.g. ['come-scegliere-un-corriere', 'trasporti-2025'...]
const destinations: string[] = []; // e.g. ['torino', 'milano', 'roma'...]

const BASE_URL = "https://www.bongiornotrasporti.it";

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const lastmod = new Date().toISOString();

  const { locales, pathnames, defaultLocale } = routing;

  // 1️⃣ **STATIC PAGES**
  for (const route in pathnames) {
    const definition = pathnames[route];

    // Skip dynamic routes here (handled below)
    if (route.includes("[post]") || route.includes("[destination]")) continue;

    for (const locale of locales) {
      const localizedPath = definition[locale] || definition[defaultLocale];

      const url =
        locale === defaultLocale
          ? `${BASE_URL}${localizedPath}`
          : `${BASE_URL}/${locale}${localizedPath}`;

      // 🔥 Build all hreflangs
      const alternates: Record<string, string> = {};
      for (const alt of locales) {
        const altPath = definition[alt] || definition[defaultLocale];
        alternates[alt] =
          alt === defaultLocale
            ? `${BASE_URL}${altPath}`
            : `${BASE_URL}/${alt}${altPath}`;
      }

      entries.push({
        url,
        lastModified: lastmod,
        changeFrequency: "daily",
        priority: 0.8,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  // 2️⃣ **DYNAMIC NEWS POSTS**
  if (newsPosts.length > 0) {
    const newsRouting = pathnames["/news/[post]"];

    for (const slug of newsPosts) {
      for (const locale of locales) {
        const localizedPattern = newsRouting[locale];
        const localizedPath = localizedPattern.replace("[post]", slug);

        const url =
          locale === defaultLocale
            ? `${BASE_URL}${localizedPath}`
            : `${BASE_URL}/${locale}${localizedPath}`;

        // Hreflangs
        const alternates: Record<string, string> = {};
        for (const alt of locales) {
          const altPattern = newsRouting[alt];
          alternates[alt] =
            alt === defaultLocale
              ? `${BASE_URL}${altPattern.replace("[post]", slug)}`
              : `${BASE_URL}/${alt}${altPattern.replace("[post]", slug)}`;
        }

        entries.push({
          url,
          lastModified: lastmod,
          changeFrequency: "weekly",
          priority: 0.7,
          alternates: { languages: alternates },
        });
      }
    }
  }

  // 3️⃣ **DYNAMIC DESTINATIONS**
  if (destinations.length > 0) {
    const destRouting = pathnames["/destinazioni/[destination]"];

    for (const slug of destinations) {
      for (const locale of locales) {
        const localizedPattern = destRouting[locale];
        const localizedPath = localizedPattern.replace("[destination]", slug);

        const url =
          locale === defaultLocale
            ? `${BASE_URL}${localizedPath}`
            : `${BASE_URL}/${locale}${localizedPath}`;

        const alternates: Record<string, string> = {};
        for (const alt of locales) {
          const altPattern = destRouting[alt];
          alternates[alt] =
            alt === defaultLocale
              ? `${BASE_URL}${altPattern.replace("[destination]", slug)}`
              : `${BASE_URL}/${alt}${altPattern.replace("[destination]", slug)}`;
        }

        entries.push({
          url,
          lastModified: lastmod,
          changeFrequency: "monthly",
          priority: 0.6,
          alternates: { languages: alternates },
        });
      }
    }
  }

  return entries;
}
