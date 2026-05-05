# NautiClub Brasil - Development Guide

## 5-Minute Quick Start

### Prerequisites
- Node.js 20+ and pnpm
- Docker & Docker Compose (optional, for local database)
- PostgreSQL 15+ (if not using Docker)

### Setup

```bash
# 1. Clone and install dependencies
git clone https://github.com/cabelleirareal/copy-of-nauticlub-brasil.git
cd copy-of-nauticlub-brasil
pnpm install && cd backend && pnpm install && cd ..

# 2. Start PostgreSQL (using docker-compose)
docker-compose up -d

# 3. Copy environment file
cp .env.example .env
cd backend && cp .env.example .env && cd ..

# 4. Run database migrations and seed
pnpm db:migrate
pnpm db:seed

# 5. Start development servers
# Terminal 1: Backend (NestJS)
pnpm dev:backend

# Terminal 2: Frontend (React)
pnpm dev

# 6. Open in browser
# Frontend: http://localhost:5173
# Backend Swagger: http://localhost:3000/api/docs
```

## Project Structure

```
copy-of-nauticlub-brasil/
├── src/                          # Frontend (React 19)
│   ├── api/                       # API client layer
│   │   ├── client.ts              # Axios instance with interceptors
│   │   ├── auth.ts                # Auth API endpoints
│   │   ├── boats.ts               # Boats API endpoints
│   │   └── leads.ts               # Leads API endpoints
│   ├── stores/                    # Zustand stores
│   │   └── auth.ts                # Authentication state
│   ├── hooks/                     # React Query hooks
│   │   ├── useBoats.ts            # Boat queries/mutations
│   │   └── useLeads.ts            # Lead queries/mutations
│   ├── pages/                     # Page components
│   │   ├── Login.tsx              # Login page
│   │   └── Signup.tsx             # Signup page
│   └── components/
│       └── ProtectedRoute.tsx     # Auth guard component
├── backend/                       # Backend (NestJS 10)
│   ├── src/
│   │   ├── main.ts                # Application entry
│   │   ├── app.module.ts          # Root module
│   │   ├── auth/                  # Authentication module
│   │   ├── users/                 # Users module
│   │   ├── boats/                 # Boats CRUD module
│   │   ├── leads/                 # Leads pipeline module
│   │   ├── partnerships/          # Partnership requests/approval
│   │   ├── deals/                 # Deal management
│   │   ├── common/                # Guards, filters, decorators
│   │   └── prisma/                # Database service
│   ├── prisma/
│   │   ├── schema.prisma          # Database schema
│   │   └── seed.ts                # Test data seeding
│   └── test/
│       ├── auth.e2e-spec.ts       # Auth E2E tests
│       ├── boats.e2e-spec.ts      # Boats E2E tests
│       └── leads.e2e-spec.ts      # Leads E2E tests
├── docker-compose.yml             # PostgreSQL + Redis
├── .env                           # Environment variables
└── README.md                      # This file
```

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

### Backend (.env)
```env
DATABASE_URL="postgresql://nauticlub:nauticlub_dev@localhost:5432/nauticlub_dev"
JWT_SECRET="your-secret-key-here-min-32-characters"
JWT_REFRESH_SECRET="your-refresh-secret-key-min-32-characters"
PORT=3000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

## Running Services

### Backend Development
```bash
cd backend

# Start in watch mode
pnpm run start:dev

# Run Prisma Studio (visual DB editor)
pnpm run prisma:studio

# Run tests
pnpm test

# Run E2E tests
pnpm run test:e2e
```

### Frontend Development
```bash
# Start dev server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

### Database Management
```bash
# Run migrations
pnpm db:migrate

# Seed test data
pnpm db:seed

# View database with Prisma Studio
pnpm db:studio
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Login (returns JWT tokens)
- `POST /auth/refresh` - Refresh access token

### Users
- `GET /users/me` - Get authenticated user profile
- `PATCH /users/me` - Update user profile

### Boats
- `GET /boats` - List boats (public, filterable)
- `GET /boats/:id` - Get boat details (public)
- `POST /boats` - Create boat (auth: OWNER/BROKER)
- `PATCH /boats/:id` - Update boat (auth: owner/listing broker)
- `DELETE /boats/:id` - Delete boat (auth: owner/listing broker)

### Leads
- `POST /leads` - Capture lead (public, auto-assigns to listing broker)
- `GET /leads` - List leads (auth: assigned broker/admin)
- `PATCH /leads/:id` - Update lead status (auth: assigned broker/admin)

### Partnerships
- `GET /partnerships` - List partnerships (auth)
- `POST /partnerships` - Request partnership (auth: BROKER)
- `PATCH /partnerships/:id` - Approve/reject partnership (auth)

### Deals
- `GET /deals` - List deals (auth: parties involved)
- `POST /deals` - Create deal (auth: listing broker)
- `PATCH /deals/:id` - Update deal status (auth: parties involved)

## Test Users

After running `pnpm db:seed`, you have:

```
Broker:
  Email: broker@test.local
  Password: Test123!
  Role: BROKER

Owner:
  Email: owner@test.local
  Password: Test123!
  Role: OWNER

Test Boat:
  Name: Focker 333
  Price: R$ 250,000
  Location: Santos, SP
```

## Testing Workflow

### Login Flow
1. Go to http://localhost:5173/login
2. Enter: `broker@test.local` / `Test123!`
3. Should redirect to home page with authenticated user

### Catalog Browsing
1. Navigate to /catalogo
2. View boats from API
3. Click "Tenho Interesse" to open lead modal
4. Submit lead - should be auto-assigned to listing broker

### Lead Pipeline (Authenticated)
1. After login as broker, navigate to my leads
2. View leads assigned to you
3. Update lead status (NEW → CONTACTED → QUALIFIED)

## Debugging

### Enable Verbose Logging
Add to `.env`:
```env
DEBUG=nauticlub:*
```

### Inspect Network Requests
- Frontend: Use browser DevTools → Network tab
- API responses logged to console with `@tanstack/react-query` devtools

### Database Issues
```bash
# View current schema
pnpm db:studio

# Rollback last migration
cd backend && npx prisma migrate resolve --rolled-back [migration_name]

# Reset database (WARNING: deletes all data)
cd backend && npx prisma migrate reset
```

### Common Issues

**Port already in use:**
```bash
# Find process using port 5173
lsof -i :5173
# Kill it
kill -9 <PID>
```

**PostgreSQL connection error:**
```bash
# Check docker container
docker ps | grep postgres

# View logs
docker logs nauticlub-postgres

# Restart docker-compose
docker-compose down && docker-compose up -d
```

**Prisma migration issues:**
```bash
cd backend
# Sync schema without migration
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## Performance Tips

- Use React Query DevTools: Install [React Query DevTools](https://react-query.tanstack.com/devtools)
- Monitor API calls: Check backend `console.log` statements
- Profile frontend: Use Chrome DevTools → Lighthouse
- Check database performance: Use Prisma Studio query metrics

## Next Steps

1. **Authentication UI** - Add user menu in Navbar showing authenticated state
2. **Dashboard Pages** - Create `/app/my-boats` and `/app/my-leads` pages
3. **Real-time Updates** - Add WebSocket support for live notifications
4. **File Upload** - Implement boat media/image upload via S3/R2
5. **Payment Integration** - Connect Stripe for commission handling
6. **Email Notifications** - Setup Resend for email alerts
7. **Analytics** - Track user actions and KPIs

## Useful Links

- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Query Documentation](https://react-query.tanstack.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

For issues or questions, open a GitHub issue or contact the team.
