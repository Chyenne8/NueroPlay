import { motion } from "framer-motion";
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Star, Trophy, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';

interface DailyChallengeCardProps {
  challengeOfDay: {
    id: string;
    name: string;
    icon: string;
    description: string;
    path: string;
    reward: string;
  };
  isCompleted: boolean;
  onComplete?: () => void;
}

export function DailyChallengeCard({ challengeOfDay, isCompleted, onComplete }: DailyChallengeCardProps) {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate(challengeOfDay.path);
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 border-4 border-yellow-300 relative overflow-hidden">
      {/* Sparkle decorations */}
      <motion.div
        animate={{
          rotate: [0, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-2 right-2 text-yellow-400 text-2xl"
      >
        ✨
      </motion.div>

      <div className="flex items-start gap-4">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="text-6xl"
        >
          {challengeOfDay.icon}
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <h3 className="text-gray-800 font-bold">Challenge of the Day!</h3>
          </div>

          <h4 className="text-xl font-bold text-gray-900 mb-2">
            {challengeOfDay.name}
          </h4>

          <p className="text-gray-700 mb-3">
            {challengeOfDay.description}
          </p>

          <div className="bg-white/50 rounded-lg p-3 mb-4 border-2 border-yellow-200">
            <p className="text-sm text-gray-700 flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-600" />
              <span className="font-semibold">Reward:</span> {challengeOfDay.reward}
            </p>
          </div>

          {isCompleted ? (
            <div className="bg-green-500 text-white rounded-lg p-3 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold">Completed Today! 🎉</span>
            </div>
          ) : (
            <Button
              onClick={handleStart}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold"
            >
              <Star className="w-5 h-5 mr-2" />
              Start Daily Challenge
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

// Helper function to get challenge of the day
export function getChallengeOfDay(): any {
  const challenges = [
    {
      id: 'texture-explorer',
      name: 'Texture Explorer',
      icon: '✋',
      description: 'Match different textures and learn about how things feel!',
      path: '/challenge/texture-explorer',
      reward: 'Texture Master Badge',
      day: 0 // Sunday
    },
    {
      id: 'pattern-detective',
      name: 'Pattern Detective',
      icon: '🔍',
      description: 'Find and complete the hidden patterns!',
      path: '/challenge/pattern-detective',
      reward: 'Pattern Pro Badge',
      day: 1 // Monday
    },
    {
      id: 'sequence-builder',
      name: 'Sequence Builder',
      icon: '🧩',
      description: 'Build sequences in the right order!',
      path: '/challenge/sequence-builder',
      reward: 'Sequence Star Badge',
      day: 2 // Tuesday
    },
    {
      id: 'emotion-match',
      name: 'Emotion Match',
      icon: '😊',
      description: 'Match faces to feelings and learn about emotions!',
      path: '/challenge/emotion-match',
      reward: 'Emotion Expert Badge',
      day: 3 // Wednesday
    },
    {
      id: 'sound-explorer',
      name: 'Sound Explorer',
      icon: '🎵',
      description: 'Listen to sounds and match them correctly!',
      path: '/challenge/sound-explorer',
      reward: 'Sound Specialist Badge',
      day: 4 // Thursday
    },
    {
      id: 'visual-sorting',
      name: 'Visual Sorting',
      icon: '🎨',
      description: 'Sort items by color, shape, or size!',
      path: '/challenge/visual-sorting',
      reward: 'Sorting Superstar Badge',
      day: 5 // Friday
    },
    {
      id: 'memory-champion',
      name: 'Memory Champion',
      icon: '🧠',
      description: 'Remember the patterns and match them!',
      path: '/challenge/memory-champion',
      reward: 'Memory Master Badge',
      day: 6 // Saturday
    }
  ];

  const today = new Date().getDay();
  return challenges.find(c => c.day === today) || challenges[0];
}
