# 📁 Supabase Setup - Files You Need to Create

This is a visual guide showing exactly what files you need to create for Supabase.

---

## ✅ Files Already in Your Project

These files are **already created** and ready to use:

- ✅ `/backend-schema.sql` - SQL code to create database table
- ✅ `/.env.example` - Template showing what to put in `.env`
- ✅ `/.gitignore` - Prevents `.env` from being committed
- ✅ `/SUPABASE_SETUP.md` - Detailed setup instructions
- ✅ `/SUPABASE_QUICKSTART.md` - Quick 5-minute guide
- ✅ `/SETUP_CHECKLIST.md` - Step-by-step checklist

---

## 📝 File YOU Need to Create

### Only 1 File: `.env`

**Location:** Project root (same folder as `App.tsx`)

**File name:** `.env` (with the dot at the beginning!)

**Content:**
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-anon-key...
```

---

## 🎯 Visual Guide

### Your Project Structure Should Look Like:

```
neuroplay-game/
├── 📄 .env                    ← YOU CREATE THIS FILE!
├── 📄 .env.example            ← Already exists (template)
├── 📄 .gitignore              ← Already exists
├── 📄 App.tsx
├── 📄 README.md
├── 📄 SUPABASE_SETUP.md       ← Read this for instructions
├── 📄 backend-schema.sql      ← Copy this to Supabase
├── 📁 components/
├── 📁 pages/
├── 📁 utils/
└── 📄 package.json
```

---

## 🔧 How to Create .env File

### Method 1: Using Your Code Editor

1. Open your project in VS Code (or your editor)
2. Right-click in the file explorer
3. Click "New File"
4. Name it: `.env` (with the dot!)
5. Paste your Supabase credentials

### Method 2: Using Terminal (Mac/Linux)

```bash
# Navigate to project root
cd /path/to/neuroplay-game

# Create the file
touch .env

# Open it with nano editor
nano .env

# Paste your credentials:
# VITE_SUPABASE_URL=https://xxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhb...

# Save: Ctrl+O, Enter, Ctrl+X
```

### Method 3: Copy from Template

```bash
# Copy the example file
cp .env.example .env

# Then edit .env and replace the placeholder values
```

---

## 🔑 Where to Get the Values

### VITE_SUPABASE_URL

1. Go to https://supabase.com
2. Open your project
3. Click **Settings** (⚙️) → **API**
4. Find: **"Project URL"**
5. Copy it (looks like: `https://abcdefgh.supabase.co`)

### VITE_SUPABASE_ANON_KEY

1. Same page (Settings → API)
2. Scroll to: **"Project API keys"**
3. Find: **"anon" "public"** (NOT service_role!)
4. Click copy icon
5. Paste into `.env`

---

## ✅ Final Verification

Your `.env` file should look EXACTLY like this (with your values):

```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1MjM4MDAsImV4cCI6MjAwNTA5OTgwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Check:**
- [ ] File is named `.env` (with dot)
- [ ] File is in project root
- [ ] No spaces around `=`
- [ ] No quotes around values
- [ ] Used anon key (NOT service_role)
- [ ] File is saved

---

## ⚠️ Common Mistakes

### ❌ Wrong File Name
- `env` (missing dot)
- `.env.txt` (has extension)
- `.ENV` (wrong case)

### ❌ Wrong Location
- `.env` inside `src/` folder
- `.env` inside `components/` folder
- `.env` on your desktop

### ❌ Wrong Key
- Using `service_role` instead of `anon`
- Service role is SECRET - only for backend!

### ❌ Wrong Format
```env
# ❌ DON'T DO THIS:
VITE_SUPABASE_URL = "https://xxx.supabase.co"  (has quotes and spaces)

# ✅ DO THIS:
VITE_SUPABASE_URL=https://xxx.supabase.co
```

---

## 🎉 That's It!

After creating `.env`:

1. Restart your dev server
2. Test caregiver registration
3. Check Supabase table for data
4. You're done! 🚀

---

## 📚 Next Steps

- ✅ Created `.env` file
- ✅ Restarted dev server
- ➡️ Now read: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for full setup
- ➡️ Or use: [SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md) for fast setup

---

**Remember:** NEVER commit `.env` to Git! It's already in `.gitignore` to protect you. ✨
