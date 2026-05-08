# AGENTS.md

## URLs de Producción

- **Frontend**: https://dinoshop-web.onrender.com
- **Backend API**: https://dinoshop-web-fp3q.onrender.com/api
- **PostgreSQL**: fashion-db en Render (90-day free tier)

## Estructura del Proyecto

- `backend/` - Spring Boot 3.2.7 API (Java 21)
- `frontend/` - React 18 + Vite + Tailwind UI + Framer Motion

## Configuración de Producción

### Render SPA Routing
Render **NO** soporta `_redirects` file. Configurar Redirects/Rewrites en el Dashboard de Render:
| Source | Destination | Action |
|--------|------------|--------|
| `/*` | `/index.html` | **Rewrite** |
| `/admin/*` | `/index.html` | **Rewrite** |
| `/check/*` | `/index.html` | **Rewrite** |

### Dark Mode
- Implementado en `App.jsx` con estado `darkMode` y localStorage persistence
- Animación de circular reveal con Framer Motion (importar de `framer-motion`)
- Toggle button en navbar (derecha del carrito)
- Colores: bg-black (#000000), text-white (#ffffff) en modo oscuro
- Tailwind `darkMode: 'class'` configurado en `tailwind.config.js`

## Requisitos Previos (Desarrollo Local)

- Java 21, Maven, Node.js 18+
- PostgreSQL (puerto 5432, db: `fashion_catalog`)
- Redis (puerto 6379)
- Configurar `backend/.env` con credenciales

## Comandos

```bash
# Backend
cd backend && mvn spring-boot:run

# Frontend
cd frontend && npm install && npm run dev
```

## Build y Deploy

- Frontend: hacer commit a GitHub, Render rebuild automáticamente
- Backend: deploy automático desde branch main

## Errores Comunes

- **Build fails en 404**: Verificar Redirects/Rewrites en Dashboard de Render
- **CORS errors**: Verificar WebConfig.java permite el dominio
- **Productos no cargan**: Backend debe estar corriendo + PostgreSQL conectado