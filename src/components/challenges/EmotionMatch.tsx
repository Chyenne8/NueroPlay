import { useState } from 'react';
import { motion } from "framer-motion";
import { Smile, Frown, Sparkles } from 'lucide-react';
import { GameData } from '../../types/game';

interface EmotionMatchProps {
  onComplete: (data: Partial<GameData>) => void;
}

export default function EmotionMatch({ onComplete }: EmotionMatchProps) {
  const correctAnswer = 'happy';

  const handleChoice = (emotion: string) => {
    const isCorrect = emotion === correctAnswer;
    onComplete({
      socialInteraction: { emotionRecognition: isCorrect ? 1 : 0 },
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Emotion Match</h2>
        <p className="text-gray-700 mb-6">Which face is happy?</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice('happy')}
          className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-12 border-4 border-transparent hover:border-yellow-400 transition-colors"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Smile className="w-24 h-24 text-yellow-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-yellow-700">Happy</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice('sad')}
          className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-12 border-4 border-transparent hover:border-blue-400 transition-colors"
        >
          <Frown className="w-24 h-24 text-blue-600 mx-auto mb-4" />
          <p className="text-blue-700">Sad</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice('surprised')}
          className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl p-12 border-4 border-transparent hover:border-purple-400 transition-colors"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            <Sparkles className="w-24 h-24 text-purple-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-purple-700">Surprised</p>
        </motion.button>
      </div>
    </div>
  );
}