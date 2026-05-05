# 🚀 Deployment Guide — NautiClub SaaS

> **Environments:** Staging, Production  
> **Infrastructure:** Supabase (DB), Vercel/Railway (Frontend), Railway/Render (Backend), S3/R2 (Media), Stripe (Payments)  
> **Approach:** Multi-repo + monorepo (packages/shared)

---

## 📋 Arquitetura de Deployment

```
monorepo/
├── packages/shared/        → TypeScript types, utils (npm package)
├── web/                    → React frontend (Vite) → Vercel
├── backend/                → NestJS API → Railway/Render
└── docs/                   → Documentação (this folder)

Fluxo de dados:
  Browser (web/) → API (backend/) → Supabase (DB) + S3 (files)
                                    ↓
                              Stripe Connect (payouts)
```

---

## 🗄️ Database Setup (Supabase)

### 1. Criar projeto Supabase

```bash
# Via Supabase CLI
supabase projects create --name nauticlub-prod --region us-east-1

# Ou via UI: supabase.com → New project
```

### 2. Environment variables

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... # apenas para backend
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres
```

### 3. Migrations (Prisma)

```bash
cd backend/

# Gerar schema (já feito em SAAS_TRANSFORMATION_PLAN.md)
touch prisma/schema.prisma

# Criar migration
npx prisma migrate dev --name init

# Deploy para produção
npx prisma migrate deploy

# Seed (dados iniciais)
npx prisma db seed
```

### 4. Storage (Supabase Storage ou S3)

**Opção A: Supabase Storage** (mais simples)
```bash
# Via Supabase dashboard: Storage → New bucket
# Buckets: "boats" (public), "contracts" (private), "avatars" (public)

# CORS rules
supabase storage cors set boats --allow-origins "*" --allow-methods "GET, POST, PUT, DELETE"
```

**Opção B: S3/R2** (mais escalável)
```bash
# AWS S3 ou Cloudflare R2
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_S3_BUCKET=nauticlub-prod
AWS_S3_REGION=us-east-1
AWS_S3_CDN_URL=https://cdn.nauticlub.com.br

# R2 (Cloudflare)
R2_ACCOUNT_ID=xxxxx
R2_ACCESS_KEY=xxxxx
R2_SECRET_KEY=xxxxx
R2_BUCKET=nauticlub
R2_CDN_URL=https://r2.nauticlub.com.br
```

---

## 🔧 Backend Setup (NestJS → Railway/Render)

### 1. Criar projeto no Railway/Render

**Railway:**
```bash
npm install -g @railway/cli
railway login
railway init  # gera railway.json
```

**Render:**
```
render.com → New+ → Web Service → GitHub repo
```

### 2. Variáveis de ambiente (.env)

```bash
# Server
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:pwd@db.supabase.co:5432/postgres
DATABASE_SSL=true

# JWT
JWT_SECRET=your-super-secret-key-min-32-chars-xxxxx
JWT_REFRESH_SECRET=another-secret-xxxxx
JWT_EXPIRES_IN=3600
JWT_REFRESH_EXPIRES_IN=604800

# API
API_URL=https://api.nauticlub.com.br/v1
FRONTEND_URL=https://app.nauticlub.com.br

# S3/R2
STORAGE_TYPE=r2  # ou s3
AWS_ACCESS_KEY_ID=xxxxx
AWS_SECRET_ACCESS_KEY=xxxxx
AWS_S3_BUCKET=nauticlub
AWS_S3_REGION=auto

# Email
RESEND_API_KEY=re_xxxxx

# Stripe
STRIPE_SECRET_KEY=sk_live_xxxxx
STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx

# WhatsApp (futuro)
WHATSAPP_BUSINESS_ACCOUNT_ID=xxxxx
WHATSAPP_PHONE_NUMBER_ID=xxxxx
WHATSAPP_ACCESS_TOKEN=xxxxx

# Redis (cache/queue)
REDIS_URL=redis://:password@hostname:6379

# Logging
LOG_LEVEL=info

# Admin email
ADMIN_EMAIL=admin@nauticlub.com.br
```

### 3. Dockerfile (Backend)

```dockerfile
# backend/Dockerfile

FROM node:20-alpine AS builder

WORKDIR /app

# Copy monorepo
COPY package.json pnpm-lock.yaml ./
COPY packages/ ./packages/
COPY backend/ ./backend/

RUN npm install -g pnpm && pnpm install --frozen-lockfile

WORKDIR /app/backend

