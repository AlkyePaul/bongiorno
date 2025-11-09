// scripts/translate-mdx.js
import fs from 'fs-extra';
import path from 'path';
import glob from 'fast-glob';
import axios from 'axios';
import matter from 'gray-matter';
import 'dotenv/config';

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
if (!DEEPL_API_KEY) {
  console.error('❌ Missing DEEPL_API_KEY in .env');
  process.exit(1);
}

// === CONFIG ===
const TARGET_PATH = process.argv[2] || 'content/news/it';
const FROM_LANG = 'it';
const TO_LANGS = ['es', 'fr', 'en'];
const MAX_TEXTS_PER_REQUEST = 40;
const DELAY_BETWEEN_BATCHES = 1000;
const FRONTMATTER_FIELDS_TO_TRANSLATE = ['title', 'category', 'intro'];

// === HELPERS ===
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const color = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
};

async function translateBatch(texts, fromLang, toLang) {
  const url = 'https://api-free.deepl.com/v2/translate';
  try {
    const params = new URLSearchParams();
    texts.forEach((t) => params.append('text', t));
    params.append('target_lang', toLang.toUpperCase());
    params.append('source_lang', fromLang.toUpperCase());
    // Keep punctuation/markdown-ish characters intact as much as possible
    params.append('preserve_formatting', '1');

    const { data } = await axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      },
    });
    return data.translations.map((t) => t.text);
  } catch (err) {
    console.error(color.red('❌ DeepL Error:'), err.response?.data || err.message);
    return texts.map(() => '');
  }
}

// Replace markdown links with placeholders and collect texts to translate for link labels
function extractMarkdownLinks(line) {
  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;
  const links = [];
  let out = '';
  let lastIndex = 0;
  while ((match = linkRegex.exec(line)) !== null) {
    const [full, label, url] = match;
    const idx = links.length;
    out += line.slice(lastIndex, match.index) + `__LINK_${idx}__`;
    links.push({ label, url });
    lastIndex = match.index + full.length;
  }
  out += line.slice(lastIndex);
  return { masked: out, links };
}

function reinjectMarkdownLinks(line, translatedLinkLabels) {
  let out = line;
  translatedLinkLabels.forEach((label, idx) => {
    out = out.replace(`__LINK_${idx}__`, `[${label}](__URL_${idx}__)`);
  });
  // Now replace temporary URLs to prevent DeepL from touching them
  translatedLinkLabels.forEach((_, idx) => {
    out = out.replace(`(__URL_${idx}__)`, `(${PLACEHOLDER_URLS[idx]})`);
  });
  return out;
}

// We'll keep URLs in a side array per line during processing
const PLACEHOLDER_URLS = [];

