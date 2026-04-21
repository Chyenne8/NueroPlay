import { useState } from 'react';
import { motion } from "framer-motion";
import { Music, Volume2, VolumeX } from 'lucide-react';
import { GameData } from '../../types/game';

interface SoundSelectorProps {
  onComplete: (data: Partial<GameData>) => void;
}

export default function SoundSelector({ onComplete }: SoundSelectorProps) {
  const [playing, setPlaying] = useState<string | null>(null);

  const handleChoice = (choice: 'gentle' | 'upbeat' | 'silence') => {
    onComplete({
      sensory: { soundPreference: choice },
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Sound Selector</h2>
        <p className="text-gray-700">Which sound do you want in your adventure?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice('gentle')}
          className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 border-4 border-transparent hover:border-blue-400 transition-colors"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="bg-blue-300 rounded-full p-6"
            >
              <Music className="w-12 h-12 text-blue-600" />
            </motion.div>
            <span className="text-blue-700">Gentle Music</span>
            <p className="text-blue-600">Calm & Peaceful</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice('upbeat')}
          className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-8 border-4 border-transparent hover:border-orange-400 transition-colors"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="bg-orange-300 rounded-full p-6"
            >
              <Volume2 className="w-12 h-12 text-orange-600" />
            </motion.div>
            <span className="text-orange-700">Upbeat Music</span>
            <p className="text-orange-600">Fun & Energetic</p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice('silence')}
          className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-8 border-4 border-transparent hover:border-gray-400 transition-colors"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="bg-gray-300 rounded-full p-6">
              <VolumeX className="w-12 h-12 text-gray-600" />
            </div>
            <span className="text-gray-700">Silence</span>
            <p className="text-gray-600">Quiet & Focused</p>
          </div>
        </motion.button>
      </div>
    </div>
  );
}