RUN pnpm run build

# Production image
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 3000

CMD ["node", "dist/main.js"]
```

### 4. Deploy (Railway)

```bash
cd backend/

# Deploy via Git push (railway.json no root)
git add .
git commit -m "deployment: prepare for railway"
git push origin main

# Ou deploy direto
railway up

# Ver logs
railway logs -f
```

---

## 🌐 Frontend Setup (Vite → Vercel)

### 1. Variáveis de ambiente (.env)

```bash
# .env.local (desenvolvimento)
VITE_API_URL=http://localhost:3000/v1
VITE_GEMINI_API_KEY=xxxxx

# .env.staging
VITE_API_URL=https://api-staging.nauticlub.com.br/v1

# .env.production
VITE_API_URL=https://api.nauticlub.com.br/v1
```

### 2. Configuração Vercel

**vercel.json**
```json
{
  "projectId": "prj_xxxxx",
  "orgId": "org_xxxxx",
  "buildCommand": "pnpm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_API_URL": "@vite_api_url_prod",
    "VITE_GEMINI_API_KEY": "@vite_gemini_api_key"
  },
  "routes": [
    {
      "src": "/(.*)",
      "destination": "/index.html",
      "status": 200
    }
  ]
}
```

### 3. Deploy (Vercel CLI)

```bash
cd web/

npm install -g vercel

# Primeira vez (setup)
vercel

# Deploy staging
vercel --prod=false

# Deploy produção
vercel --prod

# Logs
vercel logs https://nauticlub-prod.vercel.app
```

---

## 🔐 DNS & SSL

### 1. Registrar domínios

```
nauticlub.com.br          → Vercel (frontend)
app.nauticlub.com.br      → Vercel (frontend com /app)
api.nauticlub.com.br      → Railway/Render (backend)
admin.nauticlub.com.br    → Vercel (admin dashboard)
```

### 2. Configurar CNAME/Nameservers

**Ponto A: Domínio principal**
```
nauticlub.com.br
├── @ (root)        → 76.76.19.21 (Vercel default IP)
├── www             → CNAME vercel.com
└── api             → CNAME api.railway.app (ou Render)
```

**Ponto B: SSL/TLS**
```
# Vercel: automático (Cloudflare)
# Railway: automático (Let's Encrypt)
# API: https://api.nauticlub.com.br (automático)
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**`.github/workflows/deploy.yml`**

```yaml
name: Deploy NautiClub

on:
  push:
    branches: [main, staging]

jobs:
  test-and-build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: "20"
      
      - name: Install pnpm
        uses: pnpm/action-setup@v2
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm run lint
      
      - name: Test backend
        run: pnpm --filter backend run test
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL_TEST }}
      
      - name: Build backend
        run: pnpm --filter backend run build
      
      - name: Build frontend
        run: pnpm --filter web run build

  deploy-backend:
    needs: test-and-build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}

  deploy-frontend:
    needs: test-and-build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel --prod --confirm
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

---

## 🗂️ Monorepo Setup (pnpm workspaces)

### pnpm-workspace.yaml

```yaml
packages:
  - 'packages/*'
  - 'web'
  - 'backend'
```

### package.json (root)

```json
{
  "name": "nauticlub-saas",
  "private": true,
  "scripts": {
    "dev": "pnpm --parallel run dev",
    "build": "pnpm --filter backend run build && pnpm --filter web run build",
    "test": "pnpm --filter backend run test",
    "lint": "pnpm --filter backend run lint && pnpm --filter web run lint",
    "db:migrate": "pnpm --filter backend run prisma migrate dev",
    "db:seed": "pnpm --filter backend run prisma db seed"
  }
}
```

---

## 📦 Shared Package (types, utils)

### packages/shared/package.json

```json
{
  "name": "@nauticlub/shared",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "dependencies": {
    "zod": "^3.22.0"
  }
}
```

### packages/shared/src/index.ts

```typescript
export * from './types';
export * from './validators';
export * from './constants';
```

### Frontend/Backend importam:

```typescript
import { Boat, Lead, BoatStatus } from '@nauticlub/shared';
import { validateBoat } from '@nauticlub/shared/validators';
```

---

## 🧪 Testing & Staging

### 1. Staging Environment

```bash
# Deploy para staging (antes de prod)
git push origin staging

# GitHub Actions dispara CI/CD para api-staging.nauticlub.com.br
```

### 2. E2E Tests (Playwright)

**tests/e2e/auth.spec.ts**
```typescript
import { test, expect } from '@playwright/test';

