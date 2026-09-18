const path = require("path");
const fs = require("fs");
const { DatabaseSync } = require("node:sqlite");
require("dotenv").config();

// En Render, usar /tmp (efímero); en local, usar ./db/fitcore.db
const isRender = process.env.RENDER === "true";
const dbDir = isRender ? "/tmp" : path.resolve(__dirname, "..", "..", "db");
const dbPath = process.env.DB_PATH || path.join(dbDir, "fitcore.db");
const schemaPath = path.resolve(__dirname, "..", "..", "db", "schema.sql");

// Asegurar que el directorio existe
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Abre (o crea) el archivo de base de datos usando el módulo SQLite nativo de Node.js
const db = new DatabaseSync(dbPath);
db.exec("PRAGMA foreign_keys = ON;");

// Aplica el esquema si las tablas todavía no existen (idempotente por los IF NOT EXISTS)
const schema = fs.readFileSync(schemaPath, "utf8");
db.exec(schema);

// --- Migración ligera: agrega columnas nuevas a bases de datos ya existentes ---
// Así no hace falta borrar fitcore.db cada vez que el esquema crece.
function ensureColumn(table, column, definition) {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all();
  const exists = columns.some((c) => c.name === column);
  if (!exists) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
    console.log(`[db] Columna agregada: ${table}.${column}`);
  }
}

ensureColumn("users", "reset_token_hash", "TEXT");
ensureColumn("users", "reset_token_expires", "TEXT");

module.exports = db;