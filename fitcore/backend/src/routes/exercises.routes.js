const express = require("express");
const db = require("../config/db");
const { optionalAuth, requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

function buildFilter(req) {
  const { category, muscle, equipment, search } = req.query;
  let where = "";
  const params = [];

  if (category) {
    where += " AND body_category = ?";
    params.push(category);
  }
  if (muscle) {
    where += " AND target_muscle = ?";
    params.push(muscle);
  }
  if (equipment) {
    where += " AND equipment = ?";
    params.push(equipment);
  }
  if (search) {
    where += " AND name LIKE ?";
    params.push(`%${search}%`);
  }

  return { where, params };
}

// GET /api/exercises?category=&muscle=&equipment=&search=&limit=&sort=
// Accesible para invitados (RF: catálogo en modo solo lectura)
router.get("/", optionalAuth, (req, res) => {
  const { where, params } = buildFilter(req);
  const sort = req.query.sort === "id" ? "id" : "name";

  let query = `SELECT * FROM exercises WHERE 1=1${where} ORDER BY ${sort} ASC`;
  const queryParams = [...params];

  const limit = Number.parseInt(req.query.limit, 10);
  if (Number.isInteger(limit) && limit > 0) {
    query += " LIMIT ?";
    queryParams.push(Math.min(limit, 200));
  }

  const exercises = db.prepare(query).all(...queryParams);
  res.json(exercises);
});

// GET /api/exercises/count -> total de ejercicios que cumplen los filtros
router.get("/count", (req, res) => {
  const { where, params } = buildFilter(req);
  const row = db
    .prepare(`SELECT COUNT(*) AS total FROM exercises WHERE 1=1${where}`)
    .get(...params);
  res.json({ total: row.total });
});

// GET /api/exercises/filters -> valores únicos para poblar los selects del filtro
router.get("/filters", (req, res) => {
  const categories = db.prepare("SELECT DISTINCT body_category FROM exercises ORDER BY body_category").all();
  const muscles = db.prepare("SELECT DISTINCT target_muscle FROM exercises ORDER BY target_muscle").all();
  const equipment = db.prepare("SELECT DISTINCT equipment FROM exercises ORDER BY equipment").all();

  res.json({
    categories: categories.map((r) => r.body_category),
    muscles: muscles.map((r) => r.target_muscle),
    equipment: equipment.map((r) => r.equipment),
  });
});

// GET /api/exercises/:id -> detalle (imagen, animación, instrucciones)
router.get("/:id", optionalAuth, (req, res) => {
  const exercise = db.prepare("SELECT * FROM exercises WHERE id = ?").get(req.params.id);
  if (!exercise) return res.status(404).json({ error: "Ejercicio no encontrado." });
  res.json(exercise);
});

// POST /api/exercises -> solo admin
router.post("/", requireAuth, requireAdmin, (req, res) => {
  const { name, body_category, target_muscle, equipment, difficulty, instructions, image_url, animation_url } = req.body;

  if (!name || !body_category || !target_muscle || !equipment || !instructions) {
    return res.status(400).json({ error: "Faltan campos obligatorios del ejercicio." });
  }

  const info = db
    .prepare(
      `INSERT INTO exercises (name, body_category, target_muscle, equipment, difficulty, instructions, image_url, animation_url, created_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      name,
      body_category,
      target_muscle,
      equipment,
      difficulty || "Intermedio",
      instructions,
      image_url || null,
      animation_url || null,
      req.user.id
    );

  const created = db.prepare("SELECT * FROM exercises WHERE id = ?").get(info.lastInsertRowid);
  res.status(201).json(created);
});

// PUT /api/exercises/:id -> solo admin
router.put("/:id", requireAuth, requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT * FROM exercises WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Ejercicio no encontrado." });

  const fields = { ...existing, ...req.body };

  db.prepare(
    `UPDATE exercises SET name = ?, body_category = ?, target_muscle = ?, equipment = ?,
     difficulty = ?, instructions = ?, image_url = ?, animation_url = ? WHERE id = ?`
  ).run(
    fields.name,
    fields.body_category,
    fields.target_muscle,
    fields.equipment,
    fields.difficulty,
    fields.instructions,
    fields.image_url,
    fields.animation_url,
    req.params.id
  );

  const updated = db.prepare("SELECT * FROM exercises WHERE id = ?").get(req.params.id);
  res.json(updated);
});

// DELETE /api/exercises/:id -> solo admin
router.delete("/:id", requireAuth, requireAdmin, (req, res) => {
  const existing = db.prepare("SELECT id FROM exercises WHERE id = ?").get(req.params.id);
  if (!existing) return res.status(404).json({ error: "Ejercicio no encontrado." });

  db.prepare("DELETE FROM exercises WHERE id = ?").run(req.params.id);
  res.status(204).send();
});

module.exports = router;
