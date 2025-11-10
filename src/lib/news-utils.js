import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const LOCALES = ['it', 'es', 'en', 'fr'];

/**
 * Get all available locales for a specific article slug
 * @param {string} slug - Article slug (without .mdx extension)
 * @returns {string[]} - Array of locale codes where the article exists
 */
export function getArticleLocales(slug) {
  const availableLocales = [];
  
  for (const locale of LOCALES) {
    const articlePath = path.join(process.cwd(), 'content/news', locale, `${slug}.mdx`);
    if (fs.existsSync(articlePath)) {
      availableLocales.push(locale);
    }
  }
  
  return availableLocales;
}

/**
 * Get all articles with their metadata and available locales
 * Falls back to Italian if requested locale doesn't have the article
 * @param {string} requestedLocale - The locale to prefer for article content
 * @returns {Array} - Array of article objects with metadata and available locales
 */
export function getAllArticlesWithLocales(requestedLocale = 'it') {
  // Always read from IT as the source of truth for which articles exist
  const itDir = path.join(process.cwd(), 'content/news/it');
  
  if (!fs.existsSync(itDir)) {
    return [];
  }
  
  const files = fs.readdirSync(itDir).filter(file => file.endsWith('.mdx'));
  
  const articles = files.map(file => {
    const slug = file.replace(/\.mdx$/, '');
    const availableLocales = getArticleLocales(slug);
    
    // Try to read from requested locale, fallback to IT
    const hasRequestedLocale = availableLocales.includes(requestedLocale);
    const localeToRead = hasRequestedLocale ? requestedLocale : 'it';
    
    const articlePath = path.join(process.cwd(), 'content/news', localeToRead, `${slug}.mdx`);
    const source = fs.readFileSync(articlePath, 'utf8');
    const { data } = matter(source);
    
    return {
      slug,
      title: data.title || slug,
      author: data.author || 'Redazione',
      date: data.date || '—',
      category: data.category || 'Articolo',
      image: data.image || '/img/news-placeholder.webp',
      excerpt: data.intro || '',
      priority: typeof data.priority === 'string' ? data.priority.toLowerCase() : data.priority,
      availableLocales,
      isFallback: !hasRequestedLocale,
      localeUsed: localeToRead,
    };
  });
  
  // Sort by date descending
  articles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return articles;
}

/**
 * Get a single article with locale information
 * @param {string} slug - Article slug
 * @param {string} requestedLocale - Preferred locale
 * @returns {object|null} - Article object with content and metadata
 */
export function getArticleWithLocales(slug, requestedLocale = 'it') {
  const availableLocales = getArticleLocales(slug);
  
  if (availableLocales.length === 0) {
    return null;
  }
  
  const hasRequestedLocale = availableLocales.includes(requestedLocale);
  const localeToRead = hasRequestedLocale ? requestedLocale : 'it';
  
  const articlePath = path.join(process.cwd(), 'content/news', localeToRead, `${slug}.mdx`);
  const source = fs.readFileSync(articlePath, 'utf8');
  const { content, data } = matter(source);
  
  return {
    slug,
    content,
    data,
    priority: typeof data.priority === 'string' ? data.priority.toLowerCase() : data.priority,
    availableLocales,
    isFallback: !hasRequestedLocale,
    localeUsed: localeToRead,
  };
}
