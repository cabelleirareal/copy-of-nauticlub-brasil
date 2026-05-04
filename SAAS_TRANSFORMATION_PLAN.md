# 🚀 NautiClub SaaS Transformation Plan
## From Static Frontend → FastSale-Style MLS Platform for Boats

> **Modelo:** FastSale (MLS imobiliário com co-corretagem) aplicado ao mercado náutico
> **Stack atual reutilizado:** React 19 + Vite + Tailwind + TypeScript
> **Ambição:** Plataforma colaborativa entre corretores náuticos com commission split

---

## 🧠 STEP 1 — SYSTEM EVOLUTION

### O que existe hoje
- **Frontend estático**: React 19 + Vite + Tailwind + React Router (HashRouter)
- **Dados hardcoded** em `constants.ts` (BOATS, BRAND_PARTNERS, CONTACT_INFO)
- **8 páginas institucionais**: Home, Catalog, Sell, Inspection, Shipyards, Brands, About, Contact
- **Tipos TypeScript** já definidos: `Boat`, `Lead`, `BrandPartner`, `BoatStatus`
- **Captura de lead** via `LeadModal` (não persiste — só estado local)
- **WhatsApp button** flutuante (canal único de conversão)
- **Sem auth, sem DB, sem API, sem CRM, sem colaboração**

### O que precisa ser adicionado para virar SaaS

| Camada | Falta hoje | Solução |
|---|---|---|
| **Backend** | Inexistente | NestJS + Postgres + Prisma |
| **Auth** | Inexistente | JWT + refresh tokens + roles (Owner/Broker/Buyer/Admin) |
| **Persistência** | constants.ts | Postgres com Prisma ORM |
| **Storage** | URLs hardcoded | S3 (ou Supabase Storage) p/ fotos/vídeos |
| **CRM/Pipeline** | Modal isolado | Lead lifecycle (NEW → CONTACTED → QUALIFIED → PROPOSAL → DEAL) |
| **Colaboração** | Nenhum | Sistema de Partnerships (co-broker) |
| **Pagamentos** | Nenhum | Stripe/Pagar.me p/ subscriptions e commission splits |
| **Notificações** | Nenhum | Email (Resend) + WhatsApp Business API |
| **Analytics** | Nenhum | Eventos de funil (visualização → lead → deal) |
| **Multi-tenant** | N/A | Brokers como tenants leves (escopo de dados) |

---

## 🔁 STEP 2 — FASTSALE MODEL APPLIED

### Mapeamento Direto

| FastSale (Imóveis) | NautiClub (Náutico) |
|---|---|
| Imóvel | **Boat** (Asset) |
| Proprietário | **Owner** (dono do barco) |
| Corretor captador | **Listing Broker** (cadastrou o barco) |
| Corretor parceiro | **Partner Broker** (co-broker autorizado) |
| Cliente comprador | **Lead/Buyer** |
| Parceria de venda | **Partnership** (co-corretagem) |
| Negócio fechado | **Deal** (transação) |
| Comissão dividida | **Commission Split** |

### Lógica de Commission Split (FastSale-style)

```
Comissão Total da Venda = Preço × % Comissão (ex: 5%)

Distribuição padrão (configurável por deal):
├─ Plataforma (NautiClub): 10–20% da comissão (success fee)
├─ Listing Broker: 40–50% (capta + nutre)
└─ Partner Broker: 30–40% (traz o comprador)

Se não houver parceria → Listing Broker fica com 80–90%
Se Owner vendeu direto via plataforma → Plataforma fica com 5–10%
```

### Regras de Colaboração

1. **Listing Broker** marca barco como "Aberto a parcerias" (default ON em planos pagos)
2. **Partner Broker** envia request → notificação ao Listing Broker + Owner
3. **Approval** dispara contrato digital (DocuSign/clicksign) com termos do split
4. Após approval → Partner Broker ganha acesso completo (fotos HD, contatos do owner sob NDA)
5. Cada lead trazido pelo Partner Broker é atribuído a ele automaticamente
6. Deal fechado dispara cálculo automático de splits

