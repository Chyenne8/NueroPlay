import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Rocket, Star, Heart, LogIn, UserPlus, CircleHelp as HelpCircle, Key, Shield, Zap, Trophy } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AccessibilityMenu } from '../components/AccessibilityMenu';
import { tts } from '../utils/textToSpeech';
import logo from 'figma:asset/aadab99d44823bd0e822f7b307d367d42eb8cf5c.png';

export default function Login() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const getUsers = () => {
    const stored = localStorage.getItem('neuroPlayUsers');
    return stored ? JSON.parse(stored) : [];
  };

  const saveUsers = (users: any[]) => {
    localStorage.setItem('neuroPlayUsers', JSON.stringify(users));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = getUsers();
    const user = users.find((u: any) => u.username === username && u.password === password);

    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      navigate('/dashboard');
    } else {
      setError('Oops! Username or password is incorrect 😕');
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password || !age) {
      setError('Please fill in all fields! 📝');
      return;
    }

    if (username.length < 3) {
      setError('Username needs to be at least 3 characters! 😊');
      return;
    }

    const users = getUsers();
    
    if (users.find((u: any) => u.username === username)) {
      setError('This username is already taken! Try another one 🎯');
      return;
    }

    const newUser = {
      username,
      password,
      role: 'kid',
      age: parseInt(age),
      createdAt: new Date().toISOString(),
      quizCompleted: false,
      quizResults: null,
      theme: 'pastel',
      soundEnabled: true,
      canRetakeQuiz: true,
    };

    users.push(newUser);
    saveUsers(users);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Set default "no consent" for kids signing up without a parent (COPPA compliant)
    // When a parent links this account later, they'll be prompted to set proper consent
    const defaultConsent = {
      progressTracking: false,
      gameplayData: false,
      preferences: false,
      parentNotes: false,
      lastUpdated: new Date().toISOString(),
      consentGivenBy: 'default_child_signup',
      childSignedUpIndependently: true // Flag to trigger consent when parent links
    };
    localStorage.setItem(`dataConsent_${username}`, JSON.stringify(defaultConsent));
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-300 via-fuchsia-200 to-cyan-300 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
          animate={{ y: [0, -40, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
          animate={{ y: [0, 40, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-1/2 left-1/2 w-96 h-96 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Floating Decorations */}
      <motion.div
        className="absolute top-10 left-10 text-7xl drop-shadow-lg"
        animate={{ y: [0, -20, 0], rotate: [0, 15, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🎮
      </motion.div>
      <motion.div
        className="absolute top-1/4 right-12 text-8xl drop-shadow-lg"
        animate={{ y: [0, 30, 0], rotate: [0, -15, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 5, repeat: Infinity }}
      >
        🚀
      </motion.div>
      <motion.div
        className="absolute bottom-1/4 left-8 text-7xl drop-shadow-lg"
        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        🌈
      </motion.div>
      <motion.div
        className="absolute bottom-12 right-16 text-7xl drop-shadow-lg"
        animate={{ y: [0, 20, 0], rotate: [0, -20, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      >
        ✨
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md z-10"
      >
        <Card className="p-8 shadow-2xl border-2 border-white/50 bg-white/98 backdrop-blur-lg rounded-3xl overflow-hidden relative">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-purple-50 opacity-50 pointer-events-none" />

          <div className="relative z-10">
            {/* Logo/Title */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="inline-block mb-4 relative"
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-full blur-lg opacity-60"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <img src={logo} alt="NeuroPlay Logo" className="w-28 h-28 mx-auto relative" />
              </motion.div>
              <motion.h1
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 mb-2 cursor-pointer"
                onClick={() => tts.speak('NeuroPlay Adventure')}
              >
                NeuroPlay Adventure
              </motion.h1>
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-gray-700 text-base font-semibold cursor-pointer"
                onClick={() => tts.speak(isSignup ? 'Create your adventure profile!' : 'Welcome back, adventurer!')}
              >
                {isSignup ? 'Create your adventure profile! 🎨' : 'Welcome back, adventurer! ☀️'}
              </motion.p>
            </div>

            {/* Toggle Between Login/Signup */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-3 mb-8 bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 p-2 rounded-2xl shadow-lg border border-white/50"
            >
              <button
                onClick={() => {
                  setIsSignup(false);
                  setError('');
                }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  !isSignup
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl scale-105'
                    : 'text-gray-700 hover:bg-white/30'
                }`}
              >
                <LogIn className="w-5 h-5" />
                Login
              </button>
              <button
                onClick={() => {
                  setIsSignup(true);
                  setError('');
                }}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isSignup
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl scale-105'
                    : 'text-gray-700 hover:bg-white/30'
                }`}
              >
                <UserPlus className="w-5 h-5" />
                Sign Up
              </button>
            </motion.div>

            {/* Form */}
            <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-5">
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <label className="block text-gray-800 mb-2 font-bold text-sm">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-5 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 transition-all bg-gradient-to-br from-white to-purple-50 text-gray-800 placeholder-gray-400 shadow-sm"
                  autoFocus
                />
              </motion.div>

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <label className="block text-gray-800 mb-2 font-bold text-sm">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-5 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 transition-all bg-gradient-to-br from-white to-purple-50 text-gray-800 placeholder-gray-400 shadow-sm"
                />
              </motion.div>

              {isSignup && (
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <label className="block text-gray-800 mb-2 font-bold text-sm">
                    How old are you?
                  </label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Your age"
                    min="3"
                    max="18"
                    className="w-full px-5 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-300/50 transition-all bg-gradient-to-br from-white to-purple-50 text-gray-800 placeholder-gray-400 shadow-sm"
                  />
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold shadow-md"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white py-4 font-bold rounded-xl hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg"
                >
                  {isSignup ? (
                    <>
                      <Rocket className="w-5 h-5 mr-2 inline" />
                      Start My Adventure!
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5 mr-2 inline" />
                      Let's Play!
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Forgot Password Link - Only show on Login */}
            {!isSignup && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="mt-4 text-center"
              >
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-purple-600 hover:text-purple-800 text-sm transition-colors font-semibold inline-flex items-center gap-2 hover:gap-3"
                >
                  <HelpCircle className="w-4 h-4" />
                  Forgot Password?
                </button>
              </motion.div>
            )}

            {/* Fun Facts */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="mt-8 p-5 bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 rounded-2xl border-2 border-white/50 shadow-lg"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-5 h-5 flex-shrink-0 text-red-500" />
                </motion.div>
                <p className="text-sm font-bold text-gray-800">
                  {isSignup
                    ? 'Join thousands of kids having fun learning!'
                    : 'Your adventure is waiting for you!'}
                </p>
              </div>
            </motion.div>
          </div>
        </Card>

        {/* Bottom Links */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="text-center mt-6 space-y-3 z-10 relative"
        >
          <div className="flex justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-bold text-xs shadow-lg hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin Panel
            </button>
            <button
              onClick={() => navigate('/features')}
              className="px-4 py-2 bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl font-bold text-xs shadow-lg hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Features
            </button>
          </div>
          <button
            onClick={() => navigate('/caregiver-login')}
            className="px-4 py-2 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg hover:shadow-xl transition-all hover:scale-105 inline-flex items-center gap-2 mx-auto"
          >
            <Heart className="w-4 h-4" />
            Caregiver Portal
          </button>
        </motion.div>
      </motion.div>

      {/* Accessibility Menu */}
      <AccessibilityMenu />

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowForgotPassword(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-8 max-w-md w-full shadow-2xl border-2 border-white/50 bg-white/98 rounded-3xl">
              <div className="text-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="bg-gradient-to-br from-orange-400 via-pink-400 to-purple-400 rounded-full p-4 w-20 h-20 mx-auto mb-4 shadow-lg"
                >
                  <Key className="w-12 h-12 text-white" />
                </motion.div>
                <h2 className="text-gray-800 mb-2 font-black text-2xl">Need Help? 🤗</h2>
                <p className="text-gray-600 text-sm font-semibold">Ask a grown-up to help you!</p>
              </div>

              <div className="bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 p-6 rounded-2xl border-2 border-white/50 mb-6 shadow-md">
                <h3 className="text-gray-800 mb-4 font-black text-center">What to do:</h3>
                <div className="space-y-3 text-sm text-gray-800">
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-3 bg-white/50 p-3 rounded-xl"
                  >
                    <span className="text-2xl flex-shrink-0">1️⃣</span>
                    <p className="font-semibold">Ask a parent, teacher, or caregiver to help you</p>
                  </motion.div>
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-start gap-3 bg-white/50 p-3 rounded-xl"
                  >
                    <span className="text-2xl flex-shrink-0">2️⃣</span>
                    <p className="font-semibold">They can check what password you used when you signed up</p>
                  </motion.div>
                  <motion.div
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-3 bg-white/50 p-3 rounded-xl"
                  >
                    <span className="text-2xl flex-shrink-0">3️⃣</span>
                    <p className="font-semibold">Or you can create a new account with a new username!</p>
                  </motion.div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 p-5 rounded-2xl border-2 border-blue-300 mb-6 shadow-md">
                <div className="flex gap-3">
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  </motion.div>
                  <div>
                    <h4 className="text-blue-900 text-sm font-black mb-1">Tip for Grown-ups 👨‍👩‍👧‍👦</h4>
                    <p className="text-blue-800 text-xs font-semibold">
                      User data is stored locally in the browser. Check the Admin Panel to view all accounts and reset passwords if needed.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => setShowForgotPassword(false)}
                className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 text-white hover:from-orange-600 hover:via-pink-600 hover:to-purple-600 rounded-xl font-bold py-3 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 text-base"
              >
                Got it! 👍
              </Button>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}