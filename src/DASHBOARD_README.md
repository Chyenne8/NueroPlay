# Challenge Quest Dashboard

## Overview
The Challenge Quest Dashboard is a comprehensive interface for the child-friendly interactive quiz game. It provides a central hub for accessing the quiz, viewing results, and understanding the 15 challenges across 4 levels.

## Features

### 🏠 Main Dashboard (`/`)
- **Welcome Card**: Dynamic welcome message based on quiz completion status
- **Profile Stats**: Visual display of completed challenges across all 4 domains:
  - Thinking Skills (Cognitive) - 5 challenges
  - Super Skills (Executive Function) - 4 challenges  
  - Social Skills (Social Interaction) - 3 challenges
  - Preferences Set (Sensory) - 3 preferences
- **Quest Levels Overview**: All 15 challenges organized by level:
  - Level 1: Sensory Discovery
  - Level 2: Cognitive Quests
  - Level 3: Executive Function
  - Level 4: Social Interaction
- **Quick Info Cards**: Quest duration and how it works

### 🎮 Quiz Interface (`/quiz`)
- All 15 interactive challenges in sequence
- Progress tracking with visual progress bar
- Smooth animations between challenges
- Exit confirmation to prevent accidental loss of progress
- Auto-save results to localStorage upon completion

### 🏆 Results Profile
- Personalized profile based on quiz responses
- Color-coded strengths display
- Game recommendations based on performance
- Return to dashboard functionality

## Architecture

### Routing Structure
```
/                → Dashboard (default landing page)
/quiz            → Quiz game flow
```

### Data Persistence
- Uses `localStorage` to save:
  - `gameResults`: Complete quiz data (GameData object)
  - `quizCompleted`: Boolean flag for completion status

### Data Structure
```typescript
interface GameData {
  sensory: {
    colorPreference?: 'bright' | 'soft';
    soundPreference?: 'gentle' | 'upbeat' | 'silence';
    speedPreference?: 'fast' | 'slow';
  };
  cognitive: {
    patternRecognition?: number;
    visualReasoning?: number;
    visualMemory?: number;
    sequencing?: number;
    symbolRecognition?: number;
  };
  executiveFunction: {
    flexibility?: number;
    multiStep?: number;
    impulseControl?: number;
    persistence?: number;
  };
  socialInteraction: {
    emotionRecognition?: number;
    turnTaking?: number;
    socialCues?: number;
  };
}
```

## Key Components

### Dashboard Components
- **Dashboard.tsx**: Main dashboard page with stats, levels overview, and navigation
- **Navigation.tsx**: Exit quiz navigation component
- **Button.tsx**: UI button component
- **Badge.tsx**: UI badge component for status indicators
- **Card.tsx**: UI card component for content sections

### Quiz Components
- **QuizGame.tsx**: Main quiz orchestrator
- **GameIntro.tsx**: Welcome screen
- **ProgressBar.tsx**: Visual progress indicator
- **ResultsProfile.tsx**: Results display and recommendations
- **15 Challenge Components** in `/components/challenges/`

## User Flow

1. **First Visit**
   - User lands on dashboard
   - Sees overview of all 15 challenges
   - Clicks "Start Your Quest" button

2. **Taking the Quiz**
   - Intro screen with explanation
   - 15 challenges presented sequentially
   - Progress bar shows advancement
   - Can exit anytime (with confirmation)

3. **Completion**
   - Results automatically saved
   - Personalized profile displayed
   - Game recommendations generated
   - Returns to dashboard with "Profile Complete" badge

4. **Return Visit**
   - Dashboard shows completion status
   - Stats display completed challenges
   - Option to retake quiz (with confirmation)

## Customization Options

### Color Themes
- Dashboard uses gradient backgrounds: `from-purple-100 via-pink-100 to-blue-100`
- Each level has unique color scheme:
  - Level 1 (Sensory): Purple/Pink gradient
  - Level 2 (Cognitive): Blue/Cyan gradient
  - Level 3 (Executive): Orange/Yellow gradient
  - Level 4 (Social): Pink/Rose gradient

### Animation
- All transitions use Motion (Framer Motion)
- Smooth page transitions
- Animated stat counters
- Hover effects on interactive elements

## Technical Notes

### Dependencies
- React Router for navigation
- Motion (Framer Motion) for animations
- Lucide React for icons
- Tailwind CSS for styling
- Local storage for persistence

### Browser Compatibility
- Requires modern browser with localStorage support
- Responsive design works on mobile and desktop
- Tested on Chrome, Firefox, Safari, Edge

## Future Enhancements
- Sound effects for challenges (mentioned in background)
- Additional challenge variations
- Parent dashboard for viewing child's profile
- Export/print profile functionality
- Multi-child profile support
- Progress tracking over time
- Difficulty level adjustments based on performance
