/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.SITE_URL_IT || 'https://www.bongiornotrasporti.it',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  // Exclude API routes and internal pages
  exclude: ['/api/*', '/_next/*'],
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