---

## ⚙️ STEP 3 — BACKEND DESIGN (NestJS)

### Stack
- **Framework:** NestJS (Node.js) — modular, decorators, TypeScript nativo
- **ORM:** Prisma (compatível com tipos do frontend)
- **DB:** PostgreSQL (Supabase ou Neon p/ MVP)
- **Cache:** Redis (sessões + rate limit)
- **Queue:** BullMQ (notificações async, splits, emails)
- **Storage:** S3/R2 ou Supabase Storage
- **Auth:** Passport + JWT + refresh tokens

### Módulos

```
backend/src/
├── auth/              → Login, signup, refresh, OAuth (Google)
├── users/             → CRUD + roles (OWNER, BROKER, BUYER, ADMIN)
├── boats/             → CRUD de embarcações + visibility rules
├── media/             → Upload S3, image processing (sharp), watermarks
├── leads/             → Captura, pipeline, atribuição
├── partnerships/      → Request, approve, reject, terms
├── deals/             → Negociação, contratos, fechamento, splits
├── commissions/       → Cálculo e payout via Stripe Connect
├── notifications/     → Email + WhatsApp + in-app
├── subscriptions/     → Planos de broker (free/pro/agency)
├── analytics/         → Tracking de eventos, funil
└── admin/             → Backoffice
```

### Responsabilidades-chave

#### `boats/` — Service principal
- `createBoat(brokerId, dto)` — cria barco e marca o broker como listing
- `findVisibleForUser(userId)` — aplica filtros: público | partnership | own
- `markOpenToPartnership(boatId)` — flag p/ MLS
- `transferListing(boatId, newBrokerId)` — repasse de captação

#### `partnerships/` — Coração do MLS
- `requestPartnership(boatId, brokerId, terms)` — cria PENDING
- `approvePartnership(partnershipId, ownerSignature)` — gera contrato + ativa
- `revokePartnership(partnershipId, reason)` — encerra c/ histórico
- Estados: `PENDING → APPROVED → ACTIVE → COMPLETED | REVOKED | EXPIRED`

#### `deals/` — Lifecycle de venda
- `createDeal(boatId, leadId, agreedPrice, brokers[])` — abre negociação
- `addCommissionSplit(dealId, splits[])` — define %s por broker
- `closeDeal(dealId)` — dispara payouts via Stripe Connect
- Estados: `NEGOTIATING → CONTRACT → SIGNED → PAID → COMPLETED`

#### `leads/` — CRM
- `captureLead(boatId, dto)` — público (LeadModal) → atribui ao listing broker
- `assignToBroker(leadId, brokerId)` — manual ou via parceria
- Pipeline: `NEW → CONTACTED → QUALIFIED → VISIT → PROPOSAL → DEAL_OR_LOST`

---

## 🗄️ STEP 4 — DATABASE MODEL (Prisma)

