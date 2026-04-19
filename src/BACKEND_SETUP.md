# NeuroPlay Backend Setup Guide

## Overview
Your NeuroPlay app now has **dual-mode operation**:
1. **Standalone Mode** (Default) - Works with localStorage only, no backend needed
2. **Full Database Mode** - Connects to backend API for caregiver accounts, child profiles, and session tracking

## Backend Technology Stack

The backend uses:
- 🦕 **Deno** - Modern JavaScript/TypeScript runtime
- 🔥 **Hono** - Fast web framework
- 🗄️ **Supabase** - PostgreSQL database with REST API
- 📦 **Key-Value Store** - Simple data storage pattern

## Backend API Features

The backend API provides:
- ✅ **Caregiver Accounts** - Email/password authentication
- ✅ **Child Profiles** - Multiple children per caregiver
- ✅ **Session Storage** - Quiz results saved to database
- ✅ **Statistics** - Aggregate data and trends per child
- ✅ **Preferences Tracking** - Color, sound, speed preferences

## Prerequisites

Before deploying, you need:
1. **Supabase Account** (free tier works great!)
2. **Deno** installed (for local development)
3. **GitHub Account** (for Deno Deploy)

## Step-by-Step Deployment

### Part 1: Set Up Supabase Database

1. **Create a Supabase Project:**
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Create a new organization (if needed)
   - Click "New Project"
   - Choose a name: `neuroplay-db` (or your preferred name)
   - Set a strong database password
   - Choose a region close to your users
   - Click "Create new project"
   - Wait ~2 minutes for setup to complete

2. **Create the Database Table:**
   - In your Supabase dashboard, click "SQL Editor" in the left sidebar
   - Click "New query"
   - Copy the contents of `/backend-schema.sql` from this project
   - Paste into the SQL editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - You should see "Success. No rows returned"

3. **Get Your Supabase Credentials:**
   - Click "Settings" (gear icon) in the left sidebar
   - Click "API" under Project Settings
   - Copy these two values:
     - **Project URL** (looks like `https://xxxxx.supabase.co`)
     - **Service Role Key** (click "Reveal" next to service_role, NOT anon public)
   - ⚠️ **Keep the service_role key secret!** Never commit it to git!

### Part 2: Deploy Backend to Deno Deploy

1. **Fork or Clone the Backend Repository:**
   ```bash
   git clone https://github.com/Comp495SeniorProject/Database.git
   cd Database
   ```

2. **Create Environment Variables File (for local testing):**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Test Locally (Optional but Recommended):**
   ```bash
   # Install Deno if you haven't
   curl -fsSL https://deno.land/install.sh | sh
   
   # Run the server
   deno run --allow-net --allow-env main.tsx
   ```
   
   - Server runs at `http://localhost:8000`
   - Test health check: `curl http://localhost:8000/make-server-3f317989/health`
   - Should return: `{"status":"ok"}`

