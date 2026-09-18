const bcrypt = require("bcrypt");
const db = require("../src/config/db");

function seed() {
  const adminEmail = "admin@fitcore.com";
  const existingAdmin = db.prepare("SELECT id FROM users WHERE email = ?").get(adminEmail);

  let adminId;
  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync("Admin123!", 10);
    const info = db
      .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'admin')")
      .run("Administrador FitCore", adminEmail, passwordHash);
    adminId = info.lastInsertRowid;
    console.log(`Usuario admin creado -> email: ${adminEmail} / password: Admin123!`);
  } else {
    adminId = existingAdmin.id;
    console.log("Usuario admin ya existía, se omite creación.");
  }

const BASE_IMG = "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main";

  const newExercises = [
    // --- Ejercicios originales ---
    {
      name: "Press de banca",
      body_category: "Tren superior",
      target_muscle: "Pecho",
      equipment: "Barra",
      difficulty: "Intermedio",
      instructions:
        "Acuéstate en el banco con los pies firmes en el piso. Baja la barra de forma controlada hasta el pecho y empuja hacia arriba extendiendo los brazos sin bloquear los codos.",
      image_url: `${BASE_IMG}/images/0025-EIeI8Vf.jpg`,
      animation_url: `${BASE_IMG}/videos/0025-EIeI8Vf.gif`,
    },
    {
      name: "Sentadilla con barra",
      body_category: "Tren inferior",
      target_muscle: "Cuádriceps",
      equipment: "Barra",
      difficulty: "Intermedio",
      instructions:
        "Coloca la barra sobre los trapecios, separa los pies al ancho de hombros y desciende flexionando rodillas y cadera manteniendo la espalda recta. Sube empujando con los talones.",
      image_url: `${BASE_IMG}/images/0043-qXTaZnJ.jpg`,
      animation_url: `${BASE_IMG}/videos/0043-qXTaZnJ.gif`,
    },
    {
      name: "Peso muerto",
      body_category: "Tren inferior",
      target_muscle: "Espalda baja",
      equipment: "Barra",
      difficulty: "Avanzado",
      instructions:
        "Con la barra frente a las espinillas, flexiona la cadera manteniendo la espalda neutra, sujeta la barra y levántala extendiendo cadera y rodillas al mismo tiempo.",
      image_url: `${BASE_IMG}/images/0032-ila4NZS.jpg`,
      animation_url: `${BASE_IMG}/videos/0032-ila4NZS.gif`,
    },
    {
      name: "Dominadas",
      body_category: "Tren superior",
      target_muscle: "Espalda",
      equipment: "Peso corporal",
      difficulty: "Avanzado",
      instructions:
        "Cuelga de la barra con agarre prono un poco más ancho que los hombros. Sube el cuerpo hasta que la barbilla pase la barra y baja de forma controlada.",
      image_url: `${BASE_IMG}/images/0652-lBDjFxJ.jpg`,
      animation_url: `${BASE_IMG}/videos/0652-lBDjFxJ.gif`,
    },
    {
      name: "Plancha abdominal",
      body_category: "Core",
      target_muscle: "Abdomen",
      equipment: "Peso corporal",
      difficulty: "Principiante",
      instructions:
        "Apóyate en antebrazos y puntas de pies, mantén el cuerpo en línea recta desde la cabeza hasta los talones, contrayendo el abdomen durante todo el tiempo.",
      image_url: `${BASE_IMG}/images/3544-5VXmnV5.jpg`,
      animation_url: `${BASE_IMG}/videos/3544-5VXmnV5.gif`,
    },
    {
      name: "Curl de bíceps con mancuernas",
      body_category: "Tren superior",
      target_muscle: "Bíceps",
      equipment: "Mancuernas",
      difficulty: "Principiante",
      instructions:
        "De pie, con una mancuerna en cada mano y brazos extendidos, flexiona los codos llevando el peso hacia los hombros sin mover los brazos superiores.",
      image_url: `${BASE_IMG}/images/0294-NbVPDMW.jpg`,
      animation_url: `${BASE_IMG}/videos/0294-NbVPDMW.gif`,
    },
    {
      name: "Zancadas",
      body_category: "Tren inferior",
      target_muscle: "Glúteos",
      equipment: "Peso corporal",
      difficulty: "Principiante",
      instructions:
        "Da un paso largo hacia adelante y flexiona ambas rodillas hasta formar ángulos de 90 grados. Regresa a la posición inicial y alterna de pierna.",
      image_url: `${BASE_IMG}/images/1410-py1HSzx.jpg`,
      animation_url: `${BASE_IMG}/videos/1410-py1HSzx.gif`,
    },
    {
      name: "Remo con mancuerna",
      body_category: "Tren superior",
      target_muscle: "Espalda",
      equipment: "Mancuernas",
      difficulty: "Intermedio",
      instructions:
        "Apoya una rodilla y una mano en un banco, con la otra mano sujeta la mancuerna y jala hacia la cadera manteniendo el codo cerca del cuerpo.",
      image_url: `${BASE_IMG}/images/0990-DKBwJrL.jpg`,
      animation_url: `${BASE_IMG}/videos/0990-DKBwJrL.gif`,
    },
    {
      name: "Elevaciones de pantorrilla",
      body_category: "Tren inferior",
      target_muscle: "Pantorrillas",
      equipment: "Máquina",
      difficulty: "Principiante",
      instructions:
        "De pie en la máquina, con los hombros bajo las almohadillas, eleva los talones lo más alto posible y baja de forma controlada sin rebotar.",
      image_url: `${BASE_IMG}/images/1490-6HmFgmx.jpg`,
      animation_url: `${BASE_IMG}/videos/1490-6HmFgmx.gif`,
    },
    {
      name: "Burpees",
      body_category: "Cardio",
      target_muscle: "Cuerpo completo",
      equipment: "Peso corporal",
      difficulty: "Avanzado",
      instructions:
        "Desde de pie, baja a posición de plancha, realiza una flexión, regresa los pies hacia las manos y salta extendiendo los brazos hacia arriba.",
      image_url: `${BASE_IMG}/images/1160-dK9394r.jpg`,
      animation_url: `${BASE_IMG}/videos/1160-dK9394r.gif`,
    },

    // --- Ejercicios nuevos ---
    {
      name: "Press militar con barra",
      body_category: "Tren superior",
      target_muscle: "Hombros",
      equipment: "Barra",
      difficulty: "Intermedio",
      instructions:
        "De pie, con la barra a la altura de los hombros y agarre firme, empuja hacia arriba hasta extender los brazos por completo y baja de forma controlada.",
      image_url: `${BASE_IMG}/images/0086-ngPpyRS.jpg`,
      animation_url: `${BASE_IMG}/videos/0086-ngPpyRS.gif`,
    },
    {
      name: "Jalón al pecho en polea",
      body_category: "Tren superior",
      target_muscle: "Espalda",
      equipment: "Máquina",
      difficulty: "Principiante",
      instructions:
        "Sentado con las rodillas fijas bajo el soporte, jala la barra hacia el pecho manteniendo la espalda recta y regresa controlando el peso hasta extender los brazos.",
      image_url: `${BASE_IMG}/images/2330-LEprlgG.jpg`,
      animation_url: `${BASE_IMG}/videos/2330-LEprlgG.gif`,
    },
    {
      name: "Extensión de tríceps en polea",
      body_category: "Tren superior",
      target_muscle: "Tríceps",
      equipment: "Máquina",
      difficulty: "Principiante",
      instructions:
        "De pie frente a la polea alta, con los codos pegados al torso, extiende los antebrazos hacia abajo hasta estirar por completo y regresa sin mover los codos.",
      image_url: `${BASE_IMG}/images/0241-gAwDzB3.jpg`,
      animation_url: `${BASE_IMG}/videos/0241-gAwDzB3.gif`,
    },
    {
      name: "Prensa de piernas",
      body_category: "Tren inferior",
      target_muscle: "Cuádriceps",
      equipment: "Máquina",
      difficulty: "Intermedio",
      instructions:
        "Siéntate en la máquina con los pies al ancho de hombros sobre la plataforma, flexiona las rodillas hasta 90 grados y empuja sin bloquearlas por completo al extender.",
      image_url: `${BASE_IMG}/images/2287-V07qpXy.jpg`,
      animation_url: `${BASE_IMG}/videos/2287-V07qpXy.gif`,
    },
    {
      name: "Hip thrust",
      body_category: "Tren inferior",
      target_muscle: "Glúteos",
      equipment: "Barra",
      difficulty: "Intermedio",
      instructions:
        "Con la espalda alta apoyada en un banco y la barra sobre la cadera, empuja con los talones elevando la cadera hasta alinear el cuerpo, contrayendo los glúteos arriba.",
      image_url: `${BASE_IMG}/images/1409-qKBpF7I.jpg`,
      animation_url: `${BASE_IMG}/videos/1409-qKBpF7I.gif`,
    },
    {
      name: "Curl femoral en máquina",
      body_category: "Tren inferior",
      target_muscle: "Isquiotibiales",
      equipment: "Máquina",
      difficulty: "Principiante",
      instructions:
        "Acostado boca abajo en la máquina, flexiona las rodillas llevando el rodillo hacia los glúteos y baja de forma controlada sin despegar la cadera del asiento.",
      image_url: `${BASE_IMG}/images/0586-17lJ1kr.jpg`,
      animation_url: `${BASE_IMG}/videos/0586-17lJ1kr.gif`,
    },
    {
      name: "Elevaciones laterales con mancuernas",
      body_category: "Tren superior",
      target_muscle: "Hombros",
      equipment: "Mancuernas",
      difficulty: "Principiante",
      instructions:
        "De pie con una mancuerna en cada mano a los costados, eleva los brazos lateralmente hasta la altura de los hombros y baja de forma controlada.",
      image_url: `${BASE_IMG}/images/0334-DsgkuIt.jpg`,
      animation_url: `${BASE_IMG}/videos/0334-DsgkuIt.gif`,
    },
    {
      name: "Crunch abdominal",
      body_category: "Core",
      target_muscle: "Abdomen",
      equipment: "Peso corporal",
      difficulty: "Principiante",
      instructions:
        "Acostado boca arriba con rodillas flexionadas, contrae el abdomen elevando los hombros del suelo sin jalar el cuello, y baja controladamente.",
      image_url: `${BASE_IMG}/images/0972-tZkGYZ9.jpg`,
      animation_url: `${BASE_IMG}/videos/0972-tZkGYZ9.gif`,
    },
    {
      name: "Mountain climbers",
      body_category: "Cardio",
      target_muscle: "Cuerpo completo",
      equipment: "Peso corporal",
      difficulty: "Intermedio",
      instructions:
        "En posición de plancha alta, lleva alternadamente las rodillas hacia el pecho de forma rápida, manteniendo la cadera estable y el core contraído.",
      image_url: `${BASE_IMG}/images/0630-RJgzwny.jpg`,
      animation_url: `${BASE_IMG}/videos/0630-RJgzwny.gif`,
    },
    {
      name: "Saltos de cuerda",
      body_category: "Cardio",
      target_muscle: "Pantorrillas",
      equipment: "Peso corporal",
      difficulty: "Principiante",
      instructions:
        "Con la cuerda a la altura de los pies, salta con ambos pies al mismo tiempo girando la cuerda con las muñecas, manteniendo un ritmo constante.",
      image_url: `${BASE_IMG}/images/2612-e1e76I2.jpg`,
      animation_url: `${BASE_IMG}/videos/2612-e1e76I2.gif`,
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
    return;
  }

  db.exec("BEGIN");
  try {
    for (const row of toInsert) insert.run({ ...row, created_by: adminId });
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }

  console.log(`Se agregaron ${toInsert.length} ejercicios nuevos al catálogo.`);
}

seed();