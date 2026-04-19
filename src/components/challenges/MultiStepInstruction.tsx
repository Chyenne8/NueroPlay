import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, Circle } from 'lucide-react';
import { GameData } from '../../types/game';

interface MultiStepInstructionProps {
  onComplete: (data: Partial<GameData>) => void;
}

export default function MultiStepInstruction({ onComplete }: MultiStepInstructionProps) {
  const [step, setStep] = useState(0);
  const [correctSequence, setCorrectSequence] = useState(true);

  const handleStarClick = () => {
    if (step === 0) {
      setStep(1);
    } else {
      setCorrectSequence(false);
    }
  };

  const handleCircleClick = () => {
    if (step === 1) {
      // Correct sequence completed
      onComplete({
        executiveFunction: { multiStep: 1 },
      });
    } else {
      // Wrong order
      onComplete({
        executiveFunction: { multiStep: 0 },
      });
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Multi-Step Challenge</h2>
        <motion.p
          key={step}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gray-700"
        >
          {step === 0 ? (
            <>
              First tap the <span className="text-yellow-600">STAR</span>, then tap the <span className="text-blue-600">CIRCLE</span>
            </>
          ) : (
            <>
              Great! Now tap the <span className="text-blue-600">CIRCLE</span>
            </>
          )}
        </motion.p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStarClick}
          className={`bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl p-12 border-4 transition-all ${
            step === 0 
              ? 'border-yellow-400 shadow-lg shadow-yellow-200' 
              : 'border-transparent opacity-75'
          }`}
        >
          <Star className="w-24 h-24 text-yellow-500 mx-auto" />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCircleClick}
          className={`bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl p-12 border-4 transition-all ${
            step === 1 
              ? 'border-blue-400 shadow-lg shadow-blue-200' 
              : 'border-transparent'
          }`}
        >
          <Circle className="w-24 h-24 text-blue-500 mx-auto" />
        </motion.button>
      </div>

      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mt-6"
        >
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
            ✓ Step 1 Complete!
          </div>
        </motion.div>
      )}
    </div>
  );
}