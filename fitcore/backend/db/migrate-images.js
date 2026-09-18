// Script para actualizar las URLs de imágenes en la base de datos existente.
// Reemplaza las URLs de Unsplash con las URLs del dataset de GitHub.
//
// Uso (desde la carpeta backend/):
//   node db/migrate-images.js

const db = require("../src/config/db");

const BASE_IMG = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main";

// Mapeo: nombre del ejercicio -> { image, gif }
const imageMap = {
  "Press de banca": { image: "images/0025-EIeI8Vf.jpg", gif: "videos/0025-EIeI8Vf.gif" },
  "Sentadilla con barra": { image: "images/0043-qXTaZnJ.jpg", gif: "videos/0043-qXTaZnJ.gif" },
  "Peso muerto": { image: "images/0032-ila4NZS.jpg", gif: "videos/0032-ila4NZS.gif" },
  "Dominadas": { image: "images/0652-lBDjFxJ.jpg", gif: "videos/0652-lBDjFxJ.gif" },
  "Plancha abdominal": { image: "images/3544-5VXmnV5.jpg", gif: "videos/3544-5VXmnV5.gif" },
  "Curl de bíceps con mancuernas": { image: "images/0294-NbVPDMW.jpg", gif: "videos/0294-NbVPDMW.gif" },
  "Zancadas": { image: "images/1410-py1HSzx.jpg", gif: "videos/1410-py1HSzx.gif" },
  "Remo con mancuerna": { image: "images/0990-DKBwJrL.jpg", gif: "videos/0990-DKBwJrL.gif" },
  "Elevaciones de pantorrilla": { image: "images/1490-6HmFgmx.jpg", gif: "videos/1490-6HmFgmx.gif" },
  "Burpees": { image: "images/1160-dK9394r.jpg", gif: "videos/1160-dK9394r.gif" },
  "Press militar con barra": { image: "images/0086-ngPpyRS.jpg", gif: "videos/0086-ngPpyRS.gif" },
  "Jalón al pecho en polea": { image: "images/2330-LEprlgG.jpg", gif: "videos/2330-LEprlgG.gif" },
  "Extensión de tríceps en polea": { image: "images/0241-gAwDzB3.jpg", gif: "videos/0241-gAwDzB3.gif" },
  "Prensa de piernas": { image: "images/2287-V07qpXy.jpg", gif: "videos/2287-V07qpXy.gif" },
  "Hip thrust": { image: "images/1409-qKBpF7I.jpg", gif: "videos/1409-qKBpF7I.gif" },
  "Curl femoral en máquina": { image: "images/0586-17lJ1kr.jpg", gif: "videos/0586-17lJ1kr.gif" },
  "Elevaciones laterales con mancuernas": { image: "images/0334-DsgkuIt.jpg", gif: "videos/0334-DsgkuIt.gif" },
  "Crunch abdominal": { image: "images/0972-tZkGYZ9.jpg", gif: "videos/0972-tZkGYZ9.gif" },
  "Mountain climbers": { image: "images/0630-RJgzwny.jpg", gif: "videos/0630-RJgzwny.gif" },
  "Saltos de cuerda": { image: "images/2612-e1e76I2.jpg", gif: "videos/2612-e1e76I2.gif" },
  "Press inclinado con mancuernas": { image: "images/0314-ns0SIbU.jpg", gif: "videos/0314-ns0SIbU.gif" },
  "Aperturas con mancuernas": { image: "images/0308-yz9nUhF.jpg", gif: "videos/0308-yz9nUhF.gif" },
  "Fondos en paralelas": { image: "images/0009-PAgTVaK.jpg", gif: "videos/0009-PAgTVaK.gif" },
  "Curl martillo": { image: "images/0165-HPlPoQA.jpg", gif: "videos/0165-HPlPoQA.gif" },
  "Remo en máquina": { image: "images/0180-hvV79Si.jpg", gif: "videos/0180-hvV79Si.gif" },
  "Peso muerto rumano": { image: "images/0085-wQ2c4XD.jpg", gif: "videos/0085-wQ2c4XD.gif" },
  "Sentadilla búlgara": { image: "images/1410-py1HSzx.jpg", gif: "videos/1410-py1HSzx.gif" },
  "Puente de glúteos": { image: "images/1409-qKBpF7I.jpg", gif: "videos/1409-qKBpF7I.gif" },
  "Abducción de cadera en máquina": { image: "images/0597-CHpahtl.jpg", gif: "videos/0597-CHpahtl.gif" },
  "Extensión de cuádriceps en máquina": { image: "images/0585-my33uHU.jpg", gif: "videos/0585-my33uHU.gif" },
  "Peso muerto con mancuernas": { image: "images/0300-nUwVh7b.jpg", gif: "videos/0300-nUwVh7b.gif" },
  "Sentadilla goblet": { image: "images/1760-yn8yg1r.jpg", gif: "videos/1760-yn8yg1r.gif" },
  "Elevación de piernas colgado": { image: "images/0472-I3tsCnC.jpg", gif: "videos/0472-I3tsCnC.gif" },
  "Russian twist": { image: "images/0687-XVDdcoj.jpg", gif: "videos/0687-XVDdcoj.gif" },
  "Plancha lateral": { image: "images/3544-5VXmnV5.jpg", gif: "videos/3544-5VXmnV5.gif" },
  "Rueda abdominal": { image: "images/0103-xnInPfE.jpg", gif: "videos/0103-xnInPfE.gif" },
  "Superman": { image: "images/0803-4GqRrAk.jpg", gif: "videos/0803-4GqRrAk.gif" },
  "Remo con barra": { image: "images/0027-eZyBC3j.jpg", gif: "videos/0027-eZyBC3j.gif" },
  "Face pull": { image: "images/0027-eZyBC3j.jpg", gif: "videos/0027-eZyBC3j.gif" },
  "Press Arnold": { image: "images/2137-Xy4jlWA.jpg", gif: "videos/2137-Xy4jlWA.gif" },
  "Encogimientos de hombros": { image: "images/0095-dG7tG5y.jpg", gif: "videos/0095-dG7tG5y.gif" },
  "Fondos de tríceps en banco": { image: "images/0815-7aVz15j.jpg", gif: "videos/0815-7aVz15j.gif" },
  "Patada de tríceps": { image: "images/0860-HEJ6DIX.jpg", gif: "videos/0860-HEJ6DIX.gif" },
  "Sentadilla sumo": { image: "images/3142-dzz6BiV.jpg", gif: "videos/3142-dzz6BiV.gif" },
  "Step up": { image: "images/1684-76vfTdU.jpg", gif: "videos/1684-76vfTdU.gif" },
  "Escaladores laterales": { image: "images/0630-RJgzwny.jpg", gif: "videos/0630-RJgzwny.gif" },
  "Sprint en cinta": { image: "images/3666-rjiM4L3.jpg", gif: "videos/3666-rjiM4L3.gif" },
  "Boxeo con sombra": { image: "images/1160-dK9394r.jpg", gif: "videos/1160-dK9394r.gif" },
  "Jumping jacks": { image: "images/1160-dK9394r.jpg", gif: "videos/1160-dK9394r.gif" },
  "Escalador de escaleras": { image: "images/3666-rjiM4L3.jpg", gif: "videos/3666-rjiM4L3.gif" },
};

const update = db.prepare(`
  UPDATE exercises SET image_url = ?, animation_url = ? WHERE name = ?
`);

const allExercises = db.prepare("SELECT id, name FROM exercises").all();
let updated = 0;
let skipped = 0;

db.exec("BEGIN");
try {
  for (const ex of allExercises) {
    const mapping = imageMap[ex.name];
    if (mapping) {
      const imageUrl = `${BASE_IMG}/${mapping.image}`;
      const gifUrl = `${BASE_IMG}/${mapping.gif}`;
      update.run(imageUrl, gifUrl, ex.name);
      updated++;
    } else {
      console.log(`Sin mapeo: "${ex.name}" (id: ${ex.id})`);
      skipped++;
    }
  }
  db.exec("COMMIT");
} catch (err) {
  db.exec("ROLLBACK");
  throw err;
}

console.log(`Migración completada: ${updated} ejercicios actualizados, ${skipped} sin mapeo.`);
