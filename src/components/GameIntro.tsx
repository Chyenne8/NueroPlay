import { motion } from 'motion/react';
import { Sparkles, Star, Heart } from 'lucide-react';

interface GameIntroProps {
  onStart: () => void;
}

export function GameIntro({ onStart }: GameIntroProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          className="inline-block mb-6"
        >
          <Sparkles className="w-20 h-20 text-purple-500" />
        </motion.div>

        <h1 className="text-purple-600 mb-4">
          Welcome to Your Adventure!
        </h1>

        <p className="text-gray-700 mb-8">
          Get ready for a fun quest! We'll play games together to learn what you like best.
          There are no wrong answers—just have fun!
        </p>

        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
            className="bg-yellow-100 rounded-full p-4"
          >
            <Star className="w-8 h-8 text-yellow-500" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
            className="bg-pink-100 rounded-full p-4"
          >
            <Heart className="w-8 h-8 text-pink-500" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
            className="bg-blue-100 rounded-full p-4"
          >
            <Sparkles className="w-8 h-8 text-blue-500" />
          </motion.div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          Start Adventure!
        </motion.button>
      </motion.div>
    </div>
  );
}
