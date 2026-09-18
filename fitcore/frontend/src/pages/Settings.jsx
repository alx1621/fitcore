import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const canConfirm = confirmText.trim().toUpperCase() === "ELIMINAR";

  async function handleDelete() {
    if (!canConfirm) return;
    setError("");
    setLoading(true);
    try {
      await deleteAccount();
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo eliminar la cuenta.");
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">Tu cuenta</span>
            <h1 className="page-title">Ajustes</h1>
          </div>
        </div>

        <div className="form-card form-card-wide" style={{ margin: "0 0 28px" }}>
          <h2 className="font-display" style={{ marginBottom: 18 }}>
            Información de la cuenta
          </h2>
          <div className="field">
            <label>Nombre</label>
            <input value={user?.name || ""} disabled />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Correo</label>
            <input value={user?.email || ""} disabled />
          </div>
        </div>

        <div
          className="form-card form-card-wide"
          style={{ margin: 0, borderColor: "rgba(217, 97, 79, 0.4)" }}
        >
          <h2 className="font-display" style={{ marginBottom: 8, color: "var(--color-danger)" }}>
            Eliminar mi cuenta                  
          </h2>
          <p className="helper-text" style={{ marginBottom: 18 }}>
            Al eliminar tu cuenta se borran también todas tus rutinas guardadas. Esta acción no se puede
            deshacer.
          </p>

          {!showConfirm ? (
            <button className="btn btn-danger" onClick={() => setShowConfirm(true)}>
              Eliminar mi cuenta
            </button>
          ) : (
            <div>
              <div className="field">
                <label htmlFor="confirmDelete">
                  Escribe <strong>ELIMINAR</strong> para confirmar
                </label>
                <input
                  id="confirmDelete"
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />
              </div>

              {error && <p className="error-text">{error}</p>}

              <div className="top-bar-actions">
                <button className="btn btn-danger" onClick={handleDelete} disabled={!canConfirm || loading}>
                  {loading ? "Eliminando..." : "Confirmar eliminación"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowConfirm(false);
                    setConfirmText("");
                    setError("");
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}