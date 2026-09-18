require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const exerciseRoutes = require("./routes/exercises.routes");
const routineRoutes = require("./routes/routines.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", service: "fitcore-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/routines", routineRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

// Manejo centralizado de errores
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

// Auto-seed: si la tabla de ejercicios está vacía, ejecuta el seed
const exerciseCount = db.prepare("SELECT COUNT(*) as count FROM exercises").get();
if (exerciseCount.count === 0) {
  console.log("[seed] Tabla de ejercicios vacía, ejecutando seed...");
  try {
    require("../db/seed");
    console.log("[seed] Seed completado.");
  } catch (err) {
    console.error("[seed] Error al ejecutar seed:", err.message);
  }
}

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`FitCore backend escuchando en http://localhost:${PORT}`);
});
