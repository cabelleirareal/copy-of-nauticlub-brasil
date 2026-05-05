# 🔧 Environment Setup — Development & Local

> **Para:** Desenvolvedores locais  
> **Tempo:** ~30 minutos para setup inicial  
> **Requisitos:** Node.js 20+, pnpm, PostgreSQL, Redis (opcional para MVP)

---

## 📋 Quickstart (5 minutos)

```bash
# 1. Clone repo
git clone https://github.com/cabelleirareal/copy-of-nauticlub-brasil.git
cd copy-of-nauticlub-brasil

# 2. Setup monorepo
pnpm install

# 3. Setup environment
cp .env.example .env.local
cp backend/.env.example backend/.env.local

# 4. Init database
pnpm run db:migrate

# 5. Start dev server
pnpm run dev

# Acessar:
# Frontend: http://localhost:5173
# API: http://localhost:3000/v1
# Swagger: http://localhost:3000/api/docs
```

---

## 🛠️ Instalação Detalhada

### Pré-requisitos

#### Node.js & pnpm

```bash
# Verificar Node.js 20+
node --version  # v20.x ou superior

# Instalar pnpm (gerenciador monorepo)
npm install -g pnpm@latest

# Verificar
pnpm --version  # 8.x+
```

#### PostgreSQL (Local)

**macOS (Homebrew)**
```bash
brew install postgresql@15

# Iniciar
brew services start postgresql@15

# Conectar
psql postgres
```

**Linux (Ubuntu/Debian)**
```bash
sudo apt-get install postgresql postgresql-contrib

# Verificar
sudo systemctl status postgresql
```

**Windows (WSL2)**
```bash
sudo apt-get update && sudo apt-get install postgresql

# Iniciar
sudo service postgresql start
```

**Docker (Recomendado)**
```bash
# docker-compose.yml na raiz
version: '3.9'
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: localpass123
      POSTGRES_DB: nauticlub_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

```bash
docker-compose up -d
```

---

## 📁 Estrutura do Monorepo

```
nauticlub-saas/
├── packages/
│   └── shared/                 → Types, validators, constants
│       ├── src/
│       │   ├── types.ts       → Boat, Lead, User, etc.
│       │   ├── validators.ts  → Zod schemas
│       │   └── constants.ts   → Enums, defaults
│       └── package.json
│
├── web/                        → Frontend (Vite + React)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── api/               → Cliente Axios
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── .env.local
│   ├── vite.config.ts
│   └── package.json
│
├── backend/                    → NestJS API
│   ├── src/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── boats/
│   │   ├── leads/
│   │   ├── partnerships/
│   │   ├── deals/
│   │   ├── commissions/
│   │   ├── main.ts
│   │   └── app.module.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── .env.local
│   ├── nest-cli.json
│   └── package.json
│
├── .env.example
├── .env.local                 → variáveis compartilhadas
├── pnpm-workspace.yaml
└── package.json               → root scripts
```

---

## 🔐 Variáveis de Ambiente

### `.env.local` (raiz — dev)

```bash
# NODE
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000/v1
VITE_GEMINI_API_KEY=AIzaSy... # seu Gemini API key (opcional)

# Database
DATABASE_URL=postgresql://postgres:localpass123@localhost:5432/nauticlub_dev
DATABASE_SSL=false

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=dev-secret-key-min-32-chars-xxxxxxxxxxxxx
JWT_REFRESH_SECRET=dev-refresh-secret-xxxxxxxxxxxxx
JWT_EXPIRES_IN=3600
JWT_REFRESH_EXPIRES_IN=604800

# API
API_URL=http://localhost:3000/v1
FRONTEND_URL=http://localhost:5173

# Stripe (usar chaves de teste)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...

# Email (Resend)
RESEND_API_KEY=re_... # obter em https://resend.com

# AWS/R2 (opcional para MVP)
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_S3_BUCKET=nauticlub-dev
AWS_S3_REGION=us-east-1

# Admin
ADMIN_EMAIL=dev@nauticlub.local
```

### `backend/.env.local` (específico backend)

```bash
# Herda de .env.local + extras
PORT=3000
LOG_LEVEL=debug

