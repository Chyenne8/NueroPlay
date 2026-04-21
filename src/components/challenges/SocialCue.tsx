import { useState } from 'react';
import { motion } from "framer-motion";
import { User, HelpCircle, Smile } from 'lucide-react';
import { GameData } from '../../types/game';

interface SocialCueProps {
  onComplete: (data: Partial<GameData>) => void;
}

export default function SocialCue({ onComplete }: SocialCueProps) {
  const correctAnswer = 'confused';

  const handleChoice = (choice: string) => {
    const isCorrect = choice === correctAnswer;
    onComplete({
      socialInteraction: { socialCues: isCorrect ? 1 : 0 },
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Social Cue Challenge</h2>
        <p className="text-gray-700 mb-6">Who looks like they need help?</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice('confused')}
          className="bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl p-8 border-4 border-transparent hover:border-orange-400 transition-colors"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="bg-orange-300 rounded-full p-8">
                <User className="w-20 h-20 text-orange-600" />
              </div>
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], y: [0, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-2 -right-2 bg-orange-400 rounded-full p-2"
              >
                <HelpCircle className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <div className="text-center">
              <p className="text-orange-700">Person A</p>
              <p className="text-orange-600">Looks confused</p>
            </div>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChoice('happy')}
          className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl p-8 border-4 border-transparent hover:border-green-400 transition-colors"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="bg-green-300 rounded-full p-8">
                <User className="w-20 h-20 text-green-600" />
              </div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute -top-2 -right-2 bg-green-400 rounded-full p-2"
              >
                <Smile className="w-8 h-8 text-white" />
              </motion.div>
            </div>
            <div className="text-center">
              <p className="text-green-700">Person B</p>
              <p className="text-green-600">Looks content</p>
            </div>
          </div>
        </motion.button>
      </div>
    </div>
  );
}