```prisma
// Core entities

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String   // bcrypt hash
  name          String
  phone         String?
  role          Role     // OWNER | BROKER | BUYER | ADMIN
  avatar        String?
  brokerProfile BrokerProfile?
  boats         Boat[]   @relation("ListedBy")
  ownedBoats   Boat[]   @relation("OwnedBy")
  leadsAsBuyer  Lead[]   @relation("BuyerLeads")
  partnerships  Partnership[]
  createdAt     DateTime @default(now())
}

model BrokerProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  cnpj            String?
  licenseNumber   String?  // CRECI náutico (se houver)
  bio             String?
  cityRegion      String?
  rating          Float    @default(0)
  totalDeals      Int      @default(0)
  subscriptionTier Tier    @default(FREE)
  stripeAccountId String?  // p/ Stripe Connect
}

model Boat {
  id            String      @id @default(uuid())
  name          String
  brand         String
  year          Int
  size          Float       // pés
  price         Decimal
  type          BoatType    // YACHT | CRUISER | SPORT | JET_SKI | LANCHA
  status        BoatStatus  @default(AVAILABLE)
  description   String?
  specs         Json        // { pax, engine, hours, fuel, ... }
  location      String?
  marina        String?

  // Listing & ownership
  ownerId       String
  owner         User        @relation("OwnedBy", fields: [ownerId], references: [id])
  listingBrokerId String?
  listingBroker User?       @relation("ListedBy", fields: [listingBrokerId], references: [id])

  // MLS controls
  openToPartnerships Boolean @default(false)
  defaultCommission  Decimal @default(5.0) // %
  defaultSplit       Json?   // { listing: 50, partner: 40, platform: 10 }
  featured          Boolean @default(false)

  media         BoatMedia[]
  leads         Lead[]
  partnerships  Partnership[]
  deals         Deal[]
  views         BoatView[]

  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model BoatMedia {
  id        String   @id @default(uuid())
  boatId    String
  boat      Boat     @relation(fields: [boatId], references: [id])
  url       String
  type      MediaType // IMAGE | VIDEO | DOC | 360_TOUR
  order     Int      @default(0)
  isCover   Boolean  @default(false)
  watermark Boolean  @default(true)
}

model Lead {
  id            String     @id @default(uuid())
  boatId        String?
  boat          Boat?      @relation(fields: [boatId], references: [id])

  // Contact
  name          String
  email         String
  phone         String
  message       String?

  // Attribution
  buyerId       String?    // se logado
  buyer         User?      @relation("BuyerLeads", fields: [buyerId], references: [id])
  assignedBrokerId String?
  source        LeadSource // ORGANIC | LISTING_BROKER | PARTNER_BROKER | ADS

  // Pipeline
  status        LeadStatus @default(NEW)
  type          LeadType   // INTEREST | SELL | INSPECTION | SHIPYARD
  notes         Note[]

  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model Partnership {
  id              String   @id @default(uuid())
  boatId          String
  boat            Boat     @relation(fields: [boatId], references: [id])
  partnerBrokerId String
  partnerBroker   User     @relation(fields: [partnerBrokerId], references: [id])
  listingBrokerId String

  status          PartnershipStatus @default(PENDING)
  // PENDING | APPROVED | ACTIVE | REVOKED | EXPIRED | COMPLETED

  terms           Json     // { commission: 5, split: {listing: 50, partner: 40, platform: 10} }
  contractUrl     String?  // PDF assinado
  signedAt        DateTime?
  expiresAt       DateTime?

  notes           String?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model Deal {
  id              String   @id @default(uuid())
  boatId          String
  boat            Boat     @relation(fields: [boatId], references: [id])
  leadId          String?
  buyerId         String?

  agreedPrice     Decimal
  commissionTotal Decimal  // valor absoluto
  splits          CommissionSplit[]

  status          DealStatus @default(NEGOTIATING)
  // NEGOTIATING | CONTRACT | SIGNED | PAID | COMPLETED | CANCELLED

  contractUrl     String?
  closedAt        DateTime?
  paidAt          DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

model CommissionSplit {
  id        String   @id @default(uuid())
  dealId    String
  deal      Deal     @relation(fields: [dealId], references: [id])
  recipientUserId String?  // null = plataforma
  role      SplitRole // LISTING_BROKER | PARTNER_BROKER | PLATFORM | OWNER_REFERRAL
  percent   Decimal
  amount    Decimal
  paidOut   Boolean   @default(false)
  stripeTransferId String?
}

model BoatView {
  id        String   @id @default(uuid())
  boatId    String
  boat      Boat     @relation(fields: [boatId], references: [id])
  userId    String?
  ip        String?
  createdAt DateTime @default(now())
}

enum Role        { OWNER BROKER BUYER ADMIN }
enum Tier        { FREE PRO AGENCY }
enum BoatType    { YACHT CRUISER SPORT JET_SKI LANCHA SAILBOAT }
enum BoatStatus  { AVAILABLE RESERVED SOLD PAUSED }
enum LeadStatus  { NEW CONTACTED QUALIFIED VISIT PROPOSAL WON LOST }
enum LeadType    { INTEREST SELL INSPECTION SHIPYARD }
enum LeadSource  { ORGANIC LISTING_BROKER PARTNER_BROKER ADS WHATSAPP }
enum PartnershipStatus { PENDING APPROVED ACTIVE REVOKED EXPIRED COMPLETED }
enum DealStatus  { NEGOTIATING CONTRACT SIGNED PAID COMPLETED CANCELLED }
enum SplitRole   { LISTING_BROKER PARTNER_BROKER PLATFORM OWNER_REFERRAL }
enum MediaType   { IMAGE VIDEO DOC TOUR_360 }
```

