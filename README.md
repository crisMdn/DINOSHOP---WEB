# 👜 DinoShop

> Tienda de moda minimalista. Lo que ves, lo compras.

![DinoShop Home](frontend/public/the Oliver set.jfif)

## Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React 18 + Vite + Tailwind CSS |
| Backend | Spring Boot 3.2.7 (Java 21) |
| Database | PostgreSQL |
| Cache | Redis |

## Quick Start

```bash
# 1. Configura tus variables de entorno
cp backend/.env.example backend/.env
# Edita backend/.env con tus credenciales

# 2. Backend - requiere PostgreSQL + Redis
cd backend
mvn spring-boot:run
# API: http://localhost:8080

# 3. Frontend
cd frontend
npm install
npm run dev
# UI: http://localhost:5173
```

## Variables de Entorno

Copia `backend/.env.example` a `backend/.env` y configura:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fashion_catalog
DB_USERNAME=postgres
DB_PASSWORD=tu_password

REDIS_HOST=localhost
REDIS_PORT=6379

ADMIN_USERNAME=admin
ADMIN_PASSWORD=tu_password_admin

# Opcional: WhatsApp
WHATSAPP_TOKEN=
WHATSAPP_PHONE=
```

## Screenshots

| Catálogo | Producto | Carrito |
|----------|----------|--------|
| ![](frontend/public/cartera1.jfif) | ![](frontend/public/cartera2.jfif) | ![](frontend/public/blusasconjunto.jfif) |

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Listar productos |
| POST | `/api/products` | Crear producto |
| PUT | `/api/products/{id}` | Actualizar producto |
| DELETE | `/api/products/{id}` | Eliminar producto |
| POST | `/api/orders` | Crear orden |
| GET | `/api/orders/{id}` | Estado del pedido |
| GET | `/api/orders` | Todos los pedidos |
| PATCH | `/api/orders/{id}/status` | Actualizar estado |
| POST | `/api/admin/login` | Login admin |

## Features

- Catálogo por género (Mujer / Hombre)
- Carrito de compras interactivo
- Checkout con transferencia o contraentrega
- Entrega en punto de recojo o domicilio
- Seguimiento de pedidos por ID
- Notificaciones WhatsApp
- Panel de administración completo
- Gestión de productos (CRUD)
- Filtros por fecha y estado en pedidos