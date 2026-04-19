import { useState } from 'react';
import { motion } from 'motion/react';
import { Sprout, Droplet, Flower2, Sparkles } from 'lucide-react';
import { GameData } from '../../types/game';

interface SequencingTaskProps {
  onComplete: (data: Partial<GameData>) => void;
}

const steps = [
  { id: 1, Icon: Sprout, label: 'Plant Seed', color: 'bg-green-100', iconColor: 'text-green-600' },
  { id: 2, Icon: Droplet, label: 'Water It', color: 'bg-blue-100', iconColor: 'text-blue-600' },
  { id: 3, Icon: Sparkles, label: 'Give Sunlight', color: 'bg-yellow-100', iconColor: 'text-yellow-600' },
  { id: 4, Icon: Flower2, label: 'Flower Grows', color: 'bg-pink-100', iconColor: 'text-pink-600' },
];

export default function SequencingTask({ onComplete }: SequencingTaskProps) {
  const [shuffledSteps] = useState(() => {
    return [...steps].sort(() => Math.random() - 0.5);
  });
  const [selectedOrder, setSelectedOrder] = useState<number[]>([]);

  const handleStepClick = (stepId: number) => {
    if (selectedOrder.includes(stepId)) {
      setSelectedOrder(selectedOrder.filter((id) => id !== stepId));
    } else {
      const newOrder = [...selectedOrder, stepId];
      setSelectedOrder(newOrder);

      if (newOrder.length === 4) {
        // Check if correct order
        const isCorrect = newOrder.every((id, index) => id === index + 1);
        setTimeout(() => {
          onComplete({
            cognitive: { sequencing: isCorrect ? 1 : 0 },
          });
        }, 500);
      }
    }
  };

  const getStepNumber = (stepId: number) => {
    const index = selectedOrder.indexOf(stepId);
    return index >= 0 ? index + 1 : null;
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div className="text-center mb-8">
        <h2 className="text-purple-600 mb-3">Sequencing Task</h2>
        <p className="text-gray-700">Put the steps in the right order!</p>
        <p className="text-gray-600">Tap each picture from first to last</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
        {shuffledSteps.map(({ id, Icon, label, color, iconColor }) => {
          const stepNumber = getStepNumber(id);
          const isSelected = stepNumber !== null;

          return (
            <motion.button
              key={id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleStepClick(id)}
              className={`${color} rounded-2xl p-6 border-4 transition-colors relative ${
                isSelected ? 'border-purple-500' : 'border-transparent hover:border-purple-300'
              }`}
            >
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -right-3 bg-purple-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg"
                >
                  {stepNumber}
                </motion.div>
              )}
              <Icon className={`w-16 h-16 ${iconColor} mx-auto mb-2`} />
              <p className={`${iconColor}`}>{label}</p>
            </motion.button>
          );
        })}
      </div>

      {selectedOrder.length > 0 && selectedOrder.length < 4 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-6 text-purple-600"
        >
          Keep going! {4 - selectedOrder.length} more to go
        </motion.p>
      )}
    </div>
  );
}