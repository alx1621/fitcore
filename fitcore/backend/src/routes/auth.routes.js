const express = require("express");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/db");
const { loginLimiter } = require("../middleware/rateLimit");
const { requireAuth } = require("../middleware/auth");
const { sendWelcomeEmail, sendPasswordResetEmail } = require("../services/email");

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hora

function signToken(user) {
  return jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" }
  );
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// POST /api/auth/register
router.post("/register", (req, res) => {
  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  const fieldErrors = {};
  if (!name) fieldErrors.name = "El nombre es obligatorio.";
  else if (name.length < 2) fieldErrors.name = "El nombre es demasiado corto.";

  if (!email) fieldErrors.email = "El correo es obligatorio.";
  else if (!EMAIL_REGEX.test(email)) fieldErrors.email = "El formato de correo no es válido.";

  if (!password) fieldErrors.password = "La contraseña es obligatoria.";
  else if (password.length < 6) fieldErrors.password = "La contraseña debe tener al menos 6 caracteres.";

  if (Object.keys(fieldErrors).length > 0) {
    return res.status(400).json({ error: "Revisa los campos marcados.", fieldErrors });
  }

  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) {
    return res.status(409).json({
      error: "Ya existe una cuenta con ese correo.",
      fieldErrors: { email: "Ya existe una cuenta con ese correo." },
    });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, 'usuario')")
    .run(name, email, passwordHash);

  const user = { id: info.lastInsertRowid, name, email, role: "usuario" };
  const token = signToken(user);

  res.status(201).json({ token, user });

  sendWelcomeEmail(user);
});

// POST /api/auth/login (con límite de intentos)
router.post("/login", loginLimiter, (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const password = req.body.password || "";

  if (!email || !password) {
    return res.status(400).json({ error: "Correo y contraseña son obligatorios." });
  }

  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: "Correo o contraseña incorrectos." });
  }

  const user = { id: row.id, name: row.name, email: row.email, role: row.role };
  const token = signToken(user);

  res.json({ token, user });
});

// POST /api/auth/forgot-password
// Siempre responde igual, exista o no el correo, para no revelar qué correos están registrados.
router.post("/forgot-password", (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ error: "El correo es obligatorio." });
  }

  const genericResponse = {
    message: "Si el correo está registrado, te enviamos un link para restablecer tu contraseña.",
  };

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user) {
    return res.json(genericResponse); // No revelamos si el correo existe o no
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + RESET_TOKEN_TTL_MS).toISOString();

  db.prepare("UPDATE users SET reset_token_hash = ?, reset_token_expires = ? WHERE id = ?").run(
    tokenHash,
    expires,
    user.id
  );

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const resetUrl = `${frontendUrl}/restablecer-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

  sendPasswordResetEmail(user, resetUrl);

  res.json(genericResponse);
});

// POST /api/auth/reset-password
router.post("/reset-password", (req, res) => {
  const email = (req.body.email || "").trim().toLowerCase();
  const token = req.body.token || "";
  const newPassword = req.body.newPassword || "";

  if (!email || !token || !newPassword) {
    return res.status(400).json({ error: "Faltan datos para restablecer la contraseña." });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);
  if (!user || !user.reset_token_hash || !user.reset_token_expires) {
    return res.status(400).json({ error: "El link de recuperación no es válido o ya expiró." });
  }

  const isExpired = new Date(user.reset_token_expires).getTime() < Date.now();
  const tokenMatches = user.reset_token_hash === hashToken(token);

  if (isExpired || !tokenMatches) {
    return res.status(400).json({ error: "El link de recuperación no es válido o ya expiró." });
  }

  const passwordHash = bcrypt.hashSync(newPassword, 10);
  db.prepare(
    "UPDATE users SET password_hash = ?, reset_token_hash = NULL, reset_token_expires = NULL WHERE id = ?"
  ).run(passwordHash, user.id);

  res.json({ message: "Tu contraseña se actualizó correctamente. Ya puedes iniciar sesión." });
});

// DELETE /api/auth/me -> el usuario autenticado elimina su propia cuenta
// Las rutinas se borran solas por el ON DELETE CASCADE del esquema.
router.delete("/me", requireAuth, (req, res) => {
  db.prepare("DELETE FROM users WHERE id = ?").run(req.user.id);
  res.status(204).send();
});

module.exports = router;