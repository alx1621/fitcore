import { useEffect, useState } from "react";
import api from "../services/api";
import Spinner from "../components/Spinner";
import ConfirmModal from "../components/ConfirmModal";

const emptyForm = {
  id: null,
  name: "",
  body_category: "",
  target_muscle: "",
  equipment: "",
  difficulty: "Intermedio",
  instructions: "",
  image_url: "",
};

export default function AdminCatalog() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, loading: false });

  function loadExercises() {
    setLoading(true);
    api
      .get("/exercises")
      .then((res) => setExercises(res.data))
      .finally(() => setLoading(false));
  }

  useEffect(loadExercises, []);

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function startEdit(exercise) {
    setForm({ ...exercise });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      if (form.id) {
        await api.put(`/exercises/${form.id}`, form);
      } else {
        await api.post("/exercises", form);
      }
      resetForm();
      loadExercises();
    } catch (err) {
      setError(err.response?.data?.error || "No se pudo guardar el ejercicio.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteConfirmed() {
    setConfirmDelete((s) => ({ ...s, loading: true }));
    try {
      await api.delete(`/exercises/${confirmDelete.id}`);
      loadExercises();
    } finally {
      setConfirmDelete({ open: false, id: null, loading: false });
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">Solo administradores</span>
            <h1 className="page-title">Administrar catálogo</h1>
            <p className="page-subtitle">Da de alta, edita o elimina ejercicios del catálogo maestro.</p>
          </div>
        </div>

        <form className="form-card form-card-wide" style={{ margin: "0 0 32px" }} onSubmit={handleSubmit}>
          <h2 className="font-display" style={{ marginBottom: 18 }}>
            {form.id ? "Editar ejercicio" : "Nuevo ejercicio"}
          </h2>

          <div className="field">
            <label>Nombre</label>
            <input value={form.name} onChange={(e) => updateField("name", e.target.value)} required />
          </div>

          <div className="field">
            <label>Categoría corporal</label>
            <input
              value={form.body_category}
              onChange={(e) => updateField("body_category", e.target.value)}
              placeholder="Tren superior, Tren inferior, Core, Cardio..."
              required
            />
          </div>

          <div className="field">
            <label>Músculo objetivo</label>
            <input
              value={form.target_muscle}
              onChange={(e) => updateField("target_muscle", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Equipo</label>
            <input value={form.equipment} onChange={(e) => updateField("equipment", e.target.value)} required />
          </div>

          <div className="field">
            <label>Dificultad</label>
            <select value={form.difficulty} onChange={(e) => updateField("difficulty", e.target.value)}>
              <option value="Principiante">Principiante</option>
              <option value="Intermedio">Intermedio</option>
              <option value="Avanzado">Avanzado</option>
            </select>
          </div>

          <div className="field">
            <label>Instrucciones de ejecución</label>
            <textarea
              value={form.instructions}
              onChange={(e) => updateField("instructions", e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>URL de imagen (referencia externa)</label>
            <input value={form.image_url || ""} onChange={(e) => updateField("image_url", e.target.value)} />
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="top-bar-actions">
            <button className="btn btn-primary" type="submit" disabled={saving}>
              {saving ? "Guardando..." : form.id ? "Guardar cambios" : "Crear ejercicio"}
            </button>
            {form.id && (
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancelar edición
              </button>
            )}
          </div>
        </form>

        {loading ? (
          <Spinner label="Cargando catálogo..." />
        ) : (
          <div className="exercise-grid">
            {exercises.map((ex) => (
              <div key={ex.id} className="exercise-card" style={{ cursor: "default" }}>
                <div
                  className="exercise-card-image"
                  style={{ backgroundImage: ex.image_url ? `url(${ex.image_url})` : undefined }}
                />
                <div className="exercise-card-body">
                  <span className="exercise-card-title">{ex.name}</span>
                  <div className="tag-row">
                    <span className="tag tag-accent">{ex.body_category}</span>
                    <span className="tag">{ex.equipment}</span>
                  </div>
                  <div className="top-bar-actions" style={{ marginTop: 6 }}>
                    <button className="btn btn-secondary" onClick={() => startEdit(ex)}>
                      Editar
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => setConfirmDelete({ open: true, id: ex.id, loading: false })}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmDelete.open}
        title="¿Eliminar este ejercicio?"
        message="Se quitará del catálogo para todos los usuarios. Si está en alguna rutina, también desaparecerá de ahí."
        confirmLabel="Eliminar"
        loading={confirmDelete.loading}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDelete({ open: false, id: null, loading: false })}
      />
    </div>
  );
}