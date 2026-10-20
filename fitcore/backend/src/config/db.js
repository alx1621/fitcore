const path = require("path");
const fs = require("fs");
require("dotenv").config();

// --- Selección de motor de base de datos ---
// Si hay LIBSQL_URL definida, usamos Turso (libSQL remoto, persistente y gratuito).
// Si no, caemos a un archivo SQLite local para desarrollo (node:sqlite, efímero y sin dependencias).
const isRemote = !!process.env.LIBSQL_URL;

const schemaPath = path.resolve(__dirname, "..", "..", "db", "schema.sql");
const schema = fs.readFileSync(schemaPath, "utf8");

let db;

if (isRemote) {
  const Database = require("libsql");
  db = new Database(process.env.LIBSQL_URL, {
    authToken: process.env.LIBSQL_AUTH_TOKEN,
  });
  console.log("[db] Conectado a Turso (libSQL remoto).");
} else {
  const { DatabaseSync } = require("node:sqlite");

  // En Render (sin Turso configurado) usar /tmp (efímero); en local, usar ./db/fitcore.db
  const isRender = process.env.RENDER === "true";
  const dbDir = isRender ? "/tmp" : path.resolve(__dirname, "..", "..", "db");
  const dbPath = process.env.DB_PATH || path.join(dbDir, "fitcore.db");

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  db = new DatabaseSync(dbPath);
  console.log(`[db] SQLite local: ${dbPath}`);
}

db.exec("PRAGMA foreign_keys = ON;");

// Aplica el esquema si las tablas todavía no existen (idempotente por los IF NOT EXISTS)
db.exec(schema);

// --- Compatibilidad de parámetros nombrados en libSQL remoto ---
// libsql-js (Turso/Hrana) no soporta parámetros nombrados (@x, :x, $x); solo posicionales.
// Envolvemos prepare() para convertir "? ... @name" en posicionales y reordenar el objeto.
function hasNamedParams(sql) {
  return /[@:$][A-Za-z_][A-Za-z0-9_]*/.test(sql);
}

function toPositional(sql, args) {
  const order = [];
  const rewritten = sql.replace(/[@:$]([A-Za-z_][A-Za-z0-9_]*)/g, (match, name) => {
    order.push(name);
    return "?";
  });
  const values = [];
  for (const name of order) {
    // libsql-js puede entregar las claves con o sin prefijo dependiendo del driver.
    if (Object.prototype.hasOwnProperty.call(args, name)) values.push(args[name]);
    else if (Object.prototype.hasOwnProperty.call(args, "@" + name)) values.push(args["@" + name]);
    else if (Object.prototype.hasOwnProperty.call(args, ":" + name)) values.push(args[":" + name]);
    else if (Object.prototype.hasOwnProperty.call(args, "$" + name)) values.push(args["$" + name]);
    else values.push(null);
  }
  return { sql: rewritten, values };
}

function normalizeArgs(sql, args) {
  // Caso: un solo objeto con parámetros nombrados
  if (args.length === 1 && args[0] && typeof args[0] === "object" && !Array.isArray(args[0]) && hasNamedParams(sql)) {
    const { sql: newSql, values } = toPositional(sql, args[0]);
    return { sql: newSql, args: values };
  }
  return { sql, args };
}

if (isRemote) {
  const originalPrepare = db.prepare.bind(db);
  db.prepare = (sql) => {
    const stmt = originalPrepare(sql);
    if (!hasNamedParams(sql)) return stmt;

    const wrap = (method) => (...a) => {
      const { sql: newSql, args } = normalizeArgs(sql, a);
      if (newSql === sql) return stmt[method](...a);
      return originalPrepare(newSql)[method](...args);
    };

    return {
      get: wrap("get"),
      all: wrap("all"),
      run: wrap("run"),
    };
  };
}

// --- Migración ligera: agrega columnas nuevas a bases de datos ya existentes ---
// Así no hace falta borrar la base cada vez que el esquema crece.
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
ensureColumn("users", "height", "REAL");
ensureColumn("users", "weight", "REAL");
ensureColumn("users", "body_type", "TEXT");
ensureColumn("users", "xp", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("users", "level", "INTEGER NOT NULL DEFAULT 1");
ensureColumn("users", "streak_days", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("users", "last_workout_timestamp", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("users", "workouts_completed", "INTEGER NOT NULL DEFAULT 0");
ensureColumn("routines", "is_generated", "INTEGER NOT NULL DEFAULT 0");

// Ejecuta una función de inserción masiva.
// Nota: libSQL remoto (Turso/Hrana) no soporta db.transaction() de forma fiable,
// así que ejecutamos la función directamente. Para lotes pequeños (~120 filas) es
// suficiente y evita el error "cannot rollback - no transaction is active".
function transaction(fn) {
  return (...args) => fn(...args);
}

module.exports = db;
module.exports.transaction = transaction;
