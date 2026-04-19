import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Square } from 'lucide-react';
import { GameData } from '../../types/game';

interface StickToItProps {
  onComplete: (data: Partial<GameData>) => void;
}

export default function StickToIt({ onComplete }: StickToItProps) {
  const [blocks, setBlocks] = useState<number[]>([]);
  const totalBlocks = 10;

  const handleAddBlock = () => {
    if (blocks.length < totalBlocks) {
      setBlocks([...blocks, blocks.length + 1]);
      
      if (blocks.length + 1 === totalBlocks) {
        // Task completed!
        setTimeout(() => {
          onComplete({
            executiveFunction: { persistence: 1 },
          });
        }, 500);
      }
    }
  };

  const handleSkip = () => {
    onComplete({
      executiveFunction: { persistence: 0 },
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Stick-to-It Challenge</h2>
        <p className="text-gray-700">Help stack all 10 blocks!</p>
        <p className="text-purple-600">
          {blocks.length} / {totalBlocks} blocks stacked
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <div className="relative h-96 flex items-end justify-center">
          <div className="flex flex-col-reverse gap-1">
            <AnimatePresence>
              {blocks.map((block, index) => (
                <motion.div
                  key={block}
                  initial={{ y: -100, opacity: 0, rotate: -10 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={`h-10 rounded-lg ${
                    index % 4 === 0
                      ? 'bg-blue-400'
                      : index % 4 === 1
                      ? 'bg-green-400'
                      : index % 4 === 2
                      ? 'bg-yellow-400'
                      : 'bg-pink-400'
                  }`}
                  style={{ width: `${150 + index * 10}px` }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {blocks.length < totalBlocks && (
        <div className="flex gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddBlock}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full shadow-lg"
          >
            <div className="flex items-center gap-2">
              <Square className="w-5 h-5" />
              Add Block
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSkip}
            className="bg-gray-300 text-gray-700 px-8 py-4 rounded-full"
          >
            Skip
          </motion.button>
        </div>
      )}

      {blocks.length === totalBlocks && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-6 py-3 rounded-full">
            🎉 You did it! Great job sticking with it!
          </div>
        </motion.div>
      )}
    </div>
  );
}