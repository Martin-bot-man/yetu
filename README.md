# Yetu POS

## Run Locally

1. Start MongoDB on `127.0.0.1:27017`.
2. Start backend:

```bash
cd yetu-backend
npm install
npm run dev
```

3. Start frontend:

```bash
cd yetu-frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:8000`

## Run with Docker

From project root:

```bash
docker compose up --build
```

App: `http://localhost:8080`  
Backend API: `http://localhost:8000`  
MongoDB: `mongodb://localhost:27017`

Stop containers:

```bash
docker compose down
```

Stop and remove database volume:

```bash
docker compose down -v
```

## Production Hardening Included

- API rate limiting on `/api` endpoints (configurable via env vars).
- Structured JSON request/error logs with request IDs.
- `/health` endpoint returns service readiness including MongoDB state.
- Database retry loop keeps backend process alive if MongoDB is temporarily unavailable.
- CI workflow validates backend syntax and frontend production build on push/PR.
