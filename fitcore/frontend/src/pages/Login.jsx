import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const errors = {};
    if (!email.trim()) errors.email = "El correo es obligatorio.";
    else if (!EMAIL_REGEX.test(email.trim())) errors.email = "Escribe un correo válido.";

    if (!password) errors.password = "La contraseña es obligatoria.";

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
      await login(email.trim().toLowerCase(), password);
      navigate("/");
    } catch (err) {
      setFormError(err.response?.data?.error || "No se pudo iniciar sesión.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <span className="eyebrow">Bienvenido de nuevo</span>
        <h1 className="page-title" style={{ marginBottom: 24 }}>
          Iniciar sesión
        </h1>

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
          {fieldErrors.password && (
            <span className="error-text" style={{ margin: 0 }}>{fieldErrors.password}</span>
          )}
          <p className="helper-text" style={{ textAlign: "right", margin: 0 }}>
            <Link to="/olvide-password">¿Olvidaste tu contraseña?</Link>
          </p>
        </div>

        {formError && <p className="error-text">{formError}</p>}

        <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>

        <p className="helper-text" style={{ marginTop: 18, textAlign: "center" }}>
          ¿Aún no tienes cuenta? <Link to="/registro">Créala aquí</Link>
        </p>
      </form>
    </div>
  );
}