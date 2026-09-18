export default function Spinner({ label = "Cargando..." }) {
  return (
    <div className="spinner-wrap" role="status" aria-live="polite">
      <span className="spinner" />
      <span className="helper-text">{label}</span>
    </div>
  );
}