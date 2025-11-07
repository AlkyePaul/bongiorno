# News System - Multilingual Support

## Overview
The news system now supports sophisticated multilingual content management with automatic fallback and language availability indicators.

## Content Structure

### Directory Layout
```
content/news/
├── it/           # Italian articles (source of truth)
│   └── article-slug.mdx
├── es/           # Spanish translations
│   └── article-slug.mdx
├── en/           # English translations
│   └── article-slug.mdx
└── fr/           # French translations
    └── article-slug.mdx
```

**Important**: The `it/` (Italian) folder is the **source of truth**. All articles must exist in Italian first.

## How It Works

### 1. Article Discovery
- System scans `content/news/it/` to find all available articles
- For each article, checks which locales have translations
- Returns articles with metadata about language availability

### 2. Fallback Logic
- User visits `/es/news` but article only exists in Italian
- System shows the Italian version with a fallback notice
- Language badges show which translations are available

### 3. Language Indicators

#### On News List Page
- Compact badges (🇮🇹 IT, 🇪🇸 ES, 🇬🇧 EN, 🇫🇷 FR)
- Green = available, Gray = not available
- Highlighted = current language

#### On Article Page
- Compact badges in hero section below title
- Yellow warning banner if showing fallback (Italian) version
- Shows all available languages

## Adding a New Article

### Step 1: Create Italian Version (Required)
```
content/news/it/my-new-article.mdx
```

With frontmatter:
```yaml
---
title: "Il Mio Nuovo Articolo"
author: "Redazione"
date: "2025-11-07"
category: "Trasporti e Logistica"
intro: "Breve descrizione..."
image: "/img/my-article.webp"
---

Content here...
```

### Step 2: Add Translations (Optional)
Create the same file in other locale folders:
```
content/news/es/my-new-article.mdx
content/news/en/my-new-article.mdx
content/news/fr/my-new-article.mdx
```

**Note**: Slug (filename) must be identical across all locales.

### Step 3: Build
```bash
npm run build
```

The article will be:
- Listed in all locale news pages
- Show language availability badges
- Display fallback notice if translation missing

## Translation Keys

All locales now have these keys in `src/locales/{locale}.json`:

```json
{
  "news": {
    "hero": {
      "title": "...",
      "subtitle": "..."
    },
    "featured": {
      "readMore": "..."
    },
    "sidebar": {
      "title": "..."
    },
    "meta": {
      "title": "...",
      "description": "..."
    },
    "availableIn": "This article is available in:",
    "notAvailableIn": "Translation not yet available for:",
    "fallbackNotice": "...",
    "languages": {
      "it": "Italiano",
      "es": "Español",
      "en": "English",
      "fr": "Français"
    }
  }
}
```

## Utility Functions

### `getAllArticlesWithLocales(requestedLocale)`
Returns all articles with:
- Article metadata (title, date, author, etc.)
- `availableLocales`: array of locale codes where article exists
- `isFallback`: true if showing Italian version for missing translation
- `localeUsed`: which locale was actually read

### `getArticleWithLocales(slug, requestedLocale)`
Returns single article with:
- Full MDX content
- Metadata
- Available locales
- Fallback status

### `getArticleLocales(slug)`
Returns array of locale codes where the article exists.

## Components

### `<LanguageBadges />`
Shows language availability indicators.

**Props**:
- `availableLocales`: array of locale codes
- `currentLocale`: current language
- `variant`: 'compact' or 'banner'

**Usage**:
```jsx
<LanguageBadges 
  availableLocales={['it', 'es']} 
  currentLocale="en"
  variant="compact"
/>
```

## Example Workflow

1. **New article only in Italian**:
   - Create `content/news/it/brexit-impact.mdx`
   - Italian users see it normally
   - ES/EN/FR users see Italian version with fallback notice
   - Badges show: 🇮🇹 (green), others (gray)

2. **Add Spanish translation**:
   - Create `content/news/es/brexit-impact.mdx`
   - Spanish users now see Spanish version
   - Badges show: 🇮🇹 🇪🇸 (green), others (gray)

3. **Complete all translations**:
   - Add EN and FR versions
   - All users see content in their language
   - All badges green

## File Structure

```
src/
├── lib/
│   └── news-utils.js          # Article loading & locale detection
├── components/
│   └── news/
│       └── LanguageBadges.js  # Language indicators
├── app/
│   └── [locale]/
│       └── news/
│           ├── page.js         # News list page
│           └── [post]/
│               └── page.js     # Individual article page
└── locales/
    ├── it.json                 # Italian translations
    ├── es.json                 # Spanish translations
    ├── en.json                 # English translations
    └── fr.json                 # French translations
```

## Best Practices

1. **Always create Italian version first** - it's the source of truth
2. **Use consistent slugs** across all locales
3. **Keep frontmatter structure identical** across translations
4. **Translate title and intro** - they appear in article lists
5. **Images can be shared** - no need to translate image paths unless specific
6. **Test fallback** - check that untranslated articles show Italian version

## Testing

```bash
# Build to generate all static pages
npm run build

# Start production server
npm start

# Visit different locales:
http://localhost:3000/it/news       # Italian
http://localhost:3000/es/noticias   # Spanish  
http://localhost:3000/en/news       # English
http://localhost:3000/fr/actualites # French
```
