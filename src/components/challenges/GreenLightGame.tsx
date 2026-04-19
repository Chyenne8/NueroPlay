import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users } from 'lucide-react';
import { GameData } from '../../types/game';

interface GreenLightGameProps {
  onComplete: (data: Partial<GameData>) => void;
}

export default function GreenLightGame({ onComplete }: GreenLightGameProps) {
  const [light, setLight] = useState<'red' | 'green'>('red');
  const [round, setRound] = useState(0);
  const [correctClicks, setCorrectClicks] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;

    if (round >= 5) {
      // Game complete
      const score = correctClicks >= 4 ? 1 : 0;
      onComplete({
        executiveFunction: { impulseControl: score },
      });
      return;
    }

    const delay = Math.random() * 2000 + 1000; // 1-3 seconds
    const timer = setTimeout(() => {
      setLight(Math.random() > 0.5 ? 'green' : 'red');
      setRound((r) => r + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [round, started, correctClicks, onComplete]);

  const handleClick = () => {
    if (!started) {
      setStarted(true);
      setLight('red');
      setRound(1);
      return;
    }

    if (light === 'green') {
      setCorrectClicks((c) => c + 1);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Green Light Game!</h2>
        <p className="text-gray-700">
          {!started 
            ? 'Tap ONLY when the light turns GREEN. Wait when it\'s RED!'
            : light === 'green'
            ? 'TAP NOW!'
            : 'Wait...'}
        </p>
      </div>

      <div className="max-w-md mx-auto">
        {started && (
          <div className="mb-8">
            <div className="flex justify-center gap-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full ${
                    i < round ? 'bg-purple-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: started ? 1.02 : 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleClick}
          className="w-full rounded-3xl p-12 border-4 border-transparent transition-all relative overflow-hidden"
          style={{
            backgroundColor: started ? (light === 'green' ? '#22c55e' : '#ef4444') : '#a855f7',
          }}
        >
          <motion.div
            animate={
              started && light === 'green'
                ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }
                : { scale: 1, rotate: 0 }
            }
            transition={{ duration: 0.5, repeat: started && light === 'green' ? Infinity : 0 }}
            className="text-white"
          >
            <Users className="w-24 h-24 mx-auto mb-4" />
            <p className="text-white">
              {!started ? 'Start Game!' : light === 'green' ? 'TAP ME!' : 'WAIT...'}
            </p>
          </motion.div>

          {started && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: light === 'green' ? [0, 1.5, 0] : 0 }}
              transition={{ duration: 1, repeat: light === 'green' ? Infinity : 0 }}
              className="absolute inset-0 border-8 border-white rounded-3xl opacity-50"
            />
          )}
        </motion.button>
      </div>
    </div>
  );
}