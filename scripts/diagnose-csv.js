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

function diagnoseCsv() {
  const esPath = path.join(__dirname, '../es-translations.csv');
  const dePath = path.join(__dirname, '../de-translations.csv');
  
  console.log('🔍 Analizando diferencias entre archivos CSV...\n');
  
  // Leer archivos
  const esContent = fs.readFileSync(esPath, 'utf8');
  const deContent = fs.readFileSync(dePath, 'utf8');
  
  const esLines = esContent.split('\n').filter(line => line.trim());
  const deLines = deContent.split('\n').filter(line => line.trim());
  
  // Extraer claves
  const esKeys = new Set();
  const deKeys = new Set();
  
  for (let i = 1; i < esLines.length; i++) { // Saltar encabezado
    const [key] = parseCsvLine(esLines[i]);
    if (key) esKeys.add(key);
  }
  
  for (let i = 1; i < deLines.length; i++) { // Saltar encabezado
    const [key] = parseCsvLine(deLines[i]);
    if (key) deKeys.add(key);
  }
  
  console.log(`📊 Estadísticas:`);
  console.log(`   Español: ${esKeys.size} claves`);
  console.log(`   Alemán: ${deKeys.size} claves`);
  
  // Encontrar diferencias
  const missingInDe = [...esKeys].filter(key => !deKeys.has(key));
  const extraInDe = [...deKeys].filter(key => !esKeys.has(key));
  
  console.log(`\n❌ Claves faltantes en alemán: ${missingInDe.length}`);
  if (missingInDe.length > 0 && missingInDe.length <= 10) {
    missingInDe.forEach(key => console.log(`   - ${key}`));
  } else if (missingInDe.length > 10) {
    missingInDe.slice(0, 10).forEach(key => console.log(`   - ${key}`));
    console.log(`   ... y ${missingInDe.length - 10} más`);
  }
  
  console.log(`\n➕ Claves extra en alemán: ${extraInDe.length}`);
  if (extraInDe.length > 0 && extraInDe.length <= 5) {
    extraInDe.forEach(key => console.log(`   - ${key}`));
  }
  
  // Verificar líneas vacías
  const emptyValues = [];
  for (let i = 1; i < deLines.length; i++) {
    const [key, value] = parseCsvLine(deLines[i]);
    if (key && (!value || value.trim() === '')) {
      emptyValues.push(key);
    }
  }
  
  console.log(`\n⚠️  Claves con valores vacíos en alemán: ${emptyValues.length}`);
  if (emptyValues.length > 0 && emptyValues.length <= 5) {
    emptyValues.forEach(key => console.log(`   - ${key}`));
  }
  
  return { missingInDe, extraInDe, emptyValues };
}

diagnoseCsv();
