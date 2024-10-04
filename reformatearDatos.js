const fs = require('fs');

// Leer el archivo datos.json
const rawData = fs.readFileSync('Basededatos.json', 'utf8');
const data = JSON.parse(rawData);

// Array para almacenar los datos reformateados
const newData = [];

for (let record of data) {
  // Obtener la clave y el valor del objeto actual
  const [key, value] = Object.entries(record)[0];

  // Dividir la clave y el valor por el separador ';'
  const keys = key.split(';');
  const values = value.split(';');

  // Verificar que tenemos el número correcto de elementos
  if (keys.length === values.length) {
    const newRecord = {};
    for (let i = 0; i < keys.length; i++) {
      // Eliminar espacios en blanco alrededor de las claves y valores
      const cleanedKey = keys[i].trim();
      const cleanedValue = values[i].trim();
      newRecord[cleanedKey] = cleanedValue;
    }
    newData.push(newRecord);
  } else {
    console.warn(`El registro tiene un número inconsistente de claves y valores: ${JSON.stringify(record)}`);
  }
}

// Escribir los datos reformateados en un nuevo archivo
fs.writeFileSync('datos_reformateados.json', JSON.stringify(newData, null, 2), 'utf8');

console.log('Datos reformateados y guardados en datos_reformateados.json');
