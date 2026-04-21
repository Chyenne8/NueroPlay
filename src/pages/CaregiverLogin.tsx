import { motion } from "framer-motion";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, LogIn, UserPlus, Shield, ArrowLeft, Database, HardDrive } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { AccessibilityMenu } from '../components/AccessibilityMenu';
import { tts } from '../utils/textToSpeech';
import { isSupabaseConfigured, saveCaregiver, getCaregiver } from '../utils/supabaseClient';
import logo from 'figma:asset/aadab99d44823bd0e822f7b307d367d42eb8cf5c.png';

export default function CaregiverLogin() {
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const usingSupabase = isSupabaseConfigured();

  // LocalStorage fallback functions
  const getCaregivers = () => {
    const stored = localStorage.getItem('neuroPlayCaregivers');
    return stored ? JSON.parse(stored) : [];
  };

  const saveCaregivers = (caregivers: any[]) => {
    localStorage.setItem('neuroPlayCaregivers', JSON.stringify(caregivers));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    if (usingSupabase) {
      const { data, error: supaError } = await getCaregiver(email, password);
      if (supaError) {
        setError('Oops! Email or password is incorrect 😕');
        setLoading(false);
        return;
      }
      localStorage.setItem('currentCaregiver', JSON.stringify(data));
      
      if (tts.isEnabled()) {
        tts.speak('Login successful! Welcome back.');
      }
      
      setLoading(false);
      navigate('/caregiver-dashboard');
    } else {
      const caregivers = getCaregivers();
      const caregiver = caregivers.find((c: any) => c.email === email && c.password === password);

      if (caregiver) {
        localStorage.setItem('currentCaregiver', JSON.stringify(caregiver));
        
        if (tts.isEnabled()) {
          tts.speak('Login successful! Welcome back.');
        }
        
        setLoading(false);
        navigate('/caregiver-dashboard');
      } else {
        setError('Oops! Email or password is incorrect 😕');
        setLoading(false);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !name) {
      setError('Please fill in all fields! 📝');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long! 🔒');
      return;
    }

    // Simple email validation
    if (!email.includes('@')) {
      setError('Please enter a valid email address! 📧');
      return;
    }

    setLoading(true);

    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const newCaregiver = {
      id: Date.now().toString(),
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
      children: [],
    };

    if (usingSupabase) {
      const { data, error: supaError } = await saveCaregiver(email, newCaregiver);
      if (supaError) {
        setError('This email is already registered! Try logging in instead 🔑');
        setLoading(false);
        return;
      }
      localStorage.setItem('currentCaregiver', JSON.stringify(data));
      
      if (tts.isEnabled()) {
        tts.speak('Account created successfully! Welcome to NeuroPlay.');
      }
      
      setLoading(false);
      navigate('/caregiver-dashboard');
    } else {
      const caregivers = getCaregivers();
      
      if (caregivers.find((c: any) => c.email === email)) {
        setError('This email is already registered! Try logging in instead 🔑');
        setLoading(false);
        return;
      }

      caregivers.push(newCaregiver);
      saveCaregivers(caregivers);
      localStorage.setItem('currentCaregiver', JSON.stringify(newCaregiver));
      
      if (tts.isEnabled()) {
        tts.speak('Account created successfully! Welcome to NeuroPlay.');
      }
      
      setLoading(false);
      navigate('/caregiver-dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 flex items-center justify-center p-4">
      {/* Floating Decorations */}
      <motion.div
        className="absolute top-10 left-10 text-6xl"
        animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        👨‍👩‍👧‍👦
      </motion.div>
      <motion.div
        className="absolute top-20 right-20 text-6xl"
        animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        💙
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-20 text-6xl"
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        🧠
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        {/* Back Button */}
        <Button
          onClick={() => navigate('/')}
          className="mb-4 bg-white/80 text-gray-700 hover:bg-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Kid Login
        </Button>

        <Card className="p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          {/* Logo/Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-4"
            >
              <img src={logo} alt="NeuroPlay Logo" className="w-32 h-32 mx-auto" />
            </motion.div>
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              <h1 className="text-indigo-600">Caregiver Portal</h1>
            </div>
            <p 
              className="text-gray-600 cursor-pointer"
              onClick={() => tts.speak(isSignup ? 'Create your caregiver account' : 'Welcome back, caregiver')}
            >
              {isSignup ? 'Create your caregiver account 🌟' : 'Welcome back, caregiver! 👋'}
            </p>
          </div>

          {/* Toggle Between Login/Signup */}
          <div className="flex gap-2 mb-6 bg-indigo-100 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsSignup(false);
                setError('');
              }}
              className={`flex-1 py-2 rounded-md transition-all ${
                !isSignup
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <LogIn className="w-4 h-4 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => {
                setIsSignup(true);
                setError('');
              }}
              className={`flex-1 py-2 rounded-md transition-all ${
                isSignup
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-indigo-600 hover:bg-indigo-50'
              }`}
            >
              <UserPlus className="w-4 h-4 inline mr-2" />
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={isSignup ? handleSignup : handleLogin} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                autoFocus={!isSignup}
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 border-2 border-indigo-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-6 text-lg hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="inline-block mr-2"
                  >
                    ⏳
                  </motion.span>
                  {isSignup ? 'Creating Account...' : 'Logging In...'}
                </>
              ) : (
                <>
                  {isSignup ? (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      Create Account
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5 mr-2" />
                      Access Dashboard
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-2 border-indigo-100">
            <div className="flex items-center gap-2 text-indigo-700">
              <Heart className="w-5 h-5" />
              <p className="text-sm">
                {isSignup
                  ? 'Track your children\'s progress and insights!'
                  : 'Manage multiple child profiles in one place!'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      <AccessibilityMenu />
    </div>
  );
}