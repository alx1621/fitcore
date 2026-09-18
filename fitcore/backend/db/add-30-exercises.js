// Script independiente para agregar 30 ejercicios nuevos al catálogo.
// Se puede correr las veces que quieras: compara por nombre y solo agrega los que falten.
//
// Uso (desde la carpeta backend/):
//   node db/add-30-exercises.js

const db = require("../src/config/db");

// Usamos al primer admin que exista como "creador" de estos ejercicios.
const admin = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
if (!admin) {
  console.error("No se encontró ningún usuario admin. Corre primero 'npm run seed'.");
  process.exit(1);
}

const BASE_IMG = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main";

function img(file) {
  return `${BASE_IMG}/images/${file}`;
}

function gif(file) {
  return `${BASE_IMG}/videos/${file}`;
}

const newExercises = [
  {
    name: "Press inclinado con mancuernas",
    body_category: "Tren superior",
    target_muscle: "Pecho",
    equipment: "Mancuernas",
    difficulty: "Intermedio",
    instructions:
      "Acuéstate en un banco inclinado a 30-45°, sujeta una mancuerna en cada mano a la altura del pecho y empuja hacia arriba hasta extender los brazos, sin bloquear los codos.",
    image_url: img("0314-ns0SIbU.jpg"),
    animation_url: gif("0314-ns0SIbU.gif"),
  },
  {
    name: "Aperturas con mancuernas",
    body_category: "Tren superior",
    target_muscle: "Pecho",
    equipment: "Mancuernas",
    difficulty: "Intermedio",
    instructions:
      "Acostado en un banco plano, con una mancuerna en cada mano y los brazos ligeramente flexionados, abre los brazos hacia los lados hasta sentir estiramiento en el pecho y regresa juntando las mancuernas arriba.",
    image_url: img("0308-yz9nUhF.jpg"),
    animation_url: gif("0308-yz9nUhF.gif"),
  },
  {
    name: "Fondos en paralelas",
    body_category: "Tren superior",
    target_muscle: "Tríceps",
    equipment: "Peso corporal",
    difficulty: "Avanzado",
    instructions:
      "Sujeta las barras paralelas con los brazos extendidos, baja el cuerpo flexionando los codos hasta 90° y empuja de vuelta arriba extendiendo los brazos por completo.",
    image_url: img("0009-PAgTVaK.jpg"),
    animation_url: gif("0009-PAgTVaK.gif"),
  },
  {
    name: "Curl martillo",
    body_category: "Tren superior",
    target_muscle: "Bíceps",
    equipment: "Mancuernas",
    difficulty: "Principiante",
    instructions:
      "De pie, sujeta una mancuerna en cada mano con agarre neutro (palmas mirándose), flexiona los codos llevando el peso hacia los hombros sin girar las muñecas.",
    image_url: img("0165-HPlPoQA.jpg"),
    animation_url: gif("0165-HPlPoQA.gif"),
  },
  {
    name: "Remo en máquina",
    body_category: "Tren superior",
    target_muscle: "Espalda",
    equipment: "Máquina",
    difficulty: "Principiante",
    instructions:
      "Siéntate en la máquina con el pecho apoyado, sujeta las asas y jala hacia atrás juntando los omóplatos, luego regresa de forma controlada.",
    image_url: img("0180-hvV79Si.jpg"),
    animation_url: gif("0180-hvV79Si.gif"),
  },
  {
    name: "Peso muerto rumano",
    body_category: "Tren inferior",
    target_muscle: "Isquiotibiales",
    equipment: "Barra",
    difficulty: "Intermedio",
    instructions:
      "Con la barra al frente y las rodillas ligeramente flexionadas, baja la barra deslizándola por las piernas manteniendo la espalda recta, hasta sentir el estiramiento en isquiotibiales, y sube extendiendo la cadera.",
    image_url: img("0085-wQ2c4XD.jpg"),
    animation_url: gif("0085-wQ2c4XD.gif"),
  },
  {
    name: "Sentadilla búlgara",
    body_category: "Tren inferior",
    target_muscle: "Cuádriceps",
    equipment: "Mancuernas",
    difficulty: "Avanzado",
    instructions:
      "Con el pie trasero apoyado sobre un banco y una mancuerna en cada mano, desciende flexionando la pierna delantera hasta 90° y sube empujando con el talón.",
    image_url: img("1410-py1HSzx.jpg"),
    animation_url: gif("1410-py1HSzx.gif"),
  },
  {
    name: "Puente de glúteos",
    body_category: "Tren inferior",
    target_muscle: "Glúteos",
    equipment: "Peso corporal",
    difficulty: "Principiante",
    instructions:
      "Acostado boca arriba con las rodillas flexionadas y pies apoyados, eleva la cadera contrayendo los glúteos hasta alinear el cuerpo, y baja de forma controlada.",
    image_url: img("1409-qKBpF7I.jpg"),
    animation_url: gif("1409-qKBpF7I.gif"),
  },
  {
    name: "Abducción de cadera en máquina",
    body_category: "Tren inferior",
    target_muscle: "Glúteos",
    equipment: "Máquina",
    difficulty: "Principiante",
    instructions:
      "Sentado en la máquina con las piernas dentro de las almohadillas, separa las piernas hacia afuera contra la resistencia y regresa de forma controlada.",
    image_url: img("0597-CHpahtl.jpg"),
    animation_url: gif("0597-CHpahtl.gif"),
  },
  {
    name: "Extensión de cuádriceps en máquina",
    body_category: "Tren inferior",
    target_muscle: "Cuádriceps",
    equipment: "Máquina",
    difficulty: "Principiante",
    instructions:
      "Sentado en la máquina con los tobillos bajo la almohadilla, extiende las piernas hasta que queden rectas y baja de forma controlada sin soltar el peso de golpe.",
    image_url: img("0585-my33uHU.jpg"),
    animation_url: gif("0585-my33uHU.gif"),
  },
  {
    name: "Peso muerto con mancuernas",
    body_category: "Tren inferior",
    target_muscle: "Espalda baja",
    equipment: "Mancuernas",
    difficulty: "Intermedio",
    instructions:
      "Con una mancuerna en cada mano frente a los muslos, flexiona la cadera manteniendo la espalda recta hasta que las mancuernas pasen las rodillas, y regresa extendiendo cadera y piernas.",
    image_url: img("0300-nUwVh7b.jpg"),
    animation_url: gif("0300-nUwVh7b.gif"),
  },
  {
    name: "Sentadilla goblet",
    body_category: "Tren inferior",
    target_muscle: "Cuádriceps",
    equipment: "Mancuernas",
    difficulty: "Principiante",
    instructions:
      "Sujeta una mancuerna verticalmente contra el pecho con ambas manos, desciende en sentadilla manteniendo el torso erguido y sube empujando con los talones.",
    image_url: img("1760-yn8yg1r.jpg"),
    animation_url: gif("1760-yn8yg1r.gif"),
  },
  {
    name: "Elevación de piernas colgado",
    body_category: "Core",
    target_muscle: "Abdomen",
    equipment: "Peso corporal",
    difficulty: "Avanzado",
    instructions:
      "Cuelga de una barra con los brazos extendidos, eleva las piernas rectas o flexionadas hasta la altura de la cadera contrayendo el abdomen, y baja de forma controlada.",
    image_url: img("0472-I3tsCnC.jpg"),
    animation_url: gif("0472-I3tsCnC.gif"),
  },
  {
    name: "Russian twist",
    body_category: "Core",
    target_muscle: "Abdomen",
    equipment: "Peso corporal",
    difficulty: "Intermedio",
    instructions:
      "Siéntate con las rodillas flexionadas y el torso ligeramente inclinado hacia atrás, gira el tronco llevando las manos de un lado al otro del cuerpo de forma controlada.",
    image_url: img("0687-XVDdcoj.jpg"),
    animation_url: gif("0687-XVDdcoj.gif"),
  },
  {
    name: "Plancha lateral",
    body_category: "Core",
    target_muscle: "Oblicuos",
    equipment: "Peso corporal",
    difficulty: "Intermedio",
    instructions:
      "Apóyate sobre un antebrazo y el borde del pie, mantén el cuerpo en línea recta de lado, sin dejar caer la cadera, sosteniendo la posición el tiempo indicado.",
    image_url: img("3544-5VXmnV5.jpg"),
    animation_url: gif("3544-5VXmnV5.gif"),
  },
  {
    name: "Rueda abdominal",
    body_category: "Core",
    target_muscle: "Abdomen",
    equipment: "Peso corporal",
    difficulty: "Avanzado",
    instructions:
      "De rodillas, sujeta la rueda con ambas manos y hazla rodar hacia adelante extendiendo el cuerpo, manteniendo el abdomen contraído, y regresa a la posición inicial.",
    image_url: img("0103-xnInPfE.jpg"),
    animation_url: gif("0103-xnInPfE.gif"),
  },
  {
    name: "Superman",
    body_category: "Core",
    target_muscle: "Espalda baja",
    equipment: "Peso corporal",
    difficulty: "Principiante",
    instructions:
      "Acostado boca abajo con brazos y piernas extendidos, eleva simultáneamente brazos, pecho y piernas del suelo, sostén un momento y baja de forma controlada.",
    image_url: img("0803-4GqRrAk.jpg"),
    animation_url: gif("0803-4GqRrAk.gif"),
  },
  {
    name: "Remo con barra",
    body_category: "Tren superior",
    target_muscle: "Espalda",
    equipment: "Barra",
    difficulty: "Intermedio",
    instructions:
      "Con el torso inclinado hacia adelante y la barra frente a las piernas, jala la barra hacia el abdomen manteniendo los codos cerca del cuerpo, y baja de forma controlada.",
    image_url: img("0027-eZyBC3j.jpg"),
    animation_url: gif("0027-eZyBC3j.gif"),
  },
  {
    name: "Face pull",
    body_category: "Tren superior",
    target_muscle: "Hombros",
    equipment: "Máquina",
    difficulty: "Intermedio",
    instructions:
      "En la polea alta con cuerda, jala hacia el rostro separando las manos y llevando los codos hacia atrás, enfocando el movimiento en la parte posterior del hombro.",
    image_url: img("0027-eZyBC3j.jpg"),
    animation_url: gif("0027-eZyBC3j.gif"),
  },
  {
    name: "Press Arnold",
    body_category: "Tren superior",
    target_muscle: "Hombros",
    equipment: "Mancuernas",
    difficulty: "Avanzado",
    instructions:
      "Comienza con las mancuernas frente a los hombros y palmas hacia ti, empuja hacia arriba mientras rotas las muñecas hasta que las palmas queden hacia adelante al extender los brazos.",
    image_url: img("2137-Xy4jlWA.jpg"),
    animation_url: gif("2137-Xy4jlWA.gif"),
  },
  {
    name: "Encogimientos de hombros",
    body_category: "Tren superior",
    target_muscle: "Trapecios",
    equipment: "Mancuernas",
    difficulty: "Principiante",
    instructions:
      "De pie con una mancuerna en cada mano a los costados, eleva los hombros hacia las orejas sin flexionar los codos, sostén un momento y baja de forma controlada.",
    image_url: img("0095-dG7tG5y.jpg"),
    animation_url: gif("0095-dG7tG5y.gif"),
  },
  {
    name: "Fondos de tríceps en banco",
    body_category: "Tren superior",
    target_muscle: "Tríceps",
    equipment: "Peso corporal",
    difficulty: "Intermedio",
    instructions:
      "Con las manos apoyadas en el borde de un banco detrás de ti y los pies al frente, baja el cuerpo flexionando los codos y empuja de vuelta extendiendo los brazos.",
    image_url: img("0815-7aVz15j.jpg"),
    animation_url: gif("0815-7aVz15j.gif"),
  },
  {
    name: "Patada de tríceps",
    body_category: "Tren superior",
    target_muscle: "Tríceps",
    equipment: "Mancuernas",
    difficulty: "Principiante",
    instructions:
      "Con el torso inclinado y el brazo superior pegado al cuerpo, extiende el antebrazo hacia atrás hasta que el brazo quede recto, y regresa de forma controlada.",
    image_url: img("0860-HEJ6DIX.jpg"),
    animation_url: gif("0860-HEJ6DIX.gif"),
  },
  {
    name: "Sentadilla sumo",
    body_category: "Tren inferior",
    target_muscle: "Aductores",
    equipment: "Mancuernas",
    difficulty: "Intermedio",
    instructions:
      "Con los pies bien separados y las puntas hacia afuera, sujeta una mancuerna con ambas manos frente a ti y desciende manteniendo la espalda recta y las rodillas alineadas con los pies.",
    image_url: img("3142-dzz6BiV.jpg"),
    animation_url: gif("3142-dzz6BiV.gif"),
  },
  {
    name: "Step up",
    body_category: "Tren inferior",
    target_muscle: "Cuádriceps",
    equipment: "Peso corporal",
    difficulty: "Principiante",
    instructions:
      "Sube a un banco o step con una pierna, empujando con el talón hasta quedar de pie arriba, y baja de forma controlada. Alterna de pierna.",
    image_url: img("1684-76vfTdU.jpg"),
    animation_url: gif("1684-76vfTdU.gif"),
  },
  {
    name: "Escaladores laterales",
    body_category: "Cardio",
    target_muscle: "Cuerpo completo",
    equipment: "Peso corporal",
    difficulty: "Intermedio",
    instructions:
      "En posición de plancha, lleva la rodilla hacia el codo del mismo lado de forma rápida y alterna, manteniendo la cadera estable durante todo el movimiento.",
    image_url: img("0630-RJgzwny.jpg"),
    animation_url: gif("0630-RJgzwny.gif"),
  },
  {
    name: "Sprint en cinta",
    body_category: "Cardio",
    target_muscle: "Cuerpo completo",
    equipment: "Máquina",
    difficulty: "Avanzado",
    instructions:
      "En la caminadora, alterna periodos cortos de carrera a máxima velocidad con periodos de caminata o trote suave para recuperar, repitiendo el ciclo.",
    image_url: img("3666-rjiM4L3.jpg"),
    animation_url: gif("3666-rjiM4L3.gif"),
  },
  {
    name: "Boxeo con sombra",
    body_category: "Cardio",
    target_muscle: "Cuerpo completo",
    equipment: "Peso corporal",
    difficulty: "Intermedio",
    instructions:
      "De pie en posición de guardia, lanza combinaciones de golpes al aire (jab, directo, gancho) manteniendo el movimiento constante de pies y core activo.",
    image_url: img("1160-dK9394r.jpg"),
    animation_url: gif("1160-dK9394r.gif"),
  },
  {
    name: "Jumping jacks",
    body_category: "Cardio",
    target_muscle: "Cuerpo completo",
    equipment: "Peso corporal",
    difficulty: "Principiante",
    instructions:
      "De pie con los pies juntos y brazos a los costados, salta abriendo piernas y brazos por encima de la cabeza al mismo tiempo, y regresa saltando a la posición inicial.",
    image_url: img("1160-dK9394r.jpg"),
    animation_url: gif("1160-dK9394r.gif"),
  },
  {
    name: "Escalador de escaleras",
    body_category: "Cardio",
    target_muscle: "Piernas",
    equipment: "Máquina",
    difficulty: "Intermedio",
    instructions:
      "En la máquina de escaleras, mantén un ritmo constante subiendo escalón por escalón con el torso erguido, sin apoyarte de más en las barandas.",
    image_url: img("3666-rjiM4L3.jpg"),
    animation_url: gif("3666-rjiM4L3.gif"),
  },
];

const insert = db.prepare(`
  INSERT INTO exercises (name, body_category, target_muscle, equipment, difficulty, instructions, image_url, animation_url, created_by)
  VALUES (@name, @body_category, @target_muscle, @equipment, @difficulty, @instructions, @image_url, @animation_url, @created_by)
`);

const existingNames = new Set(db.prepare("SELECT name FROM exercises").all().map((r) => r.name));
const toInsert = newExercises.filter((ex) => !existingNames.has(ex.name));

if (toInsert.length === 0) {
  console.log("No hay ejercicios nuevos que agregar (todos ya existen en el catálogo).");
  process.exit(0);
}

db.exec("BEGIN");
try {
  for (const row of toInsert) insert.run({ ...row, created_by: admin.id });
  db.exec("COMMIT");
} catch (err) {
  db.exec("ROLLBACK");
  throw err;
}

console.log(`Se agregaron ${toInsert.length} ejercicios nuevos al catálogo.`);