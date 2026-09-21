import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="page">
      <div className="container">
        {/* Hero */}
        <section className="hero">
          <img src="/logo.png" alt="FitCore" className="hero-logo" />
          <h1 className="hero-title">
            Tu gimnasio <span className="hero-accent">inteligente</span>
          </h1>
          <p className="hero-subtitle">
            FitCore es tu catálogo personal de ejercicios con imágenes, animaciones y rutinas
            personalizadas. Entrena donde quieras, cuando quieras.
          </p>
          <div className="hero-actions">
            <Link to="/registro" className="btn btn-primary btn-lg">
              Crear cuenta gratis
            </Link>
            <Link to="/catalogo" className="btn btn-secondary btn-lg">
              Ver catálogo
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">90+</div>
              <div className="hero-stat-label">Ejercicios</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">6</div>
              <div className="hero-stat-label">Categorías</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">∞</div>
              <div className="hero-stat-label">Rutinas</div>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* Features */}
        <section className="features-section">
          <span className="eyebrow">¿Qué ofrece FitCore?</span>
          <h2 className="page-title" style={{ textAlign: "center", marginBottom: 40 }}>
            Todo lo que necesitas para entrenar
          </h2>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🏋️</div>
              <h3 className="feature-title">Catálogo completo</h3>
              <p className="feature-desc">
                Más de 90 ejercicios organizados por categoría muscular, equipo y nivel de
                dificultad. Cada ejercicio incluye imágenes y animaciones.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📋</div>
              <h3 className="feature-title">Rutinas personalizadas</h3>
              <p className="feature-desc">
                Crea tus propias rutinas, agrega ejercicios, define series, repeticiones y
                tiempos de descanso. Todo guardado en la nube.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3 className="feature-title">Desde cualquier dispositivo</h3>
              <p className="feature-desc">
                Accede desde tu teléfono, tablet o computadora. Tus rutinas se sincronizan
                automáticamente.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3 className="feature-title">Instrucciones detalladas</h3>
              <p className="feature-desc">
                Cada ejercicio incluye pasos de ejecución, tiempos recomendados, repeticiones
                y descansos óptimos para maximizar resultados.
              </p>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* How it works */}
        <section className="how-section">
          <span className="eyebrow">¿Cómo funciona?</span>
          <h2 className="page-title" style={{ textAlign: "center", marginBottom: 40 }}>
            3 pasos para comenzar
          </h2>

          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3 className="step-title">Crea tu cuenta</h3>
              <p className="step-desc">
                Regístrate gratis en segundos. Solo necesitas un correo electrónico.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">2</div>
              <h3 className="step-title">Explora el catálogo</h3>
              <p className="step-desc">
                Navega por más de 90 ejercicios con imágenes, animaciones e instrucciones
                detalladas.
              </p>
            </div>

            <div className="step-card">
              <div className="step-number">3</div>
              <h3 className="step-title">Arma tu rutina</h3>
              <p className="step-desc">
                Selecciona los ejercicios que quieras, define series, repeticiones y
                descansos. ¡Listo para entrenar!
              </p>
            </div>
          </div>
        </section>

        <hr className="section-divider" />

        {/* App promo */}
        <section className="app-promo">
          <div className="app-promo-content">
            <span className="eyebrow">Próximamente</span>
            <h2 className="page-title" style={{ marginBottom: 16 }}>
              FitCore App móvil
            </h2>
            <p className="page-subtitle" style={{ maxWidth: 480 }}>
              Lleva tu entrenamiento al siguiente nivel con la app móvil. Accede al catálogo
              completo sin conexión, recibe recordatorios de entrenamiento y más.
            </p>
            <div className="app-badges">
              <div className="app-badge">Google Play</div>
              <div className="app-badge">App Store</div>
            </div>
          </div>
          <div className="app-promo-visual">
            <img src="/logo.png" alt="FitCore App" className="app-promo-logo" />
          </div>
        </section>

        <hr className="section-divider" />

        {/* CTA */}
        <section className="cta-section">
          <h2 className="page-title" style={{ marginBottom: 16 }}>
            ¿Listo para comenzar?
          </h2>
          <p className="page-subtitle" style={{ maxWidth: 480, margin: "0 auto 28px" }}>
            Únete a FitCore y transforma tu rutina de entrenamiento. Es gratis, sin tarjetas
            de crédito.
          </p>
          <div className="hero-actions">
            <Link to="/registro" className="btn btn-primary btn-lg">
              Crear cuenta gratis
            </Link>
            <Link to="/catalogo" className="btn btn-secondary btn-lg">
              Explorar ejercicios
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
