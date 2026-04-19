# 🧪 Supabase Connection Test Guide

**Test your Supabase integration step-by-step!**

---

## ✅ **Pre-Test Checklist**

Before testing, verify:

- [ ] `.env` file exists in project root
- [ ] `.env` contains `VITE_SUPABASE_URL`
- [ ] `.env` contains `VITE_SUPABASE_ANON_KEY`
- [ ] Dev server has been **restarted** after creating `.env`
- [ ] Supabase project is created
- [ ] Database table `kv_store_3f317989` exists

---

## 🎯 **Test 1: Environment Variables**

### **Open browser console** (F12)

Paste this code:

```javascript
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set ✅' : 'Missing ❌');
```

**Expected Result:**
```
Supabase URL: https://adrdvqqpimkscatwcawg.supabase.co
Supabase Key: Set ✅
```

**If you see `undefined`:**
- ❌ `.env` file is not in the right location
- ❌ Dev server wasn't restarted
- ❌ File is named wrong (must be exactly `.env`)

---

## 🎯 **Test 2: Supabase Client Initialization**

### **In browser console:**

```javascript
import { isSupabaseConfigured } from './utils/supabaseClient';
console.log('Supabase configured:', isSupabaseConfigured());
```

**Expected Result:**
```
Supabase configured: true
```

**If you see `false`:**
- Check environment variables (Test 1)
- Verify `.env` values are correct

---

## 🎯 **Test 3: Create Caregiver Account** (Manual Test)

### **Steps:**

