import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/forgot-password", { email: email.trim().toLowerCase() });
      setMessage(data.message);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo procesar la solicitud.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <form className="form-card" onSubmit={handleSubmit} noValidate>
        <span className="eyebrow">Recuperar acceso</span>
        <h1 className="page-title" style={{ marginBottom: 24 }}>
          ¿Olvidaste tu contraseña?
        </h1>

        {sent ? (
          <p className="helper-text">{message}</p>
        ) : (
          <>
            <p className="helper-text" style={{ marginBottom: 18 }}>
              Escribe el correo con el que te registraste y te enviaremos un link para crear una nueva
              contraseña.
            </p>

            <div className="field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperación"}
            </button>
          </>
        )}

        <p className="helper-text" style={{ marginTop: 18, textAlign: "center" }}>
          <Link to="/login">Volver a iniciar sesión</Link>
        </p>
      </form>
    </div>
  );
}