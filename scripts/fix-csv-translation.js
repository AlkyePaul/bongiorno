import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        current += '"';
        i += 2;
      } else {
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
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

function fixCsvTranslation() {
  console.log('🔧 Reparando archivo CSV de traducción...');
  
  const esPath = path.join(__dirname, '../es-translations.csv');
  const dePath = path.join(__dirname, '../de-translations.csv');
  
  // Leer archivos
  const esContent = fs.readFileSync(esPath, 'utf8');
  const deContent = fs.readFileSync(dePath, 'utf8');
  
  const esLines = esContent.split('\n').filter(line => line.trim());
  
  // Extraer datos del archivo alemán corrupto (está todo en la línea 2)
  const deCorruptLine = deContent.split('\n')[1];
  const deData = parseCsvLine(deCorruptLine);
  
  console.log(`📊 Encontrados ${deData.length} valores alemanes`);
  
  // Generar CSV correcto
  let outputCsv = 'clave,texto_aleman\n';
  
  for (let i = 1; i < esLines.length && i - 1 < deData.length; i++) {
    const [key] = parseCsvLine(esLines[i]);
    const germanValue = deData[i - 1];
    
    if (key) {
      outputCsv += `${escapeCsvField(key)},${escapeCsvField(germanValue)}\n`;
    }
  }
  
  // Guardar archivo corregido
  fs.writeFileSync(dePath, outputCsv, 'utf8');
  
  console.log('✅ Archivo CSV reparado correctamente');
  console.log(`📁 Guardado en: ${dePath}`);
}

fixCsvTranslation();
