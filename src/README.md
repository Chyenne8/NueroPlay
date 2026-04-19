## 🎉 **NEW: Supabase Cloud Database Connected!**

Your NeuroPlay app is now connected to Supabase! 🚀

**Quick Start:**
1. ✅ **Already set up!** - `.env` file created with your credentials
2. ✅ **Database ready!** - Supabase project: `adrdvqqpimkscatwcawg`
3. 🚀 **Just run:** `npm run dev` (restart if already running!)
4. 🧪 **Test it:** Create a caregiver account and watch it save to the cloud!

**📚 Documentation:**
- 🎯 [SETUP_COMPLETE.md](./SETUP_COMPLETE.md) - **START HERE!** Full overview
- 🔌 [HOW_TO_CONNECT_SUPABASE.md](./HOW_TO_CONNECT_SUPABASE.md) - Connection guide
- 🧪 [SUPABASE_TEST.md](./SUPABASE_TEST.md) - Test your connection
- 📋 [SUPABASE_INTEGRATION_SUMMARY.md](./SUPABASE_INTEGRATION_SUMMARY.md) - Technical details

---

# 🎮 NeuroPlay - Autism-Friendly Challenge Quest Game

NeuroPlay is a comprehensive, child-friendly challenge quest game designed with accessibility and inclusivity at its core. The platform features 15 interactive challenges mapped to sensory, cognitive, executive function, and social interaction skills, with intelligent personalization that adapts to each child's unique strengths and preferences.

> **Important:** This application is designed for educational and personal use. It is not intended for collecting PII (Personally Identifiable Information) or securing sensitive data. It does not screen for autism—it simply learns preferences and strengths to personalize the player experience.

---

## ✨ Key Features

### 🎮 Interactive Challenges (15 Games)
- **Texture Explorer** - Match different textures and learn about how things feel
- **Pattern Detective** - Find and complete hidden patterns
- **Sequence Builder** - Build sequences in the right order
- **Emotion Match** - Match faces to feelings and learn about emotions
- **Sound Explorer** - Listen to sounds and match them correctly
- **Visual Sorting** - Sort items by color, shape, or size
- **Memory Champion** - Remember and match patterns
- **7 Daily Challenges** - Rotating challenges for each day of the week
- Plus 8 additional interactive games across 4 skill domains

### 🏆 Rewards & Progress System
- **Badge Collection** - Earn badges for completing challenges
- **Point System** - Track progress across 4 domains: Sensory, Cognitive, Executive Function, Social
- **Unlockable Rewards** - Story modes, special games, and avatar customizations
- **Visual Progress Dashboard** - Charts and graphs showing skill development
- **Achievement Tracker** - Celebrate milestones and accomplishments

### ♿ Accessibility Features
- **Text-to-Speech (TTS)** - Full site reading with customizable voice settings
- **Font Size Control** - 4 size options (Small, Medium, Large, Extra Large)
- **High Contrast Mode** - Enhanced visibility with bold colors
- **Calm Mode** - Reduced motion for sensory sensitivities
- **Multiple Themes** - Ocean Calm, Forest Friends, Sunset Glow, Lavender Dreams, Cosmic Space, Rainbow Joy
- **Dyslexia-Friendly Options** - Font and spacing adjustments
- **Keyboard Navigation** - Full accessibility without mouse

### 😊 Wellbeing Support
- **Mood Check-ins** - Track emotional states with emoji selections
- **Break Reminders** - Gentle prompts for rest and hydration
- **Calm Mode** - Reduced animations and sensory input
- **Positive Reinforcement** - Encouraging feedback and celebration

### 👨‍👩‍👧‍👦 Family Features
- **Caregiver Portal** - Monitor progress, view detailed reports
- **Sibling Quick-Switch** - Easy account switching for families
- **Printable PDF Reports** - Export progress summaries
- **Caregiver Notes** - Add observations and track behaviors
- **Admin Controls** - Manage users, prevent quiz retakes

### 🧠 Personalization Engine
- **Smart Game Recommendations** - AI-driven suggestions based on performance
- **Adaptive Difficulty** - Automatically adjusts to skill level
- **Profile Generation** - Creates child-friendly profiles showing strengths
- **Environment Tuning** - Adjusts settings based on preferences
- **Story Mode Matching** - Recommends narrative styles based on interests

---

## 🚀 Tech Stack

- **Frontend:** React 18 with TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS v4
- **Animations:** Motion (Framer Motion)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Backend:** Supabase (optional for persistence)
- **Text-to-Speech:** Web Speech API
- **PDF Generation:** jsPDF & html2canvas

---

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn

### Setup

1. **Clone the repository:**
```bash
git clone https://github.com/YOUR-USERNAME/neuroplay-game.git
cd neuroplay-game
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Supabase (Optional but Recommended):**

   **Choose your setup guide:**
   - 🔌 **Connection Guide (3 steps):** See [HOW_TO_CONNECT_SUPABASE.md](./HOW_TO_CONNECT_SUPABASE.md) ⭐ **START HERE!**
   - 🚀 **Quick Setup (5 min):** See [SUPABASE_QUICKSTART.md](./SUPABASE_QUICKSTART.md)
   - 📖 **Detailed Guide (15 min):** See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - ✅ **Setup Checklist:** See [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md)

   **Without Supabase:** App works with localStorage (data saved in browser only)
   
   **With Supabase:** 
   - ☁️ Cloud data persistence
   - 🔄 Sync across devices
   - 👨‍👩‍👧 Caregiver portal with real accounts
   - 📊 Never lose progress data

4. **Run the development server:**
```bash
npm run dev
```

5. **Open in browser:**
Navigate to `http://localhost:5173` (or the port shown in terminal)

