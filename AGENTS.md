# DinoShop - Agent Instructions

## Production URLs

- **Frontend**: https://dinoshop-web.onrender.com
- **Backend API**: https://dinoshop-web-fp3q.onrender.com/api
- **PostgreSQL**: fashion-db en Render (90-day free tier)

## Project Structure

| Directory | Tech | Purpose |
|-----------|------|---------|
| `backend/` | Spring Boot 3.2.7 (Java 21) | REST API |
| `frontend/` | React 18 + Vite + Tailwind | E-commerce UI |
| `promo-video/` | HyperFrames | Promo video generation |

## Commands

```bash
# Backend (requires PostgreSQL + Redis running)
cd backend && mvn spring-boot:run

# Frontend
cd frontend && npm install && npm run dev

# Promo video
cd promo-video && npm run dev      # studio editor
cd promo-video && npm run check   # lint + validate
cd promo-video && npm run render # render MP4
```

## Render Deployment

**SPA routing requires Dashboard config** (no `_redirects` file):
| Source | Destination | Action |
|--------|-------------|--------|
| `/*` | `/index.html` | Rewrite |
| `/admin/*` | `/index.html` | Rewrite |
| `/check/*` | `/index.html` | Rewrite |

## Dark Mode

- Toggle button in navbar (right of cart)
- Persisted to localStorage
- Animated with Framer Motion's `layoutId`
- Tailwind uses `darkMode: 'class'` (manual toggle)

## Local Setup

1. Copy `backend/.env.example` to `backend/.env`
2. Configure DB credentials (PostgreSQL port 5432, db: `fashion_catalog`)
3. Redis on port 6379

## Common Issues

- **404 on refresh**: Verify Render Redirects/Rewrites config
- **CORS errors**: Check `WebConfig.java` allows your domain
- **Products not loading**: Backend down or PostgreSQL disconnected

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/{id}` | Order status |
| POST | `/api/admin/login` | Admin auth |