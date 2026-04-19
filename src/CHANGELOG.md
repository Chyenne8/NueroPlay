# NeuroPlay Changelog

## [2.0.0] - Database Integration Complete - 2026-02-19

### 🎉 Major Features Added

#### Backend Integration
- ✨ **Complete API Client** (`/utils/api.ts`)
  - Caregiver authentication (login, signup)
  - Child profile management (create, read)
  - Session tracking (save quiz results, view history)
  - Statistics aggregation (cognitive, executive, social scores)
  - Health check endpoint
  - Graceful error handling

- ✨ **Caregiver Portal** (`/pages/CaregiverLogin.tsx`, `/pages/CaregiverDashboard.tsx`)
  - Email/password authentication
  - Multi-child profile management
  - Add/edit children with names and ages
  - Visual child selection interface
  - Start quiz for specific child
  - Real-time API connection status

- ✨ **Statistics Dashboard**
  - Aggregate cognitive, executive, and social scores
  - Session history with timestamps
  - Preference tracking (color, sound, speed)
  - Latest session display
  - Total sessions counter

- ✨ **Database Schema** (`/backend-schema.sql`)
  - Supabase PostgreSQL table
  - Key-value store pattern
  - Indexed for performance
  - Row Level Security policies
  - Auto-updated timestamps

#### UI/UX Enhancements
- ✨ **API Status Badge** (`/components/ApiStatusBadge.tsx`)
  - Shows "Database Connected" when online
  - Shows "Offline Mode" when backend unavailable
  - Auto-refreshes every 30 seconds
  - Visual color indicators (green/gray)

- ✨ **Dual-Mode Architecture**
  - Standalone mode (localStorage) for offline use
  - Database mode (Supabase) for cloud sync
  - Seamless switching between modes
  - No breaking changes to existing features

#### Routes Added
- ✅ `/caregiver-login` - Caregiver authentication page
- ✅ `/caregiver-dashboard` - Caregiver management portal

#### Documentation
- 📚 **README.md** - Complete project overview
- 📚 **QUICK_START.md** - 5-minute setup guide
- 📚 **BACKEND_SETUP.md** - Detailed backend deployment
- 📚 **DEPLOYMENT_CHECKLIST.md** - Step-by-step deployment guide
- 📚 **INTEGRATION_SUMMARY.md** - Features and architecture overview
- 📚 **ARCHITECTURE.md** - System diagrams and data flow
- 📚 **PROJECT_SUMMARY.md** - Complete integration summary
- 📚 **backend-schema.sql** - Supabase database schema
- 📚 **.env.example** - Frontend environment template
- 📚 **backend.env.example** - Backend environment template

### 🔧 Modified Files

#### Core Application
- `/routes.ts`
  - Added caregiver routes
  - Imported CaregiverLogin and CaregiverDashboard components

- `/pages/Login.tsx`
  - Added "Caregiver Portal 👨‍👩‍👧‍👦" link
  - Positioned alongside admin link

- `/pages/QuizGame.tsx`
  - Added auto-save to backend when `currentChild` exists
  - Imports API client
  - Saves session to Supabase after quiz completion
  - Maintains backward compatibility with standalone mode

### 🐛 Bug Fixes
- None (new feature release)

### 🔒 Security Notes
- ⚠️ **Development Mode**: Passwords stored in plain text
- ⚠️ **CORS**: Currently allows all origins (`*`)
- ⚠️ **TODO**: Add password hashing before production
- ⚠️ **TODO**: Implement JWT authentication
- ⚠️ **TODO**: Add rate limiting

### 📊 Performance
- Backend uses Deno's V8 runtime (fast startup)
- Key-value store for flexible schema
- Indexed database queries
- Auto-scaling on Deno Deploy

### 🎯 Breaking Changes
- **None!** All existing features remain unchanged
- Standalone mode still works without backend
- Kid login and admin panel unchanged

---

## [1.0.0] - Initial Release - Previous

### Core Features
- ✅ 15 Interactive quiz challenges
- ✅ 4 skill levels (Sensory, Cognitive, Executive, Social)
- ✅ Kid login system (localStorage)
- ✅ Admin panel with user management
- ✅ Text-to-speech accessibility
- ✅ High contrast mode
- ✅ Calm mode (reduced animations)
- ✅ Responsive design
- ✅ Profile and badge system

---

## Migration Guide: 1.0 → 2.0

### For Existing Standalone Users
**No action required!** Your app continues to work exactly as before.

### To Enable Database Mode
1. Deploy backend to Deno Deploy
2. Set up Supabase database
3. Add `VITE_API_URL` to `.env`
4. Rebuild and redeploy frontend

### Data Migration
- **Kid accounts**: Remain in localStorage (no migration needed)
- **Admin settings**: Remain in localStorage (no migration needed)
- **New caregiver accounts**: Stored in Supabase
- **Quiz sessions**: Saved to both localStorage AND Supabase (when child is linked)

---

## Upgrade Path

### From 1.0 to 2.0

```bash
# Pull latest code
git pull origin main

# Install any new dependencies
npm install

# Optional: Set up backend
# 1. Deploy backend to Deno Deploy
# 2. Create .env with VITE_API_URL
# 3. Rebuild

npm run build
```

---

## Version Compatibility

| Version | Node.js | React | TypeScript | Backend |
|---------|---------|-------|-----------|---------|
| 2.0.0   | 18+     | 18    | 5.x       | Optional |
| 1.0.0   | 16+     | 18    | 5.x       | None    |

---

## Backend API Versions

### v1.0 (Current)
- `/make-server-3f317989/health` - Health check
- `/make-server-3f317989/caregivers` - POST create, POST login
- `/make-server-3f317989/children` - POST create, GET by caregiver
- `/make-server-3f317989/sessions` - POST save, GET by child, GET stats

---

## Roadmap

### v2.1.0 (Planned)
- [ ] Password hashing (bcrypt)
- [ ] JWT authentication
- [ ] Email verification
- [ ] Forgot password flow
- [ ] Export results to PDF

### v2.2.0 (Planned)
- [ ] Real-time dashboard updates
- [ ] WebSocket support
- [ ] Push notifications
- [ ] Multi-language support

### v3.0.0 (Future)
- [ ] Mobile app (React Native)
- [ ] Teacher/therapist portal
- [ ] Advanced analytics with charts
- [ ] AI-powered personalization
- [ ] Offline-first PWA

---

## Support

### Getting Help
- Check documentation in `/docs`
- Review `QUICK_START.md` for setup
- See `DEPLOYMENT_CHECKLIST.md` for deployment
- Open GitHub issue for bugs

### Reporting Issues
Please include:
- Version number
- Browser/environment
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

---

## Contributors

- **Backend Integration**: Integration with Comp495SeniorProject/Database
- **Frontend Development**: NeuroPlay team
- **Accessibility Consulting**: Autism advocacy groups
- **Testing**: Community volunteers

---

## License

This project is for educational purposes. See LICENSE for details.

---

**Thank you for using NeuroPlay!** 🧠✨

We're committed to making learning accessible and enjoyable for all children! 🎮❤️
