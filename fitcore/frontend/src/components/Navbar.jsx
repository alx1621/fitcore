import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
    setMenuOpen(false);
  }

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <NavLink to="/" className="brand" onClick={closeMenu}>
          <img src="/logo.png" alt="FitCore" className="brand-logo" />
          FitCore<span className="brand-dot">.</span>
        </NavLink>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={closeMenu}>
            Catálogo
          </NavLink>

          {isAuthenticated && (
            <NavLink to="/rutinas" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={closeMenu}>
              Mis rutinas
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={closeMenu}>
              Administrar
            </NavLink>
          )}

          {isAuthenticated && (
            <NavLink to="/ajustes" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={closeMenu}>
              Ajustes
            </NavLink>
          )}

          {isAuthenticated ? (
            <>
              <span className="helper-text nav-user-name">
                {user.name}
                {isAdmin && <span className="badge-role">Admin</span>}
              </span>
              <button className="btn btn-secondary" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`} onClick={closeMenu}>
                Iniciar sesión
              </NavLink>
              <NavLink to="/registro" className="btn btn-primary" onClick={closeMenu}>
                Crear cuenta
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
