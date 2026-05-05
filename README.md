# Fashion Catalog Web App

Proyecto de demostración con frontend React + Tailwind y backend Spring Boot con PostgreSQL y Redis.

## Estructura

- `backend/` - Spring Boot API
- `frontend/` - React + Tailwind UI

## Requisitos

- Java 21
- Maven
- Node.js 18+
- PostgreSQL
- Redis

## Ejecutar

1. Configura `backend/src/main/resources/application.yml` con credenciales de PostgreSQL y Redis.
2. Inicia la API en `backend/`:
   ```bash
   mvn spring-boot:run
   ```
3. Inicia el frontend en `frontend/`:
   ```bash
   npm install
   npm run dev
   ```
