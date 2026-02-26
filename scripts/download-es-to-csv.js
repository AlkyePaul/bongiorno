import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Script para descargar y convertir archivos es.json a CSV
 * Formato: clave,texto_español
 */

function flattenJson(obj, prefix = '') {
  let flattened = {};
  
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        // Si es un objeto anidado, recursivamente lo aplanamos
        Object.assign(flattened, flattenJson(obj[key], newKey));
      } else if (Array.isArray(obj[key])) {
        // Si es un array, procesamos cada elemento
        obj[key].forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            // Si el array contiene objetos, los aplanamos con índice
            Object.assign(flattened, flattenJson(item, `${newKey}[${index}]`));
          } else {
            // Si el array contiene valores simples, los guardamos con índice
            flattened[`${newKey}[${index}]`] = item;
          }
        });
      } else {
        // Si es un valor simple, lo guardamos
        flattened[newKey] = obj[key];
      }
    }
  }
  
  return flattened;
}

function jsonToCsv(flattenedData) {
  let csv = 'clave,texto_español\n';
  
  for (let key in flattenedData) {
    if (flattenedData.hasOwnProperty(key)) {
      const value = flattenedData[key];
      // Escapar comillas y comas en el valor
      const escapedValue = String(value).replace(/"/g, '""');
      csv += `"${key}","${escapedValue}"\n`;
    }
  }
  
  return csv;
}

function downloadAndConvert() {
  try {
    console.log('🚀 Iniciando conversión de es.json a CSV...');
    
    // Rutas de los archivos
    const mainEsPath = path.join(__dirname, '../src/locales/es.json');
    const extraEsPath = path.join(__dirname, '../src/locales/extra/es.json');
    const outputPath = path.join(__dirname, '../es-translations.csv');
    
    console.log('🔄 Procesando archivos es.json...');
    
    // Leer y procesar el archivo principal
    let mainData = {};
    if (fs.existsSync(mainEsPath)) {
      const mainContent = fs.readFileSync(mainEsPath, 'utf8');
      mainData = JSON.parse(mainContent);
      console.log('✅ Archivo principal es.json leído');
    } else {
      console.log('⚠️  Archivo principal es.json no encontrado');
    }
    
    // Leer y procesar el archivo extra
    let extraData = {};
    if (fs.existsSync(extraEsPath)) {
      const extraContent = fs.readFileSync(extraEsPath, 'utf8');
      extraData = JSON.parse(extraContent);
      console.log('✅ Archivo extra es.json leído');
    } else {
      console.log('⚠️  Archivo extra es.json no encontrado');
    }
    
    // Combinar ambos archivos (el extra sobrescribe las claves duplicadas)
    const combinedData = { ...mainData, ...extraData };
    
    // Aplanar el JSON
    const flattenedData = flattenJson(combinedData);
    
    // Convertir a CSV
    const csvContent = jsonToCsv(flattenedData);
    
    // Guardar el archivo CSV
    fs.writeFileSync(outputPath, csvContent, 'utf8');
    
    const totalKeys = Object.keys(flattenedData).length;
    console.log(`🎉 ¡Conversión completada!`);
    console.log(`📊 Total de claves procesadas: ${totalKeys}`);
    console.log(`📁 Archivo CSV guardado en: ${outputPath}`);
    console.log('\n📋 El CSV tiene el formato: clave,texto_español');
    console.log('💡 Puedes usar este archivo para traducir a otros idiomas');
    
  } catch (error) {
    console.error('❌ Error durante el procesamiento:', error.message);
    process.exit(1);
  }
}

// Ejecutar el script
console.log('🔍 Verificando ejecución del script...');
downloadAndConvert();

export { downloadAndConvert, flattenJson, jsonToCsv };