1. **Open your app** (http://localhost:5173)
2. **Click** "Caregiver Portal"
3. **Click** "Sign Up" tab
4. **Fill in:**
   - Name: `Test Parent`
   - Email: `test@example.com`
   - Password: `test123`
5. **Click** "Create Account"

### **Expected Result:**
- ✅ Redirected to Caregiver Dashboard
- ✅ No errors in console
- ✅ Success message appears

### **Verification:**

**In browser console:**
```javascript
const currentCaregiver = JSON.parse(localStorage.getItem('currentCaregiver'));
console.log('Caregiver:', currentCaregiver);
```

You should see your caregiver data.

---

## 🎯 **Test 4: Verify Data in Supabase**

### **Go to Supabase Dashboard:**

1. Open https://app.supabase.com/project/adrdvqqpimkscatwcawg
2. Click **"Table Editor"** (left sidebar)
3. Click **`kv_store_3f317989`** table

### **Expected Result:**

You should see a row with:
- **key:** `caregiver:test@example.com`
- **value:** JSON object with caregiver data
- **created_at:** timestamp
- **updated_at:** timestamp

**Example:**
```json
{
  "id": "1234567890",
  "email": "test@example.com",
  "name": "Test Parent",
  "password": "test123",
  "children": [],
  "createdAt": "2026-03-18T..."
}
```

### **If you DON'T see the row:**

Check browser console for errors:
```javascript
// Look for errors in console
// Common errors:
// - CORS errors
// - Authentication errors
// - Network errors
```

---

## 🎯 **Test 5: Login with Existing Caregiver**

### **Steps:**

1. **Click** "Logout" (if logged in)
2. **Go to** Caregiver Login
3. **Enter:**
   - Email: `test@example.com`
   - Password: `test123`
4. **Click** "Login"

### **Expected Result:**
- ✅ Successfully logged in
- ✅ Redirected to dashboard
- ✅ Name displayed correctly

---

## 🎯 **Test 6: Direct Supabase Query** (Advanced)

### **In browser console:**

```javascript
import { supabase } from './utils/supabaseClient';

// Test connection
const { data, error } = await supabase
  .from('kv_store_3f317989')
  .select('*')
  .limit(5);

if (error) {
  console.error('Supabase Error:', error);
} else {
  console.log('Supabase Data:', data);
}
```

**Expected Result:**
```javascript
Supabase Data: [
  {
    key: "caregiver:test@example.com",
    value: {...},
    created_at: "...",
    updated_at: "..."
  }
]
```

---

## 🎯 **Test 7: Add Child to Caregiver**

### **Steps:**

1. **Login** as caregiver
2. **Click** "+" button (Add Child)
3. **Enter:**
   - Name: `Test Child`
   - Age: `8`
4. **Click** "Add Child"

### **Expected Result:**
- ✅ Child added to list
- ✅ Alert shows username and password
- ✅ Child appears in dashboard

### **Verify in Supabase:**

1. Go to Supabase Table Editor
2. Find row: `caregiver:test@example.com`
3. Click to view JSON
4. Check `children` array has new child

**Example:**
```json
{
  "id": "1234567890",
  "email": "test@example.com",
  "name": "Test Parent",
  "children": [
    {
      "id": "child-1234567890",
      "name": "Test Child",
      "username": "testchild",
      "age": 8,
      "avatar": "👤",
      "createdAt": "2026-03-18...",
      "caregiverId": "1234567890"
    }
  ]
}
```

---

## 🎯 **Test 8: Link Existing Child**

### **First, create a kid account:**

1. Go to main login page
2. Sign up as kid: `kidtest` / `kid123`
3. Complete (or skip) the quiz
4. Logout

### **Then link to caregiver:**

1. Login as caregiver (`test@example.com`)
2. Click **🔗 Link** button
3. Enter:
   - Username: `kidtest`
   - Password: `kid123`
4. Click "Link Existing Child"

### **Expected Result:**
- ✅ Child linked successfully
- ✅ Child appears in caregiver's list
- ✅ Alert confirms linking

### **Verify in Supabase:**

Child should appear in caregiver's `children` array.

---

## 🎯 **Test 9: Data Persistence**

### **Steps:**

1. **Login** as caregiver
2. **Note** your children list
3. **Close** browser tab
4. **Open** new tab to your app
5. **Login** again as caregiver

### **Expected Result:**
- ✅ All children still appear
- ✅ Data persisted across sessions
- ✅ No data loss

---

## 🎯 **Test 10: Connection Indicator**

### **Check connection status:**

1. **Login** as caregiver
2. **Look for** a connection indicator (if we added one)
3. **Or** check browser console:

```javascript
import { isSupabaseConfigured } from './utils/supabaseClient';
console.log('Connected:', isSupabaseConfigured());
```

**Expected:** `true`

---

## 🐛 **Troubleshooting Common Issues**

### **Issue 1: Environment variables are undefined**

**Solution:**
```bash
# 1. Check .env exists
ls -la .env

# 2. Verify content
cat .env

# 3. Restart dev server
# Stop (Ctrl+C)
npm run dev
```

### **Issue 2: CORS errors**

**Symptoms:**
```
Access to fetch at 'https://...supabase.co' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution:**
- This shouldn't happen with Supabase
- Check you're using the `anon` key, not `service_role`
- Verify Supabase project is not paused

### **Issue 3: "Row not found" error (PGRST116)**

**This is NORMAL!** It just means the key doesn't exist yet.

**Code handles this automatically:**
```javascript
// In supabaseClient.ts
if (error.code === 'PGRST116') {
  return null; // Key doesn't exist, return null
}
```

### **Issue 4: Data not saving**

**Check:**

1. **Browser console** for errors
2. **Network tab** (F12 → Network) for failed requests
3. **Supabase logs** in dashboard

**Debug in console:**
```javascript
import { kvSet } from './utils/supabaseClient';

// Try a simple test
const result = await kvSet('test-key', { message: 'Hello!' });
console.log('Save result:', result);

// Then check if it saved
import { kvGet } from './utils/supabaseClient';
const data = await kvGet('test-key');
console.log('Retrieved data:', data);
```

### **Issue 5: "Supabase is not defined"**

**Solution:**
```bash
# Install Supabase package
npm install @supabase/supabase-js

# Restart dev server
npm run dev
```

---

## ✅ **Success Indicators**

You know everything is working when:

1. ✅ Environment variables load correctly
2. ✅ Caregiver accounts can be created
3. ✅ Data appears in Supabase Table Editor
4. ✅ Login works with stored credentials
5. ✅ Children can be added and linked
6. ✅ Data persists across sessions
7. ✅ No errors in browser console
8. ✅ Network tab shows successful Supabase requests

---

## 📊 **Quick Status Check Script**

**Run this in browser console for a full status check:**

```javascript
// Supabase Status Check
console.log('=== SUPABASE STATUS CHECK ===');
console.log('URL:', import.meta.env.VITE_SUPABASE_URL || '❌ Not set');
console.log('Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Not set');

import { isSupabaseConfigured, kvGet } from './utils/supabaseClient';
console.log('Configured:', isSupabaseConfigured() ? '✅' : '❌');

// Test connection
try {
  const testKey = `test-${Date.now()}`;
  await kvSet(testKey, { test: true });
  const result = await kvGet(testKey);
  console.log('Connection:', result ? '✅ Working' : '❌ Failed');
} catch (err) {
  console.error('Connection Error:', err);
}

// Check current caregiver
const caregiver = localStorage.getItem('currentCaregiver');
console.log('Logged in:', caregiver ? '✅' : '❌');
if (caregiver) {
  const data = JSON.parse(caregiver);
  console.log('User:', data.email);
}

console.log('=== END STATUS CHECK ===');
```

---

## 🎉 **You're All Set!**

If all tests pass, your Supabase integration is working perfectly! 🚀

**What you've accomplished:**
- ✅ Supabase client configured
- ✅ Environment variables loaded
- ✅ Database connection working
- ✅ Caregiver accounts saving to cloud
- ✅ Data persisting across sessions
- ✅ Full integration complete!

---

## 📚 **Next Steps**

1. **Test thoroughly** with multiple accounts
2. **Monitor Supabase dashboard** for data
3. **Check storage usage** (free tier: 500MB)
4. **Set up Row Level Security** (optional, for production)
5. **Deploy to production** (Vercel, Netlify, etc.)

---

**Need help?** Check the troubleshooting section or refer to:
- [HOW_TO_CONNECT_SUPABASE.md](./HOW_TO_CONNECT_SUPABASE.md)
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- [Supabase Docs](https://supabase.com/docs)
