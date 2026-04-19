import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
// Lucide React Icons
import {
  Star,
  Zap,
  Heart,
  Brain,
  Eye,
  Hand,
  MessageSquare,
  Music,
  Palette,
  Trophy,
  Volume2,
  VolumeX,
  LogOut,
  Crown,
  Target,
  Book,
  Smile,
  Users,
  User,
  TrendingUp,
  Settings,
  Sparkles,
  Rocket,
  Puzzle,
  Play,
  Info,
  Shield,
  MessageCircle
} from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { AccessibilityMenu } from '../components/AccessibilityMenu';
import { AvatarCustomization } from '../components/AvatarCustomization';
import { AvatarDisplay } from '../components/AvatarDisplay';
import { BadgeCollection, allBadges } from '../components/BadgeCollection';
import { ProgressDashboard } from '../components/ProgressDashboard';
import { BreakReminder } from '../components/BreakReminder';
import { MoodCheckIn } from '../components/MoodCheckIn';
import { TTSSettings } from '../components/TTSSettings';
import { DailyChallengeCard, getChallengeOfDay } from '../components/DailyChallengeCard';
import { SiblingQuickSwitch } from '../components/SiblingQuickSwitch';
import { SmartRecommendations } from '../components/SmartRecommendations';
import { VoiceHelper } from '../components/VoiceHelper';
import { tts } from '../utils/textToSpeech';
import logo from 'figma:asset/aadab99d44823bd0e822f7b307d367d42eb8cf5c.png';

// Theme definitions
const themes = {
  pastel: {
    name: 'Calm Pastel',
    gradient: 'from-purple-50 via-pink-50 to-blue-50',
    buttonColor: 'from-purple-400 to-pink-400',
  },
  galaxy: {
    name: 'Soft Galaxy',
    gradient: 'from-indigo-50 via-purple-50 to-pink-50',
    buttonColor: 'from-indigo-500 to-purple-500',
  },
  forest: {
    name: 'Gentle Forest',
    gradient: 'from-green-50 via-emerald-50 to-teal-50',
    buttonColor: 'from-green-400 to-emerald-400',
  },
  sunset: {
    name: 'Soft Sunset',
    gradient: 'from-orange-50 via-pink-50 to-yellow-50',
    buttonColor: 'from-orange-400 to-pink-400',
  },
  neutral: {
    name: 'Focus Mode',
    gradient: 'from-gray-50 via-slate-50 to-gray-50',
    buttonColor: 'from-gray-600 to-slate-600',
  },
};

