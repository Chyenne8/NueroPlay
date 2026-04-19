# NeuroPlay Architecture Diagram

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      NEUROPLAY FRONTEND                          │
│                    (React + TypeScript)                          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  KID MODE    │    │ CAREGIVER    │    │  ADMIN MODE  │
│  (Offline)   │    │   MODE       │    │  (Offline)   │
│              │    │ (Database)   │    │              │
│  Route: /    │    │ Route: /cg-* │    │ Route: /admin│
└──────────────┘    └──────────────┘    └──────────────┘
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ localStorage │    │  API Client  │    │ localStorage │
│              │    │  (utils/api) │    │              │
│ • User data  │    │              │    │ • Admin auth │
│ • Quiz data  │    │ • HTTP calls │    │ • User mgmt  │
│ • Results    │    │ • Error hand │    │              │
└──────────────┘    └──────────────┘    └──────────────┘
                              │
                              │ HTTP/REST
                              ▼
                    ┌──────────────────┐
                    │  BACKEND API     │
                    │  (Deno + Hono)   │
                    │                  │
                    │ Endpoints:       │
                    │ • /caregivers    │
                    │ • /children      │
                    │ • /sessions      │
                    │ • /stats         │
                    └──────────────────┘
                              │
                              │ Supabase Client
                              ▼
                    ┌──────────────────┐
                    │  KV STORE        │
                    │  (kv_store.tsx)  │
                    │                  │
                    │ • get(key)       │
                    │ • set(key, val)  │
                    │ • getByPrefix()  │
                    └──────────────────┘
                              │
                              │ SQL
                              ▼
                    ┌──────────────────┐
                    │    SUPABASE      │
                    │  (PostgreSQL)    │
                    │                  │
                    │ Table:           │
                    │ kv_store_3f31... │
                    │ • key (TEXT)     │
                    │ • value (JSONB)  │
                    └──────────────────┘
```

## Data Flow Diagrams

### 1. Kid Taking Quiz (Standalone Mode)

```
┌──────┐     ┌──────────┐     ┌──────────┐     ┌────────────┐
│ Kid  │────▶│ Login    │────▶│ Quiz     │────▶│ Dashboard  │
│      │     │ (/)      │     │ (15 ch.) │     │ (Results)  │
└──────┘     └──────────┘     └──────────┘     └────────────┘
                  │                  │                 │
                  ▼                  ▼                 ▼
            [localStorage]     [localStorage]   [localStorage]
              • username         • quizResults    • Read results
              • theme            • scores         • Display badges
              • settings         • preferences    • Show profile
```

### 2. Caregiver Managing Children (Database Mode)

```
┌───────────┐     ┌─────────────┐     ┌──────────────┐
│ Caregiver │────▶│   Login     │────▶│  Dashboard   │
│           │     │ (/cg-login) │     │ (/cg-dash)   │
└───────────┘     └─────────────┘     └──────────────┘
                        │                     │
                        ▼                     ▼
                  POST /login           GET /children
                        │                     │
                        ▼                     ▼
                  [Backend API]         [Backend API]
                        │                     │
                        ▼                     ▼
                  [Supabase DB]         [Supabase DB]
                  caregiver:email       caregiver:id:children
                        │                     │
                        └─────────────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │ Add Child         │
                        │ • POST /children  │
                        │ • child:id        │
                        └───────────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │ Child Takes Quiz  │
                        │ • localStorage    │
                        │ • POST /sessions  │
                        └───────────────────┘
                                  │
                        ┌─────────▼─────────┐
                        │ View Statistics   │
                        │ • GET /stats      │
                        │ • Aggregate data  │
                        └───────────────────┘
```

### 3. Session Save Flow

```
Child completes quiz
        │
        ▼
┌───────────────────┐
│ QuizGame.tsx      │
│ handleComplete()  │
└───────────────────┘
        │
        ├─────────────────────┬────────────────────┐
        ▼                     ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Save to      │    │ Check for    │    │ Update user  │
│ localStorage │    │ currentChild │    │ profile      │
└──────────────┘    └──────────────┘    └──────────────┘
                            │
                    ┌───────┴────────┐
                    │ Child exists?  │
                    └───────┬────────┘
                            │ Yes
                            ▼
                    ┌────────────────┐
                    │ api.saveSession│
                    │ (childId, data)│
                    └────────────────┘
                            │
                            ▼
                    POST /sessions
                            │
                            ▼
                    ┌────────────────┐
                    │ Backend saves  │
                    │ to Supabase:   │
                    │ session:id     │
                    │ child:id:sess  │
                    └────────────────┘
```

## Database Schema (Key-Value Store)

### Supabase Table: `kv_store_3f317989`

```sql
Table Structure:
┌──────────────┬─────────┬─────────────┐
│ Column       │ Type    │ Description │
├──────────────┼─────────┼─────────────┤
│ key          │ TEXT    │ Primary key │
│ value        │ JSONB   │ Any data    │
│ created_at   │ TSTZ    │ Auto        │
│ updated_at   │ TSTZ    │ Auto        │
└──────────────┴─────────┴─────────────┘
```

### Key Patterns

```
Caregivers:
┌─────────────────────────────────┬──────────────────────┐
│ Key                             │ Value                │
├─────────────────────────────────┼──────────────────────┤
│ caregiver:uuid                  │ {id, email, name...} │
│ caregiver:email:user@email.com  │ uuid (caregiver id)  │
│ caregiver:uuid:children         │ [child_id1, child_id2]│
└─────────────────────────────────┴──────────────────────┘

