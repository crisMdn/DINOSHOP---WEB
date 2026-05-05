# AGENTS.md

## Estructura del Proyecto

- `backend/` - Spring Boot 3.2.7 API (Java 21)
- `frontend/` - React 18 + Vite + Tailwind UI

## Requisitos Previos

- Java 21, Maven, Node.js 18+
- PostgreSQL (puerto 5432, db: `fashion_catalog`) - debe estar ejecutándose
- Redis (puerto 6379) - debe estar ejecutándose
- Configurar variable `WHATSAPP_TOKEN` antes de iniciar el backend si usas notificaciones WhatsApp

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
2. **Frontend tiene productos hardcodeados**: `App.jsx` líneas 7-68 contienen array `productos` hardcodeado; estos se muestran en la vista "mujer", NO del backend
3. **Productos del backend son separados**: Sembrados por `DataInitializer.java` al iniciar, accedidos vía `GET /api/products`
4. **CORS configurado para localhost:5173**: `ProductController.java` línea 17

## Flujo de Desarrollo

- Editar productos en frontend: `frontend/src/App.jsx`
- Agregar productos al backend: modificar `DataInitializer.java`
- Configuración: `backend/src/main/resources/application.yml`

## Pruebas

- No existen suites de prueba en este repo (ni unitarias ni de integración)
- Verificar cambios manualmente reiniciando los servicios