export default function KidDashboard() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTheme, setCurrentTheme] = useState('pastel');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [showAvatarCustomization, setShowAvatarCustomization] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState({
    character: 'cat',
    accessory: 'none',
    background: 'pastel'
  });
  const [showBadgeCollection, setShowBadgeCollection] = useState(false);
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [showBreakReminder, setShowBreakReminder] = useState(false);
  const [showMoodCheckIn, setShowMoodCheckIn] = useState(false);
  const [moodCheckInType, setMoodCheckInType] = useState<'before' | 'after'>('before');
  const [showTTSSettings, setShowTTSSettings] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [sessionChallenges, setSessionChallenges] = useState(0);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [dailyChallengeCompleted, setDailyChallengeCompleted] = useState(false);
  const [kidMode, setKidMode] = useState(true); // Simple mode for kids playing alone
  const [showHelper, setShowHelper] = useState(false); // Voice helper buddy

  useEffect(() => {
    const stored = localStorage.getItem('currentUser');
    if (!stored) {
      navigate('/');
      return;
    }
    
    const user = JSON.parse(stored);
    setCurrentUser(user);
    setCurrentTheme(user.theme || 'pastel');
    setSoundEnabled(user.soundEnabled !== false);
    setReducedMotion(user.reducedMotion === true);
    
    // Load avatar
    if (user.avatar) {
      setCurrentAvatar(user.avatar);
    }

    // Don't auto-redirect to quiz - let users access dashboard
    // They can click Challenge Quest when ready
    
    // All checks passed, stop loading
    setIsLoading(false);
  }, [navigate]);

  // Reset logo click count after 3 seconds
  useEffect(() => {
    if (logoClickCount > 0) {
      const timer = setTimeout(() => setLogoClickCount(0), 3000);
      return () => clearTimeout(timer);
    }
  }, [logoClickCount]);

  const handleLogoClick = () => {
    const newCount = logoClickCount + 1;
    setLogoClickCount(newCount);
    
    // After 5 clicks, show admin option
    if (newCount === 5) {
      playSound('click');
      if (confirm('🔐 Access Admin Panel? (Password required)')) {
        navigate('/admin');
      }
      setLogoClickCount(0);
    }
  };

  const playSound = (type: 'hover' | 'click') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = type === 'hover' ? 600 : 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  const handleThemeChange = (themeName: string) => {
    setCurrentTheme(themeName);
    setShowThemeSelector(false);
    playSound('click');
    
    // Update user in localStorage
    if (currentUser) {
      const updatedUser = { ...currentUser, theme: themeName };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('neuroPlayUsers') || '[]');
      const userIndex = users.findIndex((u: any) => u.username === currentUser.username);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('neuroPlayUsers', JSON.stringify(users));
      }
    }
  };

  const toggleSound = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    if (newValue) playSound('click');
    
    // Update user in localStorage
    if (currentUser) {
      const updatedUser = { ...currentUser, soundEnabled: newValue };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('neuroPlayUsers') || '[]');
      const userIndex = users.findIndex((u: any) => u.username === currentUser.username);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('neuroPlayUsers', JSON.stringify(users));
      }
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout? 👋')) {
      localStorage.removeItem('currentUser');
      navigate('/');
    }
  };
  
  const handleSaveAvatar = (newAvatar: { character: string; accessory: string; background: string }) => {
    setCurrentAvatar(newAvatar);
    playSound('click');
    
    // Update user in localStorage
    if (currentUser) {
      const updatedUser = { ...currentUser, avatar: newAvatar };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('neuroPlayUsers') || '[]');
      const userIndex = users.findIndex((u: any) => u.username === currentUser.username);
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        localStorage.setItem('neuroPlayUsers', JSON.stringify(users));
      }
    }
    
    setShowAvatarCustomization(false);
    
    if (tts.isEnabled()) {
      tts.speak('Your character has been saved!');
    }
  };

  if (!currentUser || isLoading) {
    return null;
  }

  const results = currentUser.quizResults || {};
  const cognitiveScore = Object.values(results.cognitive || {}).filter(v => v).length;
  const executiveScore = Object.values(results.executiveFunction || {}).filter(v => v).length;
  const socialScore = Object.values(results.socialInteraction || {}).filter(v => v).length;
  const totalScore = cognitiveScore + executiveScore + socialScore;

  // Get personalized games based on quiz results
  const getPersonalizedGames = () => {
    const games = [];
    
    // Challenge Quest - Single unified experience with 15 challenges
    games.push({
      id: 'challenge-quest',
      title: 'Challenge Quest',
      description: 'Complete 15 fun challenges!',
      icon: Rocket,
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-50',
      locked: false,
      route: '/quiz'
    });
    
    // Story Adventure Games (5 active standalone games)
    games.push({
      id: 'boundaries-game',
      title: 'Boundaries Game',
      description: 'Learn about personal space!',
      icon: Shield,
      color: 'from-teal-400 to-emerald-400',
      bgColor: 'bg-teal-50',
      locked: false,
      route: '/story-adventure/boundaries'
    });

    games.push({
      id: 'cooperative-play',
      title: 'Cooperative Play',
      description: 'Work together to win!',
      icon: Users,
      color: 'from-rose-400 to-pink-400',
      bgColor: 'bg-rose-50',
      locked: false,
      route: '/story-adventure/cooperative'
    });

    games.push({
      id: 'coloring-book',
      title: 'Coloring Book',
      description: 'Color beautiful pictures!',
      icon: Palette,
      color: 'from-purple-400 to-fuchsia-400',
      bgColor: 'bg-purple-50',
      locked: false,
      route: '/story-adventure/coloring'
    });

    games.push({
      id: 'turn-taking-story',
      title: 'Turn Taking Game',
      description: 'Practice taking turns!',
      icon: Hand,
      color: 'from-blue-400 to-indigo-400',
      bgColor: 'bg-blue-50',
      locked: false,
      route: '/story-adventure/turn-taking'
    });

    games.push({
      id: 'word-of-day',
      title: 'Word of the Day',
      description: 'Learn new words!',
      icon: Book,
      color: 'from-amber-400 to-orange-400',
      bgColor: 'bg-amber-50',
      locked: false,
      route: '/story-adventure/word-of-day'
    });
    
    return games;
  };

  const getAchievementBadges = () => {
    const badges = [];
    
    badges.push({
      title: 'Quest Master',
      icon: Trophy,
      color: 'bg-gradient-to-br from-yellow-400 to-orange-400'
    });
    
    if (cognitiveScore >= 4) {
      badges.push({
        title: 'Brain Wizard',
        icon: Sparkles,
        color: 'bg-gradient-to-br from-blue-400 to-cyan-400'
      });
    }
    
    if (executiveScore >= 3) {
      badges.push({
        title: 'Focus Champion',
        icon: Target,
        color: 'bg-gradient-to-br from-orange-400 to-yellow-400'
      });
    }
    
    if (socialScore >= 2) {
      badges.push({
        title: 'Friend Star',
        icon: Users,
        color: 'bg-gradient-to-br from-pink-400 to-rose-400'
      });
    }
    
    return badges;
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${themes[currentTheme].gradient} transition-colors duration-500`}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logo} alt="NeuroPlay Logo" className="w-16 h-16" onClick={handleLogoClick} />
              <div>
                <h1 className="text-purple-600 mb-1">Hello, {currentUser.username}</h1>
                <p className="text-gray-600 text-sm">Your games are ready</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/admin')}
                className="border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
              >
                <Shield className="w-4 h-4 mr-2" />
                Admin
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/features')}
                className="border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100"
              >
                <Info className="w-4 h-4 mr-2" />
                Features
              </Button>
              <Badge className="bg-purple-100 text-purple-700 border border-purple-200 px-4 py-2">
                <Crown className="w-4 h-4 mr-1" />
                Level {Math.floor(totalScore / 3) + 1}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="border border-gray-200"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Section */}
        <Card className="p-8 text-center mb-8 bg-gradient-to-br from-white to-purple-50 border-4 border-purple-200">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <AvatarDisplay avatar={currentAvatar} size="xl" />
          </motion.div>
          <h2 className="text-gray-800 mt-4 mb-2">Welcome back, {currentUser?.username}! 🎉</h2>
          <p className="text-gray-600 mb-4">Ready to play and learn today?</p>
          {totalScore > 0 && (
            <div className="bg-white rounded-lg p-4 inline-block border-2 border-purple-300">
              <p className="text-sm text-gray-600">Challenges Completed</p>
              <p className="text-4xl font-bold text-purple-600">{totalScore}/15</p>
            </div>
          )}
        </Card>

        {/* Daily Challenge */}
        <DailyChallengeCard 
          challengeOfDay={getChallengeOfDay()}
          isCompleted={dailyChallengeCompleted}
        />
        
        {/* Smart Recommendations */}
        <SmartRecommendations
          userData={{
            sensoryScore: 75,
            cognitiveScore: (cognitiveScore / 5) * 100,
            executiveScore: (executiveScore / 4) * 100,
            socialScore: (socialScore / 3) * 100,
            completedChallenges: totalScore,
            recentMood: currentMood || undefined,
            completedGames: currentUser?.completedGames || [],
            quizCompleted: currentUser?.quizCompleted || false,
          }}
        />

        {/* Achievement Badges */}
        {getAchievementBadges().length > 0 && (
          <div>
            <h2 className="text-gray-800 mb-4">Your Badges</h2>
            <div className="flex flex-wrap gap-4">
              {getAchievementBadges().map((badge) => {
                const Icon = badge.icon;
                return (
                  <Card key={badge.title} className={`${badge.color} p-6 text-white shadow-md border-2 border-white w-40`}>
                    <Icon className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-center font-semibold text-sm">{badge.title}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => navigate('/story-adventure')}
            className="bg-gradient-to-br from-purple-400 to-blue-500 hover:from-purple-500 hover:to-blue-600 text-white p-6 h-auto flex-col gap-2"
          >
            <Book className="w-8 h-8" />
            <span className="font-bold">Story Adventure</span>
          </Button>
          
          <Button
            onClick={() => setShowBadgeCollection(true)}
            className="bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white p-6 h-auto flex-col gap-2"
          >
            <Trophy className="w-8 h-8" />
            <span className="font-bold">Badge Collection</span>
          </Button>
          
          <Button
            onClick={() => setShowProgressDashboard(true)}
            className="bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white p-6 h-auto flex-col gap-2"
          >
            <TrendingUp className="w-8 h-8" />
            <span className="font-bold">My Progress</span>
          </Button>
          
          <Button
            onClick={() => setShowTTSSettings(true)}
            className="bg-gradient-to-br from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white p-6 h-auto flex-col gap-2"
          >
            <Settings className="w-8 h-8" />
            <span className="font-bold">Voice Settings</span>
          </Button>
        </div>

        {/* Second Row of Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button
            onClick={() => {
              setMoodCheckInType('before');
              setShowMoodCheckIn(true);
            }}
            className="bg-gradient-to-br from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white p-6 h-auto flex-col gap-2"
          >
            <Smile className="w-8 h-8" />
            <span className="font-bold">How I Feel</span>
          </Button>
          
          <Button
            onClick={() => setShowAvatarCustomization(true)}
            className="bg-gradient-to-br from-indigo-400 to-purple-500 hover:from-indigo-500 hover:to-purple-600 text-white p-6 h-auto flex-col gap-2"
          >
            <User className="w-8 h-8" />
            <span className="font-bold">Customize Avatar</span>
          </Button>
        </div>

        {/* Personalized Games Grid */}
        <div>
          <h2 className="text-gray-800 mb-4">Your Games</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getPersonalizedGames().map((game) => {
              const Icon = game.icon;
              return (
                <motion.div
                  key={game.id}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Card 
                    className={`${game.bgColor} border-4 border-gray-200 overflow-hidden transition-all duration-200 ${game.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-2xl hover:border-purple-400'}`}
                    onClick={() => {
                      if (!game.locked) {
                        playSound('click');
                        navigate(game.route);
                      }
                    }}
                    onMouseEnter={() => {
                      if (!game.locked && tts.isEnabled()) {
                        playSound('hover');
                        tts.speak(`${game.title}. ${game.description}. Click to play!`);
                      }
                    }}
                  >
                    <div className={`h-3 bg-gradient-to-r ${game.color}`} />
                    <div className="p-8 relative">
                      {game.locked && (
                        <div className="absolute top-4 right-4">
                          <div className="bg-gray-400 rounded-full p-2">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                        </div>
                      )}
                      <div className={`bg-gradient-to-r ${game.color} rounded-2xl p-4 inline-block mb-4`}>
                        <Icon className="w-12 h-12 text-white" />
                      </div>
                      <h3 className="text-gray-800 mb-2 font-bold text-xl">{game.title}</h3>
                      <p className="text-gray-600 text-base mb-6">{game.description}</p>
                      {!game.locked && (
                        <Button className="w-full bg-white hover:bg-gray-50 text-gray-800 border-3 border-gray-300 py-6 text-lg font-bold">
                          <Play className="w-6 h-6 mr-2" />
                          Play Now
                        </Button>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white shadow-md border-2 border-blue-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Puzzle className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-gray-800 font-semibold">Brain Power</h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-blue-600 font-bold">{cognitiveScore}/5</span>
              <span className="text-gray-500 text-sm">skills</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 transition-all duration-500"
                style={{ width: `${(cognitiveScore / 5) * 100}%` }}
              />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-md border-2 border-orange-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 rounded-full p-3">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-gray-800 font-semibold">Focus Power</h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-orange-600 font-bold">{executiveScore}/4</span>
              <span className="text-gray-500 text-sm">skills</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-500"
                style={{ width: `${(executiveScore / 4) * 100}%` }}
              />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-md border-2 border-pink-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-pink-100 rounded-full p-3">
                <Heart className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-gray-800 font-semibold">Friend Power</h3>
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-pink-600 font-bold">{socialScore}/3</span>
              <span className="text-gray-500 text-sm">skills</span>
            </div>
            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-pink-400 to-rose-400 transition-all duration-500"
                style={{ width: `${(socialScore / 3) * 100}%` }}
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Theme and Sound Settings */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
        <button
          onClick={toggleSound}
          className="bg-white shadow-lg rounded-full p-4 border-2 border-purple-300 hover:border-purple-500 transition-colors"
          aria-label={soundEnabled ? "Sound On" : "Sound Off"}
        >
          {soundEnabled ? (
            <Volume2 className="w-6 h-6 text-purple-600" />
          ) : (
            <VolumeX className="w-6 h-6 text-gray-500" />
          )}
        </button>

        <button
          onClick={() => {
            setShowThemeSelector(!showThemeSelector);
            playSound('click');
          }}
          className="bg-white shadow-lg rounded-full p-4 border-2 border-purple-300 hover:border-purple-500 transition-colors"
          aria-label="Change Theme"
        >
          <Palette className="w-6 h-6 text-purple-600" />
        </button>

        {/* Voice Helper Button */}
        <button
          onClick={() => {
            setShowHelper(!showHelper);
            playSound('click');
            if (!showHelper && tts.isEnabled()) {
              tts.speak('Hi! I\'m your helper buddy! I can read buttons to you. Just move your mouse over them!');
            }
          }}
          className="bg-white shadow-lg rounded-full p-4 border-2 border-purple-300 hover:border-purple-500 transition-colors"
          aria-label="Voice Helper"
        >
          <MessageCircle className="w-6 h-6 text-purple-600" />
        </button>

        {showThemeSelector && (
          <div className="absolute bottom-0 right-full mr-3 bg-white shadow-xl rounded-xl p-4 border-2 border-purple-200 min-w-[200px]">
            <p className="text-gray-800 mb-3 font-semibold">Choose Theme</p>
            <div className="space-y-2">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`w-full px-4 py-3 rounded-lg text-left transition-all font-medium ${
                    currentTheme === key
                      ? `bg-gradient-to-r ${theme.buttonColor} text-white`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {theme.name}
                  {currentTheme === key && ' ✓'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Accessibility Menu */}
      <AccessibilityMenu />
      
      {/* Sibling Quick Switch */}
      <SiblingQuickSwitch />
      
      {/* Avatar Customization Modal */}
      {showAvatarCustomization && (
        <AvatarCustomization
          currentAvatar={currentAvatar}
          onSave={handleSaveAvatar}
          onClose={() => setShowAvatarCustomization(false)}
        />
      )}
      
      {/* Badge Collection Modal */}
      {showBadgeCollection && (
        <BadgeCollection
          earnedBadges={earnedBadges}
          onClose={() => setShowBadgeCollection(false)}
          completedChallenges={totalScore}
        />
      )}
      
      {/* Progress Dashboard Modal */}
      {showProgressDashboard && (
        <ProgressDashboard
          onClose={() => setShowProgressDashboard(false)}
          userData={{
            sensoryScore: 75,
            cognitiveScore: (cognitiveScore / 5) * 100,
            executiveScore: (executiveScore / 4) * 100,
            socialScore: (socialScore / 3) * 100,
            completedChallenges: totalScore,
          }}
        />
      )}
      
      {/* Break Reminder */}
      <BreakReminder
        show={showBreakReminder}
        onTakeBreak={() => {}}
        onKeepPlaying={() => setShowBreakReminder(false)}
        challengesCompleted={sessionChallenges}
      />
      
      {/* Mood Check-In */}
      <MoodCheckIn
        show={showMoodCheckIn}
        type={moodCheckInType}
        onComplete={(mood, energy) => {
          setCurrentMood(mood);
          setShowMoodCheckIn(false);
        }}
      />
      
      {/* TTS Settings */}
      {showTTSSettings && (
        <TTSSettings onClose={() => setShowTTSSettings(false)} />
      )}
      
      {/* Voice Helper Buddy */}
      <VoiceHelper show={showHelper} onClose={() => setShowHelper(false)} />
    </div>
  );
}