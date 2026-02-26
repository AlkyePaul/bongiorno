import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para convertir CSV a JSON (operación inversa)
 * Formato esperado: clave,texto_español
 */

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
        // Comilla escapada
        current += '"';
        i += 2;
      } else {
        // Inicio/fin de comillas
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // Separador de columna
      result.push(current);
      current = '';
      i++;
    } else {
      current += char;
      i++;
    }
  }
  
  // Añadir la última columna
  result.push(current);
  return result;
}

function reconstructJson(flatData) {
  const result = {};
  
  for (let key in flatData) {
    if (flatData.hasOwnProperty(key)) {
      const value = flatData[key];
      setNestedValue(result, key, value);
    }
  }
  
  return result;
}

function setNestedValue(obj, key, value) {
  const keys = key.split('.');
  let current = obj;
  
  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    
    // Verificar si es un array con índice (ej: "sections[0]")
    const arrayMatch = currentKey.match(/^(.+)\[(\d+)\]$/);
    
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      const arrayIndex = parseInt(index, 10);
      
      if (!current[arrayName]) {
        current[arrayName] = [];
      }
      
      // Si es el último nivel, asignar el valor
      if (i === keys.length - 1) {
        current[arrayName][arrayIndex] = value;
      } else {
        // Si no existe el objeto en esta posición, crearlo
        if (!current[arrayName][arrayIndex]) {
          current[arrayName][arrayIndex] = {};
        }
        current = current[arrayName][arrayIndex];
      }
    } else {
      // Si es el último nivel, asignar el valor
      if (i === keys.length - 1) {
        current[currentKey] = value;
      } else {
        // Si no existe el objeto en esta clave, crearlo
        if (!current[currentKey]) {
          current[currentKey] = {};
        }
        current = current[currentKey];
      }
    }
  }
}

function csvToJson() {
  try {
    console.log('🚀 Iniciando conversión de CSV a JSON...');
    
    // Rutas de los archivos
    const csvPath = path.join(__dirname, '../de-translations.csv');
    const outputPath = path.join(__dirname, '../src/locales/de.json');
    
    // Verificar si existe el archivo CSV
    if (!fs.existsSync(csvPath)) {
      console.error('❌ No se encuentra el archivo de-translations.csv');
      console.log('💡 Asegúrate de que el archivo CSV exista en la raíz del proyecto');
      process.exit(1);
    }
    
    console.log('🔄 Leyendo archivo CSV...');
    
    // Leer el archivo CSV
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    if (lines.length < 2) {
      console.error('❌ El archivo CSV está vacío o solo contiene encabezados');
      process.exit(1);
    }
    
    // Procesar líneas del CSV
    const flatData = {};
    let processedLines = 0;
    
    for (let i = 1; i < lines.length; i++) { // Empezar desde 1 para saltar encabezado
      const line = lines[i].trim();
      if (!line) continue;
      
      const [key, value] = parseCsvLine(line);
      
      if (key && value !== undefined) {
        // Convertir valores numéricos
        let processedValue = value;
        if (value === 'true') processedValue = true;
        else if (value === 'false') processedValue = false;
        else if (!isNaN(value) && value !== '') processedValue = Number(value);
        
        flatData[key] = processedValue;
        processedLines++;
      }
    }
    
    console.log(`✅ ${processedLines} líneas procesadas`);
    
    // Reconstruir la estructura JSON anidada
    console.log('🔧 Reconstruyendo estructura JSON...');
    const jsonData = reconstructJson(flatData);
    
    // Crear directorio si no existe
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Guardar el archivo JSON
    const jsonContent = JSON.stringify(jsonData, null, 2);
    fs.writeFileSync(outputPath, jsonContent, 'utf8');
    
    console.log('🎉 ¡Conversión completada!');
    console.log(`📊 Total de claves procesadas: ${processedLines}`);
    console.log(`📁 Archivo JSON guardado en: ${outputPath}`);
    console.log('\n📋 El archivo JSON está listo para ser usado en el proyecto');
    
  } catch (error) {
    console.error('❌ Error durante el procesamiento:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
console.log('🔍 Verificando ejecución del script...');
csvToJson();

export { csvToJson, parseCsvLine, reconstructJson, setNestedValue };
