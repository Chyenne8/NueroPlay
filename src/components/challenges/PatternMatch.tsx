import { useState } from 'react';
import { motion } from "framer-motion";
import { Triangle, Circle } from 'lucide-react';
import { GameData } from '../../types/game';

interface PatternMatchProps {
  onComplete: (data: Partial<GameData>) => void;
}

export default function PatternMatch({ onComplete }: PatternMatchProps) {
  const correctAnswer = 'circle';

  const handleChoice = (choice: 'triangle' | 'circle') => {
    const isCorrect = choice === correctAnswer;
    onComplete({
      cognitive: { patternRecognition: isCorrect ? 1 : 0 },
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Pattern Match</h2>
        <p className="text-gray-700">What comes next in the pattern?</p>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-purple-100 rounded-2xl p-6"
          >
            <Triangle className="w-16 h-16 text-purple-500 fill-purple-500" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-100 rounded-2xl p-6"
          >
            <Circle className="w-16 h-16 text-blue-500 fill-blue-500" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-purple-100 rounded-2xl p-6"
          >
            <Triangle className="w-16 h-16 text-purple-500 fill-purple-500" />
          </motion.div>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-blue-100 rounded-2xl p-6"
          >
            <Circle className="w-16 h-16 text-blue-500 fill-blue-500" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="bg-gray-200 rounded-2xl p-6 border-4 border-dashed border-gray-400"
          >
            <div className="w-16 h-16 flex items-center justify-center text-gray-400">?</div>
          </motion.div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-lg mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice('triangle')}
          className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-8 border-4 border-transparent hover:border-purple-400 transition-colors"
        >
          <Triangle className="w-20 h-20 text-purple-500 fill-purple-500 mx-auto" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice('circle')}
          className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-8 border-4 border-transparent hover:border-blue-400 transition-colors"
        >
          <Circle className="w-20 h-20 text-blue-500 fill-blue-500 mx-auto" />
        </motion.button>
      </div>
    </div>
  );
}