---

## 🎯 Usage Guide

### For Children (Players)

1. **Login Screen:**
   - Click "New Player? Sign Up!"
   - Create a username and password
   - Choose your favorite avatar

2. **Kid Dashboard:**
   - View your profile and progress
   - Play daily challenges
   - Check smart game recommendations
   - Track your badges and rewards
   - Customize accessibility settings

3. **Playing Challenges:**
   - Click on any game card
   - Follow the instructions
   - Complete the challenge
   - Earn points and badges!

### For Caregivers/Parents

1. **Caregiver Login:**
   - Click "Caregiver Login" on the main page
   - Create a caregiver account
   - Link child accounts

2. **Caregiver Dashboard:**
   - View all children's progress
   - Read detailed skill assessments
   - Export PDF reports
   - Add observational notes
   - Switch between child profiles

### For Administrators

1. **Admin Access:**
   - Use admin credentials to login
   - Navigate to Admin Dashboard

2. **Admin Features:**
   - View all user accounts
   - See detailed player profiles
   - Reset quiz attempts (if authorized)
   - Monitor system-wide statistics

---

## 🎨 Accessibility Settings

Access the ⚙️ **Accessibility Menu** (bottom-left corner) to customize:

- **Read to Me** - Toggle text-to-speech on/off
- **Bold Colors** - Enable high contrast mode
- **Calm Mode** - Reduce animations and motion
- **Text Size** - Adjust font size with +/- controls

Additional settings in the Kid Dashboard:
- **Voice Settings** - Choose TTS voice, speed, and pitch
- **Themes** - Select from 6 beautiful theme options
- **Dyslexia Font** - Enable OpenDyslexic font

---

## 📊 The 4 Skill Domains

### 1. 🎨 Sensory Processing
Games focusing on texture, sound, visual patterns, and sensory integration.

### 2. 🧠 Cognitive Skills
Memory, pattern recognition, problem-solving, and logical thinking challenges.

### 3. 🎯 Executive Function
Planning, sequencing, organization, and task management activities.

### 4. 💬 Social Interaction
Emotion recognition, social cues, communication, and relationship understanding.

---

## 🗂️ Project Structure

```
neuroplay-game/
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   ├── AccessibilityMenu.tsx
│   │   ├── BadgeSystem.tsx
│   │   ├── DailyChallengeCard.tsx
│   │   ├── MoodCheckIn.tsx
│   │   ├── SmartRecommendations.tsx
│   │   └── ...
│   ├── pages/            # Route pages
│   │   ├── Login.tsx
│   │   ├── KidDashboard.tsx
│   │   ├── Challenge.tsx
│   │   ├── CaregiverDashboard.tsx
│   │   ├── AdminUsers.tsx
│   │   └── Features.tsx
│   ├── utils/            # Utility functions
│   │   ├── textToSpeech.ts
│   │   ├── supabaseClient.ts
│   │   └── pdfExport.ts
│   ├── routes.ts         # React Router configuration
│   ├── App.tsx           # Main app component
│   └── styles/
│       └── globals.css   # Global styles and themes
├── public/               # Static assets
├── README.md
└── package.json
```

---

## 🔐 Privacy & Security Notes

- **Local Storage:** User data is stored in browser localStorage by default
- **No PII Collection:** Not designed for collecting personally identifiable information
- **Supabase (Optional):** Can be connected for cloud persistence
- **Not a Diagnostic Tool:** This app does not screen or diagnose autism
- **Educational Use:** Intended for learning and skill development only

---

## 🌟 Features List (30+)

### Core Features
✅ User authentication system  
✅ 15 interactive challenge games  
✅ 4-level skill progression system  
✅ Background domain scoring  
✅ Child-friendly profile generation  

### Engagement Features
✅ Badge & reward system  
✅ Point tracking across 4 domains  
✅ Unlockable content & story modes  
✅ Daily challenge rotation  
✅ Smart game recommendations  

### Accessibility Features
✅ Full text-to-speech with voice controls  
✅ 4 font size options  
✅ High contrast mode  
✅ Reduced motion/calm mode  
✅ 6 visual themes  
✅ Dyslexia-friendly font option  

### Wellbeing Features
✅ Mood check-in system  
✅ Break reminder notifications  
✅ Positive reinforcement messages  

### Family Features
✅ Caregiver portal with detailed analytics  
✅ Sibling quick-switch functionality  
✅ Printable PDF reports  
✅ Caregiver notes & observations  

### Admin Features
✅ User management dashboard  
✅ Quiz attempt controls  
✅ Detailed profile viewing  

### Additional Features
✅ Visual progress dashboard with charts  
✅ Features reference page  
✅ Responsive design  
✅ Error handling & boundaries  

---

## 🛠️ Future Enhancements

- [ ] Multiplayer co-op challenges
- [ ] Parent-child shared activities
- [ ] Progress sharing with therapists/teachers
- [ ] More mini-games and challenges
- [ ] Animated tutorials
- [ ] Voice command navigation
- [ ] Multi-language support
- [ ] Mobile app version (React Native)
- [ ] Gamified learning paths
- [ ] Social story integration

---

## 🤝 Contributing

This is a personal/educational project, but suggestions and improvements are welcome! 

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙏 Acknowledgments

- Designed with input from autism advocacy communities
- Built with accessibility-first principles
- Inspired by the need for inclusive, personalized learning tools
- Special thanks to all families who benefit from accessible technology

---

## 📧 Contact

For questions, feedback, or support, please open an issue on GitHub.

---

## ⭐ Star This Repo

If you find NeuroPlay helpful, please consider giving it a star! It helps others discover the project.

---

**Built with ❤️ for neurodivergent learners and their families**