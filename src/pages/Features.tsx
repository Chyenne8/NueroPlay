import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Sparkles, Users, Award, BarChart3, Bell, Smile, Volume2, 
  Palette, Star, FileText, Lightbulb, Zap, Shield, Calendar,
  Home, Brain, Gamepad2, Heart, Eye, Hand, MessageCircle, TrendingUp,
  Download, Settings, UserCog, Clock, Gift, Trophy, Target
} from 'lucide-react';

export default function Features() {
  const navigate = useNavigate();

  const featureCategories = [
    {
      title: "🎮 Interactive Challenges",
      icon: Gamepad2,
      color: "bg-gradient-to-br from-purple-400 to-purple-600",
      features: [
        { icon: Brain, name: "15 Unique Challenges", desc: "Mapped to sensory, cognitive, executive function & social skills" },
        { icon: Target, name: "4 Progressive Levels", desc: "From sensory discovery to social interaction mastery" },
        { icon: TrendingUp, name: "Adaptive Difficulty", desc: "Automatically adjusts based on child's performance" },
        { icon: Lightbulb, name: "Smart Recommendations", desc: "AI suggests games based on strengths & preferences" },
        { icon: Calendar, name: "Daily Challenges", desc: "New challenges unlock each day to keep play fresh" }
      ]
    },
    {
      title: "🏆 Rewards & Progress",
      icon: Award,
      color: "bg-gradient-to-br from-yellow-400 to-orange-500",
      features: [
        { icon: Trophy, name: "Badge System", desc: "Earn badges for completing challenges & reaching milestones" },
        { icon: Gift, name: "Reward Unlocks", desc: "Collect stars to unlock new avatars, themes & features" },
        { icon: BarChart3, name: "Visual Progress Dashboard", desc: "See growth across all skill domains with charts" },
        { icon: Star, name: "Achievement Tracking", desc: "Track completed challenges, streaks & personal bests" },
        { icon: Zap, name: "Level System", desc: "Progress through 4 levels as skills develop" }
      ]
    },
    {
      title: "♿ Accessibility Features",
      icon: Eye,
      color: "bg-gradient-to-br from-blue-400 to-blue-600",
      features: [
        { icon: Volume2, name: "Text-to-Speech", desc: "Read-aloud support for all text with customizable voices" },
        { icon: Hand, name: "High Contrast Mode", desc: "Enhanced visibility for better readability" },
        { icon: Palette, name: "Multiple Themes", desc: "Choose from 6 sensory-friendly color schemes" },
        { icon: Settings, name: "Font Size Controls", desc: "Adjustable text size for comfortable reading" },
        { icon: Eye, name: "Visual Supports", desc: "Icons, emojis & images support understanding" }
      ]
    },
    {
      title: "😊 Wellbeing Support",
      icon: Heart,
      color: "bg-gradient-to-br from-pink-400 to-rose-500",
      features: [
        { icon: Smile, name: "Mood Check-In", desc: "Daily emotional check-ins with emoji-based tracking" },
        { icon: Bell, name: "Break Reminders", desc: "Gentle prompts to take breaks & stay regulated" },
        { icon: Clock, name: "Session Timer", desc: "Visual countdown helps manage play time" },
        { icon: Heart, name: "Sensory Preferences", desc: "Environment adapts to child's sensory needs" },
        { icon: Sparkles, name: "Positive Reinforcement", desc: "Encouraging feedback celebrates every achievement" }
      ]
    },
    {
      title: "👨‍👩‍👧‍👦 Family Features",
      icon: Users,
      color: "bg-gradient-to-br from-green-400 to-emerald-600",
      features: [
        { icon: Users, name: "Sibling Quick-Switch", desc: "Kids under same parent can switch profiles instantly" },
        { icon: UserCog, name: "Caregiver Portal", desc: "Parents manage all children from one dashboard" },
        { icon: FileText, name: "Caregiver Notes", desc: "Add observations & track behavioral patterns" },
        { icon: Download, name: "PDF Reports", desc: "Generate & download detailed progress reports" },
        { icon: Shield, name: "Admin Controls", desc: "Manage quiz retakes & access permissions" }
      ]
    },
    {
      title: "🧠 Personalization Engine",
      icon: Brain,
      color: "bg-gradient-to-br from-indigo-400 to-purple-600",
      features: [
        { icon: Brain, name: "Preference Learning", desc: "System learns child's strengths & interests over time" },
        { icon: Settings, name: "Auto-Adjusting Settings", desc: "Environment adapts based on demonstrated needs" },
        { icon: Lightbulb, name: "Story Mode Suggestions", desc: "Recommends narrative styles based on engagement" },
        { icon: Target, name: "Skill Profiling", desc: "Background scoring tracks 4 developmental domains" },
        { icon: Sparkles, name: "Custom Avatars", desc: "Personalized character creation & customization" }
      ]
    }
  ];

  const quickStats = [
    { number: "15", label: "Interactive Challenges", icon: Gamepad2 },
    { number: "4", label: "Skill Domains", icon: Brain },
    { number: "6", label: "Accessibility Themes", icon: Palette },
    { number: "30+", label: "Unique Features", icon: Sparkles }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="bg-white border-2 border-purple-300"
          >
            <Home className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-block mb-4"
          >
            <div className="text-7xl mb-2">🎮</div>
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
              NeuroPlay Features
            </h1>
            <p className="text-xl text-gray-600">
              A Complete Autism-Friendly Gaming Platform
            </p>
          </motion.div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 text-center bg-white border-2 border-purple-200">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                <div className="text-3xl font-bold text-purple-600">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Feature Categories */}
      <div className="max-w-6xl mx-auto space-y-8">
        {featureCategories.map((category, categoryIndex) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: categoryIndex * 0.1 }}
          >
            <Card className="p-6 bg-white border-4 border-gray-200 shadow-lg">
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`${category.color} p-4 rounded-2xl text-white shadow-lg`}>
                  <category.icon className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">{category.title}</h2>
              </div>

              {/* Features Grid */}
              <div className="grid md:grid-cols-2 gap-4">
                {category.features.map((feature, featureIndex) => (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: categoryIndex * 0.1 + featureIndex * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                        <feature.icon className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 mb-1">{feature.name}</h3>
                        <p className="text-sm text-gray-600">{feature.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="max-w-6xl mx-auto mt-12"
      >
        <Card className="p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-4 border-white shadow-2xl">
          <div className="text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Built for Every Child</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              NeuroPlay is designed to celebrate neurodiversity and support every child's unique learning journey. 
              The game never screens for autism—it simply learns preferences and strengths to personalize the experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Brain className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">Neurodiversity-Affirming</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Shield className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">Privacy-First Design</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <div className="font-bold">Strength-Based Approach</div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Bottom Spacing */}
      <div className="h-12" />
    </div>
  );
}
