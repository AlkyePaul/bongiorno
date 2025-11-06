import fs from "fs";
import path from "path";
import { extractBlocks } from "../src/lib/cleanContent.js"; // la tua funzione di pulizia

const WP_URL = "https://bongiornotrasporti.it/wp-json/wp/v2/pages";

async function fetchPage(n) {
  const res = await fetch(`${WP_URL}?per_page=1&page=${n}`);
  if (!res.ok) {
    console.log(`Stop: API returned ${res.status} at page ${n}`);
    return null;
  }
  const data = await res.json();
  return data.length ? data[0] : null;
}

async function exportAllPages() {
  const outDir = path.join(process.cwd(), "exported_pages");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

  let pageIndex = 1;
  while (true) {
    const page = await fetchPage(pageIndex);
    if (!page) break;

    const blocks = extractBlocks(page.content.rendered);

    const cleanJson = {
      id: page.id,
      slug: page.slug,
      title: page.title.rendered,
      date: page.date,
      excerpt: page.excerpt.rendered,
      blocks,
    };

    const filePath = path.join(outDir, `${page.slug || page.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(cleanJson, null, 2));
    console.log(`✅ Saved ${filePath}`);

    pageIndex++;
  }

  console.log("🎉 Export completed.");
}

exportAllPages();