# Seed database on start (dev only)
SEED_ON_START=true
```

### `web/.env.local` (específico frontend)

```bash
# Herda de .env.local + extras
VITE_APP_NAME=NautiClub Dev
```

---

## 🗄️ Database Setup

### 1. Criar .env.local na raiz

(Já feito acima)

### 2. Criar database Postgres

```bash
# Via psql
createdb nauticlub_dev

# Via docker-compose (já cria automaticamente)
```

### 3. Rodar migrations Prisma

```bash
cd backend/

# Gerar schema.prisma (já existe em SAAS_TRANSFORMATION_PLAN.md)
# Criar arquivo:

cat > prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String
  name          String
  phone         String?
  role          Role
  avatar        String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

enum Role {
  OWNER
  BROKER
  BUYER
  ADMIN
}

// ... restante do schema
EOF

# Executar migration
npx prisma migrate dev --name init

# Verificar tabelas criadas
npx prisma studio  # UI interativa
```

### 4. Seed (dados iniciais)

**backend/prisma/seed.ts**
```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criar usuário de teste
  const testBroker = await prisma.user.create({
    data: {
      email: 'broker@test.local',
      password: await bcrypt.hash('Test123!', 10),
      name: 'Test Broker',
      role: 'BROKER',
      brokerProfile: {
        create: {
          licenseNumber: 'CRECI-123456',
          cityRegion: 'São Paulo, SP',
        },
      },
    },
  });

  // Criar barco de teste
  await prisma.boat.create({
    data: {
      name: 'Focker 333 - Test',
      brand: 'Focker',
      year: 2023,
      size: 33,
      price: 850000,
      type: 'LANCHA',
      status: 'AVAILABLE',
      ownerId: testBroker.id,
      listingBrokerId: testBroker.id,
      description: 'Barco de teste para desenvolvimento',
      openToPartnerships: true,
      defaultCommission: 5.0,
      location: 'Balneário Camboriú, SC',
      media: {
        create: [
          {
            url: 'https://picsum.photos/seed/focker/600/400',
            type: 'IMAGE',
            order: 0,
            isCover: true,
          },
        ],
      },
    },
  });

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

**package.json**
```json
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

```bash
npx prisma db seed
```

---

## 🚀 Rodar Projeto Localmente

### Option 1: Tudo em paralelo (recomendado)

```bash
# Na raiz do monorepo
pnpm run dev

# Abre 3 terminais:
# Terminal 1: Backend NestJS (port 3000)
# Terminal 2: Frontend Vite (port 5173)
# Terminal 3: Prisma Studio (port 5555)
```

### Option 2: Terminal separados

**Terminal 1 — Backend**
```bash
cd backend/
pnpm run start:dev

# Saída esperada:
# [NestFactory] Nest app successfully started on port 3000
# [Swagger] API docs: http://localhost:3000/api/docs
```

**Terminal 2 — Frontend**
```bash
cd web/
pnpm run dev

# Saída esperada:
# ➜  Local:   http://localhost:5173/
```

**Terminal 3 — Database Studio (opcional)**
```bash
cd backend/
npx prisma studio

# Abre em http://localhost:5555
```

---

## ✅ Verificar Setup

### 1. Conectar backend

```bash
curl http://localhost:3000/v1/health

# Esperado:
# {"status":"ok","timestamp":"2024-05-04T..."}
```

### 2. Conectar frontend

Abrir http://localhost:5173 no browser

### 3. Testar auth

```bash
# Signup
curl -X POST http://localhost:3000/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@local.dev",
    "password":"Test123!",
    "name":"Test User",
    "role":"BROKER"
  }'

# Esperado: JWT token

# Login
curl -X POST http://localhost:3000/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@local.dev",
    "password":"Test123!"
  }'
```

### 4. Testar database

```bash
# Listar users
curl http://localhost:3000/v1/users/me \
  -H "Authorization: Bearer <seu_token_aqui>"
```

---

## 🐛 Troubleshooting

### Erro: "ENOENT: no such file or directory, stat '.env.local'"

```bash
# Solução
cd backend/ && cp .env.example .env.local
cd web/ && cp .env.example .env.local
cp .env.example .env.local  # na raiz
```

### Erro: "Cannot connect to database at localhost:5432"

```bash
# PostgreSQL não está rodando