4. **Deploy to Deno Deploy:**
   
   **Option A: Via GitHub (Recommended):**
   - Push your Database repo to GitHub (if you forked it, it's already there)
   - Go to [dash.deno.com](https://dash.deno.com)
   - Sign in with GitHub
   - Click "New Project"
   - Select your Database repository
   - Set the entry point to `main.tsx`
   - Click "Add Environment Variable" and add:
     - `SUPABASE_URL` = `https://your-project.supabase.co`
     - `SUPABASE_SERVICE_ROLE_KEY` = `your-service-role-key`
   - Click "Deploy"
   - Wait for deployment to complete
   
   **Option B: Via CLI:**
   ```bash
   # Install Deno Deploy CLI
   deno install -A --no-check -r -f https://deno.land/x/deploy/deployctl.ts
   
   # Deploy (will prompt for login)
   deployctl deploy --project=neuroplay-backend \
     --env=SUPABASE_URL=https://your-project.supabase.co \
     --env=SUPABASE_SERVICE_ROLE_KEY=your-service-role-key \
     main.tsx
   ```

5. **Copy Your Deployment URL:**
   - After deployment, you'll get a URL like: `https://neuroplay-backend.deno.dev`
   - This is your `VITE_API_URL` for the frontend!

## Configure Frontend to Use Backend

### For Production (Deno Deploy):

Create a `.env` file in your NeuroPlay frontend directory:

```env
VITE_API_URL=https://your-project.deno.dev
```

### For Local Development:

```env
VITE_API_URL=http://localhost:8000
```

### Without .env file (Fallback):

The app defaults to `http://localhost:8000` if no environment variable is set.

## Using the Caregiver Portal

1. **Access the Caregiver Login:**
   - Click "Caregiver Portal 👨‍👩‍👧‍👦" on the main login page
   - Or navigate to `/caregiver-login`

2. **Create a Caregiver Account:**
   - Click "Sign Up"
   - Enter name, email, and password
   - Click "Create Account"

3. **Add Children:**
   - Click the `+` button in the Children section
   - Enter child's name and age (optional)
   - Click "Add Child"

4. **View Child Progress:**
   - Click on a child's profile
   - See their cognitive, executive, and social scores
   - View session history and preferences

5. **Start a Quiz as a Child:**
   - Select a child from the list
   - Click "Start First Quiz"
   - Results will be saved to the backend database

## App Architecture

### Three User Types:

1. **Kids (Standalone):**
   - Login at `/`
   - Data stored in localStorage
   - No backend required

2. **Caregivers:**
   - Login at `/caregiver-login`
   - Requires backend API
   - Manage multiple children
   - View statistics and trends

3. **Admins:**
   - Login at `/admin`
   - Password: `neuroplay2024`
   - Manage kid accounts (localStorage)
   - Control quiz retakes

## API Endpoints

The backend provides these endpoints:

### Caregivers:
- `POST /make-server-3f317989/caregivers` - Create account
- `POST /make-server-3f317989/caregivers/login` - Login

### Children:
- `POST /make-server-3f317989/children` - Create child profile
- `GET /make-server-3f317989/caregivers/:caregiverId/children` - Get children
- `GET /make-server-3f317989/children/:childId` - Get child details

### Sessions:
- `POST /make-server-3f317989/sessions` - Save quiz results
- `GET /make-server-3f317989/children/:childId/sessions` - Get all sessions
- `GET /make-server-3f317989/children/:childId/stats` - Get statistics

### Health:
- `GET /make-server-3f317989/health` - Check API status

## Troubleshooting

### "Backend API is offline"
- Check that your backend server is running
- Verify the `VITE_API_URL` is correct
- Check browser console for CORS errors

### Sessions not saving
- Ensure the child is selected from the caregiver dashboard
- Check that `currentChild` is in localStorage
- Look for errors in the browser console

### CORS issues
- Backend includes CORS headers for `origin: "*"`
- If issues persist, check your deployment settings

## Data Flow

```
Caregiver Login → Create Children → Child Takes Quiz → Session Saved to DB
                                                      ↓
                                          Caregiver Views Stats
```

## Benefits of Using the Backend

### Without Backend:
- ✅ Works offline
- ✅ No setup required
- ❌ No multi-device sync
- ❌ Data lost if browser cache cleared
- ❌ No caregiver portal

### With Backend:
- ✅ Multi-device sync
- ✅ Persistent data storage
- ✅ Caregiver dashboard
- ✅ Multiple children per caregiver
- ✅ Historical trends and analytics
- ❌ Requires backend deployment

## Next Steps

1. Deploy the backend to Deno Deploy
2. Configure your frontend with the backend URL
3. Create a caregiver account
4. Add children and start tracking their progress!

## Security Note

⚠️ **Important:** The current backend stores passwords in plain text. For production use, you should:
- Hash passwords using bcrypt or similar
- Add JWT token authentication
- Implement rate limiting
- Use HTTPS only

This is a development/demo setup and should be enhanced for production use.

---

**Questions?** Check the browser console for detailed error messages or API connection status.