test.describe('Auth Flow', () => {
  test('should sign up a new broker', async ({ page }) => {
    await page.goto('http://localhost:3000/signup');
    await page.fill('input[name="email"]', 'broker@test.com');
    await page.fill('input[name="password"]', 'Test123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/app/boats');
  });
});
```

**package.json (web)**
```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0"
  }
}
```

### 3. Performance Monitoring

- **Frontend:** Vercel Analytics (built-in)
- **Backend:** Sentry or DataDog
- **Database:** Supabase dashboard

---

## 🔐 Secrets & Security

### GitHub Secrets

```
RAILWAY_TOKEN           → para deploy automático
VERCEL_TOKEN            → para deploy Vercel
DATABASE_URL            → Supabase connection string
STRIPE_SECRET_KEY       → Stripe live key
JWT_SECRET              → Bearer secret
RESEND_API_KEY          → Email service
```

### Rotação de secrets

```bash
# A cada 90 dias
# 1. Gerar novo JWT_SECRET
# 2. Adicionar ao GitHub Secrets
# 3. Invalidar tokens antigos (Redis TTL)
# 4. Fazer rollout gradual (rolling deployment)
```

---

## 📊 Monitoring & Logs

### Supabase Logs

```sql
-- Ver query lenta
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Backend Logs (Railway/Render)

```bash
# Railway CLI
railway logs -f --service api

# Render
# dashboard.render.com → Logs
```

### Error Tracking (Sentry)

**backend/main.ts**
```typescript
import * as Sentry from "@sentry/nestjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
});

const app = await NestFactory.create(AppModule);
Sentry.setupNestErrorHandler(app);
```

---

## 🔄 Rollback Procedure

### Se deploy quebrou

```bash
# Railway
railway logs -f  # checar erro
git revert <commit-hash>
git push origin main
railway up --confirm

# Vercel
vercel rollback

# Supabase migration
# Se migration falhou: reverter último migrate dev
prisma migrate resolve --rolled-back init
```

---

## ✅ Pre-Launch Checklist

- [ ] Database backups configurados (Supabase automático)
- [ ] SSL/TLS ativo em todos subdomínios
- [ ] CORS configurado (API aceita apenas app.nauticlub.com.br)
- [ ] Rate limiting ativo (1000 req/hora free)
- [ ] Email service testado (Resend)
- [ ] Stripe Connect configurado e testado
- [ ] Sentry/Datadog configurado
- [ ] Logs centralizados (Railway/Render)
- [ ] DNS propagado (~24h)
- [ ] Performance: Lighthouse score >90
- [ ] Smoke tests passando (Playwright)
- [ ] Load testing (k6 ou JMeter)

---

## 📈 Post-Launch Monitoring

### KPIs a monitorar

1. **API Health**
   - Uptime > 99.5%
   - Latency p50 < 200ms, p95 < 500ms
   - Error rate < 1%

2. **Frontend Health**
   - FCP < 1.5s
   - LCP < 2.5s
   - CLS < 0.1

3. **Database Health**
   - Connection pool utilization < 80%
   - Query latency p95 < 100ms
   - Disk usage trend

4. **Business Metrics**
   - Signups/day
   - Boats listed/day
   - Leads captured/day
   - Partnerships created/day

### Alerts

```yaml
# Alertmanager config (Prometheus)
- alert: APIErrorRateHigh
  expr: rate(http_requests_total{status="5xx"}[5m]) > 0.01
  annotations:
    summary: "API error rate > 1% for 5m"

- alert: DatabaseConnPoolExhausted
  expr: pg_stat_activity > 90
  annotations:
    summary: "DB connections > 90%"
```

---

## 🚀 Scaling Strategy (Futuro)

### MVP (atual)
- PostgreSQL: db-starter (1GB) na Supabase
- NestJS: 1 instância (Railway Hobby = $5/mês)
- Redis: Upstash free tier

### 10k brokers
- PostgreSQL: db-pro (100GB)
- NestJS: 2–3 instâncias + load balancer
- Redis: Upstash pro (cache + queue)
- CDN: Cloudflare (caching + WAF)

### 100k brokers
- Postgres: read replicas
- Sharding por região (BR/US)
- Cache layer: Redis cluster
- Message queue: RabbitMQ/Kafka
- Search: Elasticsearch (para catálogo)

---

**Deployment Guide Version:** 1.0  
**Last Updated:** 2024-05-04  
**Next Review:** Após Sprint 1 MVP