### Relacionamentos Críticos

```
User (BROKER) ──┬─ lists ──────► Boat ◄── owns ── User (OWNER)
                │                  │
                │                  ├─► BoatMedia[]
                │                  ├─► Lead[] ──── Buyer
                │                  ├─► Partnership[] ──► Partner Broker
                │                  └─► Deal ──► CommissionSplit[]
```

---

## 🔌 STEP 5 — FRONTEND EVOLUTION (Refactor do código atual)

### Estratégia: Manter UI luxuosa, plugar API

#### 5.1 — Camada de dados
```typescript
// src/api/client.ts
import axios from 'axios';
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// src/api/boats.ts
export const boatsApi = {
  list: (filters) => api.get<Boat[]>('/boats', { params: filters }),
  get: (id) => api.get<Boat>(`/boats/${id}`),
  create: (dto) => api.post<Boat>('/boats', dto),
  update: (id, dto) => api.patch<Boat>(`/boats/${id}`, dto),
};
```

#### 5.2 — React Query para cache
```bash
npm install @tanstack/react-query axios zustand
```

```typescript
// src/hooks/useBoats.ts
export const useBoats = (filters) =>
  useQuery({
    queryKey: ['boats', filters],
    queryFn: () => boatsApi.list(filters).then(r => r.data),
  });
```

#### 5.3 — Refactor dos componentes existentes

**`pages/Catalog.tsx`** — substituir `BOATS` static:
```typescript
// ANTES: import { BOATS } from '../constants';
// DEPOIS:
const { data: boats = [], isLoading } = useBoats({ type: filterType, q: searchTerm });
```

**`components/LeadModal.tsx`** — submit p/ API:
```typescript
const { mutate: submitLead } = useMutation({
  mutationFn: (lead: Lead) => leadsApi.create(lead),
  onSuccess: () => toast.success('Recebemos seu interesse!')
});
```

**`components/BoatCard.tsx`** — adicionar badge de "Aberto a parceria":
```tsx
{boat.openToPartnerships && user?.role === 'BROKER' && (
  <Badge>Co-broker disponível</Badge>
)}
```

#### 5.4 — Rotas novas (autenticadas)
```
/login                  — Login
/signup                 — Cadastro (escolhe role)
/app                    — Layout dashboard autenticado
  /app/dashboard        — KPIs do broker
  /app/boats            → My Boats (CRUD)
  /app/boats/new        → Cadastro c/ uploader
  /app/boats/:id        → Detalhe + edição
  /app/leads            → Pipeline (Kanban)
  /app/partnerships     → Inbox de parcerias (in/out)
  /app/deals            → Pipeline de fechamentos
  /app/settings/billing → Subscription + Stripe Connect
```

#### 5.5 — Layout autenticado
```
src/layouts/AppLayout.tsx
├── Sidebar (My Boats, Leads, Partnerships, Deals, Analytics)
├── Topbar (search global, notifications, user menu)
└── Outlet
```

#### 5.6 — Estado global mínimo (Zustand)
```typescript
// src/stores/auth.ts
export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: async (email, pwd) => { /* ... */ },
  logout: () => set({ user: null, token: null }),
}));
```

---

## 🔥 STEP 6 — CORE FEATURE: Sistema de Colaboração

### Fluxo Completo

