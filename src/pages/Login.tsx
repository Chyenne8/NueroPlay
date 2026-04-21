import { motion } from "framer-motion";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Rocket, Star, Heart, LogIn, UserPlus, CircleHelp as HelpCircle, Key, Shield } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-100 to-blue-200 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Floating Decorations */}
      <motion.div
        className="absolute top-10 left-10 text-6xl"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        🎮
      </motion.div>
      <motion.div
        className="absolute top-20 right-20 text-6xl"
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        🚀
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-20 text-6xl"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        🌈
      </motion.div>
      <motion.div
        className="absolute bottom-10 right-10 text-6xl"
        animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        ✨
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md z-10"
      >
        <Card className="p-8 shadow-2xl border border-purple-200 bg-white/95 backdrop-blur-md rounded-2xl">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <img src={logo} alt="NeuroPlay Logo" className="w-20 h-20 mx-auto" />
            </motion.div>
            <h1
              className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-1 cursor-pointer"
              onClick={() => tts.speak('NeuroPlay Adventure')}
            >
              NeuroPlay Adventure
            </h1>
            <p
              className="text-gray-600 text-sm cursor-pointer"
              onClick={() => tts.speak(isSignup ? 'Create your adventure profile!' : 'Welcome back, adventurer!')}
            >
              {isSignup ? 'Create your adventure profile! 🎨' : 'Welcome back, adventurer! ☀️'}
            </p>
          </div>

          {/* Toggle Between Login/Signup */}
          <div className="flex gap-2 mb-6 bg-pink-100 p-1.5 rounded-xl">
            <button
              onClick={() => {
                setIsSignup(false);
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                !isSignup
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-purple-600 hover:bg-pink-50'
              }`}
            >
              <LogIn className="w-4 h-4" />
              Login
            </button>
            <button
              onClick={() => {
                setIsSignup(true);
                setError('');
              }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                isSignup
                  ? 'bg-white text-purple-600 shadow-lg'
                  : 'text-purple-600 hover:bg-pink-50'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-800 mb-2 font-semibold text-sm">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white text-gray-800 placeholder-gray-500"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-gray-800 mb-2 font-semibold text-sm">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white text-gray-800 placeholder-gray-500"
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-gray-800 mb-2 font-semibold text-sm">
                  How old are you?
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Your age"
                  min="3"
                  max="18"
                  className="w-full px-4 py-3 border-2 border-purple-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all bg-white text-gray-800 placeholder-gray-500"
                />
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isSignup ? (
                <>
                  <Rocket className="w-4 h-4 mr-2" />
                  Start My Adventure!
                </>
              ) : (
                <>
                  <Star className="w-4 h-4 mr-2" />
                  Let's Play!
                </>
              )}
            </Button>
          </form>

          {/* Forgot Password Link - Only show on Login */}
          {!isSignup && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowForgotPassword(true)}
                className="text-purple-600 hover:text-purple-800 text-xs transition-colors font-medium inline-flex items-center gap-1"
              >
                <HelpCircle className="w-4 h-4" />
                Forgot Password?
              </button>
            </div>
          )}

          {/* Fun Facts */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 text-purple-700">
              <Heart className="w-4 h-4 flex-shrink-0" />
              <p className="text-xs font-medium">
                {isSignup
                  ? 'Join thousands of kids having fun learning!'
                  : 'Your adventure is waiting for you!'}
              </p>
            </div>
          </div>
        </Card>

        {/* Hidden Admin Link */}
        <div className="text-center mt-4 space-y-2">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="text-purple-600 hover:text-purple-800 text-xs font-medium transition-colors inline-flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Admin Panel
            </button>
            <button
              onClick={() => navigate('/features')}
              className="text-purple-600 hover:text-purple-800 text-xs font-medium transition-colors"
            >
              ✨ Features
            </button>
          </div>
          <button
            onClick={() => navigate('/caregiver-login')}
            className="text-purple-600 hover:text-purple-800 text-xs font-medium transition-colors"
          >
            👨‍👩‍👧 Caregiver Portal
          </button>
        </div>
      </motion.div>

      {/* Accessibility Menu */}
      <AccessibilityMenu />

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowForgotPassword(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="p-8 max-w-md w-full shadow-2xl border-2 border-purple-200 bg-white rounded-2xl">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-br from-purple-400 to-pink-400 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                  <Key className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-gray-800 mb-2 font-bold">Need Help? 🤗</h2>
                <p className="text-gray-600 text-sm">Ask a grown-up to help you!</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200 mb-6">
                <h3 className="text-purple-900 mb-3 font-semibold text-sm text-center">What to do:</h3>
                <div className="space-y-3 text-xs text-purple-800">
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">1️⃣</span>
                    <p>Ask a parent, teacher, or caregiver to help you</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">2️⃣</span>
                    <p>They can check what password you used when you signed up</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-lg flex-shrink-0">3️⃣</span>
                    <p>Or you can create a new account with a new username!</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
                <div className="flex gap-3">
                  <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-blue-900 text-xs font-semibold mb-1">Tip for Grown-ups</h4>
                    <p className="text-blue-800 text-xs">
                      User data is stored locally in the browser. Check the Admin Panel to view all accounts and reset passwords if needed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowForgotPassword(false)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 rounded-lg font-medium"
                >
                  Got it! 👍
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}