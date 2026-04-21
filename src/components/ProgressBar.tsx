import { motion } from "framer-motion";
import { Star } from 'lucide-react';

interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="mb-8 bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <span className="text-purple-600">Your Progress</span>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
          <span className="text-gray-700">
            {current} of {total}
          </span>
        </div>
      </div>
      
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
        />
      </div>
    </div>
  );
}
