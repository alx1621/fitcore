import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand">
          FitCore<span className="brand-dot">.</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Catálogo
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/rutinas" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Mis rutinas
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Administrar catálogo
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink to="/ajustes" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
              Ajustes
            </NavLink>
          )}

          {isAuthenticated ? (
            <>
              <span className="helper-text">
                {user.name}
                {isAdmin && <span className="badge-role">Admin</span>}
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
                Iniciar sesión
              </NavLink>
              <NavLink to="/registro" className="btn btn-primary">
                Crear cuenta
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}