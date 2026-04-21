import { motion } from "framer-motion";
import { GameData } from '../../types/game';

interface ColorComfortProps {
  onComplete: (data: Partial<GameData>) => void;
}

export default function ColorComfort({ onComplete }: ColorComfortProps) {
  const handleChoice = (choice: 'bright' | 'soft') => {
    onComplete({
      sensory: { colorPreference: choice },
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Color Comfort Choice</h2>
        <p className="text-gray-700">Which world looks better to you?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice('bright')}
          className="group relative overflow-hidden rounded-2xl p-8 h-64 border-4 border-transparent hover:border-purple-400 transition-colors"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 via-pink-400 to-green-400" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 bg-yellow-400 rounded-full shadow-lg" />
              <div className="w-12 h-12 bg-pink-500 rounded-full shadow-lg" />
              <div className="w-12 h-12 bg-green-400 rounded-full shadow-lg" />
            </div>
            <span className="text-white drop-shadow-lg">Bright Colors</span>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice('soft')}
          className="group relative overflow-hidden rounded-2xl p-8 h-64 border-4 border-transparent hover:border-purple-400 transition-colors"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className="flex gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-200 rounded-full shadow-lg" />
              <div className="w-12 h-12 bg-purple-200 rounded-full shadow-lg" />
              <div className="w-12 h-12 bg-pink-200 rounded-full shadow-lg" />
            </div>
            <span className="text-purple-600">Soft Colors</span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}