```
┌─────────────────────────────────────────────────────────┐
│ 1. LISTING BROKER cadastra barco                        │
│    └─ marca "openToPartnerships = true"                 │
│    └─ define defaultSplit { listing:50, partner:40, plat:10 }
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 2. PARTNER BROKER navega no MLS interno                 │
│    └─ vê barcos com badge "Aberto a co-broker"          │
│    └─ clica "Solicitar parceria"                        │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 3. PARTNERSHIP request criada (status=PENDING)          │
│    └─ notificação push/email p/ Listing Broker          │
│    └─ pode propor terms diferentes do default           │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 4. LISTING BROKER aprova/rejeita/contrapropõe           │
│    └─ se APPROVED → Owner também notificado p/ ciência  │
│    └─ contrato digital gerado e assinado                │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 5. PARTNERSHIP ACTIVE                                   │
│    └─ Partner Broker ganha:                             │
│       - acesso a fotos HD + docs sob NDA digital        │
│       - link único de divulgação (UTM próprio)          │
│       - pipeline de leads atribuídos a ele              │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 6. Lead chega via Partner Broker → Deal aberta          │
│    └─ commissionSplits calculado automaticamente        │
│    └─ contratos assinados via Clicksign                 │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│ 7. DEAL fecha → Stripe Connect distribui split          │
│    └─ Plataforma retém success fee                      │
│    └─ Brokers recebem direto na conta                   │
└─────────────────────────────────────────────────────────┘
```

### Estados & Permissões

| Estado | Listing Broker | Partner Broker | Owner | Buyer |
|---|---|---|---|---|
| PENDING | aprova/rejeita/edita | edita pedido | – | – |
| APPROVED | revoga | aceita termos | assina ciência | – |
| ACTIVE | gerencia leads próprios | gerencia leads próprios | acompanha | converte |
| COMPLETED | recebe split | recebe split | recebe valor | é o comprador |
| REVOKED | – (motivo registrado) | – | – | – |

### Edge Cases (críticos)

1. **Lead atribuído mas Partnership revogada** → Lead transferido p/ Listing Broker com aviso
2. **Mesmo lead vem por canais diferentes** → first-touch attribution (24h window)
3. **Owner remove barco** → Partnership ACTIVE notificada + chance de migrar p/ outro barco
4. **Partner Broker fecha venda fora da plataforma** → cláusula contratual com penalidade (revisão manual)
5. **Disputa de comissão** → status DISPUTED, freeze de payout, mediação Admin
6. **Broker sem Stripe Connect** → bloquear close do deal até onboarding

---

## 💰 STEP 7 — MONETIZATION

### Modelo Híbrido (3 streams)

#### 1. **Success Fee (% por deal)** — receita principal
- 10–20% da comissão total do barco vendido
- Cobrado automaticamente via Stripe no momento do payout
- **Vantagem:** alinhado com sucesso do cliente, gera GMV

#### 2. **SaaS Subscription para Brokers** — receita recorrente

| Plano | Preço | Limites | Recursos |
|---|---|---|---|
| **Free** | R$ 0 | até 3 barcos | Listing básico, 1 parceria/mês |
| **Pro** | R$ 297/mês | até 30 barcos | Parcerias ilimitadas, fotos HD, analytics |
| **Agency** | R$ 997/mês | ilimitado | Multi-broker, white label, API, prioritário |

#### 3. **Premium Listings & Add-ons**
- Destaque na home: R$ 197/mês por barco
- Boost em buscas: R$ 47/anúncio
- Vídeo profissional + tour 360°: R$ 1.500 (parceiros fotógrafos, 30% revenue share)
- Inspeção técnica como serviço: R$ 800–2.500 (já presente no site!)
- Lead premium (verified buyer): R$ 27/lead

### LTV/CAC esperado (estimativa)
```
Pro plan: R$ 297/mês × 18 meses média = R$ 5.346 LTV (subscription)
+ ticket médio venda: R$ 800k × 5% comissão × 15% success fee = R$ 6.000/deal
Broker fecha ~3 deals/ano via plataforma = R$ 18.000 GMV/broker/ano
```

---

## 🚀 STEP 8 — MVP PLAN (Sequência exata sobre o repo atual)

