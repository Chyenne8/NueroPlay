# 🗄️ Supabase Setup Guide for NeuroPlay

This guide will help you set up Supabase database for NeuroPlay in **under 15 minutes**.

## 📋 What You'll Need

- ✅ A free Supabase account (we'll create this together)
- ✅ 10-15 minutes of your time
- ✅ Your GitHub repository (you already have this!)

---

## 🎯 Quick Overview

**Current State:** NeuroPlay uses browser localStorage (data disappears when cache is cleared)

**After Supabase:** 
- ✅ Data persists across devices
- ✅ Caregivers can access from anywhere
- ✅ Never lose progress data
- ✅ Multiple children tracked per caregiver

---

## 📝 Step 1: Create Supabase Project

### 1.1 Sign Up for Supabase

1. Go to **https://supabase.com**
2. Click **"Start your project"** (green button)
3. Sign up with:
   - GitHub account (recommended - one click!) ✨
   - OR Google account
   - OR Email

### 1.2 Create New Organization

1. After signing in, you'll see "Create a new organization"
2. Name it something like: `NeuroPlay` or `YourSchoolName`
3. Choose **Free Plan** (it's perfect for this project!)
4. Click **"Create organization"**

### 1.3 Create New Project

1. Click **"New Project"** button
2. Fill in the details:
   - **Name:** `neuroplay` (or any name you like)
   - **Database Password:** Create a strong password
     - ⚠️ **SAVE THIS PASSWORD!** Write it down somewhere safe
     - Example: `NeuroPlay2024!Secure`
   - **Region:** Choose closest to your location
     - US East (for USA East Coast)
     - US West (for USA West Coast)
     - Europe (for EU)
   - **Pricing Plan:** Free
3. Click **"Create new project"**
4. ⏱️ Wait 2-3 minutes while Supabase sets up your database
   - You'll see a loading animation
   - Grab a coffee! ☕

---

## 🗃️ Step 2: Create Database Table

### 2.1 Open SQL Editor

1. Once your project is ready, look at the left sidebar
2. Click **"SQL Editor"** (icon looks like `</>`)
3. Click **"New query"** button (top right)

### 2.2 Run the Schema

1. Copy **ALL** the code from `/backend-schema.sql` file in your project
2. Paste it into the SQL editor
3. Click **"Run"** button (or press `Cmd/Ctrl + Enter`)
4. You should see: ✅ **"Success. No rows returned"**

That's it! Your database table is created! 🎉

---

## 🔑 Step 3: Get Your Credentials

### 3.1 Find Your API Settings

1. In Supabase dashboard, click **⚙️ Settings** (bottom of left sidebar)
2. Click **"API"** under Project Settings
3. You'll see a page with your credentials

### 3.2 Copy These Two Values

You need **TWO** pieces of information:

#### A) Project URL
- Look for: **"Project URL"**
- It looks like: `https://xxxxxxxxxxx.supabase.co`
- Click the copy icon 📋
- **Paste it somewhere safe** (we'll use it in a moment)

#### B) Service Role Key (SECRET)
- Scroll down to: **"Project API keys"**
- Find: **"service_role"** (NOT "anon public")
- Click **"Reveal"** to show the key
- Click the copy icon 📋
- **Paste it somewhere safe**

⚠️ **IMPORTANT:** The `service_role` key is SECRET! Never commit it to GitHub!

---

## 🔧 Step 4: Configure Your Frontend

### 4.1 Create Environment File

1. In your project root folder (same level as `App.tsx`), create a new file:
   - File name: `.env`
   - ⚠️ Must start with a dot!

2. Add this content (replace with YOUR values):

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4.2 Get Your Anon Key

1. Go back to Supabase → Settings → API
2. Find **"anon public"** key
3. Copy it and paste it as `VITE_SUPABASE_ANON_KEY` value

### 4.3 Verify Your .env File

Your `.env` file should look like this:

```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODk1MjM4MDAsImV4cCI6MjAwNTA5OTgwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxx
```

**✅ Save the file!**

---

## ✅ Step 5: Test Your Connection

### 5.1 Add .env to .gitignore

**SUPER IMPORTANT:** Never commit your `.env` file to GitHub!

1. Open your `.gitignore` file
2. Make sure it contains:
```
.env
.env.local
.env.production
```

If `.gitignore` doesn't exist, create it with the above content.

### 5.2 Restart Your Dev Server

1. Stop your development server (Ctrl+C in terminal)
2. Start it again: `npm run dev` (or however you start it)
3. Open your app in the browser

### 5.3 Test Caregiver Registration

1. Go to your app
2. Click **"Caregiver Portal"**
3. Click **"Sign Up"**
4. Create a test account:
   - Name: Test Parent
   - Email: test@example.com
   - Password: test123
5. Click **"Create Account"**

**If it works:** ✅ You'll see the caregiver dashboard!

**If it doesn't work:** Check the browser console (F12) for errors

---

## 🎯 What Happens Now?

### With Supabase Connected:

✅ **Caregivers can:**
- Create accounts that persist across devices
- Add multiple children
- View progress from any computer
- Never lose data (it's in the cloud!)

✅ **You can:**
- Access the database from Supabase dashboard
- See all caregiver accounts in real-time
- Export data anytime
- Scale to hundreds of users

### Kids Still Use localStorage:

⭐ **Important:** Kids playing solo (not linked to a caregiver) still use browser storage. This is by design:
- Simple login for kids
- No server needed for basic play
- Privacy-friendly
- Works offline

Only **caregiver accounts** use the database.

---

## 📊 Step 6: View Your Data

### 6.1 Check Your Database

1. In Supabase, click **"Table Editor"** (left sidebar)
2. Click on **"kv_store_3f317989"** table
3. You'll see your stored data!

Each row contains:
- **key:** Identifier (like `caregiver:test@example.com`)
- **value:** JSON data (caregiver info, children, etc.)
- **created_at:** When it was created
- **updated_at:** Last modified time

### 6.2 Query Your Data

Try this SQL query:

```sql
-- See all caregivers
SELECT * FROM kv_store_3f317989 
WHERE key LIKE 'caregiver:%';

-- Count total records
SELECT COUNT(*) FROM kv_store_3f317989;
```

---

## 🐛 Troubleshooting

### Problem: "Failed to connect to Supabase"

**Solution:**
1. Check your `.env` file has correct values
2. Make sure file is named `.env` (with the dot!)
3. Restart your dev server
4. Verify the URL doesn't have trailing slash

### Problem: "CORS Error"

**Solution:**
1. In Supabase → Settings → API
2. Check "Allow credentials" is enabled
3. Your app URL should be in allowed origins

### Problem: "Row Level Security policy violation"

**Solution:**
1. Go to Supabase → SQL Editor
2. Run this query:
```sql
ALTER TABLE kv_store_3f317989 DISABLE ROW LEVEL SECURITY;
```

### Problem: Can't find .env file

**Solution:**
- On Mac/Linux: Press `Cmd+Shift+.` to show hidden files
- On Windows: Enable "Show hidden files" in File Explorer
- Or create it using terminal: `touch .env`

---

## 🚀 Next Steps

### Recommended:

1. ✅ Create a test caregiver account
2. ✅ Add a test child
3. ✅ Have the child complete a quiz
4. ✅ View the results in caregiver dashboard
5. ✅ Check Supabase Table Editor to see the data

### Optional Enhancements:

- 🔐 Add password reset functionality
- 📧 Set up email notifications (Supabase Auth)
- 🎨 Customize the caregiver dashboard
- 📈 Add more detailed analytics

---

## 📞 Need Help?

### Check These:
- ✅ Browser console (F12) for error messages
- ✅ Supabase project status (is it running?)
- ✅ `.env` file syntax (no spaces around `=`)
- ✅ Did you restart the dev server?

### Common Issues:
- **Forgot to restart dev server** ← Most common!
- **Typo in .env file**
- **Using service_role instead of anon key** (for frontend)
- **.env file not in root directory**

---

## ✅ Setup Checklist

Before moving on, verify:

- [ ] Supabase project created
- [ ] Database table created (ran backend-schema.sql)
- [ ] Got Project URL
- [ ] Got Anon Key
- [ ] Created `.env` file with both values
- [ ] Added `.env` to `.gitignore`
- [ ] Restarted dev server
- [ ] Tested caregiver registration
- [ ] Can see data in Supabase Table Editor

---

## 🎉 Congratulations!

You've successfully set up Supabase for NeuroPlay! 

Your app now has:
- ☁️ Cloud database
- 🔐 Secure data storage
- 📊 Real-time data sync
- 🌍 Access from anywhere

**Now go create some caregiver accounts and watch the magic happen!** ✨

---

## 📄 Files Reference

- `/backend-schema.sql` - Database table structure
- `/.env` - Your local environment variables (SECRET!)
- `/.env.example` - Template for environment variables
- `/BACKEND_SETUP.md` - Advanced backend deployment guide
