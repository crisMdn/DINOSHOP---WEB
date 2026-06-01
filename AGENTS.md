# DinoShop - Agent Instructions

## TL;DR

Three packages in one repo: Spring Boot backend, Vite+React frontend, HyperFrames promo video.

## Commands

```bash
# Backend (requires PostgreSQL + Redis running locally)
cd backend && mvn spring-boot:run

# Frontend
cd frontend && npm install && npm run dev

# Promo video
cd promo-video && npm run dev      # studio editor
cd promo-video && npm run check    # lint + validate + inspect (run after every edit)
cd promo-video && npm run render   # render MP4
```

No frontend tests exist. No lint/typecheck scripts in frontend or backend.

## Project Structure

| Directory | Tech | Entrypoint |
|---|---|---|
| `backend/` | Spring Boot 3.2.7 (Java 21), Maven | `CatalogApplication.java` — loads `.env` via `dotenv-java` into `System.setProperty` on startup |
| `frontend/` | React 18 + Vite 5 + Tailwind 3 | `main.jsx` → `App.jsx` with `BrowserRouter` |
| `promo-video/` | HyperFrames | `index.html` (root composition) + `compositions/` sub-compositions |

**Backend packages** under `com.example.fashioncatalog`: `config/`, `controller/`, `service/`, `repository/`, `model/`, `dto/`, `exception/`.

**Frontend routes** defined in `App.jsx`: `/check` (order status), `/admin/login`, `/admin` (panel), `*` (store with Mujer/Hombre categories, cart, checkout).

## Dev Setup

1. Copy `backend/.env.example` to `backend/.env` and fill credentials
2. Requires PostgreSQL (db: `fashion_catalog`) and Redis on default ports
3. Frontend API base (`API_BASE`) is hardcoded in 4 files (`App.jsx`, `Admin.jsx`, `AdminProducts.jsx`, `ProductForm.jsx`) — update all when changing
4. Backend uses `CorsFilter` allowing `localhost:5173` + 2 Render URLs — add new frontend URLs there too

## Deployed URLs

- **Frontend**: https://dinoshop-web.onrender.com
- **Backend API**: https://dinoshop-web-fp3q.onrender.com/api
- **PostgreSQL**: fashion-db on Render (90-day free tier)

## Render SPA Routing

No `_redirects` file. Must configure in Render Dashboard:
| Source | Destination | Action |
|---|---|---|
| `/*` | `/index.html` | Rewrite |
| `/admin/*` | `/index.html` | Rewrite |
| `/check/*` | `/index.html` | Rewrite |

## Backend Quirks

- **`.env` loading**: `CatalogApplication` uses `io.github.cdimascio.dotenv.Dotenv` to read `.env` and set system properties — standard Spring `application.yml` `$ {...}` interpolation picks them up
- **DB_USERNAME mismatch**: `.env` sets `DB_USER=postgres` but `application.yml` reads `DB_USERNAME` — variable is unused, username falls back to default `postgres`
- **Admin auth**: Trivial — login returns `"admin_" + timestamp`. No JWT. Verify checks `Authorization` header starts with `admin_`
- **JPA**: `ddl-auto: update` — Hibernate auto-creates tables. `Order` entity uses `@Table(name="\"order\"")` because ORDER is a Postgres reserved word.
- **Cart persistence**: Entirely Redis-backed (no DB), uses `RedisTemplate<String, Object>` with JSON serializer
- **Async**: `@EnableAsync` on main class. `NotificationService.sendWhatsApp()` is `@Async` — fires CallMeBot API without blocking order creation
- **Data seeding**: `DataInitializer` runs on startup if DB is empty

## Frontend Quirks

- **No axios**: All HTTP via `fetch()` with hardcoded `API_BASE` constant in each component file
- **Dark mode**: `darkMode: 'class'` in Tailwind. Toggle in navbar, persisted to `localStorage`. Framer Motion `layoutId` for animation.
- **Tailwind**: v3 with `@tailwindcss/forms` plugin. Custom `shadow-soft`, `animate-fade-in` keyframes.
- **Icon font**: Playfair Display imported from Google Fonts (serif headings on landing page)

## Common Issues

- **404 on refresh** → Verify Render Redirects/Rewrites config
- **CORS errors** → Add domain to `WebConfig.java` allowed origins
- **Products not loading** → Backend or PostgreSQL down
- **Admin can't log in** → Check `ADMIN_USERNAME`/`ADMIN_PASSWORD` in `.env`

## Promo Video Rules

The `promo-video/` directory has its own `AGENTS.md` and `CLAUDE.md` with framework-specific rules. Key points:
- Run `npm run check` after every `.html` edit (runs `hyperframes lint`, `validate`, `inspect`)
- Every timed element needs `data-start`, `data-duration`, `data-track-index` and `class="clip"`
- GSAP timelines must be `paused` and registered on `window.__timelines`
- No `Date.now()`, `Math.random()`, or network fetches
- Full docs at https://hyperframes.heygen.com/llms.txt
