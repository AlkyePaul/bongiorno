/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL_IT || 'https://www.bongiornotrasporti.it',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  // Exclude API routes and internal pages
  exclude: ['/api/*', '/_next/*'],
  // Hreflang for localized paths (same domain with path prefixes)
  alternateRefs: [
    { href: 'https://www.bongiornotrasporti.it', hreflang: 'it' },
    { href: 'https://www.bongiornotrasporti.it/en', hreflang: 'en' },
    { href: 'https://www.bongiornotrasporti.it/fr', hreflang: 'fr' },
    { href: 'https://www.bongiornotrasporti.it/es', hreflang: 'es' },
    { href: 'https://www.bongiornotrasporti.it', hreflang: 'x-default' }
  ],
  // Optional: transform function to handle localized paths
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
}