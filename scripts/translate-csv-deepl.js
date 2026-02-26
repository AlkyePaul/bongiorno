import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración DeepL
const DEEPL_API_KEY = process.env.DEEPL_API_KEY;
if (!DEEPL_API_KEY) {
  console.error('❌ Missing DEEPL_API_KEY in .env');
  process.exit(1);
}

// === CONFIG ===
const INPUT_CSV = path.join(__dirname, '../es-translations.csv');
const OUTPUT_CSV = path.join(__dirname, '../de-translations.csv');
const FROM_LANG = 'es';
const TO_LANG = 'de';
const MAX_TEXTS_PER_REQUEST = 25; // Reducido para mayor estabilidad
const DELAY_BETWEEN_BATCHES = 2000; // Aumentado a 2 segundos
const MAX_TEXT_LENGTH = 4000; // Límite seguro para DeepL

// === HELPERS ===
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const color = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  blue: (s) => `\x1b[34m${s}\x1b[0m`,
};

// Función para detectar si un texto no debe traducirse
function shouldSkipTranslation(text) {
  const textLower = text.toLowerCase().trim();
  
  // No traducir si contiene:
  const skipPatterns = [
    // Correos electrónicos (más específico)
    /\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b/,
    // URLs
    /https?:\/\/[^\s]+/,
    /www\.[^\s]+/,
    // IPs
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
    // Códigos hexadecimales
    /^#[0-9A-Fa-f]{6}$/,
    // Prefijos técnicos muy específicos
    /^(id_|key_|ref_|code_|class_|data-)[a-zA-Z0-9_-]+$/,
    // Patrones de variables (ej: {{variable}})
    /\{\{[^}]+\}\}/,
    // Patrones de React/JSX (más específico)
    /\{[^a-zA-Záéíóúñüäöß][^}]*\}/,
    // Códigos alfanuméricos puros (solo letras y números, sin espacios) - pero excluir palabras comunes
    /^[a-zA-Z0-9]{3,}$/,
    // Solo números
    /^\d+$/,
    // Coordenadas geográficas (números decimales)
    /^-?\d+\.\d+$/,
    // Códigos de producto/identificadores con guiones (más específico)
    /^[A-Z0-9]{2,}-[A-Z0-9]{2,}$/,
  ];
  
  // Lista de palabras comunes que NO deben considerarse técnicas
  const commonWords = [
    'inicio', 'servicios', 'destinos', 'descubre', 'contactos', 'noticias', 'mundo', 
    'argelia', 'marruecos', 'mauritanie', 'ciudad', 'legal', 'privacidad', 'nombre', 
    'mensaje', 'enviar', 'paquete', 'truck', 'cog', 'shieldcheck', 'home', 'nav', 
    'footer', 'contact', 'form', 'title', 'email', 'phone', 'submit', 'links'
  ];
  
  // Si es una palabra común, permitir traducción
  if (commonWords.includes(textLower)) {
    return false;
  }
  
  // Verificar si coincide con algún patrón que debe saltarse
  for (const pattern of skipPatterns) {
    if (pattern.test(textLower)) {
      return true;
    }
  }
  
  // No traducir si es un solo carácter no alfabético
  if (text.length === 1 && !/[a-zA-Záéíóúñüäöß]/.test(text)) {
    return true;
  }
  
  // No traducir si contiene más números que letras Y es corto (probablemente un código)
  const letters = (text.match(/[a-zA-Záéíóúñüäöß]/g) || []).length;
  const numbers = (text.match(/\d/g) || []).length;
  if (numbers > letters && text.length <= 10 && text.length > 2) {
    return true;
  }
  
  return false;
}

function parseCsvLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  
  while (i < line.length) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Comilla escapada dentro de comillas
        current += '"';
        i += 2;
      } else {
        // Inicio o fin de campo entre comillas
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Separador de campo (solo si no estamos dentro de comillas)
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Añadir el último campo
  result.push(current);
  return result;
}

