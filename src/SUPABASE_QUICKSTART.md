# 🚀 Supabase Quick Start (5 Minutes)

**Already know what you're doing? Use this speedrun guide!**

---

## ⚡ Speed Setup (5 Steps)

### 1️⃣ Create Supabase Project (2 min)

```
1. Go to https://supabase.com
2. Sign up with GitHub
3. New Project → Name: "neuroplay"
4. Choose region + password
5. Wait for setup to complete
```

### 2️⃣ Create Database Table (30 sec)

```
1. Click "SQL Editor"
2. Copy/paste code from /backend-schema.sql
3. Click "Run"
4. See: ✅ "Success. No rows returned"
```

### 3️⃣ Get Credentials (30 sec)

```
1. Settings → API
2. Copy "Project URL"
3. Copy "anon public" key
```

### 4️⃣ Configure Frontend (1 min)

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=https://adrdvqqpimkscatwcawg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkcmR2cXFwaW1rc2NhdHdjYXdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NDk0NTksImV4cCI6MjA4OTQyNTQ1OX0.XLxQGK_lCMBIkE6hzFk4zk77qHLaYQWqTo4ttkn2Rmg
```

### 5️⃣ Test (1 min)

```bash
# Restart dev server
npm run dev

# Test in browser:
1. Click "Caregiver Portal"
2. Sign up with test account
3. Works? ✅ Done!
```

---

## 🎯 That's It!

**Worked?** You're done! Go build! 🎉

**Didn't work?** Check [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed troubleshooting.

---

## 🔥 Pro Tips

```bash
# Show hidden files (Mac/Linux)
ls -la

# Create .env quickly
echo "VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=" > .env

# Verify setup
cat .env
```

---

## ⚠️ Don't Forget

- [ ] Add `.env` to `.gitignore`
- [ ] Use **anon** key (NOT service_role)
- [ ] Restart dev server after creating `.env`
- [ ] Never commit `.env` to Git

---

## 🐛 Quick Fixes

**Can't see data?**
→ Restart dev server

**CORS error?**
→ Check URL has no trailing slash

**RLS error?**
```sql
ALTER TABLE kv_store_3f317989 DISABLE ROW LEVEL SECURITY;
```

---

**Need more help?** See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for the full guide.
