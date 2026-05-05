# 🔌 NautiClub SaaS — API Specification

> **Status:** MVP Design (v1)  
> **Base URL:** `https://api.nauticlub.com.br/v1` (staging: `https://api-staging.nauticlub.com.br/v1`)  
> **Auth:** JWT Bearer Token  
> **Response Format:** JSON  
> **Rate Limit:** 1000 req/hour (pro brokers get 5000)

---

## 📚 Índice

1. [Authentication](#authentication)
2. [Users](#users)
3. [Boats](#boats)
4. [Leads](#leads)
5. [Partnerships](#partnerships)
6. [Deals](#deals)
7. [Commissions](#commissions)
8. [Error Handling](#error-handling)

---

## Authentication

### POST `/auth/signup`
Cadastro de novo usuário (Owner, Broker ou Buyer).

**Request**
```json
{
  "email": "broker@example.com",
  "password": "SecurePass123!",
  "name": "João Broker",
  "phone": "+5547999999999",
  "role": "BROKER",
  "brokerProfile": {
    "cnpj": "12.345.678/0001-90",
    "licenseNumber": "CRECI-123456",
    "cityRegion": "Balneário Camboriú, SC"
  }
}
```

**Response** `201 Created`
```json
{
  "id": "usr_7d8b9c0a1e2f3g4h",
  "email": "broker@example.com",
  "name": "João Broker",
  "role": "BROKER",
  "token": "eyJhbGc...",
  "refreshToken": "ref_...",
  "expiresIn": 3600
}
```

**Errors**
- `409 Conflict` — Email já registrado
- `400 Bad Request` — Validação de senha ou dados

---

### POST `/auth/login`
Login com email + senha.

**Request**
```json
{
  "email": "broker@example.com",
  "password": "SecurePass123!"
}
```

**Response** `200 OK`
```json
{
  "id": "usr_7d8b9c0a1e2f3g4h",
  "email": "broker@example.com",
  "role": "BROKER",
  "token": "eyJhbGc...",
  "refreshToken": "ref_...",
  "expiresIn": 3600
}
```

---

### POST `/auth/refresh`
Renovar JWT expirado.

**Request**
```json
{
  "refreshToken": "ref_..."
}
```

**Response** `200 OK`
```json
{
  "token": "eyJhbGc...",
  "expiresIn": 3600
}
```

---

### POST `/auth/logout`
Invalidar token (blacklist no Redis).

**Request**
```
Header: Authorization: Bearer eyJhbGc...
```

**Response** `200 OK`
```json
{
  "message": "Logged out"
}
```

---

## Users

### GET `/users/me`
Perfil do usuário autenticado.

**Request**
```
Header: Authorization: Bearer eyJhbGc...
```

**Response** `200 OK`
```json
{
  "id": "usr_7d8b9c0a1e2f3g4h",
  "email": "broker@example.com",
  "name": "João Broker",
  "phone": "+5547999999999",
  "role": "BROKER",
  "avatar": "https://s3.r2.../avatar.jpg",
  "brokerProfile": {
    "id": "brk_...",
    "cnpj": "12.345.678/0001-90",
    "licenseNumber": "CRECI-123456",
    "cityRegion": "Balneário Camboriú, SC",
    "rating": 4.8,
    "totalDeals": 12,
    "subscriptionTier": "PRO",
    "stripeAccountId": "acct_..."
  },
  "createdAt": "2024-05-04T10:30:00Z"
}
```

---

### PATCH `/users/me`
Atualizar perfil.

**Request**
```json
{
  "name": "João Silva Broker",
  "phone": "+5547988888888",
  "avatar": "data:image/jpeg;base64,...",
  "brokerProfile": {
    "bio": "Especialista em lanchas",
    "cityRegion": "São Paulo, SP"
  }
}
```

**Response** `200 OK`
```json
{ /* same as GET /users/me */ }
```

---

## Boats

### GET `/boats`
Listar barcos com filtros.

**Query Params**
```
?type=YACHT&size_min=30&size_max=50&price_min=500000&price_max=2000000&location=SC&search=focker&skip=0&limit=20
```

**Response** `200 OK`
```json
{
  "data": [
    {
      "id": "boat_abc123",
      "name": "Focker 333 Gran Turismo",
      "brand": "Focker",
      "year": 2023,
      "size": 33,
      "price": 850000,
      "type": "LANCHA",
      "status": "AVAILABLE",
      "description": "Lancha moderna...",
      "location": "Balneário Camboriú, SC",
      "marina": "Marina Praia Center",
      "specs": {
        "pax": 12,
        "engine": "2x Mercury 350",
        "hours": 120,
        "fuel": 500
      },
      "ownerId": "usr_owner123",
      "ownerName": "Silva Náutica",
      "listingBrokerId": "usr_broker456",
      "openToPartnerships": true,
      "defaultCommission": 5.0,
      "featured": true,
      "media": [
        {
          "id": "med_001",
          "url": "https://s3.r2.../boat1.jpg",
          "type": "IMAGE",
          "order": 0,
          "isCover": true
        }
      ],
      "createdAt": "2024-05-01T14:22:00Z",
      "views": 342
    }
  ],
  "pagination": {
    "skip": 0,
    "limit": 20,
    "total": 145
  }
}
```

---

### GET `/boats/:id`
Detalhe completo de um barco.

**Response** `200 OK`
```json
{
  "id": "boat_abc123",
  "name": "Focker 333 Gran Turismo",
  "brand": "Focker",
  "year": 2023,
  "size": 33,
  "price": 850000,
  "type": "LANCHA",
  "status": "AVAILABLE",
  "description": "Lancha moderna...",
  "location": "Balneário Camboriú, SC",
  "marina": "Marina Praia Center",
  "specs": {
    "pax": 12,
    "engine": "2x Mercury 350",
    "hours": 120,
    "fuel": 500,
    "fuelType": "GASOLINA",
    "maxSpeed": 45
  },
  "ownerId": "usr_owner123",
  "owner": {
    "id": "usr_owner123",
    "name": "Silva Náutica",
    "avatar": "https://...",
    "rating": 4.9
  },
  "listingBrokerId": "usr_broker456",
  "listingBroker": {
    "id": "usr_broker456",
    "name": "João Broker",
    "avatar": "https://...",
    "rating": 4.8
  },
  "openToPartnerships": true,
  "defaultCommission": 5.0,
  "defaultSplit": {
    "listing": 50,
    "partner": 40,
    "platform": 10
  },
  "featured": true,
  "media": [
    {
      "id": "med_001",
      "url": "https://s3.r2.../boat1.jpg",
      "type": "IMAGE",
      "order": 0,
      "isCover": true,
      "watermark": true
    }
  ],
  "partnerships": [
    {
      "id": "prt_xyz",
      "partnerBrokerId": "usr_partner789",
      "partnerBrokerName": "Maria Partner",
      "status": "ACTIVE"
    }
  ],
  "createdAt": "2024-05-01T14:22:00Z",
  "updatedAt": "2024-05-04T09:15:00Z",
  "views": 342
}
```

---

### POST `/boats`
Criar novo barco (Owner ou Broker).

**Request**
```json
{
  "name": "Intermarine 48",
  "brand": "Intermarine",
  "year": 2022,
  "size": 48,
  "price": 1800000,
  "type": "YACHT",
  "description": "Elegância e potência...",
  "location": "Balneário Camboriú, SC",
  "marina": "Marina Praia Center",
  "specs": {
    "pax": 14,
    "engine": "2x MAN 800",
    "hours": 450,
    "fuel": 3000,
    "fuelType": "DIESEL",
    "maxSpeed": 32
  },
  "openToPartnerships": true,
  "defaultCommission": 5.0,
  "featured": false
}
```

**Response** `201 Created`
```json
{
  "id": "boat_new789",
  "name": "Intermarine 48",
  /* ... rest of boat object */
}
```

---

### PATCH `/boats/:id`
Atualizar barco (Owner ou Listing Broker apenas).

**Request**
```json
{
  "price": 1750000,
  "status": "RESERVED",
  "openToPartnerships": false,
  "description": "Preço revisado..."
}
```

**Response** `200 OK`
```json
{ /* updated boat */ }
```

---

### POST `/boats/:id/media`
Upload de imagem/vídeo (multipart/form-data).

**Request**
```
Content-Type: multipart/form-data

File: boat_photo.jpg (max 50MB)
type: IMAGE
order: 0
isCover: true
```

**Response** `201 Created`
```json
{
  "id": "med_new999",
  "url": "https://s3.r2.../med_new999.jpg",
  "type": "IMAGE",
  "order": 0,
  "isCover": true,
  "watermark": true
}
```

---

### DELETE `/boats/:id`
Deletar barco (Owner ou Listing Broker).

**Response** `204 No Content`

---

## Leads

### GET `/leads`
Listar leads do usuário (filtro por status, barco, etc.).

**Query Params**
```
?boatId=boat_abc&status=NEW&skip=0&limit=50
```

**Response** `200 OK`
```json
{
  "data": [
    {
      "id": "lead_001",
      "boatId": "boat_abc123",
      "boat": {
        "id": "boat_abc123",
        "name": "Focker 333",
        "price": 850000
      },
      "name": "Carlos Comprador",
      "email": "carlos@example.com",
      "phone": "+5511999999999",
      "message": "Muito interessado em agendar visita",
      "buyerId": "usr_buyer123",
      "assignedBrokerId": "usr_broker456",
      "source": "LISTING_BROKER",
      "status": "QUALIFIED",
      "type": "INTEREST",
      "notes": [
        {
          "id": "note_1",
          "text": "Cliente aprovado no crédito",
          "createdBy": "usr_broker456",
          "createdAt": "2024-05-03T15:30:00Z"
        }
      ],
      "createdAt": "2024-05-02T10:00:00Z",
      "updatedAt": "2024-05-03T15:30:00Z"
    }
  ],
  "pagination": {
    "skip": 0,
    "limit": 50,
    "total": 8
  }
}
```

---

### POST `/leads`
Capturar novo lead (público, sem auth).

**Request**
```json
{
  "boatId": "boat_abc123",
  "name": "Carlos Comprador",
  "email": "carlos@example.com",
  "phone": "+5511999999999",
  "message": "Muito interessado...",
  "type": "INTEREST"
}
```

**Response** `201 Created`
```json
{
  "id": "lead_new123",
  "name": "Carlos Comprador",
  "email": "carlos@example.com",
  "phone": "+5511999999999",
  "message": "Muito interessado...",
  "boatId": "boat_abc123",
  "assignedBrokerId": "usr_broker456",
  "source": "ORGANIC",
  "status": "NEW",
  "type": "INTEREST",
  "createdAt": "2024-05-04T12:00:00Z"
}
```

---

### PATCH `/leads/:id`
Atualizar status ou atribuição (Broker apenas).

**Request**
```json
{
  "status": "QUALIFIED",
  "assignedBrokerId": "usr_broker789"
}
```

**Response** `200 OK`
```json
{ /* updated lead */ }
```

---

### POST `/leads/:id/notes`
Adicionar nota ao lead.

**Request**
```json
{
  "text": "Cliente visitou o barco. Muito interessado. Vou seguir segunda."
}
```

**Response** `201 Created`
```json
{
  "id": "note_new",
  "text": "Cliente visitou o barco...",
  "createdBy": "usr_broker456",
  "createdAt": "2024-05-04T14:30:00Z"
}
```

---

## Partnerships

### GET `/partnerships`
Listar partnerships do broker (in e out).

**Query Params**
```
?status=ACTIVE&role=LISTING_BROKER&skip=0&limit=20
```

**Response** `200 OK`
```json
{
  "data": [
    {
      "id": "prt_001",
      "boatId": "boat_abc123",
      "boat": {
        "id": "boat_abc123",
        "name": "Focker 333",
        "price": 850000,
        "media": [{ "url": "https://...", "isCover": true }]
      },
      "partnerBrokerId": "usr_partner789",
      "partnerBroker": {
        "id": "usr_partner789",
        "name": "Maria Partner",
        "avatar": "https://...",
        "rating": 4.9
      },
      "listingBrokerId": "usr_broker456",
      "listingBroker": {
        "id": "usr_broker456",
        "name": "João Broker",
        "avatar": "https://..."
      },
      "status": "ACTIVE",
      "terms": {
        "commission": 5.0,
        "split": {
          "listing": 50,
          "partner": 40,
          "platform": 10
        }
      },
      "contractUrl": "https://s3.r2.../contract_signed.pdf",
      "signedAt": "2024-05-02T10:00:00Z",
      "expiresAt": "2025-05-02T10:00:00Z",
      "createdAt": "2024-05-01T09:00:00Z"
    }
  ],
  "pagination": {
    "skip": 0,
    "limit": 20,
    "total": 3
  }
}
```

---

### POST `/partnerships/request`
Partner Broker solicita parceria.

**Request**
```json
{
  "boatId": "boat_abc123",
  "proposedTerms": {
    "commission": 5.0,
    "split": {
      "listing": 50,
      "partner": 40,
      "platform": 10
    }
  },
  "notes": "Tenho network forte em SP. Vou trazer buyers qualificados."
}
```

**Response** `201 Created`
```json
{
  "id": "prt_new",
  "status": "PENDING",
  "boatId": "boat_abc123",
  "partnerBrokerId": "usr_partner789",
  "listingBrokerId": "usr_broker456",
  "terms": { /* proposed */ },
  "createdAt": "2024-05-04T12:00:00Z"
}
```

---

### PATCH `/partnerships/:id/approve`
Listing Broker aprova parceria.

**Request**
```json
{
  "contractUrl": "https://s3.r2.../contract_signed.pdf",
  "expiresAt": "2025-05-04T00:00:00Z"
}
```

**Response** `200 OK`
```json
{
  "id": "prt_001",
  "status": "ACTIVE",
  /* ... */
}
```

---

### PATCH `/partnerships/:id/reject`
Listing Broker rejeita.

**Request**
```json
{
  "reason": "Conflito de interesse na região"
}
```

**Response** `200 OK`
```json
{
  "id": "prt_001",
  "status": "REVOKED",
  /* ... */
}
```

---

### PATCH `/partnerships/:id/revoke`
Rescindir parceria ativa.

**Request**
```json
{
  "reason": "Falta de resultado",
  "effectiveDate": "2024-05-10T00:00:00Z"
}
```

**Response** `200 OK`
```json
{
  "id": "prt_001",
  "status": "REVOKED",
  /* ... */
}
```

---

## Deals

### GET `/deals`
Listar deals do broker.

**Query Params**
```
?status=ACTIVE&skip=0&limit=20
```

**Response** `200 OK`
```json
{
  "data": [
    {
      "id": "deal_001",
      "boatId": "boat_abc123",
      "boat": {
        "id": "boat_abc123",
        "name": "Focker 333",
        "price": 850000
      },
      "leadId": "lead_001",
      "lead": {
        "id": "lead_001",
        "name": "Carlos Comprador",
        "email": "carlos@example.com"
      },
      "agreedPrice": 820000,
      "commissionTotal": 41000,
      "splits": [
        {
          "id": "split_1",
          "recipientUserId": "usr_broker456",
          "role": "LISTING_BROKER",
          "percent": 50,
          "amount": 20500,
          "paidOut": false
        },
        {
          "id": "split_2",
          "recipientUserId": "usr_partner789",
          "role": "PARTNER_BROKER",
          "percent": 40,
          "amount": 16400,
          "paidOut": false
        },
        {
          "id": "split_3",
          "recipientUserId": null,
          "role": "PLATFORM",
          "percent": 10,
          "amount": 4100,
          "paidOut": false
        }
      ],
      "status": "CONTRACT",
      "contractUrl": "https://s3.r2.../deal_contract.pdf",
      "createdAt": "2024-05-03T11:00:00Z",
      "updatedAt": "2024-05-04T14:30:00Z"
    }
  ],
  "pagination": {
    "skip": 0,
    "limit": 20,
    "total": 2
  }
}
```

---

### POST `/deals`
Criar novo deal (Broker).

**Request**
```json
{
  "boatId": "boat_abc123",
  "leadId": "lead_001",
  "agreedPrice": 820000,
  "partnerBrokerIds": ["usr_partner789"],
  "splits": {
    "listing": 50,
    "partner": 40,
    "platform": 10
  }
}
```

**Response** `201 Created`
```json
{
  "id": "deal_new",
  "boatId": "boat_abc123",
  "leadId": "lead_001",
  "agreedPrice": 820000,
  "commissionTotal": 41000,
  "status": "NEGOTIATING",
  /* ... */
}
```

---

### PATCH `/deals/:id/close`
Fechar deal e disparar splits/payouts.

**Request**
```json
{
  "contractUrl": "https://s3.r2.../deal_signed.pdf",
  "closedAt": "2024-05-05T15:00:00Z"
}
```

**Response** `200 OK`
```json
{
  "id": "deal_001",
  "status": "PAID",
  "paidAt": "2024-05-05T15:30:00Z",
  "splits": [
    {
      "id": "split_1",
      "role": "LISTING_BROKER",
      "amount": 20500,
      "paidOut": true,
      "stripeTransferId": "tr_..."
    }
    /* ... */
  ]
}
```

---

## Commissions

### GET `/commissions/balance`
Saldo a receber do broker.

**Response** `200 OK`
```json
{
  "userId": "usr_broker456",
  "currency": "BRL",
  "balance": 45230.50,
  "pending": 12500,
  "paidOut": 32730.50,
  "lastPayout": "2024-05-01T14:00:00Z",
  "nextPayoutDate": "2024-05-15T00:00:00Z",
  "breakdown": {
    "asListingBroker": 32000,
    "asPartnerBroker": 13230.50
  }
}
```

---

### GET `/commissions/history`
Histórico de comissões e payouts.

**Query Params**
```
?skip=0&limit=30&status=PAID
```

**Response** `200 OK`
```json
{
  "data": [
    {
      "id": "split_001",
      "dealId": "deal_001",
      "dealBoatName": "Focker 333",
      "dealAgreedPrice": 820000,
      "role": "LISTING_BROKER",
      "percent": 50,
      "amount": 20500,
      "status": "PAID",
      "stripeTransferId": "tr_abc123",
      "paidAt": "2024-05-02T10:30:00Z",
      "createdAt": "2024-05-01T14:00:00Z"
    }
  ],
  "pagination": {
    "skip": 0,
    "limit": 30,
    "total": 42
  }
}
```

---

## Error Handling

### Standard Error Response

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "timestamp": "2024-05-04T15:30:00Z",
    "path": "/boats/abc123"
  }
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|---|---|---|
| 200 | OK | Sucesso geral |
| 201 | Created | Recurso criado |
| 204 | No Content | Deletado com sucesso |
| 400 | Bad Request | Validação falhou |
| 401 | Unauthorized | Token inválido/expirado |
| 403 | Forbidden | Sem permissão |
| 404 | Not Found | Recurso não existe |
| 409 | Conflict | Email duplicado, etc. |
| 422 | Unprocessable Entity | Lógica de negócio falhou |
| 429 | Too Many Requests | Rate limit |
| 500 | Server Error | Erro interno |

### Common Error Codes

```
UNAUTHORIZED         → JWT inválido
FORBIDDEN            → Sem permissão (ex: não é owner do barco)
NOT_FOUND            → Recurso não encontrado
VALIDATION_ERROR     → Campo obrigatório faltando
DUPLICATE_EMAIL      → Email já registrado
INVALID_SUBSCRIPTION → Plano não permite essa ação
PARTNERSHIP_CONFLICT → Conflito de parceria
BOAT_NOT_AVAILABLE   → Barco não pode ser vendido (status)
```

---

## Rate Limiting

- **Free brokers:** 1000 req/hora
- **Pro brokers:** 5000 req/hora
- **Agency brokers:** 20000 req/hora

Headers de resposta:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1620170400
```

---

## Pagination

Todas as listas usam padrão cursor-based:

```json
{
  "data": [ /* items */ ],
  "pagination": {
    "skip": 0,
    "limit": 20,
    "total": 145,
    "hasMore": true
  }
}
```

Use `skip + limit` para navegação simples (offset-based é mais amigável para web).

---

## WebSocket Events (Futuro v2)

Real-time notifications (conectar após login):

```javascript
// Conectar
const ws = new WebSocket('wss://api.nauticlub.com.br/v1/ws?token=jwt...');

// Eventos recebidos
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  switch (message.type) {
    case 'PARTNERSHIP_REQUEST':
      // { partnerId, boatId, terms }
      break;
    case 'PARTNERSHIP_APPROVED':
      // { partnershipId }
      break;
    case 'LEAD_ASSIGNED':
      // { leadId, boatId }
      break;
    case 'DEAL_CLOSED':
      // { dealId, splits[] }
      break;
  }
};
```

---

**API Spec Version:** 1.0  
**Last Updated:** 2024-05-04  
**Next Review:** Após Sprint 1
