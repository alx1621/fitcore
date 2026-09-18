# FitCore — Catálogo Inteligente de Ejercicios y Rutinas Personalizadas

Aplicación web (backend + frontend) del proyecto FitCore. Base de datos: **SQLite** (un solo archivo, sin instalar motor aparte).

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/alx1621/fitcore)

## Estructura

```
fitcore/
├── backend/     API REST (Node.js + Express + SQLite + JWT)
└── frontend/    App web (React + Vite)
```

## 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run seed     # crea la base de datos y datos de ejemplo (admin + 10 ejercicios)
npm run dev       # http://localhost:4000
```

Usuario administrador creado por el seed:
- **Correo:** admin@fitcore.com
- **Contraseña:** Admin123!

La base de datos se guarda como archivo en `backend/db/fitcore.db` (se genera sola, no se sube al repositorio).

## 2. Frontend

En otra terminal:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev       # http://localhost:5173
```

## Roles del sistema

| Rol | Puede |
|---|---|
| Invitado (sin cuenta) | Ver el catálogo de ejercicios en modo lectura |
| Usuario registrado | Crear, editar y eliminar sus propias rutinas |
| Administrador | Dar de alta, editar y eliminar ejercicios del catálogo (`/admin`) |

## Endpoints principales de la API

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Crear cuenta |
| POST | `/api/auth/login` | Iniciar sesión (devuelve JWT) |
| GET  | `/api/exercises` | Catálogo (filtros: `?category=&muscle=&equipment=&search=`) |
| GET  | `/api/exercises/filters` | Valores disponibles para los filtros |
| GET  | `/api/exercises/:id` | Detalle de un ejercicio |
| POST/PUT/DELETE | `/api/exercises/:id` | Solo admin |
| GET/POST | `/api/routines` | Rutinas del usuario autenticado |
| GET/PUT/DELETE | `/api/routines/:id` | Detalle/edición/borrado de una rutina |
| POST/DELETE | `/api/routines/:id/exercises` | Agregar/quitar ejercicios de una rutina |

## Notas para la app móvil (Kotlin)

El backend es independiente del cliente: la app Android puede consumir exactamente los mismos endpoints con las mismas reglas de autenticación (JWT en el header `Authorization: Bearer <token>`), tal como plantea la arquitectura cliente-servidor de la propuesta.