function escapeCsvField(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function translateBatch(texts, fromLang, toLang) {
  const url = 'https://api-free.deepl.com/v2/translate';
  
  try {
    // Dividir textos largos si es necesario
    const processedTexts = texts.map(text => {
      if (text.length > MAX_TEXT_LENGTH) {
        console.log(color.yellow(`⚠️  Texto largo detectado (${text.length} chars), dividiendo...`));
        // Dividir en frases y tomar las primeras
        const sentences = text.split(/[.!?]+/);
        let truncated = '';
        for (const sentence of sentences) {
          if ((truncated + sentence + '.').length <= MAX_TEXT_LENGTH) {
            truncated += (sentence.trim() + '. ');
          } else {
            break;
          }
        }
        return truncated.trim() || text.substring(0, MAX_TEXT_LENGTH);
      }
      return text;
    });
    
    const response = await axios.post(url, new URLSearchParams({
      text: processedTexts,
      source_lang: fromLang.toUpperCase(),
      target_lang: toLang.toUpperCase(),
      preserve_formatting: '1',
      formality: 'default'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`
      },
      timeout: 30000 // 30 segundos timeout
    });

    return response.data.translations.map(t => t.text);
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error(color.red(`❌ Timeout en traducción (30s)`));
    } else {
      console.error(color.red(`❌ Error en traducción: ${error.response?.data?.message || error.message}`));
    }
    throw error;
  }
}

async function translateCsvWithDeepL() {
  try {
    console.log(color.blue('🚀 Iniciando traducción automática con DeepL...'));
    
    // Verificar archivo de entrada
    if (!fs.existsSync(INPUT_CSV)) {
      console.error(color.red(`❌ No se encuentra el archivo: ${INPUT_CSV}`));
      process.exit(1);
    }
    
    console.log(color.yellow('📖 Leyendo archivo CSV de entrada...'));
    const csvContent = fs.readFileSync(INPUT_CSV, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      console.error(color.red('❌ El archivo CSV está vacío o solo contiene encabezados'));
      process.exit(1);
    }
    
    // Procesar encabezado y datos
    const header = parseCsvLine(lines[0]);
    const data = [];
    let skippedCount = 0;
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const parsedLine = parseCsvLine(line);
      if (parsedLine.length >= 2) {
        const [key, value] = parsedLine;
        if (key && value !== undefined) {
          // Verificar si se debe saltar la traducción
          if (shouldSkipTranslation(value)) {
            console.log(color.yellow(`⏭️  Saltando: "${key}" -> "${value}" (contenido técnico)`));
            skippedCount++;
            data.push({ key, value, skip: true });
          } else {
            data.push({ key, value, skip: false });
          }
        }
      }
    }
    
    const toTranslate = data.filter(item => !item.skip);
    console.log(color.green(`✅ ${data.length} textos totales encontrados`));
    console.log(color.yellow(`⏭️  ${skippedCount} textos técnicos saltados`));
    console.log(color.blue(`🔄 ${toTranslate.length} textos para traducir`));
    
    if (toTranslate.length === 0) {
      console.log(color.yellow('⚠️  No hay textos para traducir. Generando archivo con solo los textos técnicos...'));
      
      // Generar archivo CSV con solo los textos que no se traducen
      let outputCsv = 'clave,texto_aleman\n';
      data.forEach(item => {
        outputCsv += `${escapeCsvField(item.key)},${escapeCsvField(item.value)}\n`;
      });
      
      fs.writeFileSync(OUTPUT_CSV, outputCsv, 'utf8');
      console.log(color.green(`📁 Archivo guardado en: ${OUTPUT_CSV}`));
      return;
    }
    
    // Traducir en lotes
    const translatedMap = new Map(); // Usar Map para mantener el orden
    let totalProcessed = 0;
    
    // Primero, añadir los textos que se saltan sin traducir
    data.filter(item => item.skip).forEach(item => {
      translatedMap.set(item.key, item.value);
    });
    
    // Procesar solo los textos que necesitan traducción
    const toTranslateBatches = [];
    for (let i = 0; i < toTranslate.length; i += MAX_TEXTS_PER_REQUEST) {
      toTranslateBatches.push(toTranslate.slice(i, i + MAX_TEXTS_PER_REQUEST));
    }
    
    for (let batchIndex = 0; batchIndex < toTranslateBatches.length; batchIndex++) {
      const batch = toTranslateBatches[batchIndex];
      const batchNumber = batchIndex + 1;
      const totalBatches = toTranslateBatches.length;
      
      console.log(color.yellow(`🔄 Procesando lote ${batchNumber}/${totalBatches} (${batch.length} textos)...`));
      
      try {
        const textsToTranslate = batch.map(item => item.value);
        const translatedTexts = await translateBatch(textsToTranslate, FROM_LANG, TO_LANG);
        
        // Guardar traducciones en el mapa
        batch.forEach((item, index) => {
          translatedMap.set(item.key, translatedTexts[index]);
        });
        
        totalProcessed += batch.length;
        console.log(color.green(`✅ Lote ${batchNumber} completado. Traducidos: ${totalProcessed}/${toTranslate.length}`));
        
        // Esperar entre lotes para no exceder límites de API
        if (batchIndex < toTranslateBatches.length - 1) {
          await sleep(DELAY_BETWEEN_BATCHES);
        }
        
      } catch (error) {
        console.error(color.red(`❌ Error procesando lote ${batchNumber}. Saltando al siguiente...`));
        // Añadir datos no traducidos para no perderlos
        batch.forEach(item => {
          translatedMap.set(item.key, `[ERROR: ${item.value}]`);
        });
        totalProcessed += batch.length;
      }
    }
    
    // Generar archivo CSV de salida manteniendo el orden original
    console.log(color.yellow('💾 Generando archivo CSV de salida...'));
    
    let outputCsv = 'clave,texto_aleman\n';
    data.forEach(item => {
      const translatedValue = translatedMap.get(item.key);
      outputCsv += `${escapeCsvField(item.key)},${escapeCsvField(translatedValue || '')}\n`;
    });
    
    fs.writeFileSync(OUTPUT_CSV, outputCsv, 'utf8');
    
    console.log(color.green('🎉 ¡Traducción completada!'));
    console.log(color.blue(`📊 Total de textos procesados: ${data.length}`));
    console.log(color.yellow(`⏭️  Textos técnicos no traducidos: ${skippedCount}`));
    console.log(color.green(`✅ Textos traducidos: ${totalProcessed}`));
    console.log(color.blue(`📁 Archivo guardado en: ${OUTPUT_CSV}`));
    console.log(color.yellow('\n💡 Ahora puedes usar el script csv-to-json.js para generar de.json'));
    
    // Estadísticas de errores
    const errorCount = Array.from(translatedMap.values()).filter(value => 
      value && typeof value === 'string' && value.startsWith('[ERROR:')
    ).length;
    if (errorCount > 0) {
      console.log(color.yellow(`⚠️  ${errorCount} textos no pudieron traducirse correctamente`));
    }
    
  } catch (error) {
    console.error(color.red('❌ Error durante el procesamiento:'), error.message);
    process.exit(1);
  }
}

// Ejecutar el script
translateCsvWithDeepL();

export { translateCsvWithDeepL, parseCsvLine, translateBatch };
