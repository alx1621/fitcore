import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const errors = {};
    if (!name.trim()) errors.name = "El nombre es obligatorio.";
    else if (name.trim().length < 2) errors.name = "El nombre es demasiado corto.";

    if (!email.trim()) errors.email = "El correo es obligatorio.";
    else if (!EMAIL_REGEX.test(email.trim())) errors.email = "Escribe un correo válido (ej: nombre@dominio.com).";

    if (!password) errors.password = "La contraseña es obligatoria.";
    else if (password.length < 6) errors.password = "Debe tener al menos 6 caracteres.";

    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await register(name.trim(), email.trim().toLowerCase(), password);
      navigate("/");
    } catch (err) {
      const data = err.response?.data;
      if (data?.fieldErrors) setFieldErrors(data.fieldErrors);
      setFormError(data?.error || "No se pudo crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <span className="eyebrow">Empieza a entrenar con orden</span>
        <h1 className="page-title" style={{ marginBottom: 24 }}>
          Crear cuenta
        </h1>

        <div className="field">
          <label htmlFor="name">Nombre completo</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={!!fieldErrors.name}
          />
          {fieldErrors.name && <span className="error-text" style={{ margin: 0 }}>{fieldErrors.name}</span>}
        </div>

        <div className="field">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!fieldErrors.email}
          />
          {fieldErrors.email && <span className="error-text" style={{ margin: 0 }}>{fieldErrors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Contraseña</label>
          <div className="password-field-wrapper">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={!!fieldErrors.password}
            />
            <button
              type="button"
              className="password-toggle-btn"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              tabIndex={-1}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          {fieldErrors.password ? (
            <span className="error-text" style={{ margin: 0 }}>{fieldErrors.password}</span>
          ) : (
            <span className="helper-text">Mínimo 6 caracteres.</span>
          )}
        </div>

        {formError && <p className="error-text">{formError}</p>}

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <p className="helper-text" style={{ marginTop: 18, textAlign: "center" }}>
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </form>
    </div>
  );
}