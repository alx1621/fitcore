import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";

export default function Routines() {
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  function loadRoutines() {
    setLoading(true);
    api
      .get("/routines")
      .then((res) => setRoutines(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(loadRoutines, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);
    try {
      const { data } = await api.post("/routines", { name });
      navigate(`/rutinas/${data.id}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">Tu plan de entrenamiento</span>
            <h1 className="page-title">Mis rutinas</h1>
            <p className="page-subtitle">Crea, edita y consulta tus rutinas desde cualquier dispositivo.</p>
          </div>
        </div>

        <form className="add-exercise-row" onSubmit={handleCreate} style={{ marginBottom: 28 }}>
          <input
            type="text"
            placeholder="Nombre de la nueva rutina (ej: Empuje - Lunes)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ flex: 1, minWidth: 240 }}
          />
          <button className="btn btn-primary" type="submit" disabled={creating || !name.trim()}>
            {creating ? "Creando..." : "Crear rutina"}
          </button>
        </form>

        {loading && <Spinner label="Cargando rutinas..." />}

        {!loading && routines.length === 0 && (
          <div className="empty-state">
            Todavía no tienes rutinas. Crea la primera arriba o agrega ejercicios desde el catálogo.
          </div>
        )}

        {!loading && routines.length > 0 && (
          <div className="routine-list">
            {routines.map((r) => (
              <Link key={r.id} to={`/rutinas/${r.id}`} className="routine-row">
                <div>
                  <div className="exercise-card-title">{r.name}</div>
                  {r.description && <div className="helper-text">{r.description}</div>}
                </div>
                <span className="helper-text">
                  Actualizada {new Date(r.updated_at).toLocaleDateString("es-SV")}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}