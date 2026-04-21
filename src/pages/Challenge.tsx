import { useParams, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Home, Trophy, Star } from 'lucide-react';
import { useState, useEffect } from 'react';

// Define all available challenges
const challenges: Record<string, {
  name: string;
  icon: string;
  description: string;
  instructions: string;
  domain: string;
}> = {
  'texture-explorer': {
    name: 'Texture Explorer',
    icon: '✋',
    description: 'Match different textures and learn about how things feel!',
    instructions: 'Touch and match textures that feel the same.',
    domain: 'sensory'
  },
  'pattern-detective': {
    name: 'Pattern Detective',
    icon: '🔍',
    description: 'Find and complete the hidden patterns!',
    instructions: 'Look for patterns and complete the sequence.',
    domain: 'cognitive'
  },
  'sequence-builder': {
    name: 'Sequence Builder',
    icon: '🧩',
    description: 'Build sequences in the right order!',
    instructions: 'Put the items in the correct order.',
    domain: 'executive'
  },
  'emotion-match': {
    name: 'Emotion Match',
    icon: '😊',
    description: 'Match faces to feelings and learn about emotions!',
    instructions: 'Match the face to how the person is feeling.',
    domain: 'social'
  },
  'sound-explorer': {
    name: 'Sound Explorer',
    icon: '🎵',
    description: 'Listen to sounds and match them correctly!',
    instructions: 'Listen carefully and match the sounds.',
    domain: 'sensory'
  },
  'visual-sorting': {
    name: 'Visual Sorting',
    icon: '🎨',
    description: 'Sort items by color, shape, or size!',
    instructions: 'Sort the items into the correct groups.',
    domain: 'sensory'
  },
  'memory-champion': {
    name: 'Memory Champion',
    icon: '🧠',
    description: 'Remember the patterns and match them!',
    instructions: 'Remember the pattern and match it.',
    domain: 'cognitive'
  }
};

export default function Challenge() {
  const { challengeId } = useParams<{ challengeId: string }>();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);

  const challenge = challengeId ? challenges[challengeId] : null;

  useEffect(() => {
    if (!challenge) {
      // Redirect to dashboard if challenge not found
      navigate('/dashboard');
    }
  }, [challenge, navigate]);

  const handleComplete = () => {
    setCompleted(true);
    
    // Save completion to localStorage
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const userData = JSON.parse(localStorage.getItem(`userData_${currentUser.username}`) || '{}');
    
    if (!userData.completedChallenges) {
      userData.completedChallenges = [];
    }
    
    if (!userData.completedChallenges.includes(challengeId)) {
      userData.completedChallenges.push(challengeId);
      
      // Update domain scores based on challenge type
      if (challenge) {
        const scoreMap: Record<string, keyof typeof userData> = {
          'sensory': 'sensoryScore',
          'cognitive': 'cognitiveScore',
          'executive': 'executiveScore',
          'social': 'socialScore'
        };
        
        const scoreKey = scoreMap[challenge.domain];
        if (scoreKey) {
          userData[scoreKey] = (userData[scoreKey] || 0) + 1;
        }
      }
      
      localStorage.setItem(`userData_${currentUser.username}`, JSON.stringify(userData));
    }
  };

  if (!challenge) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="bg-white border-2 border-purple-300"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </motion.div>

        {/* Challenge Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="p-8 bg-white border-4 border-purple-300 shadow-2xl">
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{challenge.icon}</div>
              <h1 className="text-4xl font-bold text-purple-700 mb-2">
                {challenge.name}
              </h1>
              <p className="text-xl text-gray-600 mb-4">{challenge.description}</p>
              <div className="bg-blue-100 border-2 border-blue-300 rounded-xl p-4 inline-block">
                <p className="text-lg font-semibold text-blue-800">
                  📋 {challenge.instructions}
                </p>
              </div>
            </div>

            {!completed ? (
              <div className="space-y-6">
                {/* Challenge Placeholder */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-4 border-dashed border-purple-300 rounded-2xl p-12 text-center">
                  <p className="text-2xl text-purple-600 font-bold mb-4">
                    🎮 Challenge Activity Goes Here
                  </p>
                  <p className="text-gray-600 mb-6">
                    This is a placeholder for the interactive {challenge.name} game.
                    The actual game mechanics would be implemented here!
                  </p>
                  <Button
                    onClick={handleComplete}
                    className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white text-xl px-8 py-6 rounded-2xl border-4 border-white shadow-lg"
                  >
                    <Trophy className="w-6 h-6 mr-2" />
                    Complete Challenge
                  </Button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-br from-yellow-100 to-orange-100 border-4 border-yellow-300 rounded-2xl p-12 text-center"
              >
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-bold text-orange-700 mb-2">
                  Challenge Complete!
                </h2>
                <p className="text-xl text-gray-700 mb-6">
                  Amazing work! You earned points in the {challenge.domain} domain!
                </p>
                <div className="flex gap-4 justify-center mb-6">
                  <div className="bg-white rounded-xl p-4 border-2 border-yellow-400">
                    <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="font-bold">+1 Point</p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/dashboard')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl px-8 py-4 rounded-2xl"
                >
                  <Home className="w-6 h-6 mr-2" />
                  Return to Dashboard
                </Button>
              </motion.div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
