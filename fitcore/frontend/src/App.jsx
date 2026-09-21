import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { RequireAuth, RequireAdmin } from "./components/RouteGuards";
import Landing from "./pages/Landing";
import Catalog from "./pages/Catalog";
import ExerciseDetail from "./pages/ExerciseDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Routines from "./pages/Routines";
import RoutineDetail from "./pages/RoutineDetail";
import AdminCatalog from "./pages/AdminCatalog";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <div className="app-shell">
      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/ejercicios/:id" element={<ExerciseDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/olvide-password" element={<ForgotPassword />} />
        <Route path="/restablecer-password" element={<ResetPassword />} />

        <Route
          path="/rutinas"
          element={
            <RequireAuth>
              <Routines />
            </RequireAuth>
          }
        />
        <Route
          path="/rutinas/:id"
          element={
            <RequireAuth>
              <RoutineDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/ajustes"
          element={
            <RequireAuth>
              <Settings />
            </RequireAuth>
          }
        />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireAdmin>
                <AdminCatalog />
              </RequireAdmin>
            </RequireAuth>
          }
        />
      </Routes>

      <footer className="footer">
        <div className="container">
          <div className="footer-brand">
            FitCore<span className="footer-accent">.</span>
          </div>
          <p style={{ marginTop: 8, marginBottom: 12 }}>Catálogo inteligente de ejercicios y rutinas personalizadas</p>
          <div className="footer-links">
            <a href="https://github.com/alx1621/fitcore" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="/catalogo">Catálogo</a>
            <a href="/registro">Crear cuenta</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
