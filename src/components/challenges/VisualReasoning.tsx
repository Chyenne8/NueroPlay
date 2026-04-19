import { useState } from 'react';
import { motion } from 'motion/react';
import { Square } from 'lucide-react';
import { GameData } from '../../types/game';

interface VisualReasoningProps {
  onComplete: (data: Partial<GameData>) => void;
}

export default function VisualReasoning({ onComplete }: VisualReasoningProps) {
  const handleChoice = (choice: number) => {
    const isCorrect = choice === 3; // Bottom right piece is correct
    onComplete({
      cognitive: { visualReasoning: isCorrect ? 1 : 0 },
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Visual Reasoning Puzzle</h2>
        <p className="text-gray-700">Which piece completes the picture?</p>
      </div>

      <div className="mb-8">
        <div className="max-w-xs mx-auto bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl p-4">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-yellow-300 h-24 rounded-lg" />
            <div className="bg-orange-300 h-24 rounded-lg" />
            <div className="bg-orange-300 h-24 rounded-lg" />
            <div className="bg-gray-300 h-24 rounded-lg border-4 border-dashed border-gray-500 flex items-center justify-center text-gray-500">
              ?
            </div>
          </div>
        </div>
      </div>

      <p className="text-center text-gray-600 mb-4">Choose the missing piece:</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice(0)}
          className="bg-gradient-to-br from-blue-200 to-blue-300 rounded-xl h-24 border-4 border-transparent hover:border-blue-400 transition-colors"
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice(1)}
          className="bg-gradient-to-br from-green-200 to-green-300 rounded-xl h-24 border-4 border-transparent hover:border-green-400 transition-colors"
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice(2)}
          className="bg-gradient-to-br from-purple-200 to-purple-300 rounded-xl h-24 border-4 border-transparent hover:border-purple-400 transition-colors"
        />
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleChoice(3)}
          className="bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-xl h-24 border-4 border-transparent hover:border-yellow-400 transition-colors"
        />
      </div>
    </div>
  );
}