### Princípio: **enviar valor em 6 semanas**

#### **Sprint 1 (semana 1–2) — Backend mínimo + Auth**
1. ✅ Bootstrap NestJS no monorepo (`/backend`)
2. ✅ Postgres + Prisma + migrations das tabelas core (User, Boat, Lead)
3. ✅ Auth: signup/login/JWT + refresh
4. ✅ Endpoints: `POST /auth/*`, `GET/POST /boats`, `POST /leads`

#### **Sprint 2 (semana 3) — Plug do frontend**
1. ✅ Adicionar `axios` + `@tanstack/react-query` + `zustand`
2. ✅ Refactor `Catalog.tsx` para consumir `GET /boats`
3. ✅ Refactor `LeadModal.tsx` para `POST /leads`
4. ✅ Páginas `/login` e `/signup` com UI luxo já existente
5. ✅ Seed com os 2 barcos de `constants.ts` no Postgres

#### **Sprint 3 (semana 4) — Dashboard Broker**
1. ✅ Layout `/app` com sidebar
2. ✅ `/app/boats` — CRUD com upload S3 (start: presigned URLs)
3. ✅ `/app/leads` — lista simples (Kanban depois)
4. ✅ Atribuição automática: lead novo → listing broker

#### **Sprint 4 (semana 5) — Partnership v1 (o diferencial!)**
1. ✅ Toggle "Aberto a parcerias" no boat
2. ✅ Marketplace interno: `/app/partnerships/discover` (lista boats abertos)
3. ✅ Request → Approve flow simples (sem contrato digital ainda — vem v2)
4. ✅ Notificações via email (Resend)

#### **Sprint 5 (semana 6) — Deals + Splits básicos**
1. ✅ `Deal` model + endpoint
2. ✅ Split calculator (sem payout automático ainda)
3. ✅ Dashboard com KPIs: "Comissão a receber", "Deals em aberto"

#### **Pós-MVP (V2):**
- Stripe Connect + payout automático
- Contratos digitais (Clicksign API)
- WhatsApp Business API
- Analytics avançado
- Mobile (React Native reusing types)

### Reuso máximo do que já existe

| Asset atual | Como reusar |
|---|---|
| Páginas institucionais (Home, About) | Mantém intactas — viram landing/SEO |
| `types.ts` | Vira fonte de verdade compartilhada (move p/ packages/shared) |
| `BoatCard.tsx` | Recebe boat dinâmico, ganha props extras |
| `LeadModal.tsx` | Só troca submit handler |
| `constants.ts` | Vira seed do banco |
| Tailwind config | Mantém (design system pronto) |
| `Sell.tsx` | Vira fluxo "owner cadastra barco" |
| `Inspection.tsx` | Vira produto pago real |
| `Shipyards.tsx` | Vira plano Agency target |

---

## 🧠 STEP 9 — STRATEGIC INSIGHT

### O que é fácil
- ✅ **CRUD de barcos** — comum, framework-friendly
- ✅ **Auth + dashboard** — boilerplate
- ✅ **UI** — já está luxuosa, design pronto
- ✅ **Lead capture** — 1 endpoint
- ✅ **Stripe integration** — bem documentado
- ✅ **Site SEO** — Vite + páginas estáticas já indexáveis

### O que é difícil (na ordem do risco)

#### 1. **Liquidez da rede (chicken-and-egg)** ⚠️⚠️⚠️
Sem barcos, brokers não chegam. Sem brokers, owners não cadastram.
**Solução:**
- Bootstrap manual: NautiClub vira o "primeiro broker" e captura 50–100 barcos via parceria com estaleiros (Shipyards page já mira nisso!)
- Programa de "founding brokers" com 0% success fee no 1º ano
- Importação assistida de inventário existente de brokers

#### 2. **Confiança no commission split** ⚠️⚠️
Brokers temem o parceiro "roubar" o cliente.
**Solução:**
- Contratos digitais robustos (Clicksign)
- NDA automático no acesso a docs
- Histórico público de reputação (rating após cada deal)
- Garantia de payout via escrow (plataforma retém até deal fechado)

