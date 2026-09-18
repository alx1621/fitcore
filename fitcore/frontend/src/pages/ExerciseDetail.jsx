import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

export default function ExerciseDetail() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [exercise, setExercise] = useState(null);
  const [routines, setRoutines] = useState([]);
  const [selectedRoutine, setSelectedRoutine] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showGif, setShowGif] = useState(false);

  useEffect(() => {
    api.get(`/exercises/${id}`).then((res) => setExercise(res.data));
    setShowGif(false);
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) {
      api.get("/routines").then((res) => setRoutines(res.data));
    }
  }, [isAuthenticated]);

  async function handleAddToRoutine() {
    if (!selectedRoutine) return;
    setError("");
    setMessage("");
    try {
      await api.post(`/routines/${selectedRoutine}/exercises`, { exercise_id: exercise.id });
      setMessage("Ejercicio agregado a la rutina.");
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo agregar el ejercicio.");
    }
  }

  if (!exercise) return <Spinner label="Cargando ejercicio..." />;

  const hasBoth = exercise.image_url && exercise.animation_url;
  const currentSrc = showGif ? exercise.animation_url : exercise.image_url;

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className="helper-text">
          ← Volver al catálogo
        </Link>

        <div className="detail-layout" style={{ marginTop: 20 }}>
          <div>
            {hasBoth && (
              <div className="image-toggle">
                <button
                  className={`image-toggle-btn ${!showGif ? "active" : ""}`}
                  onClick={() => setShowGif(false)}
                >
                  Imagen
                </button>
                <button
                  className={`image-toggle-btn ${showGif ? "active" : ""}`}
                  onClick={() => setShowGif(true)}
                >
                  Animación
                </button>
              </div>
            )}
            {currentSrc && (
              <img src={currentSrc} alt={exercise.name} className="detail-image" />
            )}
          </div>

          <div>
            <span className="eyebrow">{exercise.difficulty}</span>
            <h1 className="page-title">{exercise.name}</h1>
            <div className="tag-row" style={{ marginTop: 12 }}>
              <span className="tag tag-accent">{exercise.body_category}</span>
              <span className="tag">{exercise.target_muscle}</span>
              <span className="tag">{exercise.equipment}</span>
            </div>

            <div className="instructions-block">
              <strong>Ejecución correcta</strong>
              <p style={{ marginTop: 10, marginBottom: 0 }}>{exercise.instructions}</p>
            </div>

            {isAuthenticated ? (
              <div className="add-exercise-row">
                <select value={selectedRoutine} onChange={(e) => setSelectedRoutine(e.target.value)}>
                  <option value="">Selecciona una rutina...</option>
                  {routines.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
                <button className="btn btn-primary" onClick={handleAddToRoutine} disabled={!selectedRoutine}>
                  Agregar a rutina
                </button>
              </div>
            ) : (
              <p className="helper-text" style={{ marginTop: 18 }}>
                <Link to="/login">Inicia sesión</Link> para guardar este ejercicio en una rutina.
              </p>
            )}

            {message && <p style={{ color: "var(--color-success)", marginTop: 12 }}>{message}</p>}
            {error && <p className="error-text" style={{ marginTop: 12 }}>{error}</p>}

            {isAuthenticated && routines.length === 0 && (
              <p className="helper-text" style={{ marginTop: 12 }}>
                Aún no tienes rutinas. <Link to="/rutinas">Crea una primero</Link>.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}