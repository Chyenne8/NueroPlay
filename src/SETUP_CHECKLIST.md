# ✅ Supabase Setup Checklist

Use this checklist to make sure everything is configured correctly!

---

## 📋 Before You Start

- [ ] I have read `SUPABASE_SETUP.md`
- [ ] I have 15 minutes available
- [ ] I have a GitHub/Google account for Supabase signup

---

## 🗄️ Supabase Account Setup

- [ ] Created Supabase account at https://supabase.com
- [ ] Created new organization
- [ ] Created new project named "neuroplay" (or similar)
- [ ] **SAVED** my database password somewhere safe
- [ ] Project finished setting up (no longer shows loading screen)

---

## 🗃️ Database Configuration

- [ ] Opened SQL Editor in Supabase dashboard
- [ ] Copied ALL code from `/backend-schema.sql`
- [ ] Pasted into SQL Editor and clicked "Run"
- [ ] Saw success message: ✅ "Success. No rows returned"
- [ ] Can see `kv_store_3f317989` table in Table Editor

---

## 🔑 Credentials Collection

- [ ] Went to Settings → API in Supabase dashboard
- [ ] Copied **Project URL** (looks like `https://xxx.supabase.co`)
- [ ] Copied **anon public** key (NOT service_role!)
- [ ] Saved both values in a safe place temporarily

---

## 🔧 Frontend Configuration

- [ ] Created `.env` file in project root (same folder as `App.tsx`)
- [ ] Added `VITE_SUPABASE_URL=` with my Project URL
- [ ] Added `VITE_SUPABASE_ANON_KEY=` with my anon key
- [ ] Double-checked for typos in `.env` file
- [ ] Verified `.env` is listed in `.gitignore`
- [ ] **Did NOT commit** `.env` to Git

---

## 🚀 Testing

- [ ] Stopped my dev server (Ctrl+C)
- [ ] Restarted dev server (`npm run dev` or similar)
- [ ] Opened app in browser
- [ ] Clicked "Caregiver Portal"
- [ ] Successfully created a test caregiver account
- [ ] Can see caregiver dashboard
- [ ] Added a test child
- [ ] Checked Supabase Table Editor - can see data!

---

## 🔒 Security Verification

- [ ] `.env` file is in `.gitignore`
- [ ] I did NOT commit `.env` to GitHub
- [ ] I used **anon** key (not service_role) in frontend
- [ ] I saved my credentials in a password manager

---

## 🐛 If Something Doesn't Work

### Issue: Can't create caregiver account

**Check:**
- [ ] Did I restart the dev server after creating `.env`?
- [ ] Is `.env` file in the correct location (project root)?
- [ ] Did I use the anon key (not service_role)?
- [ ] Are there any spaces around the `=` in `.env`?

**Try:**
```bash
# Stop server
Ctrl+C

# Restart
npm run dev
```

### Issue: "Failed to connect" error

**Check:**
- [ ] Is my Supabase project running? (Check dashboard)
- [ ] Is the Project URL correct in `.env`?
- [ ] Does the URL have no trailing slash?
- [ ] Did I copy the FULL anon key?

### Issue: Can't see `.env` file

**Mac/Linux:**
```bash
# Show hidden files
ls -la
```

**Windows:**
- File Explorer → View → Show hidden files

**Or create it via terminal:**
```bash
touch .env
```

### Issue: "Row Level Security" error

**Fix:**
1. Go to Supabase → SQL Editor
2. Run this:
```sql
ALTER TABLE kv_store_3f317989 DISABLE ROW LEVEL SECURITY;
```

---

## 📸 Visual Verification

### Your .env file should look like:
```env
VITE_SUPABASE_URL=https://abcdefg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Your Supabase Table Editor should show:
- Table name: `kv_store_3f317989`
- Columns: `key`, `value`, `created_at`, `updated_at`
- Rows appear when you create caregiver accounts

### Your .gitignore should include:
```
.env
.env.local
.env.production
```

---

## ✅ All Done!

If you checked all boxes above, congratulations! 🎉

Your NeuroPlay app now has:
- ☁️ Cloud database via Supabase
- 🔐 Secure data storage
- 📊 Real-time sync
- 🌍 Access from anywhere

---

## 🎯 Next Steps

Now that Supabase is set up:

1. **Test thoroughly:**
   - Create multiple caregiver accounts
   - Add children to each
   - Have kids take quizzes
   - View results in caregiver dashboard

2. **Deploy your app:**
   - Push to GitHub (make sure .env is NOT committed!)
   - Deploy to Vercel/Netlify
   - Add environment variables in hosting dashboard

3. **Share with users:**
   - Give caregivers the link
   - They can create accounts
   - Start tracking child progress!

---

## 📞 Still Stuck?

1. Open browser console (F12)
2. Look for error messages
3. Check `SUPABASE_SETUP.md` troubleshooting section
4. Verify each checkbox above

**Most common issues:**
- ❌ Forgot to restart dev server
- ❌ Typo in `.env` file
- ❌ Used service_role key instead of anon
- ❌ .env file in wrong location

---

**Remember:** Every checkbox should be marked before moving on!

Good luck! 🚀
