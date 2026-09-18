import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";
import ConfirmModal from "../components/ConfirmModal";

function EditableStat({ value, onSave, min, max }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => setDraft(value), [value]);

  function commit() {
    setEditing(false);
    const clamped = Math.min(max, Math.max(min, Number(draft) || min));
    if (clamped !== value) onSave(clamped);
    else setDraft(value);
  }

  if (editing) {
    return (
      <input
        className="sets-reps-input"
        type="number"
        min={min}
        max={max}
        value={draft}
        autoFocus
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.target.blur();
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
      />
    );
  }

  return (
    <button
      type="button"
      className="sets-reps-input"
      style={{ cursor: "pointer" }}
      onClick={() => setEditing(true)}
      title="Clic para editar"
    >
      {value}
    </button>
  );
}

export default function RoutineDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [routine, setRoutine] = useState(null);
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [confirmState, setConfirmState] = useState({ open: false, type: null, target: null, loading: false });

  function loadRoutine() {
    setLoading(true);
    api
      .get(`/routines/${id}`)
      .then((res) => setRoutine(res.data))
      .catch(() => setError("No se encontró la rutina."))
      .finally(() => setLoading(false));
  }

  useEffect(loadRoutine, [id]);

  useEffect(() => {
    api.get("/exercises").then((res) => setAllExercises(res.data));
  }, []);

  async function handleAddExercise(e) {
    e.preventDefault();
    if (!selectedExercise) return;
    await api.post(`/routines/${id}/exercises`, { exercise_id: selectedExercise });
    setSelectedExercise("");
    loadRoutine();
  }

  async function updateStat(routineExerciseId, field, newValue) {
    // Actualización optimista: refleja el cambio de inmediato sin esperar al servidor.
    setRoutine((prev) => ({
      ...prev,
      exercises: prev.exercises.map((ex) =>
        ex.routine_exercise_id === routineExerciseId ? { ...ex, [field]: newValue } : ex
      ),
    }));

    try {
      await api.put(`/routines/${id}/exercises/${routineExerciseId}`, { [field]: newValue });
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo guardar el cambio.");
      loadRoutine(); // revertir al valor real del servidor si falló
    }
  }

  function askRemoveExercise(routineExerciseId) {
    setConfirmState({ open: true, type: "remove-exercise", target: routineExerciseId, loading: false });
  }

  function askDeleteRoutine() {
    setConfirmState({ open: true, type: "delete-routine", target: null, loading: false });
  }

  async function handleConfirm() {
    setConfirmState((s) => ({ ...s, loading: true }));
    try {
      if (confirmState.type === "remove-exercise") {
        await api.delete(`/routines/${id}/exercises/${confirmState.target}`);
        loadRoutine();
      } else if (confirmState.type === "delete-routine") {
        await api.delete(`/routines/${id}`);
        navigate("/rutinas");
        return;
      }
    } finally {
      setConfirmState({ open: false, type: null, target: null, loading: false });
    }
  }

  if (loading) return <Spinner label="Cargando rutina..." />;
  if (error && !routine) return <p className="error-banner">{error}</p>;
  if (!routine) return null;

  return (
    <div className="page">
      <div className="container">
        <Link to="/rutinas" className="helper-text">
          ← Volver a mis rutinas
        </Link>

        <div className="page-header" style={{ marginTop: 16 }}>
          <div>
            <span className="eyebrow">Rutina personalizada</span>
            <h1 className="page-title">{routine.name}</h1>
          </div>
          <button className="btn btn-danger" onClick={askDeleteRoutine}>
            Eliminar rutina
          </button>
        </div>

        {routine.exercises.length === 0 ? (
          <div className="empty-state">Esta rutina todavía no tiene ejercicios.</div>
        ) : (
          <div className="form-card form-card-wide" style={{ margin: 0 }}>
            {routine.exercises.map((ex, index) => (
              <div key={ex.routine_exercise_id} className="routine-exercise-row">
                <span className="position-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <div className="exercise-card-title">{ex.name}</div>
                  <div className="helper-text">
                    {ex.body_category} · {ex.equipment}
                  </div>
                </div>
                <div className="sets-reps-editable">
                  <EditableStat
                    value={ex.sets}
                    min={1}
                    max={20}
                    onSave={(v) => updateStat(ex.routine_exercise_id, "sets", v)}
                  />
                  <span className="sets-reps">×</span>
                  <EditableStat
                    value={ex.reps}
                    min={1}
                    max={100}
                    onSave={(v) => updateStat(ex.routine_exercise_id, "reps", v)}
                  />
                  <span className="sets-reps">reps ·</span>
                  <EditableStat
                    value={ex.rest_seconds}
                    min={0}
                    max={600}
                    onSave={(v) => updateStat(ex.routine_exercise_id, "rest_seconds", v)}
                  />
                  <span className="sets-reps">s</span>
                </div>
                <button className="btn btn-danger" onClick={() => askRemoveExercise(ex.routine_exercise_id)}>
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}

        {error && <p className="error-text" style={{ marginTop: 14 }}>{error}</p>}

        <form className="add-exercise-row" onSubmit={handleAddExercise}>
          <select value={selectedExercise} onChange={(e) => setSelectedExercise(e.target.value)}>
            <option value="">Agregar ejercicio del catálogo...</option>
            {allExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
          <button className="btn btn-primary" type="submit" disabled={!selectedExercise}>
            Agregar
          </button>
        </form>
      </div>

      <ConfirmModal
        open={confirmState.open}
        title={confirmState.type === "delete-routine" ? "¿Eliminar esta rutina?" : "¿Quitar este ejercicio?"}
        message={
          confirmState.type === "delete-routine"
            ? "Se eliminará la rutina completa junto con todos sus ejercicios. Esta acción no se puede deshacer."
            : "Se quitará de esta rutina. Puedes volver a agregarlo cuando quieras."
        }
        confirmLabel={confirmState.type === "delete-routine" ? "Eliminar rutina" : "Quitar"}
        loading={confirmState.loading}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmState({ open: false, type: null, target: null, loading: false })}
      />
    </div>
  );
}