Children:
┌─────────────────────────────────┬──────────────────────┐
│ Key                             │ Value                │
├─────────────────────────────────┼──────────────────────┤
│ child:uuid                      │ {id, name, age...}   │
│ child:uuid:sessions             │ [session_id1, ...]   │
└─────────────────────────────────┴──────────────────────┘

Sessions:
┌─────────────────────────────────┬──────────────────────┐
│ Key                             │ Value                │
├─────────────────────────────────┼──────────────────────┤
│ session:uuid                    │ {gameData, scores...}│
└─────────────────────────────────┴──────────────────────┘
```

## Component Architecture

```
/App.tsx (RouterProvider)
    │
    ├─ /routes.ts
    │
    ├─ /pages/
    │   ├─ Login.tsx (Kids)
    │   ├─ KidDashboard.tsx
    │   ├─ QuizGame.tsx
    │   ├─ AdminUsers.tsx
    │   ├─ AdminProfileView.tsx
    │   ├─ CaregiverLogin.tsx (NEW)
    │   └─ CaregiverDashboard.tsx (NEW)
    │
    ├─ /components/
    │   ├─ ui/ (Button, Card, etc.)
    │   ├─ challenges/ (15 quiz challenges)
    │   ├─ AccessibilityMenu.tsx
    │   ├─ ApiStatusBadge.tsx (NEW)
    │   ├─ ProgressBar.tsx
    │   └─ ResultsProfile.tsx
    │
    ├─ /utils/
    │   ├─ api.ts (NEW - Backend API client)
    │   └─ textToSpeech.ts
    │
    └─ /types/
        └─ game.ts
```

## API Client Architecture

```typescript
// /utils/api.ts

class ApiClient {
  private baseUrl: string;
  
  // Caregivers
  createCaregiver(email, password, name)
  loginCaregiver(email, password)
  
  // Children
  createChild(caregiverId, name, age?)
  getCaregiverChildren(caregiverId)
  getChild(childId)
  
  // Sessions
  saveSession(childId, gameData, completedAt?)
  getChildSessions(childId)
  getSession(sessionId)
  getChildStats(childId)
  
  // Health
  healthCheck()
}

export const api = new ApiClient(API_BASE_URL);
```

## Environment Configuration

```
Development:
┌──────────────────┐
│  Frontend        │
│  localhost:5173  │◀─── .env
│                  │     VITE_API_URL=http://localhost:8000
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Backend         │
│  localhost:8000  │◀─── .env
│                  │     SUPABASE_URL=...
│                  │     SUPABASE_SERVICE_ROLE_KEY=...
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Supabase Cloud  │
│  *.supabase.co   │
└──────────────────┘

Production:
┌──────────────────┐
│  Frontend        │
│  Vercel/Netlify  │◀─── Environment Variable
│                  │     VITE_API_URL=https://....deno.dev
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Backend         │
│  Deno Deploy     │◀─── Environment Variables
│  *.deno.dev      │     (Set in dashboard)
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Supabase Cloud  │
│  *.supabase.co   │
└──────────────────┘
```

## Security Layers

```
Frontend (React)
├─ Input validation
├─ XSS protection (React escapes by default)
└─ localStorage encryption (future enhancement)
        │
        ▼
Backend API (Hono)
├─ CORS configuration
├─ Password hashing (⚠️ TODO)
├─ Rate limiting (⚠️ TODO)
└─ Request validation
        │
        ▼
Database (Supabase)
├─ Row Level Security (RLS)
├─ Service role access
└─ Connection encryption (TLS)
```

## Performance Optimizations

```
Frontend:
├─ Code splitting (React.lazy)
├─ Image optimization
├─ Memoization (React.memo)
└─ Lazy loading routes

Backend:
├─ Connection pooling (Supabase)
├─ Caching (future: Redis)
└─ Batch operations (mget, mset)

Database:
├─ Indexed key column
├─ JSONB for flexible storage
└─ Prefix search optimization
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      INTERNET                           │
└─────────────────────────────────────────────────────────┘
                │                      │
        ┌───────┴──────┐      ┌────────┴───────┐
        │              │      │                │
        ▼              ▼      ▼                ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Vercel/     │  │ Deno Deploy  │  │  Supabase    │
│  Netlify     │  │              │  │              │
│  (Frontend)  │  │  (Backend)   │  │  (Database)  │
│              │  │              │  │              │
│  • React     │  │  • Hono      │  │  • PostgreSQL│
│  • Static    │  │  • KV Store  │  │  • RLS       │
│  • CDN       │  │  • CORS      │  │  • Backups   │
└──────────────┘  └──────────────┘  └──────────────┘
```

## Scalability Considerations

### Current (MVP):
- ✅ Single region deployment
- ✅ Supabase free tier (500MB)
- ✅ Basic key-value store
- ✅ No caching

### Future Enhancements:
- 📈 Multi-region deployment
- 📈 Redis caching layer
- 📈 CDN for static assets
- 📈 Database read replicas
- 📈 Horizontal scaling (Deno Deploy auto-scales)

---

## Technology Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 | UI framework |
| Styling | Tailwind CSS v4 | Utility-first CSS |
| Animation | Motion (Framer) | Smooth animations |
| Routing | React Router v7 | Client-side routing |
| Backend | Deno + Hono | API server |
| Database | Supabase (PostgreSQL) | Data persistence |
| Storage | Key-Value pattern | Flexible schema |
| Hosting | Vercel/Netlify + Deno Deploy | Cloud hosting |
| TTS | Web Speech API | Accessibility |

---

This architecture supports **both offline and online modes**, making NeuroPlay accessible to everyone regardless of their connectivity! 🌐
