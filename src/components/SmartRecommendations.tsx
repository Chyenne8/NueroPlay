import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Sparkles, TrendingUp, Target, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router';

interface GameRecommendation {
  id: string;
  title: string;
  icon: string;
  path: string;
  reason: string;
  category: 'strength' | 'growth' | 'mood' | 'new';
}

interface SmartRecommendationsProps {
  userData: {
    sensoryScore: number;
    cognitiveScore: number;
    executiveScore: number;
    socialScore: number;
    completedChallenges: number;
    recentMood?: string;
    completedGames?: string[];
    quizCompleted?: boolean;
  };
}

const allGames = [
  { 
    id: 'challenge-quest', 
    title: 'Challenge Quest', 
    icon: '🎯', 
    path: '/quiz', 
    domain: 'all',
    skills: ['sensory', 'cognitive', 'executive', 'social'],
    description: 'Complete 15 fun challenges to discover your strengths!'
  },
  { 
    id: 'boundaries-game', 
    title: 'Boundaries Game', 
    icon: '🛡️', 
    path: '/story-adventure/boundaries', 
    domain: 'social',
    skills: ['social', 'executive'],
    description: 'Learn about personal space and boundaries'
  },
  { 
    id: 'cooperative-play', 
    title: 'Cooperative Play', 
    icon: '🤝', 
    path: '/story-adventure/cooperative', 
    domain: 'social',
    skills: ['social', 'executive'],
    description: 'Practice working together and sharing'
  },
  { 
    id: 'coloring-book', 
    title: 'Coloring Book', 
    icon: '🎨', 
    path: '/story-adventure/coloring', 
    domain: 'sensory',
    skills: ['sensory', 'executive'],
    description: 'Relax with calming creative activities'
  },
  { 
    id: 'turn-taking', 
    title: 'Turn Taking Game', 
    icon: '🔄', 
    path: '/story-adventure/turn-taking', 
    domain: 'social',
    skills: ['social', 'executive'],
    description: 'Practice patience and taking turns'
  },
  { 
    id: 'word-of-day', 
    title: 'Word of the Day', 
    icon: '📖', 
    path: '/story-adventure/word-of-day', 
    domain: 'cognitive',
    skills: ['cognitive', 'social'],
    description: 'Build vocabulary and language skills'
  },
];

