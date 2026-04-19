# NeuroPlay Quick Start Guide 🚀

## TL;DR - Get Running Fast!

### Option 1: Standalone Mode (No Setup Required)
**Works offline, localStorage only**

1. Open the app
2. Create kid account at main login
3. Take quiz
4. Done! ✓

### Option 2: Full Database Mode (5-Minute Setup)
**Requires Supabase + Deno Deploy**

#### A. Database Setup (2 minutes)
```bash
1. Go to supabase.com → New Project
2. SQL Editor → Paste backend-schema.sql → Run
3. Settings → API → Copy URL + service_role key
```

#### B. Backend Deploy (2 minutes)
```bash
1. Fork github.com/Comp495SeniorProject/Database
2. Go to dash.deno.com → New Project
3. Connect repo → Set main.tsx as entry point
4. Add env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
5. Deploy → Copy URL
```

#### C. Frontend Config (1 minute)
```bash
# Create .env file
echo "VITE_API_URL=https://your-backend.deno.dev" > .env

# Run
npm install && npm run dev
```

Done! 🎉

---

## File Guide

| File | Purpose |
|------|---------|
| `BACKEND_SETUP.md` | Detailed backend deployment guide |
| `DEPLOYMENT_CHECKLIST.md` | Complete step-by-step checklist |
| `INTEGRATION_SUMMARY.md` | Architecture & features overview |
| `backend-schema.sql` | Supabase database schema |
| `backend.env.example` | Backend environment variables template |
| `.env.example` | Frontend environment variables template |

---

## URLs You Need

### Development
- Frontend: `http://localhost:5173` (or your dev server)
- Backend: `http://localhost:8000` (if running locally)
- Supabase: `https://app.supabase.com/project/YOUR_PROJECT`

### Production
- Frontend: Your hosting URL (Vercel/Netlify/etc.)
- Backend: `https://your-project.deno.dev`
- Supabase: Same as above

---

## Three User Types

### 👶 Kids (Standalone)
- **Login**: Main page `/`
- **Data**: localStorage
- **Backend**: Not needed
- **Features**: Quiz, profile, badges

### 👨‍👩‍👧 Caregivers (Database)
- **Login**: `/caregiver-login`
- **Data**: Supabase database
- **Backend**: Required
- **Features**: Multiple children, analytics, history

### 🔐 Admins (Management)
- **Login**: `/admin`
- **Password**: `neuroplay2024`
- **Data**: localStorage
- **Features**: User management, quiz retakes

---

## Key Features

### Accessibility ♿
- 🔊 Text-to-speech (Read to Me)
- 🎨 High contrast mode (Bold Colors)
- 😌 Reduced animations (Calm Mode)
- 🎨 Autism-friendly pastel colors
- 👆 Large touch targets

### Tracking 📊
- Sensory preferences (colors, sounds, speed)
- Cognitive skills
- Executive function
- Social interaction style

### Technical ⚙️
- React + TypeScript
- Tailwind CSS v4
- Motion animations
- Supabase + Deno backend
- Dual-mode operation (offline/online)

---

## Common Commands

### Frontend
```bash
# Install
npm install

# Dev
npm run dev

# Build
npm run build

# Preview
npm run preview
```

### Backend (if running locally)
```bash
# Run
deno run --allow-net --allow-env main.tsx

# Deploy
deployctl deploy --project=neuroplay main.tsx
```

---

## Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=https://your-backend.deno.dev
```

### Backend (Deno Deploy Environment Variables)
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

---

## Testing Your Setup

### ✅ Standalone Mode
1. Go to `/`
2. Create account
3. Take quiz
4. See results ✓

### ✅ Database Mode
1. Go to `/caregiver-login`
2. See green "Database Connected" badge
3. Create account
4. Add child
5. Take quiz as child
6. See stats in dashboard ✓

---

## Troubleshooting in 30 Seconds

| Problem | Fix |
|---------|-----|
| Backend offline | Check `VITE_API_URL` in `.env` |
| CORS error | Verify backend CORS config |
| Quiz won't save | Check `currentChild` in localStorage |
| Can't create caregiver | Check Supabase credentials |
| API health fails | Verify Deno Deploy is running |

---

## Quick Links

- 🗄️ Supabase: https://supabase.com
- 🦕 Deno Deploy: https://dash.deno.com
- 📦 Backend Repo: https://github.com/Comp495SeniorProject/Database
- 📚 Full Docs: See `BACKEND_SETUP.md`

---

## Support

1. Check browser console (F12)
2. Review Deno Deploy logs
3. Check Supabase logs
4. Read detailed docs in repo

---

**You're all set!** The app works standalone OR with full database mode. Choose what fits your needs! 🎊
