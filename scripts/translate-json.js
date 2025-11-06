// scripts/translate-locales-from-it.js
import fs from "fs-extra";
import path from "path";
import axios from "axios";
import glob from "fast-glob";
import "dotenv/config";

const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
if (!DEEPL_API_KEY) {
  console.error("❌ Missing DEEPL_API_KEY in .env");
  process.exit(1);
}

// === CONFIG ===
const TARGET_PATH = process.argv[2] || "src/locales";
const FROM_LANG = "it"; // base language file
const TO_LANGS = ["es", "fr", "en"];
const MAX_TEXTS_PER_REQUEST = 40;
const DELAY_BETWEEN_BATCHES = 1000;

// === HELPERS ===
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const color = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
};

// === RECURSIVE FLATTEN ===
// Convert nested object {a:{b:"ciao"}} → {"a.b": "ciao"}
function flattenObject(obj, prefix = "", result = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
}

// === RECURSIVE UNFLATTEN ===
// Convert {"a.b":"hola"} → {a:{b:"hola"}}
function unflattenObject(flatObj) {
  const result = {};
  for (const [flatKey, value] of Object.entries(flatObj)) {
    const keys = flatKey.split(".");
    keys.reduce((acc, key, i) => {
      if (i === keys.length - 1) acc[key] = value;
      else acc[key] = acc[key] || {};
      return acc[key];
    }, result);
  }
  return result;
}

// === TRANSLATE BATCH ===
async function translateBatch(texts, fromLang, toLang) {
  const url = "https://api-free.deepl.com/v2/translate";

  try {
    const params = new URLSearchParams();
    texts.forEach((t) => params.append("text", t));
    params.append("target_lang", toLang.toUpperCase());
    params.append("source_lang", fromLang.toUpperCase());
    params.append("tag_handling", "xml");

    const { data } = await axios.post(url, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      },
    });

    return data.translations.map((t) => t.text);
  } catch (err) {
    console.error(color.red("❌ DeepL Error:"), err.response?.data || err.message);
    return texts.map(() => "");
  }
}

// === TRANSLATE JSON FILE (deep) ===
async function translateJsonFile(filePath, fromLang, toLang) {
  const fileData = await fs.readJson(filePath);

  // flatten nested objects
  const flat = flattenObject(fileData);
  const keys = Object.keys(flat);
  const values = Object.values(flat).map((v) => (typeof v === "string" ? v : JSON.stringify(v)));

  let translatedValues = [];
  for (let i = 0; i < values.length; i += MAX_TEXTS_PER_REQUEST) {
    const batch = values.slice(i, i + MAX_TEXTS_PER_REQUEST);
    const batchRes = await translateBatch(batch, fromLang, toLang);
    translatedValues = translatedValues.concat(batchRes);
    await sleep(DELAY_BETWEEN_BATCHES);
  }

  // rebuild nested structure
  const translatedFlat = {};
  keys.forEach((key, idx) => {
    translatedFlat[key] = translatedValues[idx] ?? "";
  });

  const translatedObj = unflattenObject(translatedFlat);

  const destPath = path.join(path.dirname(filePath), `${toLang}.json`);
  await fs.writeJson(destPath, translatedObj, { spaces: 2 });
  console.log(color.green(`✅ ${path.basename(filePath)} → ${path.basename(destPath)}`));
}

// === MAIN ===
async function main() {
  console.log(color.yellow(`🌍 Translating from '${FROM_LANG}' → ${TO_LANGS.join(", ")}`));

  const stats = await fs.stat(TARGET_PATH).catch(() => null);
  if (!stats) {
    console.error(color.red(`❌ Path not found: ${TARGET_PATH}`));
    process.exit(1);
  }

  let files = [];

  if (stats.isDirectory()) {
    files = await glob(`${TARGET_PATH}/**/${FROM_LANG}.json`);
  } else if (stats.isFile()) {
    files = [TARGET_PATH];
  }

  if (!files.length) {
    console.error(color.red(`❌ No ${FROM_LANG}.json found inside ${TARGET_PATH}`));
    process.exit(1);
  }

  for (const filePath of files) {
    console.log(color.yellow(`\n📘 Processing: ${filePath}`));
    for (const toLang of TO_LANGS) {
      if (toLang === FROM_LANG) continue;
      const destPath = filePath.replace(`${FROM_LANG}.json`, `${toLang}.json`);
      if (fs.existsSync(destPath)) {
        console.log(color.yellow(`⏩ Skipped: ${path.basename(destPath)} (already exists)`));
        continue;
      }
      await translateJsonFile(filePath, FROM_LANG, toLang);
      await sleep(2000);
    }
  }

  console.log(color.green("\n🎉 All translations completed!"));
}

main();
