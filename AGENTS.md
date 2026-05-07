# AGENTS.md

## Estructura del Proyecto

- `backend/` - Spring Boot 3.2.7 API (Java 21)
- `frontend/` - React 18 + Vite + Tailwind UI
- `promo-video/` - Subproyecto para videos (no relacionado con la tienda)

## Requisitos Previos

- Java 21, Maven, Node.js 18+
- PostgreSQL (puerto 5432, db: `fashion_catalog`) - debe estar ejecutándose
- Redis (puerto 6379) - debe estar ejecutándose
- Configurar `backend/.env` con credenciales

## Configuración

1. Copiar `backend/.env.example` a `backend/.env`
2. Configurar variables: DB_PASSWORD, ADMIN_PASSWORD, etc.
3. No hacer commit de `.env` - está en .gitignore

## Comandos para Ejecutar

Backend (desde `backend/`):
```
mvn spring-boot:run
```
- API: http://localhost:8080
- Auto-semilla productos en primer inicio si DB vacía (ver `DataInitializer.java`)

Frontend (desde `frontend/`):
```
npm install
npm run dev
```
- UI: http://localhost:5173

## Notas Clave de Arquitectura

1. **El orden importa**: Iniciar PostgreSQL y Redis primero, luego backend, luego frontend
2. **Productos carga del backend**: No hay productos hardcodeados, todo viene de `GET /api/products`
3. **CORS configurado para localhost:5173**: `ProductController.java` línea 22
4. **Auth admin**: Login real vía `POST /api/admin/login`, credenciales en variables de entorno

## Flujo de Desarrollo

- Editar productos: usar panel Admin > Productos
- Configuración DB/Redis: `backend/src/main/resources/application.yml`
- Credenciales: `backend/.env` (no hardcodear)

## Pruebas

- No existen suites de prueba en este repo (ni unitarias ni de integración)
- Verificar cambios manualmente reiniciando los servicios