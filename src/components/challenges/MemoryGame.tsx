import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Heart, Moon, Sun } from 'lucide-react';
import { GameData } from '../../types/game';

interface MemoryGameProps {
  onComplete: (data: Partial<GameData>) => void;
}

const icons = [
  { id: 'star', Icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { id: 'heart', Icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100' },
  { id: 'moon', Icon: Moon, color: 'text-purple-500', bg: 'bg-purple-100' },
  { id: 'sun', Icon: Sun, color: 'text-orange-500', bg: 'bg-orange-100' },
];

export default function MemoryGame({ onComplete }: MemoryGameProps) {
  const [showIcons, setShowIcons] = useState(true);
  const [selectedIcons] = useState(() => {
    // Randomly select 3 icons
    const shuffled = [...icons].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  });
  const [hiddenIcon] = useState(() => {
    // Pick one of the selected icons as the answer
    return selectedIcons[Math.floor(Math.random() * selectedIcons.length)];
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIcons(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleChoice = (iconId: string) => {
    const isCorrect = iconId === hiddenIcon.id;
    onComplete({
      cognitive: { visualMemory: isCorrect ? 1 : 0 },
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Memory Mini-Game</h2>
        <p className="text-gray-700">
          {showIcons ? 'Remember these!' : 'Which one was here before?'}
        </p>
      </div>

      <div className="mb-8">
        <AnimatePresence mode="wait">
          {showIcons ? (
            <motion.div
              key="icons"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center gap-6 flex-wrap"
            >
              {selectedIcons.map(({ id, Icon, color, bg }) => (
                <motion.div
                  key={id}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: Math.random() }}
                  className={`${bg} rounded-2xl p-8`}
                >
                  <Icon className={`w-16 h-16 ${color}`} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="countdown"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                {icons.map(({ id, Icon, color, bg }) => (
                  <motion.button
                    key={id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleChoice(id)}
                    className={`${bg} rounded-2xl p-8 border-4 border-transparent hover:border-purple-400 transition-colors`}
                  >
                    <Icon className={`w-12 h-12 ${color} mx-auto`} />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {showIcons && (
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-center text-purple-600"
        >
          Watch carefully...
        </motion.div>
      )}
    </div>
  );
}