const express = require("express");
const db = require("../config/db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

function getRoutineWithExercises(routineId, userId) {
  const routine = db
    .prepare("SELECT * FROM routines WHERE id = ? AND user_id = ?")
    .get(routineId, userId);
  if (!routine) return null;

  const exercises = db
    .prepare(
      `SELECT re.id AS routine_exercise_id, re.position, re.sets, re.reps, re.rest_seconds, re.notes,
              e.id AS exercise_id, e.name, e.body_category, e.target_muscle, e.equipment, e.image_url
       FROM routine_exercises re
       JOIN exercises e ON e.id = re.exercise_id
       WHERE re.routine_id = ?
       ORDER BY re.position ASC`
    )
    .all(routineId);

  return { ...routine, exercises };
}

router.get("/", (req, res) => {
  const routines = db
    .prepare("SELECT * FROM routines WHERE user_id = ? ORDER BY updated_at DESC")
    .all(req.user.id);
  res.json(routines);
});

router.get("/:id", (req, res) => {
  const routine = getRoutineWithExercises(req.params.id, req.user.id);
  if (!routine) return res.status(404).json({ error: "Rutina no encontrada." });
  res.json(routine);
});

router.post("/", (req, res) => {
  const { name, description, exercises } = req.body;
  if (!name) return res.status(400).json({ error: "El nombre de la rutina es obligatorio." });

  function createRoutine() {
    db.exec("BEGIN");
    try {
      const info = db
        .prepare("INSERT INTO routines (user_id, name, description) VALUES (?, ?, ?)")
        .run(req.user.id, name, description || null);

      const routineId = info.lastInsertRowid;

      if (Array.isArray(exercises)) {
        const insertEx = db.prepare(
          `INSERT INTO routine_exercises (routine_id, exercise_id, position, sets, reps, rest_seconds, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        );
        exercises.forEach((ex, index) => {
          insertEx.run(
            routineId,
            ex.exercise_id,
            ex.position ?? index + 1,
            ex.sets ?? 3,
            ex.reps ?? 12,
            ex.rest_seconds ?? 60,
            ex.notes ?? null
          );
        });
      }

      db.exec("COMMIT");
      return routineId;
    } catch (err) {
      db.exec("ROLLBACK");
      throw err;
    }
  }

  const routineId = createRoutine();
  res.status(201).json(getRoutineWithExercises(routineId, req.user.id));
});

router.put("/:id", (req, res) => {
  const existing = db
    .prepare("SELECT * FROM routines WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ error: "Rutina no encontrada." });

  const { name, description } = req.body;
  db.prepare("UPDATE routines SET name = ?, description = ? WHERE id = ?").run(
    name ?? existing.name,
    description ?? existing.description,
    req.params.id
  );

  res.json(getRoutineWithExercises(req.params.id, req.user.id));
});

router.delete("/:id", (req, res) => {
  const existing = db
    .prepare("SELECT id FROM routines WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);
  if (!existing) return res.status(404).json({ error: "Rutina no encontrada." });

  db.prepare("DELETE FROM routines WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

router.post("/:id/exercises", (req, res) => {
  const routine = db
    .prepare("SELECT id FROM routines WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);
  if (!routine) return res.status(404).json({ error: "Rutina no encontrada." });

  const { exercise_id, sets, reps, rest_seconds, notes } = req.body;
  if (!exercise_id) return res.status(400).json({ error: "exercise_id es obligatorio." });

  const lastPosition = db
    .prepare("SELECT COALESCE(MAX(position), 0) AS max FROM routine_exercises WHERE routine_id = ?")
    .get(req.params.id).max;

  db.prepare(
    `INSERT INTO routine_exercises (routine_id, exercise_id, position, sets, reps, rest_seconds, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(req.params.id, exercise_id, lastPosition + 1, sets ?? 3, reps ?? 12, rest_seconds ?? 60, notes ?? null);

  res.status(201).json(getRoutineWithExercises(req.params.id, req.user.id));
});

// PUT /api/routines/:id/exercises/:routineExerciseId
// Edita sets/reps/descanso de un ejercicio YA agregado a la rutina, sin quitarlo y volver a agregarlo.
router.put("/:id/exercises/:routineExerciseId", (req, res) => {
  const routine = db
    .prepare("SELECT id FROM routines WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);
  if (!routine) return res.status(404).json({ error: "Rutina no encontrada." });

  const existing = db
    .prepare("SELECT * FROM routine_exercises WHERE id = ? AND routine_id = ?")
    .get(req.params.routineExerciseId, req.params.id);
  if (!existing) return res.status(404).json({ error: "Ese ejercicio no está en la rutina." });

  const sets = req.body.sets ?? existing.sets;
  const reps = req.body.reps ?? existing.reps;
  const restSeconds = req.body.rest_seconds ?? existing.rest_seconds;

  if (sets < 1 || sets > 20) return res.status(400).json({ error: "Las series deben estar entre 1 y 20." });
  if (reps < 1 || reps > 100) return res.status(400).json({ error: "Las repeticiones deben estar entre 1 y 100." });
  if (restSeconds < 0 || restSeconds > 600)
    return res.status(400).json({ error: "El descanso debe estar entre 0 y 600 segundos." });

  db.prepare("UPDATE routine_exercises SET sets = ?, reps = ?, rest_seconds = ? WHERE id = ?").run(
    sets,
    reps,
    restSeconds,
    req.params.routineExerciseId
  );

  res.json(getRoutineWithExercises(req.params.id, req.user.id));
});

router.delete("/:id/exercises/:routineExerciseId", (req, res) => {
  const routine = db
    .prepare("SELECT id FROM routines WHERE id = ? AND user_id = ?")
    .get(req.params.id, req.user.id);
  if (!routine) return res.status(404).json({ error: "Rutina no encontrada." });

  db.prepare("DELETE FROM routine_exercises WHERE id = ? AND routine_id = ?").run(
    req.params.routineExerciseId,
    req.params.id
  );

  res.json(getRoutineWithExercises(req.params.id, req.user.id));
});

module.exports = router;