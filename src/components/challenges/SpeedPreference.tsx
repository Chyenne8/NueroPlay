import { motion } from 'motion/react';
import { Rabbit, Turtle } from 'lucide-react';
import { GameData } from '../../types/game';

interface SpeedPreferenceProps {
  onComplete: (data: Partial<GameData>) => void;
}

export default function SpeedPreference({ onComplete }: SpeedPreferenceProps) {
  const handleChoice = (choice: 'fast' | 'slow') => {
    onComplete({
      sensory: { speedPreference: choice },
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Speed Preference</h2>
        <p className="text-gray-700">Which one feels better to watch?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice('fast')}
          className="bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl p-8 border-4 border-transparent hover:border-orange-400 transition-colors"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full h-24 bg-orange-50 rounded-xl overflow-hidden">
              <motion.div
                animate={{ x: [0, 200, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                className="absolute top-1/2 -translate-y-1/2 bg-orange-400 rounded-full p-3"
              >
                <Rabbit className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <span className="text-orange-700">Fast & Bouncy</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice('slow')}
          className="bg-gradient-to-br from-green-100 to-teal-100 rounded-2xl p-8 border-4 border-transparent hover:border-teal-400 transition-colors"
        >
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-full h-24 bg-teal-50 rounded-xl overflow-hidden">
              <motion.div
                animate={{ x: [0, 200, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-1/2 -translate-y-1/2 bg-teal-400 rounded-full p-3"
              >
                <Turtle className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <span className="text-teal-700">Slow & Smooth</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}