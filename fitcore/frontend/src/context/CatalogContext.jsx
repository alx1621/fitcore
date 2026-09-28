import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";

const CatalogContext = createContext(null);

export const EMPTY_FILTERS = { category: "", muscle: "", equipment: "", search: "" };

const CATALOG_PATH = "/catalogo";

export function CatalogProvider({ children }) {
  const { pathname } = useLocation();
  const [exercises, setExercises] = useState([]);
  const [filters, setFilters] = useState({ categories: [], muscles: [], equipment: [] });
  const [selected, setSelected] = useState(EMPTY_FILTERS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const scrollRef = useRef(0);
  const forceTopRef = useRef(false);

  useEffect(() => {
    api
      .get("/exercises/filters")
      .then((res) => setFilters(res.data))
      .catch(() => {});
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
        .catch(() =>
          setError("No se pudo cargar el catálogo. Verifica que el backend esté corriendo.")
        )
        .finally(() => setLoading(false));
    }, 250);

    return () => clearTimeout(timeout);
  }, [selected]);

  useEffect(() => {
    if (pathname !== CATALOG_PATH) {
      window.scrollTo(0, 0);
      return;
    }
    if (forceTopRef.current) {
      forceTopRef.current = false;
      scrollRef.current = 0;
      window.requestAnimationFrame(() => window.scrollTo(0, 0));
      return;
    }
    const saved = scrollRef.current;
    if (saved <= 0) return;
    window.requestAnimationFrame(() => window.scrollTo(0, saved));
  }, [pathname, exercises.length, loading]);

  const saveScroll = useCallback((y) => {
    scrollRef.current = y;
  }, []);

  const getScroll = useCallback(() => scrollRef.current, []);

  const scrollToTop = useCallback(() => {
    scrollRef.current = 0;
    forceTopRef.current = true;
    window.scrollTo(0, 0);
  }, []);

  function updateFilter(key, value) {
    scrollToTop();
    setSelected((prev) => ({ ...prev, [key]: value }));
  }

  function clearFilters() {
    scrollToTop();
    setSelected(EMPTY_FILTERS);
  }

  const value = {
    exercises,
    filters,
    selected,
    loading,
    error,
    hasActiveFilters: Object.values(selected).some((v) => v !== ""),
    updateFilter,
    clearFilters,
    saveScroll,
    getScroll,
    scrollToTop,
  };

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