function splitPrefixAndText(line) {
  // Capture leading markdown markers (#, -, *, >, digits.) and surrounding spaces
  const m = line.match(/^(\s*(?:#{1,6}\s+|>\s+|[-*+]\s+|\d+\.[\)\.]?\s+)*)?(.*)$/);
  const prefix = m?.[1] ?? '';
  const text = m?.[2] ?? '';
  return { prefix, text };
}

function isJsxOrHtml(line) {
  const trimmed = line.trim();
  return trimmed.startsWith('<') || trimmed.endsWith('/>');
}

function isFence(line) {
  return line.trim().startsWith('```');
}

// Parse MDX content into lines and collect translatable segments while preserving structure
function collectTranslatableSegments(content) {
  const lines = content.split(/\r?\n/);
  const segments = []; // array of { lineIndex, type: 'raw' | 'translate', original, prefix, links }
  let inCode = false;

  lines.forEach((line, i) => {
    if (isFence(line)) {
      inCode = !inCode;
      segments.push({ lineIndex: i, type: 'raw', original: line });
      return;
    }
    if (inCode || isJsxOrHtml(line) || line.trim() === '') {
      segments.push({ lineIndex: i, type: 'raw', original: line });
      return;
    }

    // Extract links to translate only the labels
    const { masked, links } = extractMarkdownLinks(line);
    // Store URLs aside to re-inject later
    PLACEHOLDER_URLS.length = 0;
    links.forEach((l) => PLACEHOLDER_URLS.push(l.url));

    const { prefix, text } = splitPrefixAndText(masked);

    segments.push({
      lineIndex: i,
      type: 'translate',
      original: line,
      prefix,
      text, // masked text to translate
      links,
    });
  });

  return { lines, segments };
}

function rebuildContentFromSegments(segments, translatedTexts, translatedLinkLabelsByLine) {
  const lines = [];
  let tIdx = 0;
  const groupedLinks = new Map();
  translatedLinkLabelsByLine.forEach((arr, lineIndex) => groupedLinks.set(lineIndex, arr));

  const maxLine = Math.max(...segments.map((s) => s.lineIndex), 0);
  for (let i = 0; i <= maxLine; i++) lines[i] = '';

  segments.forEach((seg) => {
    if (seg.type === 'raw') {
      lines[seg.lineIndex] = seg.original;
    } else {
      const tText = translatedTexts[tIdx++] || seg.text;
      const withLinks = reinjectMarkdownLinks(tText, groupedLinks.get(seg.lineIndex) || []);
      lines[seg.lineIndex] = `${seg.prefix}${withLinks}`;
    }
  });

  return lines.join('\n');
}

async function translateMdxBody(content, fromLang, toLang) {
  const { segments } = collectTranslatableSegments(content);

  // Prepare batch of texts (line segments) and link labels
  const texts = [];
  const linkLabelMap = new Map(); // lineIndex -> labels array
  segments.forEach((seg) => {
    if (seg.type === 'translate') {
      texts.push(seg.text);
      if (seg.links?.length) {
        linkLabelMap.set(seg.lineIndex, seg.links.map((l) => l.label));
      }
    }
  });

  // Translate main texts
  let translatedTexts = [];
  for (let i = 0; i < texts.length; i += MAX_TEXTS_PER_REQUEST) {
    const batch = texts.slice(i, i + MAX_TEXTS_PER_REQUEST);
    const batchRes = await translateBatch(batch, fromLang, toLang);
    translatedTexts = translatedTexts.concat(batchRes);
    await sleep(DELAY_BETWEEN_BATCHES);
  }

  // Translate link labels separately
  const translatedLinkLabelsByLine = new Map();
  for (const [lineIndex, labels] of linkLabelMap.entries()) {
    let translated = [];
    for (let i = 0; i < labels.length; i += MAX_TEXTS_PER_REQUEST) {
      const batch = labels.slice(i, i + MAX_TEXTS_PER_REQUEST);
      const res = await translateBatch(batch, fromLang, toLang);
      translated = translated.concat(res);
      await sleep(DELAY_BETWEEN_BATCHES);
    }
    translatedLinkLabelsByLine.set(lineIndex, translated);
  }

  return rebuildContentFromSegments(segments, translatedTexts, translatedLinkLabelsByLine);
}

async function translateFrontmatter(data, fromLang, toLang) {
  const fm = { ...data };
  const toTranslate = FRONTMATTER_FIELDS_TO_TRANSLATE.filter((k) => typeof fm[k] === 'string');
  if (toTranslate.length === 0) return fm;
  const texts = toTranslate.map((k) => fm[k]);

  let translated = [];
  for (let i = 0; i < texts.length; i += MAX_TEXTS_PER_REQUEST) {
    const batch = texts.slice(i, i + MAX_TEXTS_PER_REQUEST);
    const res = await translateBatch(batch, fromLang, toLang);
    translated = translated.concat(res);
    await sleep(DELAY_BETWEEN_BATCHES);
  }

  toTranslate.forEach((key, idx) => {
    fm[key] = translated[idx] || fm[key];
  });
  return fm;
}

function computeDestPath(filePath, fromLang, toLang) {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath);
  const parts = dir.split(path.sep);
  const LOCALES = ['it', 'es', 'fr', 'en'];

  // Prefer exact match of fromLang; otherwise replace the last locale-like segment
  let langIdx = -1;
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i] === fromLang) { langIdx = i; break; }
  }
  if (langIdx === -1) {
    for (let i = parts.length - 1; i >= 0; i--) {
      if (LOCALES.includes(parts[i])) { langIdx = i; break; }
    }
  }

  let destDir;
  if (langIdx !== -1) {
    const newParts = parts.slice();
    newParts[langIdx] = toLang;
    destDir = newParts.join(path.sep);
  } else {
    // Fallback: create sibling folder next to source dir named <toLang>
    destDir = path.join(path.dirname(dir), toLang);
  }
  return path.join(destDir, base);
}

async function translateMdxFile(filePath, fromLang, toLang) {
  const source = await fs.readFile(filePath, 'utf8');
  const parsed = matter(source);
  const { content, data } = parsed;

  const newFrontmatter = await translateFrontmatter(data, fromLang, toLang);
  const newBody = await translateMdxBody(content, fromLang, toLang);

  const destPath = computeDestPath(filePath, fromLang, toLang);
  await fs.ensureDir(path.dirname(destPath));

  const out = matter.stringify(newBody, newFrontmatter);
  await fs.writeFile(destPath, out, 'utf8');
  console.log(color.green(`✅ ${path.relative(process.cwd(), filePath)} → ${path.relative(process.cwd(), destPath)}`));
}

async function main() {
  console.log(color.yellow(`🌍 Translating MDX from '${FROM_LANG}' → ${TO_LANGS.join(', ')}`));

  const stats = await fs.stat(TARGET_PATH).catch(() => null);
  if (!stats) {
    console.error(color.red(`❌ Path not found: ${TARGET_PATH}`));
    process.exit(1);
  }

  let files = [];
  if (stats.isDirectory()) {
    files = await glob(`${TARGET_PATH}/**/*.mdx`);
  } else if (stats.isFile()) {
    files = [TARGET_PATH];
  }

  if (!files.length) {
    console.error(color.red(`❌ No .mdx files found inside ${TARGET_PATH}`));
    process.exit(1);
  }

  for (const filePath of files) {
    console.log(color.yellow(`\n📘 Processing: ${filePath}`));
    for (const toLang of TO_LANGS) {
      if (toLang === FROM_LANG) continue;
      const destCandidate = computeDestPath(filePath, FROM_LANG, toLang);
      if (await fs.pathExists(destCandidate)) {
        console.log(color.yellow(`⏩ Skipped: ${path.basename(destCandidate)} (already exists)`));
        continue;
      }
      await translateMdxFile(filePath, FROM_LANG, toLang);
      await sleep(2000);
    }
  }

  console.log(color.green('\n🎉 All MDX translations completed!'));
}

main();
