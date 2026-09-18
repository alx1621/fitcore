import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import api from "../services/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { email, token, newPassword: password });
      setDone(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo restablecer la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  if (!token || !email) {
    return (
      <div className="page">
        <div className="form-card">
          <p className="error-text">Este link de recuperación no es válido.</p>
          <p className="helper-text" style={{ textAlign: "center" }}>
            <Link to="/olvide-password">Solicitar uno nuevo</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <span className="eyebrow">Última pasada</span>
        <h1 className="page-title" style={{ marginBottom: 24 }}>
          Crea tu nueva contraseña
        </h1>

        {done ? (
          <p style={{ color: "var(--color-success)" }}>
            Tu contraseña se actualizó correctamente. Te llevamos al login...
          </p>
        ) : (
          <>
            <div className="field">
              <label htmlFor="password">Nueva contraseña</label>
              <div className="password-field-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              <span className="helper-text">Mínimo 6 caracteres.</span>
            </div>

            <div className="field">
              <label htmlFor="confirmPassword">Confirma la nueva contraseña</label>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar nueva contraseña"}
            </button>
          </>
        )}
      </form>
    </div>
  );
}