#### 3. **Verticalização náutica** ⚠️
Documentação náutica (Tribunal Marítimo, Capitania) é específica.
**Solução:**
- Parceria com despachante marítimo (revenue share)
- Templates de contrato validados por advogado especializado

#### 4. **Ticket alto, ciclo longo** ⚠️
Venda média 200k–5M, ciclo 60–180 dias.
**Solução:**
- Foco em volume de leads (não dependa de 1 deal)
- Receita recorrente via subscriptions paga as contas no curto prazo
- Conteúdo educacional p/ encurtar ciclo (decision support)

### Como crescer base inicial (playbook)

1. **Aproveite Balneário Camboriú/SC** — já é HQ no contato. Concentre esforço local primeiro (densidade > escala)
2. **Programa de captação assistida**: time da NautiClub vai a marinas, fotografa e cadastra inventário de owners — broker recebe lead pronto
3. **Estaleiros como âncora B2B**: já há página `Shipyards.tsx`. Use isso. Estaleiros têm seminovos para revender e querem MLS
4. **Inspeção como produto-âncora**: vende mais barato, gera dados, captura owners e brokers no funil
5. **Eventos**: São Paulo Boat Show, Rio Boat Show — presencial vende SaaS B2B
6. **Conteúdo SEO**: páginas já são luxo; adicionar blog "Guia completo de comprar lancha usada" capta tráfego orgânico de buyers

### Métricas que importam (Norte)
- **GMV** — volume vendido na plataforma (R$/mês)
- **Brokers ativos** — fizeram ≥1 ação na semana
- **Co-broker conversion rate** — % de partnerships que viram deal
- **Time-to-first-deal** — dias desde cadastro do broker até 1º deal

---

## 📐 ARQUITETURA FINAL — Vista de Cima

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTES (browsers)                      │
└──────┬──────────────────────────────────────────┬───────────┘
       │                                          │
       ▼                                          ▼
┌──────────────────┐                  ┌──────────────────────┐
│  Public Site     │                  │  App Dashboard       │
│  (Vite SSG)      │                  │  (Vite SPA)          │
│  Home, Catalog,  │                  │  Boats, Leads,       │
│  About, Sell...  │                  │  Partnerships, Deals │
└──────┬───────────┘                  └──────────┬───────────┘
       │                                         │
       └────────────┬────────────────────────────┘
                    │ HTTPS
                    ▼
        ┌────────────────────────┐
        │  NestJS API Gateway    │
        │  (REST + WebSocket)    │
        └───┬────────────────┬───┘
            │                │
   ┌────────▼─────┐    ┌─────▼──────────┐
   │  PostgreSQL  │    │  Redis (cache) │
   │  (Prisma)    │    │  + BullMQ      │
   └──────────────┘    └────────────────┘
            │                │
   ┌────────▼─────┐   ┌──────▼──────┐   ┌────────────┐
   │  S3/R2       │   │  Stripe     │   │  Resend    │
   │  (media)     │   │  Connect    │   │  (email)   │
   └──────────────┘   └─────────────┘   └────────────┘
                          │
                  ┌───────▼────────┐
                  │  Clicksign     │
                  │  (contratos)   │
                  └────────────────┘
```

---

## ✅ DECISÕES IMEDIATAS (próximos passos práticos)

1. **Crie monorepo:** `pnpm workspace` com `/web` (frontend atual) e `/backend` (NestJS)
2. **Mova `types.ts`** para `/packages/shared/src/types.ts`
3. **Provisione**: Supabase (Postgres + Storage), Vercel (frontend), Railway/Render (backend)
4. **Setup Sprint 1** já: NestJS + Prisma + 3 endpoints + Catalog consumindo API
5. **Domínio:** registrar `app.nauticlub.com.br` (subdomínio dashboard)

---

**Doc criado:** 2026-05-04
**Premissa:** transformação incremental, sem reescrever o frontend
**Output esperado:** SaaS funcional em 6 semanas seguindo este plano