export function SmartRecommendations({ userData }: SmartRecommendationsProps) {
  const navigate = useNavigate();

  const getRecommendations = (): GameRecommendation[] => {
    const recommendations: GameRecommendation[] = [];
    const completedGames = userData.completedGames || [];

    // Priority 1: If quiz not completed, recommend Challenge Quest first
    if (!userData.quizCompleted && !completedGames.includes('challenge-quest')) {
      const game = allGames.find(g => g.id === 'challenge-quest')!;
      recommendations.push({
        id: game.id,
        title: game.title,
        icon: game.icon,
        path: game.path,
        reason: 'Discover your unique strengths!',
        category: 'new'
      });
    }

    // Find available games (not completed)
    const availableGames = allGames.filter(g => !completedGames.includes(g.id));

    // Priority 2: Mood-Based Recommendation (very important for autism-friendly)
    if (userData.recentMood && availableGames.length > 0) {
      let moodGame;
      
      if (['tired', 'calm', 'sad'].includes(userData.recentMood)) {
        // Recommend calming, sensory activities
        moodGame = availableGames.find(g => g.id === 'coloring-book') || 
                   availableGames.find(g => g.domain === 'sensory');
      } else if (['happy', 'excited'].includes(userData.recentMood)) {
        // Recommend social interaction games
        moodGame = availableGames.find(g => g.domain === 'social' && g.id !== 'challenge-quest');
      } else if (['frustrated', 'worried'].includes(userData.recentMood)) {
        // Recommend structured games with clear rules
        moodGame = availableGames.find(g => g.id === 'turn-taking') ||
                   availableGames.find(g => g.id === 'boundaries-game');
      }
      
      if (moodGame && !recommendations.find(r => r.id === moodGame!.id)) {
        recommendations.push({
          id: moodGame.id,
          title: moodGame.title,
          icon: moodGame.icon,
          path: moodGame.path,
          reason: `Perfect for how you're feeling`,
          category: 'mood'
        });
      }
    }

    // Priority 3: Growth Area (weakest skill)
    if (userData.quizCompleted && availableGames.length > 0) {
      const scores = [
        { domain: 'sensory', score: userData.sensoryScore },
        { domain: 'cognitive', score: userData.cognitiveScore },
        { domain: 'executive', score: userData.executiveScore },
        { domain: 'social', score: userData.socialScore },
      ];
      const weakestDomain = scores.reduce((min, curr) => curr.score < min.score ? curr : min);
      
      const growthGame = availableGames.find(g => 
        g.domain === weakestDomain.domain && 
        g.id !== 'challenge-quest' &&
        !recommendations.find(r => r.id === g.id)
      );
      
      if (growthGame) {
        recommendations.push({
          id: growthGame.id,
          title: growthGame.title,
          icon: growthGame.icon,
          path: growthGame.path,
          reason: `Build ${weakestDomain.domain} skills`,
          category: 'growth'
        });
      }
    }

    // Priority 4: Strength-Based (what they're good at - confidence building)
    if (userData.quizCompleted && availableGames.length > 0) {
      const scores = [
        { domain: 'sensory', score: userData.sensoryScore },
        { domain: 'cognitive', score: userData.cognitiveScore },
        { domain: 'executive', score: userData.executiveScore },
        { domain: 'social', score: userData.socialScore },
      ];
      const strongestDomain = scores.reduce((max, curr) => curr.score > max.score ? curr : max);
      
      const strengthGame = availableGames.find(g => 
        g.domain === strongestDomain.domain && 
        g.id !== 'challenge-quest' &&
        !recommendations.find(r => r.id === g.id)
      );
      
      if (strengthGame) {
        recommendations.push({
          id: strengthGame.id,
          title: strengthGame.title,
          icon: strengthGame.icon,
          path: strengthGame.path,
          reason: `You're great at ${strongestDomain.domain}!`,
          category: 'strength'
        });
      }
    }

    // Priority 5: Something New (if still need more recommendations)
    if (recommendations.length < 3 && availableGames.length > 0) {
      const remainingGames = availableGames.filter(g => 
        !recommendations.find(r => r.id === g.id)
      );
      
      if (remainingGames.length > 0) {
        // Prioritize social skills games as they're core to the platform
        const newGame = remainingGames.find(g => g.domain === 'social') || 
                       remainingGames[Math.floor(Math.random() * remainingGames.length)];
        
        recommendations.push({
          id: newGame.id,
          title: newGame.title,
          icon: newGame.icon,
          path: newGame.path,
          reason: 'Try something new!',
          category: 'new'
        });
      }
    }

    return recommendations.slice(0, 3); // Return top 3
  };

  const recommendations = getRecommendations();

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case 'growth':
        return {
          gradient: 'from-blue-50 to-cyan-50',
          border: 'border-blue-300',
          icon: <Target className="w-5 h-5 text-blue-500" />,
          badge: 'bg-blue-100 text-blue-700'
        };
      case 'strength':
        return {
          gradient: 'from-green-50 to-emerald-50',
          border: 'border-green-300',
          icon: <TrendingUp className="w-5 h-5 text-green-500" />,
          badge: 'bg-green-100 text-green-700'
        };
      case 'mood':
        return {
          gradient: 'from-pink-50 to-purple-50',
          border: 'border-pink-300',
          icon: <Heart className="w-5 h-5 text-pink-500" />,
          badge: 'bg-pink-100 text-pink-700'
        };
      default:
        return {
          gradient: 'from-yellow-50 to-orange-50',
          border: 'border-yellow-300',
          icon: <Sparkles className="w-5 h-5 text-yellow-500" />,
          badge: 'bg-yellow-100 text-yellow-700'
        };
    }
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-6 h-6 text-purple-500" />
        <h3 className="text-gray-800 font-semibold">Recommended For You</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => {
          const style = getCategoryStyle(rec.category);
          return (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 bg-gradient-to-br ${style.gradient} border-4 ${style.border} hover:scale-105 transition-transform cursor-pointer`}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-4xl">{rec.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-800 mb-1">{rec.title}</h4>
                    <div className="flex items-center gap-2">
                      {style.icon}
                      <p className={`text-xs font-semibold px-2 py-1 rounded-full ${style.badge}`}>
                        {rec.reason}
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => navigate(rec.path)}
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm"
                >
                  Play Now
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}