# macOS
brew services start postgresql@15

# Linux
sudo service postgresql start

# Docker
docker-compose up -d postgres

# Verificar
psql -h localhost -U postgres -d nauticlub_dev
```

### Erro: "Port 3000 is already in use"

```bash
# Encontrar processo
lsof -i :3000

# Matar processo
kill -9 <PID>

# Ou mudar port em backend/.env.local
PORT=3001
```

### Erro: "Prisma migration failed"

```bash
# Ver status
npx prisma migrate status

# Resolver conflito
npx prisma migrate resolve --rolled-back init

# Tentar novamente
npx prisma migrate dev --name init
```

### Erro: "Module not found @nauticlub/shared"

```bash
# Recompile shared package
cd packages/shared
pnpm run build

# Ou usar pnpm workspace (automático)
pnpm install

# Se persistir, delete node_modules
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## 📝 Editor Setup (VS Code recomendado)

### Extensions

```json
// .vscode/extensions.json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "nestjs.nestjs",
    "ms-vscode.makefile-tools"
  ]
}
```

### Settings

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[prisma]": {
    "editor.defaultFormatter": "prisma.prisma"
  }
}
```

---

## 🧪 Running Tests

### Backend (NestJS)

```bash
cd backend/

# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Watch mode
pnpm run test:watch
```

### Frontend (Vitest)

```bash
cd web/

# Unit tests
pnpm run test

# Watch mode
pnpm run test:watch

# Coverage
pnpm run test:coverage
```

### E2E (Playwright)

```bash
cd web/

# Instalar browsers
pnpm exec playwright install

# Rodar testes
pnpm run test:e2e

# UI mode
pnpm run test:e2e:ui
```

---

## 📚 Scripts Úteis

### Root (monorepo)

```bash
pnpm run dev              # Todos serviços em paralelo
pnpm run build            # Build backend + frontend
pnpm run test             # Testes backend
pnpm run lint             # Lint backend + frontend
pnpm run db:migrate       # Migrations Prisma
pnpm run db:seed          # Seed inicial
pnpm run db:studio        # Prisma Studio UI
```

### Backend específico

```bash
cd backend/

pnpm run start:dev        # Dev com hot reload
pnpm run build            # Build produção
pnpm run start:prod       # Rodar build produção
pnpm run test             # Jest tests
pnpm run lint             # ESLint
```

### Frontend específico

```bash
cd web/

pnpm run dev              # Vite dev server
pnpm run build            # Build para dist/
pnpm run preview          # Prévia do build
pnpm run test             # Vitest
pnpm run test:e2e         # Playwright
```

---

## 🔌 API Endpoints para testar

Com o backend rodando em `http://localhost:3000/v1`:

```bash
# Health check
GET /health

# Auth
POST /auth/signup         # Registrar novo user
POST /auth/login          # Login
POST /auth/refresh        # Renovar token
POST /auth/logout         # Logout

# Boats
GET /boats                # Listar com filtros
GET /boats/:id            # Detalhe
POST /boats               # Criar (autenticado)
PATCH /boats/:id          # Atualizar

# Leads
GET /leads                # Listar leads
POST /leads               # Capturar novo lead (público)
PATCH /leads/:id          # Atualizar status

# Partnerships
GET /partnerships         # Listar partnerships
POST /partnerships/request # Solicitar partnership

# Deals
GET /deals                # Listar deals
POST /deals               # Criar deal
PATCH /deals/:id/close    # Fechar e disparar splits
```

### Swagger UI

```
http://localhost:3000/api/docs
```

Abre interface interativa para testar todos endpoints.

---

## 🎯 Next Steps

1. ✅ Setup ambiente local
2. ✅ Database migrations rodando
3. ✅ Frontend + Backend em dev
4. 📝 **Próximo:** Implementar Sprint 1 (auth, boat CRUD, leads)

---

**Environment Setup Version:** 1.0  
**Last Updated:** 2024-05-04  
**Maintainer:** Engineering Team
