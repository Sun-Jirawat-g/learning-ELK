# example-node

Express + TypeScript MVC + Prisma. Product CRUD example.

## Structure

```
example-node/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/          # env, db (prisma client)
│   ├── controllers/     # request handlers
│   ├── services/        # business logic / data access
│   ├── routes/          # group routing (index.ts mounts feature routes)
│   ├── middlewares/     # error, validate
│   ├── types/           # zod schemas + inferred types
│   ├── utils/           # response helpers
│   ├── app.ts           # express app
│   └── server.ts        # bootstrap
├── .env
├── package.json
└── tsconfig.json
```

## Setup

1. Start DB (from repo root):
   ```bash
   docker compose up -d
   ```

2. Install deps:
   ```bash
   npm install
   ```

3. Generate Prisma client + run migration:
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

4. Dev:
   ```bash
   npm run dev
   ```

## Group Routing

Base: `/api/v1`

| Method | Path                      | Description       |
|--------|---------------------------|-------------------|
| GET    | `/api/v1/health`          | health check      |
| GET    | `/api/v1/products`        | list (paginated)  |
| GET    | `/api/v1/products/:id`    | get one           |
| POST   | `/api/v1/products`        | create            |
| PUT    | `/api/v1/products/:id`    | update            |
| DELETE | `/api/v1/products/:id`    | delete            |

### Sample create

```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Pen","description":"Blue ink","price":12.5,"stock":100}'
```

### Sample list with pagination

```bash
curl "http://localhost:3000/api/v1/products?page=1&limit=20"
```

## Flow (MVC)

`route → middleware (validate) → controller → service → prisma → db`
