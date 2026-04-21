import { motion } from "framer-motion";
import { Sparkles, Palette, Brain, Zap, Users, Star, Home, RotateCcw } from 'lucide-react';
import { GameData } from '../types/game';
import { Button } from './ui/button';

interface ResultsProfileProps {
  gameData: GameData;
  onRestart: () => void;
  onRetake: () => void;
}

export function ResultsProfile({ gameData, onRestart, onRetake }: ResultsProfileProps) {
  const { sensory, cognitive, executiveFunction, socialInteraction } = gameData;

  // Calculate scores
  const cognitiveScore = Object.values(cognitive).reduce((a, b) => (a || 0) + (b || 0), 0) || 0;
  const executiveScore = Object.values(executiveFunction).reduce((a, b) => (a || 0) + (b || 0), 0) || 0;
  const socialScore = Object.values(socialInteraction).reduce((a, b) => (a || 0) + (b || 0), 0) || 0;

  const getColorTheme = () => {
    return sensory.colorPreference === 'bright'
      ? 'from-yellow-200 via-pink-200 to-purple-200'
      : 'from-blue-100 via-purple-100 to-pink-100';
  };

  const getSoundDescription = () => {
    switch (sensory.soundPreference) {
      case 'gentle':
        return 'You like calm, peaceful music';
      case 'upbeat':
        return 'You like fun, energetic music';
      case 'silence':
        return 'You like quiet, focused time';
      default:
        return '';
    }
  };

  const getSpeedDescription = () => {
    return sensory.speedPreference === 'fast'
      ? 'You like fast, bouncy animations'
      : 'You like smooth, gentle movements';
  };

  const getCognitiveStrengths = () => {
    const strengths = [];
    if (cognitive.patternRecognition) strengths.push('Pattern Recognition');
    if (cognitive.visualReasoning) strengths.push('Visual Puzzles');
    if (cognitive.visualMemory) strengths.push('Memory');
    if (cognitive.sequencing) strengths.push('Sequencing');
    if (cognitive.symbolRecognition) strengths.push('Symbol Matching');
    return strengths.length > 0 ? strengths : ['Problem Solving'];
  };

  const getExecutiveStrengths = () => {
    const strengths = [];
    if (executiveFunction.flexibility) strengths.push('Flexible Thinking');
    if (executiveFunction.multiStep) strengths.push('Following Steps');
    if (executiveFunction.impulseControl) strengths.push('Self-Control');
    if (executiveFunction.persistence) strengths.push('Stick-to-itiveness');
    return strengths.length > 0 ? strengths : ['Task Focus'];
  };

  const getSocialStrengths = () => {
    const strengths = [];
    if (socialInteraction.emotionRecognition) strengths.push('Understanding Feelings');
    if (socialInteraction.turnTaking) strengths.push('Taking Turns');
    if (socialInteraction.socialCues) strengths.push('Helping Others');
    return strengths.length > 0 ? strengths : ['Social Awareness'];
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getColorTheme()} p-4`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-6">
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 2, ease: 'linear', repeat: Infinity }}
              className="inline-block mb-4"
            >
              <Sparkles className="w-16 h-16 text-purple-500" />
            </motion.div>
            <h1 className="text-purple-600 mb-2">Your Adventure Profile!</h1>
            <p className="text-gray-700">Here's what we learned about you</p>
          </div>

          {/* Sensory Preferences */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 rounded-full p-3">
                <Palette className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-purple-600">Your Preferences</h3>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className={`${
                  sensory.colorPreference === 'bright'
                    ? 'bg-gradient-to-br from-yellow-100 to-pink-100'
                    : 'bg-gradient-to-br from-blue-50 to-purple-50'
                } rounded-xl p-4`}
              >
                <p className="text-purple-700">
                  {sensory.colorPreference === 'bright' ? '✨ Bright colors' : '🌸 Soft colors'}
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-blue-50 rounded-xl p-4"
              >
                <p className="text-blue-700">{getSoundDescription()}</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-green-50 rounded-xl p-4"
              >
                <p className="text-green-700">{getSpeedDescription()}</p>
              </motion.div>
            </div>
          </div>

          {/* Cognitive Strengths */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 rounded-full p-3">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-blue-600">Your Thinking Strengths</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {getCognitiveStrengths().map((strength, index) => (
                <motion.div
                  key={strength}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <Star className="w-4 h-4 fill-blue-500" />
                  {strength}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Executive Function */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 rounded-full p-3">
                <Zap className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-orange-600">Your Super Skills</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {getExecutiveStrengths().map((strength, index) => (
                <motion.div
                  key={strength}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <Star className="w-4 h-4 fill-orange-500" />
                  {strength}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Social Skills */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-pink-100 rounded-full p-3">
                <Users className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-pink-600">Your Social Superpowers</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {getSocialStrengths().map((strength, index) => (
                <motion.div
                  key={strength}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="bg-pink-100 text-pink-700 px-4 py-2 rounded-full flex items-center gap-2"
                >
                  <Star className="w-4 h-4 fill-pink-500" />
                  {strength}
                </motion.div>
              ))}
            </div>
          </div>

          {/* Game Recommendations */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6">
            <h3 className="text-purple-700 mb-3">🎮 Your Perfect Games</h3>
            <div className="space-y-2 text-purple-700">
              {cognitiveScore >= 3 && <p>✓ Puzzle adventures and brain teasers</p>}
              {executiveScore >= 2 && <p>✓ Strategy games with exciting challenges</p>}
              {socialScore >= 2 && <p>✓ Story games with characters and emotions</p>}
              {cognitiveScore < 3 && executiveScore < 2 && socialScore < 2 && (
                <>
                  <p>✓ Fun exploration games</p>
                  <p>✓ Creative activities</p>
                  <p>✓ Interactive stories</p>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={onRestart}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5 mr-2" />
              View Dashboard
            </Button>
            <Button
              onClick={onRetake}
              size="lg"
              variant="outline"
              className="border-2 border-purple-500 text-purple-600 px-8 py-4 rounded-full hover:bg-purple-50"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Retake Quest
            </Button>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center text-gray-600"
        >
          Your profile helps us make games just right for you! 🌟
        </motion.p>
      </motion.div>
    </div>
  );
}