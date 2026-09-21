import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Spinner from "../components/Spinner";

const EMPTY_FILTERS = { category: "", muscle: "", equipment: "", search: "" };

export default function Catalog() {
  const [exercises, setExercises] = useState([]);
  const [filters, setFilters] = useState({ categories: [], muscles: [], equipment: [] });
  const [selected, setSelected] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/exercises/filters").then((res) => setFilters(res.data));
  }, []);

  useEffect(() => {
    const params = {};
    if (selected.category) params.category = selected.category;
    if (selected.muscle) params.muscle = selected.muscle;
    if (selected.equipment) params.equipment = selected.equipment;
    if (selected.search) params.search = selected.search;

    setLoading(true);
    setError("");
    const timeout = setTimeout(() => {
      api
        .get("/exercises", { params })
        .then((res) => setExercises(res.data))
        .catch(() => setError("No se pudo cargar el catálogo. Verifica que el backend esté corriendo."))
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [selected]);

  function updateFilter(key, value) {
    setSelected((prev) => ({ ...prev, [key]: value }));
  }

  const hasActiveFilters = Object.values(selected).some((v) => v !== "");

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">Catálogo</span>
            <h1 className="page-title">Ejercicios disponibles</h1>
            <p className="page-subtitle">
              Filtra por categoría corporal, músculo objetivo o equipo, y arma tu rutina desde aquí.
            </p>
          </div>
        </div>

        <div className="filters-bar">
          <input
            type="search"
            placeholder="Buscar ejercicio por nombre..."
            value={selected.search}
            onChange={(e) => updateFilter("search", e.target.value)}
          />
          <select value={selected.category} onChange={(e) => updateFilter("category", e.target.value)}>
            <option value="">Categoría corporal</option>
            {filters.categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select value={selected.muscle} onChange={(e) => updateFilter("muscle", e.target.value)}>
            <option value="">Músculo objetivo</option>
            {filters.muscles.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select value={selected.equipment} onChange={(e) => updateFilter("equipment", e.target.value)}>
            <option value="">Equipo</option>
            {filters.equipment.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button type="button" className="filters-clear-btn" onClick={() => setSelected(EMPTY_FILTERS)}>
              Limpiar filtros ✕
            </button>
          )}
        </div>

        {loading && <Spinner label="Cargando ejercicios..." />}
        {error && <p className="error-banner">{error}</p>}

        {!loading && !error && exercises.length === 0 && (
          <div className="empty-state">No hay ejercicios que coincidan con esos filtros.</div>
        )}

        {!loading && !error && exercises.length > 0 && (
          <div className="exercise-grid">
            {exercises.map((ex) => (
              <Link key={ex.id} to={`/ejercicios/${ex.id}`} className="exercise-card">
                <div
                  className="exercise-card-image"
                  style={{ backgroundImage: ex.image_url ? `url(${ex.image_url})` : undefined }}
                />
                <div className="exercise-card-body">
                  <span className="exercise-card-title">{ex.name}</span>
                  <div className="tag-row">
                    <span className="tag tag-accent">{ex.body_category}</span>
                    <span className="tag">{ex.target_muscle}</span>
                    <span className="tag">{ex.equipment}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
