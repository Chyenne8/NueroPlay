import { useState } from 'react';
import { motion } from "framer-motion";
import { Square, Circle, Triangle, Star, Heart, Hexagon } from 'lucide-react';
import { GameData } from '../../types/game';

interface SymbolRecognitionProps {
  onComplete: (data: Partial<GameData>) => void;
}

const symbols = [
  { id: 'square', Icon: Square, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 'circle', Icon: Circle, color: 'text-green-600', bg: 'bg-green-100' },
  { id: 'triangle', Icon: Triangle, color: 'text-purple-600', bg: 'bg-purple-100' },
  { id: 'star', Icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-100' },
  { id: 'heart', Icon: Heart, color: 'text-pink-600', bg: 'bg-pink-100' },
  { id: 'hexagon', Icon: Hexagon, color: 'text-orange-600', bg: 'bg-orange-100' },
];

export default function SymbolRecognition({ onComplete }: SymbolRecognitionProps) {
  const targetSymbol = symbols[2]; // Triangle
  const correctAnswer = 'triangle';

  const handleChoice = (symbolId: string) => {
    const isCorrect = symbolId === correctAnswer;
    onComplete({
      cognitive: { symbolRecognition: isCorrect ? 1 : 0 },
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Symbol Recognition</h2>
        <p className="text-gray-700 mb-6">Find the matching symbol!</p>
        
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className={`${targetSymbol.bg} rounded-2xl p-8 inline-block border-4 border-purple-400`}
        >
          <targetSymbol.Icon className={`w-20 h-20 ${targetSymbol.color}`} />
        </motion.div>
      </div>

      <p className="text-center text-gray-600 mb-6">Tap the same symbol below:</p>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 max-w-3xl mx-auto">
        {symbols.map(({ id, Icon, color, bg }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleChoice(id)}
            className={`${bg} rounded-2xl p-6 border-4 border-transparent hover:border-purple-400 transition-colors`}
          >
            <Icon className={`w-12 h-12 ${color} mx-auto`} />
          </motion.button>
        ))}
      </div>
    </div>
  );
}