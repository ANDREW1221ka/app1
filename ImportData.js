const admin = require('firebase-admin');
const fs = require('fs');
const serviceAccount = require('./clave/Clave.json');
const path = require('path');


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  const db = admin.firestore();
  
  async function importData() {
    try {
      // Leer los datos desde el archivo JSON utilizando __dirname
      const dataPath = path.join(__dirname, 'datos_reformateados.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  
      const collectionRef = db.collection('Direcciones');
  
      for (let record of data) {
        const contrato = record['CTO'];
        const direccion = record['D I R E C C I O N'];
        const nombreEdificio = record['NOMBRE EDIFICIO'];
  
        if (!contrato || contrato.trim() === "") {
          console.warn(`Registro con Contrato inválido o vacío: ${JSON.stringify(record)}`);
          continue;
        }
  
        const docRef = collectionRef.doc(contrato);
        await docRef.set({
          Contrato: contrato,
          Dirección: direccion,
          NombreEdificio: nombreEdificio
        });
        console.log(`Documento ${contrato} importado.`);
      }
  
      console.log('Importación completada.');
    } catch (error) {
      console.error('Error al importar datos:', error);
    }
  }
  
  importData();