# 🔌 How to Connect NeuroPlay to Supabase

**Simple 3-step guide to get your app connected to the cloud database!**

---

## 🎯 What You'll Accomplish

By the end of this guide, your NeuroPlay app will:
- ✅ Store caregiver accounts in Supabase (cloud database)
- ✅ Sync data across devices
- ✅ Never lose caregiver/child progress
- ✅ Work without a separate backend server!

---

## 📦 Step 1: Install Supabase Package

First, install the Supabase JavaScript client:

```bash
npm install @supabase/supabase-js
```

**That's it!** The Supabase client code is already in your project at `/utils/supabaseClient.ts`.

---

## 🗄️ Step 2: Set Up Supabase Project

### A. Create Supabase Account (2 minutes)

1. Go to https://supabase.com
2. Click **"Start your project"**
3. Sign up with GitHub (easiest!) or email
4. Create a new organization if prompted

### B. Create Project (3 minutes)

1. Click **"New Project"**
2. Fill in:
   - **Name**: `neuroplay`
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to you
   - **Plan**: Free
3. Click **"Create new project"**
4. ⏱️ Wait 2-3 minutes for setup

### C. Create Database Table (1 minute)

1. Once ready, click **"SQL Editor"** in left sidebar
2. Click **"+ New query"**
3. Copy ALL the code from your `/backend-schema.sql` file
4. Paste into the SQL editor
5. Click **"Run"** (or Cmd/Ctrl + Enter)
6. You should see: ✅ **"Success. No rows returned"**

**Your database is ready!** 🎉

---

## 🔑 Step 3: Connect Your App

### A. Get Your Credentials

1. In Supabase, click **⚙️ Settings** (bottom left)
2. Click **"API"**
3. You'll see two important values:

#### Project URL:
```
https://xxxxxxxxxxx.supabase.co
```
**Click the copy button** next to it.

#### Anon Key (Public):
Scroll down to "Project API keys", find **"anon" "public"** (NOT service_role!)

**Click "Reveal"** then **click copy button**.

⚠️ **Important**: Use the `anon public` key, NOT `service_role`!

### B. Create Environment File

1. In your project root (same folder as `App.tsx`), create a file named `.env`

   **Mac/Linux:**
   ```bash
   touch .env
   ```

   **Windows** (or any OS):
   - Right-click in VS Code file explorer
   - New File → name it `.env`

2. Open `.env` and paste:

```env
VITE_SUPABASE_URL=https://your-actual-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
```

**Replace with your actual values!**

### C. Restart Dev Server

**CRITICAL:** You MUST restart your dev server for environment variables to load!

```bash
# Stop server (Ctrl+C or Cmd+C)
# Then restart
npm run dev
```

---

## ✅ Step 4: Test the Connection

### Test It Out:

1. Open your app in browser
2. Click **"Caregiver Portal"** on login page
3. Click **"Sign Up"** tab
4. Create a test account:
   - Name: Test Parent
   - Email: test@example.com
   - Password: test123
5. Click **"Create Account"**

### Verify It Works:

**In your app:**
- You should see the caregiver dashboard ✅

**In Supabase:**
1. Go to Supabase dashboard
2. Click **"Table Editor"** (left sidebar)
3. Click on **`kv_store_3f317989`** table
4. You should see a row with key like `caregiver:test@example.com` ✅

**🎉 SUCCESS! Your app is connected to Supabase!**

---

## 🎨 Visual Guide

### Your Project Structure:

```
neuroplay-game/
├── .env                    ← YOU CREATED THIS!
├── .env.example            ← Template (ignore)
├── .gitignore              ← Contains .env (prevents committing secrets)
├── App.tsx
├── utils/
│   └── supabaseClient.ts   ← Already exists (does the work!)
└── backend-schema.sql      ← Copied to Supabase
```

### What Each File Does:

- **`.env`** - Your secret credentials (NEVER commit to Git!)
- **`supabaseClient.ts`** - Handles all Supabase operations
- **`backend-schema.sql`** - Database table structure

---

## 🔍 How It Works

