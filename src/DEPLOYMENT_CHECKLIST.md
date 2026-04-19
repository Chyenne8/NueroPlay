# NeuroPlay Deployment Checklist 🚀

## Complete Deployment Guide - Both Frontend & Backend

---

## 📋 Pre-Deployment Checklist

- [ ] Supabase account created
- [ ] Deno Deploy account created (or GitHub account for deployment)
- [ ] Git repository for backend (forked or cloned)
- [ ] This NeuroPlay frontend code ready

---

## 🗄️ Part 1: Database Setup (Supabase)

### Step 1: Create Supabase Project (5 minutes)

- [ ] Go to [supabase.com](https://supabase.com) and sign in
- [ ] Click "New Project"
- [ ] Fill in project details:
  - [ ] Organization: Select or create one
  - [ ] Name: `neuroplay-db`
  - [ ] Database Password: (save this securely!)
  - [ ] Region: Choose closest to your users
- [ ] Click "Create new project"
- [ ] Wait for project to initialize (~2 minutes)

### Step 2: Create Database Table (2 minutes)

- [ ] In Supabase dashboard, click "SQL Editor" (left sidebar)
- [ ] Click "+ New query"
- [ ] Copy contents from `backend-schema.sql` in this repo
- [ ] Paste into SQL editor
- [ ] Click "Run" or press Cmd/Ctrl + Enter
- [ ] Verify success message: "Success. No rows returned"

### Step 3: Get API Credentials (2 minutes)

- [ ] Click "Settings" (gear icon) in left sidebar
- [ ] Click "API" under Project Settings
- [ ] Copy and save these values:
  - [ ] **Project URL** (e.g., `https://abcdefgh.supabase.co`)
  - [ ] **service_role key** (click "Reveal" - NOT the anon key!)
  
  ⚠️ **IMPORTANT**: Never commit service_role key to Git!

---

## 🦕 Part 2: Backend Deployment (Deno Deploy)

### Step 1: Prepare Backend Code (5 minutes)

```bash
# Clone the backend repository
git clone https://github.com/Comp495SeniorProject/Database.git
cd Database
```

- [ ] Backend repository cloned
- [ ] Verify files exist:
  - [ ] `main.tsx`
  - [ ] `kv_store.tsx`
  - [ ] `deno.json` or `deno.jsonc`

### Step 2: Test Locally (Optional - 5 minutes)

```bash
# Install Deno (if not already installed)
curl -fsSL https://deno.land/install.sh | sh

# Create .env file
cat > .env << EOF
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
EOF

# Run server
deno run --allow-net --allow-env main.tsx
```

- [ ] Deno installed
- [ ] `.env` file created with your credentials
- [ ] Server starts without errors
- [ ] Test endpoint: `curl http://localhost:8000/make-server-3f317989/health`
- [ ] Response: `{"status":"ok"}`

### Step 3: Deploy to Deno Deploy (10 minutes)

**Option A: GitHub Integration (Recommended)**

- [ ] Push backend code to GitHub (if not already there)
- [ ] Go to [dash.deno.com](https://dash.deno.com)
- [ ] Sign in with GitHub
- [ ] Click "New Project"
- [ ] Select repository: `Database`
- [ ] Set entry point: `main.tsx`
- [ ] Add environment variables:
  - [ ] `SUPABASE_URL` = Your Supabase Project URL
  - [ ] `SUPABASE_SERVICE_ROLE_KEY` = Your service role key
- [ ] Click "Deploy"
- [ ] Wait for deployment (~1-2 minutes)
- [ ] Copy deployment URL (e.g., `https://neuroplay-backend.deno.dev`)

**Option B: CLI Deployment**

```bash
# Install deployctl
deno install -A --no-check -r -f https://deno.land/x/deploy/deployctl.ts

# Deploy with environment variables
deployctl deploy \
  --project=neuroplay-backend \
  --env=SUPABASE_URL=https://your-project.supabase.co \
  --env=SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
  main.tsx
```

- [ ] Deployment successful
- [ ] Deployment URL copied

### Step 4: Test Backend API (2 minutes)

```bash
# Test health endpoint
curl https://your-backend.deno.dev/make-server-3f317989/health

# Should return: {"status":"ok"}
```

- [ ] Health check passes
- [ ] Backend is accessible publicly

---

## 🎨 Part 3: Frontend Configuration

### Step 1: Configure Environment Variables (2 minutes)

In your NeuroPlay frontend directory:

```bash
# Create .env file
cat > .env << EOF
VITE_API_URL=https://your-backend.deno.dev
EOF
```

- [ ] `.env` file created
- [ ] `VITE_API_URL` points to your Deno Deploy URL
- [ ] `.env` added to `.gitignore` (should already be there)

### Step 2: Test Frontend Locally (5 minutes)

```bash
# Install dependencies
npm install
# or
yarn install

# Run dev server
npm run dev
# or
yarn dev
```

- [ ] Dependencies installed
- [ ] Dev server running (usually `http://localhost:5173`)
- [ ] Navigate to `/caregiver-login`
- [ ] Check for "Connected to backend server" green badge
- [ ] If offline, check browser console for errors

### Step 3: Deploy Frontend (10 minutes)

**Option A: Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Set root directory (if needed)
# - Build command: npm run build
# - Output directory: dist
# - Add environment variable: VITE_API_URL
```

- [ ] Vercel CLI installed
- [ ] Project deployed
- [ ] Environment variable `VITE_API_URL` set in Vercel dashboard
- [ ] Deployment URL copied

**Option B: Netlify**

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Build command: npm run build
# Publish directory: dist
```

- [ ] Netlify CLI installed
- [ ] Build command configured: `npm run build`
- [ ] Publish directory: `dist`
- [ ] Environment variable added in Netlify dashboard
- [ ] Deployment URL copied

**Option C: GitHub Pages / Other**

- [ ] Build project: `npm run build`
- [ ] Deploy `dist` folder to hosting
- [ ] Configure environment variables in hosting settings

---

## ✅ Part 4: Post-Deployment Testing

### Test Standalone Mode (Kids)

- [ ] Visit frontend URL
- [ ] Create a kid account at main login
- [ ] Take quiz (or skip with dev mode)
- [ ] View dashboard
- [ ] Results saved to localStorage ✓

### Test Caregiver Mode (Database)

- [ ] Click "Caregiver Portal" link
- [ ] Create caregiver account
- [ ] Verify account created (check Supabase table)
- [ ] Add a child profile
- [ ] Verify child saved to database
- [ ] Click "Start First Quiz" for child
- [ ] Complete quiz
- [ ] Return to caregiver dashboard
- [ ] Verify session appears with statistics ✓

### Test API Status

- [ ] Check green "Database Connected" badge on caregiver login
- [ ] Check API status badge on caregiver dashboard
- [ ] Test with backend offline (stop Deno Deploy temporarily)
- [ ] Verify "Offline Mode" message appears
- [ ] Restart backend and verify reconnection

---

## 🔍 Troubleshooting Checklist

### Backend Issues

**"Error: Cannot read environment variable SUPABASE_URL"**
- [ ] Check Deno Deploy environment variables are set
- [ ] Redeploy backend after adding variables

**"CORS error" in browser console**
- [ ] Verify backend has CORS enabled (should be by default)
- [ ] Check backend logs in Deno Deploy dashboard
- [ ] Ensure `origin: "*"` in backend CORS config

**"Backend API is offline"**
- [ ] Check backend URL in `.env` is correct
- [ ] Verify backend is deployed and running
- [ ] Test health endpoint directly
- [ ] Check for typos in URL

### Frontend Issues

**"Caregiver login fails"**
- [ ] Check Network tab for API calls
- [ ] Verify backend URL is correct
- [ ] Check CORS in browser console
- [ ] Verify Supabase table exists

**"Session not saving"**
- [ ] Ensure child is selected from caregiver dashboard
- [ ] Check `currentChild` in localStorage
- [ ] Open browser console for errors
- [ ] Verify backend session endpoint works

**Environment variable not loading**
- [ ] Restart dev server after creating `.env`
- [ ] For production: redeploy after setting env vars
- [ ] Check env var name: `VITE_API_URL` (must start with `VITE_`)

---

## 🔒 Security Checklist (Before Production)

### Current Status (Development Mode)
- ⚠️ Passwords stored in plain text
- ⚠️ No JWT authentication
- ⚠️ CORS allows all origins (`*`)
- ⚠️ No rate limiting

### Production Security Enhancements
- [ ] Add password hashing (bcrypt/argon2)
- [ ] Implement JWT token authentication
- [ ] Restrict CORS to frontend domain only
- [ ] Add rate limiting middleware
- [ ] Enable HTTPS only (Deno Deploy does this automatically)
- [ ] Add request validation
- [ ] Implement session expiration
- [ ] Add audit logging
- [ ] Enable Supabase RLS policies
- [ ] Review and limit service role permissions

---

## 📊 Monitoring & Maintenance

### Regular Checks
- [ ] Monitor Supabase dashboard for storage usage
- [ ] Check Deno Deploy logs for errors
- [ ] Review API usage and performance
- [ ] Test both standalone and caregiver modes monthly

### Supabase Free Tier Limits
- 500 MB database space
- 2 GB bandwidth
- 50 MB file storage
- Unlimited API requests

If you exceed these, consider upgrading to Pro tier ($25/month).

---

## 🎉 Success Criteria

Your deployment is complete when:

- ✅ Frontend is accessible at public URL
- ✅ Backend API health check returns `{"status":"ok"}`
- ✅ Kids can create accounts and take quiz (standalone mode)
- ✅ Caregivers can create accounts (database mode)
- ✅ Children can be added to caregiver accounts
- ✅ Quiz sessions save to Supabase database
- ✅ Statistics display correctly on caregiver dashboard
- ✅ "Database Connected" badge shows green
- ✅ All accessibility features work (TTS, contrast, calm mode)

---

## 📚 Additional Resources

- **Backend Code**: https://github.com/Comp495SeniorProject/Database
- **Supabase Docs**: https://supabase.com/docs
- **Deno Deploy Docs**: https://docs.deno.com/deploy/manual
- **Hono Framework**: https://hono.dev

---

## 🆘 Need Help?

1. Check browser console (F12) for errors
2. Check Deno Deploy logs for backend issues
3. Review Supabase logs in dashboard
4. Verify environment variables are set correctly
5. Test each component individually (database → backend → frontend)

---

**Congratulations on deploying NeuroPlay!** 🎊

The platform now supports both simple kid-friendly standalone mode and professional caregiver mode with full database persistence!
