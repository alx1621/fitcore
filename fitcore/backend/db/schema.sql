-- =========================================================
-- FitCore - Esquema de Base de Datos (SQLite)
-- =========================================================

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id                    INTEGER PRIMARY KEY AUTOINCREMENT,
    name                  TEXT NOT NULL,
    email                 TEXT UNIQUE NOT NULL,
    password_hash         TEXT NOT NULL,
    role                  TEXT NOT NULL DEFAULT 'usuario' CHECK (role IN ('admin', 'usuario')),
    reset_token_hash      TEXT,
    reset_token_expires    TEXT,
    created_at            TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS exercises (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    name              TEXT NOT NULL,
    body_category     TEXT NOT NULL,
    target_muscle     TEXT NOT NULL,
    equipment         TEXT NOT NULL,
    difficulty        TEXT NOT NULL DEFAULT 'Intermedio' CHECK (difficulty IN ('Principiante','Intermedio','Avanzado')),
    instructions      TEXT NOT NULL,
    image_url         TEXT,
    animation_url     TEXT,
    created_by        INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_exercises_body_category ON exercises(body_category);
CREATE INDEX IF NOT EXISTS idx_exercises_target_muscle ON exercises(target_muscle);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment     ON exercises(equipment);
CREATE INDEX IF NOT EXISTS idx_exercises_name          ON exercises(name);

CREATE TABLE IF NOT EXISTS routines (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name        TEXT NOT NULL,
    description TEXT,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_routines_user_id ON routines(user_id);

CREATE TABLE IF NOT EXISTS routine_exercises (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    routine_id   INTEGER NOT NULL REFERENCES routines(id) ON DELETE CASCADE,
    exercise_id  INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    position     INTEGER NOT NULL DEFAULT 1,
    sets         INTEGER NOT NULL DEFAULT 3,
    reps         INTEGER NOT NULL DEFAULT 12,
    rest_seconds INTEGER NOT NULL DEFAULT 60,
    notes        TEXT
);

CREATE INDEX IF NOT EXISTS idx_routine_exercises_routine_id ON routine_exercises(routine_id);

CREATE TRIGGER IF NOT EXISTS trg_routines_updated_at
AFTER UPDATE ON routines
FOR EACH ROW
BEGIN
    UPDATE routines SET updated_at = datetime('now') WHERE id = OLD.id;
END;