### Before Supabase:
```
[NeuroPlay App] → [Browser localStorage]
```
- Data stored in browser only
- Cleared if cache is cleared
- Can't access from other devices

### After Supabase:
```
[NeuroPlay App] → [Supabase Client] → [Supabase Cloud Database]
```
- Data stored in cloud
- Accessible from any device
- Never loses data
- Automatic sync

### What Gets Stored:

✅ **Caregiver accounts** (email, name, password)
✅ **Children linked to caregiver** (names, avatars, ages)
✅ **Quiz results** (when children linked to caregiver complete quizzes)

❌ **Kids playing solo** (still use localStorage - privacy friendly!)

---

## 🐛 Troubleshooting

### Issue: "Cannot find module '@supabase/supabase-js'"

**Fix:**
```bash
npm install @supabase/supabase-js
```

### Issue: Can't see `.env` file

**Mac:**
Press `Cmd + Shift + .` to show hidden files

**Windows:**
File Explorer → View → Show hidden files

### Issue: "Failed to connect to Supabase"

**Check:**
1. Did you restart the dev server? (MOST COMMON!)
2. Is `.env` in the project root (same folder as `App.tsx`)?
3. Did you use the correct key (anon, not service_role)?
4. Are there spaces around the `=` in `.env`? (remove them!)
5. Does your URL end with `.supabase.co`?

### Issue: Account created but not in database

**Check:**
1. Open browser console (F12)
2. Look for error messages
3. Verify you created the table in Supabase
4. Try running the SQL schema again

### Issue: "PGRST116" or "Row not found" error

This is normal! It just means the key doesn't exist yet. The app handles this automatically.

---

## 🔒 Security Checklist

Before deploying or committing to Git:

- [ ] `.env` is in `.gitignore`
- [ ] Never committed `.env` to Git
- [ ] Used `anon` key (not `service_role`) in frontend
- [ ] Saved credentials in password manager

**Why this matters:**
- ❌ **service_role** = Full database access (SECRET!)
- ✅ **anon** = Limited access (safe for frontend)

---

## 📊 Monitoring Your Database

### View Your Data:

1. Supabase Dashboard → **Table Editor**
2. Click **`kv_store_3f317989`**
3. See all stored data in real-time!

### Run Queries:

```sql
-- Count all caregivers
SELECT COUNT(*) FROM kv_store_3f317989 
WHERE key LIKE 'caregiver:%';

-- See all caregivers
SELECT * FROM kv_store_3f317989 
WHERE key LIKE 'caregiver:%';

-- Find specific caregiver
SELECT * FROM kv_store_3f317989 
WHERE key = 'caregiver:test@example.com';
```

---

## 🚀 Next Steps

Now that you're connected:

1. **Create multiple caregiver accounts** to test
2. **Add children to caregiver accounts**
3. **Have kids take quizzes** (while logged in as caregiver child)
4. **View data in Supabase Table Editor**
5. **Check caregiver dashboard** for progress

---

## 🎉 You're Done!

Your NeuroPlay app is now:
- ☁️ Connected to cloud database
- 🔒 Securely storing data
- 📊 Syncing across devices
- 🚀 Production-ready!

**Need more help?**
- 📖 See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed guide
- ✅ Use [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) to verify everything

---

## 💡 Pro Tips

### Tip 1: Test Both Modes

Your app supports TWO modes:

**Mode 1: Kids (Solo Play)**
- No account needed
- localStorage only
- Perfect for privacy

**Mode 2: Caregivers (Cloud)**
- Requires account
- Supabase storage
- Cross-device sync

Test both to see the difference!

### Tip 2: Check Connection Status

Add this to see if Supabase is connected:

```typescript
import { isSupabaseConfigured } from './utils/supabaseClient';

console.log('Supabase connected:', isSupabaseConfigured());
```

### Tip 3: Backup Your Data

Export from Table Editor:
1. Select rows
2. Click **"..."** menu
3. Click **"Export to CSV"**

---

**Congratulations! You've successfully connected NeuroPlay to Supabase! 🎊**
