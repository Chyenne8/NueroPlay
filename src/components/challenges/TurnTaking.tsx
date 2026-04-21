import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import { GameData } from '../../types/game';

interface TurnTakingProps {
  onComplete: (data: Partial<GameData>) => void;
}

export default function TurnTaking({ onComplete }: TurnTakingProps) {
  const [turn, setTurn] = useState<'ai' | 'player' | 'waiting'>('ai');
  const [pieces, setPieces] = useState<{ placed: boolean; by: 'ai' | 'player' }[]>([
    { placed: false, by: 'ai' },
    { placed: false, by: 'player' },
    { placed: false, by: 'ai' },
    { placed: false, by: 'player' },
  ]);
  const [currentPiece, setCurrentPiece] = useState(0);
  const [successfulTurns, setSuccessfulTurns] = useState(0);

  useEffect(() => {
    if (turn === 'ai' && currentPiece < pieces.length) {
      const timer = setTimeout(() => {
        setPieces((prev) => {
          const newPieces = [...prev];
          newPieces[currentPiece] = { placed: true, by: 'ai' };
          return newPieces;
        });
        setTurn('waiting');
        
        setTimeout(() => {
          setTurn('player');
        }, 500);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [turn, currentPiece, pieces.length]);

  const handlePlayerTurn = () => {
    if (turn !== 'player') {
      // Clicked at wrong time
      setSuccessfulTurns((s) => s);
      return;
    }

    setPieces((prev) => {
      const newPieces = [...prev];
      newPieces[currentPiece] = { placed: true, by: 'player' };
      return newPieces;
    });
    
    setSuccessfulTurns((s) => s + 1);
    setCurrentPiece((p) => p + 1);

    if (currentPiece + 1 < pieces.length) {
      setTurn('waiting');
      setTimeout(() => {
        setTurn('ai');
      }, 500);
    } else {
      // Game complete
      setTimeout(() => {
        const score = successfulTurns >= 1 ? 1 : 0;
        onComplete({
          socialInteraction: { turnTaking: score },
        });
      }, 1000);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Turn-Taking Game</h2>
        <AnimatePresence mode="wait">
          <motion.p
            key={turn}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="text-gray-700"
          >
            {turn === 'ai' ? "Watch! It's my turn!" : turn === 'player' ? "Your turn! Tap the button!" : "Get ready..."}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <div className="bg-purple-50 rounded-2xl p-6 min-h-[200px]">
          <div className="grid grid-cols-4 gap-3">
            {pieces.map((piece, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0, rotate: -180 }}
                animate={
                  piece.placed
                    ? { scale: 1, rotate: 0 }
                    : { scale: 0.5, rotate: 0 }
                }
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className={`aspect-square rounded-xl ${
                  piece.placed
                    ? piece.by === 'ai'
                      ? 'bg-blue-400'
                      : 'bg-pink-400'
                    : 'bg-gray-200 border-2 border-dashed border-gray-400'
                }`}
              >
                {piece.placed && (
                  <div className="flex items-center justify-center h-full">
                    {piece.by === 'ai' ? (
                      <Bot className="w-8 h-8 text-white" />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="text-center">
        <motion.button
          whileHover={{ scale: turn === 'player' ? 1.05 : 1 }}
          whileTap={{ scale: turn === 'player' ? 0.95 : 1 }}
          onClick={handlePlayerTurn}
          disabled={turn !== 'player'}
          className={`px-8 py-4 rounded-full transition-all ${
            turn === 'player'
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg cursor-pointer'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {turn === 'player' ? 'Place Your Piece!' : turn === 'ai' ? "AI's Turn..." : 'Wait...'}
        </motion.button>
      </div>
    </div>
  );
}