# ⚡ Quick Reference Card

**Everything you need to know about your Supabase integration at a glance!**

---

## 🎯 **Your Supabase Project**

```
Project ID:  adrdvqqpimkscatwcawg
URL:         https://adrdvqqpimkscatwcawg.supabase.co
Table:       kv_store_3f317989
Status:      ✅ Connected
```

**Dashboard:** https://app.supabase.com/project/adrdvqqpimkscatwcawg

---

## 🚀 **Quick Start Commands**

```bash
# Start development server
npm run dev

# Install Supabase package (if needed)
npm install @supabase/supabase-js

# Build for production
npm run build
```

**Open app:** http://localhost:5173

---

## 📁 **Important Files**

| File | Purpose | Can Edit? |
|------|---------|-----------|
| `/.env` | Supabase credentials | ✅ Yes |
| `/utils/supabaseClient.ts` | Supabase functions | ✅ Yes |
| `/pages/CaregiverLogin.tsx` | Uses Supabase | ✅ Yes |
| `/.gitignore` | Protects secrets | ⚠️ Careful |

---

## 🔐 **Environment Variables**

Located in: `/.env`

```env
VITE_SUPABASE_URL=https://adrdvqqpimkscatwcawg.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

**⚠️ IMPORTANT:**
- NEVER commit `.env` to Git
- MUST restart dev server after changing
- Use `anon` key, NOT `service_role`

---

## 🧪 **Quick Test**

### **1. Test Environment Variables**

**Browser console (F12):**
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
// Should show: https://adrdvqqpimkscatwcawg.supabase.co
```

### **2. Create Test Account**

1. Go to: http://localhost:5173
2. Click: "Caregiver Portal"
3. Sign up: test@example.com / test123
4. Check Supabase: Table Editor → `kv_store_3f317989`

**Expected:** See row with key `caregiver:test@example.com`

---

## 📊 **Data Structure**

### **Caregiver Key:**
```
caregiver:email@example.com
```

### **Caregiver Value:**
```json
{
  "id": "1234567890",
  "email": "email@example.com",
  "name": "Parent Name",
  "password": "password",
  "children": [...],
  "createdAt": "2026-03-18T..."
}
```

---

## 🔧 **Common Issues & Fixes**

### **Issue: Environment variables undefined**

```bash
# Solution: Restart dev server
# Stop: Ctrl+C
npm run dev
```

### **Issue: Data not saving**

**Check:**
1. Browser console for errors (F12)
2. Network tab for failed requests
3. Supabase dashboard for project status

### **Issue: "Cannot find module '@supabase/supabase-js'"**

```bash
npm install @supabase/supabase-js
```

---

## 📚 **Documentation**

| Guide | Use When |
|-------|----------|
| [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) | Overview & next steps |
| [HOW_TO_CONNECT_SUPABASE.md](./HOW_TO_CONNECT_SUPABASE.md) | First time setup |
| [SUPABASE_TEST.md](./SUPABASE_TEST.md) | Testing connection |
| [SUPABASE_INTEGRATION_SUMMARY.md](./SUPABASE_INTEGRATION_SUMMARY.md) | Technical details |

---

## 💻 **Code Snippets**

### **Check if Supabase is Connected:**

```typescript
import { isSupabaseConfigured } from './utils/supabaseClient';

console.log('Connected:', isSupabaseConfigured());
// Returns: true or false
```

### **Save Data:**

```typescript
import { kvSet } from './utils/supabaseClient';

await kvSet('mykey', { data: 'value' });
```

### **Get Data:**

```typescript
import { kvGet } from './utils/supabaseClient';

const data = await kvGet('mykey');
console.log(data);
```

### **Delete Data:**

```typescript
import { kvDelete } from './utils/supabaseClient';

await kvDelete('mykey');
```

---

## 🎯 **Features Enabled**

✅ **Caregiver Accounts**
- Sign up / Login
- Cloud storage
- Cross-device sync

✅ **Child Management**
- Add children
- Link existing
- Track progress

✅ **Data Persistence**
- Never lose accounts
- Automatic backups
- Real-time sync

---

## 🔍 **Monitoring**

### **Supabase Dashboard:**

**Check:**
- Database → Table Editor → `kv_store_3f317989`
- Logs → Recent activity
- Settings → Usage → Storage/bandwidth

### **Browser Console:**

```javascript
// Quick status check
import { isSupabaseConfigured } from './utils/supabaseClient';
console.log('Status:', isSupabaseConfigured() ? '✅' : '❌');
```

---

## 📈 **Limits (Free Tier)**

| Resource | Limit | Current |
|----------|-------|---------|
| Storage | 500 MB | ~0 MB |
| Bandwidth | 2 GB/month | ~0 GB |
| API Requests | Unlimited | As needed |

**Monitor:** Settings → Usage in Supabase dashboard

---

## 🚨 **Emergency Commands**

### **Reset Everything:**

```bash
# Clear all user data (CAREFUL!)
localStorage.clear()
```

### **Export Backup:**

**In Supabase SQL Editor:**
```sql
SELECT * FROM kv_store_3f317989;
```

Then click: Export → CSV

### **Check Connection:**

```javascript
import { supabase } from './utils/supabaseClient';

const { data, error } = await supabase
  .from('kv_store_3f317989')
  .select('count');

console.log('Connection:', error ? '❌ Failed' : '✅ Working');
```

---

## 🎨 **Workflows**

### **New Caregiver Signup:**

```
User fills form
    ↓
CaregiverLogin.tsx validates
    ↓
saveCaregiver() → Supabase
    ↓
localStorage (session)
    ↓
Redirect to dashboard
```

### **Caregiver Login:**

```
User enters credentials
    ↓
CaregiverLogin.tsx
    ↓
getCaregiver() ← Supabase
    ↓
Verify password
    ↓
localStorage (session)
    ↓
Redirect to dashboard
```

---

## ⚡ **Hot Keys**

| Action | Shortcut |
|--------|----------|
| Open console | `F12` |
| Save file | `Ctrl + S` |
| Toggle terminal | `` Ctrl + ` `` |
| Refresh browser | `Ctrl + R` |
| Hard refresh | `Ctrl + Shift + R` |
| Stop server | `Ctrl + C` |

---

## 🎓 **Learn More**

### **Supabase:**
- [Docs](https://supabase.com/docs)
- [JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Quickstart](https://supabase.com/docs/guides/getting-started)

### **NeuroPlay:**
- [README.md](./README.md)
- [Features Page](http://localhost:5173/features)

---

## 📞 **Support Checklist**

Before asking for help:

- [ ] Restarted dev server
- [ ] Checked browser console (F12)
- [ ] Verified `.env` exists and is correct
- [ ] Checked Supabase dashboard
- [ ] Reviewed error messages
- [ ] Tried test script
- [ ] Read relevant documentation

---

## ✅ **Success Indicators**

You're all set if:

- ✅ `npm run dev` starts without errors
- ✅ Can create caregiver account
- ✅ Data appears in Supabase Table Editor
- ✅ Login works with saved credentials
- ✅ Console shows no errors
- ✅ Connection status shows "Connected"

---

## 🎯 **Next Steps**

1. **Today:**
   - Run `npm run dev`
   - Test caregiver signup
   - Verify in Supabase

2. **This Week:**
   - Add children
   - Test all features
   - Monitor usage

3. **Before Production:**
   - Enable RLS
   - Hash passwords
   - Set up monitoring

---

**Last Updated:** March 18, 2026

**Keep this handy!** Bookmark for quick reference. 🔖
