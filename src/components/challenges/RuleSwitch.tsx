import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Square, Circle } from 'lucide-react';
import { GameData } from '../../types/game';

interface RuleSwitchProps {
  onComplete: (data: Partial<GameData>) => void;
}

const shapes = [
  { id: 1, type: 'red-square', Shape: Square, color: 'text-red-600', bg: 'bg-red-100' },
  { id: 2, type: 'blue-circle', Shape: Circle, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 3, type: 'red-circle', Shape: Circle, color: 'text-red-600', bg: 'bg-red-100' },
  { id: 4, type: 'blue-square', Shape: Square, color: 'text-blue-600', bg: 'bg-blue-100' },
];

export default function RuleSwitch({ onComplete }: RuleSwitchProps) {
  const [phase, setPhase] = useState<'instruction' | 'round1' | 'switch' | 'round2'>('instruction');
  const [correctClicks, setCorrectClicks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);

  useEffect(() => {
    if (phase === 'instruction') {
      const timer = setTimeout(() => setPhase('round1'), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleShapeClick = (shapeType: string) => {
    const newTotal = totalClicks + 1;
    setTotalClicks(newTotal);

    let isCorrect = false;
    if (phase === 'round1') {
      isCorrect = shapeType.includes('red');
      if (isCorrect) setCorrectClicks(correctClicks + 1);
      
      if (newTotal === 3) {
        setTimeout(() => setPhase('switch'), 500);
      }
    } else if (phase === 'round2') {
      isCorrect = shapeType.includes('blue');
      if (isCorrect) setCorrectClicks(correctClicks + 1);
      
      if (newTotal === 6) {
        // Calculate flexibility score
        const score = correctClicks >= 4 ? 1 : 0;
        setTimeout(() => {
          onComplete({
            executiveFunction: { flexibility: score },
          });
        }, 500);
      }
    }
  };

  useEffect(() => {
    if (phase === 'switch') {
      const timer = setTimeout(() => setPhase('round2'), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Rule Switch Challenge</h2>
        
        <AnimatePresence mode="wait">
          {phase === 'instruction' && (
            <motion.p
              key="instruction"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-gray-700"
            >
              Tap ONLY the RED shapes!
            </motion.p>
          )}
          
          {phase === 'round1' && (
            <motion.p
              key="round1"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="text-red-600"
            >
              Tap the RED shapes!
            </motion.p>
          )}
          
          {phase === 'switch' && (
            <motion.p
              key="switch"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-blue-600"
            >
              NEW RULE: Now tap ONLY the BLUE shapes!
            </motion.p>
          )}
          
          {phase === 'round2' && (
            <motion.p
              key="round2"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-blue-600"
            >
              Tap the BLUE shapes!
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {(phase === 'round1' || phase === 'round2') && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {shapes.map(({ id, type, Shape, color, bg }) => (
            <motion.button
              key={`${phase}-${id}`}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleShapeClick(type)}
              className={`${bg} rounded-2xl p-8 border-4 border-transparent hover:border-purple-400 transition-colors`}
            >
              <Shape className={`w-16 h-16 ${color} mx-auto`} />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}