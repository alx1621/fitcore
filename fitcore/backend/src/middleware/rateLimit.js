const rateLimit = require("express-rate-limit");

// Máximo 8 intentos de login por IP cada 10 minutos.
// Evita ataques de fuerza bruta contra contraseñas sin afectar el uso normal.
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Demasiados intentos de inicio de sesión. Intenta de nuevo en unos minutos." },
});

module.exports = { loginLimiter };